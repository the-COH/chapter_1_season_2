//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "../interface/IRandom.sol";
import "../interface/IHouse.sol";
import "../interface/IDice.sol";
import "../interface/IGame.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Dice is IDice, IGame, Ownable {
    event Bet(uint256 betId);
    event Settle(address target, bool isWin, uint8 luckyNumber);
    event SettleAll(uint256 lastBetId);

    IRandom public randomContract;
    IHouse public houseContract;
    uint256 public gameId;
    uint256 public protocolFee;
    uint256 public nextSettleBetId;
    uint256 public immutable PRECISION;

    address[] public bets;
    mapping(address => uint256) public betMap;

    constructor() {
        PRECISION = 1e6;
    }

    modifier onlyHouse() {
        require(_msgSender() == address(houseContract), "Unauthorized");
        _;
    }

    function setHouseContract(address addr) public onlyOwner {
        houseContract = IHouse(addr);
    }

    function setRandomContract(address addr) public onlyOwner {
        randomContract = IRandom(addr);
    }

    function setProtocolFee(uint256 fee) public onlyOwner {
        protocolFee = fee;
    }

    function setGameId(uint256 id) public override onlyHouse {
        gameId = id;
    }

    function bet(
        uint256 poolId,
        uint256 amount,
        uint16 randomKey,
        uint8 prediction,
        bool isOver
    ) public override returns (uint256 betId) {
        (, IERC20 asset, , , , , ) = houseContract.pools(poolId);
        require(prediction < 100, "PTB");
        require(betMap[msg.sender] == 0 || betMap[msg.sender] % 2 == 1, "AB");
        asset.transferFrom(msg.sender, address(houseContract), amount);
        houseContract.addShare(msg.sender, poolId, gameId, amount);
        uint256 prize;
        if (isOver) {
            uint256 rate = ((PRECISION * 100) / (99 - prediction));
            uint256 prizeRate = ((1e6 - protocolFee) * rate) / PRECISION;
            prize = (prizeRate * amount) / 1e6;
        } else {
            uint256 rate = ((PRECISION * 100) / prediction);
            uint256 prizeRate = ((1e6 - protocolFee) * rate) / PRECISION;
            prize = (prizeRate * amount) / 1e6;
        }
        require(prize < type(uint128).max, "TB");
        uint256 betData = encodeBetData(
            uint128(prize),
            uint64(block.number),
            uint32(poolId),
            0,
            prediction,
            isOver,
            false
        );

        bets.push(msg.sender);
        betMap[msg.sender] = betData;
        randomContract.requestRandom(block.number);
        betId = bets.length - 1;
        emit Bet(betId);
    }

    function requestRandom(address target) public onlyOwner {
        uint256 betData = betMap[target];
        (, uint64 blockNumber, , , , , bool isEnd) = decodeBetData(betData);
        if (!isEnd) {
            randomContract.requestRandom(blockNumber);
        }
    }

    function settle(address target) public {
        uint256 betData = betMap[target];
        (
            uint128 prize,
            uint64 blockNumber,
            uint32 poolId,
            uint8 luckyNumber,
            uint8 prediction,
            bool isOver,
            bool isEnd
        ) = decodeBetData(betData);
        require(isEnd == false, "AE");
        bool isWin = false;
        {
            uint256 randomSeed = randomContract.heightToRandom(blockNumber);
            require(randomSeed != 0, "NI"); // Not Init;
            unchecked {
                uint256 randomSeed2 = uint256(
                    keccak256(abi.encodePacked(blockNumber, target))
                );
                luckyNumber = uint8((randomSeed + randomSeed2) % 100);
            }
            if (
                (isOver && prediction < luckyNumber) ||
                (!isOver && prediction > luckyNumber)
            ) {
                houseContract.settle(target, poolId, gameId, 0, prize);
                isWin = true;
            }
        }
        betMap[target] = encodeBetData(
            prize,
            blockNumber,
            poolId,
            luckyNumber,
            prediction,
            isOver,
            true
        );
        emit Settle(target, isWin, luckyNumber);
    }

    function settleAll() public {
        uint256 i = nextSettleBetId;
        uint64 betHeight = 0;
        uint256 randomSeed = 0;
        for (; bets.length > i; i++) {
            address target = bets[i];
            uint256 betData = betMap[target];
            (
                uint128 prize,
                uint64 blockNumber,
                uint32 poolId,
                uint8 luckyNumber,
                uint8 prediction,
                bool isOver,
                bool isEnd
            ) = decodeBetData(betData);
            if (blockNumber < block.number) {
                if (isEnd == true) continue;
                if (betHeight != blockNumber) {
                    betHeight = blockNumber;
                    randomSeed = randomContract.heightToRandom(betHeight);
                    if (randomSeed == 0) {
                        break;
                    }
                }
                unchecked {
                    uint256 randomSeed2 = uint256(
                        keccak256(abi.encodePacked(blockNumber, target))
                    );
                    luckyNumber = uint8((randomSeed + randomSeed2) % 100);
                }
                bool isWin = false;
                if (
                    (isOver && prediction < luckyNumber) ||
                    (!isOver && prediction > luckyNumber)
                ) {
                    houseContract.settle(target, poolId, gameId, 0, prize);
                    isWin = true;
                }
                betMap[target] = encodeBetData(
                    prize,
                    blockNumber,
                    poolId,
                    luckyNumber,
                    prediction,
                    isOver,
                    true
                );
            } else {
                break;
            }
        }
        nextSettleBetId = i;
        emit SettleAll(i - 1);
    }

    function betInfo(address target)
        public
        view
        returns (
            address player,
            uint128 prize,
            uint64 blockNumber,
            uint32 poolId,
            uint8 luckyNumber,
            uint8 prediction,
            bool isOver,
            bool isEnd
        )
    {
        player = target;
        uint256 betData = betMap[player];
        (
            prize,
            blockNumber,
            poolId,
            luckyNumber,
            prediction,
            isOver,
            isEnd
        ) = decodeBetData(betData);
    }

    function betInfo(uint256 betId)
        public
        view
        returns (
            address player,
            uint128 prize,
            uint64 blockNumber,
            uint32 poolId,
            uint8 luckyNumber,
            uint8 prediction,
            bool isOver,
            bool isEnd
        )
    {
        player = bets[betId];
        uint256 betData = betMap[player];
        (
            prize,
            blockNumber,
            poolId,
            luckyNumber,
            prediction,
            isOver,
            isEnd
        ) = decodeBetData(betData);
    }

    function encodeBetData(
        uint128 prize,
        uint64 blockNumber,
        uint32 poolId,
        uint8 luckyNumber,
        uint8 prediction,
        bool isOver,
        bool isEnd
    ) public pure returns (uint256 data) {
        data = uint256(prize) << 128;
        data += uint128(blockNumber) << 64;
        data += uint64(poolId) << 32;
        data += uint24(luckyNumber) << 10;
        data += uint16(prediction) << 2;
        data += (isOver ? 1 : 0) << 1;
        data += (isEnd ? 1 : 0);
    }

    function decodeBetData(uint256 data)
        public
        pure
        returns (
            uint128 prize,
            uint64 blockNumber,
            uint32 poolId,
            uint8 luckyNumber,
            uint8 prediction,
            bool isOver,
            bool isEnd
        )
    {
        prize = uint128(data >> 128);
        blockNumber = uint64(data % (2**128) >> 64);
        poolId = uint32(data % (2**192) >> 32);
        luckyNumber = uint8(data % (2**224) >> 10);
        prediction = uint8(data % (2**234) >> 2);
        isOver = (data >> 1) % 2 == 1 ? true : false;
        isEnd = data % 2 == 1 ? true : false;
    }
}
