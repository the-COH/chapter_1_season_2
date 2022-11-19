//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "../libraries/Reward.sol";

interface IRewardable {
    function addRound(
        Reward.Type _type,
        uint256 key,
        uint256 amount
    ) external;
}
