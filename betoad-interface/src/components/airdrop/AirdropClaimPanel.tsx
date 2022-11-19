import Button from "components/button/Button";

const AirdropClaimPanel = ({
  airdropInfo,
  prove,
}: {
  airdropInfo: any;
  prove: () => void;
}) => {
  return (
    <div className="flex p-6 bg-[#222222] rounded-lg">
      <div className="basis-1/3 grow shrink mx-6">
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
        <Button state={"active"} onClick={prove}>
          Claim
        </Button>
      </div>
    </div>
  );
};

export default AirdropClaimPanel;
