import BaseModal from "./BaseModal";
import { useEffect, useMemo, useState } from "react";

import { useStore } from "hooks";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
import useToast from "hooks/useToast";
import { observer } from "mobx-react-lite";
import BigNumber from "bignumber.js";
import IMAGE from "constants/images";
import { isNativeToken, toString } from "utils/asset";
import Button from "components/button/Button";
import useContracts from "hooks/useContracts";
import useTokens from "hooks/useTokens";
import useGetBalances from "hooks/useGetBalances";
import { Pool } from "types/pool";
import ADDRESS from "constants/address";
import { addressToTokenInfo } from "constants/token";

interface BaseModalProps {
  isOpen: boolean;
  pool: Pool;
  onClose: () => void;
  className?: string;
}

const DepositModal = observer(
  ({ isOpen, pool, onClose, className }: BaseModalProps) => {
    const [balance, setBalance] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const store = useStore();
    const contract = useContracts();
    const { token } = useTokens();
    const { getBalance } = useGetBalances();

    useEffect(() => {
      if (isOpen && store.walletStore.address && pool) {
        getBalance(pool.asset);
      }
    }, [isOpen]);

    const deposit = async () => {
      if (store.walletStore.address) {
        setIsLoading(true);
        // const token = toString(pool.asset.info);

        const assetInfo = addressToTokenInfo[pool.asset];

        const amount = new BigNumber(balance).shiftedBy(assetInfo.decimals);
        const id = toast.loading(`Deposit ${pool.name} Liquidity...`);

        try {
          const tokenContract = token(pool.asset);
          const allowance = new BigNumber(
            (
              await tokenContract.allowance(
                store.walletStore.address,
                ADDRESS.House
              )
            ).toString()
          );
          console.log(allowance.toString());
          console.log(amount.toString());
          if (amount.gt(allowance)) {
            const tx = await tokenContract.approve(
              ADDRESS.House,
              new BigNumber(10).pow(77).toFixed()
            );
            console.log("approve tx");
            await tx.wait();
            console.log("approve tx end");
          }

          const result = await contract?.house.deposit(
            pool.poolId.toString(),
            amount.toFixed()
          );
          await result?.wait();

          store.poolStore.load(contract);
          console.log(result);
          toast.txSuccess(
            id,
            `Deposit ${pool.name} Liquidity...`,
            result?.hash
          );

          console.log(result);
        } catch (e: any) {
          toast.update(id, `Deposit Error: ${e.reason || e.message}`, "error");
          console.log(e);
        }
        setIsLoading(false);
        _onClose();
      }
    };

    const _onClose = () => {
      setBalance("");
      onClose();
    };

    const maxBalance = () => {
      setBalance(store.balanceStore.get(pool.asset).shiftedBy(-6).toString());
    };

    const buttonStatus = useMemo(() => {
      if (balance) {
        if (
          new BigNumber(balance)
            .shiftedBy(6)
            .gt(store.balanceStore.get(pool.asset))
        ) {
          return {
            text: "Insufficient Balance",
            disabled: true,
          };
        } else {
          return {
            text: "DEPOSIT",
            disabled: false,
          };
        }
      } else {
        return {
          text: "DEPOSIT",
          disabled: true,
        };
      }
    }, [balance, store.balanceStore.balances]);

    if (!pool) return null;
    return (
      <BaseModal
        isOpen={isOpen}
        onClose={isLoading ? () => {} : _onClose}
        title={"Deposit"}
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
          <div className="text-xxs text-[#999999]">Deposit Amount</div>
          <div className="flex items-baseline justify-center text-white">
            <input
              type="text"
              className="w-full px-4 bg-transparent outline-none text-center"
              placeholder="0"
              value={balance}
              onChange={({ target }) => setBalance(target.value)}
            />
          </div>
        </div>
        <div className="flex justify-end">
          {console.log(`store.balanceStore`, store.balanceStore)}
          {pool && (
            <button
              className="text-right text-xs mt-2 text-white"
              onClick={maxBalance}
            >
              balance {store.balanceStore.getString(pool.asset)}
            </button>
          )}
        </div>
        <div className="mt-3 flex">
          <Button
            state={
              buttonStatus.disabled
                ? "disabled"
                : isLoading
                ? "loading"
                : "active"
            }
            onClick={deposit}
          >
            {buttonStatus.text}
          </Button>
        </div>
      </BaseModal>
    );
  }
);

export default DepositModal;
