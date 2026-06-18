/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Shield, Mail, Lock, AlertCircle, ArrowLeft, Key } from "lucide-react";
import { UserRole } from "../types";

interface LoginViewProps {
  onLoginSuccess: (role: UserRole) => void;
  onCancel: () => void;
}

export default function LoginView({ onLoginSuccess, onCancel }: LoginViewProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Vänligen fyll i alla fält.");
      return;
    }

    setIsLoading(true);

    // Simulated login delay
    setTimeout(() => {
      setIsLoading(false);
      // Let's accept some standard logins for evaluation
      const lowerEmail = email.toLowerCase();
      if (lowerEmail === "admin@staket.se" && password === "admin123") {
        onLoginSuccess("Administrator");
      } else if (lowerEmail === "styrelse@staket.se" && password === "styrelse123") {
        onLoginSuccess("Styrelse");
      } else if (lowerEmail === "medlem@staket.se" && password === "medlem123") {
        onLoginSuccess("Medlem");
      } else {
        setError("Felaktig e-postadress eller lösenord. Tips: Använd snabbvalen nedan eller skriv admin@staket.se / admin123");
      }
    }, 1200);
  };

  const handleQuickLogin = (selectedRole: UserRole) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(selectedRole);
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-slate-50/50 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl relative overflow-hidden transition-all duration-300 hover:shadow-2xl">
        {/* Background Accent Gradients */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

        {/* Back navigation */}
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer group mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
          Tillbaka till hemsidan
        </button>

        <div className="text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 mb-4">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-sans font-bold tracking-tight text-slate-900">
            Logga in på Föreningsportalen
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Brf. Stäkets Företagscenter medlems- &amp; styrelseportal
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-3 text-xs text-rose-700 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <p className="leading-tight">{error}</p>
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label htmlFor="email-address" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              E-postadress
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="namn@foretag.se"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label htmlFor="password" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Lösenord
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-xs font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all cursor-pointer shadow-md shadow-blue-500/10 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  Loggar in...
                </span>
              ) : (
                "Logga in"
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-3 text-[10px] font-bold text-slate-400 tracking-wider">
              Testa Portalen (Snabbval)
            </span>
          </div>
        </div>

        {/* Quick Testing Options */}
        <div className="space-y-2.5">
          <button
            onClick={() => handleQuickLogin("Styrelse")}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-violet-100 bg-violet-50/50 hover:bg-violet-50 hover:border-violet-200 transition-all text-left cursor-pointer group text-xs font-semibold text-violet-900"
          >
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-violet-500 group-hover:scale-110 transition-transform" />
              <div>
                <span className="block font-bold">Styrelseinloggning (Full Access)</span>
                <span className="block text-[10px] text-violet-500/80 font-normal">Testa styrelsefiler &amp; administration</span>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-violet-500 bg-white border border-violet-100 rounded-md px-2 py-0.5">Styrelse</span>
          </button>

          <button
            onClick={() => handleQuickLogin("Medlem")}
            disabled={isLoading}
            className="w-full flex items-center justify-between p-3.5 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-50 hover:border-blue-200 transition-all text-left cursor-pointer group text-xs font-semibold text-blue-900"
          >
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
              <div>
                <span className="block font-bold">Medlemsinloggning</span>
                <span className="block text-[10px] text-blue-500/80 font-normal">Testa anslagstavla &amp; medlemsfiler</span>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 bg-white border border-blue-100 rounded-md px-2 py-0.5">Medlem</span>
          </button>
        </div>
      </div>
    </div>
  );
}
