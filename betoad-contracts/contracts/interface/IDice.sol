//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface IDice {
    struct BetInfo {
        address player;
        uint256 data;
    }

    function bet(
        uint256 poolId,
        uint256 amount,
        uint16 randomKey,
        uint8 prediction,
        bool isOver
    ) external returns (uint256 betId);
}
