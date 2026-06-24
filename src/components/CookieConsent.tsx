import { useState, useEffect } from "react";
import { Cookie, X, Check, Shield, Info, Settings } from "lucide-react";

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentProps {
  onViewPolicy?: () => void;
}

export default function CookieConsent({ onViewPolicy }: CookieConsentProps) {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showWidgetOnly, setShowWidgetOnly] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem("sfc-cookie-consent");
    if (!savedConsent) {
      setShowBanner(true);
    } else {
      try {
        const parsed = JSON.parse(savedConsent);
        setPreferences(parsed);
        setShowWidgetOnly(true);
      } catch (e) {
        setShowBanner(true);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = { necessary: true, analytics: true, marketing: true };
    localStorage.setItem("sfc-cookie-consent", JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    setShowBanner(false);
    setShowDetails(false);
    setShowWidgetOnly(true);
  };

  const handleRejectAll = () => {
    const onlyNecessary = { necessary: true, analytics: false, marketing: false };
    localStorage.setItem("sfc-cookie-consent", JSON.stringify(onlyNecessary));
    setPreferences(onlyNecessary);
    setShowBanner(false);
    setShowDetails(false);
    setShowWidgetOnly(true);
  };

  const handleSavePreferences = () => {
    localStorage.setItem("sfc-cookie-consent", JSON.stringify(preferences));
    setShowBanner(false);
    setShowDetails(false);
    setShowWidgetOnly(true);
  };

  const handleOpenSettings = () => {
    setShowDetails(true);
  };

  if (!showBanner && !showDetails && showWidgetOnly) {
    return (
      <button
        onClick={handleOpenSettings}
        className="fixed bottom-6 left-6 z-50 p-3 bg-white hover:bg-slate-50 text-[#0B2C24] rounded-full border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 group flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-600"
        title="Hantera cookie-inställningar"
        id="btn-cookie-settings-floating"
      >
        <Cookie className="w-5 h-5 animate-pulse text-emerald-600" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-500 ease-out text-xs font-bold uppercase tracking-wider text-slate-700 whitespace-nowrap">
          Cookies
        </span>
      </button>
    );
  }

  if (showBanner && !showDetails) {
    return (
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 bg-white border-t border-slate-200/80 shadow-2xl animate-slide-up"
        id="cookie-consent-banner"
      >
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex gap-4 items-start max-w-3xl">
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shrink-0 hidden sm:flex">
              <Cookie className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <h4 className="font-bold text-slate-800 text-sm sm:text-base flex items-center gap-2">
                Vi bryr oss om din integritet (GDPR)
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Vi använder cookies för att webbplatsen ska fungera optimalt, samt för att samla in anonym statistik om användningen i enlighet med dataskyddsförordningen (GDPR) och svensk lag. Nödvändiga cookies sparas automatiskt, men du väljer själv om du vill tillåta andra typer av cookies. {onViewPolicy && (
                  <span>Läs mer i vår <button onClick={() => { onViewPolicy(); setShowBanner(false); }} className="underline text-emerald-600 hover:text-emerald-750 font-semibold cursor-pointer">integritetspolicy</button>.</span>
                )}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto shrink-0 justify-end">
            <button
              onClick={handleOpenSettings}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Inställningar
            </button>
            <button
              onClick={handleRejectAll}
              className="px-4 py-2.5 rounded-xl border border-[#0B2C24]/20 text-[#0B2C24] hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
            >
              Neka icke-nödvändiga
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-5 py-2.5 rounded-xl bg-[#0B2C24] hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
            >
              Godkänn alla
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showDetails) {
    return (
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-[4px] z-50 flex items-center justify-center p-4 animate-fade-in"
        id="cookie-settings-modal"
      >
        <div className="bg-white rounded-3xl border border-slate-100 max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-scale-up">
          <button
            onClick={() => {
              if (localStorage.getItem("sfc-cookie-consent")) {
                setShowDetails(false);
              } else {
                handleRejectAll();
              }
            }}
            className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex gap-3.5 items-center pb-2 border-b border-slate-100">
            <div className="p-2.5 bg-emerald-50 rounded-2xl text-emerald-600">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Integritetsinställningar</h3>
              <p className="text-xs text-slate-500">Hantera dina val för cookies och datainsamling under GDPR</p>
            </div>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Vi värdesätter din integritet. Vissa cookies är absolut nödvändiga för att du ska kunna logga in på vår medlemsportal och använda de skyddade funktionerna. Andra används för att förbättra användarupplevelsen och ger oss ovärderlig data om portalens prestanda. {onViewPolicy && (
                <span>Läs mer i detalj i vår <button onClick={() => { onViewPolicy(); setShowDetails(false); }} className="underline text-[#0B2C24] hover:text-emerald-750 font-semibold cursor-pointer">integritetspolicy &amp; cookiepolicy</button>.</span>
              )}
            </p>

            {/* Necessary */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-800">Nödvändiga Cookies</span>
                  <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-black uppercase">Obligatorisk</span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Krävs för grundläggande funktioner som inloggning, sessionshantering, dokumentskydd samt säkra anslutningar till Supabase. Dessa kan inte stängas av.
                </p>
              </div>
              <div className="shrink-0 mt-1">
                <input
                  type="checkbox"
                  disabled
                  checked
                  className="w-5 h-5 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Analytics */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="font-bold text-sm text-slate-800">Statistik &amp; Analys</span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Möjliggör anonym analys av besöksfrekvenser, anslagstavleaktivitet och sidvisningar för att vi ska kunna optimera portalens prestanda och användarvänlighet.
                </p>
              </div>
              <div className="shrink-0 mt-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.analytics}
                    onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0B2C24]"></div>
                </label>
              </div>
            </div>

            {/* Marketing */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="font-bold text-sm text-slate-800">Funktionella &amp; Marknadsföring</span>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Används för att förbättra externa kartladdningar (t.ex. Google Maps på "Om oss"-sidan) samt eventuella framtida integrationer som externa kontaktformulär och chattar.
                </p>
              </div>
              <div className="shrink-0 mt-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.marketing}
                    onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0B2C24]"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-100 justify-end">
            <button
              onClick={handleRejectAll}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs sm:text-sm font-semibold transition-colors cursor-pointer order-2 sm:order-1"
            >
              Neka icke-nödvändiga
            </button>
            <button
              onClick={handleSavePreferences}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold transition-colors cursor-pointer order-3 sm:order-2"
            >
              Spara val
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-5 py-2.5 rounded-xl bg-[#0B2C24] hover:bg-emerald-800 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors cursor-pointer order-1 sm:order-3"
            >
              Godkänn alla
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
