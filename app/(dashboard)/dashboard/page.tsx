"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wind,
  Thermometer,
  Droplets,
  Gauge,
  Compass,
  AlertTriangle,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Calendar,
  Home,
  BotMessageSquare,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { api } from "@/lib/api";
import { AQIData, DailyPlan } from "@/lib/types";
import { AQIBadge } from "@/components/common/AQIBadge";
import { FreshnessIndicator } from "@/components/common/FreshnessIndicator";
import { PollutantCard } from "@/components/air-quality/PollutantCard";
import { ActivityCard } from "@/components/daily-plan/ActivityCard";
import { useLocation } from "@/lib/location-context";

export default function DashboardPage() {
  const { selectedCity } = useLocation();
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = React.useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const [aqi, plan] = await Promise.all([
        api.getCurrentAirQuality(selectedCity),
        api.getTodayPlan(selectedCity).catch(() => null),
      ]);
      setAqiData(aqi);
      setDailyPlan(plan);
    } catch (err: any) {
      setError(err.message || "Failed to load environmental data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCity]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = async (activityId: string, newStatus: "pending" | "completed" | "skipped") => {
    try {
      const updated = await api.updateActivityStatus(activityId, newStatus);
      if (dailyPlan) {
        setDailyPlan({
          ...dailyPlan,
          activities: dailyPlan.activities.map((a) => (a.id === activityId ? updated : a)),
        });
      }
    } catch {
      // Optimistic update fallback
      if (dailyPlan) {
        setDailyPlan({
          ...dailyPlan,
          activities: dailyPlan.activities.map((a) =>
            a.id === activityId ? { ...a, status: newStatus } : a
          ),
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center animate-spin text-[#1F8A63]">
          <RefreshCw className="w-6 h-6" />
        </div>
        <p className="text-sm font-semibold text-gray-500">Retrieving CPCB Air Quality Telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#102D26] tracking-tight">
            Environmental Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Real-time conditions, CPCB NAQI standard, and today's schedule adaptations.
          </p>
        </div>

        <button
          onClick={() => loadData(true)}
          disabled={refreshing}
          className="self-start sm:self-auto inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 transition shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#1F8A63]" : ""}`} />
          <span>{refreshing ? "Updating..." : "Refresh Readings"}</span>
        </button>
      </div>

      {/* Section 1 & Section 3: Current AQI & Weather Cards */}
      {aqiData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Air Quality Card */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Current Air Quality</span>
                  <FreshnessIndicator status={aqiData.data_freshness} timestamp={aqiData.timestamp} />
                </div>
                <h2 className="text-xl font-extrabold text-[#102D26]">{aqiData.city}</h2>
                <p className="text-xs text-gray-500">{aqiData.monitoring_station}</p>
              </div>

              <AQIBadge aqi={aqiData.aqi} category={aqiData.category} size="lg" />
            </div>

            {/* Big AQI Number & Subtitle */}
            <div className="my-6 flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="flex items-baseline gap-3">
                <span className="text-6xl sm:text-7xl font-black tracking-tight text-[#102D26]">
                  {aqiData.aqi}
                </span>
                <div>
                  <span className="text-xs font-bold text-gray-400 block uppercase">CPCB NAQI</span>
                  <span className="text-sm font-bold text-[#1F8A63]">
                    Primary: {aqiData.prominent_pollutant}
                  </span>
                </div>
              </div>

              <div className="flex-1 bg-[#F3F6F1] p-4 rounded-2xl border border-gray-200/60 text-xs text-gray-700 leading-relaxed">
                <p className="font-semibold text-[#102D26] mb-1">General Health Advisory:</p>
                {aqiData.general_health_advisory}
              </div>
            </div>

            {/* Footer Meta */}
            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
              <span>Standard: {aqiData.standard}</span>
              <span>Source: {aqiData.data_source}</span>
            </div>
          </div>

          {/* Section 3: Weather Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Weather Telemetry</span>
                <span className="text-xs font-bold text-[#1F8A63] bg-emerald-50 px-2.5 py-1 rounded-full">
                  {aqiData.weather.condition}
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-4xl font-black text-[#102D26]">
                  {aqiData.weather.temperature}°C
                </span>
                <span className="text-xs text-gray-500 font-semibold">Ambient</span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Droplets className="w-4 h-4 text-blue-500" />
                    <span>Relative Humidity</span>
                  </div>
                  <span className="font-bold text-[#202B27]">{aqiData.weather.humidity}%</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Wind className="w-4 h-4 text-teal-500" />
                    <span>Wind Speed</span>
                  </div>
                  <span className="font-bold text-[#202B27]">{aqiData.weather.wind_speed} km/h</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Compass className="w-4 h-4 text-amber-500" />
                    <span>Wind Direction</span>
                  </div>
                  <span className="font-bold text-[#202B27]">{aqiData.weather.wind_direction}°</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-400">
              Low wind speeds can trap pollutants near street level.
            </div>
          </div>
        </div>
      )}

      {/* Section 2: Pollutant Summary Grid */}
      {aqiData && (
        <section aria-labelledby="pollutants-heading">
          <div className="flex items-center justify-between mb-4">
            <h2 id="pollutants-heading" className="text-lg font-bold text-[#102D26]">
              Criteria Pollutants Breakdown
            </h2>
            <Link href="/air-quality" className="text-xs font-bold text-[#1F8A63] hover:underline flex items-center gap-1">
              <span>Detailed Charts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {Object.entries(aqiData.pollutants).map(([key, item]) => (
              <PollutantCard key={key} data={item} />
            ))}
          </div>
        </section>
      )}

      {/* Section 4: Today's AI Plan Preview */}
      {dailyPlan && (
        <section aria-labelledby="plan-heading" className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#1F8A63]" />
                <h2 id="plan-heading" className="text-xl font-bold text-[#102D26]">
                  Today's Personalized Routine
                </h2>
              </div>
              <p className="text-xs text-gray-500 mt-1">{dailyPlan.summary}</p>
            </div>

            <Link
              href="/daily-plan"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1F8A63] hover:bg-[#187050] text-white rounded-xl text-xs font-bold shadow-sm transition"
            >
              <span>View Full Plan</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {dailyPlan.activities.slice(0, 4).map((act) => (
              <ActivityCard
                key={act.id}
                activity={act}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </section>
      )}

      {/* Section 6: Quick Actions */}
      <section aria-labelledby="quick-actions-heading">
        <h2 id="quick-actions-heading" className="text-base font-bold text-[#102D26] mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <Link
            href="/air-quality"
            className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#1F8A63] transition flex items-center gap-3"
          >
            <div className="p-2.5 rounded-xl bg-emerald-50 text-[#1F8A63]">
              <Wind className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-[#202B27]">Air Quality</span>
              <span className="text-[11px] text-gray-400">Trends & History</span>
            </div>
          </Link>

          <Link
            href="/daily-plan"
            className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#1F8A63] transition flex items-center gap-3"
          >
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-[#202B27]">Daily Plan</span>
              <span className="text-[11px] text-gray-400">Regenerate Routine</span>
            </div>
          </Link>

          <Link
            href="/indoor-air"
            className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#1F8A63] transition flex items-center gap-3"
          >
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-[#202B27]">Indoor Air</span>
              <span className="text-[11px] text-gray-400">Ventilation & CADR</span>
            </div>
          </Link>

          <Link
            href="/assistant"
            className="p-4 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-[#1F8A63] transition flex items-center gap-3"
          >
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <BotMessageSquare className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-xs font-bold text-[#202B27]">Ask AI</span>
              <span className="text-[11px] text-gray-400">Questions & Advice</span>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
