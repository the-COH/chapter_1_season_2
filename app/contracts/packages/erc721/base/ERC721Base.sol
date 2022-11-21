// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { IERC721Receiver } from '../../../interfaces/IERC721Receiver.sol';
import { EnumerableMap } from '../../../libs/data/EnumerableMap.sol';
import { EnumerableSet } from '../../../libs/data/EnumerableSet.sol';
import { AddressUtils } from '../../../utils/AddressUtils.sol';
import { ERC721BaseStorage } from './ERC721BaseStorage.sol';
import { ERC721BaseInternal } from './ERC721BaseInternal.sol';

contract ERC721Base is ERC721BaseInternal {
    using AddressUtils for address;
    using EnumerableMap for EnumerableMap.UintToAddressMap;
    using EnumerableSet for EnumerableSet.UintSet;

    function balanceOf(address account) public view returns (uint256) {
        return _balanceOf(account);
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        return _ownerOf(tokenId);
    }

    function getApproved(uint256 tokenId) public virtual view returns (address) {
        return _getApproved(tokenId);
    }

    function isApprovedForAll(address account, address operator)
        public
		virtual
        view
        returns (bool)
    {
        return _isApprovedForAll(account, operator);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public payable {
        _handleTransferMessageValue(from, to, tokenId, msg.value);
        if (!_isApprovedOrOwner(msg.sender, tokenId))
            revert ERC721Base__NotOwnerOrApproved();
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public payable {
        safeTransferFrom(from, to, tokenId, '');
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public payable {
        _handleTransferMessageValue(from, to, tokenId, msg.value);
        if (!_isApprovedOrOwner(msg.sender, tokenId))
            revert ERC721Base__NotOwnerOrApproved();
        _safeTransfer(from, to, tokenId, data);
    }

    function approve(address operator, uint256 tokenId) public virtual payable {
        _handleApproveMessageValue(operator, tokenId, msg.value);
        address owner = ownerOf(tokenId);
        if (operator == owner) revert ERC721Base__SelfApproval();
        if (msg.sender != owner && !isApprovedForAll(owner, msg.sender))
            revert ERC721Base__NotOwnerOrApproved();
        _approve(operator, tokenId);
    }

    function setApprovalForAll(address operator, bool status) public virtual {
        if (operator == msg.sender) revert ERC721Base__SelfApproval();
        ERC721BaseStorage.layout().operatorApprovals[msg.sender][
            operator
        ] = status;
        emit ApprovalForAll(msg.sender, operator, status);
    }
}
