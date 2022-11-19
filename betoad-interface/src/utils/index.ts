import { AssetInfo, NativeToken, Token } from "types/asset";

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const toSummary = (value: number | null | undefined) => {
  if (value) {
    return value >= 1000000000
      ? `${parseFloat((value / 1000000000).toFixed(2))}B`
      : value >= 1000000
      ? `${parseFloat((value / 1000000).toFixed(2))}M`
      : value >= 1000
      ? `${parseFloat((value / 1000).toFixed(2))}K`
      : `${value}`;
  }
  return "0";
};
