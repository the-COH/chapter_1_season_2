/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ICollectable, ICollectableInterface } from "../ICollectable";

const _abi = [
  {
    inputs: [],
    name: "collect",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class ICollectable__factory {
  static readonly abi = _abi;
  static createInterface(): ICollectableInterface {
    return new utils.Interface(_abi) as ICollectableInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ICollectable {
    return new Contract(address, _abi, signerOrProvider) as ICollectable;
  }
}