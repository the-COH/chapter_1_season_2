// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { ERC721MetadataInternal } from './ERC721MetadataInternal.sol';
import { IERC721Metadata } from '../../../interfaces/IERC721Metadata.sol';
import { OwnableInternal } from '../../../libs/ownable/OwnableInternal.sol';

contract ERC721Metadata is IERC721Metadata, ERC721MetadataInternal, OwnableInternal {
    function name() external view virtual returns (string memory) {
        return _name();
    }

    function symbol() external view virtual returns (string memory) {
        return _symbol();
    }

    function tokenURI(uint256 tokenId)
        external
        view
        virtual
        returns (string memory)
    {
        return _tokenURI(tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);
    }

	function setName(string calldata value) external onlyOwner {
		_setName(value);
	}

	function setSymbol(string calldata value) external onlyOwner {
		_setSymbol(value);
	}
}
