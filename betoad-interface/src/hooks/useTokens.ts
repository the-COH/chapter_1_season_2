import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { StoreContext } from "../store";

import useStore from "./useStore";
import useProvider from "./useProvider";
import { BaseContract, ethers } from "ethers";
import ERC20_ABI from "artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json";
import { Dice, House, ERC20 } from "typechain";

const useTokens = () => {
  const store = useStore();
  const provider = useProvider();

  const token = (address: string) => {
    if (!store.contractStore.token[address]) {
      const _erc20: ERC20 = new ethers.Contract(
        address,
        ERC20_ABI.abi,
        provider.getSigner(0)
      ) as ERC20;
      store.contractStore.token[address] = _erc20;
    }
    return store.contractStore.token[address];
  };

  const readonlyToken = (address: string) => {
    if (!store.contractStore.readonlyToken[address]) {
      const _erc20: ERC20 = new ethers.Contract(
        address,
        ERC20_ABI.abi,
        new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545")
      ) as ERC20;
      store.contractStore.readonlyToken[address] = _erc20;
    }
    return store.contractStore.readonlyToken[address];
  };

  return { token, readonlyToken };
};

export default useTokens;
