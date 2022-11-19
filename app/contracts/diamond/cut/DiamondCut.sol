// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { OwnableInternal } from '../../libs/ownable/OwnableInternal.sol';
import { DiamondBaseStorage } from '../base/DiamondBaseStorage.sol';
import { IDiamondCut } from '../../interfaces/IDiamondCut.sol';
import { DiamondCutInternal } from './DiamondCutInternal.sol';

abstract contract DiamondCut is
    IDiamondCut,
    DiamondCutInternal,
    OwnableInternal
{
    using DiamondBaseStorage for DiamondBaseStorage.Layout;

    function diamondCut(
        FacetCut[] calldata facetCuts,
        address target,
        bytes calldata data
    ) external onlyOwner {
        _diamondCut(facetCuts, target, data);
    }
}
