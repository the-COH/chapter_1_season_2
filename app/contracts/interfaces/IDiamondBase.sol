// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IDiamondBase {
	error DiamondBase__ImplementationIsNotContract();
    error DiamondBase__NoFacetForSignature();

	fallback() external payable;
}
