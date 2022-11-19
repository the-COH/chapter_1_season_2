import BigNumber from "bignumber.js";
import { Airdrop, AirdropRaw } from "types/airdrop";
import { Asset, AssetRaw } from "types/asset";
import {
  CollectorContract,
  CollectorContractRaw,
  Profit,
  ProfitRaw,
} from "types/contract";
import { ProposalRaw, Proposal } from "types/gov";
import { Pool, PoolRaw } from "types/pool";
import { AstroPool, AstroPoolRaw, Simulation, SimulationRaw } from "types/swap";

export function toProposal(raw: ProposalRaw): Proposal;
export function toProposal(raw: ProposalRaw[]): Proposal[];
export function toProposal(
  raw: ProposalRaw | ProposalRaw[]
): Proposal | Proposal[] {
  if (Array.isArray(raw)) {
    return raw.map<Proposal>((_raw: ProposalRaw) => toProposal(_raw));
  } else {
    return {
      ...raw,
      deposit_amount: new BigNumber(raw.deposit_amount),
      no_votes: new BigNumber(raw.no_votes),
      snapshot_amount: new BigNumber(raw.snapshot_amount),
      total_votes: new BigNumber(raw.total_votes),
      yes_votes: new BigNumber(raw.yes_votes),
    };
  }
}

export function toAsset(raw: AssetRaw): Asset;
export function toAsset(raw: AssetRaw[]): Asset[];
export function toAsset(raw: AssetRaw | AssetRaw[]): Asset | Asset[] {
  if (Array.isArray(raw)) {
    return raw.map<Asset>((_raw: AssetRaw) => toAsset(_raw));
  } else {
    return {
      info: raw.info,
      amount: new BigNumber(raw.amount),
    };
  }
}

export function toAstroPool(raw: AstroPoolRaw): AstroPool {
  return {
    contract: raw.contract,
    assets: [toAsset(raw.assets[0]), toAsset(raw.assets[1])],
    total_share: new BigNumber(raw.total_share),
  };
}

export function toAirdrop(raw: AirdropRaw): Airdrop {
  return {
    ...raw,
    airdrop_amount: new BigNumber(raw.airdrop_amount),
    amount: new BigNumber(raw.amount),
    lose_amount: new BigNumber(raw.lose_amount),
    win_amount: new BigNumber(raw.win_amount),
  };
}

export function toSimulation(raw: SimulationRaw): Simulation {
  return {
    commission_amount: new BigNumber(raw.commission_amount),
    return_amount: new BigNumber(raw.return_amount),
    spread_amount: new BigNumber(raw.spread_amount),
  };
}

// export function toPool(raw: PoolRaw): Pool {
//   return {
//     asset: raw.asset,
//     name: raw.name,
//     isActive: raw.isActive,
//     totalDeposit: new BigNumber(raw.totalDeposit.toString()),
//   };
// }

export function toProfit(raw: ProfitRaw): Profit;
export function toProfit(raw: ProfitRaw[]): Profit[];
export function toProfit(raw: ProfitRaw | ProfitRaw[]): Profit | Profit[] {
  if (Array.isArray(raw)) {
    return raw.map<Profit>((_raw: ProfitRaw) => toProfit(_raw));
  } else {
    return {
      asset: toAsset(raw.asset),
      swap_contract: raw.swap_contract,
    };
  }
}

export function toCollectorContract(
  raw: CollectorContractRaw
): CollectorContract {
  return {
    ...raw,
    total_burn_amount: new BigNumber(raw.total_burn_amount),
    total_distribute_amount: new BigNumber(raw.total_distribute_amount),
    total_lp_amount: new BigNumber(raw.total_lp_amount),
  };
}
