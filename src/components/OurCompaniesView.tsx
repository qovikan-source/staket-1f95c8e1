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
    return list.filter((p) => p.company && p.company.trim() !== "" && p.role !== "Administrator" && !p.hideInCompanyPage);
  }, [profiles]);

  const filteredCompanies = useMemo(() => {
    return activeProfiles.filter((p) =>
      p.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [activeProfiles, searchQuery]);

  return (
    <div className="space-y-8 animate-fade-in" id="companies-view-root">
      <div className="space-y-3">
        <span className="text-sm sm:text-base font-black uppercase tracking-widest text-[#B68F52]">
          ETABLERADE VERKSAMHETER
        </span>
        <h1 className="text-3xl font-sans font-bold tracking-tight text-[#0B2C24] leading-none">
          VÅRA FÖRETAG
        </h1>
        <p className="text-slate-650 max-w-3xl text-base sm:text-lg leading-relaxed">
          Här presenteras de företag och verksamma entreprenörer som är hyresgäster och medlemmar i Stäket Företagscenter. Registret administreras direkt av föreningsstyrelsen.
        </p>
      </div>

      {/* SEARCH CONTROL */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            aria-label="Sök efter företag"
            placeholder="Sök efter företag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-105 rounded-xl pl-9.5 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0B2C24]/30 focus:border-[#0B2C24]/30 text-slate-700"
          />
        </div>
        <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">
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

          const hasWebsite = profile.website && profile.website.trim() !== "";
          const handleClick = () => {
            if (hasWebsite) {
              let url = profile.website.trim();
              if (!/^https?:\/\//i.test(url)) {
                url = `https://${url}`;
              }
              window.open(url, "_blank", "noopener,noreferrer");
            }
          };

          return (
            <div
              key={profile.id}
              onClick={handleClick}
              className={`bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col justify-between hover:border-slate-200 transition-all shadow-3xs hover:shadow-2xs h-48 group text-center ${
                hasWebsite ? "cursor-pointer hover:scale-[1.02]" : "cursor-default"
              }`}
            >
              {/* Upper Part - Logo Container */}
              <div className="w-full h-32 bg-slate-50/60 border-b border-slate-100/80 flex items-center justify-center p-4 relative overflow-hidden transition-colors group-hover:bg-slate-50 duration-300">
                {hasRealLogo ? (
                  <img
                    src={profile.logo}
                    alt={profile.company}
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-full object-contain transition-transform group-hover:scale-105 duration-300"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#0B2C24]/5 border border-[#0B2C24]/10 flex flex-col items-center justify-center text-[#0B2C24] uppercase transition-transform group-hover:scale-105 duration-300">
                    <span className="text-base font-bold font-sans tracking-wider">
                      {profile.company.substring(0, 2)}
                    </span>
                  </div>
                )}
                {/* Glassmorphic Website Hover Overlay */}
                {hasWebsite && (
                  <div className="absolute inset-0 bg-[#0B2C24]/60 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <span className="text-white text-xs font-bold uppercase tracking-wider bg-slate-950/40 px-3 py-1.5 rounded-full border border-white/20">
                      Besök hemsida ↗
                    </span>
                  </div>
                )}
                {/* Visual Accent */}
                <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#B68F52] opacity-70"></div>
              </div>

              {/* Lower Part - Company Text info */}
              <div className="p-3 flex-1 flex flex-col justify-center items-center w-full min-w-0">
                <h3 className="font-extrabold text-slate-800 text-sm sm:text-[14.5px] line-clamp-2 leading-snug group-hover:text-[#B68F52] transition-colors w-full">
                  {profile.company}
                </h3>
                {profile.unit && profile.unit !== "Ej angivet" && (
                  <span className="text-[10px] font-black tracking-widest text-[#B68F52] uppercase mt-0.5 block">
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
            <p className="text-slate-600 text-sm sm:text-base italic">Inga företag matchade din sökning.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3.5 text-xs font-bold bg-[#0B2C24] text-white px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Återställ sökning
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
