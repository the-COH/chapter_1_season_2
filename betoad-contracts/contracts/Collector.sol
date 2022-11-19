//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

import "./interface/IHouse.sol";
import "./interface/ICollector.sol";
import "./interface/IDistributor.sol";
import "./interface/ICollectable.sol";
import "./ERC20Mint.sol";
import "./Chip.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";

import {BaseV1Router01, IBaseV1Pair} from "./canto/BaseV1-periphery.sol";

contract Collector is ICollector, Ownable {
    ERC20Mint public beto;
    IERC20 public note;
    address public chip;

    address[] public assets;
    mapping(address => AssetInfo) public asset;
    ContractInfo[] public harvestContracts;
    IDistributor public distributor;
    IUniswapV3Factory public uniswapV3Factory;
    ISwapRouter public swapRouter;
    BaseV1Router01 public router;

    uint256 public totalBuybackAmount;
    uint256 public totalBurnAmount;

    BuybackType public buybackType;

    enum BuybackType {
        PERMISSIONED,
        PERMISIIONLESS
    }

    constructor(
        address _beto,
        address _note,
        address _router
    ) {
        beto = ERC20Mint(_beto);
        note = IERC20(_note);
        router = BaseV1Router01(_router);

        // uniswapV3Factory = IUniswapV3Factory(_factory);
        // swapRouter = ISwapRouter(_swapRouter);
    }

    function addAsset(address _asset)
        public
        override
        onlyOwner
        returns (uint256 index)
    {
        require(asset[_asset].isActive == false, "AE");
        assets.push(_asset);
        index = assets.length - 1;
        asset[_asset] = AssetInfo(index, 0, true);
    }

    function removeAsset(address _asset) public override onlyOwner {
        asset[_asset].isActive = false;
        assets[asset[_asset].index] = assets[assets.length - 1];
        assets.pop();
    }

    function addHarvestContract(address _contract)
        public
        override
        onlyOwner
        returns (uint256)
    {
        harvestContracts.push(ContractInfo(ICollectable(_contract), true));
        return harvestContracts.length - 1;
    }

    function removeHarvestContract(uint256 contractId)
        public
        override
        onlyOwner
    {
        harvestContracts[contractId].isActive = false;
    }

    function swapForNote(address _asset) public returns (uint256 amountOut) {
        AssetInfo memory assetInfo = asset[_asset];
        if (
            assetInfo.isActive &&
            _asset != address(note) &&
            _asset != address(beto)
        ) {
            IERC20 assetToken = IERC20(_asset);
            uint256 amount = assetToken.balanceOf(address(this));
            if (amount > 0) {
                assetToken.approve(address(router), amount);
                if (_asset == chip) {
                    Chip(chip).withdraw(uint128(amount));
                } else {
                    uint256[] memory amounts = router
                        .swapExactTokensForTokensSimple(
                            amount,
                            0,
                            address(note),
                            _asset,
                            false,
                            address(this),
                            block.timestamp
                        );
                    amountOut = amounts[0];
                }
            }
        }
    }

    function swapAllForNote() public returns (uint256 amountOut) {
        for (uint256 i = 0; i < assets.length; i++) {
            amountOut += swapForNote(assets[i]);
        }
    }

    function buybackBeto() public override returns (uint256 amountOut) {
        if (buybackType == BuybackType.PERMISSIONED) {
            require(owner() == _msgSender(), "UA");
        }
        uint256 amount = note.balanceOf(address(this));
        if (amount > 0) {
            note.approve(address(router), amount);
            uint256[] memory amounts = router.swapExactTokensForTokensSimple(
                amount,
                0,
                address(note),
                address(beto),
                false,
                address(this),
                block.timestamp
            );
            totalBuybackAmount = totalBuybackAmount + amounts[0];
            amountOut = amounts[0];
        }
    }

    function burnOrDistribute() public override returns (uint256 amount) {
        amount = beto.balanceOf(address(this));
        if (distributor.getCurrentRound() < 1000) {
            totalBurnAmount += amount;
            beto.burn(amount);
        } else {
            beto.transfer(address(distributor), amount);
        }
    }

    function harvest() public override {
        for (uint256 i = 0; i < harvestContracts.length; i++) {
            if (harvestContracts[i].isActive) {
                harvestContracts[i].collectable.collect();
            }
        }
    }

    function collect(address _asset, uint256 amount) public override {
        AssetInfo storage assetInfo = asset[_asset];
        require(asset[_asset].isActive, "NA");
        IERC20(_asset).transferFrom(_msgSender(), address(this), amount);
        assetInfo.profit += amount;
    }

    function allAssetInfos() public view returns (AssetInfo[] memory) {
        AssetInfo[] memory assetInfos = new AssetInfo[](assets.length);
        for (uint256 i = 0; i < assets.length; i++) {
            assetInfos[i] = asset[assets[i]];
        }
        return assetInfos;
    }

    function allAssetProfits() public view returns (ProfitResponse[] memory) {
        ProfitResponse[] memory assetProfits = new ProfitResponse[](
            assets.length
        );
        for (uint256 i = 0; i < assets.length; i++) {
            assetProfits[i] = ProfitResponse(
                assets[i],
                asset[assets[i]].profit
            );
        }
        return assetProfits;
    }

    function allBalances() public view returns (BalanceResponse[] memory) {
        BalanceResponse[] memory balances = new BalanceResponse[](
            assets.length + 1
        );
        for (uint256 i = 0; i < assets.length; i++) {
            balances[i] = BalanceResponse(
                assets[i],
                ERC20(assets[i]).balanceOf(address(this))
            );
        }
        balances[assets.length] = BalanceResponse(
            address(note),
            note.balanceOf(address(this))
        );
        return balances;
    }

    function setBuybackType(BuybackType _type) public onlyOwner {
        buybackType = _type;
    }

    function setBeto(address _beto) public onlyOwner {
        beto = ERC20Mint(_beto);
    }

    function setDistributor(address _distributor) public onlyOwner {
        distributor = IDistributor(_distributor);
    }
}
