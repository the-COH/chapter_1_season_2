// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { IERC721MetadataInternal } from './IERC721MetadataInternal.sol';

interface IERC721Metadata is IERC721MetadataInternal {
    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function tokenURI(uint256 tokenId) external view returns (string memory);
}
