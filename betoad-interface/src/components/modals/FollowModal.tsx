import BaseModal from "./BaseModal";

import { useEffect, useState } from "react";

import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { useStore } from "hooks";
import Button from "components/button/Button";
import useToast from "hooks/useToast";
import BigNumber from "bignumber.js";
import IMAGE from "constants/images";
import { token_info } from "utils/asset";
import useContracts from "hooks/useContracts";
import { Pool } from "types/pool";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const FollowModal = ({ isOpen, onClose, className }: BaseModalProps) => {
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
    <BaseModal
      isOpen={isOpen}
      onClose={isLoading ? () => {} : onClose}
      title={"Follow"}
      className="max-w-md"
    >
      <div className="flex items-center mt-4">
        <div className="grow mr-4">
          <div className="flex items-baseline">
            <input
              type="text"
              value={address}
              onChange={({ target }) => setAddress(target.value)}
              className="grow py-3 px-4 text-white bg-[#444444] outline-none"
              placeholder="address"
            />
          </div>
        </div>
        <div className="">
          <Button state={isLoading ? "loading" : "active"} onClick={follow}>
            Follow
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default FollowModal;
