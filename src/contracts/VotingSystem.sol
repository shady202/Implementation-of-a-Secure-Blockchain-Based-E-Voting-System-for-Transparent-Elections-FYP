// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VotingSystem {
    enum ElectionState { None, Created, Active, Ended }

    struct Election {
        string title;
        uint256 startTime;
        uint256 endTime;
        ElectionState state;
        uint256 totalVoters;
        uint256 totalVotes; // total votes cast (each category vote counts)
    }

    struct Category {
        uint256 id;          // auto-generated: 1,2,3...
        string name;
        string description;
        bool isActive;
        bool exists;
    }

    struct Candidate {
        uint256 id;          // sub-id within the category (1..n)
        string name;
        string party;
        uint256 voteCount;
        bool isActive;
        bool exists;
    }

    struct Voter {
        string studentId;
        string department;
        uint256 yearOfStudy;
        bool isRegistered;
        mapping(uint256 => bool) votedInCategory; // categoryId => voted?
    }

    address public admin;
    Election public currentElection;

    // voters
    mapping(address => Voter) private voters;
    address[] public registeredVoters;

    // categories
    uint256 public categoryCount;
    mapping(uint256 => Category) private categories;
    uint256[] private categoryIds; // list for iteration

    // candidates (per category)
    mapping(uint256 => uint256) private nextCandidateId; // categoryId => next candidate sub-id
    mapping(uint256 => mapping(uint256 => Candidate)) private candidates; // categoryId => (candidateId => Candidate)
    mapping(uint256 => uint256[]) private candidateIdsByCategory; // categoryId => list of candidate sub-ids

    // ---------------- EVENTS ----------------
    event ElectionCreated(string title, uint256 startTime, uint256 endTime);
    event ElectionStarted(uint256 timestamp);
    event ElectionEnded(uint256 timestamp);

    event CategoryCreated(uint256 indexed categoryId, string name);
    event CategoryUpdated(uint256 indexed categoryId, string name, bool isActive);
    event CategoryDeactivated(uint256 indexed categoryId);

    event CandidateAdded(uint256 indexed categoryId, uint256 indexed candidateId, string name);
    event CandidateDeactivated(uint256 indexed categoryId, uint256 indexed candidateId);

    event VoterRegistered(address indexed voterAddress, string studentId);
    event VoteCast(address indexed voter, uint256 indexed categoryId, uint256 indexed candidateId);

    event SystemReset(uint256 timestamp);

    // -------------- MODIFIERS --------------
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    modifier electionExists() {
        require(currentElection.state != ElectionState.None, "No election created");
        _;
    }

    modifier electionInSetup() {
        require(currentElection.state == ElectionState.Created, "Setup locked");
        _;
    }

    modifier electionActive() {
        require(currentElection.state == ElectionState.Active, "Election not active");
        require(block.timestamp >= currentElection.startTime, "Not started");
        require(block.timestamp <= currentElection.endTime, "Ended");
        _;
    }

    modifier electionNotEnded() {
        require(currentElection.state != ElectionState.Ended, "Election ended");
        _;
    }

    modifier categoryExists(uint256 categoryId) {
        require(categories[categoryId].exists, "Category not found");
        _;
    }

    modifier categoryActive(uint256 categoryId) {
        require(categories[categoryId].exists, "Category not found");
        require(categories[categoryId].isActive, "Category inactive");
        _;
    }

    constructor() {
        admin = msg.sender;

        // مبدئيًا مفيش Election
        currentElection.state = ElectionState.None;
    }

    // ---------------- ELECTION ----------------

    // تعمل Election واحدة فقط، بعد ما تعمل Reset
    function createElection(
        string memory title,
        uint256 startTime,
        uint256 endTime
    ) external onlyAdmin {
        require(currentElection.state == ElectionState.None, "Reset first");
        require(bytes(title).length > 0, "Title required");
        require(startTime < endTime, "Invalid time range");
        require(startTime >= block.timestamp, "Start in past");

        currentElection = Election({
            title: title,
            startTime: startTime,
            endTime: endTime,
            state: ElectionState.Created,
            totalVoters: 0,
            totalVotes: 0
        });

        emit ElectionCreated(title, startTime, endTime);
    }

    function startElection() external onlyAdmin electionExists {
        require(currentElection.state == ElectionState.Created, "Cannot start");
        currentElection.state = ElectionState.Active;
        emit ElectionStarted(block.timestamp);
    }

    function endElection() external onlyAdmin electionExists {
        require(currentElection.state == ElectionState.Active, "Not active");
        currentElection.state = ElectionState.Ended;
        emit ElectionEnded(block.timestamp);
    }

    // بعد ما الانتخابات تنتهي، الأدمن يعمل Reset يمسح كل حاجة ويبدأ من جديد
    function resetSystem() external onlyAdmin electionExists {
        require(currentElection.state == ElectionState.Ended, "End election first");

        _resetAllCandidates();
        _resetAllCategories();
        _resetAllVoters();

        // امسح بيانات الElection نفسها
        delete currentElection;
        currentElection.state = ElectionState.None;

        emit SystemReset(block.timestamp);
    }

    // ---------------- CATEGORIES (DYNAMIC) ----------------

    function createCategory(
        string memory name,
        string memory description
    )
        external
        onlyAdmin
        electionExists
        electionInSetup
        returns (uint256 newCategoryId)
    {
        require(bytes(name).length > 0, "Category name required");

        categoryCount++;
        newCategoryId = categoryCount;

        categories[newCategoryId] = Category({
            id: newCategoryId,
            name: name,
            description: description,
            isActive: true,
            exists: true
        });

        categoryIds.push(newCategoryId);

        emit CategoryCreated(newCategoryId, name);
        emit CategoryUpdated(newCategoryId, name, true);
    }

    function updateCategory(
        uint256 categoryId,
        string memory name,
        string memory description,
        bool isActive
    )
        external
        onlyAdmin
        electionExists
        electionInSetup
        categoryExists(categoryId)
    {
        Category storage c = categories[categoryId];
        c.name = name;
        c.description = description;
        c.isActive = isActive;

        emit CategoryUpdated(categoryId, name, isActive);
    }

    function deactivateCategory(uint256 categoryId)
        external
        onlyAdmin
        electionExists
        electionInSetup
        categoryActive(categoryId)
    {
        categories[categoryId].isActive = false;
        emit CategoryDeactivated(categoryId);
    }

    function getCategory(uint256 categoryId)
        external
        view
        categoryExists(categoryId)
        returns (uint256 id, string memory name, string memory description, bool isActive)
    {
        Category memory c = categories[categoryId];
        return (c.id, c.name, c.description, c.isActive);
    }

    function getAllCategories()
        external
        view
        returns (Category[] memory)
    {
        // يرجّع الكاتيجوريز النشطة فقط
        uint256 activeCount = 0;
        for (uint256 i = 0; i < categoryIds.length; i++) {
            if (categories[categoryIds[i]].isActive) activeCount++;
        }

        Category[] memory arr = new Category[](activeCount);
        uint256 idx = 0;

        for (uint256 i = 0; i < categoryIds.length; i++) {
            uint256 id_ = categoryIds[i];
            if (!categories[id_].isActive) continue;
            arr[idx] = categories[id_];
            idx++;
        }

        return arr;
    }

    // ---------------- CANDIDATES (SUB-IDs per category) ----------------

    function addCandidate(
        uint256 categoryId,
        string memory name,
        string memory party
    )
        external
        onlyAdmin
        electionExists
        electionInSetup
        categoryActive(categoryId)
        returns (uint256 newCandidateId)
    {
        require(bytes(name).length > 0, "Name required");

        newCandidateId = ++nextCandidateId[categoryId];

        candidates[categoryId][newCandidateId] = Candidate({
            id: newCandidateId,
            name: name,
            party: party,
            voteCount: 0,
            isActive: true,
            exists: true
        });

        candidateIdsByCategory[categoryId].push(newCandidateId);

        emit CandidateAdded(categoryId, newCandidateId, name);
    }

    function deactivateCandidate(uint256 categoryId, uint256 candidateId)
        external
        onlyAdmin
        electionExists
        electionInSetup
        categoryExists(categoryId)
    {
        Candidate storage c = candidates[categoryId][candidateId];
        require(c.exists, "Candidate not found");
        require(c.isActive, "Already inactive");

        c.isActive = false;
        emit CandidateDeactivated(categoryId, candidateId);
    }

    function getCandidatesForCategory(uint256 categoryId)
        external
        view
        categoryExists(categoryId)
        returns (
            uint256[] memory ids,
            string[] memory names,
            string[] memory parties,
            uint256[] memory votes
        )
    {
        uint256[] memory raw = candidateIdsByCategory[categoryId];

        // count active
        uint256 activeCount = 0;
        for (uint256 i = 0; i < raw.length; i++) {
            if (candidates[categoryId][raw[i]].isActive) activeCount++;
        }

        ids = new uint256[](activeCount);
        names = new string[](activeCount);
        parties = new string[](activeCount);
        votes = new uint256[](activeCount);

        uint256 idx = 0;
        for (uint256 i = 0; i < raw.length; i++) {
            Candidate memory c = candidates[categoryId][raw[i]];
            if (!c.isActive) continue;

            ids[idx] = c.id;
            names[idx] = c.name;
            parties[idx] = c.party;
            votes[idx] = c.voteCount;
            idx++;
        }
    }

    // ---------------- VOTERS + VOTING ----------------

    function registerVoter(
        string memory studentId,
        string memory department,
        uint256 yearOfStudy
    ) external electionExists electionNotEnded {
        Voter storage v = voters[msg.sender];
        require(!v.isRegistered, "Already registered");

        v.studentId = studentId;
        v.department = department;
        v.yearOfStudy = yearOfStudy;
        v.isRegistered = true;

        registeredVoters.push(msg.sender);
        currentElection.totalVoters++;

        emit VoterRegistered(msg.sender, studentId);
    }

    // vote: 1 per category
    function vote(uint256 categoryId, uint256 candidateId)
        external
        electionExists
        electionActive
        categoryActive(categoryId)
    {
        Voter storage v = voters[msg.sender];
        require(v.isRegistered, "Not registered");
        require(!v.votedInCategory[categoryId], "Already voted in category");

        Candidate storage c = candidates[categoryId][candidateId];
        require(c.exists, "Candidate not found");
        require(c.isActive, "Candidate inactive");

        v.votedInCategory[categoryId] = true;
        c.voteCount++;
        currentElection.totalVotes++;

        emit VoteCast(msg.sender, categoryId, candidateId);
    }

    function hasVotedInCategory(address voter, uint256 categoryId)
        external
        view
        returns (bool)
    {
        return voters[voter].votedInCategory[categoryId];
    }

    // -------------- INTERNAL RESET --------------

    function _resetAllCandidates() internal {
        for (uint256 i = 0; i < categoryIds.length; i++) {
            uint256 catId = categoryIds[i];

            uint256[] storage ids = candidateIdsByCategory[catId];
            for (uint256 j = 0; j < ids.length; j++) {
                delete candidates[catId][ids[j]];
            }

            delete candidateIdsByCategory[catId];
            nextCandidateId[catId] = 0;
        }
    }

    function _resetAllCategories() internal {
        for (uint256 i = 0; i < categoryIds.length; i++) {
            uint256 catId = categoryIds[i];
            delete categories[catId];
        }

        delete categoryIds;
        categoryCount = 0;
    }

    function _resetAllVoters() internal {
        for (uint256 i = 0; i < registeredVoters.length; i++) {
            address voterAddr = registeredVoters[i];
            delete voters[voterAddr]; // ده بيمسح كمان votedInCategory mapping
        }

        delete registeredVoters;
    }
}
