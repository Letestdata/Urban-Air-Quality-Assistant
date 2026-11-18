import React from "react";
import { Clock, AlertTriangle, CheckCircle, WifiOff } from "lucide-react";

interface FreshnessIndicatorProps {
  status: string; // Fresh, Delayed, Stale, Unavailable
  timestamp?: string;
}

export function FreshnessIndicator({ status, timestamp }: FreshnessIndicatorProps) {
  const s = status.toLowerCase();

  let badgeColor = "bg-emerald-100 text-emerald-800 border-emerald-300";
  let Icon = CheckCircle;
  let text = "Fresh Data (< 2h)";

  if (s === "delayed") {
    badgeColor = "bg-amber-100 text-amber-800 border-amber-300";
    Icon = Clock;
    text = "Delayed (2-6h)";
  } else if (s === "stale") {
    badgeColor = "bg-rose-100 text-rose-800 border-rose-300";
    Icon = AlertTriangle;
    text = "Stale Data (> 6h)";
  } else if (s === "unavailable") {
    badgeColor = "bg-gray-100 text-gray-700 border-gray-300";
    Icon = WifiOff;
    text = "Station Unavailable";
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${badgeColor}`}
    >
      <Icon className="w-3.5 h-3.5" aria-hidden="true" />
      <span>{text}</span>
      {timestamp && (
        <span className="text-[11px] opacity-75">
          • {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  );
}
