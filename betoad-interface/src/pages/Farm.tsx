import React, { useState, useCallback, useMemo } from "react";

import { FaLock } from "react-icons/fa";
import DepositModal from "components/modals/DepositModal";
import WithdrawModal from "components/modals/WithdrawModal";
import ClaimModal from "components/modals/ClaimModal";

import { useEffect } from "react";

import { storeAnnotation } from "mobx/dist/internal";
import { useStore } from "hooks";
import { observer } from "mobx-react-lite";
import { Pool, PoolRaw } from "types/pool";
import BigNumber from "bignumber.js";
import IMAGE from "constants/images";
import useContracts from "hooks/useContracts";
import { addressToTokenInfo } from "constants/token";
import { toSummary } from "utils";
import { ethers } from "ethers";

interface CardProps {
  pool?: any;
  setIsModalOpen: (prev: any) => void;
}

interface PoolCardProps {
  pool: Pool;
  apr: string;
  address: string | undefined;
  openModal: (type: any, pool: any) => void;
}

const Farm = observer(() => {
  const store = useStore();
  const contracts = useContracts();
  const [isModalOpen, setIsModalOpen] = useState({
    deposit: false,
    withdraw: false,
    claim: false,
  });
  const [selectedPool, setSelectedPool] = useState<any>(null);
  const [distributions, setDistributions] = useState<Record<string, BigNumber>>(
    {}
  );
  const [betoPrice, setBetoPrice] = useState<BigNumber>();

  useEffect(() => {
    if (contracts) {
      store.poolStore.load(contracts);
      loadBetoPrice();
      loadDistiribution();
    }
  }, [contracts, store.walletStore.address]);

  const openModal = (type: string, pool: any) => {
    setSelectedPool(pool);
    setIsModalOpen({
      deposit: type === "deposit" ? true : false,
      withdraw: type === "withdraw" ? true : false,
      claim: type === "claim" ? true : false,
    });
  };

  const loadDistiribution = async () => {
    if (contracts) {
      const total: {
        [key: string]: BigNumber;
      } = {};
      (await contracts.readonlyDistributor.allDestributions()).forEach(
        (dis) => {
          console.log("distribute", dis);
          if (dis.rewardType === 1) {
            total[dis.key.toString()] = new BigNumber(dis.ratio.toString());
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

  return (
    <div className="max-w-5xl mx-auto w-full">
      <FarmStatePanel />
      <div className="mt-[30px] bg-[#2c2c2c] text-[#ABABAB] py-3 px-8 flex items-center text-xs border-b border-[#1c1c1c]">
        <div className="basis-[20%]">Ticker</div>
        <div className="basis-[10%] text-right">APR</div>
        <div className="basis-[20%] text-right">Total Liquidity</div>
        <div className="basis-[20%] text-right">My Stake</div>
        <div className="basis-[30%] text-right">Manage</div>
      </div>
      <div className="">
        {store.poolStore.pools.map((pool, index) => {
          let apr = "";
          if (
            distributions[pool.poolId.toString()] &&
            pool.deposit.gt(0) &&
            pool.price.gt(0)
          ) {
            const rewardPerDay = distributions[pool.poolId.toString()]
              .multipliedBy(750_000)
              .div(1e6);
            const notePerDay = betoPrice
              ? rewardPerDay.multipliedBy(betoPrice)
              : new BigNumber(0);

            const tvl = pool.deposit.multipliedBy(pool.price).shiftedBy(-18);
            apr = notePerDay
              .multipliedBy(365)
              .div(tvl)
              .multipliedBy(100)
              .decimalPlaces(2, 1)
              .toFormat();
          }
          return (
            <FarmPoolCard
              key={`${pool.name}-${index}`}
              address={store.walletStore.address}
              pool={pool}
              apr={apr}
              openModal={openModal}
            />
          );
        })}
      </div>
      <DepositModal
        isOpen={isModalOpen.deposit}
        pool={selectedPool}
        onClose={() => setIsModalOpen((prev) => ({ ...prev, deposit: false }))}
      />
      <WithdrawModal
        isOpen={isModalOpen.withdraw}
        pool={selectedPool}
        onClose={() => setIsModalOpen((prev) => ({ ...prev, withdraw: false }))}
      />
      <ClaimModal
        isOpen={isModalOpen.claim}
        pool={selectedPool}
        onClose={() => setIsModalOpen((prev) => ({ ...prev, claim: false }))}
      />
    </div>
  );
});

const FarmPoolCard = observer(
  ({ pool, address, openModal, apr }: PoolCardProps) => {
    const tokenInfo = addressToTokenInfo[pool.asset];

    if (!tokenInfo) {
      return null;
    }
    return (
      <div className="bg-[#262626] border-b border-[#1c1c1c] px-8 py-3 flex items-center">
        <div className="basis-[20%] flex items-center">
          <img
            src={IMAGE[pool.name]}
            alt=""
            className="inline w-8 h-8 mr-4 rounded-full"
          />
          <div className="">{pool.name}</div>
        </div>
        <div className="basis-[10%] text-right text-green">
          <span className="mr-1">{apr}</span>
          <span className="text-xs">{apr && "%"}</span>
        </div>
        <div className="basis-[20%] text-right">
          {pool.deposit
            .shiftedBy(-tokenInfo.decimals)
            .decimalPlaces(2, 1)
            .toFormat()}
        </div>
        <div className="basis-[20%] text-right">
          {pool.myDeposit.gt(0) ? (
            <div className="text-green">
              {pool.myDeposit
                .shiftedBy(-tokenInfo.decimals)
                .decimalPlaces(2, 1)
                .toFormat()}
            </div>
          ) : (
            "0"
          )}
        </div>
        <div className="basis-[30%] flex items-center justify-end">
          <button
            className="bg-transparent text-green border-b border-green text-sm  hover:opacity-50 transition-all mr-3 focus:outline-none"
            onClick={() => {
              openModal("deposit", pool);
            }}
          >
            Deposit
          </button>
          <button
            className="bg-transparent text-white border-b border-white text-sm hover:opacity-50 transition-all mr-3 focus:outline-none"
            onClick={() => {
              openModal("withdraw", pool);
            }}
          >
            Withdraw
          </button>
          <button
            className="bg-transparent text-white border-b border-white text-sm hover:opacity-50 transition-all focus:outline-none"
            onClick={() => {
              openModal("claim", pool);
            }}
          >
            Claim
          </button>
        </div>
      </div>
    );
  }
);

const FarmStatePanel = observer(() => {
  const contracts = useContracts();
  const [betoPrice, setBetoPrice] = useState<BigNumber>();
  const [totalBurnAmount, setTotalBurnAmount] = useState<string>();
  const [tvl, setTvl] = useState<BigNumber>();
  const [totalBuybackAmount, setTotalBuybackAmount] = useState<string>();
  const [distributions, setDistributions] = useState<{
    [key: string]: ethers.BigNumber;
  }>({});

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

  useEffect(() => {
    if (contracts) {
      loadDistiribution();
      loadBetoPrice();
      loadCollecterInfo();
      loadTVL();
    }
  }, [contracts]);

  return (
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
  );
});

export default Farm;
