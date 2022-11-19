//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

interface IRewarder {
    struct ReferralInfo {
        string name;
        string description;
        bool isActive;
    }
    struct RewardInfo {
        uint256 amount;
        uint256 claimedAmount;
    }
    struct FollowerReferralRewardInfo {
        address addr;
        uint256 amount;
    }

    function queryReferralRatio(uint256 index) external view returns (uint256);

    function registerReferralAddress(
        address target,
        string calldata name,
        string calldata description
    ) external;

    function follow(address target) external;

    function distribute(address user, uint256 amount)
        external
        returns (uint256);

    function claimReferralReward() external returns (uint256);

    function collect() external;
}
