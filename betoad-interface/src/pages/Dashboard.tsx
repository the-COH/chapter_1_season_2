import { useEffect, useState } from "react";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { calculateFee, GasPrice } from "@cosmjs/stargate";

import { FaUserCircle } from "react-icons/fa";

import GOLD_ICON from "assets/images/gold.png";

import FollowModal from "../components/modals/FollowModal";

import { useStore } from "hooks";
import useToast from "hooks/useToast";
import BigNumber from "bignumber.js";
import { observer } from "mobx-react-lite";
import Button from "components/button/Button";
import useContracts from "hooks/useContracts";
import { BetoContract } from "store/contract";

const toShort = function (address: string) {
  if (address) {
    return `${address.slice(0, 7)}...${address.slice(-7)}`;
  } else {
    return "";
  }
};

const Referral = observer(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [referralInfo, setReferralInfo] = useState<any>();
  const [rewardInfo, setRewardInfo] = useState<any>();
  const [claimablePlayingReward, setClaimablePlayingReward] =
    useState<BigNumber>(new BigNumber(0));
  const [claimedPlayingReward, setClaimedPlayingReward] = useState<BigNumber>(
    new BigNumber(0)
  );
  const [following, setFollowing] = useState<any>("");
  const [exp, setExp] = useState<BigNumber>(new BigNumber(0));
  const contracts = useContracts();
  const store = useStore();
  const toast = useToast();

  const getReferral = async () => {
    if (contracts) {
      const referral = await contracts.readonlyRewarder.referrals(
        store.walletStore.address
      );
      setReferralInfo(referral);
    }
  };

  const getReward = async () => {
    if (contracts) {
      const reward = await contracts.readonlyRewarder.rewards(
        store.walletStore.address
      );
      setRewardInfo({
        amount: new BigNumber(reward.amount.toString() || "0"),
        claimedAmount: new BigNumber(reward.claimedAmount.toString() || "0"),
      });
    }
  };

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

  const claim = async () => {
    if (contracts) {
      const id = toast.loading(`Pending Claim Rewards`);
      try {
        const tx = await contracts.rewarder.claimReferralReward();
        await tx.wait();
        getReward();
        console.log(tx);
        toast.update(id, "successfully claim!!", "success");
      } catch (e) {
        toast.update(id, "claim error", "error");
        console.log(e);
      }
    }
  };

  const claimPlayingReward = async () => {
    if (contracts) {
      const id = toast.loading(`Pending Claim Player Rewards`);
      try {
        const tx = await contracts.house.claimPlayingReward();
        await tx.wait();
        getReward();
        console.log(tx);
        toast.update(id, "successfully claim!!", "success");
      } catch (e) {
        toast.update(id, "claim error", "error");
        console.log(e);
      }
    }
  };

  const getPlayingReward = async () => {
    if (contracts) {
      try {
        const claimedPlayingReward = await contracts.house.claimedPlayingReward(
          store.walletStore.address
        );
        setClaimedPlayingReward(new BigNumber(claimedPlayingReward.toString()));
      } catch (e) {}
      try {
        const claimablePlayingReward =
          await contracts.house.previewClaimPlayingReward(
            store.walletStore.address
          );
        setClaimablePlayingReward(
          new BigNumber(claimablePlayingReward.toString())
        );
      } catch (e) {}
    }
  };

  const getExp = () => {
    if (contracts) {
      contracts.readonlyHouse.exp(store.walletStore.address).then((result) => {
        console.log("exp", result.toString());
        setExp(new BigNumber(result.toString()).shiftedBy(-18));
      });
    }
  };

  useEffect(() => {
    if (store.walletStore.address && contracts) {
      getReferral();
      getReward();
      getFollowing();
      getPlayingReward();
      getExp();
    }
  }, [store.walletStore.address, contracts]);

  return (
    <div className="max-w-5xl mx-auto w-full overflow-scroll">
      <div className="mt-6">
        <ReferralStatePanel
          following={following}
          rewardInfo={rewardInfo}
          exp={exp}
          claim={claim}
        />
      </div>
      <div className="mt-6">
        <h1 className="text-xl font-dos pl-4 pb-5 text-green">Player Reward</h1>
        <div className="flex">
          <div className="basis-1/4 grow shrink px-5 py-3 bg-[#2c2c2c] mr-2">
            <div className="text-xs text-[#c6c6c6]">Total Player Reward</div>
            <div className="flex items-baseline text-[#6AFC5F] mt-1">
              <div className="text-lg">
                {claimedPlayingReward
                  .plus(claimablePlayingReward)
                  .shiftedBy(-18)
                  .decimalPlaces(0, 1)
                  .toFormat()}
              </div>
              <div className="ml-1 text-xs">BETO</div>
            </div>
          </div>
          <div
            className={`basis-1/4 grow shrink flex items-center px-5 py-3 bg-[#2c2c2c] cursor-pointer hover:opacity-50 transition-all
        ${claimablePlayingReward.lte(0) ? "pointer-events-none" : ""}`}
            onClick={claimPlayingReward}
          >
            <div className="mr-4 grow">
              <div className="text-xs text-[#c6c6c6]">Claimable Reward</div>
              <div className="flex items-baseline text-[#6AFC5F] mt-1">
                <div className="text-lg">
                  <div className="text-lg">
                    {claimablePlayingReward
                      .shiftedBy(-18)
                      .decimalPlaces(0, 1)
                      .toFormat()}
                  </div>
                </div>
                <div className="ml-1 text-xs">BETO</div>
              </div>
            </div>
            <div className="text-white border-b border-white text-sm transition-all focus:outline-none">
              Claim
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h1 className="text-xl font-dos pl-4 pb-5 text-green">
          Referral Reward
        </h1>
        <div className="flex">
          {rewardInfo && (
            <div className="basis-1/4 grow shrink px-5 py-3 bg-[#2c2c2c] mr-2">
              <div className="text-xs text-[#c6c6c6]">
                Total Referral Reward
              </div>
              <div className="flex items-baseline mt-1 text-green">
                <div className="">
                  {rewardInfo.amount
                    .shiftedBy(-18)
                    .decimalPlaces(2, 1)
                    .toFormat()}
                </div>
                <div className="ml-1 text-xs">BETO</div>
              </div>
            </div>
          )}
          {rewardInfo && (
            <div
              className={`basis-1/4 grow shrink flex px-5 py-3 bg-[#2c2c2c] hover:opacity-50 transition-all items-center cursor-pointer  ${
                rewardInfo.amount.minus(rewardInfo.claimedAmount).lte(0)
                  ? "pointer-events-none"
                  : ""
              }`}
              onClick={claim}
            >
              <div className="grow mr-4">
                <div className="text-xs text-[#c6c6c6]">Claimable Reward</div>
                <div className="flex items-baseline mt-1 text-green">
                  <div className="">
                    {rewardInfo.amount
                      .minus(rewardInfo.claimedAmount)
                      .shiftedBy(-18)
                      .decimalPlaces(2, 1)
                      .toFormat()}
                  </div>
                  <div className="ml-1 text-xs">BETO</div>
                </div>
              </div>
              <div className="text-white border-b border-white text-sm transition-all focus:outline-none">
                Claim
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pb-10">
        {referralInfo && store.walletStore.address && (
          <ReferralCard
            contracts={contracts}
            address={store.walletStore.address}
            follower={{
              addr: store.walletStore.address,
              amount: null,
            }}
          />
        )}
      </div>

      {/* <UpgradeReferralAccountModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      /> */}
    </div>
  );
});

const ReferralStatePanel = ({ following, rewardInfo, exp }: any) => {
  const store = useStore();
  const contracts = useContracts();
  const [isOpen, setIsOpen] = useState(false);
  const [followers, setFollowers] = useState<any>([]);

  const getFollowers = async () => {
    if (contracts) {
      try {
        const result =
          await contracts.readonlyRewarder.followerReferralRewardInfo(
            store.walletStore.address,
            store.walletStore.address
          );
        if (result) {
          setFollowers(
            result.map<any>((item) => ({
              addr: item.addr,
              amount: new BigNumber(item.amount.toString() || "0"),
            }))
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  useEffect(() => {
    if (contracts) {
      getFollowers();
    }
  }, [contracts]);

  if (!rewardInfo && !following) return null;
  return (
    <div className="">
      <h1 className="text-xl font-dos pl-4 text-green">Dashboard</h1>
      <div className="flex justify-end mb-1">
        <button
          className="text-xs text-[#999999] border-b leading-tight border-[#999999] hover:opacity-50 transition-all"
          onClick={() => setIsOpen(true)}
        >
          ADD REFERRAL
        </button>
      </div>
      <div className="flex justify-center items-stretch mb-4">
        <div className="border border-[#2c2c2c] p-5 basis-2/5 shrink-0 mr-2">
          <div className="flex items-center mb-4">
            <div className="w-[8rem] h-[8rem] shrink-0 mr-4">
              <FaUserCircle className="w-[8rem] h-[8rem] text-[#2c2c2c]" />
            </div>
            <div className="">
              <div className="text-xs text-[#c6c6c6]">Name</div>
              <div className="flex items-center">
                <div className="">GambleHolic</div>
                <img src={GOLD_ICON} alt="" className="h-6 w-6" />
              </div>
              <div className="mt-2 text-xs text-[#c6c6c6]">Description</div>
              <div className="">I'M GOING TO BANKRUPT THE CASINO</div>
            </div>
          </div>
          <div className="border-t border-[#2c2c2c]">
            <div className="mt-4 mb-2 text-xs text-[#c6c6c6]">
              Your Referral Link
            </div>
            <div className="">
              <input
                type="text"
                className="block w-full focus:outline-none border border-[#2c2c2c] bg-transparent p-2 text-center"
                value={"http://app.betoad.io/dashboard/4231"}
              />
              <button className="w-full p-2 font-bold bg-green text-[#2c2c2c]">
                Copy Link
              </button>
            </div>
            <div className="mt-3">
              <button className="w-full p-2 font-bold bg-[#4fa0ec]">
                Share On Twitter
              </button>
            </div>
          </div>
        </div>
        <div className="border border-[#2c2c2c] px-10 py-8 basis-2/3 flex flex-col justify-center">
          <div className="text-xl font-sbold text-[#c6c6c6]">RANK</div>
          <div className="flex items-baseline text-xl font-sbold">
            <div className="text-3xl text-green">31,412</div>
            <div className="px-2 opacity-50">/</div>
            <div className="opacity-50">123,134</div>
          </div>
          <div className="text-xl font-sbold mt-6 text-[#c6c6c6]">
            Referrals
          </div>
          <div className="flex items-baseline text-xl font-sbold">
            <div className="text-3xl text-green">{followers.length}</div>
            <div className="px-2 opacity-50">/</div>
            <div className="opacity-50">
              {exp?.div(1e3).decimalPlaces(0, 1).toString()}
            </div>
          </div>
          <div className="flex mt-6">
            <div className="mr-6">
              <div className="text-xl font-sbold text-[#c6c6c6]">LEVEL</div>
              <div className="text-3xl font-bold mt-2 text-green">
                {exp?.div(1e3).decimalPlaces(0, 1).plus(1).toString()}
              </div>
            </div>
            <div className="grow">
              <div className="text-xl font-sbold text-[#c6c6c6]">XP</div>
              <div className="relative mt-2">
                <div className="h-[1.5rem] w-full bg-[#2c2c2c]"></div>
                <div
                  className="absolute h-[1.5rem] bg-green top-0"
                  style={{
                    width: `${exp?.modulo(1e3).shiftedBy(-1).toString()}%`,
                  }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-md font-bold mt-1 text-[#c6c6c6]">
                <div className="">0</div>
                <div className="">1000</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className=""></div>
      <FollowModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

const ReferralCard = ({
  contracts,
  address,
  follower,
}: {
  contracts: BetoContract | undefined;
  address: any;
  follower: any;
}) => {
  const [isExtend, setIsExtend] = useState(false);
  const [followers, setFollowers] = useState<any>([]);

  const toggleExtend = () => {
    if (!isExtend) {
      getFollowers();
    }
    setIsExtend(!isExtend);
  };

  const getFollowers = async () => {
    if (contracts) {
      try {
        const result =
          await contracts.readonlyRewarder.followerReferralRewardInfo(
            address,
            follower.addr
          );
        if (result) {
          setFollowers(
            result.map<any>((item) => ({
              addr: item.addr,
              amount: new BigNumber(item.amount.toString() || "0"),
            }))
          );
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div className="flex items-start mb-4">
      <div className="border-t border-[#2c2c2c] mt-4 w-4"></div>
      <div className="flex items-center bg-[#2c2c2c] pl-2">
        <span className="py-1 pr-2 border-r border-[#161616]">
          {toShort(follower.addr)}
        </span>
        {follower.amount?.gt(0) && (
          <span className="py-1 px-2 border-r border-[#161616] text-center">
            {follower.amount.shiftedBy(-18).decimalPlaces(0, 1).toFormat()}
          </span>
        )}
        <button onClick={toggleExtend} className="px-2">
          {isExtend ? <GoTriangleUp /> : <GoTriangleDown />}
        </button>
      </div>
      {isExtend && followers.length > 0 && (
        <div className="border-t border-[#2c2c2c] mt-4 w-4"></div>
      )}
      {isExtend && followers.length > 0 && (
        <div className="mb-4 flex">
          <div className="border-l border-[#2c2c2c] my-4"></div>
          <div className="">
            {followers.map((item: any) => (
              <ReferralCard
                contracts={contracts}
                address={address}
                follower={item}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Referral;
