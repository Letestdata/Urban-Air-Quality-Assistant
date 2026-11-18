"use client";

import React, { useEffect, useState } from "react";
import {
  Home,
  Wind,
  Calculator,
  CheckSquare,
  AlertCircle,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  Flame,
  Layers
} from "lucide-react";
import { api } from "@/lib/api";
import { CADRData, IndoorGuidance } from "@/lib/types";
import { useLocation } from "@/lib/location-context";

export default function IndoorAirPage() {
  const { selectedCity } = useLocation();
  const [guidance, setGuidance] = useState<IndoorGuidance | null>(null);
  const [loading, setLoading] = useState(true);

  // Custom CADR Calculator State
  const [roomLength, setRoomLength] = useState(4.5);
  const [roomWidth, setRoomWidth] = useState(4.0);
  const [ceilingHeight, setCeilingHeight] = useState(2.8);
  const [cadrResult, setCadrResult] = useState<CADRData | null>(null);
  const [calculating, setCalculating] = useState(false);

  // Checklist state
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchGuidance = async () => {
      try {
        const data = await api.getIndoorGuidance(selectedCity);
        setGuidance(data);
        setCadrResult(data.purifier_guidance);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchGuidance();
  }, [selectedCity]);

  const handleCalculateCADR = async (e: React.FormEvent) => {
    e.preventDefault();
    setCalculating(true);
    try {
      const res = await api.calculateCADR({
        room_length_m: roomLength,
        room_width_m: roomWidth,
        ceiling_height_m: ceilingHeight,
        target_air_changes_per_hour: 5,
      });
      setCadrResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setCalculating(false);
    }
  };

  const toggleChecklist = (id: string) => {
    setCheckedTasks({
      ...checkedTasks,
      [id]: !checkedTasks[id],
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-sm font-semibold text-gray-500">Loading Indoor Air Quality Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#102D26] tracking-tight">
          Indoor Air & Ventilation Intelligence
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Diurnal ventilation windows, cooking particulate containment, and HEPA CADR room sizing.
        </p>
      </div>

      {/* Ventilation Windows Section */}
      {guidance && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
            <div>
              <h2 className="text-lg font-bold text-[#102D26] flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#1F8A63]" />
                <span>Today's Natural Ventilation Windows</span>
              </h2>
              <p className="text-xs text-gray-500">
                Calculated from solar boundary layer expansion in {guidance.city} (Ambient AQI ~{guidance.ambient_aqi})
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-[#1F8A63] border border-emerald-200 self-start sm:self-auto">
              Status: {guidance.ventilation_status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {guidance.best_ventilation_windows.map((win, idx) => {
              const isRec = win.recommendation.toLowerCase().includes("recommended");
              const isAvoid = win.recommendation.toLowerCase().includes("avoid");
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-2xl border flex flex-col justify-between ${
                    isRec
                      ? "bg-emerald-50/60 border-emerald-200"
                      : isAvoid
                      ? "bg-rose-50/60 border-rose-200"
                      : "bg-[#F3F6F1] border-gray-200"
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold text-gray-500 block mb-1">{win.time_range}</span>
                    <span
                      className={`text-sm font-extrabold block mb-2 ${
                        isRec ? "text-[#1F8A63]" : isAvoid ? "text-rose-700" : "text-amber-700"
                      }`}
                    >
                      {win.recommendation}
                    </span>
                    <p className="text-xs text-gray-600 leading-relaxed">{win.reason}</p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-gray-200/50 text-[11px] text-gray-500 font-semibold flex justify-between">
                    <span>Est. AQI: {win.expected_ambient_aqi}</span>
                    <span>{win.outdoor_status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Interactive CADR Sizing Calculator */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[#102D26] flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#1F8A63]" />
            <span>HEPA Air Purifier CADR Sizing Calculator</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Clean Air Delivery Rate (CADR) required to achieve 5 Air Changes per Hour (ACH) for your room size.
          </p>
        </div>

        <form onSubmit={handleCalculateCADR} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Room Length (meters)</label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="20"
              value={roomLength}
              onChange={(e) => setRoomLength(parseFloat(e.target.value) || 1)}
              className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Room Width (meters)</label>
            <input
              type="number"
              step="0.1"
              min="1"
              max="20"
              value={roomWidth}
              onChange={(e) => setRoomWidth(parseFloat(e.target.value) || 1)}
              className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Ceiling Height (meters)</label>
            <input
              type="number"
              step="0.1"
              min="2"
              max="6"
              value={ceilingHeight}
              onChange={(e) => setCeilingHeight(parseFloat(e.target.value) || 2.8)}
              className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-semibold"
            />
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={calculating}
              className="px-6 py-2.5 rounded-xl bg-[#1F8A63] hover:bg-[#187050] text-white text-xs font-bold shadow transition"
            >
              {calculating ? "Recalculating..." : "Compute Required CADR"}
            </button>
          </div>
        </form>

        {cadrResult && (
          <div className="p-5 rounded-2xl bg-[#F3F6F1] border border-gray-200 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase">Room Area</span>
                <p className="text-xl font-bold text-[#102D26]">{cadrResult.room_area_sqm} m²</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase">Room Volume</span>
                <p className="text-xl font-bold text-[#102D26]">{cadrResult.room_volume_cbm} m³</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase">Min CADR (Metric)</span>
                <p className="text-xl font-black text-[#1F8A63]">{cadrResult.recommended_cadr_m3h} m³/h</p>
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-400 uppercase">Min CADR (Imperial)</span>
                <p className="text-xl font-black text-[#1F8A63]">{cadrResult.recommended_cadr_cfm} CFM</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200/60 text-xs text-gray-600 space-y-1.5">
              <p>
                <strong>Recommended Filter Media:</strong> {cadrResult.filter_type_recommended}
              </p>
              <p>
                <strong>Placement Advice:</strong> {cadrResult.purifier_placement_advice}
              </p>
              <p>
                <strong>Maintenance Schedule:</strong> {cadrResult.maintenance_reminder}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Cooking Smoke & Dust Reduction Practices */}
      {guidance && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-base font-bold text-[#102D26]">
              <Flame className="w-5 h-5 text-amber-600" />
              <span>Cooking Smoke & Chimney Protocols</span>
            </div>
            <ul className="space-y-2 text-xs text-gray-600 leading-relaxed">
              {guidance.cooking_smoke_advisories.map((adv, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#1F8A63] font-bold">•</span>
                  <span>{adv}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-base font-bold text-[#102D26]">
              <Sparkles className="w-5 h-5 text-[#1F8A63]" />
              <span>Dust & Resuspension Controls</span>
            </div>
            <ul className="space-y-2 text-xs text-gray-600 leading-relaxed">
              {guidance.dust_control_practices.map((pr, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#1F8A63] font-bold">•</span>
                  <span>{pr}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Daily Indoor Air Checklist */}
      {guidance && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-[#102D26] flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-[#1F8A63]" />
            <span>Daily Indoor Hygiene Checklist</span>
          </h2>

          <div className="space-y-2.5">
            {guidance.daily_checklist.map((item) => {
              const isDone = !!checkedTasks[item.id];
              return (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className={`p-3.5 rounded-2xl border flex items-start gap-3 cursor-pointer transition ${
                    isDone ? "bg-emerald-50/50 border-emerald-300" : "bg-[#F3F6F1] border-gray-200 hover:bg-gray-100"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-lg border mt-0.5 flex items-center justify-center shrink-0 ${
                      isDone ? "bg-[#1F8A63] border-[#1F8A63] text-white" : "border-gray-300 bg-white"
                    }`}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isDone ? "line-through text-gray-400" : "text-[#202B27]"}`}>
                        {item.task}
                      </span>
                      <span className="text-[10px] font-semibold text-gray-400 px-1.5 py-0.5 rounded bg-white">
                        {item.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">{item.tip}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Mandatory Disclaimer from PRD Section 9.3 */}
      {guidance && (
        <div className="p-4 rounded-2xl bg-[#F3F6F1] border border-gray-200 text-xs text-gray-500 flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <span>{guidance.disclaimer}</span>
        </div>
      )}
    </div>
  );
}
