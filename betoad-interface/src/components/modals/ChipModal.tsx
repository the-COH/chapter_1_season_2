import BaseModal from "./BaseModal";
import { useEffect, useMemo, useState } from "react";
import { Tab } from "@headlessui/react";

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

import MintPanel from "components/swap/Mint";
import BurnPanel from "components/swap/Burn";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const ChipModal = observer(({ isOpen, onClose, className }: BaseModalProps) => {
  const [balance, setBalance] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const _onClose = () => {
    setBalance("");
    onClose();
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={isLoading ? () => {} : _onClose}
      title={"Chip"}
      className="max-w-sm"
    >
      <Tab.Group>
        <Tab.List className="flex justify-around mb-1 bg-[#2d2d2e] overflow-hidden mt-4">
          {["Mint", "Burn"].map((item) => (
            <Tab
              className={({ selected }) =>
                `basis-1/2 py-3 border-r-2 border-[#1c1c1c] last:border-0 text-white text-xs ${
                  selected
                    ? "bg-[#2d2d2e]"
                    : "text-[#7c7c7c] bg-[#242424] hover:text-white transition-all"
                }`
              }
            >
              {item}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className={`bg-[#2d2d2e]`}>
          <Tab.Panel>
            <MintPanel />
          </Tab.Panel>
          <Tab.Panel>
            <BurnPanel />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </BaseModal>
  );
});

export default ChipModal;
