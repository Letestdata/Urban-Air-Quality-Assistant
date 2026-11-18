import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAQIBadgeColor(category: string): string {
  switch (category.toLowerCase()) {
    case "good":
      return "bg-[#1F8A63] text-white";
    case "satisfactory":
      return "bg-[#80C9A4] text-charcoal";
    case "moderate":
      return "bg-[#E5A823] text-white";
    case "poor":
      return "bg-[#E67E22] text-white";
    case "very poor":
      return "bg-[#C0392B] text-white";
    case "severe":
      return "bg-[#7D1F2D] text-white";
    default:
      return "bg-charcoal text-white";
  }
}

export function formatIndianDate(dateStr: string | Date): string {
  const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  return date.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}
