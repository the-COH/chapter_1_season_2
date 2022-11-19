//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./interface/IHouse.sol";
import "./interface/ICollector.sol";
import "./interface/IDistributor.sol";
import "./interface/ITreasury.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Treasury is ITreasury, Ownable {
    IERC20 public beto;
    mapping(address => bool) public spenders;

    function addSpender(address spender) public override onlyOwner {
        spenders[spender] = true;
    }

    function removeSpender(address spender) public override onlyOwner {
        spenders[spender] = false;
    }

    function spend(address recipient, uint256 amount) public override {
        require(spenders[_msgSender()] == true, "Unauthorized");
        beto.transfer(recipient, amount);
    }

    function setBeto(address addr) public onlyOwner {
        beto = IERC20(addr);
    }
}
