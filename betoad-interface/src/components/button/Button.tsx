interface ButtonProps {
  state?: "loading" | "active" | "disabled";
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
  disabledText?: string;
}

const Button = ({
  state = "active",
  className,
  onClick,
  children,
}: ButtonProps) => {
  return (
    <button
      className={`grow text-black bg-white text-sm py-3 px-4 transition-all ${
        state === "active" && "hover:bg-[#cccccc]"
      } ${state === "disabled" && "bg-[#ffffff75]"} ${className}`}
      disabled={state === "disabled" || state === "loading"}
      onClick={onClick}
    >
      {state === "loading" ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-t-[3px] rounded-full border-black animate-spin"></div>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
