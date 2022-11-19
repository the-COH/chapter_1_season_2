import { useEffect, useRef, useState } from "react";

interface ButtonProps {
  rollRef: any;
}

type RollStatus = "READY" | "ROLLING" | "STOP";

const RollNumber = ({ rollRef }: ButtonProps) => {
  const [displayNumber, setDisplayNumber] = useState(0);
  const [result, setResult] = useState({
    luckyNumber: 0,
    isWin: false,
  });
  const [status, setStatus] = useState<RollStatus>("READY");

  const interval = useRef<any>(null);

  const start = () => {
    setStatus("ROLLING");
    interval.current = setInterval(() => {
      setDisplayNumber((prev) => (prev + 1) % 100);
    }, 10);
  };

  const stop = async (value?: number, isWin?: boolean) =>
    new Promise((resolve, reject) => {
      try {
        if (interval.current) {
          clearInterval(interval.current);
          if (!value || isWin === null || isWin === undefined) {
            // _stop(value, isWin);
            resolve(true);
          } else {
            interval.current = setInterval(() => {
              setDisplayNumber((prev) => {
                const current = (prev + 1) % 100;
                if (value === current) {
                  clearInterval(interval.current);
                  _stop(value, isWin);
                  resolve(true);
                }
                return current;
              });
            }, 10);
          }
        }
      } catch (e) {
        reject(e);
      }
    });

  useEffect(() => {
    rollRef.current = {
      start,
      stop,
    };
  }, []);

  const _stop = (value: number, isWin: boolean) => {
    setStatus("STOP");
    setResult({
      luckyNumber: value,
      isWin,
    });
    setDisplayNumber(value);
  };

  return (
    <div
      className={`${
        status === "STOP" &&
        (result.isWin === true ? "text-emerald-400" : "text-rose-500")
      }`}
    >
      {displayNumber}
    </div>
  );
};

export default RollNumber;
