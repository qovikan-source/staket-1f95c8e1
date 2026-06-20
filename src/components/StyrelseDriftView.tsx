/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function StyrelseDriftView() {
  return (
    <div className="space-y-6 animate-fade-in" id="styrelse-drift-view">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 md:p-8 space-y-6">
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-slate-800">Föreningens Styrelse &amp; Drift</h2>
          <p className="text-xs text-slate-500">Valda representanter och operativ personal för fastighetstjänster och underhåll.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
          <div className="p-4 rounded-xl border border-slate-50 bg-slate-50/50 space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">Alexander Krasar</h3>
            <span className="inline-block px-2 py-0.5 text-[10px] bg-slate-200 text-slate-700 rounded-md font-semibold">Ordförande</span>
            <p className="text-xs text-slate-500 mt-1">Lokalägare som leder styrelsemöten, sköter externa leverantörer och fastighetsavtal.</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-50 bg-slate-50/50 space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">Lotta Odbratt</h3>
            <span className="inline-block px-2 py-0.5 text-[10px] bg-slate-200 text-slate-700 rounded-md font-semibold">Vice ordförande</span>
            <p className="text-xs text-slate-500 mt-1">Sköter föreningens ekonomi tillsammans med ordföranden samt hanterar löpande fakturering, budgetering och årsredovisningar.</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-50 bg-slate-50/50 space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">Robar Halandal</h3>
            <span className="inline-block px-2 py-0.5 text-[10px] bg-slate-200 text-slate-700 rounded-md font-semibold">Kassör / Webbansvarig</span>
            <p className="text-xs text-slate-500 mt-1">Ansvarar för föreningens digitala plattformar, IT-infrastruktur, medlemsportal samt delat ekonomi- och redovisningsansvar.</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-50 bg-slate-50/50 space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">Rickard Holmlund</h3>
            <span className="inline-block px-2 py-0.5 text-[10px] bg-slate-200 text-slate-700 rounded-md font-semibold">Styrelsemedlem</span>
            <p className="text-xs text-slate-500 mt-1">Lokalägare som bidrar i styrelsearbetet med teknisk expertis, underhållsprojekt och lokala frågor.</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-50 bg-slate-50/50 space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">Yucel Onmaz</h3>
            <span className="inline-block px-2 py-0.5 text-[10px] bg-slate-200 text-slate-700 rounded-md font-semibold">Styrelsemedlem</span>
            <p className="text-xs text-slate-500 mt-1">Lokalägare som deltar i styrelsens strategiska beslut och stöttar utvecklingen av samfällighetens gemensamma ytor.</p>
          </div>

          <div className="p-4 rounded-xl border border-slate-50 bg-slate-50/50 space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">Murat Kizil</h3>
            <span className="inline-block px-2 py-0.5 text-[10px] bg-slate-200 text-slate-700 rounded-md font-semibold">Fastighetsförvaltare / Säkerhetsansvarig</span>
            <p className="text-xs text-slate-500 mt-1">Ansvarar för den löpande tillsynen, infartsgrindar, soprum, säkerhetsanordningar samt dagligt fastighetsunderhåll.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
