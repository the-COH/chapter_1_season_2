import BigNumber from "bignumber.js";

export interface AirdropRaw {
  airdrop_amount: string;
  amount: string;
  is_claimed: boolean;
  level: number;
  lose_amount: string;
  win_amount: string;
}

export interface Airdrop {
  airdrop_amount: BigNumber;
  amount: BigNumber;
  is_claimed: boolean;
  level: number;
  lose_amount: BigNumber;
  win_amount: BigNumber;
}
