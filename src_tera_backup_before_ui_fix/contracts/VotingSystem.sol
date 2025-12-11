// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title  University Election Voting System
 * @dev Smart contract for managing university elections with secure voting
 */
contract VotingSystem {
    // Election status enum
    enum ElectionState { Created, Active, Ended }

    // Candidate struct
    struct Candidate {
        uint256 id;
        string name;
        string position;
        string party;
        uint256 voteCount;
    }

    // Voter struct
    struct Voter {
        string studentId;
        string department;
        uint256 yearOfStudy;
        bool isRegistered;
        bool hasVoted;
        mapping(string => bool) votedForPosition;
    }

    // Election struct
    struct Election {
        string title;
        uint256 startTime;
        uint256 endTime;
        ElectionState state;
        uint256 totalVoters;
        uint256 totalVotes;
    }

    // Voting category struct
    struct VotingCategory {
        string id;
        string name;
        string description;
        string[] positions;
        bool isActive;
    }

    // State
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
    event CandidateAdded(uint256 indexed candidateId, string name, string position);
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

    modifier categoryExists(string memory _id) {
        // لازم يكون id متخزن و الـ category لسه Active
        require(
            bytes(categories[_id].id).length > 0 && categories[_id].isActive,
            "Category does not exist"
        );
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // ===== Election management =====

    function createElection(
        string memory _title,
        uint256 _startTime,
        uint256 _endTime
    ) public onlyAdmin {
        require(_startTime < _endTime, "End time must be after start time");
        require(_startTime >= block.timestamp, "Start time cannot be in the past");

        // Reset previous election data if any
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

    function startElection() public onlyAdmin electionExists {
        require(currentElection.state == ElectionState.Created, "Election cannot be started");
        currentElection.state = ElectionState.Active;
        emit ElectionStarted(block.timestamp);
    }

    function endElection() public onlyAdmin electionExists {
        require(currentElection.state == ElectionState.Active, "Election is not active");
        currentElection.state = ElectionState.Ended;
        emit ElectionEnded(block.timestamp);
    }

    // ===== Category management =====

    function addCategory(
        string memory _id,
        string memory _name,
        string memory _description,
        string[] memory _positions
    ) public onlyAdmin {
        require(bytes(categories[_id].id).length == 0, "Category ID already exists");

        // Count active categories to enforce maximum of 3
        uint256 activeCount = 0;
        for (uint256 i = 0; i < categoryIds.length; i++) {
            if (categories[categoryIds[i]].isActive) {
                activeCount++;
            }
        }
        require(activeCount < 3, "Maximum of 3 active categories allowed per election");

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

    function removeCategory(string memory _id) public onlyAdmin categoryExists(_id) {
        categories[_id].isActive = false;
        emit CategoryRemoved(_id);
    }

    function getCategories() public view returns (string[] memory activeCategoryIds) {
        uint256 activeCount = 0;

        // Count active categories
        for (uint256 i = 0; i < categoryIds.length; i++) {
            if (categories[categoryIds[i]].isActive) {
                activeCount++;
            }
        }

        activeCategoryIds = new string[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < categoryIds.length; i++) {
            if (categories[categoryIds[i]].isActive) {
                activeCategoryIds[index] = categoryIds[i];
                index++;
            }
        }
    }

    function getCategoryDetails(
        string memory _id
    )
        public
        view
        categoryExists(_id)
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

    // ===== Candidate management =====

    function addCandidate(
        string memory _name,
        string memory _position,
        string memory _party,
        string memory _category
    ) public onlyAdmin electionExists categoryExists(_category) {
        require(
            currentElection.state == ElectionState.Created,
            "Cannot add candidates after election has started"
        );

        // Check if position exists in category
        bool positionExists = false;
        for (uint256 i = 0; i < categories[_category].positions.length; i++) {
            if (
                keccak256(bytes(categories[_category].positions[i])) ==
                keccak256(bytes(_position))
            ) {
                positionExists = true;
                break;
            }
        }

        // If position doesn't exist, add it to the category
        if (!positionExists) {
            categories[_category].positions.push(_position);
        }

        candidateCount++;
        Candidate memory newCandidate = Candidate({
            id: candidateCount,
            name: _name,
            position: _position,
            party: _party,
            voteCount: 0
        });

        candidatesById[candidateCount] = newCandidate;
        candidatesByPosition[_position].push(newCandidate);

        // Add position if it doesn't exist in global list
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

        emit CandidateAdded(candidateCount, _name, _position);
    }

    // ===== Voter management & voting =====

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
        require(
            !voters[msg.sender].votedForPosition[candidate.position],
            "Already voted for this position"
        );

        voters[msg.sender].votedForPosition[candidate.position] = true;

        // Increase vote count in storage
        candidate.voteCount++;

        // Sync candidate in the position array
        Candidate[] storage list = candidatesByPosition[candidate.position];
        for (uint256 i = 0; i < list.length; i++) {
            if (list[i].id == _candidateId) {
                list[i].voteCount++;
                break;
            }
        }

        if (!voters[msg.sender].hasVoted) {
            voters[msg.sender].hasVoted = true;
            currentElection.totalVotes++;
        }

        emit VoteCast(msg.sender, _candidateId, candidate.position);
    }

    // ===== View helpers =====

    function getCandidateCountForPosition(
        string memory _position
    ) public view returns (uint256 count) {
        return candidatesByPosition[_position].length;
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
            uint256 voteCount
        )
    {
        require(_candidateId > 0 && _candidateId <= candidateCount, "Invalid candidate ID");
        Candidate memory candidate = candidatesById[_candidateId];
        return (
            candidate.id,
            candidate.name,
            candidate.position,
            candidate.party,
            candidate.voteCount
        );
    }

    function getPositions() public view returns (string[] memory allPositions) {
        return positions;
    }

    function getCandidatesForPosition(
        string memory _position
    ) public view returns (uint256[] memory candidateIds) {
        Candidate[] memory candidates = candidatesByPosition[_position];
        candidateIds = new uint256[](candidates.length);

        for (uint256 i = 0; i < candidates.length; i++) {
            candidateIds[i] = candidates[i].id;
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
        require(
            currentElection.state == ElectionState.Ended,
            "Results are only available after election ends"
        );

        Candidate[] memory candidates = candidatesByPosition[_position];
        uint256 count = candidates.length;

        candidateIds = new uint256[](count);
        names = new string[](count);
        parties = new string[](count);
        voteCounts = new uint256[](count);

        for (uint256 i = 0; i < count; i++) {
            candidateIds[i] = candidates[i].id;
            names[i] = candidates[i].name;
            parties[i] = candidates[i].party;
            voteCounts[i] = candidates[i].voteCount;
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
