/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Search, Building2 } from "lucide-react";
import { UserProfile } from "../types";
import { loadProfiles } from "../initialData";

interface OurCompaniesViewProps {
  profiles?: UserProfile[];
}

export default function OurCompaniesView({ profiles }: OurCompaniesViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const activeProfiles = useMemo(() => {
    const list = profiles && profiles.length > 0 ? profiles : loadProfiles();
    // Filter profiles that represent active companies (have a company name and are not administrators)
    return list.filter((p) => p.company && p.company.trim() !== "" && p.role !== "Administrator");
  }, [profiles]);

  const filteredCompanies = useMemo(() => {
    return activeProfiles.filter((p) =>
      p.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeProfiles, searchQuery]);

  return (
    <div className="space-y-8 animate-fade-in" id="companies-view-root">
      <div className="space-y-3">
        <span className="text-[11px] font-black uppercase tracking-widest text-[#B68F52]">
          Etablerade Verksamheter
        </span>
        <h1 className="text-3xl font-sans font-bold tracking-tight text-[#0B2C24] leading-none">
          Våra Företag
        </h1>
        <p className="text-slate-500 max-w-2xl text-xs leading-relaxed">
          Här presenteras de företag och verksamma entreprenörer som är hyresgäster och medlemmar i Stäket Företagscenter. Registret administreras direkt av föreningsstyrelsen.
        </p>
      </div>

      {/* SEARCH CONTROL */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Sök efter företag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-105 rounded-xl pl-9.5 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-[#0B2C24]/30 focus:border-[#0B2C24]/30 text-slate-700"
          />
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {filteredCompanies.length} Företag listade
        </div>
      </div>

      {/* Grid of Company Logo Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredCompanies.map((profile) => {
          // Check if logo exists and has image characteristics
          const hasRealLogo =
            profile.logo &&
            (profile.logo.startsWith("http://") ||
              profile.logo.startsWith("https://") ||
              profile.logo.startsWith("data:"));

          return (
            <div
              key={profile.id}
              className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col items-center justify-center text-center space-y-4 hover:border-slate-200 transition-all shadow-3xs hover:shadow-2xs h-48 group"
            >
              {/* Logo Wrapper */}
              <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100/80 flex items-center justify-center p-2.5 overflow-hidden transition-transform group-hover:scale-105 duration-300 relative">
                {hasRealLogo ? (
                  <img
                    src={profile.logo}
                    alt={profile.company}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full rounded-xl bg-[#0B2C24]/5 border border-[#0B2C24]/10 flex flex-col items-center justify-center text-[#0B2C24] uppercase">
                    <span className="text-xl font-bold font-sans tracking-wider">
                      {profile.company.substring(0, 2)}
                    </span>
                    {profile.logo && (
                      <span className="text-[8px] text-slate-405 font-mono mt-0.5 truncate max-w-[60px] block">
                        {profile.logo}
                      </span>
                    )}
                  </div>
                )}
                {/* Visual Accent */}
                <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#B68F52] opacity-70"></div>
              </div>

              {/* Company Name */}
              <div className="space-y-1 w-full px-1">
                <h3 className="font-bold text-slate-800 text-xs sm:text-xs line-clamp-2 leading-snug group-hover:text-[#B68F52] transition-colors">
                  {profile.company}
                </h3>
                {profile.unit && profile.unit !== "Ej angivet" && (
                  <span className="text-[9px] font-black tracking-wider text-slate-400 uppercase">
                    {profile.unit}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {filteredCompanies.length === 0 && (
          <div className="col-span-full bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
            <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-xs italic">Inga företag matchade din sökning.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3.5 text-[11px] font-bold bg-[#0B2C24] text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Återställ sökning
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
