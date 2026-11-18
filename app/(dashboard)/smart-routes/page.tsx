"use client";

import React, { useState } from "react";
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  Clock,
  Train,
  Car,
  Bike,
  Bus,
  AlertTriangle,
  Info
} from "lucide-react";
import { api } from "@/lib/api";
import { RouteComparison, RouteOption } from "@/lib/types";

export default function SmartRoutesPage() {
  const [origin, setOrigin] = useState("Connaught Place, Delhi");
  const [destination, setDestination] = useState("Cyber City, Gurugram");
  const [comparison, setComparison] = useState<RouteComparison | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.compareRoutes(origin, destination);
      setComparison(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case "metro":
        return <Train className="w-5 h-5 text-blue-600" />;
      case "bus":
        return <Bus className="w-5 h-5 text-teal-600" />;
      case "private_car":
        return <Car className="w-5 h-5 text-amber-600" />;
      default:
        return <Bike className="w-5 h-5 text-purple-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#102D26] tracking-tight">
          Smart Route Exposure Comparison
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Evaluate transit corridors by transit micro-environment exposure, travel time, and emissions.
        </p>
      </div>

      {/* Input Form */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
        <form onSubmit={handleCompare} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Origin Point</label>
            <input
              type="text"
              required
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Connaught Place, Delhi"
              className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Destination</label>
            <input
              type="text"
              required
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Cyber City, Gurugram"
              className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-semibold"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#1F8A63] hover:bg-[#187050] text-white rounded-xl text-xs font-bold shadow transition flex items-center justify-center gap-2"
            >
              {loading ? "Analyzing Corridors..." : "Compare Route Exposures"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </section>

      {/* Results */}
      {comparison && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#102D26]">Available Travel Alternatives</h2>
            <span className="text-xs font-bold text-[#1F8A63] bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              City AQI Context: {comparison.current_city_aqi}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {comparison.routes.map((route, idx) => (
              <div
                key={idx}
                className={`rounded-3xl p-6 border flex flex-col justify-between transition ${
                  route.is_recommended
                    ? "bg-emerald-50/50 border-[#1F8A63] shadow-md"
                    : "bg-white border-gray-200 shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-2xl bg-white shadow-sm border border-gray-200">
                        {getModeIcon(route.transport_mode)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-[#102D26]">{route.route_name}</h3>
                        <span className="text-xs text-gray-500 font-medium">
                          {route.distance_km} km • {route.duration_minutes} mins
                        </span>
                      </div>
                    </div>
                    {route.is_recommended && (
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#1F8A63] text-white">
                        Recommended
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 my-4">
                    <div className="bg-[#F3F6F1] p-3 rounded-2xl">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Inhalation Risk</span>
                      <p className="text-base font-extrabold text-[#102D26] mt-0.5">
                        {route.estimated_exposure_level}
                      </p>
                    </div>
                    <div className="bg-[#F3F6F1] p-3 rounded-2xl">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Trip CO2e</span>
                      <p className="text-base font-extrabold text-teal-800 mt-0.5">
                        {route.co2e_emissions_kg} kg
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    {route.explanation}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mandatory Spatial Limitation Disclosure */}
          <div className="p-4 rounded-2xl bg-[#F3F6F1] border border-gray-200 text-xs text-gray-500 flex items-start gap-2.5 leading-relaxed">
            <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <span>{comparison.data_limitation_statement}</span>
          </div>
        </section>
      )}
    </div>
  );
}
