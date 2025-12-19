// API Base URL - now pointing to local Express backend
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Temporary: Simple user ID storage (will be replaced with session auth)
let currentUserId: string | null = null;

export function setCurrentUser(userId: string) {
  currentUserId = userId;
  if (userId) {
    localStorage.setItem("user_id", userId);
  } else {
    localStorage.removeItem("user_id");
  }
}

export function getCurrentUserId(): string | null {
  return currentUserId || localStorage.getItem("user_id");
}

// ===============================
// API request helper
// ===============================
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const userId = getCurrentUserId();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  // Add user ID header if available (temporary auth)
  if (userId) {
    headers["x-user-id"] = userId;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error("🔴 API Error Response:", errorData);
    console.error("🔴 Error details:", errorData.details);
    console.error("🔴 Error column:", errorData.column);
    console.error("🔴 Error constraint:", errorData.constraint);
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  return await response.json();
}

// ============================================
// ELECTION SETTINGS API (Edge)
// ============================================
export async function getElectionSettings() {
  return apiRequest("/election-settings");
}

export async function updateElectionSettings(settings: {
  title: string;
  startDate: string;
  endDate: string;
  requireIdVerification?: boolean;
  showResultsDuringVoting?: boolean;
}) {
  return apiRequest("/election-settings", {
    method: "POST",
    body: JSON.stringify(settings),
  });
}

export async function updateElectionStatus(status: string) {
  return apiRequest("/election-status", {
    method: "POST",
    body: JSON.stringify({ status }),
  });
}

// ============================================
// ACTIVE ELECTION
// ============================================
export async function getActiveElection() {
  return apiRequest("/elections/active");
}

export async function getActiveElectionId(): Promise<string> {
  const active = await getActiveElection();
  if (!active?.id) {
    throw new Error(
      "No active election found in DB (elections.is_active = true)."
    );
  }
  return active.id as string;
}

// ============================================
// VOTER REGISTRATION API (Edge)
// ============================================
export async function registerVoter(voterData: {
  studentId: string;
  walletAddress: string;
  department: string;
  year: string;
}) {
  return apiRequest("/voters/register-voter", {
    method: "POST",
    body: JSON.stringify(voterData),
  });
}

export async function getVoters() {
  return apiRequest("/voters");
}

export async function checkVoterRegistration(walletAddress: string) {
  return apiRequest(`/voter/${walletAddress}`);
}

export async function markVoterAsVoted(walletAddress: string) {
  return apiRequest("/mark-voted", {
    method: "POST",
    body: JSON.stringify({ walletAddress }),
  });
}

// ============================================
// CATEGORY API (Edge read)
// ============================================
export async function getCategories(electionId?: string) {
  const eid = electionId ?? (await getActiveElectionId());
  return apiRequest(`/categories?election_id=${encodeURIComponent(eid)}`);
}

async function getCategoryUuidBySlug(slug: string, electionId?: string) {
  const res = await getCategories(electionId);
  const cats = res.categories || [];

  const found = cats.find((c: any) => c.slug === slug);
  if (!found?.id) throw new Error(`No DB category found for slug: ${slug}`);
  return found.id as string;
}

export async function updateCategoryBySlug(
  slug: string,
  categoryData: {
    name: string;
    description?: string;
    maxVotes?: number;
    isActive?: boolean;
  },
  electionId?: string
) {
  const uuid = await getCategoryUuidBySlug(slug, electionId);
  return apiRequest(`/categories/${uuid}`, {
    method: "PUT",
    body: JSON.stringify(categoryData),
  });
}

export async function addCategory(categoryData: {
  name: string;
  description?: string;
  maxVotes?: number;
  isActive?: boolean;
}) {
  return apiRequest("/categories", {
    method: "POST",
    body: JSON.stringify(categoryData),
  });
}

export async function updateCategory(
  id: string,
  categoryData: {
    name: string;
    description?: string;
    maxVotes?: number;
    isActive?: boolean;
  }
) {
  return apiRequest(`/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify(categoryData),
  });
}

export async function deleteCategory(id: string) {
  return apiRequest(`/categories/${id}`, { method: "DELETE" });
}

// ============================================
// CANDIDATES (using Express backend)
// ============================================
export type CandidateRow = {
  id: string;
  election_id: string;
  category_id: string;
  candidate_name: string;
  party: string | null;
  manifesto?: string | null;
  photo_url?: string | null;
  candidate_number?: number | null;
  vote_count?: number | null;
  is_approved?: boolean | null;
  created_at?: string;
  updated_at?: string;
};

export async function getCandidatesByElection(electionId?: string) {
  const params = electionId
    ? `?election_id=${encodeURIComponent(electionId)}`
    : "";
  return apiRequest(`/candidates${params}`);
}

export async function addCandidateDb(payload: {
  election_id?: string;
  category_id: string;
  candidate_name: string;
  party?: string;
  manifesto?: string;
  photo_url?: string;
  is_approved?: boolean;
}) {
  return apiRequest("/candidates", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateCandidateDb(
  candidateId: string,
  patch: Partial<
    Pick<
      CandidateRow,
      "candidate_name" | "party" | "manifesto" | "photo_url" | "is_approved"
    >
  >
) {
  return apiRequest(`/candidates/${candidateId}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
}

export async function deleteCandidateDb(candidateId: string) {
  return apiRequest(`/candidates/${candidateId}`, {
    method: "DELETE",
  });
}

// ============================================
// Legacy Admin data helpers (Edge)
// ============================================
export async function getRecentActivities() {
  return apiRequest("/activities");
}

export async function getDashboardStatistics() {
  return apiRequest("/statistics");
}

export async function getAdminData() {
  const [stats, voters, candidates, activities] = await Promise.all([
    getDashboardStatistics(),
    getVoters(),
    apiRequest("/candidates"), // keep your existing edge candidates for now
    getRecentActivities(),
  ]);

  return {
    totalVoters: stats.totalVoters,
    registeredVoters: stats.registeredVoters,
    votesCount: stats.votesCount,
    electionStatus: stats.electionStatus,
    electionTitle: stats.electionTitle,
    startDate: stats.startDate,
    endDate: stats.endDate,
    candidates: candidates.candidates || [],
    voters: voters.voters || [],
    activities: activities.activities || [],
  };
}

export async function startElection() {
  return updateElectionStatus("Active");
}

export async function endElection() {
  return updateElectionStatus("Ended");
}

export async function healthCheck() {
  return apiRequest("/health");
}

// ==================================================
// ✅ Backward-compatible Aliases (Option B)
// These keep old UI calls working: api.addCandidate / api.removeCandidate
// while the new DB-first REST functions are addCandidateDb / deleteCandidateDb
// ==================================================

/**
 * OLD UI expected:
 * api.addCandidate({ name, position, party, category })
 *
 * NEW DB expects:
 * category_id (UUID), candidate_name, party, election_id (optional)
 *
 * This alias maps slug (cat1/cat2/cat3) -> category UUID then inserts into DB.
 */
export async function addCandidate(candidateData: {
  name: string;
  position: string; // kept for UI compatibility
  party: string;
  category: string; // slug cat1/cat2/cat3
}) {
  // 1) Load categories -> find UUID by slug
  const catsRes = await getCategories();
  const cats = catsRes?.categories || [];

  const found = cats.find((c: any) => c.slug === candidateData.category);
  if (!found?.id) {
    throw new Error(
      `Invalid category slug "${candidateData.category}". Must match existing category slug.`
    );
  }

  // 2) Insert into DB using category UUID
  const created = await addCandidateDb({
    category_id: found.id,
    candidate_name: candidateData.name,
    party: candidateData.party,
    is_approved: true,
  });

  return {
    success: true,
    candidate: created?.candidate ?? null,
  };
}

/**
 * OLD UI expected:
 * api.removeCandidate(candidateId)
 *
 * NEW DB function:
 * deleteCandidateDb(candidateId)
 */
export async function removeCandidate(candidateId: string) {
  await deleteCandidateDb(candidateId);
  return { success: true };
}
