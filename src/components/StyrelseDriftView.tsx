/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile } from "../types";

export default function StyrelseDriftView({ profiles = [] }: { profiles?: UserProfile[] }) {
  const styrelseMembers = profiles.filter(p => p.role === "Styrelse");

  const fallbackMembers = [
    { name: "Alexander Karasar", title: "Ordförande", desc: "Lokalägare som leder styrelsemöten, sköter externa leverantörer och fastighetsavtal." },
    { name: "Lotta Odbratt", title: "Vice ordförande", desc: "Sköter föreningens ekonomi tillsammans med ordföranden samt hanterar löpande fakturering, budgetering och årsredovisningar." },
    { name: "Robar Halandal", title: "Kassör / Webbansvarig", desc: "Ansvarar för föreningens digitala plattformar, IT-infrastruktur, medlemsportal samt delat ekonomi- och redovisningsansvar." },
    { name: "Rickard Holmlund", title: "Sekreterare", desc: "Lokalägare som bidrar i styrelsearbetet med teknisk expertis, underhållsprojekt och lokala frågor." },
    { name: "Yucel Onmaz", title: "Styrelsemedlem", desc: "Lokalägare som deltar i styrelsens strategiska beslut och stöttar utvecklingen av samfällighetens gemensamma ytor." },
    { name: "Murat Kizil", title: "Fastighetsförvaltare / Säkerhetsansvarig", desc: "Ansvarar för den löpande tillsynen, infartsgrindar, soprum, säkerhetsanordningar samt dagligt fastighetsunderhåll." },
  ];

  const hasDbMembers = styrelseMembers.length > 0;

  return (
    <div className="space-y-6 animate-fade-in" id="styrelse-drift-view">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 md:p-8 space-y-6">
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-800">Föreningens Styrelse &amp; Drift</h2>
          <p className="text-xs text-slate-500">Valda representanter och operativ personal för fastighetstjänster och underhåll.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          {hasDbMembers ? (
            styrelseMembers.map(member => (
              <div key={member.id} className="p-4 rounded-xl border border-slate-50 bg-slate-50/50 space-y-2">
                <h3 className="font-bold text-slate-800 text-sm">{member.name}</h3>
                <span className="inline-block px-2 py-0.5 text-[10px] bg-slate-200 text-slate-700 rounded-md font-semibold">
                  {member.boardTitle || "Styrelsemedlem"}
                </span>
                <p className="text-xs text-slate-500 mt-1">{member.description || "Ingen beskrivning angiven."}</p>
              </div>
            ))
          ) : (
            fallbackMembers.map((member, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-50 bg-slate-50/50 space-y-2">
                <h3 className="font-bold text-slate-800 text-sm">{member.name}</h3>
                <span className="inline-block px-2 py-0.5 text-[10px] bg-slate-200 text-slate-700 rounded-md font-semibold">{member.title}</span>
                <p className="text-xs text-slate-500 mt-1">{member.desc}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
