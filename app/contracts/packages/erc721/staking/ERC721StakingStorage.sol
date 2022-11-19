// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

library ERC721StakingStorage {
    bytes32 internal constant STORAGE_SLOT =
        keccak256('contracts/packages/erc721/staking/ERC721StakingStorage');

    struct Layout {
        mapping(uint256 => uint256) stakingDeadlines;
		mapping(address => uint32) stakingTokenCount;
    }

    function layout() internal pure returns (Layout storage l) {
        bytes32 slot = STORAGE_SLOT;
        assembly {
            l.slot := slot
        }
    }
}
