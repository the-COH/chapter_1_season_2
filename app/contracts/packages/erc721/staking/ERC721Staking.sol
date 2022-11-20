// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC721Base } from '../base/ERC721Base.sol';
import { ERC721BaseInternal } from '../base/ERC721BaseInternal.sol';
import { ERC721StakingInternal } from './ERC721StakingInternal.sol';
import { ERC721StakingStorage } from './ERC721StakingStorage.sol';

contract ERC721Staking is ERC721StakingInternal {
	function setApprovalForAll(address operator, bool approved)
		public virtual override(ERC721Base)
	{
		require(!isStakingWallet(msg.sender), 'Your wallet currently holds staked cheetah(s). Move the cheetah to a new wallet to create listing.');

		super.setApprovalForAll(operator, approved);
    }

    function isApprovedForAll(address owner, address operator)
		public view virtual override(ERC721Base) returns (bool)
	{
		if (isStakingWallet(owner)) {
			return false;
		}

        return super.isApprovedForAll(owner, operator);
    }

	function approve(address to, uint256 tokenId)
		public virtual payable override(ERC721Base)
	{
		_enforceTokenUnstaked(tokenId);

		super.approve(to, tokenId);
	}

	function getApproved(uint256 tokenId)
		public view virtual override(ERC721Base) returns (address)
	{
		_enforceTokenUnstaked(tokenId);
		return super.getApproved(tokenId);
    }

	function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721BaseInternal) {
		if (from != address(0)) {
			ERC721StakingStorage.Layout storage l = ERC721StakingStorage.layout();
			if (_ownerOf(tokenId) != msg.sender) {
				// Sales
				_enforceTokenUnstaked(tokenId);
			} else {
				// Transfer
				if (l.stakingDeadlines[tokenId] != 0) {
					l.stakingTokenCount[from]--;
					l.stakingTokenCount[to]++;
				}
			}
		}
		super._beforeTokenTransfer(from, to, tokenId);
	}

	function isStakingWallet(address wallet)
		public view returns (bool)
	{
		return ERC721StakingStorage.layout().stakingTokenCount[wallet] > 0;
	}

	function stake(uint256 tokenId, uint256 stakingDays)
		public
	{
		require(_ownerOf(tokenId) == msg.sender, 'You must be the owner of the token');
		_stake(tokenId, stakingDays);
	}

	function unstake(uint256 tokenId)
		public
	{
		require(_ownerOf(tokenId) == msg.sender, 'You must be the owner of the token');
		_enforceTokenStaked(tokenId);

		ERC721StakingStorage.Layout storage l = ERC721StakingStorage.layout();
		if (l.stakingDeadlines[tokenId] > block.timestamp) {
			revert('Staking has not yet completed');
		}

		// Update staking
		l.stakingDeadlines[tokenId] = 0;
		l.stakingTokenCount[msg.sender]--;
	}
}