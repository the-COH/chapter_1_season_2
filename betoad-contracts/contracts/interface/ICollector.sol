//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./ICollectable.sol";

interface ICollector {
    struct Buyback {
        uint64 timestamp;
        uint256 amount;
    }
    struct BurnOrDistribute {
        uint64 round;
        uint256 amount;
    }
    struct AssetInfo {
        uint256 index;
        uint256 profit;
        bool isActive;
    }
    struct ContractInfo {
        ICollectable collectable;
        bool isActive;
    }
    struct ProfitResponse {
        address asset;
        uint256 profit;
    }
    struct BalanceResponse {
        address addr;
        uint256 amount;
    }

    function addAsset(address asset) external returns (uint256);

    function removeAsset(address asset) external;

    function addHarvestContract(address _contract) external returns (uint256);

    function removeHarvestContract(uint256 contractId) external;

    function buybackBeto() external returns (uint256 amount);

    function burnOrDistribute() external returns (uint256 amount);

    function harvest() external;

    function collect(address asset, uint256 amount) external;
}
