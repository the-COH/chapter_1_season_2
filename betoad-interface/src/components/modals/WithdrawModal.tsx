import BaseModal from "./BaseModal";

import { useState, useCallback, useEffect } from "react";

import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { useStore } from "hooks";
import useToast from "hooks/useToast";
import Button from "components/button/Button";
import BigNumber from "bignumber.js";
import IMAGE from "constants/images";
import useContracts from "hooks/useContracts";
import { Pool } from "types/pool";
import { addressToTokenInfo } from "constants/token";

interface BaseModalProps {
  isOpen: boolean;
  pool: Pool;
  onClose: () => void;
  className?: string;
}

const WithdrawModal = ({
  isOpen,
  pool,
  onClose,
  className,
}: BaseModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const store = useStore();
  const toast = useToast();
  const contract = useContracts();
  const tokenInfo = addressToTokenInfo[pool?.asset];

  const withdraw = async () => {
    if (contract) {
      const id = toast.loading(`Withdraw ${pool.name} Liquidity...`);
      setIsLoading(true);
      try {
        const result = await contract.house.withdraw(
          pool.poolId.toString(),
          pool.myDeposit.toFixed()
        );
        store.poolStore.load(contract);
        toast.txSuccess(id, `Withdraw ${pool.name} Liquidity...`, result?.hash);
      } catch (e: any) {
        toast.update(id, `Deposit Error: ${e.reason || e.message}`, "error");
        console.log(e);
      }
      setIsLoading(false);
      onClose();
    }
  };

  if (!pool) return null;
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={isLoading ? () => {} : onClose}
      title={"Withdraw"}
      className=" max-w-xs"
    >
      <div className="text-center">
        <img
          src={IMAGE[pool.name]}
          alt=""
          className="inline w-20 h-20 rounded-full"
        />
      </div>
      <div className="py-2 mt-3 text-center bg-[#282828] text-white">
        {pool.name}
      </div>
      <div className="py-2 px-2 mt-2 text-center bg-[#282828]">
        <div className="text-xxs text-[#999999]">My Staked Amount</div>
        <div className="flex items-baseline justify-center text-white">
          <div className="text-xl mr-1">
            {pool.myDeposit
              .shiftedBy(-tokenInfo.decimals)
              .decimalPlaces(2, 1)
              .toFormat()}
          </div>
          <div className="text-xs">{pool.name}</div>
        </div>
      </div>
      <div className="mt-4 flex">
        <Button
          state={
            pool.myDeposit.eq("0")
              ? "disabled"
              : isLoading
              ? "loading"
              : "active"
          }
          onClick={withdraw}
        >
          {pool.myDeposit.eq("0") ? "Insufficient Amount" : "WITHDRAW"}
        </Button>
      </div>
    </BaseModal>
  );
};

export default WithdrawModal;
