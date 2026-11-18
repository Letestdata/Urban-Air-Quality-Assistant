"use client";

import React, { useEffect, useState } from "react";
import {
  Leaf,
  PlusCircle,
  TrendingDown,
  TreePine,
  Car,
  Train,
  CheckCircle2,
  Info,
  Calendar
} from "lucide-react";
import { api } from "@/lib/api";
import { ImpactSummary } from "@/lib/types";

export default function ImpactPage() {
  const [summary, setSummary] = useState<ImpactSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);

  // Log Form State
  const [baselineMode, setBaselineMode] = useState("petrol_car");
  const [chosenMode, setChosenMode] = useState("metro");
  const [distanceKm, setDistanceKm] = useState(12.0);
  const [submitting, setSubmitting] = useState(false);

  const fetchImpact = async () => {
    try {
      const data = await api.getImpactSummary();
      setSummary(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImpact();
  }, []);

  const handleLogTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.logImpact({
        baseline_mode: baselineMode,
        chosen_mode: chosenMode,
        distance_km: distanceKm,
      });
      setShowLogModal(false);
      fetchImpact();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-sm font-semibold text-gray-500">Calculating Personal Carbon Ledger...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#102D26] tracking-tight">
            My Carbon Impact Ledger
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Quantify avoided transport emissions when choosing low-carbon travel alternatives.
          </p>
        </div>

        <button
          onClick={() => setShowLogModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F8A63] hover:bg-[#187050] text-white text-xs font-bold shadow transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Log Sustainable Journey</span>
        </button>
      </div>

      {/* Log Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-200 space-y-4">
            <h2 className="text-lg font-bold text-[#102D26]">Log Low-Carbon Journey</h2>
            <form onSubmit={handleLogTrip} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Baseline Transport Mode</label>
                <select
                  value={baselineMode}
                  onChange={(e) => setBaselineMode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm bg-white font-medium"
                >
                  <option value="petrol_car">Solo Petrol Car (0.170 kg CO2e/km)</option>
                  <option value="diesel_suv">Solo Diesel SUV (0.220 kg CO2e/km)</option>
                  <option value="standard_cab">Ride-hail Cab (0.180 kg CO2e/km)</option>
                  <option value="two_wheeler_petrol">Petrol Two-Wheeler (0.065 kg CO2e/km)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Chosen Sustainable Mode</label>
                <select
                  value={chosenMode}
                  onChange={(e) => setChosenMode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm bg-white font-medium"
                >
                  <option value="metro">Delhi / City Metro (0.015 kg CO2e/km)</option>
                  <option value="electric_bus">Electric City Bus (0.030 kg CO2e/km)</option>
                  <option value="ev">Electric Vehicle (0.045 kg CO2e/km)</option>
                  <option value="bicycle">Bicycle (0.000 kg CO2e/km)</option>
                  <option value="walk">Walking (0.000 kg CO2e/km)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Trip Distance (kilometers)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="300"
                  required
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(parseFloat(e.target.value) || 1)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-semibold"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-[#1F8A63] hover:bg-[#187050] text-white text-xs font-bold shadow transition disabled:opacity-50"
                >
                  {submitting ? "Calculating..." : "Save Journey"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stats Summary Grid */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Avoided</span>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#1F8A63]">{summary.total_co2e_saved_kg}</span>
              <span className="text-sm font-bold text-gray-500">kg CO2e</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">Cumulative personal savings</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Past 7 Days</span>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#102D26]">{summary.weekly_co2e_saved_kg}</span>
              <span className="text-sm font-bold text-gray-500">kg CO2e</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">Weekly reduction momentum</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Trees Equivalence</span>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-4xl font-black text-emerald-700">{summary.equivalent_trees_planted_year}</span>
              <span className="text-sm font-bold text-gray-500">trees/yr</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">~22 kg CO2 absorbed per tree</span>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Trips Logged</span>
            <div className="my-2 flex items-baseline gap-2">
              <span className="text-4xl font-black text-[#102D26]">{summary.total_trips_logged}</span>
              <span className="text-sm font-bold text-gray-500">trips</span>
            </div>
            <span className="text-xs text-gray-500 font-medium">Clean journeys recorded</span>
          </div>
        </div>
      )}

      {/* Recent Trips Log */}
      {summary && (
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h2 className="text-lg font-bold text-[#102D26]">Recent Commute Ledger</h2>
            <span className="text-xs font-semibold text-gray-400">Saved Records</span>
          </div>

          {summary.recent_records.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-400">
              No journeys logged yet. Click "Log Sustainable Journey" above to record your first transit saving.
            </div>
          ) : (
            <div className="space-y-2">
              {summary.recent_records.map((rec) => (
                <div
                  key={rec.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-2xl bg-[#F3F6F1] gap-2 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white text-[#1F8A63] border border-gray-200 font-bold">
                      {rec.chosen_mode.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-[#202B27]">
                        {rec.distance_km} km journey (vs {rec.baseline_mode.replace("_", " ")})
                      </p>
                      <span className="text-gray-400 text-[11px]">{rec.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="font-black text-sm text-[#1F8A63]">+{rec.co2e_saved_kg} kg CO2e</span>
                    <span className="text-gray-400 text-[10px]">avoided</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Mandatory Educational Distinction from PRD Section 12.3 */}
      {summary && (
        <div className="p-4 rounded-2xl bg-[#F3F6F1] border border-gray-200 text-xs text-gray-600 flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <span>{summary.educational_note}</span>
        </div>
      )}
    </div>
  );
}
