import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", logger(console.log));

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

// Helper function to generate unique IDs
function generateId() {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}

// Helper function to add activity
async function addActivity(type: string, description: string, data?: any) {
  const activity = {
    id: generateId(),
    type,
    description,
    timestamp: new Date().toISOString(),
    data,
  };

  // Get existing activities
  let activities = (await kv.get("recent_activities")) || [];
  
  // Filter out activities older than 1 hour
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  activities = activities.filter((act: any) => {
    const activityTime = new Date(act.timestamp).getTime();
    return activityTime > oneHourAgo;
  });
  
  // Add new activity to the beginning
  activities.unshift(activity);
  
  // Keep maximum of 50 activities (but they'll be filtered by time anyway)
  if (activities.length > 50) {
    activities.length = 50;
  }

  await kv.set("recent_activities", activities);
  return activity;
}

// ============================================
// ELECTION SETTINGS ROUTES
// ============================================

// Get election settings
app.get("/make-server-14835f38/election-settings", async (c) => {
  try {
    const settings = await kv.get("election_settings");
    
    if (!settings) {
      // Return default settings
      return c.json({
        title: "Student Council Election 2025",
        startDate: "2025-04-20",
        endDate: "2025-04-25",
        requireIdVerification: true,
        showResultsDuringVoting: false,
        status: "Not Started",
      });
    }

    return c.json(settings);
  } catch (error: any) {
    console.error("Error fetching election settings:", error);
    return c.json({ error: "Failed to fetch election settings", details: error.message }, 500);
  }
});

// Update election settings
app.post("/make-server-14835f38/election-settings", async (c) => {
  try {
    const body = await c.req.json();
    const { title, startDate, endDate, requireIdVerification, showResultsDuringVoting } = body;

    const settings = {
      title,
      startDate,
      endDate,
      requireIdVerification: requireIdVerification ?? true,
      showResultsDuringVoting: showResultsDuringVoting ?? false,
      status: (await kv.get("election_settings"))?.status || "Not Started",
      updatedAt: new Date().toISOString(),
    };

    await kv.set("election_settings", settings);

    // Add activity
    await addActivity("election_settings_updated", "Election settings updated", { title });

    return c.json({ success: true, settings });
  } catch (error: any) {
    console.error("Error updating election settings:", error);
    return c.json({ error: "Failed to update election settings", details: error.message }, 500);
  }
});

// Update election status
app.post("/make-server-14835f38/election-status", async (c) => {
  try {
    const body = await c.req.json();
    const { status } = body;

    const settings = (await kv.get("election_settings")) || {};
    settings.status = status;
    settings.updatedAt = new Date().toISOString();

    await kv.set("election_settings", settings);

    // Add activity
    await addActivity("election_status_changed", `Election status changed to ${status}`);

    return c.json({ success: true, status });
  } catch (error: any) {
    console.error("Error updating election status:", error);
    return c.json({ error: "Failed to update election status", details: error.message }, 500);
  }
});

// ============================================
// VOTER REGISTRATION ROUTES
// ============================================

// Register a voter
app.post("/make-server-14835f38/register-voter", async (c) => {
  try {
    const body = await c.req.json();
    const { studentId, walletAddress, department, year } = body;

    // Check if voter already exists
    const existingVoters = await kv.getByPrefix("voter:");
    const alreadyRegistered = existingVoters.some(
      (v: any) => v.studentId === studentId || v.walletAddress === walletAddress
    );

    if (alreadyRegistered) {
      return c.json({ error: "Voter already registered" }, 400);
    }

    const voter = {
      id: generateId(),
      studentId,
      walletAddress,
      department,
      year,
      registrationDate: new Date().toISOString(),
      hasVoted: false,
    };

    await kv.set(`voter:${voter.id}`, voter);

    // Add activity
    await addActivity("voter_registered", "New voter registered", { studentId, department });

    return c.json({ success: true, voter });
  } catch (error: any) {
    console.error("Error registering voter:", error);
    return c.json({ error: "Failed to register voter", details: error.message }, 500);
  }
});

// Get all voters
app.get("/make-server-14835f38/voters", async (c) => {
  try {
    const voters = await kv.getByPrefix("voter:");
    
    // Sort by registration date (newest first)
    voters.sort((a: any, b: any) => 
      new Date(b.registrationDate).getTime() - new Date(a.registrationDate).getTime()
    );

    return c.json({ voters });
  } catch (error: any) {
    console.error("Error fetching voters:", error);
    return c.json({ error: "Failed to fetch voters", details: error.message }, 500);
  }
});

// Check if voter is registered
app.get("/make-server-14835f38/voter/:walletAddress", async (c) => {
  try {
    const walletAddress = c.req.param("walletAddress");
    const voters = await kv.getByPrefix("voter:");
    const voter = voters.find((v: any) => 
      v.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );

    if (!voter) {
      return c.json({ registered: false });
    }

    return c.json({ registered: true, voter });
  } catch (error: any) {
    console.error("Error checking voter registration:", error);
    return c.json({ error: "Failed to check voter registration", details: error.message }, 500);
  }
});

// Mark voter as voted
app.post("/make-server-14835f38/mark-voted", async (c) => {
  try {
    const body = await c.req.json();
    const { walletAddress } = body;

    const voters = await kv.getByPrefix("voter:");
    const voter = voters.find((v: any) => 
      v.walletAddress.toLowerCase() === walletAddress.toLowerCase()
    );

    if (!voter) {
      return c.json({ error: "Voter not found" }, 404);
    }

    voter.hasVoted = true;
    voter.votedAt = new Date().toISOString();
    await kv.set(`voter:${voter.id}`, voter);

    // Add activity
    await addActivity("vote_cast", "New vote cast", { studentId: voter.studentId });

    return c.json({ success: true });
  } catch (error: any) {
    console.error("Error marking voter as voted:", error);
    return c.json({ error: "Failed to mark voter as voted", details: error.message }, 500);
  }
});

// ============================================
// CANDIDATE ROUTES
// ============================================

// Add candidate
app.post("/make-server-14835f38/candidates", async (c) => {
  try {
    const body = await c.req.json();
    const { name, position, party, category } = body;

    const candidate = {
      id: generateId(),
      name,
      position,
      party,
      category: category || "sug",
      votes: 0,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`candidate:${candidate.id}`, candidate);

    // Add activity
    await addActivity("candidate_added", "New candidate added", { name, position });

    return c.json({ success: true, candidate });
  } catch (error: any) {
    console.error("Error adding candidate:", error);
    return c.json({ error: "Failed to add candidate", details: error.message }, 500);
  }
});

// Get all candidates
app.get("/make-server-14835f38/candidates", async (c) => {
  try {
    const candidates = await kv.getByPrefix("candidate:");
    return c.json({ candidates });
  } catch (error: any) {
    console.error("Error fetching candidates:", error);
    return c.json({ error: "Failed to fetch candidates", details: error.message }, 500);
  }
});

// Remove candidate
app.delete("/make-server-14835f38/candidates/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const candidate = await kv.get(`candidate:${id}`);
    
    if (!candidate) {
      return c.json({ error: "Candidate not found" }, 404);
    }

    await kv.del(`candidate:${id}`);

    // Add activity
    await addActivity("candidate_removed", "Candidate removed", { name: candidate.name });

    return c.json({ success: true });
  } catch (error: any) {
    console.error("Error removing candidate:", error);
    return c.json({ error: "Failed to remove candidate", details: error.message }, 500);
  }
});

// ============================================
// CATEGORY ROUTES
// ============================================

// Get all categories
app.get("/make-server-14835f38/categories", async (c) => {
  try {
    const categories = await kv.getByPrefix("category:");
    
    // Sort by creation date
    categories.sort((a: any, b: any) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

    return c.json({ categories });
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return c.json({ error: "Failed to fetch categories", details: error.message }, 500);
  }
});

// Add category
app.post("/make-server-14835f38/categories", async (c) => {
  try {
    const body = await c.req.json();
    const { name, description, maxVotes, isActive } = body;

    // Check category limit (max 3)
    const existingCategories = await kv.getByPrefix("category:");
    if (existingCategories.length >= 3) {
      return c.json({ error: "Maximum of 3 categories allowed" }, 400);
    }

    const category = {
      id: generateId(),
      name,
      description: description || "",
      maxVotes: maxVotes || 1,
      isActive: isActive ?? true,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`category:${category.id}`, category);

    // Add activity
    await addActivity("category_added", "New category added", { name });

    return c.json({ success: true, category });
  } catch (error: any) {
    console.error("Error adding category:", error);
    return c.json({ error: "Failed to add category", details: error.message }, 500);
  }
});

// Update category
app.put("/make-server-14835f38/categories/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const body = await c.req.json();
    const { name, description, maxVotes, isActive } = body;

    const existingCategory = await kv.get(`category:${id}`);
    if (!existingCategory) {
      return c.json({ error: "Category not found" }, 404);
    }

    const updatedCategory = {
      ...existingCategory,
      name,
      description,
      maxVotes,
      isActive,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`category:${id}`, updatedCategory);

    // Add activity
    await addActivity("category_updated", "Category updated", { name });

    return c.json({ success: true, category: updatedCategory });
  } catch (error: any) {
    console.error("Error updating category:", error);
    return c.json({ error: "Failed to update category", details: error.message }, 500);
  }
});

// Delete category
app.delete("/make-server-14835f38/categories/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const category = await kv.get(`category:${id}`);
    
    if (!category) {
      return c.json({ error: "Category not found" }, 404);
    }

    // Check if any candidates are using this category
    const candidates = await kv.getByPrefix("candidate:");
    const categoryInUse = candidates.some((candidate: any) => candidate.category === category.id);

    if (categoryInUse) {
      return c.json({ 
        error: "Cannot delete category. Candidates are assigned to this category." 
      }, 400);
    }

    await kv.del(`category:${id}`);

    // Add activity
    await addActivity("category_deleted", "Category deleted", { name: category.name });

    return c.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return c.json({ error: "Failed to delete category", details: error.message }, 500);
  }
});

// ============================================
// ACTIVITY ROUTES
// ============================================

// Get recent activities
app.get("/make-server-14835f38/activities", async (c) => {
  try {
    let activities = (await kv.get("recent_activities")) || [];
    
    // Filter out activities older than 1 hour
    const oneHourAgo = Date.now() - (60 * 60 * 1000);
    activities = activities.filter((act: any) => {
      const activityTime = new Date(act.timestamp).getTime();
      return activityTime > oneHourAgo;
    });
    
    // Update stored activities to remove old ones
    await kv.set("recent_activities", activities);
    
    // Return only the last 20 activities
    return c.json({ activities: activities.slice(0, 20) });
  } catch (error: any) {
    console.error("Error fetching activities:", error);
    return c.json({ error: "Failed to fetch activities", details: error.message }, 500);
  }
});

// ============================================
// STATISTICS ROUTES
// ============================================

// Get dashboard statistics
app.get("/make-server-14835f38/statistics", async (c) => {
  try {
    const voters = await kv.getByPrefix("voter:");
    const candidates = await kv.getByPrefix("candidate:");
    const settings = await kv.get("election_settings");

    const votedCount = voters.filter((v: any) => v.hasVoted).length;

    const stats = {
      totalVoters: 500, // This could be from a university database
      registeredVoters: voters.length,
      votesCount: votedCount,
      candidatesCount: candidates.length,
      electionStatus: settings?.status || "Not Started",
      electionTitle: settings?.title || "Student Council Election 2025",
      startDate: settings?.startDate,
      endDate: settings?.endDate,
    };

    return c.json(stats);
  } catch (error: any) {
    console.error("Error fetching statistics:", error);
    return c.json({ error: "Failed to fetch statistics", details: error.message }, 500);
  }
});

// ============================================
// HEALTH CHECK
// ============================================

app.get("/make-server-14835f38/health", (c) => {
  return c.json({ status: "healthy", timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);