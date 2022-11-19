import { useEffect, useRef, useState } from "react";

const PingNumber = ({ pingRef }: { pingRef: any }) => {
  const [status, setStatus] = useState<any>(null);

  const ping = (text: string, isWin: boolean) => {
    setStatus({
      text,
      isWin,
    });
    setTimeout(() => {
      setStatus(null);
    }, 1000);
  };

  useEffect(() => {
    pingRef.current = {
      ping,
    };
  }, []);

  return (
    <div
      className={`font-black text-lg absolute bottom-2 ${
        status?.isWin ? "text-emerald-400" : "text-rose-500"
      } ${status ? "animate-[wave_1s]" : "opacity-0"}`}
    >
      {status && `${status.isWin ? "+" : "-"}${status.text}`}
    </div>
  );
};

export default PingNumber;
