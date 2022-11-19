import { useEffect, useState } from "react";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { calculateFee, GasPrice } from "@cosmjs/stargate";

import UpgradeReferralAccountModal from "../components/modals/UpgradeReferralAccountModal";

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
  const [following, setFollowing] = useState<any>("");
  const contracts = useContracts();
  const store = useStore();
  const toast = useToast();

  const getReferral = async () => {
    if (contracts) {
      const referral = await contracts.readonlyRewarder.referrals(
        store.walletStore.address
      );
      console.log("referral", referral);
      setReferralInfo(referral);
    }
  };

  const getReward = async () => {
    if (contracts) {
      const reward = await contracts.readonlyRewarder.rewards(
        store.walletStore.address
      );
      console.log("reward", reward);
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

  useEffect(() => {
    if (store.walletStore.address && contracts) {
      getReferral();
      getReward();
      getFollowing();
    }
  }, [store.walletStore.address, contracts]);

  return (
    <div className="max-w-5xl mx-auto w-full overflow-scroll">
      <div className="text-right mb-2">
        <button
          className="text-sm text-[#999999] border-b leading-tight border-[#999999]"
          onClick={() => setIsOpen(true)}
        >
          UPGRADE REFERRAL ACCOUNT
        </button>
      </div>
      <ReferralStatePanel
        following={following}
        rewardInfo={rewardInfo}
        claim={claim}
      />
      {!following && <AddFollowingPanel />}
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

      <UpgradeReferralAccountModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
});

const ReferralStatePanel = ({ following, rewardInfo, claim }: any) => {
  if (!rewardInfo && !following) return null;
  return (
    // <div className="basis-1/4 p-5 bg-[#262626] mr-1.5">
    //           <div className="text-[#c6c6c6]">Total Trade Amount</div>
    //           <div className="">${totalPlayingAmount}</div>
    //         </div>
    <div className="flex mb-4">
      {following && (
        <div className="basis-5/12 grow shrink p-5 bg-[#262626] mr-0.5">
          <div className="text-xs text-[#c6c6c6]">FOLLOWING</div>
          <div className="flex items-baseline">
            <div className="">{following}</div>
          </div>
        </div>
      )}
      {rewardInfo && (
        <div className="basis-1/4 grow shrink p-5 bg-[#262626] mr-0.5">
          <div className="text-xs text-[#c6c6c6]">TOTAL REFERRAL REWARD</div>
          <div className="flex items-baseline">
            <div className="">
              {rewardInfo.amount.shiftedBy(-18).decimalPlaces(2, 1).toFormat()}
            </div>
            <div className="ml-1 text-xs">BETO</div>
          </div>
        </div>
      )}
      {rewardInfo && (
        <div
          className={`basis-1/4 grow shrink flex p-5 bg-[#262626] hover:opacity-50 transition-all items-center cursor-pointer  ${
            rewardInfo.amount.minus(rewardInfo.claimedAmount).lte(0)
              ? "pointer-events-none"
              : ""
          }`}
          onClick={claim}
        >
          <div className="grow mr-4">
            <div className="text-xs text-[#c6c6c6]">CLAIMABLE REWARD</div>
            <div className="flex items-baseline">
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
  );
};

const AddFollowingPanel = () => {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const contract = useContracts();
  const toast = useToast();

  const follow = async () => {
    if (address && contract) {
      setIsLoading(true);
      const id = toast.loading(`Add Referral Code`);
      try {
        const tx = await contract.rewarder.follow(address);
        await tx.wait();
        toast.txSuccess(id, "Add Referral Code", tx.hash);
        console.log(tx);
      } catch (e: any) {
        toast.update(
          id,
          `Add Referral Code Error: ${e.reason || e.message}`,
          "error"
        );
        console.log(Object.keys(e));
        console.log(Object.values(e));
        console.log(e.message);
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="w-fit mb-10 p-5 bg-[#262626]">
      <div className="text-xs text-[#c6c6c6] mb-2">REFERRAL CODE</div>
      <div className="flex items-center">
        <div className="basis-5/12 grow shrink mr-4">
          <div className="flex items-baseline">
            <input
              type="text"
              value={address}
              onChange={({ target }) => setAddress(target.value)}
              className="grow py-3 px-4 w-72 text-white bg-[#444444] outline-none"
              placeholder="address"
            />
          </div>
        </div>
        <div className="basis-1/4 grow shrink">
          <Button state={isLoading ? "loading" : "active"} onClick={follow}>
            ADD REFERRAL CODE
          </Button>
        </div>
      </div>
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

  console.log(followers);
  console.log(follower);

  return (
    <div className="flex items-start">
      <div className="border-t border-[#262626] mt-4 w-4"></div>
      <div className="flex items-center bg-[#262626] pl-2">
        <span className="py-1 pr-2 border-r border-[#161616]">
          {toShort(follower.addr)}
        </span>
        {follower.amount?.gt(0) && (
          <span className="py-1 px-2 border-r text-center">
            {follower.amount.shiftedBy(0).decimalPlaces(2, 1).toFormat()}
          </span>
        )}
        <button onClick={toggleExtend} className="px-2">
          {isExtend ? <GoTriangleUp /> : <GoTriangleDown />}
        </button>
      </div>
      {isExtend && followers.length > 0 && (
        <div className="border-t border-[#262626] mt-4 w-4"></div>
      )}
      {isExtend && followers.length > 0 && (
        <div className="mb-4 flex">
          <div className="border-l border-[#262626] my-4"></div>
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
