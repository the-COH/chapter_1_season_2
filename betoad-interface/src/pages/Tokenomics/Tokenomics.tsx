import { useStore } from "hooks";
import useToast from "hooks/useToast";

import React, { useEffect, useMemo, useState } from "react";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
import BigNumber from "bignumber.js";
import RootStore from "store/root";
import { Asset, AssetRaw } from "types/asset";
import { toAsset, toCollectorContract, toProfit } from "utils/converter";
import { addressToContract } from "utils/contracts";
import {
  Profit,
  ProfitRaw,
  CollectorContract,
  DistributorContract,
} from "types/contract";
import Button from "components/button/Button";
import useContracts from "hooks/useContracts";
import { addressToTokenInfo, nameToTokenInfo } from "constants/token";
import useTokens from "hooks/useTokens";
import ADDRESS from "constants/address";
import { observer } from "mobx-react-lite";

const Tokenomics = observer(() => {
  const store = useStore();

  const contract = useContracts();

  const [profit, setProfit] = useState<BigNumber>(new BigNumber(0));
  const { token } = useTokens();

  useEffect(() => {
    store.poolStore.load(contract);
    init();
  }, []);

  const init = async () => {
    // if (contract) {
    //   console.log(await token(nameToTokenInfo["BETO"].address));
    //   console.log(
    //     await token(nameToTokenInfo["BETO"].address).balanceOf(ADDRESS.Referral)
    //   );
    //   const _profit = await token(nameToTokenInfo["BETO"].address).balanceOf(
    //     ADDRESS.Referral
    //   );
    //   setProfit(new BigNumber(_profit.toString()));
    // }
  };

  return (
    <div className="">
      <CurrentStatePanel />
      <div className="">
        <div className="mt-4">
          <CollectorPanel />
        </div>
        <div className="mt-4">
          <DistributorPanel />
        </div>
        <div className="mt-4">
          <div className="bg-[#222222] p-4 rounded-lg">
            <div className="text-red">Referral</div>
            <div className="flex">
              <div className="mr-4">Profit</div>
              <div className="text-green">
                {profit.shiftedBy(-18).decimalPlaces(2, 1).toFormat()}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <HousePanel store={store} />
        </div>
      </div>
    </div>
  );
});

const DistributorPanel = observer(() => {
  const contract = useContracts();

  const [distributorState, setDistributorState] =
    useState<DistributorContract>();
  const [lastRoundHeight, setLastRoundHeight] = useState<any>();
  const [currentRound, setCurrentRound] = useState<number>(0);
  const [distributeHistories, setDistributeHistories] = useState<any[]>([]);
  const [totalDistributeAmount, setTotalDistributeAmount] =
    useState<BigNumber>();

  const distribute = async () => {
    console.log("distribute");
    console.log("contract", contract);
    if (contract) {
      console.log("contract", contract);
      const tx = await contract.distributor.distribute();
      await tx.wait();
      console.log(tx);
    }
  };

  useEffect(() => {
    if (contract) {
      (async () => {
        const lastRoundHeight =
          await contract.readonlyDistributor.lastRoundHeight();
        setLastRoundHeight(lastRoundHeight.toNumber());
        const currentRound =
          await contract.readonlyDistributor.getCurrentRound();
        setCurrentRound(currentRound.toNumber());
        const totalDistributeAmount =
          await contract.distributor.totalDistributeAmount();
        setTotalDistributeAmount(
          new BigNumber(totalDistributeAmount.toString())
        );
      })();
    }
  }, [contract]);

  // const isDistributable = useMemo(
  //   () => lastDistributeRound + 1 < currentRound,
  //   [lastDistributeRound, currentRound]
  // );

  return (
    <div className="bg-[#222222] p-4 rounded-lg">
      <div className="text-red">Distributor</div>
      <div className="flex">
        <div className="mr-4">Last Round Height</div>
        <div className="">{lastRoundHeight}</div>
      </div>
      <div className="flex">
        <div className="mr-4">Current Round</div>
        <div className="">{currentRound}</div>
      </div>
      <div className="flex">
        <div className="mr-4">Total Distribute Amount</div>
        <div className="">
          {totalDistributeAmount?.shiftedBy(-18).decimalPlaces(6, 1).toFormat()}
        </div>
      </div>
      <div className="mt-4">
        {distributorState?.distributions.map((dist) => {
          return (
            <div className="flex">
              <div className="mr-4">{dist.description}</div>
              <div className="text-green">{dist.ratio}</div>
            </div>
          );
        })}
      </div>
      <div className="mt-4">Distribute History</div>
      <div>
        <Button onClick={distribute}>Distrubute</Button>
      </div>
    </div>
  );
});

const CollectorPanel = observer(() => {
  const store = useStore();
  const contract = useContracts();

  const [harvestContracts, setHarvestContracts] = useState<string[]>([]);
  const [profits, setProfits] = useState<any>([]);
  const [totalBurnAmount, setTotalBurnAmount] = useState<BigNumber>(
    new BigNumber(0)
  );
  const [collectorState, setCollectorState] = useState<CollectorContract>();

  const [swapHistory, setSwapHistory] = useState<any[]>([]);
  const [burnHistory, setBurnHistory] = useState<any[]>([]);

  useEffect(() => {
    init();
    // wasm
    //   .query("collector", { state: {} })
    //   .then((result) => setCollectorState(toCollectorContract(result)));
    // if (contract) {
    //   const tx = await contract.readonlyCollector.harvestContracts();
    // }
    // wasm
    //   .query("collector", { harvest_contracts: {} })
    //   .then((result) => setHarvestContracts(result));
    // wasm.query("collector", { profits: {} }).then((result: ProfitRaw[]) => {
    //   setProfits(toProfit(result));
    // });
    // wasm.query("collector", { swaps: {} }).then((result) => {
    //   setSwapHistory(result);
    // });
    // wasm.query("collector", { actions: {} }).then((result) => {
    //   setBurnHistory(result);
    // });
    // wasm
    //   .query(contracts.token.contractAddresses.usdc, {
    //     balance: { address: contracts.collector.contractAddresses.default },
    //   })
    //   .then((result) => {
    //     console.log("result", result);
    //   });
  }, [contract]);

  const init = async () => {
    if (contract) {
      setProfits(await contract.readonlyCollector.allBalances());
      setTotalBurnAmount(
        new BigNumber(
          (await contract.readonlyCollector.totalBurnAmount()).toString()
        )
      );
    }
  };

  const collect = async () => {
    if (contract) {
      const tx = await contract.collector.harvest();
      await tx.wait();
      console.log(tx);
    }
    // const result = await wasm.execute("collector", { collect: {} });
    // console.log(result);
  };

  const swapAll = async () => {
    // const result = await wasm.execute("collector", { swap_all: {} });
    // console.log(result);
  };

  const swapOne = async (token_info: any) => {
    // console.log(token_info);
    // const result = await wasm.execute("collector", {
    //   swap: { asset_info: token_info },
    // });
    // console.log(result);
  };

  const buyback = async () => {
    // const result = await wasm.execute("collector", { buyback: {} });
    // console.log(result);
  };

  const burnOrTransfer = async () => {
    if (contract) {
      const tx = await contract.collector.burnOrDistribute();
      await tx.wait();
      console.log(tx);
    }
    // const result = await wasm.execute("collector", { action: {} });
    // console.log(result);
  };

  return (
    <div className="bg-[#222222] p-4 rounded-lg">
      <div className="text-red">Collector</div>
      <div className="flex">
        <div className="mr-4">total_distribute_amount</div>
        <div className="text-green">
          {collectorState?.total_distribute_amount
            .shiftedBy(-6)
            .decimalPlaces(6, 1)
            .toFormat()}
        </div>
      </div>
      <div className="flex">
        <div className="mr-4">total_burn_amount</div>
        <div className="text-green">
          {totalBurnAmount.shiftedBy(-18).decimalPlaces(6, 1).toFormat()}
        </div>
      </div>
      <div className="flex">
        <div className="mr-4">harvestContacts</div>
        <div className="flex text-green">
          {harvestContracts.map((contract) => (
            <div className="mr-2">{addressToContract(contract)}</div>
          ))}
        </div>
      </div>
      <div className="mt-4">
        <div className="mr-4">profits</div>
        {profits.map((profit: any) => {
          return (
            <div className="flex">
              <div className="w-20">{addressToTokenInfo[profit.addr].name}</div>
              <div className="">
                {new BigNumber(profit.amount.toString())
                  .shiftedBy(-addressToTokenInfo[profit.addr].decimals)
                  .decimalPlaces(6, 1)
                  .toFormat()}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex">
        <div className="basis-1/2">
          <div className="">SWAP</div>
          <div className="">
            {/* {swapHistory.map((swap) => {
              const assetName = assetAddressToName[toString(swap.asset.info)];

              return (
                <div className="flex items-baseline">
                  <div className="mr-2">
                    {new Date(
                      parseInt(swap.time.slice(0, 13))
                    ).toLocaleString()}
                  </div>
                  <div className="mr-2">
                    [{assetName === "USDC" ? "BUYBACK" : "SWAP"}]
                  </div>
                  <div className="mr-1">
                    {new BigNumber(swap.asset.amount)
                      .shiftedBy(-6)
                      .decimalPlaces(6, 1)
                      .toFormat()}
                  </div>
                  <div className="text-xs">{assetName}</div>
                  <div className="mx-2">➞</div>
                  <div className="">
                    {assetName === "USDC" ? "BETO" : "USDC"}
                  </div>
                </div>
              );
            })} */}
          </div>
        </div>
        <div className="basis-1/2">
          <div className="">ACTION</div>
          <div className="">
            {burnHistory.map((burn) => {
              return (
                <div className="flex items-baseline">
                  <div className="mr-2">
                    {new Date(
                      parseInt(burn.time.slice(0, 13))
                    ).toLocaleString()}
                  </div>
                  <div className="mr-2">[BURN]</div>
                  <div className="mr-2">
                    {new BigNumber(burn.amount)
                      .shiftedBy(-6)
                      .decimalPlaces(6, 1)
                      .toFormat()}
                  </div>
                  <div className="text-xs">BETO</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-4 flex space-x-2">
        <div className="">
          <Button onClick={collect}>Collect</Button>
        </div>
        <div className="">
          <Button onClick={swapAll}>Swap All</Button>
        </div>
        <div className="">
          <Button onClick={buyback}>Buyback</Button>
        </div>
        <div className="">
          <Button onClick={burnOrTransfer}>BurnOrTransfer</Button>
        </div>
      </div>
    </div>
  );
});

const CurrentStatePanel = observer(() => {
  const store = useStore();
  const [blockHeight, setBlockHeight] = useState("");
  const [currentRound, setCurrentRound] = useState(0);

  useEffect(() => {
    getCurrentRound();
    getBlockHeight();
  }, []);

  const getBlockHeight = () => {
    // store.lcd.tendermint.blockInfo().then((blockInfo) => {
    //   setBlockHeight(blockInfo.block.header.height);
    // });
  };

  const getCurrentRound = () => {
    // wasm.query("house", { current_round: {} }).then((result) => {
    //   setCurrentRound(result);
    // });
  };

  return (
    <div className="bg-[#222222] p-4 rounded-lg flex">
      <div className="basis-1/3">
        <div className="mr-4">Current Time</div>
        <div className="">{new Date().toLocaleString()}</div>
      </div>
      <div className="basis-1/3">
        <div className="mr-4">Block Height</div>
        <div className="">{blockHeight}</div>
      </div>
      <div className="basis-1/3">
        <div className="mr-4">Current Round</div>
        <div className="">{currentRound}</div>
      </div>
    </div>
  );
});

const HousePanel = observer(({ store }: { store: RootStore }) => {
  return (
    <div className="bg-[#222222] p-4 rounded-lg">
      <div className="text-red">House</div>
      <div className="flex">
        <div className="mr-2">max_output_rate</div>
        <div className="text-green">
          {store.contractStore.house?.max_output_rate}
        </div>
      </div>
      <div className="mt-4">Pools</div>
      {store.poolStore.pools.map((pool) => {
        return (
          <div className="flex" key={pool.poolId.toString()}>
            <div className="w-[100px] mr-2">{pool.name}</div>
            <div className="mr-2">
              {pool.deposit
                .shiftedBy(-addressToTokenInfo[pool.asset].decimals)
                .decimalPlaces(6, 1)
                .toFormat()}
            </div>
            <div className="mr-2">
              {pool.balance
                .shiftedBy(-addressToTokenInfo[pool.asset].decimals)
                .decimalPlaces(6, 1)
                .toFormat()}
            </div>
            <div className="basis-1/3 text-green">
              {pool.balance
                .minus(pool.deposit)
                .shiftedBy(-addressToTokenInfo[pool.asset].decimals)
                .decimalPlaces(6, 1)
                .toFormat()}
            </div>
          </div>
        );
      })}
    </div>
  );
});

export default Tokenomics;
