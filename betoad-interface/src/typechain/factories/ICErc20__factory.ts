/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { ICErc20, ICErc20Interface } from "../ICErc20";

const _abi = [
  {
    inputs: [],
    name: "underlying",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class ICErc20__factory {
  static readonly abi = _abi;
  static createInterface(): ICErc20Interface {
    return new utils.Interface(_abi) as ICErc20Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ICErc20 {
    return new Contract(address, _abi, signerOrProvider) as ICErc20;
  }
}
