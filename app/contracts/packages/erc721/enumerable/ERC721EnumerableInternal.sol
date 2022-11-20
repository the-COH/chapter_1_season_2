// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { ERC721BaseStorage } from '../base/ERC721BaseStorage.sol';

abstract contract ERC721EnumerableInternal {
    using ERC721BaseStorage for ERC721BaseStorage.Layout;

    function _totalSupply() internal view returns (uint256) {
        return ERC721BaseStorage.layout().totalSupply();
    }

    function _tokenOfOwnerByIndex(address owner, uint256 index)
        internal
        view
        returns (uint256)
    {
        return ERC721BaseStorage.layout().tokenOfOwnerByIndex(owner, index);
    }

    function _tokenByIndex(uint256 index) internal view returns (uint256) {
        return ERC721BaseStorage.layout().tokenByIndex(index);
    }
}
