//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "../libraries/Reward.sol";

interface IDistributor {
    struct DistributionHistory {
        address target;
        Reward.Type rewardType;
        uint256 amount;
        uint256 key;
    }
    struct Round {
        uint256 distributionAmount;
    }
    struct Distribution {
        address target;
        Reward.Type rewardType;
        uint256 key;
        uint256 ratio;
        uint256 totalDistributeAmount;
        bool isActive;
    }

    function distribute() external;

    function getCurrentRound() external view returns (uint256 round);
}
