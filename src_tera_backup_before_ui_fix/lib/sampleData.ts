// Sample data initialization for testing the voting system

export function initializeSampleData() {
  // Check if data already exists
  const existingCategories = localStorage.getItem("votingCategories");
  const existingCandidates = localStorage.getItem("candidates");
  
  if (!existingCategories) {
    // Sample categories
    const categories = [
      {
        id: "cat-1",
        name: "President",
        description: "Student Council President - Lead the entire student body",
        maxVotes: 1,
        isActive: true,
      },
      {
        id: "cat-2",
        name: "Vice President",
        description: "Student Council Vice President - Support presidential initiatives",
        maxVotes: 1,
        isActive: true,
      },
      {
        id: "cat-3",
        name: "Secretary",
        description: "Student Council Secretary - Manage official documentation",
        maxVotes: 1,
        isActive: false,
      },
    ];
    localStorage.setItem("votingCategories", JSON.stringify(categories));
  }

  if (!existingCandidates) {
    // Sample candidates
    const candidates = [
      // President candidates
      {
        id: "cand-1",
        name: "Sarah Chen",
        position: "President",
        party: "Innovation Alliance",
      },
      {
        id: "cand-2",
        name: "Marcus Johnson",
        position: "President",
        party: "Progressive Unity",
      },
      {
        id: "cand-3",
        name: "Aisha Rahman",
        position: "President",
        party: "Student First",
      },
      // Vice President candidates
      {
        id: "cand-4",
        name: "David Kim",
        position: "Vice President",
        party: "Innovation Alliance",
      },
      {
        id: "cand-5",
        name: "Elena Rodriguez",
        position: "Vice President",
        party: "Progressive Unity",
      },
      // Secretary candidates
      {
        id: "cand-6",
        name: "James Wong",
        position: "Secretary",
        party: "Innovation Alliance",
      },
      {
        id: "cand-7",
        name: "Priya Patel",
        position: "Secretary",
        party: "Student First",
      },
    ];
    localStorage.setItem("candidates", JSON.stringify(candidates));
  }

  // Initialize system settings if not present
  const existingSettings = localStorage.getItem("systemSettings");
  if (!existingSettings) {
    const settings = {
      showResultsDuringVoting: false,
      visitorLimit: null,
    };
    localStorage.setItem("systemSettings", JSON.stringify(settings));
  }

  // Initialize empty votes array if not present
  const existingVotes = localStorage.getItem("votes");
  if (!existingVotes) {
    localStorage.setItem("votes", JSON.stringify([]));
  }
}

export function clearAllData() {
  localStorage.removeItem("votingCategories");
  localStorage.removeItem("candidates");
  localStorage.removeItem("systemSettings");
  localStorage.removeItem("votes");
  localStorage.removeItem("hasVoted");
}

export function addSampleVotes(count: number = 10) {
  const votes = localStorage.getItem("votes");
  const existingVotes = votes ? JSON.parse(votes) : [];
  
  const categories = localStorage.getItem("votingCategories");
  if (!categories) return;
  
  const cats = JSON.parse(categories);
  const activeCats = cats.filter((c: any) => c.isActive);
  
  const candidates = localStorage.getItem("candidates");
  if (!candidates) return;
  
  const cands = JSON.parse(candidates);
  
  // Generate random votes
  for (let i = 0; i < count; i++) {
    const selections: Record<string, string> = {};
    
    activeCats.forEach((cat: any) => {
      const catCandidates = cands.filter((c: any) => c.position === cat.name);
      if (catCandidates.length > 0) {
        const randomCandidate = catCandidates[Math.floor(Math.random() * catCandidates.length)];
        selections[cat.id] = randomCandidate.id;
      }
    });
    
    existingVotes.push({
      timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      selections,
      voterAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
    });
  }
  
  localStorage.setItem("votes", JSON.stringify(existingVotes));
}
