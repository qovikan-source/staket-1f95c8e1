/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPublicView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Allmän fråga");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: "46a212f8-5873-4817-8c8f-08246c2b61b5",
          subject: `[Kontaktformulär] ${subject} från ${name}`,
          from_name: "Kontaktformulär SF",
          replyto: email,
          "Avsändare Namn": name,
          "E-postadress": email,
          "Telefonnummer": phone || "Ej angivet",
          "Ärendetyp": subject,
          "Meddelande": message
        })
      });

      const data = await response.json();
      if (data.success) {
        setSent(true);
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
      } else {
        alert("Kunde inte skicka meddelandet: " + data.message);
      }
    } catch (err) {
      alert("Ett nätverksfel uppstod. Vänligen försök igen senare.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="contact-public-view">
      <div className="space-y-2">
        <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#B68F52] hover:text-[#A37E3A] transition-colors">
          KONTAKT &amp; SPÖRSMÅL
        </span>
        <h1 className="text-3xl font-sans font-bold tracking-tight text-slate-900 leading-tight">
          KONTAKTA STÄKET FÖRETAGSCENTER, JÄRFÄLLA
        </h1>
        <p className="text-slate-650 max-w-2xl text-sm sm:text-base leading-relaxed">
          Har du frågor till samfälligheten, vill rapportera fel i gemensamma utrymmen på området, eller önskar hyra moderna kontors- och verkstadslokaler? Fyll i vårt formulär nedan.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-xs relative overflow-hidden">
          {sent ? (
            <div className="text-center py-12 space-y-4 animate-scale-up">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-800">Ditt meddelande har skickats!</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Tack för att du hörde av dig till oss på Stäket Företagscenter. Vi återkopplar så fort som möjligt, vanligtvis redan samma arbetsdag.
                </p>
              </div>
              <button
                onClick={() => setSent(false)}
                className="mt-6 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Skicka ett till meddelande
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="font-bold text-slate-800 text-lg border-b border-slate-50 pb-3 mb-2">
                SKICKA FÖRFRÅGAN DIREKT
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="input-name" className="text-xs sm:text-sm font-semibold text-slate-500">Fullständigt Namn *</label>
                  <input
                    id="input-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Förnamn och efternamn"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="input-email" className="text-xs sm:text-sm font-semibold text-slate-500">E-postadress *</label>
                  <input
                    id="input-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="namn@foretag.se"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="input-phone" className="text-xs sm:text-sm font-semibold text-slate-500">Telefonnummer</label>
                  <input
                    id="input-phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ex: 070-123 45 67"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-emerald-500 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="select-subject" className="text-xs sm:text-sm font-semibold text-slate-500">Typ av ärende</label>
                  <select
                    id="select-subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-emerald-500 transition-colors"
                  >
                    <option value="Allmän fråga">Allmän fråga / Information</option>
                    <option value="Lediga Lokaler">Frågor rörande lediga lokaler / hyra</option>
                    <option value="Felanmälan">Felanmälan på området (Portar, grindar, el)</option>
                    <option value="Ekonomi & Faktura">Ekonomi &amp; Fakturafrågor</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="textarea-message" className="text-xs sm:text-sm font-semibold text-slate-500">Meddelande *</label>
                <textarea
                  id="textarea-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Beskriv ert ärende, lokalnummer eller förfrågan i detalj..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-emerald-500 transition-colors resize-y"
                />
              </div>

              <button
                id="btn-submit-contact"
                type="submit"
                disabled={isSubmitting}
                className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-colors shadow-sm cursor-pointer ${
                  isSubmitting ? "bg-slate-500 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-800"
                }`}
              >
                {isSubmitting ? "SKICKAR..." : "SKICKA FRÅGA"}
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>

        {/* Info detail block */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-6">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">NAP- &amp; KONTAKTUPPGIFTER</h3>

            <div className="space-y-4">
              <div className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Besöksadress</h4>
                  <p className="text-xs sm:text-sm text-slate-650 mt-0.5">Skarprättarvägen 7</p>
                  <p className="text-xs sm:text-sm text-slate-600">176 77 Järfälla, Stockholm</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">Telefonnummer</h4>
                  <a href="tel:0707772111" className="text-xs sm:text-sm text-[#0B2C24] font-semibold hover:underline block mt-0.5">
                    070 777 2111 — Mobil
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">Måndag - Fredag: 08:00 - 17:00</p>
                </div>
              </div>

              <div className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-800">E-post till samfälligheten</h4>
                  <a href="mailto:brfsfc@gmail.com" className="text-xs sm:text-sm text-blue-600 font-semibold hover:underline block mt-0.5">
                    brfsfc@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2025.109!2d17.7825!3d59.4586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x465f979774659ebf%3A0xe5a1b8ad7884614e!2sSkarpr%C3%A4ttarv%C3%A4gen%207%2C%20176%2077%20J%C3%A4rf%C3%A4lla!5e0!3m2!1ssv!2sse!4v1718660000000!5m2!1ssv!2sse" 
              width="100%" 
              height="200" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Karta över Skarprättarvägen 7, Järfälla"
            ></iframe>
          </div>

          {/* Alert box */}
          <div className="bg-amber-50/50 p-5 rounded-2xl border border-amber-100/50">
            <h4 className="text-sm font-semibold text-amber-800 uppercase tracking-wide">LOKALUTHYRNING &amp; LEDIGA OBJEKT</h4>
            <p className="text-sm text-amber-900/80 mt-1 leading-relaxed">
              Vi förmedlar kontakt mellan sökande och anslutna lokalägare i Brf. Stäkets Företagscenter. Om ni söker specifika lokalkrav såsom tunga golv, pelarfritt eller spolhall, vänligen specificera detta i meddelandet.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
