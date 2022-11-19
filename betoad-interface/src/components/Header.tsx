import { useStore } from "hooks";

import { observer } from "mobx-react-lite";
import { useEffect, Fragment, useState, useCallback } from "react";

import useConnect from "hooks/useConnect";
import useGetBalances from "hooks/useGetBalances";
import useContracts from "hooks/useContracts";

import { AiOutlineDisconnect } from "react-icons/ai";
import { FiChevronDown } from "react-icons/fi";
import { AiOutlineSwap, AiOutlineUsergroupAdd } from "react-icons/ai";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { FaAward } from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";
import { Menu, Transition, Popover } from "@headlessui/react";
import { tokenInfos } from "constants/token";
import { toSummary } from "utils";
import ChipModal from "components/modals/ChipModal";

import { GiDiceFire, GiPerspectiveDiceSixFacesOne } from "react-icons/gi";

const ICONS: Record<string, any> = {
  Dice: GiPerspectiveDiceSixFacesOne,
  "Burning Dice": GiDiceFire,
};

const Header = observer(({ className }: { className?: string }) => {
  const store = useStore();
  const { getBalanceAll } = useGetBalances();
  const { connect, disconnect } = useConnect();

  const contract = useContracts();
  const location = useLocation();

  const [games, setGames] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    if (contract) {
      getGames();
    }
  }, [contract]);

  const getGames = useCallback(async () => {
    const result: any = await contract?.house.allGames();
    console.log("games", result);
    if (result) {
      setGames(result);
    }
  }, [contract]);

  useEffect(() => {
    if (store.walletStore.address) {
      getBalanceAll();
    }
  }, [store.walletStore.address]);

  return (
    <div
      className={`bg-[#111111] h-[4rem] border-b border-[#404040] flex items-center justify-between px-2 z-10 ${className}`}
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex justify-center items-center">
          <div className="leading-tight text-[1.5rem] font-dos text-green mt-1">
            BETOAD
          </div>
          {/* <span>LOGO</span> */}
        </Link>
        <div className="">
          <div className="flex items-center p-2 pl-3 mr-3 ml-8">
            <GameMenu games={games} />
            <Link
              to="/dashboard"
              className="flex justify-center items-center mr-8 text-sm text-[#6AFC5F] hover:opacity-50 transition-all focus:outline-none"
            >
              <span className="">Dashboard</span>
            </Link>
            <Link
              to="/farm"
              className="flex justify-center items-center mr-8 text-sm text-[#6AFC5F] hover:opacity-50 transition-all focus:outline-none"
            >
              <span className="">Farm</span>
            </Link>
            <Link
              to="/gov"
              className="flex justify-center items-center mr-8 text-sm text-[#6AFC5F] hover:opacity-50 transition-all focus:outline-none"
            >
              <span className="">Governance</span>
            </Link>
            <button
              onClick={() => setIsOpen(true)}
              className="flex justify-center items-center text-sm text-red hover:opacity-50 transition-all focus:outline-none"
            >
              <span className="">Chip</span>
            </button>
            {/* <EarnMenu />
          <CommunityMenu /> */}
          </div>
        </div>
        {store.walletStore.address ? (
          <div className="flex justify-end border border-[#404040]">
            <div className="border-r border-[#404040] mr-2">
              <Popover className="relative">
                {({ open }) => (
                  <>
                    <Popover.Button
                      className={
                        "flex items-center py-1.5 px-3 hover:bg-[#404040]"
                      }
                      onClick={() => {
                        getBalanceAll();
                      }}
                    >
                      <div className="text-sm mr-1">
                        {toSummary(
                          store.balanceStore
                            .get("canto")
                            ?.shiftedBy(-18)
                            .toNumber()
                        )}
                      </div>
                      <div className="text-xs">CANTO</div>
                    </Popover.Button>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="opacity-0 translate-y-1"
                      enterTo="opacity-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="opacity-100 translate-y-0"
                      leaveTo="opacity-0 translate-y-1"
                    >
                      <Popover.Panel className="absolute right-0 z-10 pl-4 py-2 transform bg-[#111111] border border-[#404040]">
                        {tokenInfos.map((token) => {
                          return (
                            <div className="flex justify-end items-baseline py-1 px-3 ">
                              <div className="basis-3/4 pr-2 text-right shrink-0">
                                {store.balanceStore.getString(token.address)}
                              </div>
                              <div className="basis-1/4 text-xs shrink-0">
                                {token.name}
                              </div>
                            </div>
                          );
                        })}
                      </Popover.Panel>
                    </Transition>
                  </>
                )}
              </Popover>
            </div>
            <div className="flex items-center py-1 pr-2">
              <div className="text-sm mr-1">{`${store.walletStore.address.slice(
                0,
                7
              )}...${store.walletStore.address.slice(-5)}`}</div>
              <div className="flex justify-center items-center">
                <button
                  className="opacity-70 hover:opacity-30 transition-all"
                  onClick={disconnect}
                >
                  <AiOutlineDisconnect className="" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-right">
            <button
              className="text-black bg-green font-medium text-sm p-2 px-4 hover:opacity-50 transition-all"
              onClick={() => connect()}
            >
              Connect Wallet
            </button>
          </div>
        )}
      </div>
      <ChipModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
});

const GameMenu = ({ games }: { games: any[] }) => {
  const location = useLocation();
  return (
    <Menu as="div" className="relative inline-block text-left mr-8">
      <div>
        <Menu.Button className="flex justify-center items-center text-sm text-[#6AFC5F] hover:opacity-50 transition-all focus:outline-none">
          <span className="mr-1">Play</span>
          <FiChevronDown />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-28 origin-top-right text-[#6AFC5F] bg-[#161616] border border-[#2d2d2d] shadow-lg focus:outline-none">
          <div className="">
            {games.map((game) => {
              const ICON = ICONS[game.name] ? ICONS[game.name] : null;
              return (
                <Menu.Item>
                  {!game.url.includes("http") ? (
                    <Link
                      key={game.name}
                      className={`py-2 px-2 hover:bg-[#2d2d2e] text-sm transition-all flex items-center ${
                        location.pathname === game.url?.toLowerCase() &&
                        "text-green"
                      }`}
                      to={"/dice"}
                    >
                      {ICON && <ICON className="h-5 w-5 mr-2" />}
                      {game.name}
                    </Link>
                  ) : (
                    <a
                      key={game.name}
                      className="block py-2 px-7 hover:bg-[#2d2d2e] text-sm"
                      href={game.url}
                      target={"_blank"}
                    >
                      {game.name}
                    </a>
                  )}
                </Menu.Item>
              );
            })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const EarnMenu = () => {
  const location = useLocation();
  return (
    <Menu as="div" className="relative inline-block text-left mr-8">
      <div>
        <Menu.Button className="flex justify-center items-center text-sm text-[#6AFC5F] hover:opacity-50 transition-all focus:outline-none">
          <span className="mr-1">Earn</span>
          <FiChevronDown />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-28 origin-top-right text-[#6AFC5F] bg-[#161616] border border-[#2d2d2d] shadow-lg focus:outline-none">
          <div className="">
            <Menu.Item>
              <Link
                className="block p-2 hover:bg-[#2d2d2e] text-sm transition-all"
                to="/farm"
              >
                <div
                  className={`flex items-center ${
                    location.pathname === "/farm" && "text-green"
                  }`}
                >
                  <RiMoneyDollarCircleLine className="mr-2 h-4 w-4" />
                  Farm
                </div>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link
                className={`block p-2 hover:bg-[#2d2d2e] text-sm transition-all ${
                  location.pathname === "/referral" && "text-green"
                }`}
                to="/referral"
              >
                <div className="flex items-center">
                  <AiOutlineUsergroupAdd className="mr-2 h-4 w-4" />
                  Referral
                </div>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link
                className={`block p-2 hover:bg-[#2d2d2e] text-sm transition-all ${
                  location.pathname === "/rank" && "text-green"
                }`}
                to="/rank"
              >
                <div className="flex items-center">
                  <FaAward className="mr-2 h-4 w-4" />
                  Rank
                </div>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link
                className={`block p-2 hover:bg-[#2d2d2e] text-sm transition-all ${
                  location.pathname === "/swap" && "text-green"
                }`}
                to="/swap"
              >
                <div className="flex items-center">
                  <AiOutlineSwap className="mr-2 h-4 w-4" />
                  Swap
                </div>
              </Link>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

const CommunityMenu = () => {
  const location = useLocation();
  return (
    <Menu as="div" className="relative inline-block text-left mr-5">
      <div>
        <Menu.Button className="flex justify-center items-center text-sm text-[#6AFC5F] hover:opacity-50 transition-all focus:outline-none">
          <span className="mr-1">Community</span>
          <FiChevronDown />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-28 origin-top-right text-[#6AFC5F] bg-[#161616] border border-[#2d2d2d] shadow-lg focus:outline-none">
          <div className="">
            <Menu.Item>
              <Link
                className="block p-2 hover:bg-[#2d2d2e] text-sm transition-all"
                to="/farm"
              >
                <div
                  className={`flex items-center ${
                    location.pathname === "/farm" && "text-green"
                  }`}
                >
                  <RiMoneyDollarCircleLine className="mr-2 h-4 w-4" />
                  Farm
                </div>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link
                className={`block p-2 hover:bg-[#2d2d2e] text-sm transition-all ${
                  location.pathname === "/referral" && "text-green"
                }`}
                to="/referral"
              >
                <div className="flex items-center">
                  <AiOutlineUsergroupAdd className="mr-2 h-4 w-4" />
                  Referral
                </div>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link
                className={`block p-2 hover:bg-[#2d2d2e] text-sm transition-all ${
                  location.pathname === "/rank" && "text-green"
                }`}
                to="/rank"
              >
                <div className="flex items-center">
                  <FaAward className="mr-2 h-4 w-4" />
                  Rank
                </div>
              </Link>
            </Menu.Item>
            <Menu.Item>
              <Link
                className={`block p-2 hover:bg-[#2d2d2e] text-sm transition-all ${
                  location.pathname === "/swap" && "text-green"
                }`}
                to="/swap"
              >
                <div className="flex items-center">
                  <AiOutlineSwap className="mr-2 h-4 w-4" />
                  Swap
                </div>
              </Link>
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Header;
