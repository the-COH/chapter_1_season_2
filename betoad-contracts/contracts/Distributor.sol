//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./interface/IHouse.sol";
import "./interface/IVesting.sol";
import "./interface/IDistributor.sol";
import "./interface/IRewardable.sol";
import "./ERC20Mint.sol";

import "./libraries/Reward.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Distributor is IDistributor, Ownable {
    ERC20Mint public beto;
    IVesting public vesting;
    uint256 public totalDistributeAmount;
    uint256 public lastRoundHeight;
    Round[] public rounds;
    mapping(uint256 => DistributionHistory[]) public distributionHistories;
    Distribution[] public distributions;

    function distribute() public override {
        // require(lastRoundHeight + 28800 > block.number, "not yet next round");
        uint256 round = rounds.length;
        if (round < 1_000) {
            uint256 amount = round < 333 ? 1_500_000 * 1e18 : round < 667
                ? 1_000_000 * 1e18
                : 500_000 * 1e18;
            uint256 vestingAmount = (amount * 200_000) / 1e6;
            uint256 mintAmount = amount + vestingAmount;
            beto.mint(address(this), mintAmount);
            beto.approve(address(vesting), vestingAmount);
            vesting.addRound(vestingAmount);
        }
        uint256 distributeAmount = beto.balanceOf(address(this));
        totalDistributeAmount += distributeAmount;
        rounds.push(Round(distributeAmount));

        for (uint256 i = 0; i < distributions.length; i++) {
            Distribution storage distribution = distributions[i];
            if (distribution.isActive) {
                uint256 amount = (distributeAmount * distribution.ratio) / 1e6;
                beto.approve(distribution.target, amount);
                distribution.totalDistributeAmount += amount;
                IRewardable(distribution.target).addRound(
                    distribution.rewardType,
                    distribution.key,
                    amount
                );
                distributionHistories[rounds.length - 1].push(
                    DistributionHistory(
                        distribution.target,
                        distribution.rewardType,
                        amount,
                        distribution.key
                    )
                );
            }
        }
        lastRoundHeight = block.number;
    }

    function getCurrentRound() public view override returns (uint256 round) {
        return rounds.length;
    }

    function setBeto(address _beto) public onlyOwner {
        beto = ERC20Mint(_beto);
    }

    function setVesting(address _vesting) public onlyOwner {
        vesting = IVesting(_vesting);
    }

    function allDestributions() public view returns (Distribution[] memory) {
        return distributions;
    }

    function addDistribution(
        address target,
        Reward.Type rewardType,
        uint256 key,
        uint256 ratio
    ) public onlyOwner returns (uint256 distributionId) {
        distributions.push(
            Distribution(target, rewardType, key, ratio, 0, true)
        );
        distributionId = distributions.length - 1;
    }

    function removeDistribution(uint256 distributionId) public onlyOwner {
        distributions[distributionId].isActive = false;
    }

    function migrate(address newOwner) public onlyOwner {
        beto.transferOwnership(newOwner);
    }
}
