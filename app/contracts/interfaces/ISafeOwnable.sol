// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { IOwnable } from './IOwnable.sol';

interface ISafeOwnable is IOwnable {
    function nomineeOwner() external view returns (address);
    function acceptOwnership() external;
}
