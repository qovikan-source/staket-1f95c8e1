/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { Search, Mail, Phone, MapPin, Building, Copy, FileText, Check, List, Grid, ArrowUp, ArrowDown } from "lucide-react";
import { UserProfile } from "../types";

interface ContactBookViewProps {
  profiles: UserProfile[];
}

export default function ContactBookView({ profiles = [] }: ContactBookViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "card">("list");

  // Sorting state: default sorting on unit (Lokal) asc
  const [sortField, setSortField] = useState<keyof UserProfile>("unit");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSort = (field: keyof UserProfile) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter out:
  // 1. Administrators
  // 2. Profiles without a valid unit (Lokal) and company (Företag)
  const filteredProfiles = profiles.filter((p) => {
    if (p.role === "Administrator") return false;

    const unitVal = (p.unit || "").trim();
    const compVal = (p.company || "").trim();
    const hasUnit = unitVal !== "" && unitVal !== "Ej angivet";
    const hasCompany = compVal !== "" && compVal !== "Ej angivet" && compVal !== "Enskild Firma / Privat";

    if (!hasUnit && !hasCompany) return false;

    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      (p.company && p.company.toLowerCase().includes(q)) ||
      (p.unit && p.unit.toLowerCase().includes(q)) ||
      p.email.toLowerCase().includes(q)
    );
  });

  // Sort logic matching AdminView sorting exactly
  const sortedProfiles = [...filteredProfiles].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === "unit") {
      const aNum = parseInt((a.unit || "").replace(/\D/g, ""), 10) || 0;
      const bNum = parseInt((b.unit || "").replace(/\D/g, ""), 10) || 0;
      return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
    }

    const aStr = String(aVal || "").toLowerCase();
    const bStr = String(bVal || "").toLowerCase();

    if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
    if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-8 animate-fade-in" id="contact-book">
      {/* Header section */}
      <div className="space-y-1">
        <h1 className="text-3xl font-sans font-bold tracking-tight text-slate-900">Kontaktboken</h1>
        <p className="text-slate-500 text-sm">
          Sök och kontakta andra medlemmar eller företag i fastigheten.
        </p>
      </div>

      {/* Control bar: Search input + View Mode switcher */}
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

        <div className="flex items-center gap-4 shrink-0">
          <div className="flex border border-slate-200 rounded-xl overflow-hidden shrink-0">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === "list" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Lista
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`px-3 py-1.5 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                viewMode === "card" ? "bg-slate-900 text-white" : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              Kort
            </button>
          </div>
          <div className="text-[11px] text-slate-400 font-medium">
            Hittade {filteredProfiles.length} medlemmar
          </div>
        </div>
      </div>

      {/* Profiles display */}
      {filteredProfiles.length === 0 ? (
        <div className="border border-dashed border-slate-200 p-12 rounded-2xl text-center bg-slate-50/50 space-y-2">
          <p className="font-bold text-slate-700 text-sm">Ingen medlem hittades</p>
          <p className="text-xs text-slate-400">Pröva att söka på ett annat lokalnummer eller efternamn.</p>
        </div>
      ) : viewMode === "list" ? (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                  <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors" onClick={() => handleSort("unit")}>
                    <div className="flex items-center gap-1">
                      Lokal {sortField === "unit" && (sortDirection === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors" onClick={() => handleSort("company")}>
                    <div className="flex items-center gap-1">
                      Företag {sortField === "company" && (sortDirection === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors" onClick={() => handleSort("orgNr")}>
                    <div className="flex items-center gap-1">
                      Org.nr {sortField === "orgNr" && (sortDirection === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-1">
                      Kontaktperson {sortField === "name" && (sortDirection === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors" onClick={() => handleSort("email")}>
                    <div className="flex items-center gap-1">
                      E-post {sortField === "email" && (sortDirection === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors" onClick={() => handleSort("phone")}>
                    <div className="flex items-center gap-1">
                      Telefon {sortField === "phone" && (sortDirection === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                    </div>
                  </th>
                  <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors" onClick={() => handleSort("address")}>
                    <div className="flex items-center gap-1">
                      Adress {sortField === "address" && (sortDirection === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {sortedProfiles.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/55 transition-colors">
                    <td className="px-5 py-4 font-bold text-slate-800">
                      <span className="inline-block px-2 py-0.5 text-[10.5px] font-bold tracking-wider text-slate-700 bg-slate-100 rounded-md">
                        {p.unit}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {p.company}
                    </td>
                    <td className="px-5 py-4 text-slate-500 font-mono">{p.orgNr}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-medium text-slate-700">{p.name}</span>
                        {p.role === "Styrelse" && (
                          <span className="inline-block px-1.5 py-0.2 text-[8px] font-bold text-emerald-700 bg-emerald-50 rounded uppercase border border-emerald-100">
                            Styrelse
                          </span>
                        )}
                        {p.role === "Hyresgäst" && (
                          <span className="inline-block px-1.5 py-0.2 text-[8px] font-bold text-sky-700 bg-sky-50 rounded uppercase border border-sky-100">
                            Hyresgäst
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500 font-mono">
                      <div className="flex items-center gap-1.5">
                        <a href={`mailto:${p.email}`} className="text-emerald-600 hover:underline">{p.email}</a>
                        <button
                          onClick={() => handleCopyEmail(p.email, p.id)}
                          className="p-0.5 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0 transition-colors cursor-pointer"
                        >
                          {copiedId === p.id ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-500">
                      <a href={`tel:${p.phone}`} className="hover:underline">{p.phone}</a>
                    </td>
                    <td className="px-5 py-4 text-slate-400 truncate max-w-[150px]" title={p.address}>
                      {p.address}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Card View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProfiles.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-2xs hover:shadow-sm transition-all p-5 flex flex-col justify-between hover:border-slate-200 relative overflow-hidden"
            >
              {/* Card visual accent based on role */}
              <div className={`absolute top-0 left-0 w-1.5 h-full ${p.role === "Styrelse" ? "bg-emerald-500" : p.role === "Hyresgäst" ? "bg-sky-500" : "bg-slate-300"}`} />

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
                    {p.role === "Hyresgäst" && (
                      <span className="inline-block px-2 py-0.5 text-[9px] font-bold text-sky-700 bg-sky-50 rounded-md uppercase border border-sky-100">
                        Hyresgäst
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
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 shrink-0 transition-colors cursor-pointer"
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
