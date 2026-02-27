import { cn } from "@/lib/utils";
import { AlertTriangle, Notebook, Users } from "lucide-react";
import { type TableWithReservation } from "@/server/db/schemas";

type TableButtonProps = {
  tableData: TableWithReservation;
};

export type StatusCfg = {
  accent: string;
  bg: string;
  badgeDot: string;
  badgeText: string;
  badgeBg: string;
};

export const statusConfig: Record<"available" | "occupied" | "reserved" | "closed", StatusCfg> = {
  available: {
    accent: "border-l-green-500",
    bg: "bg-green-50/40 dark:bg-green-950/20",
    badgeDot: "bg-green-500",
    badgeText: "text-green-700 dark:text-green-400",
    badgeBg: "bg-green-100 dark:bg-green-900/40",
  },
  occupied: {
    accent: "border-l-amber-500",
    bg: "bg-amber-50/40 dark:bg-amber-950/20",
    badgeDot: "bg-amber-500",
    badgeText: "text-amber-700 dark:text-amber-400",
    badgeBg: "bg-amber-100 dark:bg-amber-900/40",
  },
  reserved: {
    accent: "border-l-blue-500",
    bg: "bg-blue-50/40 dark:bg-blue-950/20",
    badgeDot: "bg-blue-500",
    badgeText: "text-blue-700 dark:text-blue-400",
    badgeBg: "bg-blue-100 dark:bg-blue-900/40",
  },
  closed: {
    accent: "border-l-gray-400",
    bg: "bg-gray-50/40 dark:bg-gray-900/20",
    badgeDot: "bg-gray-400",
    badgeText: "text-gray-500 dark:text-gray-400",
    badgeBg: "bg-gray-100 dark:bg-gray-800/40",
  },
};

export default function TableButton({ tableData }: TableButtonProps) {
  const isSelected = !!tableData.selectedBy;
  const config = statusConfig[tableData.status] ?? statusConfig.closed;
  const reservation = tableData.reservations?.[0];

  return (
    <div
      className={cn(
        "relative flex h-full min-h-[100px] overflow-hidden rounded-xl border border-l-4 transition-all",
        config.accent,
        config.bg,
        isSelected && "ring-2 ring-blue-500 ring-offset-2",
      )}
    >
      {tableData.requireCleaning && (
        <div className="absolute right-2 top-2">
          <AlertTriangle size={14} className="text-orange-500" />
        </div>
      )}

      <div className="flex w-full flex-col gap-1.5 p-3">
        {/* Top row: table number + status badge */}
        <div className="flex items-start justify-between gap-1">
          <span className="text-xl font-bold leading-tight">
            {tableData.prefix ? `${tableData.prefix}-` : ""}
            {tableData.number}
          </span>
          <span
            className={cn(
              "flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
              config.badgeBg,
              config.badgeText,
            )}
          >
            <span className={cn("h-1.5 w-1.5 rounded-full", config.badgeDot)} />
            {tableData.status.charAt(0).toUpperCase() + tableData.status.slice(1)}
          </span>
        </div>

        {/* Description */}
        {tableData.description && (
          <p className="truncate text-xs text-muted-foreground">
            {tableData.description}
          </p>
        )}

        {/* Bottom row: seats + reservation */}
        <div className="mt-auto flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users size={12} />
            {tableData.seats}
          </span>
          {reservation && (
            <span className="flex items-center gap-1 truncate">
              <Notebook size={12} className="shrink-0" />
              Until {reservation.expireAt}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
