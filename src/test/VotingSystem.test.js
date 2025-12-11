const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("VotingSystem", function () {
  // Fixture to deploy contract
  async function deployVotingSystemFixture() {
    const [admin, voter1, voter2, voter3] = await ethers.getSigners();

    const VotingSystem = await ethers.getContractFactory("VotingSystem");
    const votingSystem = await VotingSystem.deploy();

    return { votingSystem, admin, voter1, voter2, voter3 };
  }

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      const { votingSystem, admin } = await loadFixture(deployVotingSystemFixture);
      expect(await votingSystem.admin()).to.equal(admin.address);
    });

    it("Should initialize with NotStarted state", async function () {
      const { votingSystem } = await loadFixture(deployVotingSystemFixture);
      const election = await votingSystem.currentElection();
      expect(election.state).to.equal(0); // ElectionState.NotStarted
    });
  });

  describe("Election Management", function () {
    it("Should allow admin to create an election", async function () {
      const { votingSystem, admin } = await loadFixture(deployVotingSystemFixture);
      const now = Math.floor(Date.now() / 1000);
      const startTime = now + 3600;
      const endTime = now + 86400;

      await expect(
        votingSystem.createElection("Test Election", startTime, endTime)
      ).to.emit(votingSystem, "ElectionCreated");

      const election = await votingSystem.currentElection();
      expect(election.title).to.equal("Test Election");
    });

    it("Should not allow non-admin to create election", async function () {
      const { votingSystem, voter1 } = await loadFixture(deployVotingSystemFixture);
      const now = Math.floor(Date.now() / 1000);

      await expect(
        votingSystem.connect(voter1).createElection("Test", now + 3600, now + 86400)
      ).to.be.revertedWith("Only admin can call this function");
    });

    it("Should allow admin to start election", async function () {
      const { votingSystem } = await loadFixture(deployVotingSystemFixture);
      const now = Math.floor(Date.now() / 1000);

      await votingSystem.createElection("Test Election", now + 3600, now + 86400);
      await expect(votingSystem.startElection()).to.emit(votingSystem, "ElectionStarted");

      const election = await votingSystem.currentElection();
      expect(election.state).to.equal(1); // ElectionState.Active
    });

    it("Should allow admin to end election", async function () {
      const { votingSystem } = await loadFixture(deployVotingSystemFixture);
      const now = Math.floor(Date.now() / 1000);

      await votingSystem.createElection("Test Election", now + 3600, now + 86400);
      await votingSystem.startElection();
      await expect(votingSystem.endElection()).to.emit(votingSystem, "ElectionEnded");

      const election = await votingSystem.currentElection();
      expect(election.state).to.equal(2); // ElectionState.Ended
    });
  });

  describe("Candidate Management", function () {
    it("Should allow admin to add candidates", async function () {
      const { votingSystem } = await loadFixture(deployVotingSystemFixture);

      await expect(
        votingSystem.addCandidate("John Doe", "President", "Party A")
      ).to.emit(votingSystem, "CandidateAdded");

      expect(await votingSystem.candidateCount()).to.equal(1);
    });

    it("Should not allow non-admin to add candidates", async function () {
      const { votingSystem, voter1 } = await loadFixture(deployVotingSystemFixture);

      await expect(
        votingSystem.connect(voter1).addCandidate("John Doe", "President", "Party A")
      ).to.be.revertedWith("Only admin can call this function");
    });

    it("Should retrieve candidate details", async function () {
      const { votingSystem } = await loadFixture(deployVotingSystemFixture);

      await votingSystem.addCandidate("John Doe", "President", "Party A");
      const candidate = await votingSystem.getCandidate(1);

      expect(candidate.name).to.equal("John Doe");
      expect(candidate.position).to.equal("President");
      expect(candidate.party).to.equal("Party A");
      expect(candidate.voteCount).to.equal(0);
    });

    it("Should get candidates for a position", async function () {
      const { votingSystem } = await loadFixture(deployVotingSystemFixture);

      await votingSystem.addCandidate("John Doe", "President", "Party A");
      await votingSystem.addCandidate("Jane Smith", "President", "Party B");
      await votingSystem.addCandidate("Bob Johnson", "Vice President", "Party A");

      const presidentCandidates = await votingSystem.getCandidatesForPosition("President");
      expect(presidentCandidates.length).to.equal(2);
    });
  });

  describe("Voter Registration", function () {
    it("Should allow voters to register", async function () {
      const { votingSystem, voter1 } = await loadFixture(deployVotingSystemFixture);

      await expect(
        votingSystem.connect(voter1).registerVoter("TP12345", "Computer Science", 3)
      ).to.emit(votingSystem, "VoterRegistered");

      const voterData = await votingSystem.voters(voter1.address);
      expect(voterData.isRegistered).to.be.true;
      expect(voterData.studentId).to.equal("TP12345");
    });

    it("Should not allow duplicate registration", async function () {
      const { votingSystem, voter1 } = await loadFixture(deployVotingSystemFixture);

      await votingSystem.connect(voter1).registerVoter("TP12345", "Computer Science", 3);
      
      await expect(
        votingSystem.connect(voter1).registerVoter("TP12345", "Computer Science", 3)
      ).to.be.revertedWith("Voter already registered");
    });
  });

  describe("Voting", function () {
    async function setupElectionFixture() {
      const { votingSystem, admin, voter1, voter2, voter3 } = await loadFixture(
        deployVotingSystemFixture
      );
      const now = Math.floor(Date.now() / 1000);

      // Create election
      await votingSystem.createElection("Test Election", now + 3600, now + 86400);

      // Add candidates
      await votingSystem.addCandidate("John Doe", "President", "Party A");
      await votingSystem.addCandidate("Jane Smith", "President", "Party B");

      // Register voters
      await votingSystem.connect(voter1).registerVoter("TP12345", "CS", 3);
      await votingSystem.connect(voter2).registerVoter("TP12346", "ENG", 2);

      // Start election
      await votingSystem.startElection();

      return { votingSystem, admin, voter1, voter2, voter3 };
    }

    it("Should allow registered voters to vote", async function () {
      const { votingSystem, voter1 } = await loadFixture(setupElectionFixture);

      await expect(votingSystem.connect(voter1).vote(1))
        .to.emit(votingSystem, "VoteCast")
        .withArgs(voter1.address, 1, "President");

      const candidate = await votingSystem.getCandidate(1);
      expect(candidate.voteCount).to.equal(1);
    });

    it("Should not allow unregistered voters to vote", async function () {
      const { votingSystem, voter3 } = await loadFixture(setupElectionFixture);

      await expect(votingSystem.connect(voter3).vote(1)).to.be.revertedWith(
        "Voter not registered"
      );
    });

    it("Should not allow voting for the same position twice", async function () {
      const { votingSystem, voter1 } = await loadFixture(setupElectionFixture);

      await votingSystem.connect(voter1).vote(1);
      await expect(votingSystem.connect(voter1).vote(2)).to.be.revertedWith(
        "Already voted for this position"
      );
    });

    it("Should track voter status correctly", async function () {
      const { votingSystem, voter1 } = await loadFixture(setupElectionFixture);

      const hasVotedBefore = await votingSystem.hasVotedForPosition(
        voter1.address,
        "President"
      );
      expect(hasVotedBefore).to.be.false;

      await votingSystem.connect(voter1).vote(1);

      const hasVotedAfter = await votingSystem.hasVotedForPosition(
        voter1.address,
        "President"
      );
      expect(hasVotedAfter).to.be.true;
    });
  });

  describe("Results", function () {
    it("Should return election results", async function () {
      const { votingSystem, voter1, voter2 } = await loadFixture(deployVotingSystemFixture);
      const now = Math.floor(Date.now() / 1000);

      await votingSystem.createElection("Test Election", now + 3600, now + 86400);
      await votingSystem.addCandidate("John Doe", "President", "Party A");
      await votingSystem.addCandidate("Jane Smith", "President", "Party B");

      await votingSystem.connect(voter1).registerVoter("TP12345", "CS", 3);
      await votingSystem.connect(voter2).registerVoter("TP12346", "ENG", 2);

      await votingSystem.startElection();

      await votingSystem.connect(voter1).vote(1);
      await votingSystem.connect(voter2).vote(2);

      const results = await votingSystem.getElectionResults("President");
      expect(results.candidateIds.length).to.equal(2);
      expect(results.voteCounts[0]).to.equal(1);
      expect(results.voteCounts[1]).to.equal(1);
    });

    it("Should return election statistics", async function () {
      const { votingSystem, voter1 } = await loadFixture(deployVotingSystemFixture);
      const now = Math.floor(Date.now() / 1000);

      await votingSystem.createElection("Test Election", now + 3600, now + 86400);
      await votingSystem.addCandidate("John Doe", "President", "Party A");
      await votingSystem.connect(voter1).registerVoter("TP12345", "CS", 3);
      await votingSystem.startElection();
      await votingSystem.connect(voter1).vote(1);

      const stats = await votingSystem.getElectionStats();
      expect(stats.totalRegisteredVoters).to.equal(1);
      expect(stats.totalVotesCast).to.equal(1);
      expect(stats.electionState).to.equal(1); // Active
    });
  });
});
