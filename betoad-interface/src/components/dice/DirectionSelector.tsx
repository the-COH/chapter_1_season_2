export default function DirectionSelector({
  direction,
  onChange,
  disabled,
}: {
  direction: boolean;
  onChange: (value: boolean) => void;
  disabled: boolean;
}) {
  return (
    <div
      className={`flex mt-0.5 overflow-hidden ${
        disabled && "pointer-events-none"
      }`}
    >
      <button
        onClick={() => onChange(false)}
        className={`basis-1/2 py-3 px-5 last:border-none text-sm mr-0.5 ${
          !direction
            ? "bg-[#323232]"
            : "text-[#7c7c7c] bg-[#171717] hover:text-white transition-all"
        }`}
      >
        UNDER
      </button>
      <button
        onClick={() => onChange(true)}
        className={`basis-1/2 py-3 px-5 last:border-none text-sm ${
          direction
            ? "bg-[#323232]"
            : "text-[#7c7c7c] bg-[#171717] hover:text-white transition-all"
        }`}
      >
        OVER
      </button>
    </div>
  );
}
