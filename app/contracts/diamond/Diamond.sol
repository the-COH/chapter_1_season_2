// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { IOwnable, Ownable, OwnableInternal, OwnableStorage } from '../libs/ownable/Ownable.sol';
import { ISafeOwnable, SafeOwnable } from '../libs/ownable/SafeOwnable.sol';
import { IERC173 } from '../interfaces/IERC173.sol';
import { ERC165, IERC165, ERC165Storage } from '../libs/erc165/ERC165.sol';
import { DiamondBase, DiamondBaseStorage } from './base/DiamondBase.sol';
import { DiamondLoupe, IDiamondLoupe } from './loupe/DiamondLoupe.sol';
import { DiamondCut, IDiamondCut } from './cut/DiamondCut.sol';
import { IDiamond } from '../interfaces/IDiamond.sol';

contract Diamond is
    IDiamond,
    DiamondBase,
    DiamondLoupe,
    DiamondCut,
    SafeOwnable,
    ERC165
{
    using DiamondBaseStorage for DiamondBaseStorage.Layout;
    using ERC165Storage for ERC165Storage.Layout;
    using OwnableStorage for OwnableStorage.Layout;

    constructor() {
        ERC165Storage.Layout storage erc165 = ERC165Storage.layout();
        bytes4[] memory selectors = new bytes4[](12);

        // register DiamondCut

        selectors[0] = IDiamondCut.diamondCut.selector;

        erc165.setSupportedInterface(type(IDiamondCut).interfaceId, true);

        // register DiamondLoupe

        selectors[1] = IDiamondLoupe.facets.selector;
        selectors[2] = IDiamondLoupe.facetFunctionSelectors.selector;
        selectors[3] = IDiamondLoupe.facetAddresses.selector;
        selectors[4] = IDiamondLoupe.facetAddress.selector;

        erc165.setSupportedInterface(type(IDiamondLoupe).interfaceId, true);

        // register ERC165

        selectors[5] = IERC165.supportsInterface.selector;

        erc165.setSupportedInterface(type(IERC165).interfaceId, true);

        // register SafeOwnable

        selectors[6] = Ownable.owner.selector;
        selectors[7] = SafeOwnable.nomineeOwner.selector;
        selectors[8] = Ownable.transferOwnership.selector;
        selectors[9] = SafeOwnable.acceptOwnership.selector;

        erc165.setSupportedInterface(type(IERC173).interfaceId, true);

        // register Diamond

        selectors[10] = Diamond.getFallbackAddress.selector;
        selectors[11] = Diamond.setFallbackAddress.selector;

        // diamond cut

        FacetCut[] memory facetCuts = new FacetCut[](1);

        facetCuts[0] = FacetCut({
            target: address(this),
            action: FacetCutAction.ADD,
            selectors: selectors
        });

        _diamondCut(facetCuts, address(0), '');

        // set owner

        OwnableStorage.layout().setOwner(msg.sender);
    }

    receive() external payable {}

    function getFallbackAddress() external view returns (address) {
        return DiamondBaseStorage.layout().fallbackAddress;
    }

    function setFallbackAddress(address fallbackAddress) external onlyOwner {
        DiamondBaseStorage.layout().fallbackAddress = fallbackAddress;
    }

    function _transferOwnership(address account)
        internal
        virtual
        override(OwnableInternal, SafeOwnable)
    {
        super._transferOwnership(account);
    }
}
