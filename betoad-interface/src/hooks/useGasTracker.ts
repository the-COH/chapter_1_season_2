import React, { createContext, useContext } from "react";
import { StoreContext } from "../store";

// @ts-ignore
import WinSound from "assets/sounds/win.mp3";
// @ts-ignore
import LoseSound from "assets/sounds/lose.mp3";

import useSound from "use-sound";
import useStore from "./useStore";
import { BigNumber } from "ethers";

export interface FeeData {
  maxFeePerGas: null | BigNumber;
  maxPriorityFeePerGas: null | BigNumber;
  gasPrice: null | BigNumber;
}

const useGasTracker = () => {
  const store = useStore();

  const getGas = () =>
    new Promise<any>((resolve, reject) => {
      fetch("https://gasstation-mainnet.matic.network/v2").then(
        async (result) => {
          const json = await result.json();
          resolve(json);
        }
      );
    });

  const getFeeData = (type: string = "fastest", rate: number = 1.1) =>
    new Promise<FeeData>((resolve, reject) => {
      console.log("gas => ");

      // store.infura.getGasPrice().then((result) => {
      //   console.log("GasPrice", result.toString());
      // });

      // store.infura
      //   .getBlock("pending")
      //   .then((result) =>
      //     console.log("block", result.baseFeePerGas?.toString())
      //   );

      store.rpc.getFeeData().then((result) => {
        console.log("maxFeePerGas => \n", result.maxFeePerGas?.toString());
        console.log(
          "maxPriorityFeePerGas =>  \n",
          result.maxPriorityFeePerGas?.toString()
        );
        console.log("gasPrice =>  \n", result.gasPrice?.toString());
        resolve(result);
      });
    });
  return { getFeeData, getGas };
};

export default useGasTracker;
