
import abi from './CultNFT.json';
import tAbi from './TokenContract.json'
import { Network } from 'alchemy-sdk';

export const colletionsJsonLink = 'https://raw.githubusercontent.com/CryptoP00R/CantoMOONMarketplace/main/Collections.json';
// export const nftVaultAddress = '0x2b71F50EE8Db3cBa8F2bfaD354cF78ca28C6E31C';
export const nftVaultAddress = '0xcd580BC70B1A9ECFE5324594c9D5Da24DAE7D060';
export const cmoonAddress = '0x0a79EB2C804e1e9f2A6a09768c03Ff9C1B2D8028';
export const contractABI = abi;
export const tokenAbi = tAbi;
export const settings = {
    apiKey: 'vkbFSDxyMa6TG-fwVQ0v5z9L_PieT5Vm', // Replace with your Alchemy API key.
    network: Network.ETH_MAINNET // Replace with your network.
  };
  export const testsettings = {
    apiKey: 'vkbFSDxyMa6TG-fwVQ0v5z9L_PieT5Vm', // Replace with your Alchemy API key.
    network: Network.ETH_MAINNET // Replace with your network.
  };