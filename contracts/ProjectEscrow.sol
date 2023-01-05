// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.17;

contract ProjectEscrowContract {
    enum ProjectType {
        Hourly,
        Fixed
    }
    enum ProjectStatus {
        Created,
        InProgress,
        Completed
    }

    struct Payment {
        uint256 amount;
        uint256 timestamp;
    }

    struct Project {
        uint256 id;
        ProjectType projectType;
        ProjectStatus status;
        address client;
        address payable freelancer;
        uint256 amount;
        Payment payments;
    }

    uint8 public feePercentage = 10;

    mapping(address => mapping(uint256 => Project)) internal projects;

    constructor() {}

    event ProjectCreated(uint256 projectId, uint256 _amount);

    function createProject(
        uint256 projectId,
        ProjectType _type,
        uint256 _amount
    ) external projectNotExists(projectId) {
        projects[msg.sender][projectId] = Project({
            id: projectId,
            projectType: _type,
            status: ProjectStatus.Created,
            client: msg.sender,
            amount: _amount,
            freelancer: payable(address(0)),
            payments: Payment({amount: 0, timestamp: 0})
        });
        emit ProjectCreated(projectId, _amount);
    }

    event ProjectAssigned(uint256 projectId, address _freelancer);

    function projectAssigned(
        uint256 projectId,
        address payable _freelancer
    )
        external
        payable
        projectExists(projectId)
        projectShouldBeCreated(projectId)
        shouldbeClient(projectId)
        shouldHaveEnoughBalance(projectId)
    {
        projects[msg.sender][projectId].status = ProjectStatus.InProgress;
        projects[msg.sender][projectId].freelancer = _freelancer;
        emit ProjectAssigned(projectId, _freelancer);
    }

    event ProjectCompleted(uint256 projectId, uint256 _amount);

    function projectCompleted(
        uint256 projectId
    )
        external
        projectExists(projectId)
        projectShouldBeInProgress(projectId)
        shouldbeClient(projectId)
    {
        projects[msg.sender][projectId].status = ProjectStatus.Completed;
        uint256 dispersedAmount = projects[msg.sender][projectId].amount -
            ((projects[msg.sender][projectId].amount * feePercentage) / 100);
        (bool isTransferred, ) = projects[msg.sender][projectId]
            .freelancer
            .call{value: dispersedAmount}("");
        require(
            isTransferred,
            "Can't marked project as done due to transfer failure"
        );
        projects[msg.sender][projectId].payments.amount = dispersedAmount;
        projects[msg.sender][projectId].payments.timestamp = block.timestamp;

        emit ProjectCompleted(projectId, dispersedAmount);
    }

    function getProject(
        uint256 projectId
    ) external view returns (Project memory) {
        return projects[msg.sender][projectId];
    }

    function getBalance(
        address addressToCheckBalance
    ) external view returns (uint256) {
        return addressToCheckBalance.balance;
    }

    modifier shouldHaveEnoughBalance(uint256 projectId) {
        require(
            msg.value >= projects[msg.sender][projectId].amount,
            "Not enough balance"
        );
        _;
    }

    modifier projectNotExists(uint256 projectId) {
        require(
            projects[msg.sender][projectId].id == 0,
            "Project already exists"
        );
        _;
    }

    modifier projectExists(uint256 projectId) {
        require(
            projects[msg.sender][projectId].id == projectId,
            "Project already exists"
        );
        _;
    }

    modifier projectShouldBeCreated(uint256 projectId) {
        require(
            projects[msg.sender][projectId].status == ProjectStatus.Created,
            "Project is not in created"
        );
        _;
    }

    modifier projectShouldBeInProgress(uint256 projectId) {
        require(
            projects[msg.sender][projectId].status == ProjectStatus.InProgress,
            "Project is not in In progress"
        );
        _;
    }

    modifier shouldbeClient(uint256 projectId) {
        require(
            projects[msg.sender][projectId].client == msg.sender,
            "Only Project owner can assign freelancer"
        );
        _;
    }
}
