"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  TrendingDown,
  ShieldCheck,
  Download,
  Info
} from "lucide-react";
import { api } from "@/lib/api";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const data = await api.getReport(reportType);
        setReport(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportType]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#102D26] tracking-tight">
            Environmental Impact & Exposure Reports
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Audit trail of ambient exposure, routine completion rates, and avoided carbon metrics.
          </p>
        </div>

        {/* Report Type Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-200 rounded-2xl shadow-sm self-start sm:self-auto">
          {(["daily", "weekly", "monthly"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setReportType(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                reportType === t ? "bg-[#1F8A63] text-white shadow" : "text-gray-600 hover:text-[#102D26]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards */}
      {report && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Average AQI</span>
            <p className="text-4xl font-black text-[#102D26] my-2">{report.average_aqi}</p>
            <span className="text-xs text-gray-500 font-medium">Over {reportType} period</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Routine Adherence</span>
            <p className="text-4xl font-black text-[#1F8A63] my-2">{report.completion_rate_pct}%</p>
            <span className="text-xs text-gray-500 font-medium">
              {report.plan_activities_completed} of {report.plan_activities_total} tasks followed
            </span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">CO2e Avoided</span>
            <p className="text-4xl font-black text-emerald-700 my-2">{report.total_co2e_saved_kg} kg</p>
            <span className="text-xs text-gray-500 font-medium">Personal travel choices</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Exposure Extremes</span>
            <div className="my-2 text-sm font-bold text-[#202B27] space-y-0.5">
              <p>Peak: <span className="text-rose-600 font-black">{report.peak_aqi}</span></p>
              <p>Lowest: <span className="text-emerald-600 font-black">{report.lowest_aqi}</span></p>
            </div>
            <span className="text-xs text-gray-400">Min / Max readings</span>
          </div>
        </div>
      )}

      {/* Category Day Distribution */}
      {report && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#102D26]">Days Distribution by CPCB Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(report.aqi_category_days).map(([category, count]) => (
              <div key={category} className="bg-[#F3F6F1] p-3.5 rounded-2xl text-center">
                <span className="text-xs font-bold text-gray-500 uppercase">{category}</span>
                <p className="text-2xl font-black text-[#102D26] my-1">{count as number}</p>
                <span className="text-[10px] text-gray-400">days</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Audit Sources Box */}
      {report && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-[#102D26]">Data Integrity & Monitoring Sources</h3>
          <ul className="text-xs text-gray-600 space-y-1">
            {report.data_sources_used.map((src: string, idx: number) => (
              <li key={idx} className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#1F8A63]" />
                <span>{src}</span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-gray-400 pt-1 border-t border-gray-100">
            Missing data hours in period: {report.missing_data_hours}h. All reported periods use real historical ground records.
          </p>
        </div>
      )}
    </div>
  );
}
