import { AssetInfo, NativeToken, Token } from "types/asset";

export const toString = (asset: AssetInfo) => {
  if ("token" in asset) {
    return asset.token.contract_addr;
  } else {
    return asset.native_token.denom;
  }
};

export const isNativeToken = (info: AssetInfo) => {
  if ("native_token" in info) {
    return true;
  } else {
    return false;
  }
};

export const native_token_info = (denom: string): NativeToken => {
  return {
    native_token: { denom: denom },
  };
};

export const token_info = (contract_addr: string): Token => {
  return {
    token: { contract_addr: contract_addr },
  };
};
