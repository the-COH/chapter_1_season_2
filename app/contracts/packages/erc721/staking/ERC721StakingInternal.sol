// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import { ERC721Base } from '../base/ERC721Base.sol';
import { ERC721BaseStorage } from '../base/ERC721BaseStorage.sol';
import { ERC721StakingStorage } from './ERC721StakingStorage.sol';

abstract contract ERC721StakingInternal is ERC721Base {
	function _enforceTokenUnstaked(uint256 tokenId)
		internal view
	{
		require(ERC721StakingStorage.layout().stakingDeadlines[tokenId] == 0, 'This cheetah is being staked');
	}

	function _enforceTokenStaked(uint256 tokenId)
		internal view
	{
		require(ERC721StakingStorage.layout().stakingDeadlines[tokenId] != 0, 'This cheetah is not being staked');
	}

	function _stake(uint256 tokenId, uint256 stakingDays)
		internal
	{
		require(_exists(tokenId), 'Invalid tokenId');
		require(stakingDays > 0, 'Invalid `stakingDays`');
		_enforceTokenUnstaked(tokenId);

		// Update the staking deadline for the token according to staking
		ERC721StakingStorage.Layout storage l = ERC721StakingStorage.layout();
		l.stakingDeadlines[tokenId] = uint32(block.timestamp + (stakingDays * 1 days));
		l.stakingTokenCount[_ownerOf(tokenId)]++;
	}
}