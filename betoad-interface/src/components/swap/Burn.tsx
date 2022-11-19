import IMAGE from "constants/images";
import { AiOutlinePlus, AiOutlineArrowDown } from "react-icons/ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "hooks";
import Button from "components/button/Button";
import { observer } from "mobx-react-lite";
import BigNumber from "bignumber.js";
import useContracts from "hooks/useContracts";
import useTokens from "hooks/useTokens";
import ADDRESS from "constants/address";
import { ethers } from "ethers";
const Burn = observer(() => {
  const store = useStore();
  const contracts = useContracts();
  const { token } = useTokens();

  const [isLoading, setIsLoading] = useState(false);
  const [amountChip, setAmountChip] = useState<string>("");

  const burn = async () => {
    if (contracts) {
      const chip = token(ADDRESS.CHIP);
      const MAX = ethers.BigNumber.from(2).pow(254);
      const allowanceChip = await chip.allowance(
        store.walletStore.address,
        ADDRESS.CHIP
      );
      if (allowanceChip.lt(MAX)) {
        const tx = await chip.approve(ADDRESS.CHIP, MAX);
        await tx.wait();
      }
      const tx = await contracts.chip.withdraw(
        ethers.BigNumber.from(new BigNumber(amountChip).shiftedBy(18).toFixed())
      );
      await tx.wait();
    }
  };

  return (
    <div>
      <div className="p-4 pb-0 mt-3">
        <div className="flex items-stretch">
          <div className="flex items-center">
            <img src={IMAGE["CHIP"]} alt="" className="h-6 w-6 mr-2" />
            <div className="text-sm text-white mr-2">CHIP</div>
          </div>
          <input
            type="text"
            value={amountChip}
            onChange={({ target }) => {
              setAmountChip(target.value);
            }}
            className="grow py-2 px-4 text-white bg-[#444444] outline-none text-sm"
          />
        </div>
        <div
          className="cursor-pointer text-right text-xxs mt-0.5 text-white opacity-50"
          onClick={() => {
            setAmountChip(
              store.balanceStore.getString(ADDRESS.CHIP).replaceAll(",", "")
            );
          }}
        >
          {store.balanceStore.getString(ADDRESS.CHIP)}
        </div>
      </div>
      <div className="px-4">
        <div className="flex justify-center">
          <AiOutlineArrowDown className="w-5 h-5 text-white" />
        </div>
        <div className="flex justify-center items-center my-4">
          <img src={IMAGE["BETO"]} alt="" className="h-6 w-6 mr-2" />
          <div className="text-md mr-2 text-green">BETO</div>
          <AiOutlinePlus className="text-white mr-2" />
          <img src={IMAGE["NOTE"]} alt="" className="h-6 w-6 mr-2" />
          <div className="text-md mr-2 text-green">NOTE</div>
        </div>
      </div>
      <Button
        state={isLoading ? "loading" : "active"}
        onClick={burn}
        className="grow text-black bg-white w-full py-3 mt-2 border-t border-black"
      >
        Burn
      </Button>
    </div>
  );
});

export default Burn;
