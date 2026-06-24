/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ShieldCheck, Map, Clock, HelpCircle, FileText, CheckCircle2 } from "lucide-react";

export default function AboutUsView() {
  const faqItems = [
    {
      q: "Vad kostar det att hyra lokal i Järfälla hos Stäket Företagscenter?",
      a: "Priserna för att hyra kontors-, lager- eller verkstadslokaler varierar beroende på lokaltid, storlek och specifika anpassningar. Kontakta oss för en direkt offert för era lokaler i Järfälla.",
    },
    {
      q: "Hur stora lokaler finns på Stäket Företagscenter?",
      a: "Vårt företagscenter huserar rymliga kombilokaler samt anpassningsbara kontorsytor utformade för mångsidig kommersiell användning.",
    },
    {
      q: "Vilka typer av företag finns etablerade på Stäket Företagscenter?",
      a: "Vi har en fantastisk bredd av branscher representerade i fastigheten. Det inkluderar bl.a. bilförsäljning, liftuthyrning, transport, system- och elektronikmontering, byggföretag, bilverkstad samt diverse framgångsrika konsultbolag.",
    },
    {
      q: "Hur tar jag mig till Stäket Företagscenter på Skarprättarvägen 7?",
      a: "Vi ligger strategiskt belägna precis intill E18 i Stäket, Järfälla (nordvästra Stockholm). Det är extremt enkelt att ta sig hit med bil och vi erbjuder fri parkering för kunder och samarbetspartners pả området.",
    },
    {
      q: "Hur gör jag om jag vill installera utrustning eller göra ändringar i min lokal?",
      a: "Innan några väsentliga ändringar eller installationer (såsom fasadändring, AC/luftkonditionering eller montering av tunga maskiner) görs på lokalen krävs skriftligt tillstånd från styrelsen i Brf Stäkets Företagscenter.",
    },
    {
      q: "Gäller min företagsförsäkring i fastigheten?",
      a: "Föreningens fastighetsförsäkring täcker endast yttre skador och byggnadsstruktur. Varje enskild hyresgäst eller bostadsrättshavare måste teckna en egen ändamålsenlig företagsförsäkring, ansvarsförsäkring och lösöresförsäkring.",
    }
  ];

  return (
    <div className="space-y-12 animate-fade-in" id="about-view">
      
      {/* Intro section aligning with old-content.md */}
      <div className="space-y-4">
        <span className="text-[13px] sm:text-xs font-black uppercase tracking-widest text-[#B68F52] hover:text-[#A37E3A] transition-colors">
          VILKA VI ÄR
        </span>
        <h1 className="text-3xl font-sans font-bold tracking-tight text-slate-900">
          BRF STÄKETS FÖRETAGSCENTER I JÄRFÄLLA
        </h1>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
          <div className="lg:col-span-8 text-slate-600 gap-y-4 flex flex-col text-[15px] sm:text-base leading-relaxed">
            <p className="font-semibold text-slate-800 text-base sm:text-lg">
              Välkommen till ett levande och väletablerat företagscenter i nordvästra Stockholm.
            </p>
            <p>
              Här på Skarprättarvägen 7 drivs olika framgångsrika verksamheter i totalt 30 lokaler. Vi har allt ifrån bilförsäljning, liftuthyrning, byggföretag, taxi, transportföretag, moderna bilverkstäder, satellit- och elektronikföretag till diverse erfarna konsultföretag.
            </p>
            <p>
              Besök området och kom förbi oss! Vi bjuder gärna på kaffe och ser hur vi kan hjälpa dig på bästa sätt. Vi tillhandahåller även attraktiva kontors-, verkstads- och lagerlokaler för uthyrning i Järfälla kommun.
            </p>
            <p className="font-medium text-slate-700">
              Vid eventuella frågor, förfrågningar om lediga lokaler eller om du vill komma i kontakt med styrelsen, är du alltid varmt välkommen att maila eller ringa oss!
            </p>
          </div>
          <div className="lg:col-span-4 bg-slate-50 border border-slate-100 p-6 rounded-2xl flex flex-col justify-between">
            <h4 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-4 border-b border-slate-200/60 pb-2">BESÖKSADRESS &amp; NAP</h4>
            <div className="space-y-3.5 text-sm text-slate-700">
              <p>
                <strong className="text-slate-800 block">Namn:</strong>
                Stäket Företagscenter (Brf SFC)
              </p>
              <p>
                <strong className="text-slate-800 block">Adress:</strong>
                Skarprättarvägen 7, 176 77 Järfälla
              </p>
              <p>
                <strong className="text-slate-800 block">Telefon:</strong>
                070 777 2111
              </p>
              <p>
                <strong className="text-slate-800 block">E-post:</strong>
                <a href="mailto:brfsfc@gmail.com" className="hover:underline text-blue-600 font-medium">brfsfc@gmail.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of commercial parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
            <Map className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Strategiskt Läge</h3>
          <p className="text-[13.5px] sm:text-sm text-slate-600 mt-1.5 leading-relaxed">Placerat direkt vid E18 i Stäket, Järfälla. Enkelt att nå för kunder och frakt.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">30 Aktiva Lokaler</h3>
          <p className="text-[13.5px] sm:text-sm text-slate-600 mt-1.5 leading-relaxed">Brett kontaktnät med kontor, tunga verkstäder och logistiklager på området.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Ekonomisk Förening</h3>
          <p className="text-[13.5px] sm:text-sm text-slate-600 mt-1.5 leading-relaxed">Ombildades 2004 för ökat lokalt medinflytande och professionell fastighetsservice.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">Organisationsnummer</h3>
          <p className="text-[13.5px] sm:text-sm text-slate-600 mt-1.5 leading-relaxed">769618-5000 (Bostadsrättsföreningen Stäkets Företagscenter)</p>
        </div>
      </div>

      {/* Embedded Map Section - Crucial for local SEO (Phase 1) */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800">HITTA TILL STÄKET FÖRETAGSCENTER</h2>
          <p className="text-sm sm:text-base text-slate-600 font-medium">Karta och vägbeskrivning till Skarprättarvägen 7 i Järfälla, Stockholm.</p>
        </div>
        <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-xs">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2025.109!2d17.7825!3d59.4586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f979774659ebf%3A0xe5a1b8ad7884614e!2sSkarpr%C3%A4ttarv%C3%A4gen%207%2C%20176%2077%20J%C3%A4rf%C3%A4lla!5e0!3m2!1ssv!2sse!4v1718660000000!5m2!1ssv!2sse" 
            width="100%" 
            height="380" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade" 
            className="w-full"
            title="Karta över Stäket Företagscenter, Skarprättarvägen 7 Järfälla"
          ></iframe>
        </div>
      </div>

      {/* FAQ Accordion Section - Phase 3 AEO friendly */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-slate-800">FRÅGOR OCH SVAR OM STÄKET FÖRETAGSCENTER</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqItems.map((faq, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs space-y-2 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-[#0B2C24] text-sm uppercase tracking-wide flex items-start gap-2 mb-3.5 border-b border-slate-100 pb-2">
                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-sm sm:text-[14.5px] text-slate-600 leading-relaxed pl-6">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
