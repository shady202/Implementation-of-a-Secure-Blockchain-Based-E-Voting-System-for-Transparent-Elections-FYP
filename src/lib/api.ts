import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-14835f38`;

// Helper function to make API requests
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${publicAnonKey}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

// ============================================
// ELECTION SETTINGS API
// ============================================

export async function getElectionSettings() {
  return apiRequest('/election-settings');
}

export async function updateElectionSettings(settings: {
  title: string;
  startDate: string;
  endDate: string;
  requireIdVerification?: boolean;
  showResultsDuringVoting?: boolean;
}) {
  return apiRequest('/election-settings', {
    method: 'POST',
    body: JSON.stringify(settings),
  });
}

export async function updateElectionStatus(status: string) {
  return apiRequest('/election-status', {
    method: 'POST',
    body: JSON.stringify({ status }),
  });
}

// ============================================
// VOTER REGISTRATION API
// ============================================

export async function registerVoter(voterData: {
  studentId: string;
  walletAddress: string;
  department: string;
  year: string;
}) {
  return apiRequest('/register-voter', {
    method: 'POST',
    body: JSON.stringify(voterData),
  });
}

export async function getVoters() {
  return apiRequest('/voters');
}

export async function checkVoterRegistration(walletAddress: string) {
  return apiRequest(`/voter/${walletAddress}`);
}

export async function markVoterAsVoted(walletAddress: string) {
  return apiRequest('/mark-voted', {
    method: 'POST',
    body: JSON.stringify({ walletAddress }),
  });
}

// ============================================
// CANDIDATE API
// ============================================

export async function addCandidate(candidateData: {
  name: string;
  position: string;
  party: string;
  category?: string;
}) {
  return apiRequest('/candidates', {
    method: 'POST',
    body: JSON.stringify(candidateData),
  });
}

export async function getCandidates() {
  return apiRequest('/candidates');
}

export async function removeCandidate(candidateId: string) {
  return apiRequest(`/candidates/${candidateId}`, {
    method: 'DELETE',
  });
}

export async function updateCandidate(candidateId: string, candidateData: any) {
  return apiRequest(`/candidates/${candidateId}`, {
    method: 'PUT',
    body: JSON.stringify(candidateData),
  });
}

// Get election data formatted for voting page
export async function getElectionDataForVoting() {
  const [candidatesRes, settings] = await Promise.all([
    getCandidates(),
    getElectionSettings()
  ]);

  const candidates = candidatesRes.candidates || [];

  // Group candidates by position
  const positionGroups: { [key: string]: any[] } = {};

  candidates.forEach((candidate: any) => {
    if (!positionGroups[candidate.position]) {
      positionGroups[candidate.position] = [];
    }
    positionGroups[candidate.position].push(candidate);
  });

  // Convert to positions array format
  const positions = Object.entries(positionGroups).map(
    ([position, positionCandidates]) => {
      const totalVotes = positionCandidates.reduce(
        (sum, c) => sum + (c.votes || 0),
        0
      );

      return {
        id: position.toLowerCase().replace(/\s+/g, "-"),
        title: position,
        candidates: positionCandidates.map((c) => ({
          ...c,
          votes: c.votes || 0,
          percentage: totalVotes > 0 ? ((c.votes || 0) / totalVotes) * 100 : 0,
        })),
        totalVotes,
      };
    }
  );

  return {
    positions,
    electionTitle: settings.title,
    startDate: settings.startDate,
    endDate: settings.endDate,
    showResultsDuringVoting: settings.showResultsDuringVoting
  };
}

// ============================================
// ACTIVITY API
// ============================================

export async function getRecentActivities() {
  return apiRequest('/activities');
}

// ============================================
// STATISTICS API
// ============================================

export async function getDashboardStatistics() {
  return apiRequest('/statistics');
}

export async function getAdminData() {
  const [stats, voters, candidates, activities] = await Promise.all([
    getDashboardStatistics(),
    getVoters(),
    getCandidates(),
    getRecentActivities()
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
    activities: activities.activities || []
  };
}

export async function createElection(electionData: {
  title: string;
  startDate: string;
  endDate: string;
}) {
  return updateElectionSettings({
    ...electionData,
    requireIdVerification: true,
    showResultsDuringVoting: false
  });
}

export async function startElection() {
  return updateElectionStatus('Active');
}

export async function endElection() {
  return updateElectionStatus('Ended');
}

// ============================================
// HEALTH CHECK API
// ============================================

export async function healthCheck() {
  return apiRequest('/health');
}

// ============================================
// CATEGORY API
// ============================================

export async function getCategories() {
  return apiRequest('/categories');
}

export async function addCategory(categoryData: {
  name: string;
  description?: string;
  maxVotes?: number;
  isActive?: boolean;
}) {
  return apiRequest('/categories', {
    method: 'POST',
    body: JSON.stringify(categoryData),
  });
}

export async function updateCategory(id: string, categoryData: {
  name: string;
  description?: string;
  maxVotes?: number;
  isActive?: boolean;
}) {
  return apiRequest(`/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(categoryData),
  });
}

export async function deleteCategory(id: string) {
  return apiRequest(`/categories/${id}`, {
    method: 'DELETE',
  });
}