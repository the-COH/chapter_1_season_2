//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./interface/IHouse.sol";
import "./interface/ICollector.sol";
import "./interface/IDistributor.sol";
import "./interface/ITreasury.sol";
import "./interface/IRewarder.sol";
import "./interface/IVesting.sol";
import "./interface/IRewardable.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

import "hardhat/console.sol";

contract Rewarder is IRewarder, Ownable {
    IERC20 public beto;
    address public house;
    address public collector;
    ITreasury public treasury;
    uint256 public registerFee;
    uint256[] public referralRatio;
    uint256[] public rewardRatioByRound;
    uint256 public immutable PRECISION = 1e12;

    mapping(address => ReferralInfo) public referrals;
    mapping(address => RewardInfo) public rewards;

    mapping(address => address) public followings;
    mapping(address => address[]) public followers;
    mapping(address => mapping(address => uint256)) public referralHistories;

    function registerReferralAddress(
        address target,
        string calldata name,
        string calldata description
    ) public override {
        require(referrals[target].isActive == false, "Already Registered");
        beto.transferFrom(_msgSender(), address(this), registerFee);
        referrals[target] = ReferralInfo(name, description, true);
    }

    function follow(address target) public override {
        // require(referrals[target].isActive == true, "Not Referral Address");
        require(followings[_msgSender()] == address(0), "Already Follow");
        bool recursion = false;
        address _target = target;
        while (true) {
            if (_target == address(0)) break;
            if (_target == _msgSender()) {
                recursion = true;
                break;
            }
            _target = followings[_target];
        }
        require(recursion == false, "Not Allow Recursion Follow");
        followings[_msgSender()] = target;
        followers[target].push(_msgSender());
    }

    function distribute(address user, uint256 reward)
        public
        override
        returns (uint256)
    {
        require(_msgSender() == house, "UA");
        if (reward > 0) {
            uint256 distributeAmount = 0;
            if (followings[user] != address(0)) {
                address nextAddress = user;
                for (uint256 i = 1; i < referralRatio.length; i++) {
                    if (nextAddress == address(0)) {
                        break;
                    }
                    uint256 amount = Math.mulDiv(
                        reward,
                        referralRatio[i],
                        PRECISION
                    );
                    referralHistories[user][nextAddress] += amount;
                    rewards[nextAddress].amount += amount;
                    nextAddress = followings[nextAddress];
                    distributeAmount += amount;
                }
            }
            uint256 claimAmount = Math.mulDiv(
                reward,
                referralRatio[0],
                PRECISION
            );
            treasury.spend(user, claimAmount);
            uint256 restAmount = reward - distributeAmount - claimAmount;
            if (restAmount > 0) {
                treasury.spend(collector, restAmount);
            }
            return claimAmount;
        }
        return 0;
    }

    function claimReferralReward() public override returns (uint256) {
        RewardInfo storage rewardInfo = rewards[_msgSender()];
        uint256 claimableAmount = rewardInfo.amount - rewardInfo.claimedAmount;
        if (claimableAmount > 0) {
            treasury.spend(_msgSender(), claimableAmount);
            rewardInfo.claimedAmount = rewardInfo.amount;
        }
        return claimableAmount;
    }

    function followerReferralRewardInfo(address addr, address target)
        public
        view
        returns (FollowerReferralRewardInfo[] memory)
    {
        uint256 length = followers[target].length;
        FollowerReferralRewardInfo[]
            memory infos = new FollowerReferralRewardInfo[](length);

        for (uint256 i = 0; i < length; i++) {
            address follower = followers[target][i];
            infos[i] = FollowerReferralRewardInfo(
                follower,
                referralHistories[follower][addr]
            );
        }
        return infos;
    }

    function collect() public override {
        uint256 collectAmount = beto.balanceOf(address(this));
        if (collectAmount > 0) {
            beto.transfer(collector, collectAmount);
        }
    }

    function setHouse(address _house) public onlyOwner {
        house = _house;
    }

    function setRegisterFee(uint256 fee) public onlyOwner {
        registerFee = fee;
    }

    function setBeto(address _beto) public onlyOwner {
        beto = IERC20(_beto);
    }

    function setCollector(address _collector) public onlyOwner {
        collector = _collector;
    }

    function setTreasury(address _treasury) public onlyOwner {
        treasury = ITreasury(_treasury);
    }

    function setReferralRatio(uint256[] calldata ratio) public onlyOwner {
        referralRatio = ratio;
    }

    function queryReferralRatio(uint256 index) external view returns (uint256) {
        return referralRatio[index];
    }
}
