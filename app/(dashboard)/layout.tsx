"use client";

import React from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { LocationProvider, useLocation } from "@/lib/location-context";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { selectedCity, setSelectedCity } = useLocation();

  return (
    <div className="flex min-h-screen bg-[#F3F6F1]">
      {/* Fixed Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <Header
          currentCity={selectedCity}
          onCityChange={(city) => setSelectedCity(city)}
          freshnessStatus="Fresh"
        />

        <main id="main-content" className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full" role="main">
          {children}
        </main>
      </div>

      {/* Sticky Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LocationProvider>
      <DashboardContent>{children}</DashboardContent>
    </LocationProvider>
  );
}
