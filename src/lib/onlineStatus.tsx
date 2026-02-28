"use client";

import { createContext, useContext, useEffect, useState } from "react";

const OnlineStatusContext = createContext(true);

export function OnlineStatusProvider({ children }: { children: React.ReactNode }) {
  // Start with true on both server and client to avoid hydration mismatch.
  // Sync the actual value from navigator.onLine after mount.
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <OnlineStatusContext.Provider value={isOnline}>
      {children}
    </OnlineStatusContext.Provider>
  );
}

export function useOnlineStatus() {
  return useContext(OnlineStatusContext);
}
