import { useStore } from "hooks";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import useConnect from "hooks/useConnect";
import useGetBalances from "hooks/useGetBalances";

import { FaDiscord, FaTelegramPlane } from "react-icons/fa";
import { BsMedium, BsGithub, BsTwitter } from "react-icons/bs";
import { AiFillWarning } from "react-icons/ai";

const Header = observer(({ className }: { className?: string }) => {
  const store = useStore();
  const { getBalance } = useGetBalances();
  const { connect, disconnect } = useConnect();

  useEffect(() => {
    if (store.walletStore.address) {
      getBalance();
    }
  }, [store.walletStore.address]);

  return (
    <div className="fixed bottom-0 right-0 p-4">
      <div className="flex space-x-4">
        <a href="#" target="_blank" className="hover:opacity-50 transition-all">
          <FaDiscord />
        </a>
        <a href="#" target="_blank" className="hover:opacity-50 transition-all">
          <FaTelegramPlane />
        </a>
        <a href="#" target="_blank" className="hover:opacity-50 transition-all">
          <BsMedium />
        </a>
        <a href="#" target="_blank" className="hover:opacity-50 transition-all">
          <BsGithub />
        </a>
        <a href="#" target="_blank" className="hover:opacity-50 transition-all">
          <BsTwitter />
        </a>
      </div>
    </div>
  );

  return (
    <div
      className={`bg-[#111111] h-[3rem] border-t border-[#404040] flex items-center justify-between px-2 z-10 ${className}`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex">
          <div className="flex items-center mr-8">
            <div className="w-2 h-2 bg-green rounded-full mr-2"></div>
            <div className="text-sm">Block: 9492123</div>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red rounded-full mr-2"></div>
            <div className="text-sm">Gas: 320.83 Gwei</div>
          </div>
        </div>
        <div className="text-sm text-bold text-red ml-6 flex items-center">
          <AiFillWarning className="mr-1" />
          <span>
            WARNING: Gas is too expensive because polygon network is congested
          </span>
        </div>
        <div className="flex space-x-4">
          <a
            href="#"
            target="_blank"
            className="hover:opacity-50 transition-all"
          >
            <FaDiscord />
          </a>
          <a
            href="#"
            target="_blank"
            className="hover:opacity-50 transition-all"
          >
            <FaTelegramPlane />
          </a>
          <a
            href="#"
            target="_blank"
            className="hover:opacity-50 transition-all"
          >
            <BsMedium />
          </a>
          <a
            href="#"
            target="_blank"
            className="hover:opacity-50 transition-all"
          >
            <BsGithub />
          </a>
          <a
            href="#"
            target="_blank"
            className="hover:opacity-50 transition-all"
          >
            <BsTwitter />
          </a>
        </div>
      </div>
    </div>
  );
});

export default Header;
