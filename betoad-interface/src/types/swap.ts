import BigNumber from "bignumber.js";
import { Asset, AssetInfo, AssetRaw } from "types/asset";

export interface SimulationRaw {
  commission_amount: string;
  return_amount: string;
  spread_amount: string;
}

export interface Simulation {
  commission_amount: BigNumber;
  return_amount: BigNumber;
  spread_amount: BigNumber;
}

export interface AstroPoolRaw {
  contract: string;
  assets: [AssetRaw, AssetRaw];
  total_share: string;
}

export interface AstroPool {
  contract: string;
  assets: [Asset, Asset];
  total_share: BigNumber;
}

export interface AstroPoolInfo {
  name: string;
  asset_info: AssetInfo;
  swap_contract: string;
  pool_token_contract: string;
}
[];
