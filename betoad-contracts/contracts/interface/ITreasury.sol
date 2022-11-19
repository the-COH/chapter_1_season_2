//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface ITreasury {
    function addSpender(address spender) external;

    function removeSpender(address spender) external;

    function spend(address recipient, uint256 amount) external;
}
