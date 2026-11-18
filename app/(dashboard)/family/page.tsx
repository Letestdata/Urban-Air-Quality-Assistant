"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  Trash2,
  ShieldAlert,
  Heart,
  Baby,
  User,
  Activity,
  AlertCircle
} from "lucide-react";
import { api } from "@/lib/api";
import { FamilyMember } from "@/lib/types";

export default function FamilyPage() {
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Member Form State
  const [name, setName] = useState("");
  const [ageGroup, setAgeGroup] = useState<"child" | "adult" | "senior" | "pregnant">("child");
  const [sensitivityNotes, setSensitivityNotes] = useState("");
  const [activityPreferences, setActivityPreferences] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchMembers = async () => {
    try {
      const data = await api.getFamilyMembers();
      setMembers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.addFamilyMember({
        name,
        age_group: ageGroup,
        sensitivity_notes: sensitivityNotes || undefined,
        activity_preferences: activityPreferences || undefined,
      });
      setName("");
      setSensitivityNotes("");
      setActivityPreferences("");
      setShowAddModal(false);
      fetchMembers();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteFamilyMember(id);
      setMembers(members.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const getAgeIcon = (group: string) => {
    switch (group) {
      case "child":
        return <Baby className="w-5 h-5 text-blue-500" />;
      case "senior":
        return <Heart className="w-5 h-5 text-rose-500" />;
      case "pregnant":
        return <Activity className="w-5 h-5 text-purple-500" />;
      default:
        return <User className="w-5 h-5 text-emerald-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-sm font-semibold text-gray-500">Loading Household Intelligence Profiles...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#102D26] tracking-tight">
            Family & Household Profiles
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Tailored activity protection for children, seniors, and sensitive individuals.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1F8A63] hover:bg-[#187050] text-white text-xs font-bold shadow transition self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Add Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-200 space-y-4">
            <h2 className="text-lg font-bold text-[#102D26]">Add Household Member</h2>
            <form onSubmit={handleAddMember} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Name / Nickname</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav, Dadi, Kabir"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Age / Lifecycle Group</label>
                <select
                  value={ageGroup}
                  onChange={(e) => setAgeGroup(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm bg-white font-medium"
                >
                  <option value="child">Child (Developing respiratory system)</option>
                  <option value="adult">Adult (Standard active routine)</option>
                  <option value="senior">Senior Citizen (Cardiovascular care)</option>
                  <option value="pregnant">Expectant Mother (Particulate defense)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Environmental Sensitivities (Optional)
                </label>
                <input
                  type="text"
                  value={sensitivityNotes}
                  onChange={(e) => setSensitivityNotes(e.target.value)}
                  placeholder="e.g. Mild dust cough, seasonal asthma"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-sm"
                />
                <span className="text-[10px] text-gray-400 mt-0.5 block">
                  No medical diagnoses required. Used strictly to prioritize indoor warnings.
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-[#1F8A63] hover:bg-[#187050] text-white text-xs font-bold shadow transition disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Member Cards Grid */}
      {members.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm space-y-3">
          <Users className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-700">No family profiles added yet</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Add children, senior parents, or other household members to get specific outdoor exposure windows and precautions.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-[#1F8A63] text-white text-xs font-bold shadow"
          >
            Add First Member
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((m) => (
            <div key={m.id} className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-2xl bg-[#F3F6F1]">
                      {getAgeIcon(m.age_group)}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-[#102D26]">{m.name}</h2>
                      <span className="text-[11px] font-semibold text-gray-500 capitalize">{m.age_group}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Remove member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {m.sensitivity_notes && (
                  <div className="my-3 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/60 text-[11px] text-amber-900 font-medium">
                    Note: {m.sensitivity_notes}
                  </div>
                )}

                {/* Recommendations */}
                <div className="mt-4 space-y-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    Tailored Guidelines
                  </span>
                  <ul className="space-y-1.5 text-xs text-gray-600 leading-relaxed">
                    {m.tailored_recommendations.map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-[#1F8A63] font-bold mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
