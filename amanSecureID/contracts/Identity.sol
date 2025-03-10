// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SecureID Identity Contract
 * @dev Implements ERC-725 for identity management and ERC-721 for NFT-based ID cards
 * @notice This contract creates NFT-based identity cards that can be stored in MetaMask
 */
contract SecureIDIdentity is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    
    // Identity data structure
    struct Identity {
        address owner;
        string did;
        uint256 tokenId;
        address[] guardians;
        uint256 recoveryThreshold;
        bool isRecovering;
        mapping(address => bool) guardianApprovals;
        uint256 recoveryInitiatedAt;
    }
    
    // Mapping from address to Identity
    mapping(address => Identity) private _identities;
    
    // Mapping from DID to address
    mapping(string => address) private _didToAddress;
    
    // Recovery period in seconds (default: 3 days)
    uint256 public recoveryPeriod = 3 days;
    
    // Events
    event IdentityCreated(address indexed owner, string did, uint256 tokenId);
    event GuardianAdded(address indexed identity, address guardian);
    event GuardianRemoved(address indexed identity, address guardian);
    event RecoveryInitiated(address indexed identity, address initiator);
    event RecoveryApproved(address indexed identity, address guardian);
    event RecoveryExecuted(address indexed oldOwner, address indexed newOwner, string did);
    event RecoveryCancelled(address indexed identity);
    
    constructor() ERC721("SecureID", "SID") {}
    
    /**
     * @dev Creates a new identity with an NFT-based ID card
     * @param did The decentralized identifier for the identity
     * @param tokenURI The metadata URI for the NFT ID card
     * @return The token ID of the newly created identity NFT
     */
    function createIdentity(string memory did, string memory tokenURI) external returns (uint256) {
        require(_didToAddress[did] == address(0), "DID already exists");
        require(bytes(_identities[msg.sender].did).length == 0, "Identity already exists for this address");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        // Mint NFT ID card
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        
        // Create identity
        Identity storage identity = _identities[msg.sender];
        identity.owner = msg.sender;
        identity.did = did;
        identity.tokenId = newTokenId;
        identity.recoveryThreshold = 2; // Default threshold
        
        // Map DID to address
        _didToAddress[did] = msg.sender;
        
        emit IdentityCreated(msg.sender, did, newTokenId);
        
        return newTokenId;
    }
    
    /**
     * @dev Adds a guardian for social recovery
     * @param guardian The address of the guardian
     */
    function addGuardian(address guardian) external {
        require(bytes(_identities[msg.sender].did).length > 0, "Identity does not exist");
        require(guardian != address(0), "Invalid guardian address");
        require(guardian != msg.sender, "Cannot add self as guardian");
        
        Identity storage identity = _identities[msg.sender];
        
        // Check if guardian already exists
        for (uint i = 0; i < identity.guardians.length; i++) {
            require(identity.guardians[i] != guardian, "Guardian already exists");
        }
        
        identity.guardians.push(guardian);
        emit GuardianAdded(msg.sender, guardian);
    }
    
    /**
     * @dev Removes a guardian
     * @param guardian The address of the guardian to remove
     */
    function removeGuardian(address guardian) external {
        require(bytes(_identities[msg.sender].did).length > 0, "Identity does not exist");
        
        Identity storage identity = _identities[msg.sender];
        bool found = false;
        uint indexToRemove;
        
        for (uint i = 0; i < identity.guardians.length; i++) {
            if (identity.guardians[i] == guardian) {
                indexToRemove = i;
                found = true;
                break;
            }
        }
        
        require(found, "Guardian not found");
        
        // Remove guardian by replacing with the last element and popping
        identity.guardians[indexToRemove] = identity.guardians[identity.guardians.length - 1];
        identity.guardians.pop();
        
        emit GuardianRemoved(msg.sender, guardian);
    }
    
    /**
     * @dev Sets the recovery threshold
     * @param threshold The number of guardians required for recovery
     */
    function setRecoveryThreshold(uint256 threshold) external {
        require(bytes(_identities[msg.sender].did).length > 0, "Identity does not exist");
        Identity storage identity = _identities[msg.sender];
        
        require(threshold > 0, "Threshold must be greater than 0");
        require(threshold <= identity.guardians.length, "Threshold cannot exceed number of guardians");
        
        identity.recoveryThreshold = threshold;
    }
    
    /**
     * @dev Initiates the recovery process
     * @param identityOwner The address of the identity to recover
     * @param newOwner The new owner address
     */
    function initiateRecovery(address identityOwner, address newOwner) external {
        require(bytes(_identities[identityOwner].did).length > 0, "Identity does not exist");
        require(newOwner != address(0), "Invalid new owner address");
        
        Identity storage identity = _identities[identityOwner];
        
        // Check if caller is a guardian
        bool isGuardian = false;
        for (uint i = 0; i < identity.guardians.length; i++) {
            if (identity.guardians[i] == msg.sender) {
                isGuardian = true;
                break;
            }
        }
        
        require(isGuardian, "Only guardians can initiate recovery");
        require(!identity.isRecovering, "Recovery already in progress");
        
        // Initialize recovery
        identity.isRecovering = true;
        identity.recoveryInitiatedAt = block.timestamp;
        
        // Reset approvals and approve from initiator
        for (uint i = 0; i < identity.guardians.length; i++) {
            identity.guardianApprovals[identity.guardians[i]] = false;
        }
        
        identity.guardianApprovals[msg.sender] = true;
        
        emit RecoveryInitiated(identityOwner, msg.sender);
    }
    
    /**
     * @dev Approves a recovery process
     * @param identityOwner The address of the identity being recovered
     */
    function approveRecovery(address identityOwner) external {
        require(bytes(_identities[identityOwner].did).length > 0, "Identity does not exist");
        
        Identity storage identity = _identities[identityOwner];
        
        // Check if caller is a guardian
        bool isGuardian = false;
        for (uint i = 0; i < identity.guardians.length; i++) {
            if (identity.guardians[i] == msg.sender) {
                isGuardian = true;
                break;
            }
        }
        
        require(isGuardian, "Only guardians can approve recovery");
        require(identity.isRecovering, "No recovery in progress");
        require(!identity.guardianApprovals[msg.sender], "Already approved");
        
        identity.guardianApprovals[msg.sender] = true;
        
        emit RecoveryApproved(identityOwner, msg.sender);
    }
    
    /**
     * @dev Executes the recovery process, transferring the identity to a new owner
     * @param identityOwner The address of the identity being recovered
     * @param newOwner The new owner address
     */
    function executeRecovery(address identityOwner, address newOwner) external {
        require(bytes(_identities[identityOwner].did).length > 0, "Identity does not exist");
        require(newOwner != address(0), "Invalid new owner address");
        
        Identity storage identity = _identities[identityOwner];
        
        require(identity.isRecovering, "No recovery in progress");
        require(block.timestamp >= identity.recoveryInitiatedAt + recoveryPeriod, "Recovery period not elapsed");
        
        // Count approvals
        uint256 approvalCount = 0;
        for (uint i = 0; i < identity.guardians.length; i++) {
            if (identity.guardianApprovals[identity.guardians[i]]) {
                approvalCount++;
            }
        }
        
        require(approvalCount >= identity.recoveryThreshold, "Not enough guardian approvals");
        
        // Transfer NFT
        _transfer(identityOwner, newOwner, identity.tokenId);
        
        // Update mappings
        string memory did = identity.did;
        _didToAddress[did] = newOwner;
        
        // Create new identity for new owner
        Identity storage newIdentity = _identities[newOwner];
        newIdentity.owner = newOwner;
        newIdentity.did = did;
        newIdentity.tokenId = identity.tokenId;
        
        // Copy guardians
        for (uint i = 0; i < identity.guardians.length; i++) {
            newIdentity.guardians.push(identity.guardians[i]);
        }
        
        newIdentity.recoveryThreshold = identity.recoveryThreshold;
        
        // Reset old identity
        delete _identities[identityOwner];
        
        emit RecoveryExecuted(identityOwner, newOwner, did);
    }
    
    /**
     * @dev Get identity information for an address
     * @param owner The address to get identity information for
     * @return did The DID associated with the address
     * @return tokenId The token ID of the NFT identity card
     * @return uri The token URI containing metadata for the NFT
     */
    function getIdentity(address owner) external view returns (string memory, uint256, string memory) {
        Identity storage identity = _identities[owner];
        require(bytes(identity.did).length > 0, "Identity does not exist");
        
        string memory uri = tokenURI(identity.tokenId);
        return (identity.did, identity.tokenId, uri);
    }
    
    /**
     * @dev Cancels an ongoing recovery process
     */
    function cancelRecovery() external {
        require(bytes(_identities[msg.sender].did).length > 0, "Identity does not exist");
        
        Identity storage identity = _identities[msg.sender];
        require(identity.isRecovering, "No recovery in progress");
        
        identity.isRecovering = false;
        
        // Reset approvals
        for (uint i = 0; i < identity.guardians.length; i++) {
            identity.guardianApprovals[identity.guardians[i]] = false;
        }
        
        emit RecoveryCancelled(msg.sender);
    }
    
    /**
     * @dev Gets the DID for an address
     * @param addr The address to query
     * @return The DID associated with the address
     */
    function getDID(address addr) external view returns (string memory) {
        return _identities[addr].did;
    }
    
    /**
     * @dev Gets the address for a DID
     * @param did The DID to query
     * @return The address associated with the DID
     */
    function getAddress(string memory did) external view returns (address) {
        return _didToAddress[did];
    }
    
    /**
     * @dev Gets the guardians for an identity
     * @param identityOwner The address of the identity
     * @return The list of guardian addresses
     */
    function getGuardians(address identityOwner) external view returns (address[] memory) {
        return _identities[identityOwner].guardians;
    }
    
    /**
     * @dev Gets the recovery threshold for an identity
     * @param identityOwner The address of the identity
     * @return The recovery threshold
     */
    function getRecoveryThreshold(address identityOwner) external view returns (uint256) {
        return _identities[identityOwner].recoveryThreshold;
    }
    
    /**
     * @dev Checks if an identity is in recovery mode
     * @param identityOwner The address of the identity
     * @return True if in recovery mode, false otherwise
     */
    function isRecovering(address identityOwner) external view returns (bool) {
        return _identities[identityOwner].isRecovering;
    }
}

