import BigNumber from "bignumber.js";
import { BigNumber as EthBigNumber } from "ethers";
import { makeAutoObservable } from "mobx";
import { Asset, AssetRaw } from "types/asset";

export interface PoolRaw {
  poolId: EthBigNumber;
  asset: string;
  name: string;
  balance: EthBigNumber;
  deposit: EthBigNumber;
  myDeposit: EthBigNumber;
  price: EthBigNumber;
  isActive: boolean;
}

export interface Pool {
  poolId: BigNumber;
  asset: string;
  name: string;
  balance: BigNumber;
  deposit: BigNumber;
  myDeposit: BigNumber;
  price: BigNumber;
  isActive: boolean;
}
