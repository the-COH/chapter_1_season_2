import { useStore } from "hooks";
import useToast from "hooks/useToast";

import React, { useEffect, useState } from "react";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
import BigNumber from "bignumber.js";
import Button from "components/button/Button";
import useContracts from "hooks/useContracts";

const RANKING = [
  ["0xF3f10A8b69AB11b43292AeCc0b2C29FD39680Cb4", "000,000", "0,000,000"],
  ["0xF3f10A8b69AB11b43292AeCc0b2C29FD39680Cb4", "000,000", "0,000,000"],
  ["0xF3f10A8b69AB11b43292AeCc0b2C29FD39680Cb4", "000,000", "0,000,000"],
  ["0xF3f10A8b69AB11b43292AeCc0b2C29FD39680Cb4", "000,000", "0,000,000"],
  ["0xF3f10A8b69AB11b43292AeCc0b2C29FD39680Cb4", "000,000", "0,000,000"],
  ["0xF3f10A8b69AB11b43292AeCc0b2C29FD39680Cb4", "000,000", "0,000,000"],
  ["0xF3f10A8b69AB11b43292AeCc0b2C29FD39680Cb4", "000,000", "0,000,000"],
  ["0xF3f10A8b69AB11b43292AeCc0b2C29FD39680Cb4", "000,000", "0,000,000"],
  ["0xF3f10A8b69AB11b43292AeCc0b2C29FD39680Cb4", "000,000", "0,000,000"],
  ["0xF3f10A8b69AB11b43292AeCc0b2C29FD39680Cb4", "000,000", "0,000,000"],
];

const Rank = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [following, setFollowing] = useState<any>("");
  const contracts = useContracts();
  const store = useStore();

  const getFollowing = async () => {
    if (contracts) {
      const _following = await contracts.readonlyRewarder.followings(
        store.walletStore.address
      );
      if (_following !== "0x0000000000000000000000000000000000000000") {
        setFollowing(_following);
      } else {
        setFollowing("");
      }
    }
  };

  useEffect(() => {
    if (store.walletStore.address) {
      getFollowing();
    }
  }, [store.walletStore.address]);

  return (
    <div className="max-w-5xl mx-auto w-full overflow-scroll">
      <PlayingStatePanel following={following} />
      <div className="mt-[30px]">
        <h2 className="">Today Ranking</h2>
        <div className="">
          <div className="flex items-center text-xs mt-2 bg-[#393939] text-[#d8dadc] pl-4 pr-8 py-3">
            <div className="basis-1/12 text-center mr-2">RANKING</div>
            <div className="basis-5/12">ADDRESS</div>
            <div className="basis-3/12 flex items-baseline justify-end">
              PLAYING AMOUNT
            </div>
            <div className="basis-3/12 flex items-baseline justify-end">
              ESTIMATED REWARD
            </div>
          </div>
          {RANKING.map((item, index) => {
            return (
              <div className="flex items-center bg-[#262626] pl-4 pr-8 py-3 border-b border-[#161616]">
                <div className="basis-1/12 text-center text-2xl mr-2">
                  {index + 1}
                </div>
                <div className="basis-5/12">{item[0]}</div>
                <div className="basis-3/12 flex items-baseline justify-end">
                  <div className="mr-1 text-xl">{item[1]}</div>
                  <div className="text-xxs">USDC</div>
                </div>
                <div className="basis-3/12 flex items-baseline justify-end">
                  <div className="mr-1 text-xl">{item[2]}</div>
                  <div className="text-xxs">BETO</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const PlayingStatePanel = ({ following }: { following: string }) => {
  const [claimableReward, setClaimableReward] = useState(new BigNumber(0));
  const [isLoading, setIsLoading] = useState(false);
  const contract = useContracts();
  const store = useStore();
  const toast = useToast();

  const getReward = async () => {
    if (store.walletStore.address && contract) {
      // console.log(
      //   "referral",
      //   (await contract.referral.rewardRatioByRound(1)).toString()
      // );
      // console.log(
      //   "rewardAmountByRound",
      //   (
      //     await contract.referral.playingAmountByRound(
      //       store.walletStore.address,
      //       1
      //     )
      //   ).toString()
      // );
      // console.log(
      //   "totalRewardAmountByRound",
      //   await (await contract.referral.totalPlayingAmountByRound(0)).toString()
      // );
      // console.log((await contract.distributor.rounds(0)).toString());
      // console.log(
      //   await (
      //     await contract.distributor.distributionHistories(0, 0)
      //   ).amount.toString()
      // );
      // console.log(
      //   await (
      //     await contract.distributor.distributionHistories(0, 1)
      //   ).amount.toString()
      // );
      const following = await contract.rewarder.followings(
        store.walletStore.address
      );
      console.log("following", following);
      const result = await contract.house.previewClaimPlayingReward(
        store.walletStore.address
      );
      console.log("getReward", result.toString());
      if (result) {
        setClaimableReward(new BigNumber(result.toString()));
      } else {
        setClaimableReward(new BigNumber(0));
      }
    }
  };

  const claim = async () => {
    if (contract) {
      setIsLoading(true);
      const id = toast.loading(`Claim Playing Reward`);
      try {
        const tx = await contract.house.claimPlayingReward();
        await tx.wait();
        console.log(tx);
        getReward();
        toast.txSuccess(id, "Claim Playing Reward", tx.hash);
      } catch (e: any) {
        toast.update(
          id,
          `Claim Playing Reward Error: ${e.reason || e.message}`,
          "error"
        );
        console.log(e);
      }
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getReward();
  }, [store.walletStore.address]);

  // <div className="basis-1/5 px-4 py-3 mr-0.5 bg-[#2c2c2c]">
  //       <div className="text-[#ABABAB] text-xs">Total Value Locked</div>
  //       <div className="mt-1 text-lg text-[#6AFC5F]">${0}</div>
  //     </div>
  //     <div className="basis-1/5 px-4 py-3 mr-0.5 bg-[#2c2c2c]">
  //       <div className="text-[#ABABAB] text-xs">APR</div>
  //       <div className="mt-1 text-lg text-[#6AFC5F]">
  //         <span className="mr-1">{0}</span>
  //         <span className="text-xs">%</span>
  //       </div>
  //     </div>

  return (
    <div className="flex mt-[30px]">
      {following && (
        <div className="basis-5/12 grow shrink px-5 py-3 bg-[#2c2c2c] mr-0.5">
          <div className="text-xs text-[#ABABAB]">FOLLOWING</div>
          <div className="flex items-baseline text-[#6AFC5F] mt-1">
            <div className="text-lg">{following}</div>
          </div>
        </div>
      )}
      <div className="basis-1/4 grow shrink px-5 py-3 bg-[#2c2c2c] mr-0.5">
        <div className="text-xs text-[#c6c6c6]">TOTAL PLAYING REWARD</div>
        <div className="flex items-baseline text-[#6AFC5F] mt-1">
          <div className="text-lg">000,000,000</div>
          <div className="ml-1 text-xs">BETO</div>
        </div>
      </div>
      <div
        className={`basis-1/4 grow shrink flex items-center px-5 py-3 bg-[#2c2c2c] cursor-pointer hover:opacity-50 transition-all
        ${claimableReward.lte(0) ? "pointer-events-none" : ""}`}
        onClick={claim}
      >
        <div className="mr-4 grow">
          <div className="text-xs text-[#c6c6c6]">CLAIMABLE REWARD</div>
          <div className="flex items-baseline text-[#6AFC5F] mt-1">
            <div className="text-lg">
              {claimableReward.shiftedBy(-18).decimalPlaces(2, 1).toFormat()}
            </div>
            <div className="ml-1 text-xs">BETO</div>
          </div>
        </div>
        <div className="text-white border-b border-white text-sm transition-all focus:outline-none">
          Claim
        </div>
      </div>
    </div>
  );
};

export default Rank;
