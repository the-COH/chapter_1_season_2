import { makeAutoObservable } from "mobx";
import RootStore from "./root";
import BigNumber from "bignumber.js";
import { addressToTokenInfo } from "constants/token";
import ADDRESS from "constants/address";

export default class BalanceStore {
  rootStore: RootStore;
  balances: Record<string, BigNumber>;
  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;
    this.balances = {};
  }

  async loadAll() {}

  async load(assets: string[]) {
    // assets.forEach(async (asset: string) => {
    //   // if (isNativeToken(assetInfo)) {
    //   //   const balance = await this.rootStore.lcd.bank.balance(
    //   //     this.rootStore.walletStore.address
    //   //   );
    //   //   const amount = balance[0]
    //   //     .get(key)
    //   //     ?.toString()
    //   //     .replaceAll(/[a-zA-Z]/gi, "");
    //   //   this.balances[key] = new BigNumber(amount || "0");
    //   // } else {
    //   const response = await this.rootStore.lcd.wasm.contractQuery<
    //     Record<string, string>
    //   >(asset, {
    //     balance: { address: this.rootStore.walletStore.address },
    //   });
    //   this.balances[key] = new BigNumber(response.balance);
    //   // }
    // });
  }

  get(key: string) {
    return this.balances[key];
  }

  getBETO() {
    return this.balances[ADDRESS.BETO];
  }

  getString(key: string) {
    return (
      this.balances[key]
        ?.shiftedBy(-addressToTokenInfo[key]?.decimals)
        .decimalPlaces(4, 1)
        .toFormat() || "0"
    );
  }
}
