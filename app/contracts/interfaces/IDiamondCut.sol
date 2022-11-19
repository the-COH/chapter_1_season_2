// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { IDiamondCutInternal } from './IDiamondCutInternal.sol';

interface IDiamondCut is IDiamondCutInternal {
   
    function diamondCut(
        FacetCut[] calldata facetCuts,
        address target,
        bytes calldata data
    ) external;
}
