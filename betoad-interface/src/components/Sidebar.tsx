import React, { useCallback, useState } from "react";
import bg from "assets/images/bg.png";
import bh from "assets/images/blackhole.jpg";
import ReactFullpage from "@fullpage/react-fullpage";
import { CgFileDocument } from "react-icons/cg";
import {
  AiOutlineTwitter,
  AiFillMediumCircle,
  AiOutlineSwap,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import { SiGitbook } from "react-icons/si";
import { RiMoneyDollarCircleLine, RiGovernmentLine } from "react-icons/ri";
import { GrDocumentText } from "react-icons/gr";

import { FaDiscord, FaTelegramPlane, FaAward } from "react-icons/fa";
import logo from "assets/images/logo.svg";
import { Link, useLocation } from "react-router-dom";
import { useStore } from "hooks";

import { observer } from "mobx-react-lite";
import { useEffect } from "react";

import {
  GiDiceFire,
  GiPerspectiveDiceSixFacesOne,
  GiReceiveMoney,
} from "react-icons/gi";
import useContracts from "hooks/useContracts";

const ICONS: Record<string, any> = {
  Dice: GiPerspectiveDiceSixFacesOne,
  "Burning Dice": GiDiceFire,
};

const Sidebar = observer(() => {
  const store = useStore();
  const contract = useContracts();
  const location = useLocation();

  const [games, setGames] = useState<any[]>([]);

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

  return (
    <div className="w-52 h-screen bg-[#24242488] flex flex-col font-medium border-r border-black z-10">
      <Link
        to="/"
        className="flex justify-center items-center border-b border-black h-[4rem]"
      >
        <img src={logo} className="App-logo h-[2.5rem] z-10" alt="logo" />
      </Link>
      <div className="grow flex flex-col overflow-y-scroll">
        <div className="mt-6">
          <div className="mx-5 text-xs text-gray-400 font-bold mb-3 ">Game</div>
          {/* <Link
            key={"airdrop"}
            className={`flex py-2 px-7 hover:bg-[#2d2d2e] text-sm transition-all ${
              location.pathname === "/dicedrop".toLowerCase() && "text-green"
            }`}
            to={"/dicedrop"}
          >
            <GiReceiveMoney className="h-5 w-5 mr-2" />
            Dicedrop
          </Link> */}
          {games.map((game) => {
            const ICON = ICONS[game.name] ? ICONS[game.name] : null;
            return !game.url.includes("http") ? (
              <Link
                key={game.name}
                className={`py-2 px-7 hover:bg-[#2d2d2e] text-sm transition-all flex items-center ${
                  location.pathname === game.url?.toLowerCase() && "text-green"
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
            );
          })}
        </div>
        <div className="mt-10">
          <div className="mx-5 text-xs text-gray-400 font-bold mb-3">Earn</div>
          <Link
            className="block py-2 px-7 hover:bg-[#2d2d2e] text-sm transition-all"
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
          <Link
            className={`block py-2 px-7 hover:bg-[#2d2d2e] text-sm transition-all ${
              location.pathname === "/referral" && "text-green"
            }`}
            to="/referral"
          >
            <div className="flex items-center">
              <AiOutlineUsergroupAdd className="mr-2 h-4 w-4" />
              Referral
            </div>
          </Link>
          <Link
            className={`block py-2 px-7 hover:bg-[#2d2d2e] text-sm transition-all ${
              location.pathname === "/rank" && "text-green"
            }`}
            to="/rank"
          >
            <div className="flex items-center">
              <FaAward className="mr-2 h-4 w-4" />
              Rank
            </div>
          </Link>
          <Link
            className={`block py-2 px-7 hover:bg-[#2d2d2e] text-sm transition-all ${
              location.pathname === "/swap" && "text-green"
            }`}
            to="/swap"
          >
            <div className="flex items-center">
              <AiOutlineSwap className="mr-2 h-4 w-4" />
              Swap
            </div>
          </Link>
        </div>
        <div className="mt-10">
          <div className="mx-5 text-xs text-gray-400 font-bold mb-3">Token</div>
          <Link
            className={`block py-2 px-7 hover:bg-[#2d2d2e] text-sm transition-all ${
              location.pathname.includes("/gov") && "text-green"
            }`}
            to="/gov"
          >
            <div className="flex items-center">
              <RiGovernmentLine className="mr-2 h-4 w-4" />
              Govornance
            </div>
          </Link>
          <div className="py-2 px-7 hover:bg-[#2d2d2e] text-sm transition-all">
            <div className="flex items-center">
              <CgFileDocument className="mr-2 h-4 w-4" />
              Docs
            </div>
          </div>
        </div>
        <div className="grow text-right">
          <div className="flex flex-col grow items-center justify-end h-full">
            <button className="bg-green px-4 py-2 rounded-full mb-4">
              TESTNET
            </button>
          </div>
        </div>
        <div className="flex text-white px-7 pt-4 pb-6 border-t border-black">
          <button>
            <SiGitbook className="w-5 h-5 mr-4 text-gray-500" />
          </button>
          <button>
            <AiOutlineTwitter className="w-5 h-5 mr-4 text-gray-500" />
          </button>
          <button>
            <FaTelegramPlane className="w-5 h-5 mr-4 text-gray-500" />
          </button>
          <button>
            <AiFillMediumCircle className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
});

export default Sidebar;
