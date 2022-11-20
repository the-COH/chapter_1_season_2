// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { IERC721 } from './IERC721.sol';
import { IERC721BaseInternal } from './IERC721BaseInternal.sol';

interface IERC721Base is IERC721BaseInternal, IERC721 {}
