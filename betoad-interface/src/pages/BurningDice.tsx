import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import Ranger from "../components/ranger";
import { Listbox } from "@headlessui/react";
import { useStore } from "hooks";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
import IMAGE from "constants/images";

import Button from "components/button/Button";
import NumberRoulette from "components/dice/NumberRoulette";
import TransitionNumber from "components/dice/TransitionNumber";
import DirectionSelector from "components/dice/DirectionSelector";
import { observer } from "mobx-react-lite";
import BigNumber from "bignumber.js";

import useSounds from "hooks/useSound";
import { PoolRaw } from "types/pool";

const FEE = 0.015;

type DiceStatus = "ready" | "rolling" | "roll" | "stoping" | "stop";

const Dice = observer(() => {
  const rollRef = useRef<any>(null);
  const pingRef = useRef<any>(null);
  const [isOver, setIsOver] = useState(true);
  const [prediction, setPrediction] = useState(50);
  const [betAmount, setBetAmount] = useState(0);
  const [status, setStatus] = useState<DiceStatus>("ready");
  const store = useStore();
  const soundPlayGameResult = useSounds();

  const [pools, setPools] = useState<PoolRaw[]>([]);
  const [selectedPool, setSelectedPool] = useState<any>(null);
  const [burningInfo, setBurningInfo] = useState<any>({
    lunc: new BigNumber(0),
    ustc: new BigNumber(0),
  });

  const getPools = useCallback(async () => {
    // const result: any[] = await wasm.query("house", { pools: {} });
    // if (result) {
    //   const pools = result.filter((pool): any =>
    //     ["LUNC", "USTC"].includes(pool.name)
    //   );
    //   setPools(pools);
    //   setSelectedPool(pools[0]);
    // }
  }, []);

  useEffect(() => {
    getPools();
  }, []);

  useEffect(() => {
    getBurningInfo();
  }, [pools]);

  const getBurningInfo = async () => {
    const luncPool = pools.filter((item) => item.name === "LUNC")[0];
    const ustcPool = pools.filter((item) => item.name === "USTC")[0];
    // const luncBurnAmount = await wasm.query("burningdice", {
    //   burn_info: { asset_info: luncPool.asset.info },
    // });
    // const ustcBurnAmount = await wasm.query("burningdice", {
    //   burn_info: { asset_info: ustcPool.asset.info },
    // });
    // if (luncBurnAmount && ustcBurnAmount) {
    //   console.log("luncBurnAmount", luncBurnAmount);
    //   console.log("ustcBurnAmount", ustcBurnAmount);
    // }
    // setBurningInfo({
    //   lunc: new BigNumber(luncBurnAmount.total_burn_amount).plus(
    //     new BigNumber(luncBurnAmount.burnable_amount)
    //   ),
    //   ustc: new BigNumber(ustcBurnAmount.total_burn_amount).plus(
    //     new BigNumber(ustcBurnAmount.burnable_amount)
    //   ),
    // });
  };

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

  const burnAmount = useMemo(() => {
    return parseFloat((payout - betAmount).toFixed(4));
  }, [payout]);

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
    onChangePrediction(prediction);
  }, [isOver]);

  const onChangeDirection = (isOver: boolean) => {
    setIsOver(isOver);
  };

  const rolling = async () => {
    // setStatus("rolling");
    // rollRef.current.start();
    // try {
    //   const assetKey = toString(selectedPool.asset.info);
    //   const amount = new BigNumber(betAmount).shiftedBy(6).toString();
    //   let txHeight;
    //   if (isNativeToken(selectedPool.asset.info)) {
    //     const result = await wasm.execute(
    //       "burningdice",
    //       { bet: { prediction: prediction, over: isOver } },
    //       null,
    //       [new Coin(assetKey, amount)]
    //     );
    //     txHeight = result.height;
    //     console.log(result);
    //   } else {
    //     const result = await wasm.cw20execute(
    //       "burningdice",
    //       { bet: { prediction: prediction, over: isOver } },
    //       assetKey,
    //       amount
    //     );
    //     txHeight = result.height;
    //     console.log(result);
    //   }
    //   while (true) {
    //     await sleep(1000);
    //     const blockInfo = await store.lcd.tendermint.blockInfo();
    //     console.log(parseInt(blockInfo.block.header.height), txHeight);
    //     if (parseInt(blockInfo.block.header.height) > txHeight) {
    //       break;
    //     }
    //   }
    //   setStatus("roll");
    // } catch (e) {
    //   rollRef.current.stop();
    //   setStatus("ready");
    // }
  };

  const stop = async () => {
    // setStatus("stoping");
    // try {
    //   const _result = await wasm.execute("burningdice", { settle: {} });
    //   console.log(_result);
    //   const result = await getBetResult();
    //   if (result) {
    //     await rollRef.current.stop(result.lucky_number, result.result);
    //     if (result.result) {
    //       console.log("burnAmount", burnAmount);
    //       pingRef.current.ping(new BigNumber(burnAmount).toFormat(), true);
    //     }
    //     getBurningInfo();
    //     soundPlayGameResult(result.result);
    //     setStatus("stop");
    //     // store.balanceStore.load([selectedPool.asset.info]);
    //     console.log(result);
    //   }
    // } catch (e) {
    //   console.log(e);
    //   setStatus("roll");
    // }
  };

  const getBetResult = () => {
    // return wasm.query("burningdice", {
    //   bet: { address: store.walletStore.address },
    // });
  };

  const burn = async () => {
    // console.log({
    //   burn: { asset_info: selectedPool.asset.info },
    // });
    // const _result = await wasm.execute("burningdice", {
    //   burn: { asset_info: selectedPool.asset.info },
    // });
    // console.log(_result);
  };

  useEffect(() => {
    if (selectedPool && store.walletStore.address) {
      // store.balanceStore.load([selectedPool.asset.info]);
    }
  }, [selectedPool, store.walletStore.address]);

  useEffect(() => {
    // if (store.walletStore.address) {
    //   getBetResult().then((result) => {
    //     if (result && result.result === null) {
    //       rollRef.current.start();
    //       setStatus("roll");
    //     }
    //   });
    // }
  }, [store.walletStore.address]);

  const maxBetAmount = useMemo(() => {
    if (store.contractStore.house && selectedPool) {
      const rate = parseFloat(store.contractStore.house?.max_output_rate);
      return new BigNumber(selectedPool.asset.amount)
        .multipliedBy(rate)
        .multipliedBy(0.9);
    }
    return new BigNumber(0);
  }, [selectedPool]);

  if (!selectedPool) return null;
  return (
    <div className="max-w-6xl mx-auto w-full">
      {/* <div className="h-full">
        <img src={bg1} alt="" className="h-full" />
      </div> */}
      <div className="">
        <button onClick={burn}>BURN</button>
      </div>
      <div className="flex justify-center">
        <BurnStatePanel burnInfo={burningInfo} pingRef={pingRef} />
      </div>
      <div className="text-center mt-2">
        여기는 LUNC를 위해 이긴금액에 대한 상금이 Burning 되는 곳입니다. <br />
        이긴만큼 돈을 얻고싶으면 그냥 Dice에서 게임을 하세요
      </div>
      <div className="flex justify-center mt-6">
        <div className=" bg-[#2d2d2e] py-6 rounded-md w-[25rem]">
          <div className="px-6">
            <div className="flex">
              <div className="basis-1/2 rounded-md bg-[#242424] p-4 text-center mr-4">
                <div className="text-xs text-[#999999]">PREDICTION</div>
                <div className="text-4xl">{prediction}</div>
              </div>
              <div className="basis-1/2 rounded-md bg-[#242424] py-4 text-center">
                <div className="text-xs text-[#999999]">LUCKY NUMBER</div>
                <div className="text-4xl">
                  <NumberRoulette rollRef={rollRef} />
                </div>
              </div>
            </div>
            <div className="mt-8 mb-6">
              <Ranger
                value={prediction}
                onChange={onChangePrediction}
                colors={
                  isOver
                    ? ["rgb(255, 80, 80)", "rgb(16,185,129)"]
                    : ["rgb(16,185,129)", "rgb(255, 80, 80)"]
                }
              />
            </div>
            <DirectionSelector
              direction={isOver}
              onChange={onChangeDirection}
              disabled={!(status === "stop" || status === "ready")}
            />
            <div className="flex mt-6">
              <div className="basis-1/3 p-2 text-center bg-[#242424] rounded-md mr-2">
                <div className="text-xxs text-[#999999]">Win Chance</div>
                <div className="flex items-baseline justify-center text-white">
                  <div className="text-xl mr-1">{winChance}</div>
                  <div className="text-xs">%</div>
                </div>
              </div>
              <div className="basis-1/3 p-2 text-center bg-[#242424] rounded-md mr-2">
                <div className="text-xxs text-[#999999]">Rate</div>
                <div className="flex items-baseline justify-center text-white">
                  <div className="text-xs">X</div>
                  <div className="text-xl mr-1">{rate}</div>
                </div>
              </div>
              <div className="basis-1/3 p-2 text-center bg-[#242424] rounded-md">
                <div className="text-xxs text-[#999999]">burn</div>
                <div className="flex items-baseline justify-center text-white">
                  <div className="text-xl">{burnAmount}</div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex">
              <div className="basis-[7rem] relative text-center">
                <Listbox value={selectedPool} onChange={setSelectedPool}>
                  <Listbox.Button
                    className={({ open }) =>
                      `p-3 w-full bg-[#242424] rounded-l-lg text-left flex items-center ${
                        open ? "rounded-b-none" : ""
                      }`
                    }
                  >
                    <img
                      src={IMAGE[selectedPool?.name]}
                      alt=""
                      className="h-7 w-7 mr-2"
                    />
                    <div className="text-center">{selectedPool?.name}</div>
                  </Listbox.Button>
                  <Listbox.Options
                    className={
                      "absolute bg-[#242424] w-full rounded-b-[10px] max-h-48 overflow-scroll"
                    }
                  >
                    {pools.map((item) => {
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
                            className="h-7 w-7 mr-2"
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
                disabled={!(status === "stop" || status === "ready")}
                className="grow rounded-r-lg outline-none bg-[#444444] text-white px-4"
                value={betAmount}
                onChange={({ target }: any) => {
                  setBetAmount(target.value);
                }}
              />
            </div>
            {selectedPool && (
              <div className="flex justify-end items-baseline mt-2">
                <button className="">
                  {store.balanceStore
                    .get(selectedPool.asset.info)
                    ?.shiftedBy(-6)
                    .decimalPlaces(2, 1)
                    .toFormat() || "0"}
                </button>
                <div className="ml-1 text-xs text-[#999999]">
                  {selectedPool.name}
                </div>
              </div>
            )}
          </div>
          <div className="pt-4 p-6 pb-0 flex">
            {status === "ready" || status === "stop" ? (
              !betAmount ? (
                <Button state={"disabled"}>Insufficient Balance</Button>
              ) : selectedPool &&
                store.balanceStore
                  .get(selectedPool.asset.info)
                  ?.lt(new BigNumber(betAmount || 0).shiftedBy(6)) ? (
                <Button state={"disabled"}>Insufficient Balance</Button>
              ) : new BigNumber(payout).shiftedBy(6).gt(maxBetAmount) ? (
                <Button state={"disabled"}>Insufficient Pool</Button>
              ) : (
                <Button state={"active"} onClick={rolling}>
                  ROLLING
                </Button>
              )
            ) : status === "roll" ? (
              <Button state={"active"} className="bg-green-400" onClick={stop}>
                STOP
              </Button>
            ) : status === "rolling" ? (
              <Button state={"disabled"}>ROLLING...</Button>
            ) : (
              <Button state={"disabled"}>STOPING...</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

const BurnStatePanel = ({ burnInfo, pingRef }: any) => {
  return (
    <div className="flex p-6 bg-[#222222] rounded-lg">
      <div className="basis-1/3 grow shrink mx-6">
        <div className="text-xs text-[#999999] whitespace-nowrap">
          TOTAL BURNING LUNC
        </div>
        <div className="flex items-baseline">
          <div className="text-2xl whitespace-nowrap relative">
            <TransitionNumber pingRef={pingRef} />
            {burnInfo?.lunc?.shiftedBy(-6).decimalPlaces(2, 1).toFormat()}
          </div>
          <div className="ml-1 text-sm">LUNC</div>
        </div>
      </div>
      <div className="basis-1/3 grow shrink mx-6">
        <div className="text-xs text-[#999999] whitespace-nowrap">
          TOTAL BURNING USTC
        </div>
        <div className="flex items-baseline">
          <div className="text-2xl whitespace-nowrap">
            {burnInfo?.ustc?.shiftedBy(-6).decimalPlaces(2, 1).toFormat()}
          </div>
          <div className="ml-1 text-sm">USTC</div>
        </div>
      </div>
      <div className="basis-1/3 grow shrink mx-6">
        <div className="text-xs text-[#999999] whitespace-nowrap">
          TOTAL REWARD BETO
        </div>
        <div className="flex items-baseline">
          <div className="text-2xl whitespace-nowrap">???.???.???</div>
          <div className="ml-1 text-sm">BETO</div>
        </div>
      </div>
    </div>
  );
};

export default Dice;
