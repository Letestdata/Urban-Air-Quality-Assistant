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
        {children}
      </body>
    </html>
  );
}
