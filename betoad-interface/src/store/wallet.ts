import { makeAutoObservable } from "mobx";
export default class WalletStore {
  rootStore;
  type: string;
  isActive: boolean;
  name: string;
  address: string;
  pubkey: any;
  chainId: string;

  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;
    this.type = "";
    this.isActive = false;
    this.name = "";
    this.address = "";
    this.chainId = "";
  }

  clear() {
    this.type = "";
    this.isActive = false;
    this.name = "";
    this.address = "";
    this.pubkey = null;
  }
}
