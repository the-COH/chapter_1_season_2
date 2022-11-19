import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "pages/Main";
import Farm from "pages/Farm";
import Referral from "pages/Referral";
import Rank from "pages/Rank";
import Dice from "pages/Dice";
import Tokenomics from "pages/Tokenomics/Tokenomics";
import BurningDice from "pages/BurningDice";
import AirdropDice from "pages/AirdropDice";
import Gov from "pages/Gov";
import Dashboard from "pages/Dashboard";
import GovDetail from "pages/GovDetail";

import BigNumber from "bignumber.js";
import Sidebar from "components/Sidebar";
import Header from "components/Header";
import Footer from "components/Footer";
import { observer } from "mobx-react-lite";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import useContracts from "hooks/useContracts";

const fmt = {
  prefix: "",
  decimalSeparator: ".",
  groupSeparator: ",",
  groupSize: 3,
  secondaryGroupSize: 0,
  fractionGroupSeparator: " ",
  fractionGroupSize: 0,
  suffix: "",
};
BigNumber.config({ FORMAT: fmt });

function App() {
  return (
    <div className="App text-white font-light bg-[#111111]">
      <BrowserRouter>
        <div className="flex">
          <div className="grow h-screen flex flex-col">
            <Header className="basis-[4rem] shrink-0 " />
            <div className="overflow-scroll grow">
              <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/farm" element={<Farm />} />
                <Route path="/referral" element={<Referral />} />
                <Route path="/rank" element={<Rank />} />
                <Route path="/dice" element={<Dice />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/gov" element={<Gov />} />
                <Route path="/gov/:id" element={<GovDetail />} />
                <Route path="/burningdice" element={<BurningDice />} />
                <Route path="/dicedrop" element={<AirdropDice />} />
                <Route path="/tokenomics" element={<Tokenomics />} />
              </Routes>
            </div>
            <Footer className="basis-[3rem] shrink-0 " />
          </div>
        </div>
      </BrowserRouter>
      <ToastContainer className={"mt-[3rem]"} theme={"dark"} />
    </div>
  );
}

export default observer(App);
