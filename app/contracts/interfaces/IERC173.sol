// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { IERC173Internal } from './IERC173Internal.sol';

// https://eips.ethereum.org/EIPS/eip-173

interface IERC173 is IERC173Internal {
    function owner() external view returns (address);

    function transferOwnership(address account) external;
}
