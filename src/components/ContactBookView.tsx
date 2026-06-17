/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Search, Mail, Phone, MapPin, Building, Copy, FileText, Check } from "lucide-react";
import { UserProfile } from "../types";

interface ContactBookViewProps {
  profiles: UserProfile[];
}

export default function ContactBookView({ profiles = [] }: ContactBookViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Instant filter by name, company, unit, or email
  const filteredProfiles = profiles.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.company.toLowerCase().includes(q) ||
      p.unit.toLowerCase().includes(q) ||
      p.email.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8 animate-fade-in" id="contact-book">
      {/* Header section */}
      <div className="space-y-1">
        <h1 className="text-3xl font-sans font-bold tracking-tight text-slate-900">Kontaktboken</h1>
        <p className="text-slate-500 text-sm">
          Sök och kontakta andra medlemmar eller företag i huset. Ange lokalnummer eller företagsnamn för att filtrera.
        </p>
      </div>

      {/* Sökfält & Tips banner */}
      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            id="input-contact-search"
            type="text"
            placeholder="Sök på Namn, Lokal (t.ex. '22'), Företag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500 transition-colors"
          />
        </div>

        <div className="text-[11px] text-slate-400 font-medium">
          Hittade {filteredProfiles.length} medlemmar
        </div>
      </div>

      {/* Profiles list */}
      {filteredProfiles.length === 0 ? (
        <div className="border border-dashed border-slate-200 p-12 rounded-2xl text-center bg-slate-50/50 space-y-2">
          <p className="font-bold text-slate-700 text-sm">Ingen medlem hittades</p>
          <p className="text-xs text-slate-400">Pröva att söka på ett annat lokalnummer eller efternamn.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProfiles.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-sm transition-all p-5 flex flex-col justify-between hover:border-slate-200 relative overflow-hidden"
            >
              {/* Card visual accent based on role */}
              <div className={`absolute top-0 left-0 w-1.5 h-full ${p.role === "Styrelse" ? "bg-emerald-500" : "bg-slate-300"}`} />

              <div className="space-y-4 pl-2">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-block px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-slate-700 bg-slate-100 rounded-md uppercase border border-slate-200">
                      {p.unit}
                    </span>
                    {p.role === "Styrelse" && (
                      <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 rounded-md uppercase border border-emerald-100">
                        Styrelse / Ledamot
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mt-2">{p.name}</h3>
                </div>

                {/* Company details */}
                <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 space-y-1 text-xs">
                  <div className="flex gap-2 items-center text-slate-700 font-medium">
                    <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{p.company}</span>
                  </div>
                  <div className="flex gap-2 items-center text-[10px] text-slate-400">
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span>Org.nr: {p.orgNr}</span>
                  </div>
                </div>

                {/* Core Communication info */}
                <div className="space-y-2.5 text-xs text-slate-600 pt-1">
                  <div className="flex gap-2.5 items-center">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a
                      href={`mailto:${p.email}`}
                      className="text-emerald-600 hover:text-emerald-800 font-medium truncate flex-1 hover:underline"
                    >
                      {p.email}
                    </a>
                    <button
                      onClick={() => handleCopyEmail(p.email, p.id)}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0 transition-colors"
                      title="Kopiera e-post"
                    >
                      {copiedId === p.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>

                  <div className="flex gap-2.5 items-center">
                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <a
                      href={`tel:${p.phone}`}
                      className="text-slate-600 hover:text-slate-900 font-medium hover:underline flex-1"
                    >
                      {p.phone}
                    </a>
                  </div>

                  <div className="flex gap-2.5 items-start">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-[11px] text-slate-500 leading-tight flex-1">
                      {p.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
