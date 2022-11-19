/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface DiceInterface extends ethers.utils.Interface {
  functions: {
    "PRECISION()": FunctionFragment;
    "bet(uint256,uint256,uint16,uint8,bool)": FunctionFragment;
    "betInfo(uint256)": FunctionFragment;
    "betMap(address)": FunctionFragment;
    "bets(uint256)": FunctionFragment;
    "decodeBetData(uint256)": FunctionFragment;
    "encodeBetData(uint128,uint64,uint32,uint8,uint8,bool,bool)": FunctionFragment;
    "gameId()": FunctionFragment;
    "houseContract()": FunctionFragment;
    "nextSettleBetId()": FunctionFragment;
    "owner()": FunctionFragment;
    "protocolFee()": FunctionFragment;
    "randomContract()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "requestRandom(address)": FunctionFragment;
    "setGameId(uint256)": FunctionFragment;
    "setHouseContract(address)": FunctionFragment;
    "setProtocolFee(uint256)": FunctionFragment;
    "setRandomContract(address)": FunctionFragment;
    "settle(address)": FunctionFragment;
    "settleAll()": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(functionFragment: "PRECISION", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "bet",
    values: [BigNumberish, BigNumberish, BigNumberish, BigNumberish, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "betInfo",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "betMap", values: [string]): string;
  encodeFunctionData(functionFragment: "bets", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "decodeBetData",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "encodeBetData",
    values: [
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      boolean,
      boolean
    ]
  ): string;
  encodeFunctionData(functionFragment: "gameId", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "houseContract",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "nextSettleBetId",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "protocolFee",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "randomContract",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "requestRandom",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setGameId",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setHouseContract",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setProtocolFee",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "setRandomContract",
    values: [string]
  ): string;
  encodeFunctionData(functionFragment: "settle", values: [string]): string;
  encodeFunctionData(functionFragment: "settleAll", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(functionFragment: "PRECISION", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "bet", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "betInfo", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "betMap", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "bets", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "decodeBetData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "encodeBetData",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "gameId", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "houseContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "nextSettleBetId",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "protocolFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "randomContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "requestRandom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "setGameId", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "setHouseContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setProtocolFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setRandomContract",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "settle", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "settleAll", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "Bet(uint256)": EventFragment;
    "OwnershipTransferred(address,address)": EventFragment;
    "Settle(address,bool,uint8)": EventFragment;
    "SettleAll(uint256)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "Bet"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "Settle"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SettleAll"): EventFragment;
}

export type BetEvent = TypedEvent<[BigNumber] & { betId: BigNumber }>;

export type OwnershipTransferredEvent = TypedEvent<
  [string, string] & { previousOwner: string; newOwner: string }
>;

export type SettleEvent = TypedEvent<
  [string, boolean, number] & {
    target: string;
    isWin: boolean;
    luckyNumber: number;
  }
>;

export type SettleAllEvent = TypedEvent<[BigNumber] & { lastBetId: BigNumber }>;

export class Dice extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: DiceInterface;

  functions: {
    PRECISION(overrides?: CallOverrides): Promise<[BigNumber]>;

    bet(
      poolId: BigNumberish,
      amount: BigNumberish,
      randomKey: BigNumberish,
      prediction: BigNumberish,
      isOver: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    "betInfo(uint256)"(
      betId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        BigNumber,
        BigNumber,
        number,
        number,
        number,
        boolean,
        boolean
      ] & {
        player: string;
        prize: BigNumber;
        blockNumber: BigNumber;
        poolId: number;
        luckyNumber: number;
        prediction: number;
        isOver: boolean;
        isEnd: boolean;
      }
    >;

    "betInfo(address)"(
      target: string,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        BigNumber,
        BigNumber,
        number,
        number,
        number,
        boolean,
        boolean
      ] & {
        player: string;
        prize: BigNumber;
        blockNumber: BigNumber;
        poolId: number;
        luckyNumber: number;
        prediction: number;
        isOver: boolean;
        isEnd: boolean;
      }
    >;

    betMap(arg0: string, overrides?: CallOverrides): Promise<[BigNumber]>;

    bets(arg0: BigNumberish, overrides?: CallOverrides): Promise<[string]>;

    decodeBetData(
      data: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, number, number, number, boolean, boolean] & {
        prize: BigNumber;
        blockNumber: BigNumber;
        poolId: number;
        luckyNumber: number;
        prediction: number;
        isOver: boolean;
        isEnd: boolean;
      }
    >;

    encodeBetData(
      prize: BigNumberish,
      blockNumber: BigNumberish,
      poolId: BigNumberish,
      luckyNumber: BigNumberish,
      prediction: BigNumberish,
      isOver: boolean,
      isEnd: boolean,
      overrides?: CallOverrides
    ): Promise<[BigNumber] & { data: BigNumber }>;

    gameId(overrides?: CallOverrides): Promise<[BigNumber]>;

    houseContract(overrides?: CallOverrides): Promise<[string]>;

    nextSettleBetId(overrides?: CallOverrides): Promise<[BigNumber]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    protocolFee(overrides?: CallOverrides): Promise<[BigNumber]>;

    randomContract(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    requestRandom(
      target: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setGameId(
      id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setHouseContract(
      addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setProtocolFee(
      fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setRandomContract(
      addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    settle(
      target: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    settleAll(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

  bet(
    poolId: BigNumberish,
    amount: BigNumberish,
    randomKey: BigNumberish,
    prediction: BigNumberish,
    isOver: boolean,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  "betInfo(uint256)"(
    betId: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [string, BigNumber, BigNumber, number, number, number, boolean, boolean] & {
      player: string;
      prize: BigNumber;
      blockNumber: BigNumber;
      poolId: number;
      luckyNumber: number;
      prediction: number;
      isOver: boolean;
      isEnd: boolean;
    }
  >;

  "betInfo(address)"(
    target: string,
    overrides?: CallOverrides
  ): Promise<
    [string, BigNumber, BigNumber, number, number, number, boolean, boolean] & {
      player: string;
      prize: BigNumber;
      blockNumber: BigNumber;
      poolId: number;
      luckyNumber: number;
      prediction: number;
      isOver: boolean;
      isEnd: boolean;
    }
  >;

  betMap(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

  bets(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

  decodeBetData(
    data: BigNumberish,
    overrides?: CallOverrides
  ): Promise<
    [BigNumber, BigNumber, number, number, number, boolean, boolean] & {
      prize: BigNumber;
      blockNumber: BigNumber;
      poolId: number;
      luckyNumber: number;
      prediction: number;
      isOver: boolean;
      isEnd: boolean;
    }
  >;

  encodeBetData(
    prize: BigNumberish,
    blockNumber: BigNumberish,
    poolId: BigNumberish,
    luckyNumber: BigNumberish,
    prediction: BigNumberish,
    isOver: boolean,
    isEnd: boolean,
    overrides?: CallOverrides
  ): Promise<BigNumber>;

  gameId(overrides?: CallOverrides): Promise<BigNumber>;

  houseContract(overrides?: CallOverrides): Promise<string>;

  nextSettleBetId(overrides?: CallOverrides): Promise<BigNumber>;

  owner(overrides?: CallOverrides): Promise<string>;

  protocolFee(overrides?: CallOverrides): Promise<BigNumber>;

  randomContract(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  requestRandom(
    target: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setGameId(
    id: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setHouseContract(
    addr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setProtocolFee(
    fee: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setRandomContract(
    addr: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  settle(
    target: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  settleAll(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    bet(
      poolId: BigNumberish,
      amount: BigNumberish,
      randomKey: BigNumberish,
      prediction: BigNumberish,
      isOver: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "betInfo(uint256)"(
      betId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        BigNumber,
        BigNumber,
        number,
        number,
        number,
        boolean,
        boolean
      ] & {
        player: string;
        prize: BigNumber;
        blockNumber: BigNumber;
        poolId: number;
        luckyNumber: number;
        prediction: number;
        isOver: boolean;
        isEnd: boolean;
      }
    >;

    "betInfo(address)"(
      target: string,
      overrides?: CallOverrides
    ): Promise<
      [
        string,
        BigNumber,
        BigNumber,
        number,
        number,
        number,
        boolean,
        boolean
      ] & {
        player: string;
        prize: BigNumber;
        blockNumber: BigNumber;
        poolId: number;
        luckyNumber: number;
        prediction: number;
        isOver: boolean;
        isEnd: boolean;
      }
    >;

    betMap(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    bets(arg0: BigNumberish, overrides?: CallOverrides): Promise<string>;

    decodeBetData(
      data: BigNumberish,
      overrides?: CallOverrides
    ): Promise<
      [BigNumber, BigNumber, number, number, number, boolean, boolean] & {
        prize: BigNumber;
        blockNumber: BigNumber;
        poolId: number;
        luckyNumber: number;
        prediction: number;
        isOver: boolean;
        isEnd: boolean;
      }
    >;

    encodeBetData(
      prize: BigNumberish,
      blockNumber: BigNumberish,
      poolId: BigNumberish,
      luckyNumber: BigNumberish,
      prediction: BigNumberish,
      isOver: boolean,
      isEnd: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    gameId(overrides?: CallOverrides): Promise<BigNumber>;

    houseContract(overrides?: CallOverrides): Promise<string>;

    nextSettleBetId(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<string>;

    protocolFee(overrides?: CallOverrides): Promise<BigNumber>;

    randomContract(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    requestRandom(target: string, overrides?: CallOverrides): Promise<void>;

    setGameId(id: BigNumberish, overrides?: CallOverrides): Promise<void>;

    setHouseContract(addr: string, overrides?: CallOverrides): Promise<void>;

    setProtocolFee(fee: BigNumberish, overrides?: CallOverrides): Promise<void>;

    setRandomContract(addr: string, overrides?: CallOverrides): Promise<void>;

    settle(target: string, overrides?: CallOverrides): Promise<void>;

    settleAll(overrides?: CallOverrides): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "Bet(uint256)"(
      betId?: null
    ): TypedEventFilter<[BigNumber], { betId: BigNumber }>;

    Bet(betId?: null): TypedEventFilter<[BigNumber], { betId: BigNumber }>;

    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    "Settle(address,bool,uint8)"(
      target?: null,
      isWin?: null,
      luckyNumber?: null
    ): TypedEventFilter<
      [string, boolean, number],
      { target: string; isWin: boolean; luckyNumber: number }
    >;

    Settle(
      target?: null,
      isWin?: null,
      luckyNumber?: null
    ): TypedEventFilter<
      [string, boolean, number],
      { target: string; isWin: boolean; luckyNumber: number }
    >;

    "SettleAll(uint256)"(
      lastBetId?: null
    ): TypedEventFilter<[BigNumber], { lastBetId: BigNumber }>;

    SettleAll(
      lastBetId?: null
    ): TypedEventFilter<[BigNumber], { lastBetId: BigNumber }>;
  };

  estimateGas: {
    PRECISION(overrides?: CallOverrides): Promise<BigNumber>;

    bet(
      poolId: BigNumberish,
      amount: BigNumberish,
      randomKey: BigNumberish,
      prediction: BigNumberish,
      isOver: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    "betInfo(uint256)"(
      betId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    "betInfo(address)"(
      target: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    betMap(arg0: string, overrides?: CallOverrides): Promise<BigNumber>;

    bets(arg0: BigNumberish, overrides?: CallOverrides): Promise<BigNumber>;

    decodeBetData(
      data: BigNumberish,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    encodeBetData(
      prize: BigNumberish,
      blockNumber: BigNumberish,
      poolId: BigNumberish,
      luckyNumber: BigNumberish,
      prediction: BigNumberish,
      isOver: boolean,
      isEnd: boolean,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    gameId(overrides?: CallOverrides): Promise<BigNumber>;

    houseContract(overrides?: CallOverrides): Promise<BigNumber>;

    nextSettleBetId(overrides?: CallOverrides): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    protocolFee(overrides?: CallOverrides): Promise<BigNumber>;

    randomContract(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    requestRandom(
      target: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setGameId(
      id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setHouseContract(
      addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setProtocolFee(
      fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setRandomContract(
      addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    settle(
      target: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    settleAll(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    PRECISION(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    bet(
      poolId: BigNumberish,
      amount: BigNumberish,
      randomKey: BigNumberish,
      prediction: BigNumberish,
      isOver: boolean,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    "betInfo(uint256)"(
      betId: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    "betInfo(address)"(
      target: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    betMap(
      arg0: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    bets(
      arg0: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    decodeBetData(
      data: BigNumberish,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    encodeBetData(
      prize: BigNumberish,
      blockNumber: BigNumberish,
      poolId: BigNumberish,
      luckyNumber: BigNumberish,
      prediction: BigNumberish,
      isOver: boolean,
      isEnd: boolean,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    gameId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    houseContract(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    nextSettleBetId(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    protocolFee(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    randomContract(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    requestRandom(
      target: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setGameId(
      id: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setHouseContract(
      addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setProtocolFee(
      fee: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setRandomContract(
      addr: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    settle(
      target: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    settleAll(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
