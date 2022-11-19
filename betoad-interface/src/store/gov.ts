import BigNumber from "bignumber.js";
import { makeAutoObservable } from "mobx";
import { Proposal, GovState } from "types/gov";
import RootStore from "./root";

export default class govStore {
  rootStore: RootStore;
  state: GovState | null;
  proposalMap: Record<number, Proposal>;
  constructor(root: any) {
    makeAutoObservable(this);
    this.rootStore = root;
    this.proposalMap = {};
    this.state = null;
  }

  async loadState() {
    // const gov_contract = contracts["gov"].contractAddresses.default;
    // const govState = await this.rootStore.lcd.wasm.contractQuery<GovState>(
    //   gov_contract,
    //   { state: {} }
    // );
    // this.state = govState;
  }

  async cacheLoadState() {
    if (!this.state) {
      this.loadState();
    }
  }

  saveProposals(proposals: Proposal[]) {
    proposals.map((proposal) => {
      this.proposalMap[proposal.id] = proposal;
    });
  }
}
