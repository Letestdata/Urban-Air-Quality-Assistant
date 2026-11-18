"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Wind, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#F3F6F1] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1F8A63] to-[#80C9A4] flex items-center justify-center text-[#102D26] font-bold shadow-md">
            <Wind className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black text-[#102D26] tracking-tight">Urban Air AI</span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-[#202B27]">Reset your password</h2>
        <p className="mt-1 text-xs text-gray-500">We'll send you instructions to reset your account password</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl border border-gray-200/80 rounded-2xl sm:px-10">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#1F8A63] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-[#102D26]">Check your email</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                If an account exists for <strong>{email}</strong>, you will receive a secure password reset link.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1F8A63] hover:underline pt-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#202B27] mb-1">Account Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1F8A63]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#1F8A63] hover:bg-[#187050] text-white font-bold rounded-xl shadow-md transition text-sm"
              >
                Send Reset Link
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#102D26]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
