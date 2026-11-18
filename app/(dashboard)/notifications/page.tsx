"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  Check,
  ShieldCheck,
  Settings
} from "lucide-react";
import { api } from "@/lib/api";
import { NotificationItem } from "@/lib/types";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [quietHours, setQuietHours] = useState(false);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#102D26] tracking-tight">
          Notifications & Environmental Alerts
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
          Important air quality changes, plan readiness notices, and data freshness advisories.
        </p>
      </div>

      {/* Preferences Pill */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-[#102D26]">Quiet Hours & Disturbance Suppression</h2>
          <p className="text-xs text-gray-500">Mutes non-critical alerts between 10:00 PM and 7:00 AM.</p>
        </div>
        <button
          onClick={() => setQuietHours(!quietHours)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
            quietHours ? "bg-[#1F8A63] text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {quietHours ? <Check className="w-4 h-4" /> : null}
          <span>Quiet Hours: {quietHours ? "Enabled" : "Disabled"}</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-center py-10 text-xs text-gray-400">Loading alerts...</p>
        ) : notifications.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 text-xs text-gray-400">
            No active alerts or notices.
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 sm:p-5 rounded-2xl border transition flex items-start justify-between gap-4 ${
                n.is_read
                  ? "bg-white border-gray-200 opacity-75"
                  : "bg-emerald-50/50 border-emerald-300 shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-white border border-gray-200 text-[#1F8A63] shrink-0 mt-0.5">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#202B27]">{n.title}</h3>
                  <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{n.message}</p>
                  <span className="text-[10px] text-gray-400 mt-2 block">
                    {new Date(n.created_at).toLocaleDateString([], { month: "short", day: "numeric" })}{" "}
                    {new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>

              {!n.is_read && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="px-3 py-1 rounded-lg text-xs font-bold text-[#1F8A63] hover:bg-emerald-100 transition shrink-0"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
