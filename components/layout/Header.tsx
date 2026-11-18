"use client";

import React, { useState } from "react";
import Link from "next/link";
import { MapPin, Bell, Calendar, ChevronDown, User, ShieldCheck } from "lucide-react";
import { formatIndianDate } from "@/lib/utils";

interface HeaderProps {
  currentCity: string;
  onCityChange: (city: string) => void;
  freshnessStatus?: string;
  timestamp?: string;
}

const CITIES = [
  "Delhi NCR",
  "Ahmedabad",
  "Mumbai",
  "Bengaluru",
  "Pune",
  "Hyderabad",
  "Kolkata",
  "Chennai"
];

export function Header({ currentCity, onCityChange, freshnessStatus = "Fresh", timestamp }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const today = new Date();

  return (
    <header className="h-18 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Location Selector */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F3F6F1] hover:bg-[#e4eae0] border border-gray-200 text-[#202B27] font-semibold text-sm transition"
            aria-expanded={dropdownOpen}
            aria-label="Select location"
          >
            <MapPin className="w-4 h-4 text-[#1F8A63]" />
            <span>{currentCity}</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-40">
              <div className="px-3 py-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                Supported Indian Cities
              </div>
              {CITIES.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    onCityChange(city);
                    setDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-[#F3F6F1] flex items-center justify-between ${
                    city === currentCity ? "text-[#1F8A63] font-bold bg-[#F3F6F1]" : "text-[#202B27]"
                  }`}
                >
                  <span>{city}</span>
                  {city === currentCity && <ShieldCheck className="w-3.5 h-3.5 text-[#1F8A63]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Display */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 font-medium">
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>{formatIndianDate(today)}</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3.5">
        <Link
          href="/notifications"
          className="relative p-2 rounded-lg text-gray-600 hover:text-[#102D26] hover:bg-[#F3F6F1] transition"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#1F8A63] rounded-full ring-2 ring-white"></span>
        </Link>

        <Link
          href="/settings"
          className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#F3F6F1] transition"
          aria-label="User Settings"
        >
          <div className="w-8 h-8 rounded-full bg-[#174638] text-white flex items-center justify-center font-bold text-xs">
            UA
          </div>
        </Link>
      </div>
    </header>
  );
}
