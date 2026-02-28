"use client";

import { createContext, useContext } from "react";
import useNavMode, { type NavMode } from "@/hooks/useNavMode";
import SideBar from "./SideBar";
import TouchNav from "./TouchNav";

type NavModeCtx = {
  mode: NavMode;
  setMode: (mode: NavMode) => void;
};

const NavModeContext = createContext<NavModeCtx>({
  mode: "sidebar",
  setMode: () => undefined,
});

export function useNavModeCtx() {
  return useContext(NavModeContext);
}

export default function NavModeWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mode, setMode] = useNavMode();

  return (
    <NavModeContext.Provider value={{ mode, setMode }}>
      {mode === "touch" ? <TouchNav /> : <SideBar />}
      <div className={mode === "touch" ? "pb-20" : "sm:ml-20"}>
        {children}
      </div>
    </NavModeContext.Provider>
  );
}
