//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./interface/IHouse.sol";
import "./interface/ICollectable.sol";
import "./interface/ICollector.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";

import "@uniswap/v3-periphery/contracts/libraries/LiquidityAmounts.sol";
import "@uniswap/v3-core/contracts/libraries/TickMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

import {BaseV1Router01, IBaseV1Pair, IBaseV1Factory} from "./canto/BaseV1-periphery.sol";
import {BaseV1Pair} from "./canto/BaseV1-core.sol";

contract Chip is Ownable, ERC20 {
    using Math for uint256;

    IERC20 public beto;
    IERC20 public note;

    BaseV1Pair public pair;
    BaseV1Router01 public router;

    uint256 public immutable PRECISION = 1e12;

    constructor(
        address _beto,
        address _note,
        address _router,
        address _factory
    ) ERC20("CHIP", "CHIP") {
        beto = IERC20(_beto);
        note = IERC20(_note);
        router = BaseV1Router01(_router);
        address _pair = IBaseV1Factory(_factory).getPair(_beto, _note, false);
        if (!router.isPair(_pair)) {
            _pair = IBaseV1Factory(_factory).createPair(_beto, _note, false);
            pair = BaseV1Pair(_pair);
        } else {
            pair = BaseV1Pair(_pair);
        }
    }

    function mint(uint256 amountAddBeto, uint256 amountAddNote)
        public
        returns (
            uint256 liquidityAdd,
            uint256 amountAddA,
            uint256 amountAddB,
            uint256 mintAmount
        )
    {
        bool betoIsA = address(beto) < address(note);
        // uint256 amountAddA = 0;
        // uint256 amountAddB = 0;
        {
            beto.transferFrom(_msgSender(), address(this), amountAddBeto);
            note.transferFrom(_msgSender(), address(this), amountAddNote);
            if (
                beto.allowance(address(this), address(router)) < amountAddBeto
            ) {
                beto.approve(address(router), type(uint256).max);
            }
            if (
                note.allowance(address(this), address(router)) < amountAddNote
            ) {
                note.approve(address(router), type(uint256).max);
            }

            (address tokenA, address tokenB) = betoIsA
                ? (address(beto), address(note))
                : (address(note), address(beto));
            (uint256 amountA, uint256 amountB) = betoIsA
                ? (amountAddBeto, amountAddNote)
                : (amountAddNote, amountAddBeto);

            (amountAddA, amountAddB, liquidityAdd) = router.addLiquidity(
                tokenA,
                tokenB,
                false,
                amountA,
                amountB,
                0,
                0,
                address(this),
                block.timestamp
            );
            if (totalLiquidity() == liquidityAdd) {
                mintAmount = liquidityAdd;
            } else {
                mintAmount = convertToChip(
                    liquidityAdd,
                    totalLiquidity() - liquidityAdd
                );
            }
            _mint(_msgSender(), mintAmount);
        }

        uint256 restBeto;
        uint256 restNote;
        if (betoIsA) {
            restBeto = amountAddBeto - amountAddA;
            restNote = amountAddNote - amountAddB;
        } else {
            restNote = amountAddNote - amountAddA;
            restBeto = amountAddBeto - amountAddB;
        }
        if (restBeto > 0) {
            beto.transfer(_msgSender(), restBeto);
        }
        if (restNote > 0) {
            note.transfer(_msgSender(), restNote);
        }
    }

    function swapAndMint(
        uint256 amountAddBeto,
        uint256 amountAddNote,
        bool betoForNote,
        uint256 swapAmount
    )
        public
        returns (
            uint256 liquidity,
            uint256 amount0,
            uint256 amount1,
            uint256 mintAmount
        )
    {
        beto.transferFrom(_msgSender(), address(this), amountAddBeto);
        note.transferFrom(_msgSender(), address(this), amountAddNote);

        (address tokenIn, address tokenOut) = betoForNote
            ? (address(beto), address(note))
            : (address(note), address(beto));

        IERC20(tokenIn).approve(address(router), swapAmount);
        uint256[] memory amounts = router.swapExactTokensForTokensSimple(
            swapAmount,
            0,
            tokenIn,
            tokenOut,
            false,
            address(this),
            block.timestamp
        );
        if (betoForNote) {
            amountAddBeto -= swapAmount;
            amountAddNote += amounts[0];
        } else {
            amountAddNote -= swapAmount;
            amountAddBeto += amounts[0];
        }
        return mint(amountAddBeto, amountAddNote);
    }

    function withdraw(uint128 amount)
        public
        returns (uint256 amountA, uint256 amountB)
    {
        _burn(_msgSender(), amount);
        bool betoIsA = address(beto) < address(note);

        (address tokenA, address tokenB) = betoIsA
            ? (address(beto), address(note))
            : (address(note), address(beto));

        pair.approve(address(router), amount);
        (amountA, amountB) = router.removeLiquidity(
            tokenA,
            tokenB,
            false,
            amount,
            0,
            0,
            _msgSender(),
            block.timestamp
        );
    }

    function getPrice() public view returns (uint256) {
        (uint256 amountA, uint256 amountB) = router.quoteRemoveLiquidity(
            address(beto),
            address(note),
            false,
            1e18
        );
        bool betoIsA = address(beto) < address(note);
        (uint256 betoAmount, uint256 noteAmount) = betoIsA
            ? (amountA, amountB)
            : (amountB, amountA);

        uint256 betoPrice = pair.quote(address(beto), 10**18, 1);
        uint256 betoValue = Math.mulDiv(betoPrice, betoAmount, 1e18);
        return betoValue + noteAmount;
    }

    function totalLiquidity() public view returns (uint256) {
        return pair.balanceOf(address(this));
    }

    function convertToChip(uint256 liquidity, uint256 _totalLiquidity)
        public
        view
        virtual
        returns (uint256)
    {
        uint256 _totalChip = totalSupply();
        return _totalChip.mulDiv(liquidity, _totalLiquidity);
    }

    function convertToChip(uint256 liquidity)
        public
        view
        virtual
        returns (uint256)
    {
        uint256 _totalChip = totalSupply();
        uint256 _totalLiquidity = totalLiquidity();
        return _totalChip.mulDiv(liquidity, _totalLiquidity);
    }

    function convertToLiquidity(uint256 chip)
        public
        view
        virtual
        returns (uint128)
    {
        uint256 _totalChip = totalSupply();
        uint256 _totalLiquidity = totalLiquidity();
        return uint128(chip.mulDiv(_totalLiquidity, _totalChip));
    }
}
