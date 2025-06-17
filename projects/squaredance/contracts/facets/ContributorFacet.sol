// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ContributorFacet {
    mapping(address => string) private contributorCID;

    function addContributor(address contributor, string memory encryptedCID) external {
        contributorCID[contributor] = encryptedCID;
    }

    function getMyCID() external view returns (string memory) {
        return contributorCID[msg.sender];
    }
}