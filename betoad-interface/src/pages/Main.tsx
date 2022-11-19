import { useEffect, useRef, useState, useMemo } from "react";
// import bg from "../assets/images/bg.gif";
import banner from "../assets/images/banner.jpeg";
import { useStore } from "hooks";
import ADDRESS from "constants/address";
import useContracts from "hooks/useContracts";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";
import { addressToTokenInfo } from "constants/token";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { BsGraphUp, BsQuestionCircle } from "react-icons/bs";
import { AiOutlineBook } from "react-icons/ai";
import { toSummary } from "utils";

const Main = () => {
  const store = useStore();
  const contracts = useContracts();
  const [currentRound, setCurrentRound] = useState(0);
  const [distributions, setDistributions] = useState<{
    [key: string]: ethers.BigNumber;
  }>({});
  const [betoPrice, setBetoPrice] = useState<BigNumber>();
  const [totalBurnAmount, setTotalBurnAmount] = useState<string>();
  const [totalBuybackAmount, setTotalBuybackAmount] = useState<string>();
  const [totalPlayingAmount, setTotalPlayingAmount] = useState<number>();
  const [currentRoundPlayingAmount, setCurrentRoundPlayingAmount] =
    useState<number>(0);
  const [tvl, setTvl] = useState<BigNumber>();

  useEffect(() => {
    if (contracts) {
      loadCurrentRound();
      loadDistiribution();
      loadBetoPrice();
      loadCollecterInfo();
      loadTVL();
    }
  }, [contracts]);

  const loadCurrentRound = async () => {
    if (contracts) {
      const currentRound =
        await contracts.readonlyDistributor.getCurrentRound();
      setCurrentRound(currentRound.toNumber() + 1);
      const playingAmount = await contracts.readonlyHouse.totalPlayingAmount();
      setTotalPlayingAmount(
        new BigNumber(playingAmount.toString())
          .shiftedBy(-18)
          .decimalPlaces(4, 1)
          .toNumber()
      );
      const currentPlayingAmount =
        await contracts.readonlyHouse.totalPlayingAmountByRound(currentRound);
      // console.log("currentPlayingAmount", currentPlayingAmount.toString());
      setCurrentRoundPlayingAmount(
        new BigNumber(currentPlayingAmount.toString())
          .shiftedBy(-18)
          .decimalPlaces(4, 1)
          .toNumber()
      );
    }
  };

  const loadDistiribution = async () => {
    if (contracts) {
      const total: {
        [key: string]: ethers.BigNumber;
      } = {};
      (await contracts.readonlyDistributor.allDestributions()).forEach(
        (dis) => {
          console.log("distribute", dis);
          if (dis.rewardType === 0) {
            total["staking"] = total["staking"]
              ? total["staking"].add(dis.totalDistributeAmount)
              : dis.totalDistributeAmount;
          } else if (dis.rewardType === 1) {
            total["playing"] = total["playing"]
              ? total["playing"].add(dis.totalDistributeAmount)
              : dis.totalDistributeAmount;
          }
        }
      );
      setDistributions(total);
    }
  };

  const loadBetoPrice = async () => {
    if (contracts) {
      const poolInfo = await contracts.readonlyHouse.pools(0);
      setBetoPrice(new BigNumber(poolInfo.price.toString()));
    }
  };

  const loadCollecterInfo = async () => {
    if (contracts) {
      const burnAmount = await contracts.readonlyCollector.totalBurnAmount();
      setTotalBurnAmount(
        new BigNumber(burnAmount.toString())
          .shiftedBy(-18)
          .decimalPlaces(0, 1)
          .toFormat()
      );
      const buybackAmount =
        await contracts.readonlyCollector.totalBuybackAmount();
      setTotalBuybackAmount(
        new BigNumber(buybackAmount.toString()).shiftedBy(-18).toFormat()
      );
    }
  };

  const loadTVL = async () => {
    if (contracts) {
      let _tvl = new BigNumber(0);
      const pools = await contracts.readonlyHouse.allPools();
      for (let i = 0; i < pools.length; i++) {
        if (addressToTokenInfo[pools[i].asset].name === "USDC") {
          _tvl = _tvl.plus(pools[i].deposit.toString());
        } else {
          const deposit = new BigNumber(pools[i].deposit.toString() || "0");
          const assetPrice = new BigNumber(pools[i].price.toString() || "0");
          _tvl = _tvl.plus(
            deposit
              .multipliedBy(assetPrice)
              .shiftedBy(-addressToTokenInfo[pools[i].asset].decimals)
          );
        }
      }
      setTvl(_tvl);
    }
  };

  const apr = useMemo(() => {
    if (contracts && distributions["staking"] && betoPrice && tvl) {
      const stakingRewardPerRound = new BigNumber(
        // distributions["staking"].toString()
        ethers.BigNumber.from(10).pow(18).mul(750000).toString()
      );
      const reward = stakingRewardPerRound
        .multipliedBy(betoPrice)
        .shiftedBy(-18);
      return reward
        .div(tvl)
        .multipliedBy(100)
        .multipliedBy(365)
        .decimalPlaces(2, 1)
        .toFormat();
    }
    return "0";
  }, [contracts, tvl, betoPrice, distributions]);

  const totalMintAmount = useMemo(() => {
    console.log("distributions", distributions);
    return new BigNumber(
      distributions["playing"]?.add(distributions["staking"]).toString() || 0
    )
      .shiftedBy(-18)
      .decimalPlaces(0, 1);
  }, [distributions]);

  const data = [
    { name: "Round 0", uv: 400000, pv: 2400, amt: 2400 },
    { name: "Round 1", uv: 700000, pv: 2400, amt: 2400 },
    { name: "Round 2", uv: 0, pv: 2400, amt: 2400 },
    { name: "Round 3", uv: 899999, pv: 2400, amt: 2400 },
    { name: "Round 4", uv: 1000000, pv: 2400, amt: 2400 },
    { name: "Round 5", uv: 400, pv: 2400, amt: 2400 },
  ];
  return (
    <div className="">
      {/* banner */}
      {/* <div className=" bg-[#262626] h-[16rem]"> */}
      <img src={banner} alt="" className="h-[16rem] w-full" />
      <div className="container max-w-5xl mx-auto">
        {/* </div> */}
        {/* products */}
        <div className="flex mt-7">
          <div className="basis-1/5 px-4 py-3 mr-0.5 bg-[#2c2c2c]">
            <div className="text-[#ABABAB] text-xs">Total Value Locked</div>
            <div className="mt-1 text-lg text-[#6AFC5F]">
              Ꞥ{toSummary(tvl?.shiftedBy(-18).toNumber())}
            </div>
          </div>
          <div className="basis-1/5 px-4 py-3 mr-0.5 bg-[#2c2c2c]">
            <div className="text-[#ABABAB] text-xs">APR</div>
            <div className="mt-1 text-lg text-[#6AFC5F]">
              <span className="mr-1">{apr}</span>
              <span className="text-xs">%</span>
            </div>
          </div>
          <div className="basis-1/5 px-4 py-3 mr-0.5 bg-[#2c2c2c]">
            <div className="text-[#ABABAB] text-xs mr-1">Total Reward</div>
            <div className="mt-1 text-lg text-[#6AFC5F]">
              <span className="mr-1">{totalMintAmount.toFormat()}</span>
              <span className="text-xs">BETO</span>
            </div>
          </div>
          <div className="basis-1/5 px-4 py-3 mr-0.5 bg-[#2c2c2c]">
            <div className="text-[#ABABAB] text-xs">Total Burned</div>
            <div className="mt-1 text-lg text-[#6AFC5F]">
              <span className="mr-1">{totalBurnAmount}</span>
              <span className="text-xs">BETO</span>
            </div>
          </div>
          <div className="basis-1/5 px-4 py-3 bg-[#2c2c2c]">
            <div className="text-[#ABABAB] text-xs">BETO Price</div>
            <div className="mt-1 text-lg text-[#6AFC5F]">
              Ꞥ{betoPrice?.shiftedBy(-18).decimalPlaces(4, 1).toFormat()}
            </div>
          </div>
        </div>
        {/* round */}
        {/* <div className="px-8 py-4 mt-[30px] bg-[#262626]">
        <div className="flex items-center justify-between text-[#c6c6c6] text-sm">
          <div className="">Distributed BETO Amount by Round</div>
          <div className="">{currentRound}/1000</div>
        </div>
        <div className="bg-[#262626] flex justify-between items-center mt-2 text-sm">
          <div className="">0</div>
          <div className="">{toSummary(1000000000)}</div>
        </div>
        <div className="relative my-1">
          <div className="bg-white opacity-50 w-full h-6"></div>
          <div
            className="bg-green w-full h-6 absolute top-0"
            style={{
              width: `${(totalMintAmount.toNumber() / 1000000000) * 100}%`,
            }}
          ></div>
        </div>
        <div
          className="bg-[#262626] text-green"
          style={{
            marginLeft: `${(totalMintAmount.toNumber() / 1000000000) * 100}%`,
          }}
        >
          {toSummary(totalMintAmount.toNumber())}
        </div>
      </div> */}
        <div className="mt-6 py-4 border-l border-r border-t border-[#404040]">
          <div className="ml-4 text-xs text-[#ABABAB]">Trade Overview</div>
          <div className="px-8 py-2">
            <div className="flex justify-center items-center">
              <LineChart
                className="text-xs mt-4 py-2"
                width={950}
                height={200}
                data={data}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <Line type="monotone" dataKey="uv" stroke="#6AFC5F" />
                <CartesianGrid stroke="#ABABAB" strokeDasharray="5 5" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: "black" }} />
              </LineChart>
            </div>
            {/* <div className="flex items-center mt-2">
            <div className="basis-1/4 p-5 bg-[#2d2d2d] mr-1.5">
              <div className="text-[#c6c6c6]">Total Trade Amount</div>
              <div className="">${totalPlayingAmount}</div>
            </div>
            <div className="basis-1/4  p-5 bg-[#2d2d2d] mr-1.5">
              <div className="text-[#c6c6c6]">CurrentRound Trade Amount</div>
              <div className="">${currentRoundPlayingAmount}</div>
            </div>
            <div className="basis-1/4  p-5 bg-[#2d2d2d] mr-1.5">
              <div className="text-[#c6c6c6]">Reward Per 1$</div>
              <div className="">${0}</div>
            </div>
            <div className="basis-1/4  p-5 bg-[#2d2d2d]">
              <div className="text-[#c6c6c6]">History Per 1$</div>
              <div className="">${0}</div>
            </div>
          </div> */}
          </div>
        </div>
        <div className="flex border border-[#404040]">
          <div className="basis-1/4 px-4 py-3 mr-0.5 border-r border-[#404040]">
            <div className="text-[#ABABAB] text-xs">Total Playing Amount</div>
            <div className="mt-1 text-lg text-[#6AFC5F]">
              Ꞥ{toSummary(totalPlayingAmount)}
            </div>
          </div>
          <div className="basis-1/4 px-4 py-3 mr-0.5 border-r border-[#404040]">
            <div className="text-[#ABABAB] text-xs mr-1">
              CurrentRound Playing Amount
            </div>
            <div className="mt-1 text-lg text-[#6AFC5F]">
              Ꞥ{toSummary(currentRoundPlayingAmount)}
            </div>
          </div>
          <div className="basis-1/4 px-4 py-3 mr-0.5 border-r border-[#404040]">
            <div className="text-[#ABABAB] text-xs">Reward Per 1Ꞥ</div>
            <div className="mt-1 text-lg text-[#6AFC5F]">
              <span className="mr-1">{0}</span>
              <span className="text-xs">BETO</span>
            </div>
          </div>
          <div className="basis-1/4 px-4 py-3">
            <div className="text-[#ABABAB] text-xs">History Per 1Ꞥ</div>
            <div className="mt-1 text-lg text-[#6AFC5F]">
              <span className="mr-1">{0}</span>
              <span className="text-xs">BETO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
