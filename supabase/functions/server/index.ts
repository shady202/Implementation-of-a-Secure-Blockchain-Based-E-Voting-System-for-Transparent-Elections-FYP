/// <reference lib="deno.ns" />
/// <reference lib="dom" />

import { Hono } from "@hono/hono";
import type { Context, Next } from "@hono/hono";
import type { ContentfulStatusCode } from "@hono/hono/utils/http-status";
import { cors } from "@hono/cors";
import { logger } from "@hono/logger";
import { createClient } from "@supabase/supabase-js";
import type { User } from "@supabase/supabase-js";

const app = new Hono();

// ===============================
// Middleware
// ===============================
app.use("*", cors());
app.use("*", logger());

// ===============================
// Env
// ===============================
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
  Deno.env.get("SUPABASE_SERVICE_ROLE") ??
  "";
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") ?? "";

if (!SUPABASE_URL) console.warn("Missing SUPABASE_URL");
if (!SUPABASE_SERVICE_ROLE_KEY)
  console.warn("Missing SUPABASE_SERVICE_ROLE_KEY");
if (!SUPABASE_ANON_KEY) console.warn("Missing SUPABASE_ANON_KEY");

// Admin client (service role) - DB writes + internal ops
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
// Public client (anon) - validate JWT only
const supabaseAnon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ===============================
// Types
// ===============================
type AuthFail = { ok: false; status: ContentfulStatusCode; error: string };
type AuthOk = { ok: true; user: User; token: string };
type AdminOk = AuthOk & {
  adminRow: { id: string; user_id: string; role?: string };
};

type ElectionSettings = {
  title?: string;
  startDate?: string;
  endDate?: string;
  requireIdVerification?: boolean;
  showResultsDuringVoting?: boolean;
  status?: string;
  updatedAt?: string;
};

type RegisterVoterBody = {
  studentId?: string;
  walletAddress?: string;
  department?: string;
  year?: string | number;
};

type MarkVotedBody = {
  walletAddress?: string;
};

type CategoryPatchBody = {
  name?: string;
  category_name?: string;
  description?: string;
  maxVotes?: number;
  max_votes?: number;
  isActive?: boolean;
  is_active?: boolean;
};

// ===============================
// Helpers
// ===============================
function toErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  try {
    return JSON.stringify(e);
  } catch {
    return String(e);
  }
}

function getBearerToken(c: Context): string | null {
  const h = c.req.header("authorization") || c.req.header("Authorization");
  if (!h) return null;
  const m = h.match(/^Bearer\s+(.+)$/i);
  return m?.[1] ?? null;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function asElectionSettings(v: unknown): ElectionSettings {
  return isRecord(v) ? (v as ElectionSettings) : {};
}

function jsonError(
  c: Context,
  status: ContentfulStatusCode,
  error: string,
  details?: string
) {
  return c.json({ error, ...(details ? { details } : {}) }, status);
}

async function requireUser(c: Context): Promise<AuthFail | AuthOk> {
  const token = getBearerToken(c);
  if (!token) {
    return {
      ok: false,
      status: 401 as const,
      error: "Missing Authorization Bearer token",
    };
  }

  const { data, error } = await supabaseAnon.auth.getUser(token);
  if (error || !data?.user) {
    return { ok: false, status: 401 as const, error: "Invalid/expired token" };
  }

  return { ok: true, user: data.user, token };
}

async function requireAdmin(c: Context): Promise<AuthFail | AdminOk> {
  const auth = await requireUser(c);
  if (!auth.ok) return auth;

  const { data, error } = await supabaseAdmin
    .from("admins")
    .select("id,user_id,role")
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (error) {
    return {
      ok: false,
      status: 500 as const,
      error: "Failed to check admin status",
    };
  }
  if (!data) {
    return { ok: false, status: 403 as const, error: "Admin access required" };
  }

  return { ok: true, user: auth.user, token: auth.token, adminRow: data };
}

// system_settings: { key text pk, value jsonb/text }
async function getSetting(key: string): Promise<unknown> {
  const { data, error } = await supabaseAdmin
    .from("system_settings")
    .select("key,value")
    .eq("key", key)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data?.value ?? null;
}

async function setSetting(key: string, value: unknown): Promise<void> {
  const { error } = await supabaseAdmin
    .from("system_settings")
    .upsert({ key, value }, { onConflict: "key" });

  if (error) throw new Error(error.message);
}

// audit_logs optional
async function addAudit(type: string, description: string, meta?: unknown) {
  try {
    await supabaseAdmin.from("audit_logs").insert({
      type,
      description,
      meta: meta ?? null,
      created_at: new Date().toISOString(),
    });
  } catch {
    // ignore if table/cols differ
  }
}

async function getActiveElectionRow(): Promise<{
  id: string;
  title: string | null;
  start_time: string | null;
  end_time: string | null;
  is_active: boolean | null;
  created_at: string | null;
} | null> {
  const { data, error } = await supabaseAdmin
    .from("elections")
    .select("id,title,start_time,end_time,is_active,created_at")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) throw new Error(error.message);

  const row = data?.[0];
  if (!row) return null;

  // keep it typed without any
  return {
    id: String(row.id),
    title: row.title ?? null,
    start_time: row.start_time ?? null,
    end_time: row.end_time ?? null,
    is_active: row.is_active ?? null,
    created_at: row.created_at ?? null,
  };
}

async function getActiveElectionIdOrThrow(): Promise<string> {
  const row = await getActiveElectionRow();
  if (!row?.id)
    throw new Error("No active election found (elections.is_active = true).");
  return row.id;
}

// Middleware wrapper (typed)
function adminGuard() {
  return async (c: Context, next: Next) => {
    const auth = await requireAdmin(c);
    if (!auth.ok) return jsonError(c, auth.status, auth.error);
    (c as unknown as { admin?: AdminOk["adminRow"] }).admin = auth.adminRow;
    await next();
  };
}

// ===============================
// Health
// ===============================
app.get("/health", (c: Context) => {
  return c.json({ status: "ok", ts: new Date().toISOString() });
});

// ===============================
// Election Settings
// ===============================
app.get("/election-settings", async (c: Context) => {
  try {
    const settingsRaw = await getSetting("election_settings");

    const defaults: Required<ElectionSettings> = {
      title: "Student Council Election",
      startDate: "",
      endDate: "",
      requireIdVerification: true,
      showResultsDuringVoting: false,
      status: "Not Started",
      updatedAt: "",
    };

    const settings = asElectionSettings(settingsRaw);

    return c.json({
      ...defaults,
      ...settings,
      // keep updatedAt always present
      updatedAt: settings.updatedAt ?? defaults.updatedAt,
    });
  } catch (e: unknown) {
    return jsonError(
      c,
      500 as const,
      "Failed to fetch election settings",
      toErrorMessage(e)
    );
  }
});

app.post("/election-settings", adminGuard(), async (c: Context) => {
  try {
    const body = (await c.req.json()) as Partial<ElectionSettings> | null;
    const prev = asElectionSettings(await getSetting("election_settings"));

    const next: ElectionSettings = {
      ...prev,
      title: body?.title ?? prev.title,
      startDate: body?.startDate ?? prev.startDate,
      endDate: body?.endDate ?? prev.endDate,
      requireIdVerification:
        body?.requireIdVerification ?? prev.requireIdVerification ?? true,
      showResultsDuringVoting:
        body?.showResultsDuringVoting ?? prev.showResultsDuringVoting ?? false,
      updatedAt: new Date().toISOString(),
    };

    await setSetting("election_settings", next);
    await addAudit("election_settings_updated", "Election settings updated", {
      title: next.title ?? "",
    });

    return c.json({ success: true, settings: next });
  } catch (e: unknown) {
    return jsonError(
      c,
      500 as const,
      "Failed to update election settings",
      toErrorMessage(e)
    );
  }
});

app.post("/election-status", adminGuard(), async (c: Context) => {
  try {
    const body = (await c.req.json()) as { status?: string } | null;
    const status = body?.status;

    if (!status) return jsonError(c, 400 as const, "Missing status");

    const prev = asElectionSettings(await getSetting("election_settings"));
    const next: ElectionSettings = {
      ...prev,
      status,
      updatedAt: new Date().toISOString(),
    };

    await setSetting("election_settings", next);
    await addAudit(
      "election_status_changed",
      `Election status changed to ${status}`
    );

    return c.json({ success: true, status });
  } catch (e: unknown) {
    return jsonError(
      c,
      500 as const,
      "Failed to update election status",
      toErrorMessage(e)
    );
  }
});

// ===============================
// Voters
// ===============================
app.post("/register-voter", async (c: Context) => {
  const auth = await requireUser(c);
  if (!auth.ok) return jsonError(c, auth.status, auth.error);

  try {
    const body = (await c.req.json()) as RegisterVoterBody | null;

    const studentId = body?.studentId;
    const walletAddress = body?.walletAddress;
    const department = body?.department;
    const year = body?.year;

    if (
      !studentId ||
      !walletAddress ||
      !department ||
      year === undefined ||
      year === null
    ) {
      return jsonError(c, 400 as const, "Missing required fields");
    }

    const { data: exists, error: exErr } = await supabaseAdmin
      .from("voters")
      .select("id")
      .or(`student_id.eq.${studentId},wallet_address.eq.${walletAddress}`)
      .limit(1);

    if (exErr) throw new Error(exErr.message);
    if (exists && exists.length > 0) {
      return jsonError(c, 400 as const, "Voter already registered");
    }

    const { data, error } = await supabaseAdmin
      .from("voters")
      .insert({
        user_id: auth.user.id,
        student_id: studentId,
        wallet_address: walletAddress,
        department,
        year_of_study: year,
        has_voted: false,
        registration_date: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    await addAudit("voter_registered", "New voter registered", {
      studentId,
      department,
    });

    return c.json({ success: true, voter: data });
  } catch (e: unknown) {
    return jsonError(
      c,
      500 as const,
      "Failed to register voter",
      toErrorMessage(e)
    );
  }
});

app.get("/voters", adminGuard(), async (c: Context) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("voters")
      .select("*")
      .order("registration_date", { ascending: false });

    if (error) throw new Error(error.message);
    return c.json({ voters: data ?? [] });
  } catch (e: unknown) {
    return jsonError(
      c,
      500 as const,
      "Failed to fetch voters",
      toErrorMessage(e)
    );
  }
});

app.get("/voter/:walletAddress", async (c: Context) => {
  try {
    const walletAddress = c.req.param("walletAddress");

    const { data, error } = await supabaseAdmin
      .from("voters")
      .select("*")
      .ilike("wallet_address", walletAddress)
      .limit(1);

    if (error) throw new Error(error.message);

    const voter = data?.[0] ?? null;
    if (!voter) return c.json({ registered: false });

    return c.json({ registered: true, voter });
  } catch (e: unknown) {
    return jsonError(
      c,
      500 as const,
      "Failed to check voter",
      toErrorMessage(e)
    );
  }
});

app.post("/mark-voted", async (c: Context) => {
  const auth = await requireUser(c);
  if (!auth.ok) return jsonError(c, auth.status, auth.error);

  try {
    const body = (await c.req.json()) as MarkVotedBody | null;
    const walletAddress = body?.walletAddress;

    if (!walletAddress)
      return jsonError(c, 400 as const, "Missing walletAddress");

    const { data: voterRows, error: vErr } = await supabaseAdmin
      .from("voters")
      .select("id,student_id,has_voted")
      .eq("wallet_address", walletAddress)
      .limit(1);

    if (vErr) throw new Error(vErr.message);

    const voter = voterRows?.[0];
    if (!voter) return jsonError(c, 404 as const, "Voter not found");

    const { error } = await supabaseAdmin
      .from("voters")
      .update({ has_voted: true, voted_at: new Date().toISOString() })
      .eq("id", voter.id);

    if (error) throw new Error(error.message);

    await addAudit("vote_cast", "New vote cast", {
      studentId: voter.student_id,
    });

    return c.json({ success: true });
  } catch (e: unknown) {
    return jsonError(
      c,
      500 as const,
      "Failed to mark voted",
      toErrorMessage(e)
    );
  }
});

// ===============================
// Categories
// ===============================
app.get("/categories", async (c: Context) => {
  try {
    const election_id =
      c.req.query("election_id") || (await getActiveElectionIdOrThrow());

    const { data, error } = await supabaseAdmin
      .from("categories")
      .select("*")
      .eq("election_id", election_id)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);
    return c.json({ categories: data ?? [] });
  } catch (e: unknown) {
    return jsonError(
      c,
      500 as const,
      "Failed to fetch categories",
      toErrorMessage(e)
    );
  }
});

app.put("/categories/:id", adminGuard(), async (c: Context) => {
  try {
    const id = c.req.param("id"); // UUID
    const body = (await c.req.json()) as CategoryPatchBody | null;

    const patch: Record<string, unknown> = {};

    if (body?.name !== undefined) patch.name = body.name;
    if (body?.category_name !== undefined)
      patch.category_name = body.category_name;
    if (body?.description !== undefined) patch.description = body.description;

    if (body?.maxVotes !== undefined) patch.max_votes = body.maxVotes;
    if (body?.max_votes !== undefined) patch.max_votes = body.max_votes;

    if (body?.isActive !== undefined) patch.is_active = body.isActive;
    if (body?.is_active !== undefined) patch.is_active = body.is_active;

    patch.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from("categories")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw new Error(error.message);

    await addAudit("category_updated", "Category updated", { id });

    return c.json({ success: true, category: data });
  } catch (e: unknown) {
    return jsonError(
      c,
      500 as const,
      "Failed to update category",
      toErrorMessage(e)
    );
  }
});

// ===============================
// Activities
// ===============================
type AuditLogRow = {
  id?: string;
  created_at?: string;
  type?: string;
  description?: string;
};

app.get("/activities", async (c: Context) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) return c.json({ activities: [] });

    const rows = (data ?? []) as unknown[];
    const activities = rows.map((r) => {
      const a = (isRecord(r) ? (r as AuditLogRow) : {}) as AuditLogRow;
      return {
        id: a.id ?? `${a.created_at ?? ""}-${a.type ?? "event"}`,
        type: a.type ?? "event",
        description: a.description ?? "",
        timestamp: a.created_at ?? new Date().toISOString(),
      };
    });

    return c.json({ activities });
  } catch {
    return c.json({ activities: [] });
  }
});

// ===============================
// Statistics
// ===============================
app.get("/statistics", async (c: Context) => {
  try {
    const settings = asElectionSettings(await getSetting("election_settings"));
    const activeElection = await getActiveElectionRow();

    const votersRes = await supabaseAdmin
      .from("voters")
      .select("id", { count: "exact", head: true });

    const votedRes = await supabaseAdmin
      .from("voters")
      .select("id", { count: "exact", head: true })
      .eq("has_voted", true);

    const candidatesRes = await supabaseAdmin
      .from("candidates")
      .select("id", { count: "exact", head: true });

    if (votersRes.error) throw new Error(votersRes.error.message);
    if (votedRes.error) throw new Error(votedRes.error.message);
    if (candidatesRes.error) throw new Error(candidatesRes.error.message);

    const stats = {
      totalVoters: 500,
      registeredVoters: votersRes.count ?? 0,
      votesCount: votedRes.count ?? 0,
      candidatesCount: candidatesRes.count ?? 0,
      electionStatus: settings.status || "Not Started",
      electionTitle: settings.title || activeElection?.title || "Election",
      startDate: settings.startDate || activeElection?.start_time || "",
      endDate: settings.endDate || activeElection?.end_time || "",
    };

    return c.json(stats);
  } catch (e: unknown) {
    return jsonError(
      c,
      500 as const,
      "Failed to fetch statistics",
      toErrorMessage(e)
    );
  }
});

// ===============================
// Start server
// ===============================
Deno.serve(app.fetch);
