import BigNumber from "bignumber.js";

export type AssetInfo = NativeToken | Token;

export interface AssetRaw {
  amount: string;
  info: AssetInfo;
}

export interface Asset {
  amount: BigNumber;
  info: AssetInfo;
}

export interface NativeToken {
  native_token: { denom: string };
}

export interface Token {
  token: { contract_addr: string };
}
