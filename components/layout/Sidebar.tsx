"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Wind,
  CalendarDays,
  Home,
  Users,
  Compass,
  Leaf,
  BotMessageSquare,
  BarChart3,
  Settings,
  LogOut,
  Bell
} from "lucide-react";
import { api } from "@/lib/api";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Air Quality", href: "/air-quality", icon: Wind },
  { name: "My Daily Plan", href: "/daily-plan", icon: CalendarDays },
  { name: "Indoor Air", href: "/indoor-air", icon: Home },
  { name: "Family Profiles", href: "/family", icon: Users },
  { name: "Smart Routes", href: "/smart-routes", icon: Compass },
  { name: "My Impact", href: "/impact", icon: Leaf },
  { name: "AI Assistant", href: "/assistant", icon: BotMessageSquare },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    api.clearToken();
    router.push("/login");
  };

  return (
    <aside
      className="hidden md:flex flex-col w-64 bg-[#102D26] text-[#F3F6F1] min-h-screen border-r border-[#174638] shrink-0"
      aria-label="Primary Navigation"
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-[#174638]">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F8A63] to-[#80C9A4] flex items-center justify-center text-white shadow-md">
            <Wind className="w-6 h-6 text-[#102D26]" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-white tracking-tight">Urban Air AI</h1>
            <p className="text-[11px] text-[#80C9A4] font-medium">Breathe Smarter</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto" role="navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-[#1F8A63] text-white shadow-sm font-semibold"
                  : "text-[#d1eedf] hover:bg-[#174638] hover:text-white"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-[#80C9A4]"}`} aria-hidden="true" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="p-4 border-t border-[#174638] bg-[#0b201b]/50">
        <div className="flex items-center justify-between mb-3 px-2">
          <Link
            href="/notifications"
            className="flex items-center gap-2 text-xs text-[#80C9A4] hover:text-white transition"
          >
            <Bell className="w-4 h-4" />
            <span>Alerts & Notifications</span>
          </Link>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3.5 py-2 rounded-xl text-sm font-medium text-rose-300 hover:bg-rose-950/40 hover:text-rose-200 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
