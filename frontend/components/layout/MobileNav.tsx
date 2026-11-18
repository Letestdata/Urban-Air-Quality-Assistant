"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wind,
  CalendarDays,
  Home,
  Menu,
  X,
  Users,
  Compass,
  Leaf,
  BotMessageSquare,
  BarChart3,
  Settings,
  Bell
} from "lucide-react";

export function MobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const mainTabs = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Air Quality", href: "/air-quality", icon: Wind },
    { name: "Plan", href: "/daily-plan", icon: CalendarDays },
    { name: "Indoor", href: "/indoor-air", icon: Home },
  ];

  const moreItems = [
    { name: "Family Profiles", href: "/family", icon: Users },
    { name: "Smart Routes", href: "/smart-routes", icon: Compass },
    { name: "My Impact", href: "/impact", icon: Leaf },
    { name: "AI Assistant", href: "/assistant", icon: BotMessageSquare },
    { name: "Reports", href: "/reports", icon: BarChart3 },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <>
      {/* Slide-over sheet for "More" */}
      {moreOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden flex flex-col justify-end">
          <div className="bg-[#102D26] text-white rounded-t-2xl p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#174638]">
              <span className="font-bold text-base">More Modules</span>
              <button onClick={() => setMoreOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {moreItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold ${
                      isActive ? "bg-[#1F8A63] text-white" : "bg-[#174638] text-gray-200 hover:bg-[#1F8A63]"
                    }`}
                  >
                    <Icon className="w-4 h-4 text-[#80C9A4]" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Tab Bar */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#102D26] border-t border-[#174638] flex items-center justify-around z-40 px-2"
        aria-label="Mobile Navigation"
      >
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center w-16 py-1 text-[11px] font-medium transition ${
                isActive ? "text-[#80C9A4] font-bold" : "text-gray-400 hover:text-gray-200"
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{tab.name}</span>
            </Link>
          );
        })}

        <button
          onClick={() => setMoreOpen(true)}
          className={`flex flex-col items-center justify-center w-16 py-1 text-[11px] font-medium transition ${
            moreOpen ? "text-[#80C9A4] font-bold" : "text-gray-400 hover:text-gray-200"
          }`}
        >
          <Menu className="w-5 h-5 mb-0.5" />
          <span>More</span>
        </button>
      </nav>
    </>
  );
}
