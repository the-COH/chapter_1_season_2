// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { AddressUtils } from '../../utils/AddressUtils.sol';
import { IDiamondBase } from '../../interfaces/IDiamondBase.sol';
import { DiamondBaseStorage } from './DiamondBaseStorage.sol';

abstract contract DiamondBase is IDiamondBase {
	using AddressUtils for address;

    function _getImplementation() internal view returns (address) {
        // inline storage layout retrieval uses less gas
        DiamondBaseStorage.Layout storage l;
        bytes32 slot = DiamondBaseStorage.STORAGE_SLOT;
        assembly {
            l.slot := slot
        }

        address implementation = address(bytes20(l.facets[msg.sig]));

        if (implementation == address(0)) {
            implementation = l.fallbackAddress;
            if (implementation == address(0))
                revert DiamondBase__NoFacetForSignature();
        }

        return implementation;
    }

	fallback() external payable virtual {
        address implementation = _getImplementation();

        if (!implementation.isContract())
            revert DiamondBase__ImplementationIsNotContract();

        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(
                gas(),
                implementation,
                0,
                calldatasize(),
                0,
                0
            )
            returndatacopy(0, 0, returndatasize())

            switch result
            case 0 {
                revert(0, returndatasize())
            }
            default {
                return(0, returndatasize())
            }
        }
    }
}
