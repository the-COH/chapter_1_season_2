// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import { IERC173 } from '../../interfaces/IERC173.sol';
import { IOwnable } from '../../interfaces/IOwnable.sol';
import { OwnableInternal } from './OwnableInternal.sol';
import { OwnableStorage } from './OwnableStorage.sol';

// ERC173 ownership

abstract contract Ownable is IOwnable, OwnableInternal {
    using OwnableStorage for OwnableStorage.Layout;

    function owner() public view virtual returns (address) {
        return _owner();
    }

    function transferOwnership(address account) public virtual onlyOwner {
        _transferOwnership(account);
    }
}
