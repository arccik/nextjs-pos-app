"use client";

import { useOnlineStatus } from "@/lib/onlineStatus";
import { usePendingSyncCount } from "@/hooks/useLocalData";
import { WifiOff, RefreshCw } from "lucide-react";

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const pending = usePendingSyncCount();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-2 bg-amber-500 px-4 py-2 text-sm font-medium text-white sm:left-20">
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>
        Offline mode{pending > 0 ? ` · ${pending} action${pending !== 1 ? "s" : ""} queued` : ""}
      </span>
      <RefreshCw className="h-3.5 w-3.5 animate-spin opacity-60" />
    </div>
  );
}
