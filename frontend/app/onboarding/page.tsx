"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Wind,
  MapPin,
  Clock,
  Activity,
  Users,
  Target,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2
} from "lucide-react";
import { api } from "@/lib/api";

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

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [city, setCity] = useState("Delhi NCR");
  const [occupation, setOccupation] = useState("office_worker");
  const [wakeTime, setWakeTime] = useState("06:30");
  const [sleepTime, setSleepTime] = useState("22:30");
  const [commuteMode, setCommuteMode] = useState("metro");
  const [exerciseType, setExerciseType] = useState("walking");
  const [hasChildren, setHasChildren] = useState(false);
  const [hasSeniors, setHasSeniors] = useState(false);
  const [goals, setGoals] = useState<string[]>([
    "Better daily planning",
    "Indoor air improvement"
  ]);
  const [loading, setLoading] = useState(false);

  const toggleGoal = (goal: string) => {
    if (goals.includes(goal)) {
      setGoals(goals.filter((g) => g !== goal));
    } else {
      setGoals([...goals, goal]);
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await api.updatePreferences({
        occupation,
        wake_time: wakeTime,
        sleep_time: sleepTime,
        commute_mode: commuteMode,
        exercise_type: exerciseType,
        environmental_goals: goals.join(", "),
        onboarding_completed: true,
      });

      // Generate first plan
      await api.generatePlan(city, true);

      router.push("/dashboard");
    } catch {
      // Gracefully continue to dashboard even if offline
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F6F1] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-gray-200/80 p-6 sm:p-10 flex flex-col justify-between min-h-[560px]">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold text-gray-400 mb-2">
            <span>STEP {step} OF 7</span>
            <span className="text-[#1F8A63]">{Math.round((step / 7) * 100)}% COMPLETED</span>
          </div>
          <div className="w-full h-2 bg-[#F3F6F1] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1F8A63] transition-all duration-300"
              style={{ width: `${(step / 7) * 100}%` }}
            />
          </div>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-[#1F8A63] flex items-center justify-center mx-auto shadow-sm">
              <Wind className="w-9 h-9" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#102D26]">Welcome to Urban Air AI</h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              Air pollution affects our health, routines, and families every day. Let's personalize your experience to turn environmental numbers into actionable daily guidance.
            </p>
            <div className="pt-2 text-xs text-gray-400">Takes less than 60 seconds • 100% privacy-conscious</div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="py-6 space-y-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-[#1F8A63]" />
              <div>
                <h2 className="text-xl font-bold text-[#102D26]">Select Your Primary City</h2>
                <p className="text-xs text-gray-500">Continuous GPS is never required. Pick your location manually.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2">
              {CITIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCity(c)}
                  className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                    city === c
                      ? "bg-emerald-50 border-[#1F8A63] text-[#1F8A63]"
                      : "bg-[#F3F6F1] border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{c}</span>
                  {city === c && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Lifestyle */}
        {step === 3 && (
          <div className="py-6 space-y-4">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-[#1F8A63]" />
              <div>
                <h2 className="text-xl font-bold text-[#102D26]">Your Daily Schedule</h2>
                <p className="text-xs text-gray-500">We optimize activity timing to avoid ground particulate spikes.</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Occupation / Routine</label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm bg-white"
                >
                  <option value="office_worker">Office Worker (Standard desk hours)</option>
                  <option value="student">Student (Campus & transit hours)</option>
                  <option value="homemaker">Homemaker / Parent (Household management)</option>
                  <option value="outdoor_worker">Outdoor / Field Worker (Active field travel)</option>
                  <option value="senior">Retired / Senior Citizen (Flexible home schedule)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Typical Wake Time</label>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Typical Sleep Time</label>
                  <input
                    type="time"
                    value={sleepTime}
                    onChange={(e) => setSleepTime(e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Primary Commute Mode</label>
                <select
                  value={commuteMode}
                  onChange={(e) => setCommuteMode(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm bg-white"
                >
                  <option value="metro">Metro / Suburban Train (Filtered Cabin)</option>
                  <option value="bus">City Bus (Electric / AC)</option>
                  <option value="car">Private Car / Cab (Cabin Filter)</option>
                  <option value="two_wheeler">Two-Wheeler / Auto-Rickshaw (Open Air)</option>
                  <option value="walk_cycle">Walking / Bicycle</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Activity Preferences */}
        {step === 4 && (
          <div className="py-6 space-y-4">
            <div className="flex items-center gap-3">
              <Activity className="w-6 h-6 text-[#1F8A63]" />
              <div>
                <h2 className="text-xl font-bold text-[#102D26]">Workout & Activity Habits</h2>
                <p className="text-xs text-gray-500">Helps us recommend safe exercise windows.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { id: "walking", label: "Brisk Walking" },
                { id: "running", label: "Running / Jogging" },
                { id: "cycling", label: "Cycling" },
                { id: "yoga", label: "Yoga & Stretching" },
                { id: "gym", label: "Indoor Gym / Weights" },
                { id: "sports", label: "Outdoor Sports" }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setExerciseType(item.id)}
                  className={`p-3.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition ${
                    exerciseType === item.id
                      ? "bg-emerald-50 border-[#1F8A63] text-[#1F8A63]"
                      : "bg-[#F3F6F1] border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{item.label}</span>
                  {exerciseType === item.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Household Preferences */}
        {step === 5 && (
          <div className="py-6 space-y-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-[#1F8A63]" />
              <div>
                <h2 className="text-xl font-bold text-[#102D26]">Household Composition</h2>
                <p className="text-xs text-gray-500">Optional. No medical diagnoses required.</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <label
                onClick={() => setHasChildren(!hasChildren)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  hasChildren ? "bg-emerald-50 border-[#1F8A63]" : "bg-[#F3F6F1] border-gray-200"
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-[#102D26]">Children in household</p>
                  <p className="text-xs text-gray-500">Adapts outdoor play safety and school commute advice.</p>
                </div>
                <input type="checkbox" checked={hasChildren} readOnly className="w-4 h-4 text-[#1F8A63]" />
              </label>

              <label
                onClick={() => setHasSeniors(!hasSeniors)}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  hasSeniors ? "bg-emerald-50 border-[#1F8A63]" : "bg-[#F3F6F1] border-gray-200"
                }`}
              >
                <div>
                  <p className="text-sm font-bold text-[#102D26]">Seniors or elderly parents</p>
                  <p className="text-xs text-gray-500">Prioritizes gentler routines and avoids early morning cold smog.</p>
                </div>
                <input type="checkbox" checked={hasSeniors} readOnly className="w-4 h-4 text-[#1F8A63]" />
              </label>
            </div>
          </div>
        )}

        {/* Step 6: Environmental Goals */}
        {step === 6 && (
          <div className="py-6 space-y-4">
            <div className="flex items-center gap-3">
              <Target className="w-6 h-6 text-[#1F8A63]" />
              <div>
                <h2 className="text-xl font-bold text-[#102D26]">Your Environmental Goals</h2>
                <p className="text-xs text-gray-500">Select what matters most to you.</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              {[
                "Better daily planning around air quality",
                "Indoor air improvement & ventilation timing",
                "Lower-emission commuting & transit savings",
                "Understanding pollutants (PM2.5, NO2, AQI)",
                "Protecting vulnerable family members"
              ].map((g) => {
                const isSelected = goals.includes(g);
                return (
                  <button
                    key={g}
                    onClick={() => toggleGoal(g)}
                    className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                      isSelected
                        ? "bg-emerald-50 border-[#1F8A63] text-[#1F8A63]"
                        : "bg-[#F3F6F1] border-gray-200 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <span>{g}</span>
                    {isSelected && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 7: Ready to Generate */}
        {step === 7 && (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1F8A63] to-[#80C9A4] text-white flex items-center justify-center mx-auto shadow-md">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-[#102D26]">You're All Set!</h2>
            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
              We're ready to combine your preferences with live CPCB air quality and atmospheric dispersion models for <strong>{city}</strong>.
            </p>
            <div className="p-3 bg-[#F3F6F1] rounded-xl text-xs text-gray-600 max-w-sm mx-auto">
              ✓ Deterministic safety engine active <br />
              ✓ Zero medical hallucinations guarantee <br />
              ✓ Diurnal ventilation timing enabled
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 7 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-[#1F8A63] hover:bg-[#187050] text-white rounded-xl text-xs font-bold shadow transition"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-3 bg-[#1F8A63] hover:bg-[#187050] text-white rounded-xl text-sm font-bold shadow-lg transition disabled:opacity-50"
            >
              {loading ? "Generating Your Plan..." : "Generate My Plan"}
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
