"use client";

import { useEffect, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";

type LiveStatProps = {
  value: string | number;
  label: string;
};

export function LiveStat({ value, label }: LiveStatProps) {
  const reduceMotion = useReducedMotion();
  const isNumber = typeof value === "number";
  const [display, setDisplay] = useState<string | number>(
    isNumber ? 0 : value
  );

  useEffect(() => {
    if (!isNumber) {
      setDisplay(value);
      return;
    }
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, value, {
      duration: 1,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value, isNumber, reduceMotion]);

  return (
    <div className="chip">
      <div className="n serif">{display}</div>
      <div className="l">{label}</div>
    </div>
  );
}
