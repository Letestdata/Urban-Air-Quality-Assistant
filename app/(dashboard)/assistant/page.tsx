"use client";

import React, { useState } from "react";
import {
  BotMessageSquare,
  Send,
  Sparkles,
  ShieldAlert,
  BookOpen,
  Info,
  User,
  CheckCircle2
} from "lucide-react";
import { api } from "@/lib/api";
import { useLocation } from "@/lib/location-context";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  safety_notes?: string[];
}

export default function AssistantPage() {
  const { selectedCity } = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I am your Urban Air AI Assistant. I can help explain air quality metrics (PM2.5, AQI), recommend exercise timing, suggest home ventilation windows, or guide purifier filter maintenance. How can I assist your day?",
      sources: ["CPCB National Air Quality Standards", "MoEFCC Guidelines"],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const promptChips = [
    "What is PM2.5 and why does it matter?",
    "Is it safe to go for an outdoor run today?",
    "When should I open my windows today?",
    "How do I calculate air purifier CADR for my bedroom?",
    "What medicine should I take for coughing?", // Test guardrail
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.askAssistant(textToSend, selectedCity);
      const botMsg: Message = {
        role: "assistant",
        content: res.reply,
        sources: res.sources,
        safety_notes: res.safety_notes,
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I am currently operating in offline mode. For safe guidelines: keep intense physical workouts indoors when AQI > 200, and ensure cross-ventilation during midday solar dispersion.",
          sources: ["Deterministic Safety Engine"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <BotMessageSquare className="w-6 h-6 text-[#1F8A63]" />
          <h1 className="text-2xl font-black text-[#102D26] tracking-tight">
            Environmental AI Assistant
          </h1>
        </div>
        <p className="text-xs text-gray-500 mt-0.5">
          Ask questions regarding pollution science, CPCB standards, and daily habits. Never diagnoses health conditions.
        </p>
      </div>

      {/* Chat Messages Box */}
      <div className="flex-1 bg-white rounded-3xl border border-gray-200 shadow-sm p-4 sm:p-6 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                msg.role === "user"
                  ? "bg-[#102D26] text-white"
                  : "bg-emerald-100 text-[#1F8A63]"
              }`}
            >
              {msg.role === "user" ? <User className="w-4 h-4" /> : <BotMessageSquare className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-[#1F8A63] text-white rounded-tr-none font-medium"
                  : "bg-[#F3F6F1] text-[#202B27] rounded-tl-none border border-gray-200/60"
              }`}
            >
              <p className="whitespace-pre-line">{msg.content}</p>

              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-gray-200/50 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
                  <BookOpen className="w-3.5 h-3.5 text-[#1F8A63]" />
                  <span className="font-semibold">Sources:</span>
                  <span>{msg.sources.join(" • ")}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-gray-400 font-medium pl-11">
            <Sparkles className="w-4 h-4 text-[#1F8A63] animate-pulse" />
            <span>Consulting environmental science rules engine...</span>
          </div>
        )}
      </div>

      {/* Suggested Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip)}
            className="px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:border-[#1F8A63] hover:text-[#1F8A63] text-gray-600 font-medium shrink-0 transition"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask about PM2.5, outdoor exercise safety, ventilation, or purifier sizing..."
          className="flex-1 p-3 px-4 rounded-2xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F8A63] bg-white shadow-sm"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="p-3 bg-[#1F8A63] hover:bg-[#187050] text-white rounded-2xl shadow-md transition disabled:opacity-50"
          aria-label="Send query"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
