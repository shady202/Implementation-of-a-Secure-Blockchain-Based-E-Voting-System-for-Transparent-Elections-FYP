// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title University Election Voting System
 * @dev Smart contract for managing university elections with secure voting
 */
contract VotingSystem {
    // Election status enum
    enum ElectionState { Created, Active, Ended }

    // Candidate struct
    struct Candidate {
        uint256 id;            // unique numeric ID
        string name;           // candidate’s name
        string position;       // role (e.g., President)
        string party;          // political group or affiliation
        uint256 voteCount;     // number of votes received
        string categoryId;     // category this candidate belongs to
        bool isActive;         // soft delete flag
    }

    // Voter struct
    struct Voter {
        string studentId;                        // unique university ID
        string department;                       // academic department
        uint256 yearOfStudy;                     // e.g., 1, 2, 3, or 4
        bool isRegistered;                       // true if registered to vote
        bool hasVoted;                           // true if has voted at least once
        mapping(string => bool) votedForPosition; // track if voter already voted for a specific position
    }

    // Election struct
    struct Election {
        string title;           // name of the election
        uint256 startTime;      // start timestamp (UNIX)
        uint256 endTime;        // end timestamp (UNIX)
        ElectionState state;    // current phase (Created/Active/Ended)
        uint256 totalVoters;    // number of registered voters
        uint256 totalVotes;     // total votes cast (unique voters who voted at least once)
    }

    // Voting category struct
    struct VotingCategory {
        string id;
        string name;
        string description;
        string[] positions; // positions under this category
        bool isActive;      // soft delete flag
    }

    // Contract state variables
    address public admin;
    Election public currentElection;

    mapping(address => Voter) public voters;
    mapping(string => Candidate[]) public candidatesByPosition;
    string[] public positions;

    mapping(uint256 => Candidate) public candidatesById;
    uint256 public candidateCount;
    address[] public registeredVoters;

    mapping(string => VotingCategory) public categories;
    string[] public categoryIds;
    uint256 public categoryCount;

    // Events
    event ElectionCreated(string title, uint256 startTime, uint256 endTime);
    event ElectionStarted(uint256 timestamp);
    event ElectionEnded(uint256 timestamp);
    event VoterRegistered(address indexed voterAddress, string studentId);
    event CandidateAdded(uint256 indexed candidateId, string name, string position, string categoryId);
    event CandidateDeactivated(uint256 indexed candidateId);
    event VoteCast(address indexed voter, uint256 indexed candidateId, string position);

    event CategoryAdded(string id, string name);
    event CategoryRemoved(string id);

    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    modifier electionExists() {
        require(bytes(currentElection.title).length > 0, "No election has been created");
        _;
    }

    modifier electionActive() {
        require(currentElection.state == ElectionState.Active, "Election is not active");
        require(block.timestamp >= currentElection.startTime, "Election has not started yet");
        require(block.timestamp <= currentElection.endTime, "Election has already ended");
        _;
    }

    modifier electionInSetup() {
        require(currentElection.state == ElectionState.Created, "Election setup is locked");
        _;
    }

    modifier voterNotRegistered() {
        require(!voters[msg.sender].isRegistered, "Voter is already registered");
        _;
    }

    modifier voterRegistered() {
        require(voters[msg.sender].isRegistered, "Voter is not registered");
        _;
    }

    modifier hasNotVotedForPosition(string memory position) {
        require(!voters[msg.sender].votedForPosition[position], "Already voted for this position");
        _;
    }

    modifier categoryExistsAndActive(string memory _id) {
        VotingCategory storage cat = categories[_id];
        require(bytes(cat.id).length > 0 && cat.isActive, "Category does not exist");
        _;
    }

    // Constructor
    constructor() {
        admin = msg.sender;
    }

    /**
     * @notice Create a new election
     */
    function createElection(
        string memory _title,
        uint256 _startTime,
        uint256 _endTime
    ) public onlyAdmin {
        require(_startTime < _endTime, "End time must be after start time");
        require(_startTime >= block.timestamp, "Start time cannot be in the past");

        // Reset previous election candidate data if any
        if (bytes(currentElection.title).length > 0) {
            for (uint256 i = 0; i < positions.length; i++) {
                delete candidatesByPosition[positions[i]];
            }
            delete positions;
            candidateCount = 0;
        }

        currentElection = Election({
            title: _title,
            startTime: _startTime,
            endTime: _endTime,
            state: ElectionState.Created,
            totalVoters: 0,
            totalVotes: 0
        });

        emit ElectionCreated(_title, _startTime, _endTime);
    }

    /**
     * @notice Start the election (locks config)
     */
    function startElection() public onlyAdmin electionExists {
        require(currentElection.state == ElectionState.Created, "Election cannot be started");
        currentElection.state = ElectionState.Active;
        emit ElectionStarted(block.timestamp);
    }

    /**
     * @notice End the election
     */
    function endElection() public onlyAdmin electionExists {
        require(currentElection.state == ElectionState.Active, "Election is not active");
        currentElection.state = ElectionState.Ended;
        emit ElectionEnded(block.timestamp);
    }

    // -------------------------------------------------------------------------
    // CATEGORY MANAGEMENT
    // -------------------------------------------------------------------------

    /**
     * @notice Add a new voting category (only during setup)
     */
    function addCategory(
        string memory _id,
        string memory _name,
        string memory _description,
        string[] memory _positions
    ) public onlyAdmin electionExists electionInSetup {
        
        if (bytes(categories[_id].id).length > 0) {
            require(!categories[_id].isActive, "Category already active");
            categories[_id].isActive = true;
            categories[_id].name = _name;
            categories[_id].description = _description;
            categories[_id].positions = _positions;
            emit CategoryAdded(_id, _name);
            return;
        }

        categories[_id] = VotingCategory({
            id: _id,
            name: _name,
            description: _description,
            positions: _positions,
            isActive: true
        });

        categoryIds.push(_id);
        categoryCount++;

        emit CategoryAdded(_id, _name);
    }

    /**
     * @notice Mark a voting category as inactive (soft delete, only during setup)
     */
    function removeCategory(string memory _id)
        public
        onlyAdmin
        electionExists
        electionInSetup
        categoryExistsAndActive(_id)
    {
        categories[_id].isActive = false;
        emit CategoryRemoved(_id);
    }

    /**
     * @notice Get all active category IDs
     */
    function getCategories() public view returns (string[] memory activeCategoryIds) {
        uint256 activeCount = 0;

        // Count active categories
        for (uint256 i = 0; i < categoryIds.length; i++) {
            if (categories[categoryIds[i]].isActive) {
                activeCount++;
            }
        }

        // Create array of active category IDs
        activeCategoryIds = new string[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < categoryIds.length; i++) {
            if (categories[categoryIds[i]].isActive) {
                activeCategoryIds[index] = categoryIds[i];
                index++;
            }
        }
    }

    /**
     * @notice Get details about a voting category (only active ones)
     */
    function getCategoryDetails(
        string memory _id
    )
        public
        view
        categoryExistsAndActive(_id)
        returns (
            string memory id,
            string memory name,
            string memory description,
            string[] memory categoryPositions,
            bool isActive
        )
    {
        VotingCategory storage category = categories[_id];

        return (
            category.id,
            category.name,
            category.description,
            category.positions,
            category.isActive
        );
    }

    // -------------------------------------------------------------------------
    // CANDIDATE MANAGEMENT
    // -------------------------------------------------------------------------

    /**
     * @notice Add a new candidate (only during setup)
     */
    function addCandidate(
        string memory _name,
        string memory _position,
        string memory _party,
        string memory _category
    )
        public
        onlyAdmin
        electionExists
        electionInSetup
        categoryExistsAndActive(_category)
    {
        // Check if position exists in category
        bool positionExists = false;
        VotingCategory storage cat = categories[_category];

        for (uint256 i = 0; i < cat.positions.length; i++) {
            if (keccak256(bytes(cat.positions[i])) == keccak256(bytes(_position))) {
                positionExists = true;
                break;
            }
        }

        // If position doesn't exist for that category, add it
        if (!positionExists) {
            cat.positions.push(_position);
        }

        candidateCount++;
        Candidate memory newCandidate = Candidate({
            id: candidateCount,
            name: _name,
            position: _position,
            party: _party,
            voteCount: 0,
            categoryId: _category,
            isActive: true
        });

        candidatesById[candidateCount] = newCandidate;
        candidatesByPosition[_position].push(newCandidate);

        // Add position to global list if not exists
        bool positionInListExists = false;
        for (uint256 i = 0; i < positions.length; i++) {
            if (keccak256(bytes(positions[i])) == keccak256(bytes(_position))) {
                positionInListExists = true;
                break;
            }
        }

        if (!positionInListExists) {
            positions.push(_position);
        }

        emit CandidateAdded(candidateCount, _name, _position, _category);
    }

    /**
     * @notice Deactivate (soft delete) a candidate (only during setup)
     */
    function deactivateCandidate(uint256 _candidateId)
        public
        onlyAdmin
        electionExists
        electionInSetup
    {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");

        Candidate storage candidate = candidatesById[_candidateId];
        require(candidate.isActive, "Candidate already inactive");

        candidate.isActive = false;

        // Also mark in the position array
        Candidate[] storage list = candidatesByPosition[candidate.position];
        for (uint256 i = 0; i < list.length; i++) {
            if (list[i].id == _candidateId) {
                list[i].isActive = false;
                break;
            }
        }

        emit CandidateDeactivated(_candidateId);
    }

    // -------------------------------------------------------------------------
    // VOTER MANAGEMENT & VOTING
    // -------------------------------------------------------------------------

    function registerVoter(
        string memory _studentId,
        string memory _department,
        uint256 _yearOfStudy
    ) public voterNotRegistered {
        Voter storage newVoter = voters[msg.sender];
        newVoter.studentId = _studentId;
        newVoter.department = _department;
        newVoter.yearOfStudy = _yearOfStudy;
        newVoter.isRegistered = true;
        newVoter.hasVoted = false;

        registeredVoters.push(msg.sender);
        currentElection.totalVoters++;

        emit VoterRegistered(msg.sender, _studentId);
    }

    function vote(
        uint256 _candidateId
    ) public voterRegistered electionActive {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");

        Candidate storage candidate = candidatesById[_candidateId];
        require(candidate.isActive, "Candidate is not active");

        // Ensure category is still active (extra safety)
        VotingCategory storage cat = categories[candidate.categoryId];
        require(cat.isActive, "Candidate category is not active");

        require(
            !voters[msg.sender].votedForPosition[candidate.position],
            "Already voted for this position"
        );

        // Record the vote for this position
        voters[msg.sender].votedForPosition[candidate.position] = true;

        // Increase candidate vote count (storage reference -> updates mapping)
        candidate.voteCount++;

        // Update candidate in the position array
        Candidate[] storage list = candidatesByPosition[candidate.position];
        for (uint256 i = 0; i < list.length; i++) {
            if (list[i].id == _candidateId) {
                list[i].voteCount++;
                break;
            }
        }

        // First time this voter casts any vote → increase totalVotes
        if (!voters[msg.sender].hasVoted) {
            voters[msg.sender].hasVoted = true;
            currentElection.totalVotes++;
        }

        emit VoteCast(msg.sender, _candidateId, candidate.position);
    }

    // -------------------------------------------------------------------------
    // VIEW FUNCTIONS
    // -------------------------------------------------------------------------

    function getCandidateCountForPosition(
        string memory _position
    ) public view returns (uint256 count) {
        Candidate[] memory list = candidatesByPosition[_position];
        uint256 activeCount = 0;

        for (uint256 i = 0; i < list.length; i++) {
            if (list[i].isActive) {
                activeCount++;
            }
        }
        return activeCount;
    }

    function getCandidate(
        uint256 _candidateId
    )
        public
        view
        returns (
            uint256 id,
            string memory name,
            string memory position,
            string memory party,
            uint256 voteCount,
            string memory categoryId,
            bool isActive
        )
    {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");
        Candidate memory candidate = candidatesById[_candidateId];
        return (
            candidate.id,
            candidate.name,
            candidate.position,
            candidate.party,
            candidate.voteCount,
            candidate.categoryId,
            candidate.isActive
        );
    }

    function getPositions() public view returns (string[] memory allPositions) {
        return positions;
    }

    function getCandidatesForPosition(
        string memory _position
    ) public view returns (uint256[] memory candidateIds) {
        Candidate[] memory list = candidatesByPosition[_position];

        // count active candidates
        uint256 activeCount = 0;
        for (uint256 i = 0; i < list.length; i++) {
            if (list[i].isActive) {
                activeCount++;
            }
        }

        candidateIds = new uint256[](activeCount);
        uint256 idx = 0;

        for (uint256 i = 0; i < list.length; i++) {
            if (list[i].isActive) {
                candidateIds[idx] = list[i].id;
                idx++;
            }
        }
    }

    function hasVotedForPosition(
        address _voter,
        string memory _position
    ) public view returns (bool voted) {
        return voters[_voter].votedForPosition[_position];
    }

    function getElectionResults(
        string memory _position
    )
        public
        view
        returns (
            uint256[] memory candidateIds,
            string[] memory names,
            string[] memory parties,
            uint256[] memory voteCounts
        )
    {
        // Removed validation to allow fetching results anytime

        Candidate[] memory list = candidatesByPosition[_position];

        // include even inactive candidates here for full history
        uint256 count = list.length;

        candidateIds = new uint256[](count);
        names       = new string[](count);
        parties     = new string[](count);
        voteCounts  = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            candidateIds[i] = list[i].id;
            names[i]        = list[i].name;
            parties[i]      = list[i].party;
            voteCounts[i]   = list[i].voteCount;
        }
    }

    function getElectionStats()
        public
        view
        returns (
            uint256 totalRegisteredVoters,
            uint256 totalVotesCast,
            ElectionState electionState
        )
    {
        return (
            currentElection.totalVoters,
            currentElection.totalVotes,
            currentElection.state
        );
    }
}
