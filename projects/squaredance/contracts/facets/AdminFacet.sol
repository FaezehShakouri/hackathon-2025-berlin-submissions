// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { LibDiamond } from "../libraries/LibDiamond.sol";

contract AdminFacet {
    struct Organization {
        string name;
        address admin;
        uint256 totalShares;
    }

    Organization public org;

    function createOrganization(string memory name, uint256 shares) external {
        require(org.admin == address(0), "Already initialized");
        org = Organization({
            name: name,
            admin: msg.sender,
            totalShares: shares
        });
    }
}