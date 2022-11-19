//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./Chip.sol";
import "./interface/IHouse.sol";
import "./interface/IGame.sol";
import "./interface/IRewarder.sol";
import "./interface/IRewardable.sol";

import "./libraries/Reward.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";

import {BaseV1Router01, IBaseV1Pair} from "./canto/BaseV1-periphery.sol";
import {BaseV1Pair} from "./canto/BaseV1-core.sol";

contract House is IHouse, IRewardable, Ownable {
    IERC20 public note;
    IERC20 public beto;
    Chip public chip;
    address public rewarder;
    address public collector;
    address public distributor;
    address public treasury;
    uint16 public maxOutputRate;

    BaseV1Router01 public router;

    GameInfo[] public games;
    PoolInfo[] public override pools;
    mapping(address => uint256) public gameIndex;

    uint256 public chipBonus = 30e10;
    uint256 public immutable PRECISION = 1e12;

    // Provider
    mapping(uint256 => uint256[]) public poolRewardRatioByRound;
    mapping(address => mapping(uint256 => DepositInfo)) public deposits;

    /**
     * Player
     */
    uint256[] public playingRewardRatioByRound;
    mapping(uint256 => uint256) public totalPlayingAmountByRound;
    mapping(address => mapping(uint256 => uint256)) public playingAmountByRound;
    mapping(address => uint256) public lastClaimRound;
    mapping(address => uint256) public claimedPlayingReward;
    mapping(address => uint256) public exp;
    uint256 public totalPlayingAmount;

    constructor(
        address _beto,
        address _note,
        address _chip,
        address _router
    ) {
        beto = IERC20(_beto);
        note = IERC20(_note);
        chip = Chip(_chip);
        router = BaseV1Router01(_router);
    }

    function createPool(
        string calldata name,
        address _asset,
        uint256 lockPeriod
    ) public override onlyOwner returns (uint256 poolId) {
        // ERC20 토큰이 정상이고, 풀이 이미 있으면 덮어씌우기 안하게 만들기.
        ERC20 asset = ERC20(_asset);
        uint256 decimals = asset.decimals();
        pools.push(PoolInfo(name, asset, decimals, 0, lockPeriod, 0, true));
        poolId = pools.length - 1;
        updatePrice(poolId);
    }

    function setPoolIsActive(uint256 poolId, bool isActive)
        public
        override
        onlyOwner
        returns (PoolInfo memory)
    {
        pools[poolId].isActive = isActive;
        return pools[poolId];
    }

    function createGame(
        string calldata name,
        string calldata description,
        string calldata url,
        address _address
    ) public override onlyOwner returns (uint256 gameId) {
        games.push(
            GameInfo(name, description, url, _msgSender(), _address, true)
        );
        gameId = games.length - 1;
        gameIndex[_address] = gameId;
        IGame(_address).setGameId(gameId);
    }

    function setGameIsActive(uint256 gameId, bool isActive)
        public
        override
        onlyOwner
        returns (GameInfo memory)
    {
        games[gameId].isActive = isActive;
        return games[gameId];
    }

    function isGameActive(address game) public view override returns (bool) {
        return games[gameIndex[game]].isActive;
    }

    function deposit(uint256 poolId, uint256 amount)
        public
        override
        returns (DepositInfo memory, uint256)
    {
        // msg.value
        PoolInfo storage pool = pools[poolId];
        require(pool.isActive == true, "Inactived Pool");
        DepositInfo storage depositInfo = deposits[_msgSender()][poolId];
        pool.asset.transferFrom(_msgSender(), address(this), amount);

        uint256 rewardAmount = claim(poolId);

        pool.deposit += amount;
        depositInfo.depositAmount += amount;
        depositInfo.time = block.timestamp;
        return (depositInfo, rewardAmount);
    }

    function withdraw(uint256 poolId, uint256 amount)
        public
        override
        returns (uint256, uint256)
    {
        PoolInfo storage pool = pools[poolId];
        DepositInfo storage depositInfo = deposits[_msgSender()][poolId];
        require(pool.isActive == true, "Inactived Pool");
        require(depositInfo.depositAmount >= amount, "Not enought Deposit");
        require(pool.deposit >= amount, "Not enought Pool");
        require(depositInfo.time + pool.lockPeriod < block.timestamp, "LOCK");

        uint256 rewardAmount = claim(poolId);
        depositInfo.depositAmount -= amount;
        pool.deposit -= amount;

        pool.asset.transfer(_msgSender(), amount);

        return (rewardAmount, amount);
    }

    function addShare(
        address player,
        uint256 poolId,
        uint256 gameId,
        uint256 input
    ) public override {
        require(games[gameId].addr == _msgSender(), "Unauthorized");
        PoolInfo memory pool = pools[poolId];
        require(pool.isActive, "Inactived");
        if (pool.price > 0) {
            uint256 share = Math.mulDiv(
                input,
                pool.price,
                10**pool.assetDecimals
            );
            if (share > 0) {
                totalPlayingAmountByRound[
                    playingRewardRatioByRound.length
                ] += share;
                playingAmountByRound[player][
                    playingRewardRatioByRound.length
                ] += share;
            }
        }
    }

    function settle(
        address player,
        uint256 poolId,
        uint256 gameId,
        uint256 input,
        uint256 output
    ) public override {
        require(games[gameId].addr == msg.sender, "UA");
        PoolInfo storage pool = pools[poolId];
        require(pool.isActive, "Inactived");
        if (input > 0) {
            if (pool.price > 0) {
                uint256 share = Math.mulDiv(
                    input,
                    pool.price,
                    10**pool.assetDecimals
                );
                if (share > 0) {
                    totalPlayingAmountByRound[
                        playingRewardRatioByRound.length
                    ] += share;
                    playingAmountByRound[player][
                        playingRewardRatioByRound.length
                    ] += share;
                }
            }
        }
        if (output > 0) {
            uint256 maxOutput = (pool.asset.balanceOf(address(this)) *
                maxOutputRate) / 1e6;
            uint256 realOutput = output > maxOutput ? maxOutput : output;
            pool.asset.transfer(player, realOutput);
        }
    }

    function collect() public override {
        require(_msgSender() == collector, "Unauthorized");
        for (uint256 i = 0; i < pools.length; i++) {
            PoolInfo storage pInfo = pools[i];
            uint256 balance = pInfo.asset.balanceOf(address(this));
            if (pInfo.isActive && balance > pInfo.deposit) {
                pInfo.asset.transfer(collector, balance - pInfo.deposit);
            }
        }
    }

    function addRound(
        Reward.Type rewardType,
        uint256 poolId,
        uint256 amount
    ) public {
        require(_msgSender() == distributor, "Unauthorized");
        if (rewardType == Reward.Type.PLAYING) {
            uint256 totalPlaying = totalPlayingAmountByRound[
                playingRewardRatioByRound.length
            ];
            uint256 ratio = totalPlaying > 0
                ? Math.mulDiv(amount, PRECISION, totalPlaying)
                : 0;
            if (ratio > 0) {
                beto.transferFrom(_msgSender(), treasury, amount);
                totalPlayingAmount += totalPlaying;
            } else {
                beto.transferFrom(_msgSender(), collector, amount);
            }
            playingRewardRatioByRound.push(ratio);
        } else if (rewardType == Reward.Type.POOL) {
            uint256 ratio = pools[poolId].deposit > 0
                ? Math.mulDiv(amount, PRECISION, pools[poolId].deposit)
                : 0;
            if (ratio > 0) {
                beto.transferFrom(_msgSender(), treasury, amount);
            } else {
                beto.transferFrom(_msgSender(), collector, amount);
            }
            poolRewardRatioByRound[poolId].push(ratio);
        }
    }

    function claimPlayingReward() public returns (uint256 reward) {
        uint256 startRound = lastClaimRound[_msgSender()];
        uint256 _exp = 0;
        for (
            uint256 i = startRound;
            i < playingRewardRatioByRound.length;
            i++
        ) {
            uint256 amount = playingAmountByRound[_msgSender()][i];
            if (amount > 0) {
                reward += Math.mulDiv(
                    amount,
                    playingRewardRatioByRound[i],
                    PRECISION
                );
                _exp += amount;
            }
        }
        exp[_msgSender()] += _exp;
        uint256 ratio = IRewarder(rewarder).queryReferralRatio(0);
        claimedPlayingReward[_msgSender()] += Math.mulDiv(
            reward,
            ratio,
            PRECISION
        );
        lastClaimRound[_msgSender()] = playingRewardRatioByRound.length;
        if (reward > 0) {
            IRewarder(rewarder).distribute(_msgSender(), reward);
        }
    }

    function claim(uint256 poolId) public override returns (uint256 reward) {
        DepositInfo storage depositInfo = deposits[_msgSender()][poolId];
        if (depositInfo.depositAmount > 0) {
            if (
                depositInfo.claimableRound <
                poolRewardRatioByRound[poolId].length
            ) {
                for (
                    uint256 i = depositInfo.claimableRound;
                    i < poolRewardRatioByRound[poolId].length;
                    i++
                ) {
                    reward += Math.mulDiv(
                        poolRewardRatioByRound[poolId][i],
                        depositInfo.depositAmount,
                        PRECISION
                    );
                }
                depositInfo.claimableRound = poolRewardRatioByRound[poolId]
                    .length;
                IRewarder(rewarder).distribute(_msgSender(), reward);
            }
        }
    }

    function getTotalPlayingAmountByRound(uint256 start, uint256 limit)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory amounts = new uint256[](limit);
        for (uint256 i = start; i < start + limit; i++) {
            amounts[i] = totalPlayingAmountByRound[i];
        }
        return amounts;
    }

    function previewClaimPlayingReward(address target)
        public
        view
        returns (uint256 reward)
    {
        uint256 startRound = lastClaimRound[_msgSender()];
        for (
            uint256 i = startRound;
            i < playingRewardRatioByRound.length;
            i++
        ) {
            uint256 amount = playingAmountByRound[target][i];
            if (amount > 0) {
                reward += Math.mulDiv(
                    amount,
                    playingRewardRatioByRound[i],
                    PRECISION
                );
            }
        }
        if (reward > 0) {
            uint256 ratio = IRewarder(rewarder).queryReferralRatio(0);
            return Math.mulDiv(reward, ratio, PRECISION);
        } else {
            return 0;
        }
    }

    function previewClaim(uint256 poolId, address target)
        public
        view
        returns (uint256)
    {
        DepositInfo storage depositInfo = deposits[target][poolId];
        uint256 reward = 0;
        if (depositInfo.depositAmount > 0) {
            if (
                depositInfo.claimableRound <
                poolRewardRatioByRound[poolId].length
            ) {
                for (
                    uint256 i = depositInfo.claimableRound;
                    i < poolRewardRatioByRound[poolId].length;
                    i++
                ) {
                    reward +=
                        (poolRewardRatioByRound[poolId][i] *
                            depositInfo.depositAmount) /
                        1e12;
                }
            }
        }
        uint256 ratio = IRewarder(rewarder).queryReferralRatio(0);
        return Math.mulDiv(reward, ratio, PRECISION);
    }

    function detailPool(uint256 poolId, address target)
        public
        view
        returns (PoolResponse memory)
    {
        PoolInfo memory pool = pools[poolId];
        uint256 balance = pool.asset.balanceOf(address(this));
        return
            PoolResponse(
                poolId,
                pool.name,
                pool.asset,
                pool.deposit,
                balance,
                deposits[target][poolId].depositAmount,
                pool.price,
                pool.isActive
            );
    }

    function getCurrentRound() public view returns (uint256) {
        return playingRewardRatioByRound.length;
    }

    function getPoolLength() public view returns (uint256) {
        return pools.length;
    }

    function getGameLength() public view returns (uint256) {
        return games.length;
    }

    function allDetailPools(address target)
        public
        view
        returns (PoolResponse[] memory)
    {
        PoolResponse[] memory details = new PoolResponse[](pools.length);
        for (uint256 i = 0; i < pools.length; i++) {
            details[i] = detailPool(i, target);
        }
        return details;
    }

    function poolInfo(uint256 poolId)
        public
        view
        override
        returns (PoolInfo memory)
    {
        return pools[poolId];
    }

    function allPools() public view returns (PoolInfo[] memory) {
        return pools;
    }

    function allGames() public view returns (GameInfo[] memory) {
        return games;
    }

    function isGameActive() public view returns (GameInfo[] memory) {
        return games;
    }

    function setBeto(address _beto) public onlyOwner {
        beto = IERC20(_beto);
    }

    function setRewarder(address _rewarder) public onlyOwner {
        rewarder = _rewarder;
    }

    function setCollector(address _collector) public onlyOwner {
        collector = _collector;
    }

    function setDistributor(address _distributor) public onlyOwner {
        distributor = _distributor;
    }

    function setTreasury(address _treasury) public onlyOwner {
        treasury = _treasury;
    }

    function setMaxOutputRate(uint16 _maxOutputRate) public onlyOwner {
        maxOutputRate = _maxOutputRate;
    }

    function setChipBonus(uint256 _chipBonus) public onlyOwner {
        chipBonus = _chipBonus;
    }

    function setLockPeriod(uint256 poolId, uint256 newLockPeriod)
        public
        onlyOwner
    {
        pools[poolId].lockPeriod = newLockPeriod;
    }

    function updatePrice(uint256 poolId) public {
        PoolInfo storage pool = pools[poolId];
        if (pool.asset == note) {
            pool.assetDecimals = 18;
            pool.price = 1e18;
        } else if (pool.asset == chip) {
            pool.assetDecimals = 18;
            pool.price = chip.getPrice();
        } else {
            ERC20 token = ERC20(address(pool.asset));
            address pair = router.pairFor(address(note), address(token), false);
            if (!router.isPair(pair)) {
                pool.price = 0;
            } else {
                pool.assetDecimals = token.decimals();
                pool.price = IBaseV1Pair(pair).quote(
                    address(token),
                    10**pool.assetDecimals,
                    1
                );
            }
        }
    }
}
