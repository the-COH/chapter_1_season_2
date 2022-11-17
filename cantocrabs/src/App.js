import logo from "./logo.svg";
import "./App.css";
import React, { useState } from "react";
import { Wheel } from "react-custom-roulette";
import { ABI } from "./ABI.js";
import {
  DAppProvider,
  useEthers,
  Config,
  useCall,
  useContractCalls,
  ChainId,
  useContractFunction,
  DEFAULT_SUPPORTED_CHAINS,
} from "@usedapp/core";
import { CantoTestnet } from "./CantoTestnet";

import { getDefaultProvider, utils } from "ethers";
import { Contract } from "@ethersproject/contracts";
import WalletConnectProvider from "@walletconnect/web3-provider";
const INFO = {
  ADDRESS: "0x5296F49Bf14BC53a22d22beA367298153256c828",
  CHAIN_ID: "470",
};

// const BSC_INFO = {
//   ADDRESS: "0x935e2671B076636Fe8b4125377a166F430546686",
//   CHAIN_ID: "97",
// };

const config = {
  readOnlyChainId: CantoTestnet.chainId,
  readOnlyUrls: {
    [CantoTestnet.chainId]: "https://eth.plexnode.wtf/",
  },
  networks: [...DEFAULT_SUPPORTED_CHAINS, CantoTestnet],
};

// const config = {
//   readOnlyChainId: ChainId.BSCTestnet,
//   readOnlyUrls: {
//     [ChainId.BSCTestnet]: "https://data-seed-prebsc-1-s1.binance.org:8545/",
//   },
// };

const MAIN_CONTRACT = new Contract(INFO.ADDRESS, new utils.Interface(ABI));

const wheelRAW = [
  0,
  2,
  14,
  35,
  23,
  4,
  16,
  33,
  21,
  6,
  18,
  31,
  19,
  8,
  12,
  29,
  25,
  10,
  27,
  "00",
  1,
  13,
  36,
  24,
  3,
  15,
  34,
  22,
  5,
  17,
  32,
  20,
  7,
  11,
  30,
  26,
  9,
  28,
];
const wheelData = wheelRAW.map((x) => {
  return {
    option: `💀`,
  };
});

wheelData[0] = { option: "🦀" };

const wheelThreeData = [{ option: "🦀" }, { option: "💀" }, { option: "💀" }];

const wheelTwoData = [{ option: "🦀" }, { option: "💀" }];

const REDS = {
  1: true,
  3: true,
  5: true,
  7: true,
  9: true,
  12: true,
  14: true,
  16: true,
  18: true,
  19: true,
  21: true,
  23: true,
  25: true,
  27: true,
  30: true,
  32: true,
  34: true,
  36: true,
};

function App() {
  const [activeColumn, setActiveColumn] = useState(0);
  const [activeRow, setActiveRow] = useState(0);
  const [activeNumber, setActiveNumber] = useState(0);
  const [activeColor, setActiveColor] = useState(0);
  const [activeMod, setActiveMod] = useState(0);
  const [betType, setBetType] = useState(null);
  const [betData, setBetData] = useState(null);
  const [betWon, setBetWon] = useState(false);

  const {
    state: betState,
    send: sendBet,
    resetState: resetBetState,
  } = useContractFunction(MAIN_CONTRACT, "placeBet");
  console.log({ betState });
  const handleBet = () => {
    if (betType === null || betData == null || !account) return;
    sendBet(betData, betType, { value: 200, gasLimit: 1e5 });
  };

  const { account, activateBrowserWallet, chainId, activate } = useEthers();

  const resetBoard = () => {
    setActiveColor(0);
    setActiveRow(0);
    setActiveNumber(0);
    setActiveColumn(0);
    setActiveMod(0);
    setBetData(null);
    setBetType(null);
  };

  const handleNumber = (newNumber) => {
    resetBoard();
    if (activeNumber == newNumber) {
      setActiveNumber(0);
    } else {
      setActiveNumber(newNumber);
      setBetType(0);
      setBetData(newNumber);
    }
  };
  const handleColumn = (newActive) => {
    resetBoard();
    if (activeColumn == newActive) {
      setActiveColumn(0);
    } else {
      setActiveColumn(newActive);
      setBetType(3);
      setBetData(newActive);
    }
  };
  const handleRow = (newActive) => {
    resetBoard();
    if (activeRow == newActive) {
      setActiveRow(0);
    } else {
      setActiveRow(newActive);
      setBetType(4);
      setBetData(newActive);
    }
  };
  const handleMod = (newMod) => {
    resetBoard();
    if (newMod == activeMod) {
      setActiveMod(0);
    } else {
      setActiveMod(newMod);
      setBetType(newMod);
      setBetData(newMod);
    }
  };
  const handleColor = (newColor) => {
    resetBoard();
    if (newColor == activeColor) {
      setActiveColor(0);
    } else {
      setActiveColor(newColor);
      setBetType(5);
      setBetData(newColor);
    }
  };

  return (
    <>
      <div className='App'>
        <div className='container'>
          <div className='row'>
            <div className='col-lg-12'>
              <h1> Canto Crabs Casino </h1>{" "}
            </div>{" "}
          </div>{" "}
          <div className='row'>
            <div className='col-lg-12'>
              {" "}
              {account ? (
                <div className='btn btn-success'> {account} </div>
              ) : (
                <button
                  className='btn btn-primary'
                  onClick={() => setTimeout(activateBrowserWallet, 0)}>
                  Connect{" "}
                </button>
              )}{" "}
            </div>{" "}
          </div>{" "}
        </div>
        <div className='circ-roul'>
          <Wheel
            mustStartSpinning={betState.status == "Success"}
            onStopSpinning={() => resetBetState()}
            prizeNumber={
              betState.status == "Success" &&
              betState.receipt.events[0].args[3]["_hex"] != "0x00"
                ? 0
                : 1
            }
            data={
              betType == null || betType == 0
                ? wheelData
                : betType == 1 || betType == 2 || betType == 5
                ? wheelTwoData
                : wheelThreeData
            }
            backgroundColors={["#00ff2b", "#009a22"]}
            textColors={["#ffffff"]}
            outerBorderColor={"#020204"}
            outerBorderWidth={"16"}
            innerRadius={"36"}
            innerBorderWidth={"32"}
            innerBorderColor={"#020204"}
            radiusLineColor='#020204'
            radiusLineWidth={"3"}
            textDistance={"76"}
            fontSize={"14"}
          />{" "}
        </div>
        <div className='board-wrapper bg-dark bg-blackneon'>
          <div className='board-box'>
            <div className='board-row'>
              <div
                onClick={() => handleNumber(3)}
                className={
                  `board-item btn btn-outline-danger` +
                  ` ${
                    activeColumn == 1 ||
                    activeRow == 3 ||
                    activeNumber == 3 ||
                    activeColor == 1 ||
                    activeMod == 1
                      ? "active"
                      : ""
                  }`
                }>
                3{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(6)}
                className={
                  `board-item btn btn-outline-info` +
                  ` ${
                    activeColumn == 1 ||
                    activeRow == 3 ||
                    activeNumber == 6 ||
                    activeColor == 2 ||
                    activeMod == 2
                      ? "active"
                      : ""
                  }`
                }>
                6{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(9)}
                className={
                  `board-item btn btn-outline-danger ` +
                  ` ${
                    activeColumn == 1 ||
                    activeRow == 3 ||
                    activeNumber == 9 ||
                    activeColor == 1 ||
                    activeMod == 1
                      ? "active"
                      : ""
                  }`
                }>
                9{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(12)}
                className={
                  `board-item btn btn-outline-danger ` +
                  ` ${
                    activeColumn == 1 ||
                    activeRow == 3 ||
                    activeNumber == 12 ||
                    activeColor == 1 ||
                    activeMod == 2
                      ? "active"
                      : ""
                  }`
                }>
                12{" "}
              </div>{" "}
            </div>{" "}
            <div className='board-row'>
              {" "}
              <div
                onClick={() => handleNumber(2)}
                className={
                  `board-item btn btn-outline-info ` +
                  ` ${
                    activeColumn == 1 ||
                    activeRow == 2 ||
                    activeNumber == 2 ||
                    activeColor == 2 ||
                    activeMod == 2
                      ? "active"
                      : ""
                  }`
                }>
                2{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(5)}
                className={
                  `board-item btn btn-outline-danger ` +
                  ` ${
                    activeColumn == 1 ||
                    activeRow == 2 ||
                    activeNumber == 5 ||
                    activeColor == 1 ||
                    activeMod == 1
                      ? "active"
                      : ""
                  }`
                }>
                5{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(8)}
                className={
                  `board-item btn btn-outline-info ` +
                  ` ${
                    activeColumn == 1 ||
                    activeRow == 2 ||
                    activeNumber == 8 ||
                    activeColor == 2 ||
                    activeMod == 2
                      ? "active"
                      : ""
                  }`
                }>
                8{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(11)}
                className={
                  `board-item btn btn-outline-info ` +
                  ` ${
                    activeColumn == 1 ||
                    activeRow == 2 ||
                    activeNumber == 11 ||
                    activeColor == 2 ||
                    activeMod == 1
                      ? "active"
                      : ""
                  }`
                }>
                11{" "}
              </div>{" "}
            </div>{" "}
            <div className='board-row'>
              {" "}
              <div
                onClick={() => handleNumber(1)}
                className={
                  `board-item btn btn-outline-danger ` +
                  ` ${
                    activeColumn == 1 ||
                    activeRow == 1 ||
                    activeNumber == 1 ||
                    activeColor == 1 ||
                    activeMod == 1
                      ? "active"
                      : ""
                  }`
                }>
                1{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(4)}
                className={
                  `board-item btn btn-outline-info` +
                  ` ${
                    activeColumn == 1 ||
                    activeRow == 1 ||
                    activeNumber == 4 ||
                    activeColor == 2 ||
                    activeMod == 2
                      ? "active"
                      : ""
                  }`
                }>
                4{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(7)}
                className={
                  `board-item btn btn-outline-danger  ` +
                  ` ${
                    activeColumn == 1 ||
                    activeRow == 1 ||
                    activeNumber == 7 ||
                    activeColor == 1 ||
                    activeMod == 1
                      ? "active"
                      : ""
                  }`
                }>
                7{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(10)}
                className={
                  `board-item btn btn-outline-info ` +
                  ` ${
                    activeColumn == 1 ||
                    activeRow == 1 ||
                    activeNumber == 10 ||
                    activeColor == 2 ||
                    activeMod == 2
                      ? "active"
                      : ""
                  }`
                }>
                10{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className='board-box'>
            <div className='board-row'>
              <div
                onClick={() => handleNumber(15)}
                className={
                  `board-item btn btn-outline-info` +
                  ` ${
                    activeColumn == 2 ||
                    activeRow == 3 ||
                    activeNumber == 15 ||
                    activeColor == 2 ||
                    activeMod == 1
                      ? "active"
                      : ""
                  }`
                }>
                15{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(18)}
                className={
                  `board-item btn btn-outline-danger` +
                  ` ${
                    activeColumn == 2 ||
                    activeRow == 3 ||
                    activeNumber == 18 ||
                    activeColor == 1 ||
                    activeMod == 2
                      ? "active"
                      : ""
                  }`
                }>
                18{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(21)}
                className={
                  `board-item btn btn-outline-danger` +
                  ` ${
                    activeColumn == 2 ||
                    activeRow == 3 ||
                    activeNumber == 21 ||
                    activeColor == 1 ||
                    activeMod == 1
                      ? "active"
                      : ""
                  }`
                }>
                21{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(24)}
                className={
                  `board-item btn btn-outline-info` +
                  ` ${
                    activeColumn == 2 ||
                    activeRow == 3 ||
                    activeNumber == 24 ||
                    activeColor == 2 ||
                    activeMod == 2
                      ? "active"
                      : ""
                  }`
                }>
                24{" "}
              </div>{" "}
            </div>{" "}
            <div className='board-row'>
              {" "}
              <div
                onClick={() => handleNumber(14)}
                className={
                  `board-item btn btn-outline-danger` +
                  ` ${
                    activeColumn == 2 ||
                    activeRow == 2 ||
                    activeNumber == 14 ||
                    activeColor == 1 ||
                    activeMod == 2
                      ? "active"
                      : ""
                  }`
                }>
                14{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(17)}
                className={
                  `board-item btn btn-outline-info` +
                  ` ${
                    activeColumn == 2 ||
                    activeRow == 2 ||
                    activeNumber == 17 ||
                    activeColor == 2 ||
                    activeMod == 1
                      ? "active"
                      : ""
                  }`
                }>
                17{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(20)}
                className={
                  `board-item btn btn-outline-info` +
                  ` ${
                    activeColumn == 2 ||
                    activeRow == 2 ||
                    activeNumber == 20 ||
                    activeColor == 2 ||
                    activeMod == 2
                      ? "active"
                      : ""
                  }`
                }>
                20{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(23)}
                className={
                  `board-item btn btn-outline-danger` +
                  ` ${
                    activeColumn == 2 ||
                    activeRow == 2 ||
                    activeNumber == 23 ||
                    activeColor == 1 ||
                    activeMod == 1
                      ? "active"
                      : ""
                  }`
                }>
                23{" "}
              </div>{" "}
            </div>{" "}
            <div className='board-row'>
              {" "}
              <div
                onClick={() => handleNumber(13)}
                className={
                  `board-item btn btn-outline-info` +
                  ` ${
                    activeColumn == 2 ||
                    activeRow == 1 ||
                    activeNumber == 13 ||
                    activeColor == 2 ||
                    activeMod == 1
                      ? "active"
                      : ""
                  }`
                }>
                13{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(16)}
                className={
                  `board-item btn btn-outline-danger` +
                  ` ${
                    activeColumn == 2 ||
                    activeRow == 1 ||
                    activeNumber == 16 ||
                    activeColor == 1 ||
                    activeMod == 2
                      ? "active"
                      : ""
                  }`
                }>
                16{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(19)}
                className={
                  `board-item btn btn-outline-danger` +
                  ` ${
                    activeColumn == 2 ||
                    activeRow == 1 ||
                    activeNumber == 19 ||
                    activeColor == 1 ||
                    activeMod == 1
                      ? "active"
                      : ""
                  }`
                }>
                19{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(22)}
                className={
                  `board-item btn btn-outline-info` +
                  ` ${
                    activeColumn == 2 ||
                    activeRow == 1 ||
                    activeNumber == 22 ||
                    activeColor == 2 ||
                    activeMod == 2
                      ? "active"
                      : ""
                  }`
                }>
                22{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className='board-box'>
            <div className='board-row'>
              <div
                onClick={() => handleNumber(27)}
                className={
                  `board-item btn btn-outline-danger` +
                  ` ${
                    activeColumn == 3 ||
                    activeRow == 3 ||
                    activeNumber == 27 ||
                    activeColor == 1 ||
                    activeMod == 1
                      ? "active"
                      : ""
                  }`
                }>
                27{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(30)}
                className={
                  `board-item btn btn-outline-danger` +
                  ` ${
                    activeColumn == 3 ||
                    activeRow == 3 ||
                    activeNumber == 30 ||
                    activeColor == 1 ||
                    activeMod == 2
                      ? "active"
                      : ""
                  }`
                }>
                30{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(33)}
                className={
                  `board-item btn btn-outline-info` +
                  ` ${
                    activeColumn == 3 ||
                    activeRow == 3 ||
                    activeNumber == 33 ||
                    activeColor == 2 ||
                    activeMod == 1
                      ? "active"
                      : ""
                  }`
                }>
                33{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(36)}
                className={
                  `board-item btn btn-outline-danger` +
                  ` ${
                    activeColumn == 3 ||
                    activeRow == 3 ||
                    activeNumber == 36 ||
                    activeColor == 1 ||
                    activeMod == 2
                      ? "active"
                      : ""
                  }`
                }>
                36{" "}
              </div>{" "}
            </div>{" "}
            <div className='board-row'>
              {" "}
              <div
                onClick={() => handleNumber(26)}
                className={
                  `board-item btn btn-outline-info` +
                  ` ${
                    activeColumn == 3 ||
                    activeRow == 2 ||
                    activeNumber == 26 ||
                    activeColor == 2 ||
                    activeMod == 2
                      ? "active"
                      : ""
                  }`
                }>
                26{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(29)}
                className={
                  `board-item btn btn-outline-info` +
                  ` ${
                    activeColumn == 3 ||
                    activeRow == 2 ||
                    activeNumber == 29 ||
                    activeColor == 2 ||
                    activeMod == 1
                      ? "active"
                      : ""
                  }`
                }>
                29{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(32)}
                className={
                  `board-item btn btn-outline-danger` +
                  ` ${
                    activeColumn == 3 ||
                    activeRow == 2 ||
                    activeNumber == 32 ||
                    activeColor == 1 ||
                    activeMod == 2
                      ? "active"
                      : ""
                  }`
                }>
                32{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(35)}
                className={
                  `board-item btn btn-outline-info` +
                  ` ${
                    activeColumn == 3 ||
                    activeRow == 2 ||
                    activeNumber == 35 ||
                    activeColor == 2 ||
                    activeMod == 1
                      ? "active"
                      : ""
                  }`
                }>
                35{" "}
              </div>{" "}
            </div>{" "}
            <div className='board-row'>
              {" "}
              <div
                onClick={() => handleNumber(25)}
                className={
                  `board-item btn btn-outline-danger` +
                  ` ${
                    activeColumn == 3 ||
                    activeRow == 1 ||
                    activeNumber == 25 ||
                    activeColor == 1 ||
                    activeMod == 1
                      ? "active"
                      : ""
                  }`
                }>
                25{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(28)}
                className={
                  `board-item btn btn-outline-info` +
                  ` ${
                    activeColumn == 3 ||
                    activeRow == 1 ||
                    activeNumber == 28 ||
                    activeColor == 2 ||
                    activeMod == 2
                      ? "active"
                      : ""
                  }`
                }>
                28{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(31)}
                className={
                  `board-item btn btn-outline-info` +
                  ` ${
                    activeColumn == 3 ||
                    activeRow == 1 ||
                    activeNumber == 31 ||
                    activeColor == 2 ||
                    activeMod == 1
                      ? "active"
                      : ""
                  }`
                }>
                31{" "}
              </div>{" "}
              <div
                onClick={() => handleNumber(34)}
                className={
                  `board-item btn btn-outline-danger` +
                  ` ${
                    activeColumn == 3 ||
                    activeRow == 1 ||
                    activeNumber == 34 ||
                    activeColor == 1 ||
                    activeMod == 2
                      ? "active"
                      : ""
                  }`
                }>
                34{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
          <div className='board-box'>
            <div className='board-row'>
              <div
                onClick={() => handleRow(3)}
                className='board-item-btn btn btn-outline-warning'>
                3 R{" "}
              </div>{" "}
            </div>{" "}
            <div className='board-row'>
              {" "}
              <div
                onClick={() => handleRow(2)}
                className='board-item-btn btn btn-outline-warning'>
                2 R{" "}
              </div>{" "}
            </div>{" "}
            <div className='board-row'>
              {" "}
              <div
                onClick={() => handleRow(1)}
                className='board-item-btn btn btn-outline-warning'>
                1 R{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className='board-bottom bg-dark bg-blackneon'>
          <div className='board-bottom-item'>
            <div
              onClick={() => handleColumn(1)}
              className={
                `bottom-item btn btn-outline-warning` +
                ` ${activeColumn == 1 ? "active" : ""}`
              }>
              1 ST COL{" "}
            </div>{" "}
            <div
              className={
                `bottom-item btn btn-outline-warning ` +
                `${activeMod == 2 ? "active" : ""}`
              }
              onClick={() => handleMod(2)}>
              EVEN{" "}
            </div>{" "}
          </div>{" "}
          <div className='board-bottom-item'>
            <div
              onClick={() => handleColor(1)}
              className={
                `bottom-item btn btn-outline-warning` +
                ` ${activeColor == 1 ? "active" : ""}`
              }>
              RED{" "}
            </div>{" "}
            <div
              onClick={() => handleColumn(2)}
              className={
                `bottom-item btn btn-outline-warning` +
                ` ${activeColumn == 2 ? "active" : ""}`
              }>
              2 ND COL{" "}
            </div>{" "}
            <div
              onClick={() => handleColor(2)}
              className={
                `bottom-item btn btn-outline-warning` +
                ` ${activeColor == 2 ? "active" : ""}`
              }>
              BLUE{" "}
            </div>{" "}
          </div>{" "}
          <div className='board-bottom-item'>
            <div
              className={
                `bottom-item btn btn-outline-warning ` +
                `${activeMod == 1 ? "active" : ""}`
              }
              onClick={() => handleMod(1)}>
              ODD{" "}
            </div>{" "}
            <div
              onClick={() => handleColumn(3)}
              className={
                `bottom-item btn btn-outline-warning` +
                ` ${activeColumn == 3 ? "active" : ""}`
              }>
              3 RD COL{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <div className='board-bottom bg-dark bg-blackneon'>
          <button
            disabled={
              betState.status == "Mining" || betState.status == "Success"
            }
            onClick={handleBet}
            className='full-item btn btn-danger'>
            BET{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </>
  );
}

export default () => (
  <DAppProvider config={config}>
    <App />
  </DAppProvider>
);
