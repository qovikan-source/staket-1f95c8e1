/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Bell, Calendar, FileText, Users, MapPin, Mail, 
  ArrowRight, Check, Building2
} from "lucide-react";
import { NoticePost, UserRole, UserProfile } from "../types";
import heroImage from "../../images/staket-foretagscenter-hero.jpg";
import bildImage from "../../images/bild.jpg";
import varaVerksamheterImage from "../../images/våra-verksamheter.jpg";
import verkstadOchLagerImage from "../../images/verkstad-och-lager.jpg";

// Import custom font for the cursive/italic text in the design
const style = document.createElement("style");
style.innerHTML = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,600&display=swap');
.font-cursive { font-family: 'Playfair Display', serif; font-style: italic; }
`;
document.head.appendChild(style);

const getNoticeAbbreviation = (dateStr?: string) => {
  if (!dateStr) return { day: "27", month: "Apr" };
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const monthNum = parseInt(parts[1], 10);
      const dayNum = parseInt(parts[2], 10);
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthAbbr = months[monthNum - 1] || "Apr";
      const formattedDay = String(dayNum).padStart(2, '0');
      return { day: formattedDay, month: monthAbbr };
    }
  } catch (e) {
    // Fallback
  }
  return { day: "27", month: "Apr" };
};

interface HomeViewProps {
  notices: NoticePost[];
  role: UserRole;
  onNavigate: (page: string) => void;
  onSetRole: (role: UserRole) => void;
  activeTab: string;
  profiles?: UserProfile[];
  onSelectNotice?: (id: string) => void;
}

export default function HomeView({ notices = [], role, onNavigate, profiles, onSelectNotice }: HomeViewProps) {
  return (
    <div className="font-sans text-[#0B2C24] bg-[#F9FAF9] animate-fade-in">
      {/* HERO SECTION */}
      <section id="hem" className="relative w-full h-[600px] lg:h-[650px] flex items-center pt-10">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImage} 
            alt="Välkommen till Stäket Företagscenter i Järfälla — din plats för produktivt arbete och möten" 
            className="w-full h-full object-cover"
          />
          {/* Dark gradient overlay left to right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 text-white">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl lg:text-6xl font-sans font-bold leading-[1.1] tracking-tight text-white drop-shadow-md">
              Välkommen till<br />
              Stäket Företagscenter
            </h1>
            
            <p className="text-xs sm:text-sm lg:text-base text-gray-200 leading-relaxed max-w-xl font-medium drop-shadow-sm pb-2">
              Stäket Företagscenter omfattar 30 kommersiella tvåplans kombilokaler i Järfälla. Lokalerna, om cirka 215 kvm, är utformade för verksamheter såsom verkstad, showroom, åkeri, hantverk, lager och kontor.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex items-center justify-center gap-2 border border-white/50 bg-black/20 backdrop-blur-sm text-white px-6 py-3 rounded-full text-[10px] font-bold tracking-wider hover:bg-white/20 transition-colors cursor-pointer" onClick={() => onNavigate("lediga_lokaler")}>
                <Calendar className="w-3.5 h-3.5" /> SE LEDIGA LOKALER
              </button>
              <button className="flex items-center justify-center gap-2 bg-white text-[#0B2C24] px-6 py-3 rounded-full text-[10px] font-bold tracking-wider hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => onNavigate("vara_foretag")}>
                VÅRA FÖRETAG <ArrowRight className="w-3.5 h-3.5 text-gray-600" />
              </button>
            </div>

            {/* Checks Row */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-[10.5px] font-medium tracking-wide">
              <div className="flex items-center gap-1.5 drop-shadow-sm">
                <div className="bg-[#8CA899] rounded-full p-0.5"><Check className="w-3 h-3 text-white stroke-[3]" /></div>
                <span>Kombilokaler (ca 215 m²)</span>
              </div>
              <div className="flex items-center gap-1.5 drop-shadow-sm">
                <div className="bg-[#8CA899] rounded-full p-0.5"><Check className="w-3 h-3 text-white stroke-[3]" /></div>
                <span>Bred branschblandning</span>
              </div>
              <div className="flex items-center gap-1.5 drop-shadow-sm">
                <div className="bg-[#8CA899] rounded-full p-0.5"><Check className="w-3 h-3 text-white stroke-[3]" /></div>
                <span>Strategiskt invid E18</span>
              </div>
              <div className="flex items-center gap-1.5 drop-shadow-sm">
                <div className="bg-[#8CA899] rounded-full p-0.5"><Check className="w-3 h-3 text-white stroke-[3]" /></div>
                <span>Fri parkering</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK FEATURE PILL BAR */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-20 -mt-16 mb-16 lg:mb-20">
        <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 flex flex-col md:flex-row items-center p-2 lg:p-0">
          <div className="flex-1 flex items-center gap-4 p-4 lg:p-6 w-full lg:w-auto hover:bg-gray-50 transition-colors rounded-l-[32px] cursor-pointer" onClick={() => onNavigate("lediga_lokaler")}>
            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-[#0B2C24]" />
            </div>
            <div>
              <h3 className="font-bold text-[#0B2C24] text-[14px]">Kombilokaler</h3>
              <p className="text-gray-500 text-[11px] leading-snug mt-0.5 max-w-[190px]">Lager, verkstad &amp; kontor i två plan</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-gray-200"></div>
          <div className="w-full h-px bg-gray-100 md:hidden my-2"></div>

          <div className="flex-1 flex items-center gap-4 p-4 lg:p-6 w-full lg:w-auto hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onNavigate("lediga_lokaler")}>
            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-[#0B2C24]" />
            </div>
            <div>
              <h3 className="font-bold text-[#0B2C24] text-[14px]">Verkstad &amp; Lager</h3>
              <p className="text-gray-500 text-[11px] leading-snug mt-0.5 max-w-[190px]">Lokaler med portar på ca 215 kvm</p>
            </div>
          </div>

          <div className="hidden md:block w-px h-12 bg-gray-200"></div>
          <div className="w-full h-px bg-gray-100 md:hidden my-2"></div>

          <div className="flex-1 flex items-center gap-4 p-4 lg:p-6 w-full lg:w-auto hover:bg-gray-50 transition-colors rounded-r-[32px] cursor-pointer" onClick={() => onNavigate("vara_foretag")}>
            <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
              <Users className="w-4 h-4 text-[#0B2C24]" />
            </div>
            <div>
              <h3 className="font-bold text-[#0B2C24] text-[14px]">30 Aktiva Företag</h3>
              <p className="text-gray-500 text-[11px] leading-snug mt-0.5 max-w-[190px]">Fordonsservice, transport, hantverk och teknik</p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION: OM STÄKET */}
      <section id="omoss" className="py-16 bg-transparent text-center px-4 scroll-mt-24">
        <div className="max-w-3xl mx-auto space-y-4 mb-10">
          <span className="font-cursive text-2xl text-[#B68F52]">Om Stäket Företagscenter</span>
          <h2 className="text-2xl md:text-[36px] font-bold text-[#0B2C24] leading-[1.2] tracking-tight">
            En plats där företag trivs <br />
            och <span className="font-cursive text-[#0B2C24] font-normal px-1 tracking-normal inline-block">utvecklas</span>
          </h2>
          
          <p className="text-[#0B2C24]/80 text-[14px] leading-relaxed max-w-lg mx-auto pb-2 font-medium italic border-l-4 border-[#B68F52] pl-4 text-left">
            "Behöver du tjänster, konsultationer eller bara byta däck eller serva bilen är du alltid välkommen över på en kopp kaffe till vårt trevliga företagscenter, vi tar gärna hand om dig."
          </p>

          <div className="max-w-[450px] mx-auto grid grid-cols-2 gap-3 pb-4">
            <div className="flex items-center gap-2 justify-start">
              <div className="w-[18px] h-[18px] rounded-full bg-[#0B2C24] text-white flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-[12px] font-bold text-[#0B2C24] text-left">Kombilokaler (ca 215 m²)</span>
            </div>
            <div className="flex items-center gap-2 justify-start">
              <div className="w-[18px] h-[18px] rounded-full bg-[#0B2C24] text-white flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-[12px] font-bold text-[#0B2C24] text-left">Strategiskt intill E18</span>
            </div>
            <div className="flex items-center gap-2 justify-start">
              <div className="w-[18px] h-[18px] rounded-full bg-[#0B2C24] text-white flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-[12px] font-bold text-[#0B2C24] text-left">Mångsidig branschbredd</span>
            </div>
            <div className="flex items-center gap-2 justify-start">
              <div className="w-[18px] h-[18px] rounded-full bg-[#0B2C24] text-white flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-[12px] font-bold text-[#0B2C24] text-left">Fria parkeringsplatser</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-6 px-4">
          {/* Card 1 */}
          <div className="group rounded-2xl overflow-hidden bg-white shadow-lg flex flex-col items-center cursor-pointer" onClick={() => onNavigate("lediga_lokaler")}>
            <div className="w-full h-56 overflow-hidden mask-image-bottom relative">
              <img src={bildImage} alt="Flexibla kombilokaler i Järfälla" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>
            <div className="px-6 pb-6 pt-4 w-full relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 bg-[#0B2C24] rounded-xl text-white flex items-center justify-center shrink-0 shadow-lg -mt-10 relative border-[3px] border-white z-20">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="text-[15px] font-bold text-[#0B2C24]">Kombilokaler</h3>
                  <ArrowRight className="w-4 h-4 text-[#0B2C24] group-hover:text-[#B68F52] transition-colors" />
                </div>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Flexibla lokaler på 215 kvm fördelat på två plan med egen port. Idealisk lösning för verksamheter som kräver både lager, verkstad och kontor.</p>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group rounded-2xl overflow-hidden bg-white shadow-lg flex flex-col items-center cursor-pointer" onClick={() => onNavigate("lediga_lokaler")}>
            <div className="w-full h-56 overflow-hidden mask-image-bottom relative">
              <img src={verkstadOchLagerImage} alt="Rymliga verkstadslokaler och lagerlokaler" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>
            <div className="px-6 pb-6 pt-4 w-full relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 bg-[#0B2C24] rounded-xl text-white flex items-center justify-center shrink-0 shadow-lg -mt-10 relative border-[3px] border-white z-20">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="text-[15px] font-bold text-[#0B2C24]">Verkstad &amp; Lager</h3>
                  <ArrowRight className="w-4 h-4 text-[#0B2C24] group-hover:text-[#B68F52] transition-colors" />
                </div>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Rymliga verkstads- och lagerlokaler i Stockholm på ca 215 kvm med smidiga rullportar och ordentlig takhöjd.</p>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group rounded-2xl overflow-hidden bg-white shadow-lg flex flex-col items-center cursor-pointer" onClick={() => onNavigate("vara_foretag")}>
            <div className="w-full h-56 overflow-hidden mask-image-bottom relative">
              <img src={varaVerksamheterImage} alt="Se etablerade företag i fastigheten" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
            </div>
            <div className="px-6 pb-6 pt-4 w-full relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 bg-[#0B2C24] rounded-xl text-white flex items-center justify-center shrink-0 shadow-lg -mt-10 relative border-[3px] border-white z-20">
                <Users className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between pb-1">
                  <h3 className="text-[15px] font-bold text-[#0B2C24]">Våra Verksamheter</h3>
                  <ArrowRight className="w-4 h-4 text-[#0B2C24] group-hover:text-[#B68F52] transition-colors" />
                </div>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">Möt våra 30 hyresgäster verksamma inom bilförsäljning, däckbyten, liftuthyrning, transport, systemelektronik och konsulttjänster.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 inline-block">
          <button className="flex items-center justify-center gap-2 bg-[#0B2C24] text-white px-6 py-3 rounded-full text-[10px] font-bold tracking-wider hover:bg-[#081e18] transition-colors mx-auto cursor-pointer" onClick={() => onNavigate("om_oss")}>
            LÄS MER OM OSS <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </section>

      {/* ANSLAGSTAVLA SECTION RIGHT ABOVE FOOTER */}
      <section className="bg-white border-t border-gray-150 py-10 px-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="space-y-1">
              <span className="font-cursive text-xl text-[#B68F52]">Anslagstavlan</span>
              <h3 className="font-bold text-[#0B2C24] text-lg tracking-tight">Senaste nytt från föreningen</h3>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...notices]
              .sort((a, b) => b.date.localeCompare(a.date))
              .slice(0, 3)
              .map((notice) => {
                const { day, month } = getNoticeAbbreviation(notice.date);
                const cleanExcerpt = notice.content.length > 120 
                ? notice.content.substring(0, 120) + "..."
                : notice.content;
              return (
                <div 
                  key={notice.id} 
                  onClick={() => {
                    if (onSelectNotice) {
                      onSelectNotice(notice.id);
                    }
                  }}
                  className="flex gap-4 items-start bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:bg-[#F9FAF9] transition-all hover:shadow-sm cursor-pointer group"
                >
                  <div className="bg-[#0B2C24] text-white px-2.5 py-1.5 flex flex-col items-center justify-center shrink-0 min-w-[55px] rounded-lg shadow-sm">
                    <span className="text-base font-bold font-mono tracking-tight leading-none text-white">{day}</span>
                    <span className="text-[8px] uppercase font-bold tracking-wider text-white/85 mt-1">{month}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-[#0B2C24] text-xs group-hover:text-[#B68F52] group-hover:underline leading-snug truncate">
                      {notice.title}
                    </h5>
                    <p className="text-gray-500 text-[11px] leading-relaxed mt-2 line-clamp-3">
                      {cleanExcerpt}
                    </p>
                  </div>
                </div>
              );
            })}
            {(!notices || notices.length === 0) && (
              <div className="col-span-full text-center py-6">
                <p className="text-gray-400 text-xs italic">Inga meddelanden publicerade ännu.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
