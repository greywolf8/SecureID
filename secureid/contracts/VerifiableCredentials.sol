// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

/**
 * @title SecureID Verifiable Credentials Contract
 * @dev Manages the issuance and verification of verifiable credentials
 */
contract SecureIDCredentials is Ownable {
    using ECDSA for bytes32;
    
    // Credential status
    enum CredentialStatus { Valid, Revoked }
    
    // Credential data structure
    struct Credential {
        bytes32 id;
        address issuer;
        address subject;
        bytes32 schemaId;
        uint256 issuedAt;
        uint256 expiresAt;
        CredentialStatus status;
    }
    
    // Mapping from credential ID to Credential
    mapping(bytes32 => Credential) private _credentials;
    
    // Mapping from issuer to approved status
    mapping(address => bool) private _approvedIssuers;
    
    // Events
    event CredentialIssued(bytes32 indexed id, address indexed issuer, address indexed subject, bytes32 schemaId);
    event CredentialRevoked(bytes32 indexed id, address indexed issuer);
    event IssuerApproved(address indexed issuer);
    event IssuerRevoked(address indexed issuer);
    
    /**
     * @dev Approves an issuer to issue credentials
     * @param issuer The address of the issuer
     */
    function approveIssuer(address issuer) external onlyOwner {
        require(issuer != address(0), "Invalid issuer address");
        require(!_approvedIssuers[issuer], "Issuer already approved");
        
        _approvedIssuers[issuer] = true;
        
        emit IssuerApproved(issuer);
    }
    
    /**
     * @dev Revokes an issuer's approval
     * @param issuer The address of the issuer
     */
    function revokeIssuer(address issuer) external onlyOwner {
        require(_approvedIssuers[issuer], "Issuer not approved");
        
        _approvedIssuers[issuer] = false;
        
        emit IssuerRevoked(issuer);
    }
    
    /**
     * @dev Issues a new credential
     * @param subject The address of the credential subject
     * @param schemaId The ID of the credential schema
     * @param expiresAt The expiration timestamp
     * @param credentialHash The hash of the credential data
     * @param signature The issuer's signature
     * @return The ID of the issued credential
     */
    function issueCredential(
        address subject,
        bytes32 schemaId,
        uint256 expiresAt,
        bytes32 credentialHash,
        bytes memory signature
    ) external returns (bytes32) {
        require(_approvedIssuers[msg.sender], "Issuer not approved");
        require(subject != address(0), "Invalid subject address");
        require(expiresAt > block.timestamp, "Credential already expired");
        
        // Verify signature
        bytes32 messageHash = keccak256(abi.encodePacked(subject, schemaId, expiresAt, credentialHash));
        bytes32 ethSignedMessageHash = messageHash.toEthSignedMessageHash();
        address signer = ethSignedMessageHash.recover(signature);
        
        require(signer == msg.sender, "Invalid signature");
        
        // Generate credential ID
        bytes32 credentialId = keccak256(abi.encodePacked(msg.sender, subject, schemaId, block.timestamp, credentialHash));
        
        // Store credential
        _credentials[credentialId] = Credential({
            id: credentialId,
            issuer: msg.sender,
            subject: subject,
            schemaId: schemaId,
            issuedAt: block.timestamp,
            expiresAt: expiresAt,
            status: CredentialStatus.Valid
        });
        
        emit CredentialIssued(credentialId, msg.sender, subject, schemaId);
        
        return credentialId;
    }
    
    /**
     * @dev Revokes a credential
     * @param credentialId The ID of the credential to revoke
     */
    function revokeCredential(bytes32 credentialId) external {
        Credential storage credential = _credentials[credentialId];
        
        require(credential.issuer != address(0), "Credential does not exist");
        require(credential.issuer == msg.sender || owner() == msg.sender, "Not authorized");
        require(credential.status == CredentialStatus.Valid, "Credential already revoked");
        
        credential.status = CredentialStatus.Revoked;
        
        emit CredentialRevoked(credentialId, msg.sender);
    }
    
    /**
     * @dev Verifies a credential
     * @param credentialId The ID of the credential to verify
     * @return isValid True if the credential is valid
     * @return issuer The address of the issuer
     * @return subject The address of the subject
     * @return schemaId The schema ID
     * @return issuedAt The issuance timestamp
     * @return expiresAt The expiration timestamp
     */
    function verifyCredential(bytes32 credentialId) external view returns (
        bool isValid,
        address issuer,
        address subject,
        bytes32 schemaId,
        uint256 issuedAt,
        uint256 expiresAt
    ) {
        Credential memory credential = _credentials[credentialId];
        
        if (credential.issuer == address(0)) {
            return (false, address(0), address(0), bytes32(0), 0, 0);
        }
        
        isValid = credential.status == CredentialStatus.Valid &&
                  block.timestamp <= credential.expiresAt &&
                  _approvedIssuers[credential.issuer];
                  
        return (
            isValid,
            credential.issuer,
            credential.subject,
            credential.schemaId,
            credential.issuedAt,
            credential.expiresAt
        );
    }
    
    /**
     * @dev Checks if an issuer is approved
     * @param issuer The address of the issuer
     * @return True if the issuer is approved
     */
    function isApprovedIssuer(address issuer) external view returns (bool) {
        return _approvedIssuers[issuer];
    }
}

