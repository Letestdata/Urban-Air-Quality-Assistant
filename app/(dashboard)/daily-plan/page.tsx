"use client";

import React, { useEffect, useState } from "react";
import {
  CalendarDays,
  Sparkles,
  RefreshCw,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Layers,
  Info
} from "lucide-react";
import { api } from "@/lib/api";
import { DailyPlan } from "@/lib/types";
import { ActivityCard } from "@/components/daily-plan/ActivityCard";
import { useLocation } from "@/lib/location-context";

export default function DailyPlanPage() {
  const { selectedCity } = useLocation();
  const [plan, setPlan] = useState<DailyPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);

  const fetchPlan = React.useCallback(async (force = false) => {
    if (force) setRegenerating(true);
    else setLoading(true);

    try {
      const data = force
        ? await api.generatePlan(selectedCity, true)
        : await api.getTodayPlan(selectedCity);
      setPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRegenerating(false);
    }
  }, [selectedCity]);

  useEffect(() => {
    fetchPlan(false);
  }, [fetchPlan]);

  const handleStatusChange = async (activityId: string, status: "pending" | "completed" | "skipped") => {
    try {
      const updated = await api.updateActivityStatus(activityId, status);
      if (plan) {
        setPlan({
          ...plan,
          activities: plan.activities.map((a) => (a.id === activityId ? updated : a)),
        });
      }
    } catch {
      if (plan) {
        setPlan({
          ...plan,
          activities: plan.activities.map((a) =>
            a.id === activityId ? { ...a, status } : a
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
        <p className="text-sm font-semibold text-gray-500">Generating Personalized Environmental Routine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header & Regenerate */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-[#1F8A63]" />
            <h1 className="text-2xl sm:text-3xl font-black text-[#102D26] tracking-tight">
              My Daily Environmental Plan
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Personalized schedule aligning workout, commute, and home ventilation with live atmospheric curves.
          </p>
        </div>

        <button
          onClick={() => fetchPlan(true)}
          disabled={regenerating}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F8A63] hover:bg-[#187050] text-white text-xs font-bold shadow-md transition disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${regenerating ? "animate-spin" : ""}`} />
          <span>{regenerating ? "Synthesizing..." : "Regenerate Plan"}</span>
        </button>
      </div>

      {/* Safety Guidelines Banner */}
      {plan && plan.safety_guidelines && (
        <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1F8A63]">
            <ShieldAlert className="w-4 h-4" />
            <span>Deterministic Safety Constraints Active</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
            {plan.safety_guidelines.map((line, idx) => (
              <div key={idx} className="bg-[#F3F6F1] p-3 rounded-2xl text-xs font-semibold text-[#202B27]">
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Plan Activities Grid */}
      {plan && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#102D26]">Daily Routine Milestones</h2>
            <span className="text-xs font-semibold text-gray-400">
              Completed: {plan.activities.filter((a) => a.status === "completed").length} / {plan.activities.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plan.activities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regeneration Policy Notice */}
      <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/60 text-xs text-emerald-950 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#1F8A63] shrink-0 mt-0.5" />
        <span>
          <strong>Regeneration Policy:</strong> Plans are automatically recalculated when local AQI changes by more than 25 points, when rain washes out particulates, or when you switch locations in settings.
        </span>
      </div>
    </div>
  );
}
