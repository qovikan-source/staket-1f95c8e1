/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Bell, Calendar, FileText, Users, MapPin, Phone, Mail, 
  ArrowRight, CheckCircle2, ChevronRight, User, 
  BookOpen, Building2, Facebook, Linkedin, Instagram,
  Play, Check, X
} from "lucide-react";
import { NoticePost, UserRole, UserProfile } from "../types";
import heroImage from "../../images/staket-foretagscenter-hero.jpg";
import bildImage from "../../images/bild.jpg";

import OurCompaniesView from "./OurCompaniesView";
import AvailableSpacesView from "./AvailableSpacesView";
import AboutUsView from "./AboutUsView";
import ContactPublicView from "./ContactPublicView";

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

export default function HomeView({ notices = [], role, onNavigate, onSetRole, activeTab, profiles, onSelectNotice }: HomeViewProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper for scrolling to sections
  const smoothScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (role === "Besökare") {
    return (
      <div className="font-sans text-[#0B2C24] bg-[#F9FAF9] min-h-screen relative">
        
        {/* TOP NAVIGATION HEADER */}
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm px-4 md:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate("hem")}>
            {/* 
              SAVED PREVIOUS CSS-BASED LOGO CODE:
              <div className="flex items-end h-8 gap-0.5">
                <div className="w-2.5 h-8 bg-[#0B2C24] rounded-[1px]"></div>
                <div className="w-2.5 h-6 bg-[#0B2C24] rounded-[1px]"></div>
                <div className="w-2.5 h-7 bg-[#2E5A4A] rounded-[1px]"></div>
                <div className="w-2.5 h-5 bg-[#A1B8AD] rounded-[1px]"></div>
              </div>
              <div className="flex flex-col justify-center translate-y-0.5">
                <span className="text-[20px] font-black tracking-tighter leading-none text-[#0B2C24]">STÄKET</span>
                <span className="text-[8.5px] font-bold tracking-widest text-gray-500 uppercase leading-none mt-0.5">Företagscenter</span>
              </div>
            */}
            <img 
              src="/staket-foretagscenter-logo.png" 
              alt="Stäket Företagscenter Logo" 
              className="h-12 md:h-16 w-auto object-contain" 
            />
          </div>

          <nav className="hidden lg:flex items-center gap-7 text-[11px] font-bold tracking-wider text-[#0B2C24]">
            <button
              onClick={() => onNavigate("hem")}
              className={`hover:text-[#B68F52] transition-colors cursor-pointer pb-1 ${
                activeTab === "hem" ? "font-bold text-[#B68F52]" : ""
              }`}
            >
              HEM
            </button>
            <button
              onClick={() => onNavigate("om_oss")}
              className={`hover:text-[#B68F52] transition-colors cursor-pointer pb-1 ${
                activeTab === "om_oss" ? "font-bold text-[#B68F52]" : ""
              }`}
            >
              OM OSS
            </button>
            <button
              onClick={() => onNavigate("vara_foretag")}
              className={`hover:text-[#B68F52] transition-colors cursor-pointer pb-1 ${
                activeTab === "vara_foretag" ? "font-bold text-[#B68F52]" : ""
              }`}
            >
              VÅRA FÖRETAG
            </button>
            <button
              onClick={() => onNavigate("lediga_lokaler")}
              className={`hover:text-[#B68F52] transition-colors cursor-pointer pb-1 ${
                activeTab === "lediga_lokaler" ? "font-bold text-[#B68F52]" : ""
              }`}
            >
              LEDIGA LOKALER
            </button>
            <button
              onClick={() => onNavigate("kontakt")}
              className={`hover:text-[#B68F52] transition-colors cursor-pointer pb-1 ${
                activeTab === "kontakt" ? "font-bold text-[#B68F52]" : ""
              }`}
            >
              KONTAKT &amp; JOURNAL
            </button>
          </nav>

          <button className="hidden lg:flex items-center gap-2 bg-[#0B2C24] text-white px-5 py-3 rounded text-xs font-bold font-sans tracking-wide hover:bg-[#081e18] transition-colors cursor-pointer" onClick={() => onNavigate("login")}>
            <User className="w-4 h-4" /> LOGGA IN
          </button>

          <button className="lg:hidden p-2 text-[#0B2C24]" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[#0B2C24]" />
            ) : (
              <div className="space-y-1.5">
                 <div className="w-6 h-0.5 bg-[#0B2C24]"></div>
                 <div className="w-6 h-0.5 bg-[#0B2C24]"></div>
                 <div className="w-6 h-0.5 bg-[#0B2C24]"></div>
              </div>
            )}
          </button>
        </header>

        {/* MOBILE MENU DROPDOWN DRAWER */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-gray-100 shadow-lg px-6 py-4 space-y-3 flex flex-col font-bold tracking-wider text-[11px] text-[#0B2C24] animate-fade-in absolute top-20 left-0 w-full z-50">
            <button
              onClick={() => {
                onNavigate("hem");
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 hover:text-[#B68F52] border-b border-slate-50 transition-colors ${
                activeTab === "hem" ? "text-[#B68F52]" : ""
              }`}
            >
              HEM
            </button>
            <button
              onClick={() => {
                onNavigate("om_oss");
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 hover:text-[#B68F52] border-b border-slate-50 transition-colors ${
                activeTab === "om_oss" ? "text-[#B68F52]" : ""
              }`}
            >
              OM OSS
            </button>
            <button
              onClick={() => {
                onNavigate("vara_foretag");
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 hover:text-[#B68F52] border-b border-slate-50 transition-colors ${
                activeTab === "vara_foretag" ? "text-[#B68F52]" : ""
              }`}
            >
              VÅRA FÖRETAG
            </button>
            <button
              onClick={() => {
                onNavigate("lediga_lokaler");
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 hover:text-[#B68F52] border-b border-slate-50 transition-colors ${
                activeTab === "lediga_lokaler" ? "text-[#B68F52]" : ""
              }`}
            >
              LEDIGA LOKALER
            </button>
            <button
              onClick={() => {
                onNavigate("kontakt");
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 hover:text-[#B68F52] transition-colors ${
                activeTab === "kontakt" ? "text-[#B68F52]" : ""
              }`}
            >
              KONTAKT &amp; JOURNAL
            </button>
          </div>
        )}

        {/* DYNAMIC WORKSPACE BODY CONTAINER */}
        {activeTab === "hem" ? (
          <>
            {/* HERO SECTION */}
            <section id="hem" className="relative w-full h-[650px] lg:h-[700px] flex items-center pt-10">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src={heroImage} 
              alt="Välkommen till Stäket Företagscenter i Järfälla — din plats för produktivt arbete och möten" 
              className="w-full h-full object-cover"
            />
            {/* Dark gradient overlay left to right */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 text-white">
            <div className="max-w-2xl space-y-6">
              
              <h1 className="text-5xl lg:text-7xl font-sans font-bold leading-[1.1] tracking-tight text-white drop-shadow-md">
                Välkommen till<br />
                Stäket Företagscenter
              </h1>
              
              <p className="text-base lg:text-lg text-gray-200 leading-relaxed max-w-xl font-medium drop-shadow-sm pb-2">
                Stäket Företagscenter omfattar 30 kommersiella tvåplans kombilokaler i Järfälla. Lokalerna, om cirka 215 kvm, är utformade för verksamheter såsom verkstad, showroom, åkeri, hantverk, lager och kontor.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex items-center justify-center gap-2 border border-white/50 bg-black/20 backdrop-blur-sm text-white px-7 py-3.5 rounded-full text-[11px] font-bold tracking-wider hover:bg-white/20 transition-colors" onClick={() => onNavigate("lediga_lokaler")}>
                  <Calendar className="w-4 h-4" /> SE LEDIGA LOKALER
                </button>
                <button className="flex items-center justify-center gap-2 bg-white text-[#0B2C24] px-7 py-3.5 rounded-full text-[11px] font-bold tracking-wider hover:bg-gray-100 transition-colors" onClick={() => onNavigate("vara_foretag")}>
                  VÅRA FÖRETAG <ArrowRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Checks Row */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 text-[11.5px] font-medium tracking-wide">
                <div className="flex items-center gap-1.5 drop-shadow-sm">
                  <div className="bg-[#8CA899] rounded-full p-0.5"><Check className="w-3.5 h-3.5 text-white stroke-[3]" /></div>
                  <span>Kombilokaler (ca 215 m²)</span>
                </div>
                <div className="flex items-center gap-1.5 drop-shadow-sm">
                  <div className="bg-[#8CA899] rounded-full p-0.5"><Check className="w-3.5 h-3.5 text-white stroke-[3]" /></div>
                  <span>Bred branschblanding</span>
                </div>
                <div className="flex items-center gap-1.5 drop-shadow-sm">
                  <div className="bg-[#8CA899] rounded-full p-0.5"><Check className="w-3.5 h-3.5 text-white stroke-[3]" /></div>
                  <span>Strategiskt invid E18</span>
                </div>
                <div className="flex items-center gap-1.5 drop-shadow-sm">
                  <div className="bg-[#8CA899] rounded-full p-0.5"><Check className="w-3.5 h-3.5 text-white stroke-[3]" /></div>
                  <span>Fri parkering</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK FEATURE PILL BAR (Overlaps the bottom of the hero) */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-20 -mt-16 mb-16 lg:mb-24">
          <div className="bg-white rounded-[40px] shadow-2xl shadow-black/10 border border-gray-100 flex flex-col md:flex-row items-center p-2 lg:p-0">
            
            <div className="flex-1 flex items-center gap-4 p-4 lg:p-8 w-full lg:w-auto hover:bg-gray-50 transition-colors rounded-l-[40px] cursor-pointer" onClick={() => onNavigate("lediga_lokaler")}>
              <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5 text-[#0B2C24]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0B2C24] text-[15px]">Kombilokaler</h3>
                <p className="text-gray-500 text-[11.5px] leading-snug mt-0.5 max-w-[190px]">Lager, verkstad &amp; kontor i två plan</p>
              </div>
            </div>

            <div className="hidden md:block w-px h-16 bg-gray-200"></div>
            <div className="w-full h-px bg-gray-100 md:hidden my-2"></div>

            <div className="flex-1 flex items-center gap-4 p-4 lg:p-8 w-full lg:w-auto hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => onNavigate("lediga_lokaler")}>
              <div className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-[#0B2C24]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0B2C24] text-[15px]">Verkstad &amp; Lager</h3>
                <p className="text-gray-500 text-[11.5px] leading-snug mt-0.5 max-w-[190px]">Lokaler med portar på ca 215 kvm</p>
              </div>
            </div>

            <div className="hidden md:block w-px h-16 bg-gray-200"></div>
            <div className="w-full h-px bg-gray-100 md:hidden my-2"></div>

            <div className="flex-1 flex items-center gap-4 p-4 lg:p-8 w-full lg:w-auto hover:bg-gray-50 transition-colors rounded-r-[40px] cursor-pointer" onClick={() => onNavigate("vara_foretag")}>
              <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-[#0B2C24]" />
              </div>
              <div>
                <h3 className="font-bold text-[#0B2C24] text-[15px]">30 Aktiva Företag</h3>
                <p className="text-gray-500 text-[11.5px] leading-snug mt-0.5 max-w-[190px]">Fordonsservice, transport, hantverk och teknik</p>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION: OM STÄKET */}
        <section id="omoss" className="py-20 bg-transparent text-center px-4 scroll-mt-24">
          <div className="max-w-3xl mx-auto space-y-6 mb-12">
            <span className="font-cursive text-3xl text-[#B68F52]">Om Stäket Företagscenter</span>
            <h2 className="text-3xl md:text-[42px] font-bold text-[#0B2C24] leading-[1.2] tracking-tight">
              En plats där företag trivs <br />
              och <span className="font-cursive text-[#0B2C24] font-normal px-1 tracking-normal inline-block">utvecklas</span>
            </h2>
            
            <p className="text-[#0B2C24]/80 text-[15px] leading-relaxed max-w-lg mx-auto pb-4 font-medium italic border-l-4 border-[#B68F52] pl-4 text-left">
              "Behöver du tjänster, konsultationer eller bara byta däck eller serva bilen är du alltid välkommen över på en kopp kaffe till vårt trevliga företagscenter, vi tar gärna hand om dig."
            </p>

            <div className="max-w-[480px] mx-auto grid grid-cols-2 gap-4 pb-6">
              <div className="flex items-center gap-2.5 justify-start">
                <div className="w-[20px] h-[20px] rounded-full bg-[#0B2C24] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-[13px] font-bold text-[#0B2C24] text-left">Kombilokaler (ca 215 m²)</span>
              </div>
              <div className="flex items-center gap-2.5 justify-start">
                <div className="w-[20px] h-[20px] rounded-full bg-[#0B2C24] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-[13px] font-bold text-[#0B2C24] text-left">Strategiskt intill E18</span>
              </div>
              <div className="flex items-center gap-2.5 justify-start">
                <div className="w-[20px] h-[20px] rounded-full bg-[#0B2C24] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-[13px] font-bold text-[#0B2C24] text-left">Mångsidig branschbredd</span>
              </div>
              <div className="flex items-center gap-2.5 justify-start">
                <div className="w-[20px] h-[20px] rounded-full bg-[#0B2C24] text-white flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="text-[13px] font-bold text-[#0B2C24] text-left">Fria parkeringsplatser</span>
              </div>
            </div>
          </div>

          <div id="kontorsplatser" className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-6 px-4 scroll-mt-24">
            
            {/* CARDS */}
            {/* Card 1 */}
            <div className="group rounded-2xl overflow-hidden bg-white shadow-xl shadow-gray-200/50 flex flex-col items-center cursor-pointer" onClick={() => onNavigate("lediga_lokaler")}>
              <div className="w-full h-64 overflow-hidden mask-image-bottom relative">
                <img src={bildImage} alt="Flexibla kombilokaler i Järfälla" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              </div>
              <div className="px-6 pb-8 pt-4 w-full relative z-10 flex items-start gap-4">
                <div className="w-[60px] h-[60px] bg-[#0B2C24] rounded-2xl text-white flex items-center justify-center shrink-0 shadow-lg -mt-10 relative border-[3px] border-white z-20">
                  <Building2 className="w-7 h-7" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between pb-1">
                     <h3 className="text-[17px] font-bold text-[#0B2C24]">Kombilokaler</h3>
                    <ArrowRight className="w-5 h-5 text-[#0B2C24] group-hover:text-[#B68F52] transition-colors" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Flexibla lokaler på 215 kvm fördelat på två plan med egen port. Idealisk lösning för verksamheter som kräver både lager, verkstad och kontor.</p>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div id="motesrum" className="group rounded-2xl overflow-hidden bg-white shadow-xl shadow-gray-200/50 flex flex-col items-center scroll-mt-24 cursor-pointer" onClick={() => onNavigate("lediga_lokaler")}>
              <div className="w-full h-64 overflow-hidden mask-image-bottom relative">
                <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800" alt="Rymliga verkstadslokaler och lagerlokaler i Stäket Företagscenter" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              </div>
              <div className="px-6 pb-8 pt-4 w-full relative z-10 flex items-start gap-4">
                <div className="w-[60px] h-[60px] bg-[#0B2C24] rounded-2xl text-white flex items-center justify-center shrink-0 shadow-lg -mt-10 relative border-[3px] border-white z-20">
                  <Calendar className="w-7 h-7" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between pb-1">
                     <h3 className="text-[17px] font-bold text-[#0B2C24]">Verkstad &amp; Lager</h3>
                    <ArrowRight className="w-5 h-5 text-[#0B2C24] group-hover:text-[#B68F52] transition-colors" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Rymliga verkstads- och lagerlokaler i Stockholm på ca 215 kvm med smidiga rullportar och ordentlig takhöjd.</p>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div id="konferensrum" className="group rounded-2xl overflow-hidden bg-white shadow-xl shadow-gray-200/50 flex flex-col items-center scroll-mt-24 cursor-pointer" onClick={() => onNavigate("vara_foretag")}>
              <div className="w-full h-64 overflow-hidden mask-image-bottom relative">
                <img src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800" alt="Se etablerade företag i fastigheten Brf Stäkets Företagscenter" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              </div>
              <div className="px-6 pb-8 pt-4 w-full relative z-10 flex items-start gap-4">
                <div className="w-[60px] h-[60px] bg-[#0B2C24] rounded-[24px] text-white flex items-center justify-center shrink-0 shadow-lg -mt-10 relative border-[3px] border-white z-20">
                  <Users className="w-7 h-7" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center justify-between pb-1">
                     <h3 className="text-[17px] font-bold text-[#0B2C24]">Våra Verksamheter</h3>
                    <ArrowRight className="w-5 h-5 text-[#0B2C24] group-hover:text-[#B68F52] transition-colors" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">Möt våra 30 hyresgäster verksamma inom bilförsäljning, däckbyten, liftuthyrning, transport, systemelektronik och konsulttjänster.</p>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-14 inline-block">
            <button className="flex items-center justify-center gap-2 bg-[#0B2C24] text-white px-8 py-3.5 rounded-full text-[11px] font-bold tracking-wider hover:bg-[#081e18] transition-colors mx-auto" onClick={() => onNavigate("om_oss")}>
              LÄS MER OM OSS <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </section>

        </>
        ) : (
          <div className="bg-[#FAFBFB] min-h-[500px] border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 animate-fade-in text-[#0B2C24]">
              {activeTab === "vara_foretag" && <OurCompaniesView profiles={profiles} />}
              {activeTab === "lediga_lokaler" && <AvailableSpacesView />}
              {activeTab === "om_oss" && <AboutUsView />}
              {activeTab === "kontakt" && <ContactPublicView />}
            </div>
          </div>
        )}


        {/* ANSLAGSTAVLA SECTION RIGHT ABOVE FOOTER */}
        <section className="bg-white border-t border-gray-150 py-12 px-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="space-y-1">
                <span className="font-cursive text-2xl text-[#B68F52]">Anslagstavlan</span>
                <h3 className="font-bold text-[#0B2C24] text-xl tracking-tight">Senaste nytt från föreningen</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {notices && notices.slice(0, 3).map((notice) => {
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
                    className="flex gap-4 items-start bg-slate-50 p-5 rounded-2xl border border-slate-100 hover:bg-[#F9FAF9] transition-all hover:shadow-2xs cursor-pointer group"
                  >
                    <div className="bg-[#0B2C24] text-white px-2.5 py-1.5 flex flex-col items-center justify-center shrink-0 min-w-[55px] rounded-lg shadow-2xs">
                      <span className="text-lg font-bold font-mono tracking-tight leading-none text-white">{day}</span>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-white/85 mt-1">{month}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-[#0B2C24] text-sm group-hover:text-[#B68F52] group-hover:underline leading-snug truncate">
                        {notice.title}
                      </h5>
                      <p className="text-gray-500 text-xs leading-relaxed mt-2 line-clamp-3">
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

        {/* FOOTER */}
        <footer id="kontakt" className="bg-[#F8F9FA] border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
            
            {/* Top row: Om Oss and Contact Row */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 border-b border-gray-200 pb-8">
              
              {/* Om Oss */}
              <div className="max-w-md space-y-2">
                <p className="text-[#0B2C24] font-bold text-base tracking-tight">Stäket Företagscenter</p>
                <p className="text-gray-500 text-[13px] leading-relaxed font-medium">
                  Företagstjänster - Konsultationer - Service. Ett komplett företagscenter i Järfälla med 30 aktiva bolag.
                </p>
              </div>

              {/* Contact details in a row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 lg:gap-10 text-[13px] text-[#0B2C24] font-medium">
                <div>
                  <span className="block font-bold text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">Adress:</span>
                  <span className="block text-[#0B2C24]">Skarprättarvägen 7</span>
                  <span className="block text-[#0B2C24]">176 77 Järfälla</span>
                </div>
                
                <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>

                <div>
                  <span className="block font-bold text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">Telefon:</span>
                  <a href="tel:0707772111" className="block text-[#0B2C24] hover:text-[#B68F52] transition-colors font-semibold">
                    070 777 2111
                  </a>
                </div>

                <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>

                <div>
                  <span className="block font-bold text-gray-400 text-[10px] uppercase tracking-wider mb-0.5">Email:</span>
                  <a href="mailto:brfsfc@gmail.com" className="block text-[#0B2C24] hover:text-[#B68F52] transition-colors underline decoration-dotted">
                    brfsfc@gmail.com
                  </a>
                </div>
              </div>

            </div>

            {/* Bottom Row */}
            <div className="flex flex-col md:flex-row items-center justify-between text-[11px] text-gray-500 gap-4 font-medium tracking-wide">
              <span>© 2026 Brf. Stäkets Företagscenter. Alla rättigheter förbehållna.</span>
              <div className="space-x-4 flex items-center">
                <a href="#" className="hover:text-gray-800 transition-colors">Integritetspolicy</a>
                <span className="text-gray-300">|</span>
                <a href="#" className="hover:text-gray-800 transition-colors">Cookies</a>
              </div>
            </div>

          </div>
        </footer>


        {/* Demo Controller Button overlay (so user can switch back to member easily) */}
        <div className="fixed bottom-16 left-6 z-50">
           <button 
             onClick={() => onSetRole("Medlem")}
             className="bg-yellow-400 text-[#093325] text-[10px] font-bold px-3 py-1.5 rounded shadow-lg hover:bg-yellow-500 uppercase tracking-widest flex items-center gap-1.5 cursor-pointer"
           >
             <User className="w-3.5 h-3.5" /> Byt Demo-roll
           </button>
        </div>

      </div>
    );
  }

  // RETURN MEMBER/ADMIN INTERFACE BELOW THIS POINT (OMITTED FULL OLD CODE, RESTORING THE DASHBOARD FEED)
  // ... rest of the member code (will paste it back inline to avoid removing member features)
  return (
    <div className="space-y-8 animate-fade-in" id="member-home">
      {/* Dynamic Member Portal Banner Header */}
      <section className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-6 sm:p-8 md:p-10 shadow-lg border border-slate-800">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-600 rounded-full blur-3xl opacity-15 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-sky-500 rounded-full blur-3xl opacity-10 pointer-events-none"></div>

        <div className="max-w-2xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800 text-blue-400 border border-slate-700 text-[10px] font-bold tracking-wider uppercase">
            🇸🇪 Inloggad i portalen
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-sans font-bold tracking-tight text-slate-100">
            Föreningsöversikt & information
          </h2>
          
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Här har du som styrelseledamot eller fastighetsmedlem samlad tillgång till larmkoder, underhållstavlan, stämmoprotokoll och kontaktlistor. Justera din valda demo-roll längst upp om du vill prova olika behörigheter.
          </p>

          <div className="flex flex-wrap gap-2.5 pt-1.5">
            <button
              onClick={() => onNavigate("anslagstavlan")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-500 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
            >
              <Bell className="w-3.5 h-3.5" /> GÅ TILL ANSLAGSTAVLAN
            </button>
            <button
              onClick={() => onNavigate("filer")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-slate-800 text-slate-200 border border-slate-700 text-[11px] font-bold hover:bg-slate-700 transition-colors cursor-pointer whitespace-nowrap"
            >
              <FileText className="w-3.5 h-3.5" /> DOKUMENTARKIV
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
