import { AiOutlinePlus, AiOutlineArrowDown } from "react-icons/ai";
import IMAGE from "constants/images";
import { useEffect, useMemo, useRef, useState } from "react";
import { useStore } from "hooks";

import BigNumber from "bignumber.js";
import Button from "components/button/Button";
import { observer } from "mobx-react-lite";
import useToast from "hooks/useToast";
import ADDRESS from "constants/address";
import useContracts from "hooks/useContracts";
import useTokens from "hooks/useTokens";
import { ethers } from "ethers";

const Mint = observer(() => {
  const store = useStore();
  const toast = useToast();
  const contracts = useContracts();
  const { token } = useTokens();

  const [isLoading, setIsLoading] = useState(false);
  const [amountNote, setAmountNote] = useState<string>("");
  const [amountBeto, setAmountBeto] = useState<string>("");

  const mint = async () => {
    if (contracts) {
      const beto = token(ADDRESS.BETO);
      const note = token(ADDRESS.NOTE);
      const MAX = ethers.BigNumber.from(2).pow(254);
      const allowanceBeto = await beto.allowance(
        store.walletStore.address,
        ADDRESS.CHIP
      );
      if (allowanceBeto.lt(MAX)) {
        const tx = await beto.approve(ADDRESS.CHIP, MAX);
        await tx.wait();
      }
      const allowanceNote = await note.allowance(
        store.walletStore.address,
        ADDRESS.CHIP
      );
      if (allowanceNote.lt(MAX)) {
        const tx = await note.approve(ADDRESS.CHIP, MAX);
        await tx.wait();
      }
      const tx = await contracts.chip.mint(
        ethers.BigNumber.from(
          new BigNumber(amountBeto).shiftedBy(18).toFixed()
        ),
        ethers.BigNumber.from(new BigNumber(amountNote).shiftedBy(18).toFixed())
      );
      await tx.wait();
    }
  };

  return (
    <div>
      <div className="p-4 pb-0 mt-3">
        <div className="flex items-stretch">
          <div className="flex items-center">
            <img src={IMAGE["NOTE"]} alt="" className="h-6 w-6 mr-2" />
            <div className="text-sm text-white mr-2">NOTE</div>
          </div>
          <input
            type="text"
            value={amountNote}
            onChange={({ target }) => {
              setAmountNote(target.value);
            }}
            className="grow py-2 px-4 text-white bg-[#444444] outline-none text-sm"
          />
        </div>
        <div
          className="cursor-pointer text-right text-xxs mt-0.5 text-white opacity-50"
          onClick={() => {
            setAmountNote(
              store.balanceStore.getString(ADDRESS.NOTE).replaceAll(",", "")
            );
          }}
        >
          {store.balanceStore.getString(ADDRESS.NOTE)}
        </div>
      </div>
      <div className="flex justify-center">
        <AiOutlinePlus className="text-white -mt-2" />
      </div>
      <div className="px-4">
        <div className="mt-2">
          <div className="flex items-stretch">
            <div className="flex items-center">
              <img src={IMAGE["BETO"]} alt="" className="h-6 w-6 mr-2" />
              <div className="text-sm text-white mr-2">BETO</div>
            </div>
            <input
              type="text"
              value={amountBeto}
              onChange={({ target }) => {
                setAmountBeto(target.value);
              }}
              className="grow py-2 px-4 text-white bg-[#444444] outline-none text-sm"
            />
          </div>
          <div
            className="cursor-pointer text-right text-xxs mt-0.5 text-white opacity-50"
            onClick={() => {
              setAmountBeto(
                store.balanceStore.getString(ADDRESS.BETO).replaceAll(",", "")
              );
            }}
          >
            {store.balanceStore.getString(ADDRESS.BETO)}
          </div>
        </div>
        <div className="flex justify-center">
          <AiOutlineArrowDown className="w-5 h-5 text-white" />
        </div>
        <div className="flex justify-center items-center my-4">
          <img src={IMAGE["CHIP"]} alt="" className="h-6 w-6 mr-2" />
          <div className="text-md mr-2 text-green">CHIP</div>
        </div>
      </div>
      <Button
        state={isLoading ? "loading" : "active"}
        onClick={mint}
        className="grow text-black bg-white w-full py-3 mt-2 border-t border-black"
      >
        Mint
      </Button>
    </div>
  );
});

export default Mint;
