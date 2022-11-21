// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { IERC721BaseInternal } from './IERC721BaseInternal.sol';

interface IERC721MetadataInternal is IERC721BaseInternal {
    error ERC721Metadata__NonExistentToken();
}
