import React, { createContext, useContext, useEffect, useRef } from "react";
import { StoreContext } from "../store";

import MetaMaskOnboarding from "@metamask/onboarding";
import useProvider from "./useProvider";
import useStore from "./useStore";
import BigNumber from "bignumber.js";
import useContracts from "./useContracts";
import { ERC20 } from "typechain";
import ERC20_ABI from "artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json";
import { ethers } from "ethers";
import { tokenInfos } from "constants/token";

const useGetBalances = () => {
  const store = useStore();
  const provider = useProvider();

  const getBalanceAll = async () => {
    tokenInfos.forEach((info) => {
      getBalance(info.address);
    });
  };

  const getBalance = async (key?: string) => {
    if (key || key === "canto") {
      if (!store.contractStore.readonlyToken[key]) {
        store.contractStore.readonlyToken[key] = new ethers.BaseContract(
          key,
          ERC20_ABI.abi,
          // provider.getSigner(0)
          new ethers.providers.JsonRpcProvider("http://192.168.0.30:8545/")
        ) as ERC20;
      }
      const balance = await store.contractStore.readonlyToken[key].balanceOf(
        store.walletStore.address
      );
      store.balanceStore.balances[key] = new BigNumber(balance.toString() || 0);
    } else {
      const balance = await provider?.getBalance(store.walletStore.address);
      store.balanceStore.balances["canto"] = new BigNumber(
        balance?.toString() || 0
      );
    }
  };

  return { getBalance, getBalanceAll };
};

export default useGetBalances;
