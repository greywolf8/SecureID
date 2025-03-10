// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title SecureID Zero-Knowledge Proofs Contract
 * @dev Manages verification of zero-knowledge proofs for private authentication
 */
contract SecureIDZKProofs is Ownable {
    // Verifier contract interface
    interface IVerifier {
        function verifyProof(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[1] memory input
        ) external view returns (bool);
    }
    
    // Mapping from proof type to verifier contract
    mapping(bytes32 => address) private _verifiers;
    
    // Events
    event VerifierAdded(bytes32 indexed proofType, address verifier);
    event VerifierRemoved(bytes32 indexed proofType);
    event ProofVerified(bytes32 indexed proofType, address indexed user, bool success);
    
    /**
     * @dev Adds a verifier contract for a specific proof type
     * @param proofType The type of proof (e.g., "age-verification", "membership")
     * @param verifier The address of the verifier contract
     */
    function addVerifier(bytes32 proofType, address verifier) external onlyOwner {
        require(verifier != address(0), "Invalid verifier address");
        _verifiers[proofType] = verifier;
        
        emit VerifierAdded(proofType, verifier);
    }
    
    /**
     * @dev Removes a verifier contract
     * @param proofType The type of proof
     */
    function removeVerifier(bytes32 proofType) external onlyOwner {
        require(_verifiers[proofType] != address(0), "Verifier does not exist");
        
        delete _verifiers[proofType];
        
        emit VerifierRemoved(proofType);
    }
    
    /**
     * @dev Verifies a zero-knowledge proof
     * @param proofType The type of proof
     * @param a The 'a' part of the zk-SNARK proof
     * @param b The 'b' part of the zk-SNARK proof
     * @param c The 'c' part of the zk-SNARK proof
     * @param input The public input to the proof
     * @return True if the proof is valid
     */
    function verifyProof(
        bytes32 proofType,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[1] memory input
    ) external returns (bool) {
        address verifier = _verifiers[proofType];
        require(verifier != address(0), "Verifier not found for this proof type");
        
        bool isValid = IVerifier(verifier).verifyProof(a, b, c, input);
        
        emit ProofVerified(proofType, msg.sender, isValid);
        
        return isValid;
    }
    
    /**
     * @dev Gets the verifier address for a proof type
     * @param proofType The type of proof
     * @return The address of the verifier contract
     */
    function getVerifier(bytes32 proofType) external view returns (address) {
        return _verifiers[proofType];
    }
}

