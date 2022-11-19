//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract ERC20Mint is ERC20, ERC20Burnable, Ownable {
    address[] public minters;
    mapping(address => bool) public minter;
    mapping(address => uint256) public minterIndex;

    constructor() ERC20("BETOAD", "BETO") {}

    function addMinter(address _minter) public onlyOwner {
        if (minter[_minter] == false) {
            minter[_minter] = true;
            minters.push(_minter);
            minterIndex[_minter] = minters.length - 1;
        }
    }

    function removeMinter(address _minter) public onlyOwner {
        if (minter[_minter] == true) {
            minter[_minter] = false;
            uint256 removedMinterIndex = minterIndex[_minter];
            address lastMinter = minters[minters.length - 1];
            minters[removedMinterIndex] = lastMinter;
            minterIndex[lastMinter] = removedMinterIndex;
            minters.pop();
        }
    }

    function mint(address to, uint256 amount) public onlyMinter {
        _mint(to, amount);
    }

    modifier onlyMinter() {
        require(minter[msg.sender] == true, "Error: caller is not the minter");
        _;
    }
}
