import BaseModal from "./BaseModal";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "hooks";

import { calculateFee, GasPrice } from "@cosmjs/stargate";
import useToast from "hooks/useToast";
import Button from "components/button/Button";
import useContracts from "hooks/useContracts";
import { nameToTokenInfo } from "constants/token";
import BigNumber from "bignumber.js";
import useGetBalances from "hooks/useGetBalances";
import useTokens from "hooks/useTokens";
import ADDRESS from "constants/address";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const UpgradeReferralAccountModal = ({
  isOpen,
  onClose,
  className,
}: BaseModalProps) => {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registerFee, setRegisterFee] = useState<BigNumber>();
  const contract = useContracts();
  const { token } = useTokens();
  const { getBalance } = useGetBalances();
  const store = useStore();
  const toast = useToast();

  useEffect(() => {
    // getBalance(nameToTokenInfo["WMATIC"].address);
    getRegisterFee();
  }, []);

  const getRegisterFee = async () => {
    if (contract) {
      const fee = await contract.readonlyRewarder.registerFee();
      setRegisterFee(new BigNumber(fee.toString() || 0));
    }
  };

  const upgradeReferralAccount = async () => {
    if (contract) {
      setIsLoading(true);
      const id = toast.loading(`Upgrade Referral Acount`);
      try {
        const tokenContract = token(nameToTokenInfo["BETO"].address);
        const allowance = new BigNumber(
          (
            await tokenContract.allowance(
              store.walletStore.address,
              ADDRESS.Rewarder
            )
          ).toString()
        );
        if (registerFee?.gt(allowance)) {
          const tx = await tokenContract.approve(
            ADDRESS.Rewarder,
            new BigNumber(10).pow(77).toFixed()
          );
          await tx.wait();
        }
        const tx = await contract.rewarder.registerReferralAddress(
          address || store.walletStore.address,
          "test",
          "test"
        );
        await tx.wait();
        toast.txSuccess(id, "Upgrade Referral Acount", tx.hash);
        onClose();
      } catch (e: any) {
        toast.update(id, `Upgrade Error: ${e.reason || e.message}`, "error");
        console.log(e);
      }
      setIsLoading(false);
    }
  };

  const isActive = useMemo(() => {
    if (
      registerFee &&
      store.balanceStore.get(nameToTokenInfo["BETO"].address)?.gte(registerFee)
    ) {
      return true;
    }
    return false;
  }, [registerFee, store.balanceStore.balances]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={isLoading ? () => {} : onClose}
      title={"Upgrade Referral Account"}
      className="max-w-md"
    >
      <div className="py-2 px-2 mt-6 text-center bg-[#222222]">
        <div className="text-xxs text-[#999999]">Upgrade Account</div>
        <div className="flex items-baseline justify-center text-white">
          <input
            type="text"
            value={address}
            onChange={({ target }) => setAddress(target.value)}
            className="w-full px-4 bg-transparent outline-none"
            placeholder={store.walletStore.address}
          />
        </div>
      </div>
      <div className="py-2 px-2 mt-4 text-center bg-[#222222]">
        <div className="text-xxs text-[#999999]">Upgrade Fee</div>
        <div className="flex items-baseline justify-center text-white">
          <div className="text-xl mr-1">1,000</div>
          <div className="text-xs">BETO</div>
        </div>
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">
          If you upgrade your account, another user can follow you. Upgrade fees
          will not be returned, and the referral effect is permanent.
        </p>
      </div>

      <div className="mt-4 flex">
        <Button
          className="w-20"
          state={!isActive ? "disabled" : isLoading ? "loading" : "active"}
          onClick={upgradeReferralAccount}
        >
          {isActive ? "UPGRADE" : "Insufficient Balance"}
        </Button>
      </div>
    </BaseModal>
  );
};

export default UpgradeReferralAccountModal;
