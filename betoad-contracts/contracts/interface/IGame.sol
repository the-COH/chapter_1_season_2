//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface IGame {
    function setGameId(uint256 id) external;

    function settleAll() external;
}
