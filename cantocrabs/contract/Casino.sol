pragma solidity ^0.8.0;

import "../contracts/utils/math/SafeMath.sol";
import "../contracts/access/Ownable.sol";
import "../contracts/utils/Address.sol";
import "./Auth.sol";
import "../contracts/utils/Counters.sol";

contract Roulette is Auth {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    function isEven(uint256 x) internal pure returns (bool) {
        uint256 result = x % 2;
        bool answer = result == 0 ? true : false;
        return answer;
    }

    function isOdd(uint256 x) internal pure returns (bool) {
        uint256 result = x % 2;
        bool answer = result == 1 ? true : false;
        return answer;
    }

    function isInColumn(uint256 x, uint256 column)
        internal
        pure
        returns (bool)
    {
        uint256 upperLimit = column * 12;
        uint256 lowerLimit = ((column - 1) * 12) + 1;

        if (x >= lowerLimit && x <= upperLimit) {
            return true;
        }

        return false;
    }

    function isInRow(uint256 x, uint256 row) internal pure returns (bool) {
        uint256 result = x % 3;
        if (result == 0 && row == 3) {
            return true;
        }
        if (result == row) {
            return true;
        }
        return false;
    }

    function isRed(uint256 x) internal pure returns (bool) {
        bool numberEven = isEven(x);
        if (x <= 10) {
            return !numberEven;
        }
        if (x <= 18) {
            return numberEven;
        }
        if (x <= 28) {
            return !numberEven;
        }
        if (x <= 36) {
            return numberEven;
        }
        return false;
    }

    function isBlack(uint256 x) internal pure returns (bool) {
        return !isRed(x);
    }

    function random() internal view returns (uint256) {
        return
            uint256(
                keccak256(
                    abi.encodePacked(
                        block.difficulty,
                        block.timestamp,
                        msg.sender
                    )
                )
            );
    }

    enum BetType {
        SINGLE,
        ODD,
        EVEN,
        COLUMN,
        ROW,
        COLOR
    }

    /* 
0 => SINGLE
1 => ODD
2 => EVEN
3 => COLUMN
4 => ROW
5 => COLOR
*/
    mapping(uint256 => uint256) PAYOUT;

    uint256 FEE = 5;
    uint256 FEE_DENOM = 100;
    address private _HOUSE;
    Counters.Counter betsCounter;

    enum GameStatus {
        PENDING,
        WON,
        LOST
    }

    struct Bet {
        uint256 betId;
        uint256 betAmount;
        address player;
        GameStatus status;
    }

    mapping(uint256 => Bet) idToBet;

    function getFee(uint256 amount) internal view returns (uint256) {
        return amount.mul(FEE).div(FEE_DENOM);
    }

    uint256 MIN_BET_VALUE = 200 wei;
    uint256 MAX_BET_VALUE = 2000 wei;

    event GameBet(
        uint256 indexed betId,
        uint256 amount,
        address player,
        uint256 result
    );

    constructor() Auth(msg.sender) {
        PAYOUT[uint256(BetType.SINGLE)] = 35;
        PAYOUT[uint256(BetType.EVEN)] = 1;
        PAYOUT[uint256(BetType.ODD)] = 1;
        PAYOUT[uint256(BetType.COLUMN)] = 2;
        PAYOUT[uint256(BetType.ROW)] = 2;
        PAYOUT[uint256(BetType.COLOR)] = 1;

        _HOUSE = msg.sender;
    }

    function placeBet(uint256 number, uint256 betType)
        external
        payable
        returns (uint256)
    {
        require(msg.value >= MIN_BET_VALUE, "Bet is too small");
        require(msg.value <= MAX_BET_VALUE, "Bet is too large");

        betsCounter.increment();

        uint256 betAmount = msg.value;
        address _PLAYER = msg.sender;
        uint256 randomNumber = random();

        uint256 payout = 0;
        uint256 totalPayout = 0;
        uint256 finalPayout = 0;
        uint256 houseFee = getFee(betAmount);

        if (betType == uint256(BetType.SINGLE)) {
            bool result = ((randomNumber % 36) + 1) == number ? true : false;
            if (result) {
                payout = betAmount * PAYOUT[uint256(BetType.SINGLE)];
                totalPayout = payout + betAmount;
                houseFee = getFee(totalPayout);
                finalPayout = totalPayout.sub(houseFee);
            }
        }

        if (betType == uint256(BetType.COLUMN)) {
            bool result = ((randomNumber % 3) + 1) == number ? true : false;
            if (result) {
                payout = betAmount * PAYOUT[uint256(BetType.COLUMN)];
                totalPayout = payout + betAmount;
                houseFee = getFee(totalPayout);
                finalPayout = totalPayout.sub(houseFee);
            }
        }
        if (betType == uint256(BetType.ROW)) {
            bool result = ((randomNumber % 3) + 1) == number ? true : false;
            if (result) {
                payout = betAmount * PAYOUT[uint256(BetType.ROW)];
                totalPayout = payout + betAmount;
                houseFee = getFee(totalPayout);
                finalPayout = totalPayout.sub(houseFee);
            }
        }
        if (betType == uint256(BetType.EVEN)) {
            bool result = ((randomNumber % 2)) == 0 ? true : false;
            if (result) {
                payout = betAmount * PAYOUT[uint256(BetType.EVEN)];
                totalPayout = payout + betAmount;
                houseFee = getFee(totalPayout);
                finalPayout = totalPayout.sub(houseFee);
            }
        }
        if (betType == uint256(BetType.ODD)) {
            bool result = ((randomNumber % 2)) == 1 ? true : false;
            if (result) {
                payout = betAmount * PAYOUT[uint256(BetType.COLOR)];
                totalPayout = payout + betAmount;
                houseFee = getFee(totalPayout);
                finalPayout = totalPayout.sub(houseFee);
            }
        }
        if (betType == uint256(BetType.COLOR)) {
            bool result = ((randomNumber % 2)) == 0 ? true : false;
            if (result) {
                payout = betAmount * PAYOUT[uint256(BetType.COLOR)];
                totalPayout = payout + betAmount;
                houseFee = getFee(totalPayout);
                finalPayout = totalPayout.sub(houseFee);
            }
        }
        if (finalPayout > 0) {
            (bool playerSent, bytes memory playerData) = _PLAYER.call{
                value: finalPayout
            }("");
        }

        (bool houseSent, bytes memory houseData) = _HOUSE.call{value: houseFee}(
            ""
        );
        require(houseSent, "Failed to pay the house");

        emit GameBet(betsCounter.current(), msg.value, msg.sender, finalPayout);
        return finalPayout;
    }
}
