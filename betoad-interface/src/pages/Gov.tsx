import { AiOutlinePlusCircle } from "react-icons/ai";
import IMAGE from "constants/images";
import { Tab } from "@headlessui/react";
import { Link } from "react-router-dom";

import { useEffect, useState } from "react";
import { toProposal } from "utils/converter";
import { Proposal } from "types/gov";
import VotingBar from "components/VotingBar";
import { useStore } from "hooks";

const Gov = () => {
  const store = useStore();

  useEffect(() => {
    store.govStore.cacheLoadState();
  }, []);

  return (
    <div className="max-w-5xl mx-auto w-full p-6">
      <Tab.Group>
        <div className="flex justify-between items-center">
          <div className="font-dos text-xl text-green">Governance</div>
          <Tab.List className="flex justify-around mb-1 bg-[#2d2d2e] overflow-hidden">
            {["InProgress", "Passed", "Executed", "Rejected"].map((item) => (
              <Tab
                key={item}
                className={({ selected }) =>
                  `basis-1/2 py-3 px-5 border-r-2 border-[#1c1c1c] last:border-none text-sm ${
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
        </div>
        <Tab.Panels className={`bg-[#2d2d2e]`}>
          <Tab.Panel key={"inprogress"}>
            <InProgressPanel />
          </Tab.Panel>
          <Tab.Panel key={"passed"}>
            <OtherPanel type={"passed"} />
          </Tab.Panel>
          <Tab.Panel key={"executed"}>
            <OtherPanel type={"executed"} />
          </Tab.Panel>
          <Tab.Panel key={"rejected"}>
            <OtherPanel type={"rejected"} />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

const InProgressPanel = () => {
  const [proposals, setProposals] = useState<any>([]);
  const store = useStore();

  useEffect(() => {
    getProposals();
  }, []);

  const getProposals = async () => {
    // const result: any[] = await wasm.query("gov", {
    //   proposals: {
    //     proposal_status: "in_progress",
    //     start_after: null,
    //     limit: null,
    //   },
    // });
    // console.log("InProgressPanel getProposals", result);
    // if (result) {
    //   const _proposals = toProposal(result);
    //   setProposals(_proposals);
    //   store.govStore.saveProposals(_proposals);
    // }
  };

  return (
    <div>
      <div className="mt-4 bg-[#242424] text-[#a4a4a4] py-4 px-8 flex items-center text-sm border-b border-[#1c1c1c]">
        <div className="basis-[10%]">No</div>
        <div className="basis-[60%]">Content</div>
        <div className="basis-[15%] text-right">Start Height</div>
        <div className="basis-[15%] text-right">End Height</div>
      </div>
      <div className="">
        {proposals.length <= 0 && (
          <div className="bg-[#262626] min-h-[20rem] flex justify-center items-center opacity-50 text-2xl">
            No Proposals found.
          </div>
        )}
        {proposals.map((proposal: Proposal) => {
          return (
            <Link
              key={proposal.id}
              to={`/gov/${proposal.id}`}
              className="block bg-[#2d2d2e] hover:bg-[#3d3d3e] border-b border-[#1c1c1c] px-8 py-5 last:rounded-b-lg transition-all"
            >
              <div className="flex items-center">
                <div className="basis-[10%] flex items-center text-[#afafaf]">
                  #{proposal.id}
                </div>
                <div className="basis-[60%] overflow-hidden">
                  <div className="text-xl">{proposal.title}</div>
                  <div className="text-xs text-[#afafaf] whitespace-nowrap text-ellipsis overflow-hidden">
                    {proposal.description.slice(0, 200)}
                  </div>
                </div>
                <div className="basis-[15%] text-right text-[#afafaf]">
                  {proposal.end_height}
                </div>
                <div className="basis-[15%] text-right text-[#afafaf]">
                  {proposal.end_height}
                </div>
              </div>
              <div className="mt-5 mb-2">
                <VotingBar proposal={proposal} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const OtherPanel = ({ type }: { type: string }) => {
  const [proposals, setProposals] = useState<any>([]);
  const store = useStore();

  useEffect(() => {
    getProposals();
  }, []);

  const getProposals = async () => {
    // const result: any[] = await wasm.query("gov", {
    //   proposals: {
    //     proposal_status: type,
    //     start_after: null,
    //     limit: null,
    //   },
    // });
    // if (result) {
    //   const _proposals = toProposal(result);
    //   setProposals(_proposals);
    //   store.govStore.saveProposals(_proposals);
    // }
  };
  return (
    <div>
      <div className="mt-4 bg-[#242424] text-[#a4a4a4] py-4 px-8 flex items-center text-sm border-b border-[#1c1c1c]">
        <div className="basis-[10%]">No</div>
        <div className="basis-[60%]">Content</div>
        <div className="basis-[15%] text-right">Start Height</div>
        <div className="basis-[15%] text-right">End Height</div>
      </div>
      <div className="">
        {proposals.length <= 0 && (
          <div className="bg-[#262626] min-h-[20rem] flex justify-center items-center opacity-50 text-2xl">
            No Proposals found.
          </div>
        )}
        {proposals.map((proposal: Proposal) => {
          return (
            <Link
              key={proposal.id}
              to={`/gov/${proposal.id}`}
              className="block bg-[#2d2d2e] hover:bg-[#3d3d3e] border-b border-[#1c1c1c] px-8 py-5 last:rounded-b-lg transition-all"
            >
              <div className="flex items-center">
                <div className="basis-[10%] flex items-center text-[#afafaf]">
                  #{proposal.id}
                </div>
                <div className="basis-[60%] overflow-hidden">
                  <div className="text-xl">{proposal.title}</div>
                  <div className="text-xs text-[#afafaf] whitespace-nowrap text-ellipsis overflow-hidden">
                    {proposal.description}
                  </div>
                </div>
                <div className="basis-[15%] text-right text-[#afafaf]">
                  {proposal.start_height}
                </div>
                <div className="basis-[15%] text-right text-[#afafaf]">
                  {proposal.end_height}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Gov;
