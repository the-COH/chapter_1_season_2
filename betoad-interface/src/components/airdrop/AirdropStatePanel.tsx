const AirdropStatePanel = ({ airdropInfo }: { airdropInfo: any }) => {
  return (
    <div className="flex p-6 bg-[#222222] rounded-lg">
      <div className="basis-1/4 grow shrink mx-6">
        <div className="text-xs text-[#999999] whitespace-nowrap">
          Airdrop Tutorial
        </div>
        <div className="flex items-baseline">
          {/* <div className="mr-1 text-sm">LEVEL </div> */}
          <div className="text-2xl whitespace-nowrap">
            {airdropInfo?.level > 3 ? "CLEAR" : `LEVEL ${airdropInfo.level}`}
          </div>
        </div>
      </div>
      <div className="basis-1/4 grow shrink mx-6">
        <div className="text-xs text-[#999999] whitespace-nowrap">
          Can Use Amount
        </div>
        <div className="flex items-baseline">
          <div className="text-2xl whitespace-nowrap">
            {airdropInfo.amount.shiftedBy(-6).decimalPlaces(2, 1).toFormat()}
          </div>
          <div className="ml-1 text-sm">BETO</div>
        </div>
      </div>
      <div className="basis-1/4 grow shrink mx-6">
        <div className="text-xs text-[#999999] whitespace-nowrap">
          WIN AMOUNT
        </div>
        <div className="flex items-baseline text-emerald-500">
          <div className="text-2xl whitespace-nowrap">
            {airdropInfo.win_amount
              .shiftedBy(-6)
              .decimalPlaces(2, 1)
              .toFormat()}
          </div>
          <div className="ml-1 text-sm">BETO</div>
        </div>
      </div>
      <div className="basis-1/4 grow shrink mx-6">
        <div className="text-xs text-[#999999] whitespace-nowrap">
          LOSE AMOUNT
        </div>
        <div className="flex items-baseline text-rose-400">
          <div className="text-2xl whitespace-nowrap">
            {airdropInfo.lose_amount
              .shiftedBy(-6)
              .decimalPlaces(2, 1)
              .toFormat()}
          </div>
          <div className="ml-1 text-sm">BETO</div>
        </div>
      </div>
    </div>
  );
};

export default AirdropStatePanel;
