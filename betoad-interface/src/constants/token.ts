import ADDRESS from "./address";

interface TokenInfo {
  name: string;
  decimals: number;
  address: string;
}

const CANTOInfo = {
  name: "CANTO",
  decimals: 18,
  address: "canto",
};

const WCANTOInfo = {
  name: "WCANTO",
  decimals: 18,
  address: ADDRESS.WCANTO,
};

const NOTEInfo = {
  name: "NOTE",
  decimals: 18,
  address: ADDRESS.NOTE,
};

const BETOInfo = {
  name: "BETO",
  decimals: 18,
  address: ADDRESS.BETO,
};

const CHIPInfo = {
  name: "CHIP",
  decimals: 18,
  address: ADDRESS.CHIP,
};

export const nameToTokenInfo = {
  CANTO: CANTOInfo,
  WCANTO: WCANTOInfo,
  NOTE: NOTEInfo,
  BETO: BETOInfo,
  CHIP: CHIPInfo,
} as Record<string, TokenInfo>;

export const addressToTokenInfo = {
  [CANTOInfo.address]: CANTOInfo,
  [WCANTOInfo.address]: WCANTOInfo,
  [NOTEInfo.address]: NOTEInfo,
  [BETOInfo.address]: BETOInfo,
  [CHIPInfo.address]: CHIPInfo,
} as Record<string, TokenInfo>;

export const tokenInfos = Object.values(nameToTokenInfo);

// export const addressToTokenInfo = {
//   "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270": WMaticInfo,
//   "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174": USDCInfo,
//   "0xc2132D05D31c914a87C6611C10748AEb04B58e8F": USDTInfo,
// };
