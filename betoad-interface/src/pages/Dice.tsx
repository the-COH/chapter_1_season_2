import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Ranger from "../components/ranger";
import { Listbox } from "@headlessui/react";
import { useStore } from "hooks";
import IMAGE from "constants/images";

import METRIX_GIF from "assets/images/metrix.gif";
import METRIX_JPG from "assets/images/metrix.jpg";

import Button from "components/button/Button";
import NumberRoulette from "components/dice/NumberRoulette";
import TransitionNumber from "components/dice/TransitionNumber";
import DirectionSelector from "components/dice/DirectionSelector";
import DiceResultPanel from "components/dice/DiceResultPanel";

import { observer } from "mobx-react-lite";
import BigNumber from "bignumber.js";

import useSounds from "hooks/useSound";
import useContracts from "hooks/useContracts";
import { Pool } from "types/pool";
import { addressToTokenInfo } from "constants/token";
import useGetBalances from "hooks/useGetBalances";
import useTokens from "hooks/useTokens";
import useGasTracker from "hooks/useGasTracker";
import ADDRESS from "constants/address";
import { sleep, toSummary } from "utils";

const FEE = 0.03;

type DiceStatus = "ready" | "rolling" | "stop";

const Dice = observer(() => {
  const rollRef = useRef<any>(null);
  const pingRef = useRef<any>(null);
  const [isOver, setIsOver] = useState(true);
  const [prediction, setPrediction] = useState(50);
  const [betAmount, setBetAmount] = useState(0);
  const [status, setStatus] = useState<DiceStatus>("ready");
  const store = useStore();
  const contracts = useContracts();
  const { token } = useTokens();
  const { getBalance } = useGetBalances();
  const soundPlayGameResult = useSounds();
  const { getFeeData, getGas } = useGasTracker();

  const [selectedPool, setSelectedPool] = useState<Pool | null>(null);
  const [houseMaxOutRate, setHouseMaxOutRate] = useState<BigNumber | null>();

  const [currentRoundPlayingAmount, setCurrentRoundPlayingAmount] =
    useState<number>(0);
  const [myPlayingAmount, setMyPlayingAmount] = useState<number>(0);

  const tokenInfo = useMemo(() => {
    if (selectedPool) {
      return addressToTokenInfo[selectedPool.asset];
    } else {
      return null;
    }
  }, [selectedPool]);

  useEffect(() => {
    if (selectedPool) {
      getBalance(selectedPool.asset);
    }
  }, [selectedPool]);

  useEffect(() => {
    (async () => {
      if (contracts) {
        const _houseMaxOutRate = await contracts.house.maxOutputRate();
        setHouseMaxOutRate(new BigNumber(_houseMaxOutRate.toString() || "0"));
      }
    })();
  }, [contracts]);

  const winChance = useMemo(() => {
    if (isOver) {
      return 99 - prediction;
    } else {
      return prediction;
    }
  }, [isOver, prediction]);

  const rate = useMemo(() => {
    return parseFloat(((1 - FEE) * (100 / winChance)).toFixed(4));
  }, [winChance]);

  const payout = useMemo(() => {
    return parseFloat((rate * betAmount).toFixed(4));
  }, [rate, betAmount]);

  const range = useMemo(() => {
    if (isOver) {
      return [4, 98];
    } else {
      return [1, 95];
    }
  }, [isOver]);

  const onChangePrediction = (value: number) => {
    if (value < range[0]) {
      setPrediction(range[0]);
    } else if (value > range[1]) {
      setPrediction(range[1]);
    } else {
      setPrediction(value);
    }
  };

  useEffect(() => {
    (async () => {
      await store.poolStore.load(contracts);
      setSelectedPool(store.poolStore.pools[0]);
      loadCurrentRound();
    })();
  }, [contracts]);

  useEffect(() => {
    onChangePrediction(prediction);
  }, [isOver]);

  const onChangeDirection = (isOver: boolean) => {
    setIsOver(isOver);
  };

  const rolling = async () => {
    if (selectedPool && tokenInfo && contracts) {
      setStatus("rolling");
      rollRef.current.start();
      try {
        const amount = new BigNumber(betAmount).shiftedBy(tokenInfo.decimals);
        const tokenContract = token(selectedPool.asset);
        const allowance = new BigNumber(
          (
            await tokenContract.allowance(
              store.walletStore.address,
              ADDRESS.Dice
            )
          ).toString()
        );
        if (amount.gt(allowance)) {
          const tx = await tokenContract.approve(
            ADDRESS.Dice,
            new BigNumber(10).pow(77).toFixed()
          );
          await tx.wait();
        }
        const gas = await getGas();
        let key = 200;
        if (gas.fast.maxFee > 500) {
          key = 1000;
        } else if (gas.fast.maxFee > 200) {
          key = 500;
        }

        const tx = await contracts.dice.bet(
          selectedPool.poolId.toString(),
          amount.toFixed(),
          1000,
          prediction,
          isOver,
          {
            maxFeePerGas: (gas.fast.maxFee * 1e9).toFixed(),
            maxPriorityFeePerGas: (gas.fast.maxPriorityFee * 1e9).toFixed(),
          }
        );
        console.log("created Tx: ", tx);
        const result = await tx.wait();
        console.log("result: ", result);
        getBalance(selectedPool.asset);

        const betId = new BigNumber(result.logs[result.logs.length - 1].data);

        contracts.readonlyDice.once("SettleAll", async (params) => {
          await sleep(12000);
          const betInfo = await contracts.readonlyDice["betInfo(address)"](
            store.walletStore.address
          );
          console.log("betInfo", betInfo);
          if (betInfo.isEnd) {
            const isWin =
              (betInfo.isOver && betInfo.luckyNumber > betInfo.prediction) ||
              (!betInfo.isOver && betInfo.luckyNumber < betInfo.prediction);
            await rollRef.current.stop(betInfo.luckyNumber, isWin);
            if (isWin) {
              pingRef.current.ping(
                new BigNumber(betInfo.prize.toString())
                  .shiftedBy(-tokenInfo.decimals)
                  .decimalPlaces(4, 1)
                  .toFormat(),
                true
              );
            } else {
              pingRef.current.ping(
                new BigNumber(betAmount).decimalPlaces(4, 1).toFormat(),
                false
              );
            }
            soundPlayGameResult(isWin);
            setStatus("stop");
            getBalance(selectedPool.asset);
            loadCurrentRound();
          }
        });

        // contracts.readonlyDice.on("Settle", async (params) => {
        //   if (betId.lte(new BigNumber(params.toString()))) {
        //     console.log("betId", betId.toString());
        //     console.log("settle", new BigNumber(params.toString()).toString());
        //     contracts.readonlyDice.removeAllListeners();
        //     const betInfo = await contracts.readonlyDice.bets(betId.toString());
        //     if (betInfo) {
        //       const isWin =
        //         (betInfo.isOver && betInfo.prediction < betInfo.luckyNumber) ||
        //         (!betInfo.isOver && betInfo.prediction > betInfo.luckyNumber)
        //           ? true
        //           : false;
        //       await rollRef.current.stop(betInfo.luckyNumber, isWin);
        //       if (isWin) {
        //         pingRef.current.ping(
        //           new BigNumber(betInfo.prizeAmount.toString())
        //             .shiftedBy(-tokenInfo.decimals)
        //             .decimalPlaces(4, 1)
        //             .toFormat(),
        //           true
        //         );
        //       } else {
        //         pingRef.current.ping(
        //           new BigNumber(betAmount).decimalPlaces(4, 1).toFormat(),
        //           false
        //         );
        //       }
        //       getBalances(selectedPool.asset);
        //       soundPlayGameResult(isWin);
        //       setStatus("stop");
        //     }
        //   }
        //   console.log("Settle Event once", params);
        // });
      } catch (e) {
        rollRef.current.stop();
        setStatus("ready");
      }
    }
  };

  const stop = async () => {
    try {
      if (contracts) {
        const gas = await getGas();

        const betInfo = await contracts.dice["betInfo(address)"](
          store.walletStore.address
        );
        console.log("betInfo", betInfo);

        console.log(
          "randoms",
          await contracts.random.heightToRandom(betInfo.blockNumber)
        );

        const result = await contracts.dice.settle(store.walletStore.address, {
          maxFeePerGas: (gas.fast.maxFee * 1e9).toFixed(),
          maxPriorityFeePerGas: (gas.fast.maxPriorityFee * 1e9).toFixed(),
        });
        console.log(result);

        // const result = await contracts.dice.settleAll({
        //   maxFeePerGas: feeData.maxFeePerGas?.add("28500000000").toString(),
        //   maxPriorityFeePerGas: "30000000000",
        // });
        // console.log(result);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (selectedPool && store.walletStore.address) {
      // store.balanceStore.load([selectedPool.asset.info]);
    }
  }, [selectedPool, store.walletStore.address]);

  const maxBetAmount = useMemo(() => {
    if (contracts && selectedPool && houseMaxOutRate) {
      return new BigNumber(selectedPool?.balance)
        .multipliedBy(houseMaxOutRate)
        .dividedBy(1000000)
        .multipliedBy(0.9);
    }
    return new BigNumber(0);
  }, [selectedPool, houseMaxOutRate]);

  const loadCurrentRound = async () => {
    if (contracts) {
      const currentRound =
        await contracts.readonlyDistributor.getCurrentRound();
      const currentPlayingAmount =
        await contracts.readonlyHouse.totalPlayingAmountByRound(currentRound);
      // console.log("currentPlayingAmount", currentPlayingAmount.toString());
      setCurrentRoundPlayingAmount(
        new BigNumber(currentPlayingAmount.toString())
          .shiftedBy(-18)
          .decimalPlaces(4, 1)
          .toNumber()
      );
      const myPlayingAmount =
        await contracts.readonlyHouse.playingAmountByRound(
          store.walletStore.address,
          currentRound
        );
      setMyPlayingAmount(
        new BigNumber(myPlayingAmount.toString())
          .shiftedBy(-18)
          .decimalPlaces(4, 1)
          .toNumber()
      );
    }
  };

  if (!selectedPool) return null;
  return (
    <div className="grow flex justify-center items-start">
      <div className="">
        {status === "rolling" ? (
          <img
            src={METRIX_GIF}
            alt=""
            className="w-screen h-screen pointer-events-none"
          />
        ) : (
          <img
            src={METRIX_JPG}
            alt=""
            className="w-screen h-screen pointer-events-none"
          />
        )}
      </div>
      <div className="absolute top-[15%] flex flex-col items-center mb-2 w-full">
        <div className="flex mb-2 max-w-xl mx-auto w-full">
          <div className="basis-1/4 px-4 py-3 mr-0.5 bg-[#2c2c2c] shrink-0">
            <div className="text-[#ABABAB] text-xs">Today Reward</div>
            <div className="mt-1 text-lg text-[#6AFC5F]">
              <span className="mr-1">750,000</span>
              <span className="text-xs">BETO</span>
            </div>
          </div>
          <div className="basis-1/4 px-4 py-3 mr-0.5 bg-[#2c2c2c] shrink-0">
            <div className="text-[#ABABAB] text-xs">Total Play Amount</div>
            <div className="mt-1 text-lg text-[#6AFC5F]">
              Ꞥ{toSummary(currentRoundPlayingAmount)}
            </div>
          </div>
          <div className="basis-1/4 px-4 py-3 mr-0.5 bg-[#2c2c2c] shrink-0">
            <div className="text-[#ABABAB] text-xs">My Play Amount</div>
            <div className="mt-1 text-lg text-[#6AFC5F]">
              Ꞥ{toSummary(myPlayingAmount)}
            </div>
          </div>
          <div className="basis-1/4 px-4 py-3 bg-[#2c2c2c] shrink-0">
            <div className="text-[#ABABAB] text-xs">Estimated Reward</div>
            <div className="mt-1 text-lg text-[#6AFC5F]">
              <span className="mr-1">
                {myPlayingAmount && currentRoundPlayingAmount
                  ? new BigNumber(
                      750000 * (myPlayingAmount / currentRoundPlayingAmount)
                    )
                      .decimalPlaces(0, 1)
                      .toFormat()
                  : "0"}
              </span>
              <span className="text-xs">BETO</span>
            </div>
          </div>
        </div>
        <div className="bg-[#101010] py-6 w-[25rem] drop-shadow-[0_35px_35px_#6AFC5F7f]">
          <div className="px-6">
            <div className="flex">
              <div className="basis-1/2 bg-[#171717] p-4 text-center mr-0.5">
                <div className="text-xs text-[#999999]">PREDICTION</div>
                <div className="text-4xl font-medium mt-1">{prediction}</div>
              </div>
              <div className="basis-1/2 bg-[#171717] py-4 text-center">
                <div className="text-xs text-[#999999]">LUCKY NUMBER</div>
                <div className="text-4xl font-medium mt-1">
                  <NumberRoulette rollRef={rollRef} />
                </div>
              </div>
            </div>
            <div className="px-1">
              <div className="mt-8 mb-6 bg-[#262626]">
                <Ranger
                  value={prediction}
                  disabled={!(status === "stop" || status === "ready")}
                  onChange={onChangePrediction}
                  colors={
                    isOver
                      ? ["rgb(255, 80, 80)", "rgb(16,185,129)"]
                      : ["rgb(16,185,129)", "rgb(255, 80, 80)"]
                  }
                />
              </div>
            </div>
            <DirectionSelector
              direction={isOver}
              onChange={onChangeDirection}
              disabled={!(status === "stop" || status === "ready")}
            />
            <DiceResultPanel
              winChance={winChance}
              rate={rate}
              payout={payout}
            />
            <div className="mt-2 flex">
              <div className="basis-1/3 relative text-center">
                <Listbox value={selectedPool} onChange={setSelectedPool}>
                  <Listbox.Button
                    className={({ open }) =>
                      `p-3 w-full bg-[#171717] text-left flex items-center`
                    }
                  >
                    <img
                      src={IMAGE[selectedPool?.name]}
                      alt=""
                      className="h-7 w-7 mr-2 rounded-full"
                    />
                    <div className="text-center">{selectedPool?.name}</div>
                  </Listbox.Button>
                  <Listbox.Options
                    className={
                      "absolute bg-[#171717] w-full max-h-48 overflow-scroll"
                    }
                  >
                    {store.poolStore.pools.map((item) => {
                      return (
                        <Listbox.Option
                          key={item.name}
                          value={item}
                          className={({ active }) =>
                            `px-4 py-2 text-white text-sm flex items-center ${
                              active ? "bg-[#323232]" : ""
                            }`
                          }
                        >
                          <img
                            src={IMAGE[item.name]}
                            alt=""
                            className="h-7 w-7 mr-2 rounded-full"
                          />
                          {item.name}
                        </Listbox.Option>
                      );
                    })}
                  </Listbox.Options>
                </Listbox>
              </div>
              <input
                type="text"
                className="grow outline-none bg-[#444444] text-white px-4"
                disabled={!(status === "stop" || status === "ready")}
                value={betAmount}
                onChange={({ target }: any) => {
                  setBetAmount(target.value);
                }}
              />
            </div>
            {selectedPool && (
              <div className="flex justify-end items-baseline mt-1 text-xs">
                <div className="relative">
                  <TransitionNumber pingRef={pingRef} />
                </div>
                <div
                  className="flex justify-end items-baseline mt-1 text-xs"
                  onClick={() => {
                    setBetAmount(
                      store.balanceStore
                        .get(selectedPool.asset)
                        ?.shiftedBy(tokenInfo ? -tokenInfo.decimals : 0)
                        .decimalPlaces(2, 1)
                        .toNumber() || 0
                    );
                  }}
                >
                  <div className="">
                    {store.balanceStore
                      .get(selectedPool.asset)
                      ?.shiftedBy(tokenInfo ? -tokenInfo.decimals : 0)
                      .decimalPlaces(2, 1)
                      .toFormat() || "0"}
                  </div>
                  <div className="ml-1 text-xs text-[#999999]">
                    {selectedPool.name}
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="pt-2 p-6 pb-0 flex">
            {status === "ready" || status === "stop" ? (
              !betAmount ? (
                <Button state={"disabled"}>Insufficient Balance</Button>
              ) : selectedPool &&
                store.balanceStore
                  .get(selectedPool.asset)
                  ?.lt(
                    new BigNumber(betAmount || 0).shiftedBy(
                      tokenInfo?.decimals || 0
                    )
                  ) ? (
                <Button state={"disabled"}>Insufficient Balance</Button>
              ) : new BigNumber(payout)
                  .shiftedBy(tokenInfo ? tokenInfo?.decimals : 0)
                  .gt(maxBetAmount) ? (
                <Button state={"disabled"}>Insufficient Pool</Button>
              ) : (
                <Button state={"active"} onClick={rolling}>
                  ROLLING
                </Button>
              )
            ) : (
              <Button state={"disabled"}>ROLLING...</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Dice;
