// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// https://eips.ethereum.org/EIPS/eip-2535

interface IDiamondLoupe {
    struct Facet {
        address target;
        bytes4[] selectors;
    }

    function facets() external view returns (Facet[] memory diamondFacets);

    function facetFunctionSelectors(address facet)
        external
        view
        returns (bytes4[] memory selectors);

    function facetAddresses()
        external
        view
        returns (address[] memory addresses);

    function facetAddress(bytes4 selector)
        external
        view
        returns (address facet);
}
