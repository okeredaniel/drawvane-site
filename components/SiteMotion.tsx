"use client";
import { createContext, useContext, useState } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
const MotionContext = createContext({
  paused: true,
  systemReduced: false,
  toggle: () => {},
});
export function useSiteMotion() {
  return useContext(MotionContext);
}
export default function SiteMotion({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  const [manualPause, setManualPause] = useState(false);
  const paused = reduced !== false || manualPause;
  return (
    <MotionContext.Provider
      value={{
        paused,
        systemReduced: reduced === true,
        toggle: () => setManualPause((p) => !p),
      }}
    >
      <MotionConfig reducedMotion={paused ? "always" : "user"}>
        <div data-motion-paused={paused ? "true" : "false"}>{children}</div>
      </MotionConfig>
    </MotionContext.Provider>
  );
}
