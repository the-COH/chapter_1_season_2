//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface IVesting {
    struct ShareInfo {
        address addr;
        string description;
        uint256 share;
        uint64 unlockRound;
    }
    struct VestingInfo {
        uint256 amount;
        uint256 withdrawedAmount;
    }

    function addRound(uint256 amount) external;

    function withdraw(uint256 amount) external;

    function send(address recipient, uint256 amount) external;
}
