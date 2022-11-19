import { useEffect, useMemo, useState, useCallback } from "react";

import { FaCheckCircle } from "react-icons/fa";
import { MdCancel } from "react-icons/md";

import { observer } from "mobx-react-lite";
import BigNumber from "bignumber.js";

interface Props {
  prediction: number;
  isOver: boolean;
  betAmount: number;
  winChance: number;
  rate: number;
  payout: number;
  setState: (value: boolean) => void;
}

const Dice = ({
  prediction,
  isOver,
  betAmount,
  winChance,
  rate,
  payout,
  setState,
}: Props) => {
  const [button1, setButton1] = useState(0);
  const [button2, setButton2] = useState(0);
  const [button3, setButton3] = useState(0);

  const button1Check = useMemo(() => button1 === 2, [button1]);
  const button2Check = useMemo(() => button2 === 1, [button2]);
  const button3Check = useMemo(() => button3 === 3, [button3]);

  const check1 = useMemo(() => {
    if (prediction < 30) {
      return true;
    } else {
      return false;
    }
  }, [prediction]);

  const check2 = useMemo(() => {
    if (!isOver) {
      return true;
    } else {
      return false;
    }
  }, [isOver]);

  const check3 = useMemo(() => {
    if (betAmount) {
      return true;
    } else {
      return false;
    }
  }, [betAmount]);

  useEffect(() => {
    if (
      check1 &&
      check2 &&
      check3 &&
      button1Check &&
      button2Check &&
      button3Check
    ) {
      setState(true);
    } else {
      setState(false);
    }
  }, [check1, check2, check3, button1Check, button2Check, button3Check]);

  return (
    <div className="flex justify-center items-center mt-4">
      <div className="">
        <div className="mb-2 ml-6">
          Dice is a game to predict the range of a randomly generated number!
        </div>
        <div className="flex items-center mt-2">
          <div className="w-6">
            <FaCheckCircle
              className={`text-green mr-2 transition-all ${
                check1 ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
          <div className="">
            Move the numbered circle on the left to below 30!
          </div>
        </div>
        <div className="flex items-center mt-2">
          <div className="w-6">
            <FaCheckCircle
              className={`text-green mr-2 transition-all ${
                check2 ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
          <div className="">Click the Under button!</div>
        </div>
        <div className="flex items-center mt-2">
          <div className="w-6">
            <FaCheckCircle
              className={`text-green mr-2 transition-all ${
                check3 ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
          <div className="">Set betting amount in Zero Tokens</div>
        </div>
        <div
          className={`mt-2 ml-6 text-green transition-all ${
            check1 && check2 && check3 ? "opacity-100" : "opacity-0"
          }`}
        >
          {`If the number is between 0~${prediction - 1}, you are a winner!`}
        </div>
        <div className="mt-6"></div>
        <div
          className={`${
            check1 && check2 && check3 ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="">What are the chances of winning? (hint: left)</div>
          <div className="flex justify-around mb-1 bg-[#2d2d2e] rounded-lg overflow-hidden mt-2">
            <button
              onClick={() => setButton1(1)}
              className={`basis-1/2 py-2 ${
                button1 === 1
                  ? "bg-[#2d2d2e]"
                  : "text-[#7c7c7c] bg-[#242424] hover:text-white transition-all"
              }`}
            >
              {winChance - 2 <= 0 ? 0 : winChance - 2}%
            </button>
            <button
              onClick={() => setButton1(2)}
              className={`basis-1/2 py-2 first:border-r-2 first:border-[#1c1c1c] ${
                button1 === 2
                  ? "bg-[#2d2d2e]"
                  : "text-[#7c7c7c] bg-[#242424] hover:text-white transition-all"
              }`}
            >
              {winChance}%
            </button>
            <button
              onClick={() => setButton1(3)}
              className={`basis-1/2 py-2 first:border-r-2 first:border-[#1c1c1c] ${
                button1 === 3
                  ? "bg-[#2d2d2e]"
                  : "text-[#7c7c7c] bg-[#242424] hover:text-white transition-all"
              }`}
            >
              {winChance + 2}%
            </button>
          </div>
          <div className="mt-4">
            What is the multiplied rate of rewards? (hint: left)
          </div>
          <div className="flex justify-around mb-1 bg-[#2d2d2e] rounded-lg overflow-hidden mt-2">
            <button
              onClick={() => setButton2(1)}
              className={`basis-1/2 py-2 ${
                button2 === 1
                  ? "bg-[#2d2d2e]"
                  : "text-[#7c7c7c] bg-[#242424] hover:text-white transition-all"
              }`}
            >
              x{rate}
            </button>
            <button
              onClick={() => setButton2(2)}
              className={`basis-1/2 py-2 first:border-r-2 first:border-[#1c1c1c] ${
                button2 === 2
                  ? "bg-[#2d2d2e]"
                  : "text-[#7c7c7c] bg-[#242424] hover:text-white transition-all"
              }`}
            >
              x{new BigNumber(rate + 1).decimalPlaces(4, 1).toString()}
            </button>
            <button
              onClick={() => setButton2(3)}
              className={`basis-1/2 py-2 first:border-r-2 first:border-[#1c1c1c] ${
                button2 === 3
                  ? "bg-[#2d2d2e]"
                  : "text-[#7c7c7c] bg-[#242424] hover:text-white transition-all"
              }`}
            >
              x{new BigNumber(rate + 3).decimalPlaces(4, 1).toString()}
            </button>
          </div>
          <div className="mt-4">
            How much will you earn from your winnings? (hint: left)
          </div>
          <div className="flex justify-around mb-1 bg-[#2d2d2e] rounded-lg overflow-hidden mt-2">
            <button
              onClick={() => setButton3(1)}
              className={`basis-1/2 py-2 ${
                button3 === 1
                  ? "bg-[#2d2d2e]"
                  : "text-[#7c7c7c] bg-[#242424] hover:text-white transition-all"
              }`}
            >
              {(payout - 2).toFixed(4)}
            </button>
            <button
              onClick={() => setButton3(2)}
              className={`basis-1/2 py-2 first:border-r-2 first:border-[#1c1c1c] ${
                button3 === 2
                  ? "bg-[#2d2d2e]"
                  : "text-[#7c7c7c] bg-[#242424] hover:text-white transition-all"
              }`}
            >
              {(payout - 1).toFixed(4)}
            </button>
            <button
              onClick={() => setButton3(3)}
              className={`basis-1/2 py-2 first:border-r-2 first:border-[#1c1c1c] ${
                button3 === 3
                  ? "bg-[#2d2d2e]"
                  : "text-[#7c7c7c] bg-[#242424] hover:text-white transition-all"
              }`}
            >
              {payout}
            </button>
          </div>
          {button1 > 0 && button2 > 0 && button3 > 0 && (
            <div className="">
              {button1Check && button2Check && button3Check ? (
                <div className="flex items-center mt-4">
                  <FaCheckCircle className="text-green mr-2" />
                  <div className="text-green">
                    Correct! Now let’s check the ROLLING results!
                  </div>
                </div>
              ) : (
                <div className="flex items-center mt-4">
                  <MdCancel className="text-red mr-2" />
                  <div className="text-red">Wrong! Try again!</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(Dice);
