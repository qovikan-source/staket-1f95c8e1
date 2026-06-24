import { useState } from "react";
import { Shield, Eye, Lock, FileText, Info, CheckCircle2 } from "lucide-react";

export default function PolicyView() {
  const [activeSubTab, setActiveSubTab] = useState<"integrity" | "cookies">("integrity");

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#0B2C24] to-[#124237] text-white p-8 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute right-0 bottom-0 opacity-10 transform translate-x-10 translate-y-10">
          <Shield className="w-64 h-64" />
        </div>
        <div className="relative z-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#B68F52]">Säkerhet &amp; Efterlevnad</span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Integritet &amp; Dataskydd (GDPR)</h1>
          <p className="text-sm sm:text-base text-slate-350 max-w-2xl leading-relaxed">
            Vi värnar om din personliga integritet. Här beskriver vi i detalj hur Brf. Stäkets Företagscenter behandlar dina personuppgifter i enlighet med dataskyddsförordningen (GDPR) och svensk lagstiftning.
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveSubTab("integrity")}
          className={`pb-4 text-sm sm:text-base font-bold tracking-wide transition-all border-b-2 cursor-pointer ${
            activeSubTab === "integrity"
              ? "border-[#B68F52] text-[#0B2C24]"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          INTEGRITETSPOLICY
        </button>
        <button
          onClick={() => setActiveSubTab("cookies")}
          className={`pb-4 text-sm sm:text-base font-bold tracking-wide transition-all border-b-2 cursor-pointer ${
            activeSubTab === "cookies"
              ? "border-[#B68F52] text-[#0B2C24]"
              : "border-transparent text-slate-500 hover:text-slate-700"
          }`}
        >
          COOKIEPOLICY
        </button>
      </div>

      {/* Content Stage */}
      {activeSubTab === "integrity" ? (
        <div className="space-y-8 text-[#0B2C24]" id="policy-content-integrity">
          {/* Section 1: Inledning */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold border-l-4 border-[#B68F52] pl-3">
              1. Vem är personuppgiftsansvarig?
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Brf. Stäkets Företagscenter (nedan kallat "vi", "oss" eller "föreningen") är personuppgiftsansvarig för behandlingen av personuppgifter som sker på denna webbplats samt inom ramen för medlemsportalen.
            </p>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs sm:text-sm text-slate-600 space-y-1.5">
              <p><strong>Organisation:</strong> Bostadsrättsföreningen Stäkets Företagscenter</p>
              <p><strong>Besöksadress:</strong> Skarprättarvägen 7, 176 77 Järfälla</p>
              <p><strong>Kontakt-epost:</strong> <a href="mailto:brfsfc@gmail.com" className="text-emerald-700 hover:underline">brfsfc@gmail.com</a></p>
            </div>
          </div>

          {/* Section 2: Ändamål och Rättslig Grund */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold border-l-4 border-[#B68F52] pl-3">
              2. Vilka uppgifter behandlas, varför och på vilken laglig grund?
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Enligt GDPR måste all behandling av personuppgifter vila på en rättslig grund. Vi behandlar uppgifter för följande ändamål:
            </p>

            <div className="overflow-hidden border border-slate-100 rounded-2xl shadow-3xs">
              <table className="w-full text-left text-xs sm:text-sm text-slate-650">
                <thead className="bg-slate-50 text-slate-800 font-bold border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">Ändamål / Situation</th>
                    <th className="px-4 py-3">Kategorier av uppgifter</th>
                    <th className="px-4 py-3">Rättslig grund (GDPR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  <tr>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      Kontaktformulär &amp; Intresseanmälan lokaler
                    </td>
                    <td className="px-4 py-3.5">
                      Namn, e-postadress, telefonnummer, eventuella lokalkrav samt fritextmeddelanden.
                    </td>
                    <td className="px-4 py-3.5">
                      <strong>Samtycke</strong> (genom aktivt godkännande vid inskickning av formulär) samt <strong>Intresseavvägning</strong> för att besvara era frågor.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      Administration av konton (Medlemmar &amp; Hyresgäster)
                    </td>
                    <td className="px-4 py-3.5">
                      Namn, e-post, telefonnummer, organisationsnummer, företagsnamn, fastighetsbeteckning/lokalnummer samt rollbehörighet.
                    </td>
                    <td className="px-4 py-3.5">
                      <strong>Fullgörande av avtal</strong> (stadgar samt hyres- eller bostadsrättsavtal) för att tillhandahålla portalen och kommunicera driftinformation.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      Anslagstavla &amp; Internt nätverk
                    </td>
                    <td className="px-4 py-3.5">
                      Inläggsinnehåll, skapande datum, namn på skaparen samt kommentarer.
                    </td>
                    <td className="px-4 py-3.5">
                      <strong>Berättigat intresse</strong> att möjliggöra kommunikation och samarbete mellan verksamma företagare i företagscentret.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3.5 font-semibold text-slate-800">
                      Förebyggande av missbruk &amp; Systemloggar
                    </td>
                    <td className="px-4 py-3.5">
                      IP-adresser, inloggningstider och aktivitetshistorik för kritiska ändringar.
                    </td>
                    <td className="px-4 py-3.5">
                      <strong>Rättslig förpliktelse</strong> och <strong>Berättigat intresse</strong> för att upprätthålla IT-säkerhet samt förhindra bedrägerier.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 3: Lagringstid */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold border-l-4 border-[#B68F52] pl-3">
              3. Hur länge sparar vi dina uppgifter?
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Vi sparar aldrig dina personuppgifter längre än vad som är nödvändigt för respektive ändamål:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-650 pl-2">
              <li>
                <strong>Formulärsdata:</strong> Raderas eller anonymiseras senast 12 månader efter slutlig hantering, såvida inte kontakten leder till avtal eller kölista.
              </li>
              <li>
                <strong>Användarkonton &amp; Profiler:</strong> Lagras så länge medlemskapet eller hyresavtalet är aktivt. Vid utträde raderas kontot och tillhörande data inom 30 dagar.
              </li>
              <li>
                <strong>Anslagstavleposter:</strong> Ligger kvar tills dess att skaparen raderar inlägget eller kontot avslutas, alternativt vid styrelsens moderering av inaktuellt innehåll.
              </li>
            </ul>
          </div>

          {/* Section 4: Mottagare och Dataöverföring */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold border-l-4 border-[#B68F52] pl-3">
              4. Vem delar vi informationen med?
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Dina uppgifter är säkra hos oss. Vi säljer aldrig dina uppgifter till tredje part. De kan dock delas med utvalda personuppgiftsbiträden för IT- och värdtjänster:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-slate-650 pl-2">
              <li>
                <strong>Supabase, Inc:</strong> Används för krypterad databaslagring och autentisering. All data lagras inom EU (Frankfurt-regionen).
              </li>
              <li>
                <strong>Respektive fastighetsägare:</strong> Vid lokalförfrågningar vidarebefordras kontaktformulär till den fastighetsägare som äger den specifika lokal ni visat intresse för.
              </li>
            </ul>
            <p className="text-sm text-slate-600">
              Vi strävar alltid efter att behandla all data inom EU/EES. Om en överföring till tredje land ändå skulle ske tillämpas standardavtalsklausuler (SCC) godkända av EU-kommissionen för att säkerställa skyddet.
            </p>
          </div>

          {/* Section 5: Rättigheter */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold border-l-4 border-[#B68F52] pl-3">
              5. Dina rättigheter under GDPR
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Dataskyddsförordningen ger dig stark kontroll över hur dina personuppgifter behandlas. Du har rätt att:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-slate-800">Rätt till registerutdrag</h4>
                  <p className="text-xs text-slate-500">Du kan begära en kopia av alla personuppgifter vi har sparade om dig.</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-slate-800">Rätt till rättelse</h4>
                  <p className="text-xs text-slate-500">Du kan kräva att vi rättar felaktiga eller ofullständiga uppgifter om dig.</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-slate-800">Rätt till radering ("Att bli bortglömd")</h4>
                  <p className="text-xs text-slate-500">Du har rätt att begära radering av dina uppgifter om de inte längre behövs för syftet.</p>
                </div>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <h4 className="font-bold text-sm text-slate-800">Rätt att lämna klagomål</h4>
                  <p className="text-xs text-slate-500">Du kan vända dig till Integritetsskyddsmyndigheten (IMY) om du anser att vi behandlar dina uppgifter felaktigt.</p>
                </div>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 pt-2">
              Om du vill utöva någon av dina rättigheter, skicka ett e-postmeddelande till oss på <a href="mailto:brfsfc@gmail.com" className="text-emerald-700 hover:underline">brfsfc@gmail.com</a> så hanterar vi ditt ärende skyndsamt (normalt inom 30 dagar).
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-8 text-[#0B2C24]" id="policy-content-cookies">
          {/* Section 1: Inledning */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold border-l-4 border-[#B68F52] pl-3">
              1. Vad är cookies?
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              En cookie är en liten textfil som sparas på din dator, mobiltelefon eller surfplatta när du besöker vår webbplats. Cookies gör det möjligt för oss att känna igen din webbläsare, komma ihåg om du är inloggad samt analysera trafiken för att förbättra prestandan.
            </p>
          </div>

          {/* Section 2: Cookies som används */}
          <div className="space-y-4">
            <h3 className="text-lg sm:text-xl font-bold border-l-4 border-[#B68F52] pl-3">
              2. Vilka typer av cookies använder vi?
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Vi delar in cookies i tre kategorier för att ge dig full kontroll över din data:
            </p>

            <div className="space-y-4">
              <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-3xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm sm:text-base text-slate-800">1. Nödvändiga Cookies (Alltid aktiva)</span>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-black uppercase">Sessionsbaserade</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Dessa cookies krävs för att webbplatsens kärnfunktioner ska fungera säkert. De håller reda på din aktiva inloggningssession till medlemsportalen så att du inte behöver logga in på nytt varje gång du laddar om sidan, samt skyddar mot Cross-Site Request Forgery (CSRF).
                </p>
              </div>

              <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-3xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm sm:text-base text-slate-800">2. Statistik &amp; Analys (Valbart)</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-black uppercase">Prestanda</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Hjälper oss att samla in anonymiserad data om hur besökare använder portalen. Det gör att vi kan identifiera eventuella felmeddelanden, se vilka sidor som besöks mest och optimera laddningstider.
                </p>
              </div>

              <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-3xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm sm:text-base text-slate-800">3. Funktionella &amp; Tredjepartscookies (Valbart)</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-black uppercase">Tredjepart</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Placeras när vi bäddar in externa komponenter, som Google Maps för vägbeskrivningar under kontaktavsnittet. Tredjepartsleverantörer kan spara information om hur du interagerar med kartan.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Hur man ändrar */}
          <div className="space-y-3">
            <h3 className="text-lg sm:text-xl font-bold border-l-4 border-[#B68F52] pl-3">
              3. Hur ändrar jag mina cookie-inställningar?
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Du kan när som helst ändra dina val eller återkalla ditt samtycke genom att klicka på den lilla flytande cookie-ikonen (längst ned till vänster på skärmen).
            </p>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Du kan även blockera eller radera cookies direkt via inställningarna i din webbläsare (t.ex. Chrome, Safari, Firefox eller Edge). Observera att blockering av absolut nödvändiga cookies kommer att hindra dig från att logga in på Stäket Företagscenter medlemsportal.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
