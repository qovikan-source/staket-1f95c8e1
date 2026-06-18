/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, 
  Warehouse, 
  Compass, 
  ArrowRight, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  Trash2, 
  Sparkles, 
  ShieldCheck 
} from "lucide-react";
import { VacantSpace, UserRole } from "../types";

interface AvailableSpacesViewProps {
  spaces?: VacantSpace[];
  role?: UserRole;
  onDeleteSpace?: (id: string) => void;
}

type SpaceCategory = "lediga-lokaler" | "kontorshotell" | "verkstad-lager" | "omradesguide";

export default function AvailableSpacesView({
  spaces = [],
  role = "Besökare",
  onDeleteSpace
}: AvailableSpacesViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<SpaceCategory>("lediga-lokaler");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMsg, setContactMsg] = useState("");
  const [contactProduct, setContactProduct] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail) return;
    setIsSubmitted(true);
    setTimeout(() => {
      setContactName("");
      setContactEmail("");
      setContactMsg("");
      setContactProduct("");
    }, 2500);
  };

  return (
    <div className="space-y-12 animate-fade-in" id="available-spaces-container">
      
      {/* Visual Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 text-slate-100 p-8 md:p-12 shadow-md">
        <div className="absolute inset-0 z-0 opacity-15">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200" 
            alt="Stäket Företagscenter kommersiella lokaler i Järfälla" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-450 border border-amber-500/20 text-[10px] font-bold uppercase tracking-wider rounded-full">
            <span className="w-1.5 h-1.5 bg-amber-450 rounded-full animate-ping"></span>
            Fakturabaserad Info &amp; Annonser
          </span>
          <h1 className="text-3xl md:text-4xl font-sans font-bold tracking-tight">
            Lediga lokaler i Järfälla — Hitta ert nya kontor eller verkstad
          </h1>
          <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
            Söker ni efter kombilokaler, verkstadslokaler, lagerytor eller kontor i Järfälla? Stäket Företagscenter på Skarprättarvägen 7 erbjuder ändamålsenliga och fräscha lokallösningar intill E18, idealiska för tillväxtföretag och etablerade verksamheter.
          </p>
        </div>
      </div>

      {/* Structured SEO Navigation Bar */}
      <div className="bg-slate-100/80 backdrop-blur-xs p-1.5 rounded-2xl border border-slate-200/60 flex flex-wrap gap-1 md:gap-1.5 justify-start">
        <button
          onClick={() => setActiveSubTab("lediga-lokaler")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
            activeSubTab === "lediga-lokaler" 
              ? "bg-white text-blue-600 shadow-xs border border-slate-200/30" 
              : "text-slate-600 hover:bg-white/50 hover:text-slate-900"
          }`}
        >
          Lediga Lokaler Järfälla ({spaces.length})
        </button>
        <button
          onClick={() => setActiveSubTab("kontorshotell")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
            activeSubTab === "kontorshotell" 
              ? "bg-white text-blue-600 shadow-xs border border-slate-200/30" 
              : "text-slate-600 hover:bg-white/50 hover:text-slate-900"
          }`}
        >
          Kontor &amp; Showroom
        </button>
        <button
          onClick={() => setActiveSubTab("verkstad-lager")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
            activeSubTab === "verkstad-lager" 
              ? "bg-white text-blue-600 shadow-xs border border-slate-200/30" 
              : "text-slate-600 hover:bg-white/50 hover:text-slate-900"
          }`}
        >
          Verkstad &amp; Lager Stockholm
        </button>
        <button
          onClick={() => setActiveSubTab("omradesguide")}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
            activeSubTab === "omradesguide" 
              ? "bg-white text-blue-600 shadow-xs border border-slate-200/30" 
              : "text-slate-600 hover:bg-white/50 hover:text-slate-900"
          }`}
        >
          Områdesguide Stäket Järfälla
        </button>
      </div>

      {/* Main Tab Content Routing */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-8">
          
          {/* TAB 1: LEDIGA LOKALER JÄRFÄLLA */}
          {activeSubTab === "lediga-lokaler" && (
            <div className="space-y-6" id="seo-tab-lediga-lokaler">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 border-l-4 border-blue-600 pl-3">
                  Att hyra lokal i Järfälla hos Brf. Stäkets Företagscenter
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Letar du efter flexibla och rymliga <strong className="text-slate-800 font-semibold">lediga lokaler i Järfälla</strong>? Det strategiska läget på Skarprättarvägen 7 i Stäket gör vårt företagscenter till ett utmärkt val för bolag som kräver bra logistiklägen nära Stockholm och Mälardalen. Våra lokaler erbjuder flexibilitet för allt från hantverk, verkstad och lager till showroom och kontor.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Föreningen sköter fastighetens gemensamma infrastruktur såsom grindar, underhåll, och sophantering med högsta professionalitet, vilket håller medlemsavgifter och driftskostnader på en stabil och konkurrenskraftig nivå i Järfälla.
                </p>
              </div>

              {/* Vacant spaces grid */}
              <div className="space-y-4 pt-2">
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Aktuella lediga lokaler (Faktabekräftade annonser)
                </h3>
                
                {spaces.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl text-center space-y-3">
                    <Building2 className="w-10 h-10 text-slate-350 mx-auto" />
                    <div>
                      <p className="font-bold text-xs text-slate-700">Inga lediga lokaler listade just nu</p>
                      <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
                        För tillfället är våra lokaler fullt uthyrda. Använd formuläret till höger för att skicka en intresseanmälan så kontaktar vi er vid förändring!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {spaces.map((space) => (
                      <div 
                        key={space.id} 
                        className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs hover:shadow-xs transition-shadow p-6 space-y-6"
                      >
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Left Panel Image with Size Overlays */}
                          <div className="w-full md:w-56 h-40 rounded-xl overflow-hidden shrink-0 bg-slate-50 border border-slate-100 relative">
                            <img 
                              src={space.imgUrl || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800"} 
                              alt={space.title} 
                              className="w-full h-full object-cover" 
                            />
                            <div className="absolute top-2 left-2 px-2.5 py-0.5 bg-slate-900 border border-slate-800 text-white rounded text-[10px] font-bold uppercase tracking-wider shadow-sm">
                              {space.totalArea.startsWith("ca ") ? space.totalArea.split(" ").slice(0, 3).join(" ") : space.totalArea.split(" ").slice(0, 2).join(" ")}
                            </div>
                          </div>

                          {/* Right Content */}
                          <div className="flex-grow space-y-4">
                            <div>
                              <div className="flex items-center justify-between gap-3 flex-wrap">
                                <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-amber-500" />
                                  {space.location} (Stäket Järfälla)
                                </span>
                                <span className="text-[10px] font-semibold text-slate-400 bg-slate-50 border border-slate-100 rounded px-2 py-0.5">
                                  Inlagd: {space.createdAt}
                                </span>
                              </div>
                              <h4 className="font-sans font-bold text-slate-900 text-base mt-1 leading-tight">
                                {space.title}
                              </h4>
                              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                                {space.description}
                              </p>
                            </div>

                            {/* Suitable For */}
                            {space.suitableFor && space.suitableFor.length > 0 && (
                              <div className="space-y-1.5">
                                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">
                                  Lokalen passar utmärkt för:
                                </span>
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-650">
                                  {space.suitableFor.map((item, index) => (
                                    <li key={index} className="flex items-start gap-1.5 leading-normal">
                                      <span className="text-amber-500 shrink-0 font-bold block">•</span>
                                      <span>{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Tech Spec Box */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100/50 space-y-1">
                            <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">Total Area</span>
                            <p className="text-xs font-semibold text-slate-800 leading-normal">{space.totalArea}</p>
                          </div>

                          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100/50 space-y-1">
                            <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block font-mono">Nedre Plan (Tak &amp; Port)</span>
                            <p className="text-xs font-semibold text-slate-700 leading-normal">{space.detailsLowerLevel}</p>
                          </div>

                          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100/50 space-y-1">
                            <span className="text-[9px] font-bold text-slate-450 uppercase tracking-wider block">Övre Plan</span>
                            <p className="text-xs font-semibold text-slate-700 leading-normal">{space.detailsUpperLevel}</p>
                          </div>
                        </div>

                        {/* Footer Details */}
                        <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100 text-xs text-slate-500 bg-slate-50/40 px-4 py-2.5 rounded-xl">
                          <span className="flex items-center gap-1.5 text-[10px] text-slate-600 font-semibold truncate leading-none">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            {space.securityInfo}
                          </span>

                          {(role === "Administrator" || role === "Styrelse") && (
                            <button
                              onClick={() => {
                                if (confirm(`Är du säker på att du vill radera annonsen "${space.title}"?`)) {
                                  onDeleteSpace?.(space.id);
                                }
                              }}
                              className="px-3 py-1 text-rose-600 hover:bg-rose-50 text-[10px] font-bold rounded-lg border border-rose-100 hover:border-rose-200 transition flex items-center gap-1 cursor-pointer shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              Radera annons
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: KONTORSHOTELL JÄRFÄLLA */}
          {activeSubTab === "kontorshotell" && (
            <div className="space-y-6" id="seo-tab-kontorshotell">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 border-l-4 border-blue-600 pl-3">
                  Kontor &amp; Showroom i Järfälla — Möjlighet till rumsindelning på Skarprättarvägen 7
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Stäket Företagscenter erbjuder attraktiva och fräscha <strong className="text-slate-800 font-semibold">kontorslokaler i Järfälla</strong> för uthyrning. Fastighetens övre plan har idag en öppen planlösning som utgör utmärkta ytor för kontor eller showroom, och kan givetvis rumsindelas om så önskas utifrån ert företags specifika önskemål och behov.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hos oss på Skarprättarvägen 7 i Stäket, Järfälla, får ni lokaler med fantastiskt läge i ett köpstarkt område intill E18, Rotebro/Stäketleden och E4:an med välkända grannar i området.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl space-y-4">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Bekräftad information för övre plan:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                    <span>Öppen planlösning som kan rumsindelas om det önskas.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                    <span>Lämpar sig utmärkt som showroom och kontor.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                    <span>24h övervakningssystem på företagscentret.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 shrink-0 mt-1.5"></span>
                    <span>Utmärkt geografiskt läge på Skarprättarvägen 7 i Järfälla.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VERKSTADSLOKAL STOCKHOLM */}
          {activeSubTab === "verkstad-lager" && (
            <div className="space-y-6" id="seo-tab-verkstad-lager">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 border-l-4 border-blue-600 pl-3">
                  Verkstads- &amp; Lagerlokaler i Järfälla — Tekniska specifikationer
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Söker ni en funktionell <strong className="text-slate-800 font-semibold">verkstad eller lagerlokal i Järfälla</strong>? Våra kombilokaler erbjuder en totalyta om ca 215 kvm fördelat lika på två plan med tillhörande egen parkering, rymlig vikport och mycket goda tekniska standarder.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Här har ni ett fantastiskt kommunikationsläge nära tunga leder som E18 samt Rotebro/Stäketleden och E4:an vilket underlättar logistiken för hantverkare, verkstäder och entreprenadfirmor.
                </p>
              </div>

              {/* Specs Table */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-3xs bg-white">
                <div className="bg-slate-50 px-5 py-3 font-bold text-slate-800 text-xs border-b border-slate-100">
                  Bekräftade tekniska specifikationer:
                </div>
                <table className="w-full text-xs text-left text-slate-600">
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="px-5 py-3 font-semibold text-slate-800 w-1/3">Vikportsmått</td>
                      <td className="px-5 py-3">Hög manuell vikport med måtten 4x4,5 meter för smidig inlastning.</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 font-semibold text-slate-800">Takhöjd (Nedre plan)</td>
                      <td className="px-5 py-3">Ca 5 meter takhöjd på det nedre planet.</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 font-semibold text-slate-800">Golv &amp; Avlopp</td>
                      <td className="px-5 py-3">God bärighet samt inbyggd golvbrunn med tillhörande oljeavskiljare.</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 font-semibold text-slate-800">Värme</td>
                      <td className="px-5 py-3">Nedre planet är utrustat med golvvärme.</td>
                    </tr>
                    <tr>
                      <td className="px-5 py-3 font-semibold text-slate-800">Säkerhet</td>
                      <td className="px-5 py-3">Bevakat företagscenter utrustat med rullgrindar och 24h övervakningssystem.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: OMRÅDESGUIDE STÄKET JÄRFÄLLA */}
          {activeSubTab === "omradesguide" && (
            <div className="space-y-6" id="seo-tab-omradesguide">
              <div className="space-y-3">
                <h2 className="text-xl font-bold text-slate-900 border-l-4 border-blue-600 pl-3">
                  Området Stäket i Järfälla — Kunder &amp; Leverantörer ett stenkast bort
                </h2>
                <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                  <img 
                    src="https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=800" 
                    alt="Stäket Järfälla strategiskt företagscenter mälardalen" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 to-transparent flex items-end p-4">
                    <p className="text-xs font-bold text-white">Stäket, Järfälla — Strategiskt placerat intill E18 &amp; E4:an</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Området <strong className="text-slate-800 font-semibold">Stäket i Järfälla</strong> (nordvästra Stockholm) har ett fantastiskt läge i köpstarkt område intill E18 samt Rotebro/Stäketleden och E4:an. Med välkända grannar som K-Rauta, Bilprovningen, Scania, Hemköp och McDonalds har området ständigt högt flöde av kunder och tung fordonstrafik.
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Detta gör geografin helt ovärderlig för hantverkare, bilhandlare, transportfirmor och lokala utlämningsställen som värdesätter smidig och omedelbar logistikkoppling till hela Storstockholmsregionen.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs">🚗 Transportleder</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Direkt anslutning till E18 och Rotebro/Stäketleden. Det tar ca 20 minuter med bil till centrala Stockholm och ca 25 minuter till Arlanda.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                  <h4 className="font-bold text-slate-800 text-xs">🛠️ Leverantörstäthet</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Direkt tillgång till tunga företagspartners, byggmaterialleverantörer, bilprovningsstationer och fackmässig verkstadskompetens på samma och närliggande gator.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Conversion focused sidebar contact form */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 text-slate-100 p-6 rounded-2xl shadow-lg space-y-5 sticky top-20">
          <div className="space-y-1.5">
            <h3 className="font-bold text-sm text-slate-100">Intresseanmälan Lokaler</h3>
            <p className="text-[11px] text-slate-450 leading-relaxed">
              Lämna era krav och uppgifter, så kontaktar styrelsen eller berörda fastighetsägare er med förslag på passande lokaler.
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-emerald-950/40 border border-emerald-500/20 p-5 rounded-xl text-center space-y-2">
              <span className="text-emerald-400 font-bold block text-xs">Anmälan Mottagen!</span>
              <p className="text-[10px] text-slate-300 leading-relaxed">
                Tack för ert intresse. Vi har tagit emot er intresseanmälan och återkommer så snart som möjligt.
              </p>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-350">Namn *</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Förnamn &amp; Efternamn"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-350">E-postadress *</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="namn@foretag.se"
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-350">Önskad lokal</label>
                {spaces.length > 0 ? (
                  <select
                    value={contactProduct}
                    onChange={(e) => setContactProduct(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white cursor-pointer"
                  >
                    <option value="">-- Välj ledig lokal --</option>
                    {spaces.map((space) => (
                      <option key={space.id} value={space.title}>
                        {space.title} ({space.totalArea.replace("ca ", "")})
                      </option>
                    ))}
                    <option value="Generell anmälan">Generell intresseanmälan (Kölista)</option>
                  </select>
                ) : (
                  <select
                    value="Generell anmälan"
                    disabled
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-400 opacity-80"
                  >
                    <option value="Generell anmälan">Generell intresseanmälan (Inga lediga kontrakt just nu)</option>
                  </select>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-350">Övriga lokalkrav (t.ex. takhöjd, el, portar)</label>
                <textarea
                  rows={3}
                  value={contactMsg}
                  onChange={(e) => setContactMsg(e.target.value)}
                  placeholder="Beskriv er verksamhet samt specifikationskrav..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold block text-xs rounded-lg transition-colors cursor-pointer text-center uppercase tracking-wide border border-amber-600 shadow-sm"
              >
                Skicka Intresseanmälan
              </button>
            </form>
          )}

          {/* Quick contact detail blocks */}
          <div className="pt-4 border-t border-slate-800 space-y-3.5 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Skarprättarvägen 7, Järfälla</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <a href="tel:0707772111" className="hover:underline hover:text-white">070 777 2111</a>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <a href="mailto:brfsfc@gmail.com" className="hover:underline hover:text-white">brfsfc@gmail.com</a>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
