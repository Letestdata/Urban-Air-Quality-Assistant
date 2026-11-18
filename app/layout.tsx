import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Urban Air AI — Breathe Smarter. Live Healthier.",
  description:
    "An AI-powered environmental intelligence and daily planning platform that translates complex air pollution data into actionable routines for families in India.",
  keywords: ["Urban Air AI", "Air Quality India", "CPCB AQI", "PM2.5", "Indoor Air Quality", "Environmental Health", "Daily Planner"],
  authors: [{ name: "Urban Air AI Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#102D26",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#F3F6F1] text-[#202B27] antialiased selection:bg-[#80C9A4] selection:text-[#102D26]">
        {/* WCAG 2.2 AA Skip to Main Content Landmark Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[#102D26] focus:text-white focus:rounded-lg focus:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#80C9A4] text-sm font-bold"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
