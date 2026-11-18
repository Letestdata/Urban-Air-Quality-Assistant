import React from "react";
import { CheckCircle2, AlertTriangle, AlertOctagon, ShieldAlert, AlertCircle, Info } from "lucide-react";

interface AQIBadgeProps {
  aqi: number;
  category: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function AQIBadge({ aqi, category, size = "md", showIcon = true }: AQIBadgeProps) {
  const catLower = category.toLowerCase();

  let bgColor = "bg-[#1F8A63] text-white";
  let Icon = CheckCircle2;
  let accessibleLabel = `Air Quality: ${aqi}, Category: ${category} (Minimal impact)`;

  if (catLower.includes("satisfactory")) {
    bgColor = "bg-[#80C9A4] text-[#102D26]";
    Icon = Info;
    accessibleLabel = `Air Quality: ${aqi}, Category: ${category} (Minor breathing discomfort to sensitive people)`;
  } else if (catLower.includes("moderate")) {
    bgColor = "bg-[#E5A823] text-white";
    Icon = AlertCircle;
    accessibleLabel = `Air Quality: ${aqi}, Category: ${category} (Breathing discomfort to sensitive groups)`;
  } else if (catLower.includes("poor") && !catLower.includes("very")) {
    bgColor = "bg-[#E67E22] text-white";
    Icon = AlertTriangle;
    accessibleLabel = `Air Quality: ${aqi}, Category: ${category} (Breathing discomfort on prolonged exposure)`;
  } else if (catLower.includes("very poor")) {
    bgColor = "bg-[#C0392B] text-white";
    Icon = AlertOctagon;
    accessibleLabel = `Air Quality: ${aqi}, Category: ${category} (Respiratory illness on prolonged exposure)`;
  } else if (catLower.includes("severe")) {
    bgColor = "bg-[#7D1F2D] text-white";
    Icon = ShieldAlert;
    accessibleLabel = `Air Quality: ${aqi}, Category: ${category} (Affects healthy people and severely impacts existing diseases)`;
  }

  const sizeClasses = {
    sm: "px-2.5 py-0.5 text-xs font-semibold gap-1",
    md: "px-3.5 py-1.5 text-sm font-semibold gap-1.5",
    lg: "px-4 py-2 text-base font-bold gap-2"
  };

  return (
    <span
      className={`inline-flex items-center rounded-full shadow-sm ${bgColor} ${sizeClasses[size]}`}
      role="status"
      aria-label={accessibleLabel}
    >
      {showIcon && <Icon className={size === "lg" ? "w-5 h-5" : size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} aria-hidden="true" />}
      <span>{category} ({aqi})</span>
    </span>
  );
}
