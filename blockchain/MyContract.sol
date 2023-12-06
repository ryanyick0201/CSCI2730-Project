// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface MongoDBInterface {
    function userExists(address walletAddress) external view returns (bool);
}

contract InsuranceContract {
    // Enum to represent the claim status
    enum ClaimStatus { Pending, Claimed, Unclaimable }

    // Enum to represetnt the policy class
    enum PolicyClass { Basic, Premium }

    // Hard-coded price and compensation amount
    uint256 BASIC_PRICE = 10000000000000000; //0.01 ETH
    uint256 PREMIUM_PRICE = 20000000000000000; //0.02 ETH

    uint256 BASIC_COMPENSATION_LOW = 30000000000000000; //0.03 ETH
    uint256 BASIC_COMPENSATION_HIGH = 70000000000000000; //0.07 ETH

    uint256 PREMIUM_COMPENSATION_LOW = 60000000000000000; //0.06 ETH
    uint256 PREMIUM_COMPENSATION_HIGH = 150000000000000000; //0.15 ETH

    // Structure to represent a policy
    struct Policy {
        uint256 policyNumber;
        address payable walletAddress; // Reference to user profile in MongoDB
        uint256 departureDate;
        uint256 departureTime;
        string flightNumber;
        uint8 numberOfPersons;
        PolicyClass policyClass;
        ClaimStatus claimStatus;
    }

    // Mapping from policy number to policy
    mapping(uint256 => Policy) internal policies;

    // Event to log contract creation
    event ContractCreated(address walletAddress, string password);

    // Event to log policy creation
    event PolicyCreated(uint256 policyNumber, address walletAddress, uint256 departureDate, uint256 departureTime, string flightNumber, uint8 numberOfPersons, PolicyClass policyClass, ClaimStatus claimStatus);

    // Event to log policy claim
    event PolicyClaimed(uint256 policyNumber, address walletAddress, string policyClass);

    // Policy number
    uint256 _policyNumber;

    //The owner's address
    address private owner;

    constructor() {
        _policyNumber = 1;
        owner = msg.sender;
    }
  
    //TODO: add value transfer; transaction message (exception handling)
    
    // Function to create a new policy
    function createPolicy(
        uint256 departureDate,
        uint256 departureTime,
        string memory flightNumber,
        uint8 numberOfPersons, 
        PolicyClass policyClass
    ) external payable returns(uint256, address)  {
        // Ensure correct payment amount (0.001 ETH)
        uint256 requiredAmt;
        if (policyClass == PolicyClass.Basic)
            requiredAmt = BASIC_PRICE * numberOfPersons;
        else if (policyClass == PolicyClass.Premium)
            requiredAmt = PREMIUM_PRICE * numberOfPersons;
        
        require(msg.value == requiredAmt && requiredAmt > 0, "Incorrect payment amount");

        // Create a new policy
        uint256 policyNumber = _policyNumber; // Use a more robust method for generating policy numbers
        _policyNumber ++;

        policies[policyNumber] = Policy(policyNumber, payable(msg.sender), departureDate, departureTime, flightNumber, numberOfPersons, policyClass, ClaimStatus.Pending);

        // Emit an event to log policy creation
        emit PolicyCreated(policyNumber, msg.sender, departureDate, departureTime, flightNumber, numberOfPersons, policyClass, ClaimStatus.Pending);

        return (policyNumber, msg.sender);
    }

    // Function to view policy details by policy ID
    function viewPolicyByID(uint256 policyNumber) external view returns (
        uint256,
        uint256,
        uint256,
        string memory,
        uint8,
        PolicyClass,
        ClaimStatus
    ) {
        // Retrieve the policy
        Policy storage policy = policies[policyNumber];

        // Ensure the policy exists
        require(policy.policyNumber != 0, "Policy not found");

        // Return policy details
        return (
            policy.policyNumber,
            policy.departureDate,
            policy.departureTime,
            policy.flightNumber,
            policy.numberOfPersons,
            policy.policyClass,
            policy.claimStatus
        );
    }

    // Function to view policies by wallet address
    function viewPolicyByWallet(address walletAddress) external view returns (uint256[] memory) {
        // Get the number of policies for the wallet address
      
        uint256 numberOfPolicies = 0;
        for (uint256 i = 0; i < _policyNumber; i++) {
            if (policies[i].walletAddress == walletAddress) {
                numberOfPolicies++;
            }
        }

        // Initialize arrays to store policy details
        uint256[] memory policyNumbers = new uint256[](numberOfPolicies);

        // Populate arrays with policy details
        uint256 index = 0;
        for (uint256 i = 0; i < _policyNumber; i++) {
            if (policies[i].walletAddress == walletAddress) {
                policyNumbers[index] = policies[i].policyNumber;
                index++;
            }
        }

        return policyNumbers;
    }

    // Function to claim a policy
    //TODO: claim processes only when it is possible
    function claim(uint256 policyNumber, bool isSmallDelay, bool isLargeDelay, bool isValidClaim) external {      
        // Ensure the account holder owns the policy
        require(msg.sender == policies[policyNumber].walletAddress, "You are not the policy holder");

        // Ensure the policy exists
        require(policyNumber < _policyNumber, "Policy does not exist");

        // Ensure that the policy to be claimed is claimable
        require(policies[policyNumber].claimStatus == ClaimStatus.Pending, "Policy cannot be claimed");

        if (!isValidClaim){
            policies[policyNumber].claimStatus = ClaimStatus.Unclaimable;
        } else {
            // Payout to the user's wallet
            address payable _to = payable(msg.sender);
            
            // Compute the compensation amount
            uint256 compensationAmt;
            if (isSmallDelay && policies[policyNumber].policyClass == PolicyClass.Basic){
                compensationAmt = BASIC_COMPENSATION_LOW;
            } else if (isLargeDelay && policies[policyNumber].policyClass == PolicyClass.Basic){
                compensationAmt = BASIC_COMPENSATION_HIGH;
            } else if (isSmallDelay){
                compensationAmt = PREMIUM_COMPENSATION_LOW;
            } else {
                compensationAmt = PREMIUM_COMPENSATION_HIGH;
            }

            _to.transfer(compensationAmt);


            // Update claim status
            policies[policyNumber].claimStatus = ClaimStatus.Claimed;
        }

    }

    function injectMoney() public payable{
        require(msg.sender == owner, "Only the owner can call this function");
    }
}