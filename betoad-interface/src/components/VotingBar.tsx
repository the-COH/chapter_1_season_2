import { Proposal } from "types/gov";

const VotingBar = ({ proposal }: { proposal: Proposal }) => {
  const yesWitdh = proposal.total_votes.isZero()
    ? "0"
    : proposal.yes_votes
        .div(proposal.snapshot_amount)
        .decimalPlaces(2, 1)
        .shiftedBy(2)
        .toString();

  const noWitdh = proposal.total_votes.isZero()
    ? "0"
    : proposal.no_votes
        .div(proposal.snapshot_amount)
        .decimalPlaces(2, 1)
        .shiftedBy(2)
        .toString();

  return (
    <div className="relative flex items-center">
      <div className="w-full h-5 absolute top-0 bg-[#afafaf]"></div>
      <div
        className={`h-5 bg-emerald-500 relative`}
        style={{ width: `${yesWitdh}%` }}
      ></div>
      <div
        className="h-5 bg-rose-400 relative"
        style={{ width: `${noWitdh}%` }}
      ></div>
    </div>
  );
};

export default VotingBar;
