import { useState } from "react";
// import './Ranger.css';
import { Range, getTrackBackground } from "react-range";

export default function Ranger({
  value = 0,
  disabled = false,
  colors,
  onChange,
}: {
  value: number;
  disabled?: boolean;
  colors: [string, string];
  onChange: (value: number) => void;
}) {
  return (
    <Range
      step={1}
      min={0}
      max={100}
      disabled={disabled}
      values={[value]}
      onChange={(values) => onChange(values[0])}
      renderTrack={({ props, children }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: 10,
            // borderRadius: 20,
            width: "100%",
            background: getTrackBackground({
              values: [value],
              colors: colors,
              min: 0,
              max: 100,
            }),
          }}
        >
          {children}
        </div>
      )}
      renderThumb={({ props }) => (
        <div
          {...props}
          style={{
            ...props.style,
            height: 28,
            width: 28,
            borderRadius: 20,
            backgroundColor: "white",
          }}
          className="text-sm text-black flex items-center justify-center"
        >
          {value}
        </div>
      )}
    />
  );
}
