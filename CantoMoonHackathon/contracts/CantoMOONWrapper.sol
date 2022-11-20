// SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import "contracts/CantoMOON.sol";

contract CantoMoonWrapper is Ownable {
    CantoMOON public immutable cantomoon;

        constructor(address payable _moonAddress) {
        cantomoon = CantoMOON(_moonAddress);
    }

    
    function updateBuyFees(uint256 _marketingFee, uint256 _liquidityFee, uint256 _devFee) external onlyOwner {
        require((_marketingFee + _liquidityFee + _devFee) <= 15, "Must keep fees at 15% or less");
        cantomoon.updateBuyFees(_marketingFee, _liquidityFee, _devFee);
    }

    function updateSellFees(uint256 _marketingFee, uint256 _liquidityFee, uint256 _devFee) external onlyOwner {
        require((_marketingFee + _liquidityFee + _devFee) <= 15, "Must keep fees at 15% or less");
        cantomoon.updateSellFees(_marketingFee, _liquidityFee, _devFee);
    }

    // allows removal of tax fees and trade limits after token is stable
    function removeLimits() external onlyOwner {
        cantomoon.removeLimits();
    }

    function updateMaxTxnAmount(uint256 newNum) external onlyOwner {
        cantomoon.updateMaxTxnAmount(newNum);
    }

    function excludeFromMaxTransaction(address updAds, bool isEx) external onlyOwner {
        cantomoon.excludeFromMaxTransaction(updAds, isEx);
    } 

    function excludeFromFees(address account, bool excluded) external onlyOwner {
        cantomoon.excludeFromFees(account, excluded);
    }

    function setAutomatedMarketMakerPair(address pair, bool value) external onlyOwner {
        cantomoon.setAutomatedMarketMakerPair(pair, value);
    }

     function updateMarketingWallet(address newMarketingWallet) external onlyOwner {
         cantomoon.updateMarketingWallet(newMarketingWallet);
     }

     function updateDevWallet(address newWallet) external onlyOwner {
         cantomoon.updateDevWallet(newWallet);
     }

     function setAutoLPBurnSettings(uint256 _frequencyInSeconds, uint256 _percent, bool _Enabled) external onlyOwner { 
         cantomoon.setAutoLPBurnSettings(_frequencyInSeconds, _percent, _Enabled);
     }

     function manualBurnLiquidityPairTokens(uint256 percent) external onlyOwner {
         cantomoon.manualBurnLiquidityPairTokens(percent);
     }
}