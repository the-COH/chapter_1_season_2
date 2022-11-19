import BalanceStore from "./balance";
import GameStore from "./game";
import WalletStore from "./wallet";
import PoolStore from "./pool";
import ContractStore from "./contract";
import GovStore from "./gov";
import { makeAutoObservable } from "mobx";
import { providers } from "ethers";

export default class RootStore {
  balanceStore;
  gameStore;
  walletStore;
  poolStore;
  contractStore;
  govStore;
  rpc;
  constructor(rpc: providers.JsonRpcProvider) {
    makeAutoObservable(this);
    this.balanceStore = new BalanceStore(this);
    this.gameStore = new GameStore(this);
    this.walletStore = new WalletStore(this);
    this.poolStore = new PoolStore(this);
    this.contractStore = new ContractStore(this);
    this.govStore = new GovStore(this);
    this.rpc = rpc;
  }
}
