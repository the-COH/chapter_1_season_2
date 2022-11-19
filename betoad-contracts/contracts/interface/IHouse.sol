//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IHouse {
    struct GameInfo {
        string name;
        string description;
        string url;
        address creator;
        address addr;
        bool isActive;
    }
    struct PoolInfo {
        string name;
        IERC20 asset;
        uint256 assetDecimals;
        uint256 deposit;
        uint256 lockPeriod;
        uint256 price;
        bool isActive;
    }
    struct DepositInfo {
        uint256 depositAmount;
        uint256 claimableRound;
        uint256 time;
    }
    struct PoolResponse {
        uint256 poolId;
        string name;
        IERC20 asset;
        uint256 deposit;
        uint256 balance;
        uint256 myDeposit;
        uint256 price;
        bool isActive;
    }
    struct UniswapInfo {
        address addr;
        int8 diffDecimals;
        bool isToken0;
    }

    function createPool(
        string calldata name,
        address asset,
        uint256 lockPeriod
    ) external returns (uint256 poolId);

    function isGameActive(address game) external view returns (bool);

    function setPoolIsActive(uint256 poolId, bool isActive)
        external
        returns (PoolInfo memory _poolInfo);

    function createGame(
        string calldata name,
        string calldata description,
        string calldata url,
        address _address
    ) external returns (uint256 gameId);

    function setGameIsActive(uint256 gameId, bool isActive)
        external
        returns (GameInfo memory gameInfo);

    function deposit(uint256 poolId, uint256 amount)
        external
        returns (DepositInfo memory depositInfo, uint256 rewardAmount);

    function withdraw(uint256 poolId, uint256 amount)
        external
        returns (uint256 withdrawAmount, uint256 rewardAmount);

    function addShare(
        address player,
        uint256 poolId,
        uint256 gameId,
        uint256 input
    ) external;

    function settle(
        address player,
        uint256 poolId,
        uint256 gameId,
        uint256 input,
        uint256 output
    ) external;

    function claim(uint256 poolId) external returns (uint256 amount);

    function collect() external;

    function pools(uint256 poolId)
        external
        view
        returns (
            string memory name,
            IERC20 asset,
            uint256 assetDecimals,
            uint256 _deposit,
            uint256 lockPeriod,
            uint256 price,
            bool isActive
        );

    function poolInfo(uint256 poolId) external view returns (PoolInfo memory);

    function getCurrentRound() external view returns (uint256);
}
