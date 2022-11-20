// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { EnumerableMap } from '../../../libs/data/EnumerableMap.sol';
import { EnumerableSet } from '../../../libs/data/EnumerableSet.sol';
import { ERC721BaseStorage } from '../base/ERC721BaseStorage.sol';
import { IERC721Enumerable } from '../../../interfaces/IERC721Enumerable.sol';
import { ERC721EnumerableInternal } from './ERC721EnumerableInternal.sol';

contract ERC721Enumerable is
    IERC721Enumerable,
    ERC721EnumerableInternal
{
    using EnumerableMap for EnumerableMap.UintToAddressMap;
    using EnumerableSet for EnumerableSet.UintSet;

    function totalSupply() public view returns (uint256) {
        return _totalSupply();
    }

    function tokenOfOwnerByIndex(address owner, uint256 index)
        public
        view
        returns (uint256)
    {
        return _tokenOfOwnerByIndex(owner, index);
    }

    function tokenByIndex(uint256 index) public view returns (uint256) {
        return _tokenByIndex(index);
    }
}
