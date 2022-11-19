import { Link, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useStore } from "hooks";
import { useEffect, useMemo, useState } from "react";
import { Proposal } from "types/gov";
import VotingBar from "components/VotingBar";
import BigNumber from "bignumber.js";

import { observer } from "mobx-react-lite";
import { toProposal } from "utils/converter";
import { addressToContract } from "utils/contracts";

const GovDetail = () => {
  const store = useStore();
  const params = useParams();
  const [myVote, setMyVote] = useState<any>(null);
  const [blockHeight, setBlockHeight] = useState(0);

  const id = useMemo(() => {
    if (params.id) {
      return parseInt(params.id);
    } else {
      return -1;
    }
  }, [params]);

  useEffect(() => {
    // store.lcd.tendermint
    //   .blockInfo()
    //   .then((result) => setBlockHeight(parseInt(result.block.header.height)));
    // store.govStore.cacheLoadState();
  }, []);

  useEffect(() => {
    getMyVote();
  }, [params]);

  const reloadProposal = async () => {
    // if (store.govStore.proposalMap[id]) {
    //   const result: any = await wasm.query("gov", {
    //     proposal: {
    //       proposal_status: store.govStore.proposalMap[id].status,
    //       proposal_id: id,
    //     },
    //   });
    //   store.govStore.proposalMap[id] = toProposal(result);
    // }
  };

  const getMyVote = async () => {
    // const vote = await wasm.query("gov", {
    //   vote: {
    //     proposal_id: id,
    //     address: store.walletStore.address,
    //   },
    // });
    // console.log("vote", vote);
    // setMyVote(vote);
  };

  const castVote = async (type: string) => {
    // try {
    //   await wasm.execute("gov", {
    //     cast_vote: {
    //       proposal_id: id,
    //       vote: type,
    //     },
    //   });
    // } catch (e) {
    //   console.log(e);
    // }
    // await getMyVote();
    // await reloadProposal();
  };

  const endProposal = async () => {
    // try {
    //   await wasm.execute("gov", {
    //     end_proposal: {
    //       proposal_id: id,
    //     },
    //   });
    // } catch (e) {
    //   console.log(e);
    // }
    // await reloadProposal();
  };

  const executeProposal = async () => {
    // try {
    //   await wasm.execute("gov", {
    //     execute_proposal: {
    //       proposal_id: id,
    //     },
    //   });
    // } catch (e) {
    //   console.log(e);
    // }
    // await reloadProposal();
  };

  const percent = useMemo(() => {
    if (store.govStore.proposalMap[id]) {
      const yes = store.govStore.proposalMap[id].snapshot_amount.isZero()
        ? "0"
        : store.govStore.proposalMap[id].yes_votes
            .div(store.govStore.proposalMap[id].snapshot_amount)
            .decimalPlaces(2, 1)
            .shiftedBy(2)
            .toString();

      const no = store.govStore.proposalMap[id].snapshot_amount.isZero()
        ? "0"
        : store.govStore.proposalMap[id].no_votes
            .div(store.govStore.proposalMap[id].snapshot_amount)
            .decimalPlaces(2, 1)
            .shiftedBy(2)
            .toString();
      const total = store.govStore.proposalMap[id].snapshot_amount.isZero()
        ? "0"
        : store.govStore.proposalMap[id].total_votes
            .div(store.govStore.proposalMap[id].snapshot_amount)
            .decimalPlaces(2, 1)
            .shiftedBy(2)
            .toString();
      return {
        yes,
        no,
        total,
      };
    } else {
      return {};
    }
  }, [store.govStore.proposalMap[id]]);

  if (!store.govStore.proposalMap[id]) return null;

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="flex justify-between items-center">
        <div className="text-lg mb-4">Proposal Detail</div>
        <div className="">
          {store.govStore.proposalMap[id].status === "in_progress" &&
            blockHeight > store.govStore.proposalMap[id].end_height && (
              <button
                className={`bg-transparent text-white font-bold text-sm mb-2 p-3 rounded-lg hover:opacity-50 transition-all mr-3 bg-[#444444]`}
                onClick={endProposal}
              >
                End Proposal
              </button>
            )}
          {store.govStore.proposalMap[id].status === "passed" &&
            blockHeight >
              store.govStore.proposalMap[id].end_height +
                store.govStore.proposalMap[id].timelock_period && (
              <button
                className={`bg-transparent text-white font-bold text-sm mb-2 p-3 rounded-lg hover:opacity-50 transition-all mr-3 bg-[#444444]`}
                onClick={executeProposal}
              >
                Execute Proposal
              </button>
            )}
        </div>
      </div>
      <div className="bg-[#2d2d2e] border-b border-[#1c1c1c] px-8 py-5 rounded-lg transition-all">
        <div className="flex justify-start items-center">
          <div className="basis-40">Id</div>
          <div className="">{store.govStore.proposalMap[id].id}</div>
        </div>
        <div className="flex justify-start items-center mt-2">
          <div className="basis-40">Creator</div>
          <div className="">{store.govStore.proposalMap[id].creator}</div>
        </div>
        <div className="flex justify-start items-center mt-2">
          <div className="basis-40">Status</div>
          <div className="">{store.govStore.proposalMap[id].status}</div>
        </div>
        <div className="flex justify-start items-center mt-2">
          <div className="basis-40">Start Height</div>
          <div className="">{store.govStore.proposalMap[id].start_height}</div>
        </div>
        <div className="flex justify-start items-center mt-2">
          <div className="basis-40">End Height</div>
          <div className="">{store.govStore.proposalMap[id].end_height}</div>
        </div>
        <div className="flex justify-start items-center mt-2">
          <div className="basis-40">Execute Height</div>
          <div className="">
            {store.govStore.proposalMap[id].end_height +
              store.govStore.proposalMap[id].timelock_period}
          </div>
        </div>
        <div className="flex justify-start items-start mt-2">
          <div className="basis-40">Execute Msgs</div>
          <div className="">
            {store.govStore.proposalMap[id].execute_data.map((data) => {
              return (
                <div className="flex items-center overflow-hidden">
                  <div className="mr-4">{addressToContract(data.contract)}</div>
                  <div className="text-ellipsis">
                    {Buffer.from(data.msg, "base64").toString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {store.govStore.proposalMap[id].link && (
          <div className="flex justify-start items-center mt-2">
            <div className="basis-40">Link</div>
            <div className="">{store.govStore.proposalMap[id].link}</div>
          </div>
        )}
        <div className="flex justify-start items-center mt-8">
          <div className="basis-40">Title</div>
          <div className="">{store.govStore.proposalMap[id].title}</div>
        </div>
        <div className="mt-4 p-6 bg-[#242424] rounded-lg min-h-[15rem]">
          <ReactMarkdown
            className="prose MEDIUM dark:text-[rgba(255,255,255,0.7)] max-w-none prose-a:text-black dark:prose-a:text-white"
            remarkPlugins={[remarkGfm]}
          >
            {store.govStore.proposalMap[id].description}
          </ReactMarkdown>
        </div>
        <div className="mt-8">
          <div className="flex justify-between">
            <div className="flex items-baseline">
              <div className="mr-1 flex items-center">
                <div className="mr-1">Total:</div>
                <div className="">
                  {store.govStore.proposalMap[id].total_votes
                    .shiftedBy(-6)
                    .decimalPlaces(2, 1)
                    .toFormat()}
                </div>
              </div>
              <div className="text-xs">BETO</div>
            </div>
            <div className="flex items-baseline">
              <div className="mr-6">Current Voting: {percent.total}%</div>
              <div className="">
                Quorum:{" "}
                {new BigNumber(store.govStore.state?.quorum || 0)
                  .shiftedBy(2)
                  .toString()}
                %
              </div>
            </div>
          </div>
          <div className="mt-5 mb-2">
            <VotingBar proposal={store.govStore.proposalMap[id]} />
          </div>
          <div className="flex items-center mt-3">
            <div className="w-3 h-3 bg-emerald-500 mr-2"></div>
            <div className="mr-2 flex items-center">
              <div className="mr-1">YES:</div>
              <div className="">
                {store.govStore.proposalMap[id].yes_votes
                  .shiftedBy(-6)
                  .decimalPlaces(2, 1)
                  .toFormat()}
              </div>
            </div>
            <div className="mr-10">({percent.yes}%)</div>
            <div className="w-3 h-3 bg-rose-400 mr-2"></div>
            <div className="mr-2 flex items-center">
              <div className="mr-1">NO:</div>
              <div className="">
                {store.govStore.proposalMap[id].no_votes
                  .shiftedBy(-6)
                  .decimalPlaces(2, 1)
                  .toFormat()}
              </div>
            </div>
            <div className="">({percent.no}%)</div>
          </div>
          {store.govStore.proposalMap[id].status === "in_progress" && (
            <div className="flex justify-center items-center mt-4">
              <button
                className={`bg-transparent text-white font-bold text-sm p-2 py-3 w-40 rounded-lg hover:opacity-50 transition-all mr-3 ${
                  myVote?.vote === "yes" && "pointer-events-none"
                } ${myVote?.vote === "no" ? "bg-[#444444]" : "bg-emerald-500"}`}
                onClick={() => {
                  castVote("yes");
                }}
              >
                {myVote?.vote === "yes" ? "Voted: YES" : "YES"}
              </button>
              <button
                className={`bg-transparent text-white bg-rose-400 font-bold text-sm p-2 w-40 py-3 rounded-lg hover:opacity-50 transition-all ${
                  myVote?.vote === "no" && "pointer-events-none"
                } ${myVote?.vote === "yes" ? "bg-[#444444]" : "bg-rose-400"}`}
                onClick={() => {
                  castVote("no");
                }}
              >
                {myVote?.vote === "no" ? "Voted: NO" : "NO"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default observer(GovDetail);
