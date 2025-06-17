// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IssuanceFacet {
    struct ShareIssuance {
        uint256 amount;
        string cid;
    }

    mapping(address => ShareIssuance[]) public issuedShares;

    function issueShares(address to, uint256 amount, string memory encryptedCID) external {
        issuedShares[to].push(ShareIssuance({
            amount: amount,
            cid: encryptedCID
        }));
    }

    function getMyShares() external view returns (ShareIssuance[] memory) {
        return issuedShares[msg.sender];
    }
}