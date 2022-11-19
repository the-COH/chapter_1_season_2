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
import ADDRESS from "constants/address";
import HOUSE_ABI from "artifacts/contracts/House.sol/House.json";
import DICE_ABI from "artifacts/contracts/games/Dice.sol/Dice.json";
import REWARDER_ABI from "artifacts/contracts/Rewarder.sol/Rewarder.json";
import DISTRIBUTOR_ABI from "artifacts/contracts/Distributor.sol/Distributor.json";
import COLLECTOR_ABI from "artifacts/contracts/Collector.sol/Collector.json";
import RANDOM_ABI from "artifacts/contracts/Random.sol/Random.json";
import CHIP_ABI from "artifacts/contracts/Chip.sol/Chip.json";

import {
  Dice,
  House,
  Distributor,
  Collector,
  Random,
  Rewarder,
  Chip,
} from "typechain";

const useContracts = () => {
  const store = useStore();
  const provider = useProvider();

  useEffect(() => {
    if (!store.contractStore.contract) {
      const _house: House = new ethers.Contract(
        ADDRESS.House,
        HOUSE_ABI.abi,
        provider.getSigner(0)
      ) as House;

      const _random: Random = new ethers.Contract(
        ADDRESS.Random,
        RANDOM_ABI.abi,
        provider.getSigner(0)
      ) as Random;

      const _dice: Dice = new ethers.Contract(
        ADDRESS.Dice,
        DICE_ABI.abi,
        provider.getSigner(0)
      ) as Dice;

      const _rewarder: Rewarder = new ethers.Contract(
        ADDRESS.Rewarder,
        REWARDER_ABI.abi,
        provider.getSigner(0)
      ) as Rewarder;

      const _distributor: Distributor = new ethers.Contract(
        ADDRESS.Distributor,
        DISTRIBUTOR_ABI.abi,
        provider.getSigner(0)
      ) as Distributor;

      const _collector: Collector = new ethers.Contract(
        ADDRESS.Collector,
        COLLECTOR_ABI.abi,
        provider.getSigner(0)
      ) as Collector;

      const _chip: Chip = new ethers.Contract(
        ADDRESS.CHIP,
        CHIP_ABI.abi,
        provider.getSigner(0)
      ) as Chip;

      const readonlyProvider = new ethers.providers.JsonRpcProvider(
        "http://192.168.0.30:8545/"
      );
      // const readonlyProvider = new ethers.providers.JsonRpcProvider(
      //   "https://canto.evm.chandrastation.com/"
      // );

      const _readonlyHouse: House = new ethers.Contract(
        ADDRESS.House,
        HOUSE_ABI.abi,
        readonlyProvider
      ) as House;

      const _readonlyRandom: Random = new ethers.Contract(
        ADDRESS.Random,
        RANDOM_ABI.abi,
        readonlyProvider
      ) as Random;

      const _readonlyDice: Dice = new ethers.Contract(
        ADDRESS.Dice,
        DICE_ABI.abi,
        readonlyProvider
      ) as Dice;

      const _readonlyRewarder: Rewarder = new ethers.Contract(
        ADDRESS.Rewarder,
        REWARDER_ABI.abi,
        readonlyProvider
      ) as Rewarder;

      const _readonlyDistributor: Distributor = new ethers.Contract(
        ADDRESS.Distributor,
        DISTRIBUTOR_ABI.abi,
        readonlyProvider
      ) as Distributor;

      const _readonlyCollector: Collector = new ethers.Contract(
        ADDRESS.Collector,
        COLLECTOR_ABI.abi,
        readonlyProvider
      ) as Collector;

      const _readonlyChip: Chip = new ethers.Contract(
        ADDRESS.CHIP,
        CHIP_ABI.abi,
        readonlyProvider
      ) as Chip;

      store.contractStore.contract = {
        house: _house,
        readonlyHouse: _readonlyHouse,
        random: _random,
        readonlyRandom: _readonlyRandom,
        dice: _dice,
        distributor: _distributor,
        collector: _collector,
        chip: _chip,
        readonlyDice: _readonlyDice,
        rewarder: _rewarder,
        readonlyRewarder: _readonlyRewarder,
        readonlyDistributor: _readonlyDistributor,
        readonlyCollector: _readonlyCollector,
        readonlyChip: _readonlyChip,
      };
      // store.contractStore.contract = {
      //   house: _house,
      //   random: _random,
      //   dice: _dice,
      //   rewarder: _rewarder,
      //   distributor: _distributor,
      //   collector: _collector,
      //   readonlyHouse: _house,
      //   readonlyDice: _dice,
      //   readonlyRandom: _random,
      //   readonlyRewarder: _rewarder,
      //   readonlyDistributor: _distributor,
      //   readonlyCollector: _collector,
      // };
    }
  }, []);

  return store.contractStore.contract;
};

export default useContracts;
