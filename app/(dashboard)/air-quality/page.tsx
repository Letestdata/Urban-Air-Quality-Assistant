"use client";

import React, { useEffect, useState } from "react";
import {
  Wind,
  BarChart2,
  TrendingUp,
  Clock,
  ShieldCheck,
  AlertTriangle,
  Info,
  Layers,
  ChevronRight
} from "lucide-react";
import { api } from "@/lib/api";
import { AQIData, ForecastData, HistoricalData } from "@/lib/types";
import { AQIBadge } from "@/components/common/AQIBadge";
import { FreshnessIndicator } from "@/components/common/FreshnessIndicator";
import { PollutantCard } from "@/components/air-quality/PollutantCard";
import { useLocation } from "@/lib/location-context";

export default function AirQualityPage() {
  const { selectedCity } = useLocation();
  const [aqiData, setAqiData] = useState<AQIData | null>(null);
  const [history, setHistory] = useState<HistoricalData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [range, setRange] = useState<"24h" | "7d" | "30d">("24h");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [current, hist, fc] = await Promise.all([
          api.getCurrentAirQuality(selectedCity),
          api.getHistory(selectedCity, range),
          api.getForecast(selectedCity),
        ]);
        setAqiData(current);
        setHistory(hist);
        setForecast(fc);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCity, range]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#102D26] tracking-tight">
            Air Quality Deep Dive
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Verified ground measurements, CPCB breakpoints, historical trends, and forecast horizons.
          </p>
        </div>

        {aqiData && <FreshnessIndicator status={aqiData.data_freshness} timestamp={aqiData.timestamp} />}
      </div>

      {/* Hero Stats */}
      {aqiData && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Official Indian NAQI</span>
            <div className="flex items-baseline gap-4">
              <span className="text-6xl font-black text-[#102D26]">{aqiData.aqi}</span>
              <AQIBadge aqi={aqiData.aqi} category={aqiData.category} size="lg" />
            </div>
            <p className="text-xs text-gray-500">
              Station: <strong>{aqiData.monitoring_station}</strong> ({aqiData.data_source})
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:border-l md:border-gray-200 md:pl-8">
            <div className="bg-[#F3F6F1] p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-gray-400 uppercase">Prominent Pollutant</span>
              <p className="text-xl font-bold text-[#102D26] mt-0.5">{aqiData.prominent_pollutant}</p>
            </div>
            <div className="bg-[#F3F6F1] p-3.5 rounded-2xl">
              <span className="text-[11px] font-bold text-gray-400 uppercase">Methodology</span>
              <p className="text-xl font-bold text-[#1F8A63] mt-0.5">CPCB NAQI</p>
            </div>
          </div>
        </div>
      )}

      {/* Historical Trends & Range Switcher */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-[#102D26] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#1F8A63]" />
              <span>Historical AQI Trajectory</span>
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Continuous ambient monitoring records with 100% data completeness
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#F3F6F1] rounded-xl self-start sm:self-auto">
            {(["24h", "7d", "30d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  range === r ? "bg-[#1F8A63] text-white shadow-sm" : "text-gray-600 hover:text-[#102D26]"
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Bar Trend Chart */}
        {history && (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-[#F3F6F1] p-3.5 rounded-2xl text-center">
                <span className="text-xs text-gray-500 font-semibold">Average AQI</span>
                <p className="text-2xl font-black text-[#102D26]">{history.average_aqi}</p>
              </div>
              <div className="bg-[#F3F6F1] p-3.5 rounded-2xl text-center">
                <span className="text-xs text-gray-500 font-semibold">Peak AQI</span>
                <p className="text-2xl font-black text-rose-700">{history.peak_aqi}</p>
              </div>
              <div className="bg-[#F3F6F1] p-3.5 rounded-2xl text-center">
                <span className="text-xs text-gray-500 font-semibold">Minimum AQI</span>
                <p className="text-2xl font-black text-emerald-700">{history.min_aqi}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-gray-400 px-1">
                <span>Timeline Points</span>
                <span>Measured AQI</span>
              </div>
              <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                {history.data_points.map((pt, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#F3F6F1] hover:bg-[#e8eee6] text-xs transition"
                  >
                    <span className="font-medium text-gray-600">
                      {new Date(pt.timestamp).toLocaleDateString([], { month: "short", day: "numeric" })}{" "}
                      {new Date(pt.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-gray-500">
                        PM2.5: {pt.pm25} µg/m³
                      </span>
                      <AQIBadge aqi={pt.aqi} category={pt.category} size="sm" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Pollutant Detail Grid */}
      {aqiData && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#102D26]">All Monitored Pollutants</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(aqiData.pollutants).map(([key, item]) => (
              <PollutantCard key={key} data={item} />
            ))}
          </div>
        </section>
      )}

      {/* 24-Hour Forecast Horizon */}
      {forecast && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <div className="pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-bold text-[#102D26] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#1F8A63]" />
                <span>24-Hour Forward Forecast Horizon</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Model: {forecast.provider}
              </p>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start gap-2 leading-relaxed">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Forecast Uncertainty Statement:</strong> {forecast.uncertainty_statement}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
            {forecast.hourly_forecast.slice(0, 12).map((item, idx) => (
              <div key={idx} className="bg-[#F3F6F1] p-3 rounded-2xl text-center flex flex-col justify-between">
                <span className="text-xs font-bold text-gray-600">{item.hour}</span>
                <div className="my-2">
                  <span className="text-xl font-black text-[#102D26] block">{item.aqi_estimate}</span>
                  <span className="text-[10px] font-semibold text-gray-500 uppercase">{item.category}</span>
                </div>
                <span className="text-[10px] text-gray-400 capitalize">{item.confidence} confidence</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
