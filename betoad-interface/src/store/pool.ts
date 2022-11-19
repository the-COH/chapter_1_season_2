import { CosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import BigNumber from "bignumber.js";
import { makeAutoObservable } from "mobx";
import { Pool, PoolRaw } from "types/pool";
import { BetoContract } from "./contract";

export default class PoolStore {
  rootStore;
  pools: Pool[];

  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;
    this.pools = [];
  }

  async load(contract?: BetoContract) {
    if (contract) {
      const raws: PoolRaw[] = await contract?.readonlyHouse.allDetailPools(
        this.rootStore.walletStore.address
      );
      console.log("raws", raws);
      this.pools = raws.map<Pool>((raw) => ({
        ...raw,
        poolId: new BigNumber(raw.poolId.toString()),
        balance: new BigNumber(raw.balance.toString()),
        deposit: new BigNumber(raw.deposit.toString()),
        myDeposit: new BigNumber(raw.myDeposit.toString()),
        price: new BigNumber(raw.price.toString()),
      }));
    }
  }
}
