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
  pool: Pool;
  onClose: () => void;
  className?: string;
}

const ClaimModal = ({ isOpen, pool, onClose, className }: BaseModalProps) => {
  const [claimableAmount, setClaimableAmount] = useState<BigNumber>(
    new BigNumber(0)
  );
  const [isLoading, setIsLoading] = useState(false);
  const store = useStore();
  const toast = useToast();
  const contract = useContracts();

  const getClaimableAmount = async () => {
    try {
      if (store.walletStore.address && contract) {
        try {
          const result = await contract.house.previewClaim(
            pool.poolId.toString(),
            store.walletStore.address
          );
          setClaimableAmount(new BigNumber(result.toString()));
        } catch (e) {
          console.log(e);
        }
      } else {
        setClaimableAmount(new BigNumber(0));
      }
    } catch (e) {
      setClaimableAmount(new BigNumber(0));
    }
  };

  const claim = async () => {
    if (contract) {
      setIsLoading(true);
      const id = toast.loading(`Claim ${pool.name} Reward`);
      try {
        const tx = await contract.house.claim(pool.poolId.toString());
        await tx.wait();
        toast.txSuccess(id, `Claim ${pool.name} Reward`, tx.hash);
        // store.balanceStore.load([CONTRACTS.token.contractAddresses]);
      } catch (e: any) {
        toast.update(id, `Deposit Error: ${e.reason || e.message}`, "error");
        console.log(e);
      }
      setIsLoading(false);
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      getClaimableAmount();
    }
  }, [isOpen]);

  if (!pool) return null;
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={isLoading ? () => {} : onClose}
      title={"Claim"}
      className="max-w-xs"
    >
      <div className="text-center">
        <img
          src={IMAGE.BETO}
          alt=""
          className="inline w-20 h-20 rounded-full"
        />
      </div>
      <div className="py-2 mt-3 text-center bg-[#282828] text-white">
        {pool.name} Rewards
      </div>
      <div className="py-2 px-2 mt-2 text-center bg-[#282828]">
        <div className="text-xxs text-[#999999]">Claimable Amount</div>
        <div className="flex items-baseline justify-center text-white">
          <div className="text-xl mr-1">
            {claimableAmount.shiftedBy(-18).decimalPlaces(2, 1).toFormat()}
          </div>
          <div className="text-xs">zero</div>
        </div>
      </div>
      <div className="mt-4 flex">
        <Button
          state={
            claimableAmount.eq("0")
              ? "disabled"
              : isLoading
              ? "loading"
              : "active"
          }
          onClick={claim}
        >
          CLAIM
        </Button>
      </div>
    </BaseModal>
  );
};

export default ClaimModal;
