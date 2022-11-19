import BigNumber from "bignumber.js";
import { makeAutoObservable } from "mobx";
import { Asset, AssetRaw } from "types/asset";

export interface GovState {
  owner: string;
  zerosum_token: string;
  house_contract: string;
  quorum: string;
  threshold: string;
  voting_period: number;
  timelock_period: number;
  proposal_deposit: string;
  proposal_count: number;
}

export interface ProposalRaw {
  creator: string;
  deposit_amount: string;
  description: string;
  start_height: number;
  end_height: number;
  execute_data: any[];
  id: number;
  link: string;
  no_votes: string;
  snapshot_amount: string;
  status: string;
  timelock_period: number;
  title: string;
  total_votes: string;
  yes_votes: string;
}

export interface Proposal {
  creator: string;
  deposit_amount: BigNumber;
  description: string;
  start_height: number;
  end_height: number;
  execute_data: ExecuteData[];
  id: number;
  link: string;
  no_votes: BigNumber;
  snapshot_amount: BigNumber;
  status: string;
  timelock_period: number;
  title: string;
  total_votes: BigNumber;
  yes_votes: BigNumber;
}

export interface ExecuteData {
  order: number;
  contract: string;
  msg: string;
}
