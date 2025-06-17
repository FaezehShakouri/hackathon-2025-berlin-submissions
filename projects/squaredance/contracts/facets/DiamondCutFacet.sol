// contracts/facets/DiamondCutFacet.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import { IDiamondCut } from "../interfaces/IDiamondCut.sol";
import { LibDiamond } from "../libraries/LibDiamond.sol";

contract DiamondCutFacet is IDiamondCut {
    function diamondCut(FacetCut[] calldata _cut, address _init, bytes calldata _calldata) external override {
        LibDiamond.enforceIsContractOwner();
        LibDiamond.diamondCut(_cut, _init, _calldata);
    }

    function getSelectors(address facet) external pure override returns (bytes4[] memory selectors) {
        // Only example, this would be implemented in a real facet selector registry.
        revert("Not implemented");
    }
}