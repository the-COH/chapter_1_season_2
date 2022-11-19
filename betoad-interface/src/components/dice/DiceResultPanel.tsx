export default function DiceResultPanel({
  winChance,
  rate,
  payout,
}: {
  winChance: number;
  rate: number;
  payout: number;
}) {
  return (
    <div className="flex mt-2">
      <div className="basis-1/3 p-2 text-center bg-[#171717] shrink-0 grow-0">
        <div className="text-xxs text-[#999999]">Win Chance</div>
        <div className="flex items-baseline justify-center text-white">
          <div className="text-xl mr-1">{winChance}</div>
          <div className="text-xs">%</div>
        </div>
      </div>
      <div className="basis-1/3 p-2 text-center bg-[#171717] shrink-0 grow-0">
        <div className="text-xxs text-[#999999]">Rate</div>
        <div className="flex items-baseline justify-center text-white">
          <div className="text-xs">X</div>
          <div className="text-xl mr-1">{rate}</div>
        </div>
      </div>
      <div className="basis-1/3 p-2 text-center bg-[#171717] shrink-0 grow-0 overflow-hidden">
        <div className="text-xxs text-[#999999]">Payout</div>
        <div className="flex items-baseline justify-center text-white">
          <div className="text-xl overflow-hidden">{payout}</div>
        </div>
      </div>
    </div>
  );
}
