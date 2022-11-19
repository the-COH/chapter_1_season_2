//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./interface/IVesting.sol";
import "./interface/IDistributor.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Vesting is IVesting, Ownable {
    IERC20 public beto;
    IDistributor public distributor;
    VestingInfo public restVesting;
    mapping(address => VestingInfo) public vestings;
    mapping(address => ShareInfo) public shares;
    address[] public vestedAddress;
    uint256[] public rounds;

    function addRound(uint256 amount) public override {
        beto.transferFrom(_msgSender(), address(this), amount);
        uint256 restAmount = amount;
        for (uint8 i = 0; i < vestedAddress.length; i++) {
            address addr = vestedAddress[i];
            uint256 addAmount = amount * shares[addr].share;
            vestings[addr].amount += addAmount;
            restAmount -= addAmount;
        }
        restVesting.amount += restAmount;
        rounds.push(amount);
    }

    function withdraw(uint256 amount) public override {
        ShareInfo storage shareInfo = shares[_msgSender()];
        require(distributor.getCurrentRound() > shareInfo.unlockRound, "NP");
        VestingInfo storage vestingInfo = vestings[_msgSender()];
        require(
            vestingInfo.amount - vestingInfo.withdrawedAmount > amount,
            "NE"
        );
        vestingInfo.withdrawedAmount += amount;
        beto.transfer(_msgSender(), amount);
    }

    function send(address recipient, uint256 amount) public override onlyOwner {
        require(
            restVesting.amount - restVesting.withdrawedAmount > amount,
            "NE"
        );
        restVesting.withdrawedAmount += amount;
        beto.transfer(recipient, amount);
    }

    function setBeto(address _beto) public onlyOwner {
        beto = IERC20(_beto);
    }

    function setDistributor(address _distributor) public onlyOwner {
        distributor = IDistributor(_distributor);
    }
}
