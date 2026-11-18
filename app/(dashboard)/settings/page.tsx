"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  User,
  Globe,
  Download,
  Trash2,
  ShieldAlert,
  Check,
  AlertCircle
} from "lucide-react";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [language, setLanguage] = useState("en");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.getSettings();
        setFullName(data.full_name || "");
        setEmail(data.email || "");
        setLanguage(data.preferred_language || "en");
      } catch (err) {
        console.error(err);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await api.updateSettings({
        full_name: fullName,
        preferred_language: language,
      });
      setMessage("Settings updated successfully.");
    } catch {
      setMessage("Failed to update settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await api.exportUserData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `urban_air_export_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Failed to export data.");
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await api.deleteAccount();
      api.clearToken();
      router.push("/register");
    } catch {
      alert("Failed to delete account.");
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#102D26] tracking-tight">
          Account & Privacy Settings
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Manage your profile, language localization, data portability, and privacy rights.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-semibold text-emerald-900 flex items-center gap-2">
          <Check className="w-4 h-4 text-[#1F8A63]" />
          <span>{message}</span>
        </div>
      )}

      {/* Profile & Language Form */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-[#102D26] mb-4">General Preferences</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-gray-300 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Email (Account ID)</label>
              <input
                type="email"
                disabled
                value={email}
                className="w-full p-2.5 rounded-xl border border-gray-200 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Interface Language</label>
            <div className="flex items-center gap-3">
              {[
                { code: "en", label: "English" },
                { code: "hi", label: "हिंदी (Hindi)" },
                { code: "gu", label: "ગુજરાતી (Gujarati)" },
              ].map((lang) => (
                <button
                  type="button"
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                    language === lang.code
                      ? "bg-emerald-50 border-[#1F8A63] text-[#1F8A63]"
                      : "bg-[#F3F6F1] border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#1F8A63] hover:bg-[#187050] text-white text-xs font-bold rounded-xl shadow transition disabled:opacity-50"
            >
              {saving ? "Saving Changes..." : "Save Preferences"}
            </button>
          </div>
        </form>
      </section>

      {/* Data Portability (Export) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm space-y-3">
        <h2 className="text-lg font-bold text-[#102D26]">Data Portability (GDPR / DPDP Act)</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          Download an encrypted, machine-readable JSON archive containing all your personal routines, saved locations, family profiles, and carbon impact ledger.
        </p>
        <button
          onClick={handleExportData}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F3F6F1] hover:bg-[#e4eae0] border border-gray-200 text-xs font-bold text-gray-800 transition"
        >
          <Download className="w-4 h-4 text-[#1F8A63]" />
          <span>Export All Personal Data (.JSON)</span>
        </button>
      </section>

      {/* Account Deletion (Right to Erasure) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-rose-200 shadow-sm space-y-3">
        <h2 className="text-lg font-bold text-rose-700">Delete Account & Purge Data</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          Permanently delete your account, saved preferences, daily plans, family records, and historical logs. This action cannot be undone.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs font-bold text-rose-700 transition"
        >
          <Trash2 className="w-4 h-4 text-rose-600" />
          <span>Permanently Delete Account</span>
        </button>
      </section>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-[#102D26]">Are you absolutely sure?</h3>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                This will permanently delete your user profile and all associated data records under DPDP Act compliance.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="px-6 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow transition disabled:opacity-50"
              >
                {deleting ? "Purging..." : "Yes, Purge My Data"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
