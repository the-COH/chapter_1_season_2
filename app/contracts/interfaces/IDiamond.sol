// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { ISafeOwnable } from './ISafeOwnable.sol';
import { IERC165 } from './IERC165.sol';
import { IDiamondBase } from './IDiamondBase.sol';
import { IDiamondLoupe } from './IDiamondLoupe.sol';
import { IDiamondCut } from './IDiamondCut.sol';

interface IDiamond is
    IDiamondBase,
    IDiamondLoupe,
    IDiamondCut,
    ISafeOwnable,
    IERC165
{
    receive() external payable;

    function getFallbackAddress() external view returns (address);

    function setFallbackAddress(address fallbackAddress) external;
}
