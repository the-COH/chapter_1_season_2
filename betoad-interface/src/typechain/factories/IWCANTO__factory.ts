/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type { IWCANTO, IWCANTOInterface } from "../IWCANTO";

const _abi = [
  {
    inputs: [],
    name: "deposit",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IWCANTO__factory {
  static readonly abi = _abi;
  static createInterface(): IWCANTOInterface {
    return new utils.Interface(_abi) as IWCANTOInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IWCANTO {
    return new Contract(address, _abi, signerOrProvider) as IWCANTO;
  }
}