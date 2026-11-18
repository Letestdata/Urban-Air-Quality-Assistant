"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Wind,
  Shield,
  Calendar,
  Home,
  Users,
  Compass,
  Leaf,
  BotMessageSquare,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Info,
  Clock,
  Layers
} from "lucide-react";
import { AQIBadge } from "@/components/common/AQIBadge";

export default function LandingPage() {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does Urban Air AI calculate the Air Quality Index?",
      a: "We strictly implement the official Central Pollution Control Board (CPCB) India National Air Quality Index (NAQI) linear interpolation standard for all 6 criteria pollutants (PM2.5, PM10, NO2, SO2, CO, O3). The overall index is dictated by the highest pollutant sub-index."
    },
    {
      q: "Can the AI provide medical advice or prescribe treatments?",
      a: "No. Urban Air AI is an environmental intelligence and routine planning tool, not a clinical provider. Our AI runs beneath a deterministic safety layer that strictly forbids medical diagnoses, drug prescriptions, or clinical treatment promises."
    },
    {
      q: "How does the AI create my personalized daily plan?",
      a: "The engine pairs verified ground telemetry (AQI, temperature, solar boundary layer mixing) with your daily schedule, commute mode, and exercise habits. If outdoor air exceeds safe thresholds (e.g. AQI > 200), outdoor workouts are automatically replaced with indoor routines."
    },
    {
      q: "Does the app require continuous GPS location tracking?",
      a: "No. Location permission is 100% optional. You can manually select from our supported Indian cities (Delhi, Ahmedabad, Mumbai, Bengaluru, Pune, Hyderabad, and more) without sharing GPS coordinates."
    },
    {
      q: "How does the carbon impact calculator work?",
      a: "When you choose a sustainable transit option (like the Metro or electric bus instead of a private petrol car), we compute the avoided CO2e using verified passenger-km emission factors. We clearly distinguish personal emissions avoided from city ambient AQI."
    }
  ];

  return (
    <div className="min-h-screen bg-[#F3F6F1] text-[#202B27] flex flex-col">
      {/* Navigation Bar */}
      <header role="banner" className="sticky top-0 z-50 bg-[#102D26] text-white border-b border-[#174638] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F8A63] to-[#80C9A4] flex items-center justify-center text-[#102D26] font-bold shadow-md">
              <Wind className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight text-white">Urban Air AI</span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#174638] text-[#80C9A4]">
                India First
              </span>
            </div>
          </Link>

          <nav aria-label="Main Navigation" className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-200">
            <a href="#how-it-works" className="hover:text-[#80C9A4] transition">How It Works</a>
            <a href="#features" className="hover:text-[#80C9A4] transition">Features</a>
            <a href="#preview" className="hover:text-[#80C9A4] transition">Daily Planner</a>
            <a href="#faq" className="hover:text-[#80C9A4] transition">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-semibold text-gray-200 hover:text-white px-3 py-1.5 rounded-lg transition"
            >
              Sign In
            </Link>
            <Link
              href="/onboarding"
              className="bg-[#1F8A63] hover:bg-[#187050] text-white text-sm font-bold px-4 py-2 rounded-xl shadow-sm transition flex items-center gap-1.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area Landmark */}
      <main id="main-content" role="main" className="flex-1">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#102D26] via-[#174638] to-[#102D26] text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#174638]/80 border border-[#80C9A4]/30 text-[#80C9A4] text-xs font-semibold shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Environmental Intelligence Designed for India</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-4xl mx-auto leading-tight">
            Understand Your Air. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#80C9A4] to-[#e2f5ed]">
              Plan Your Day Smarter.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Urban Air AI turns air-quality and weather information into personalized daily guidance for your home, family, and lifestyle.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboarding"
              className="w-full sm:w-auto px-8 py-3.5 bg-[#1F8A63] hover:bg-[#187050] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 text-base"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-xl border border-white/20 transition flex items-center justify-center gap-2 text-base"
            >
              <span>Explore Live Dashboard</span>
            </Link>
          </div>

          {/* Interactive Hero Card Preview */}
          <div className="pt-10 max-w-3xl mx-auto">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 text-left shadow-2xl border border-white/20 text-[#202B27]">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Live Indian Station Telemetry</span>
                  <h2 className="text-lg font-bold text-[#102D26]">Delhi NCR — Anand Vihar CAAQMS</h2>
                </div>
                <AQIBadge aqi={148} category="Moderate" size="md" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
                <div className="bg-[#F3F6F1] p-3 rounded-xl">
                  <span className="text-[11px] text-gray-500 font-semibold">PM2.5</span>
                  <p className="text-xl font-black text-[#102D26]">68.4 <span className="text-xs font-normal">µg/m³</span></p>
                </div>
                <div className="bg-[#F3F6F1] p-3 rounded-xl">
                  <span className="text-[11px] text-gray-500 font-semibold">PM10</span>
                  <p className="text-xl font-black text-[#102D26]">132.0 <span className="text-xs font-normal">µg/m³</span></p>
                </div>
                <div className="bg-[#F3F6F1] p-3 rounded-xl">
                  <span className="text-[11px] text-gray-500 font-semibold">Temperature</span>
                  <p className="text-xl font-black text-[#102D26]">26.5°C</p>
                </div>
                <div className="bg-[#F3F6F1] p-3 rounded-xl">
                  <span className="text-[11px] text-gray-500 font-semibold">Ventilation</span>
                  <p className="text-sm font-bold text-[#1F8A63] mt-1">1:00 PM Window</p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-950 font-medium">
                <Info className="w-4 h-4 text-[#1F8A63] shrink-0 mt-0.5" />
                <span>
                  <strong>Today's Planner Advice:</strong> Shift strenuous outdoor cardio to the afternoon solar dispersion window (12 PM - 3 PM) when vertical boundary layer mixing is highest.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How Urban Air AI Works */}
      <section id="how-it-works" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F8A63]">Science-Backed Architecture</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#102D26] mt-2">
            How Urban Air AI Works
          </h2>
          <p className="text-base text-gray-600 mt-3">
            Translating complex ambient measurements into practical, human actions without overwhelming jargon.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1F8A63] flex items-center justify-center font-bold mb-4">
              1
            </div>
            <h3 className="font-bold text-base text-[#102D26] mb-2">Location & Lifestyle</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Tell us your city, commute habits, wake-up schedule, and whether you run, walk, or manage a household with children or seniors.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1F8A63] flex items-center justify-center font-bold mb-4">
              2
            </div>
            <h3 className="font-bold text-base text-[#102D26] mb-2">Environmental Data</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              We ingest verified CPCB and CAAQMS measurements: PM2.5, PM10, gases, and weather forecasts with strict freshness indicators.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1F8A63] flex items-center justify-center font-bold mb-4">
              3
            </div>
            <h3 className="font-bold text-base text-[#102D26] mb-2">Deterministic Safety</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Layer 1 safety rules strictly bound the AI. If AQI exceeds 200, outdoor running is prohibited, and indoor alternatives are enforced.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#1F8A63] flex items-center justify-center font-bold mb-4">
              4
            </div>
            <h3 className="font-bold text-base text-[#102D26] mb-2">Personalized Daily Plan</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Get 4 time-bracketed recommendations for morning, afternoon, evening, and night with clear reasons and practical alternatives.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 px-6 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-[#1F8A63]">Comprehensive Platform</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#102D26] mt-2">
              Everything You Need to Breathe Better
            </h2>
            <p className="text-base text-gray-600 mt-3">
              Designed from the ground up for Indian households, urban commuters, and active individuals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-[#F3F6F1] border border-gray-200/80">
              <Calendar className="w-8 h-8 text-[#1F8A63] mb-4" />
              <h3 className="font-bold text-lg text-[#102D26] mb-2">AI Daily Planner</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Automatically adapts your morning run, commute timing, and evening errands to the day's atmospheric dispersion curve.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F3F6F1] border border-gray-200/80">
              <Home className="w-8 h-8 text-[#1F8A63] mb-4" />
              <h3 className="font-bold text-lg text-[#102D26] mb-2">Indoor Air & CADR Sizing</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Determine the exact Clean Air Delivery Rate for your bedroom and know precisely when to open windows versus keeping them sealed.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F3F6F1] border border-gray-200/80">
              <Users className="w-8 h-8 text-[#1F8A63] mb-4" />
              <h3 className="font-bold text-lg text-[#102D26] mb-2">Family Profiles</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Tailored activity protection for children, senior citizens, expectant mothers, and sensitive individuals with respiratory allergies.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F3F6F1] border border-gray-200/80">
              <Compass className="w-8 h-8 text-[#1F8A63] mb-4" />
              <h3 className="font-bold text-lg text-[#102D26] mb-2">Smart Route Comparisons</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Compare travel corridors by transit micro-environment exposure (Metro vs Car vs Two-Wheeler) and estimated travel duration.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F3F6F1] border border-gray-200/80">
              <Leaf className="w-8 h-8 text-[#1F8A63] mb-4" />
              <h3 className="font-bold text-lg text-[#102D26] mb-2">My Carbon Impact</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Track kilograms of CO2e avoided when you choose low-emission travel, with transparent formulas and tree equivalents.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#F3F6F1] border border-gray-200/80">
              <BotMessageSquare className="w-8 h-8 text-[#1F8A63] mb-4" />
              <h3 className="font-bold text-lg text-[#102D26] mb-2">Grounded AI Assistant</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ask questions about pollutants, masks, and ventilation, backed by citations from CPCB, WHO, and environmental research.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1F8A63]">Common Questions</span>
          <h2 className="text-3xl font-extrabold text-[#102D26] mt-2">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <button
                onClick={() => setFaqOpen(faqOpen === idx ? null : idx)}
                className="w-full text-left p-5 font-bold text-base text-[#102D26] flex items-center justify-between hover:bg-gray-50 transition"
              >
                <span>{faq.q}</span>
                <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${faqOpen === idx ? "rotate-90 text-[#1F8A63]" : ""}`} />
              </button>
              {faqOpen === idx && (
                <div className="p-5 pt-0 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-[#102D26] text-white py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
            Take Control of Your Daily Environmental Health
          </h2>
          <p className="text-base text-gray-300">
            Join thousands of individuals and families making informed, healthier daily decisions in Indian cities.
          </p>
          <div className="pt-2">
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#1F8A63] hover:bg-[#187050] text-white font-bold rounded-xl shadow-lg transition text-base"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
      </main>

      {/* Footer */}
      <footer role="contentinfo" className="bg-[#0b201b] text-gray-400 text-xs py-8 px-6 border-t border-[#174638]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Urban Air AI. Breathe Smarter. Live Healthier. India First.</p>
          <p className="text-center sm:text-right">
            CPCB NAQI methodology compliant. Environmental guidance only; not medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}
