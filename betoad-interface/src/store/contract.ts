import { Contract } from "ethers";
import { makeAutoObservable } from "mobx";
import {
  House,
  Dice,
  ERC20,
  Distributor,
  Collector,
  Random,
  Rewarder,
  Chip,
} from "typechain";
import { HouseContract } from "types/contract";

export interface BetoContract {
  house: House;
  readonlyHouse: House;
  random: Random;
  readonlyRandom: Random;
  dice: Dice;
  readonlyDice: Dice;
  rewarder: Rewarder;
  readonlyRewarder: Rewarder;
  distributor: Distributor;
  readonlyDistributor: Distributor;
  collector: Collector;
  readonlyCollector: Collector;
  chip: Chip;
  readonlyChip: Chip;
}

export default class ContractStore {
  rootStore;
  contract?: BetoContract;
  token: Record<string, ERC20>;
  readonlyToken: Record<string, ERC20>;
  house: HouseContract | null;
  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;
    this.house = null;
    this.token = {};
    this.readonlyToken = {};
  }

  async loadHouseContract(wasm: any) {}

  // async loadHouseContractPools(wasm: any) {
  //   if (!this.house) {
  //     this.house = await wasm.query("house", { state: {} });
  //   }
  //   if (this.house) {
  //     const result = await wasm.query("house", { pools: {} });
  //     this.house.pools = result;
  //   }
  // }
}
