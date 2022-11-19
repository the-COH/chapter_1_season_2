import { useEffect, useMemo, useState, useRef } from "react";
import Ranger from "../components/ranger";
import { Listbox } from "@headlessui/react";
import { useStore } from "hooks";
import { useNavigate } from "react-router-dom";

import IMAGE from "constants/images";

import Button from "components/button/Button";
import NumberRoulette from "components/dice/NumberRoulette";
import AirdropStatePanel from "components/airdrop/AirdropStatePanel";
import AirdropClaimPanel from "components/airdrop/AirdropClaimPanel";
import DirectionSelector from "components/dice/DirectionSelector";
import DiceResultPanel from "components/dice/DiceResultPanel";

import { observer } from "mobx-react-lite";
import BigNumber from "bignumber.js";

import { isNativeToken, token_info, toString } from "utils/asset";
import { contractToAddress } from "utils/contracts";
import DicedropLV1 from "components/airdrop/DicedropLV1";
import DicedropLV2 from "components/airdrop/DicedropLV2";
import DicedropLV3 from "components/airdrop/DicedropLV3";
import useSounds from "hooks/useSound";
import { Airdrop } from "types/airdrop";
import { toAirdrop } from "utils/converter";
import { sleep } from "utils";

const FEE = 0.015;

type DiceStatus = "ready" | "rolling" | "roll" | "stoping" | "stop";

interface BetResult {
  luckyNumber: number;
  result: boolean;
}

const Dice = observer(() => {
  const rollRef = useRef<any>(null);
  const [isOver, setIsOver] = useState(true);
  const [prediction, setPrediction] = useState(50);
  const [betResult, setBetResult] = useState<BetResult>({
    luckyNumber: 0,
    result: false,
  });
  const [betAmount, setBetAmount] = useState(0);
  const [maxBetAmount, setMaxBetAmount] = useState<any>(new BigNumber(0));
  const [airdropInfo, setAirdropInfo] = useState<Airdrop>();
  const [claimInfo, setClaimInfo] = useState<any>({
    amount: new BigNumber("50000000000"),
    proof: ["123", "123"],
  });

  const [checkTutorial, setCheckTutorial] = useState<boolean>(false);

  const [status, setStatus] = useState<DiceStatus>("ready");
  const store = useStore();
  const soundPlayGameResult = useSounds();
  let navigate = useNavigate();

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
    onChangePrediction(prediction);
  }, [isOver]);

  const onChangeDirection = (isOver: boolean) => {
    setIsOver(isOver);
  };

  const rolling = async () => {
    // setStatus("rolling");
    // rollRef.current.start();
    // try {
    //   const amount = new BigNumber(betAmount).shiftedBy(6).toString();
    //   const result = await wasm.execute("dicedrop", {
    //     bet: { prediction: prediction, over: isOver, amount },
    //   });
    //   while (true) {
    //     await sleep(1000);
    //     const blockInfo = await store.lcd.tendermint.blockInfo();
    //     console.log(parseInt(blockInfo.block.header.height), result.height);
    //     if (parseInt(blockInfo.block.header.height) > result.height) {
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
    //   const _result = await wasm.execute("dicedrop", { settle: {} });
    //   console.log(_result);
    //   const result = await getBetResult();
    //   if (result) {
    //     setStatus("stop");
    //     await rollRef.current.stop(result.lucky_number, result.result);
    //     store.balanceStore.loadBETO();
    //     soundPlayGameResult(result.result);
    //     getAirdropInfo();
    //     reset();
    //     console.log(result);
    //   }
    // } catch (e) {
    //   console.log(e);
    //   setStatus("roll");
    // }
  };

  const proveAirdrop = async () => {
    // try {
    //   const result = await wasm.execute("dicedrop", {
    //     prove: {
    //       amount: "50000000000",
    //       proof: [],
    //     },
    //   });
    //   await getAirdropInfo();
    // } catch (e) {
    //   console.log(e);
    // }
  };

  const getBetResult = () => {
    // return wasm.query("dicedrop", {
    //   bet_info: { addr: store.walletStore.address },
    // });
  };

  const getAirdropInfo = async () => {
    // const info = await wasm.query("dicedrop", {
    //   airdrop_info: { addr: store.walletStore.address },
    // });
    // console.log("airdropInfo", info);
    // setAirdropInfo(toAirdrop(info));
  };

  const reset = () => {
    setCheckTutorial(false);
  };

  useEffect(() => {
    // if (store.walletStore.address) {
    //   getAirdropInfo();
    //   getBetResult().then((result) => {
    //     console.log(result);
    //     if (result && result.result === null) {
    //       setStatus("roll");
    //     }
    //   });
    // }
  }, [store.walletStore.address]);

  useEffect(() => {
    // wasm
    //   .query("token", { balance: { address: contractToAddress("dicedrop") } })
    //   .then((result) => {
    //     const max = new BigNumber(result).multipliedBy(0.01).multipliedBy(0.9);
    //     setMaxBetAmount(result.balance);
    //   });
  }, []);

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex justify-center">
        {airdropInfo ? (
          <div>
            <AirdropClaimPanel airdropInfo={airdropInfo} prove={proveAirdrop} />
            <AirdropStatePanel airdropInfo={airdropInfo} />
          </div>
        ) : (
          <div className="">
            <button className="" onClick={proveAirdrop}>
              proof
            </button>
          </div>
        )}
      </div>
      {airdropInfo && airdropInfo.level > 2 && (
        <div className="relative">
          <div className="absolute w-full h-full flex justify-center mt-28">
            <div className="z-20 m-auto top-0 text-center">
              <div className="text-white text-7xl font-black z-20 TEXT-SHADOW-8 shadow-white">
                CLEAR
              </div>
              <Button
                state={"active"}
                className="mt-10"
                onClick={() => {
                  navigate("/dice");
                }}
              >
                Go To Play Dice
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="flex justify-center">
        <div className="relative">
          <div
            className={`mt-10 ${
              airdropInfo && airdropInfo.level > 2
                ? "blur-sm pointer-events-none"
                : "flex justify-center items-start"
            }`}
          >
            <div className="bg-[#2d2d2e] py-6 rounded-md w-[25rem]">
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
                <DiceResultPanel
                  winChance={winChance}
                  rate={rate}
                  payout={payout}
                />
                <div className="mt-6 flex">
                  <div className="basis-[7rem] relative text-center">
                    <div
                      className={`p-3 w-full bg-[#242424] rounded-l-lg text-left flex items-center`}
                    >
                      <img src={IMAGE.BETO} alt="" className="h-7 w-7 mr-2" />
                      <div className="text-center">BETO</div>
                    </div>
                  </div>
                  <input
                    type="text"
                    disabled={!(status === "stop" || status === "ready")}
                    className="grow rounded-r-lg outline-none bg-[#444444] text-white px-4"
                    placeholder="Betting Amount"
                    value={betAmount}
                    onChange={({ target }: any) => {
                      setBetAmount(target.value);
                    }}
                  />
                </div>
                {
                  <div className="flex justify-end items-baseline mt-2">
                    <div className="">
                      {airdropInfo?.amount
                        .shiftedBy(-6)
                        .decimalPlaces(2, 1)
                        .toFormat()}
                    </div>
                    <div className="ml-1 text-xs text-[#999999]">ZERO</div>
                  </div>
                }
              </div>
              <div className="pt-4 p-6 pb-0 flex">
                {(status === "ready" || status === "stop") && !checkTutorial ? (
                  <Button state={"disabled"}>Check Right Quiz!!</Button>
                ) : (
                  <>
                    {status === "ready" || status === "stop" ? (
                      !betAmount ? (
                        <Button state={"disabled"}>Insufficient Balance</Button>
                      ) : airdropInfo?.amount?.lt(
                          new BigNumber(betAmount || 0).shiftedBy(6)
                        ) ? (
                        <Button state={"disabled"}>Insufficient Balance</Button>
                      ) : new BigNumber(payout)
                          .shiftedBy(6)
                          .gt(maxBetAmount) ? (
                        <Button state={"disabled"}>Insufficient Pool</Button>
                      ) : (
                        <Button state={"active"} onClick={rolling}>
                          ROLLING
                        </Button>
                      )
                    ) : status === "roll" ? (
                      <Button
                        state={"active"}
                        className="bg-green-400"
                        onClick={stop}
                      >
                        STOP
                      </Button>
                    ) : status === "rolling" ? (
                      <Button state={"disabled"}>ROLLING...</Button>
                    ) : (
                      <Button state={"disabled"}>STOPING...</Button>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="ml-8">
              {airdropInfo && airdropInfo.level < 3 && (
                <div className="flex justify-between">
                  <div
                    className={`${airdropInfo?.level !== 0 && "opacity-10"}`}
                  >
                    Level 1
                  </div>
                  <div
                    className={`${airdropInfo?.level !== 1 && "opacity-10"}`}
                  >
                    Level 2
                  </div>
                  <div
                    className={`${airdropInfo?.level !== 2 && "opacity-10"}`}
                  >
                    Level 3
                  </div>
                </div>
              )}
              {airdropInfo && airdropInfo.level < 3 && (
                <>
                  {airdropInfo.level === 0 ? (
                    <DicedropLV1
                      prediction={prediction}
                      isOver={isOver}
                      betAmount={betAmount}
                      winChance={winChance}
                      payout={payout}
                      rate={rate}
                      setState={setCheckTutorial}
                    />
                  ) : airdropInfo.level === 1 ? (
                    <DicedropLV2
                      prediction={prediction}
                      isOver={isOver}
                      betAmount={betAmount}
                      winChance={winChance}
                      payout={payout}
                      rate={rate}
                      setState={setCheckTutorial}
                    />
                  ) : airdropInfo.level === 2 ? (
                    <DicedropLV3
                      prediction={prediction}
                      isOver={isOver}
                      amount={airdropInfo.amount}
                      betAmount={betAmount}
                      winChance={winChance}
                      payout={payout}
                      rate={rate}
                      setState={setCheckTutorial}
                    />
                  ) : null}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Dice;
