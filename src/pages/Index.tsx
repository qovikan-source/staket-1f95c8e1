/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import {
  Home,
  Briefcase,
  Building2,
  Info,
  Mail,
  Bell,
  FileText,
  Users,
  Shield,
  KeyRound,
  ChevronDown,
  Lock,
  Menu,
  X
} from "lucide-react";

import { UserRole, UserProfile, NoticePost, FileItem, VacantSpace, FileCategory, BoardFolder } from "../types";
import { dbService } from "../lib/db";
import { supabase } from "../lib/supabase";
import {
  loadProfiles,
  saveProfiles,
  loadNotices,
  saveNotices,
  loadFiles,
  saveFiles,
  loadSpaces,
  saveSpaces
} from "../initialData";

// View components
import HomeView from "../components/HomeView";
import OurCompaniesView from "../components/OurCompaniesView";
import AboutUsView from "../components/AboutUsView";
import ContactPublicView from "../components/ContactPublicView";
import AvailableSpacesView from "../components/AvailableSpacesView";
import NoticeboardView from "../components/NoticeboardView";
import DocumentHubView from "../components/DocumentHubView";
import ContactBookView from "../components/ContactBookView";
import AdminView from "../components/AdminView";
import LoginView from "../components/LoginView";

export default function Index() {
  // State definitions matching localStorage loaders
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [notices, setNotices] = useState<NoticePost[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [spaces, setSpaces] = useState<VacantSpace[]>([]);

  // Selected Page Tab
  const [activeTab, setActiveTab] = useState<string>("hem");

  // Selected Demo Role for evaluation
  const [role, setRole] = useState<UserRole>("Besökare");

  // Mobile menu open trigger
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load database on mount and sanitize URL hash if present
  useEffect(() => {
    // 1. Initial fast load from localStorage cache
    setProfiles(loadProfiles());
    setNotices(loadNotices());
    setFiles(loadFiles());
    setSpaces(loadSpaces());

    // 2. Fetch fresh database data from Supabase asynchronously
    async function fetchFromSupabase() {
      try {
        const dbProfiles = await dbService.getProfiles();
        setProfiles(dbProfiles);
        saveProfiles(dbProfiles);
      } catch (e) {
        console.warn("Could not fetch profiles from Supabase, using cache:", e);
      }

      try {
        const dbNotices = await dbService.getNotices();
        setNotices(dbNotices);
        saveNotices(dbNotices);
      } catch (e) {
        console.warn("Could not fetch notices from Supabase, using cache:", e);
      }

      try {
        const dbFiles = await dbService.getFiles();
        setFiles(dbFiles);
        saveFiles(dbFiles);
      } catch (e) {
        console.warn("Could not fetch files from Supabase, using cache:", e);
      }

      try {
        const dbSpaces = await dbService.getSpaces();
        setSpaces(dbSpaces);
        saveSpaces(dbSpaces);
      } catch (e) {
        console.warn("Could not fetch vacant spaces from Supabase, using cache:", e);
      }
    }

    fetchFromSupabase();

    // Clean up any trailing URL hashes (e.g. #omoss) on fresh load to keep the address bar clean at root /
    if (window.location.hash) {
      try {
        window.history.replaceState(
          null, 
          document.title, 
          window.location.pathname + window.location.search
        );
      } catch (e) {
        // Fallback for isolated contexts or iframe restriction issues
      }
    }
  }, []);

  // Real-time synchronization for files database updates
  useEffect(() => {
    const filesSubscription = supabase
      .channel("public-files-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "files" },
        async (payload) => {
          console.log("Change received on files table:", payload);
          try {
            const dbFiles = await dbService.getFiles();
            setFiles(dbFiles);
            saveFiles(dbFiles);
          } catch (err) {
            console.error("Error updating files on Postgres change event:", err);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(filesSubscription);
    };
  }, []);

  // Dynamic SEO meta-tag management based on current active tab/route
  useEffect(() => {
    let title = "Stäket Företagscenter — Lokaler & företag i Järfälla, Stockholm";
    let desc = "Välkommen till Stäket Företagscenter i Järfälla. Här drivs olika verksamheter i 30 lokaler. Kontakta oss för att hyra lediga kontors- & verkstadslokaler!";
    let pathName = "";

    switch (activeTab) {
      case "hem":
        title = "Stäket Företagscenter — Lokaler & företag i Järfälla, Stockholm";
        desc = "Välkommen till Stäket Företagscenter i Järfälla. Här drivs olika verksamheter i 30 lokaler. Kontakta oss för att hyra lediga kontors- & verkstadslokaler!";
        pathName = "";
        break;
      case "lediga_lokaler":
        title = "Lediga Lokaler Järfälla — Kontorshotell & Verkstad | Stäket Företagscenter";
        desc = "Letar du lediga lokaler i Järfälla? Vi erbjuder 30 flexibla enheter för kontorshotell, lager och verkstadslokaler intill E18 i Stockholm. Skicka intresseanmälan!";
        pathName = "lediga-lokaler-jarfalla";
        break;
      case "vara_foretag":
        title = "Våra Företag — Företag & tjänster i Stäket Företagscenter";
        desc = "Sök bland verksamma företag hos Stäket Företagscenter. Hitta bilbärgning, liftuthyrning, byggföretag, maskinentreprenörer och konsulter i Järfälla.";
        pathName = "foretag";
        break;
      case "om_oss":
        title = "Om Oss — Brf Stäkets Företagscenter i Järfälla";
        desc = "Läs om Brf Stäkets Företagscenter. Vi har attraktiva kontors-, verkstads- och lagerlokaler för uthyrning i Järfälla kommun. Välkommen att besöka oss!";
        pathName = "omoss";
        break;
      case "kontakt":
        title = "Kontakt & Felanmälan — Stäket Företagscenter, Järfälla";
        desc = "Kontakta oss på Stäket Företagscenter. Hitta kontaktuppgifter, adress, telefon och e-post eller skicka felanmälan direkt genom vårt formulär.";
        pathName = "kontakt";
        break;
      case "anslagstavlan":
        title = "Medlemsanslagstavla — Stäket Företagscenter";
        desc = "Anslagstavla och nyheter för medlemmar i Brf Stäkets Företagscenter.";
        pathName = "anslagstavlan";
        break;
      case "filer":
        title = "Dokument & Blanketter — Stäket Företagscenter";
        desc = "Ladda ner dokument, mötesprotokoll, blanketter och stadgar för medlemmar i föreningen.";
        pathName = "filer";
        break;
      case "kontaktboken":
        title = "Kontaktboken — Brf Stäkets Företagscenter";
        desc = "Intern kontaktbok för företag och medlemmar i Stäket Företagscenter.";
        pathName = "kontaktboken";
        break;
      case "administration":
        title = "Styrelseadministration — Stäket Företagscenter";
        desc = "Administrativt verktyg för styrelse och systemadministratörer.";
        pathName = "administration";
        break;
    }

    // Set page parameters on document
    document.title = title;

    // Update Meta Description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", desc);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = desc;
      document.head.appendChild(meta);
    }

    // Update Canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    const targetUrl = `https://staketforetagscenter.se/${pathName}`;
    if (canonical) {
      canonical.setAttribute("href", targetUrl);
    } else {
      const link = document.createElement("link");
      link.rel = "canonical";
      link.href = targetUrl;
      document.head.appendChild(link);
    }

    // Update Open Graph and Twitter Share Meta tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", desc);
    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", targetUrl);

    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute("content", title);
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute("content", desc);
    const twUrl = document.querySelector('meta[name="twitter:url"]');
    if (twUrl) twUrl.setAttribute("content", targetUrl);

    // Dynamic Robots control
    const existingRobots = document.querySelector('meta[name="robots"]');
    const shouldNoIndex = ["anslagstavlan", "filer", "kontaktboken", "administration"].includes(activeTab);
    const robotsContent = shouldNoIndex ? "noindex, nofollow" : "index, follow";

    if (existingRobots) {
      existingRobots.setAttribute("content", robotsContent);
    } else {
      const rMeta = document.createElement("meta");
      rMeta.name = "robots";
      rMeta.content = robotsContent;
      document.head.appendChild(rMeta);
    }
  }, [activeTab]);

  // Sync state triggers
  const handleAddNotice = async (notice: Omit<NoticePost, "id" | "date">) => {
    try {
      const dbNotice = await dbService.insertNotice(notice);
      const updated = [dbNotice, ...notices];
      setNotices(updated);
      saveNotices(updated);
    } catch (e) {
      console.error("Failed to add notice to Supabase, saving locally:", e);
      const fresh: NoticePost = {
        ...notice,
        id: `n-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
      };
      const updated = [fresh, ...notices];
      setNotices(updated);
      saveNotices(updated);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    try {
      await dbService.deleteNotice(id);
      const updated = notices.filter((n) => n.id !== id);
      setNotices(updated);
      saveNotices(updated);
    } catch (e) {
      console.error("Failed to delete notice from Supabase, deleting locally:", e);
      const updated = notices.filter((n) => n.id !== id);
      setNotices(updated);
      saveNotices(updated);
    }
  };

  const handleAddFile = async (file: Omit<FileItem, "id" | "uploadedAt">, realFile?: File) => {
    try {
      let dbFile: FileItem;
      if (realFile) {
        dbFile = await dbService.uploadFile(realFile, file.category, file.folder);
      } else {
        const dbRecord = {
          name: file.name,
          category: file.category,
          folder: file.folder || null,
          file_size: file.fileSize,
          mime_type: "application/pdf",
          url: "https://example.com/dummy.pdf",
          uploaded_at: new Date().toISOString().split("T")[0],
        };
        const { data, error } = await supabase.from("files").insert(dbRecord).select().single();
        if (error) throw error;
        dbFile = {
          id: data.id,
          name: data.name,
          category: data.category as FileCategory,
          folder: data.folder as BoardFolder | undefined,
          uploadedAt: data.uploaded_at,
          fileSize: data.file_size,
          mimeType: data.mime_type,
        };
      }
      const updated = [dbFile, ...files];
      setFiles(updated);
      saveFiles(updated);
    } catch (e) {
      console.error("Failed to upload/add file to Supabase:", e);
      alert("Kunde inte ladda upp filen: " + (e as Error).message);
    }
  };

  const handleDeleteFile = async (id: string, name: string, category: FileCategory) => {
    try {
      await dbService.deleteFile(id, name, category);
      const updated = files.filter((f) => f.id !== id);
      setFiles(updated);
      saveFiles(updated);
    } catch (e) {
      console.error("Failed to delete file from Supabase, deleting locally:", e);
      const updated = files.filter((f) => f.id !== id);
      setFiles(updated);
      saveFiles(updated);
    }
  };

  const handleAddProfile = async (profile: Omit<UserProfile, "id">) => {
    try {
      const dbProfile = await dbService.insertProfile(profile);
      const updated = [...profiles, dbProfile];
      setProfiles(updated);
      saveProfiles(updated);
    } catch (e) {
      console.error("Failed to add profile to Supabase:", e);
      const fresh: UserProfile = {
        ...profile,
        id: `p-${Date.now()}`,
      };
      const updated = [...profiles, fresh];
      setProfiles(updated);
      saveProfiles(updated);
    }
  };

  const handleUpdateRole = async (id: string, newRole: UserRole) => {
    try {
      await dbService.updateProfile(id, { role: newRole });
      const updated = profiles.map((p) => (p.id === id ? { ...p, role: newRole } : p));
      setProfiles(updated);
      saveProfiles(updated);
    } catch (e) {
      console.error("Failed to update role in Supabase:", e);
      const updated = profiles.map((p) => (p.id === id ? { ...p, role: newRole } : p));
      setProfiles(updated);
      saveProfiles(updated);
    }
  };

  const handleDeleteProfile = async (id: string) => {
    try {
      await dbService.deleteProfile(id);
      const updated = profiles.filter((p) => p.id !== id);
      setProfiles(updated);
      saveProfiles(updated);
    } catch (e) {
      console.error("Failed to delete profile from Supabase:", e);
      const updated = profiles.filter((p) => p.id !== id);
      setProfiles(updated);
      saveProfiles(updated);
    }
  };

  const handleAddSpace = async (space: Omit<VacantSpace, "id" | "createdAt">) => {
    try {
      const dbSpace = await dbService.insertSpace(space);
      const updated = [dbSpace, ...spaces];
      setSpaces(updated);
      saveSpaces(updated);
    } catch (e) {
      console.error("Failed to add vacant space to Supabase:", e);
      const fresh: VacantSpace = {
        ...space,
        id: `s-${Date.now()}`,
        createdAt: new Date().toISOString().split("T")[0],
      };
      const updated = [fresh, ...spaces];
      setSpaces(updated);
      saveSpaces(updated);
    }
  };

  const handleDeleteSpace = async (id: string) => {
    try {
      await dbService.deleteSpace(id);
      const updated = spaces.filter((s) => s.id !== id);
      setSpaces(updated);
      saveSpaces(updated);
    } catch (e) {
      console.error("Failed to delete space from Supabase:", e);
      const updated = spaces.filter((s) => s.id !== id);
      setSpaces(updated);
      saveSpaces(updated);
    }
  };

  // Guard routing if tabs are restricted by selected role.
  const handleTabClick = (tabId: string) => {
    const isMemberTab = ["anslagstavlan", "filer", "kontaktboken"].includes(tabId);
    const isAdminTab = tabId === "administration";

    if (isMemberTab && role === "Besökare") {
      alert("Denna sida är tillgänglig först efter inloggning.");
      return;
    }
    if (isAdminTab && role !== "Styrelse" && role !== "Administrator") {
      alert("Denna sida kräver styrelse/admin-behörighet.");
      return;
    }

    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  // Helper current user representation based on role
  const getCurrentUserName = () => {
    if (role === "Besökare") return "Anonym Besökare";
    if (role === "Medlem") return "Thomas Berglund (Medlem)";
    if (role === "Styrelse") return "Alexander Krasar (Styrelse)";
    return "Admin Adminsson (Administrator)";
  };

  return (
    <div className="min-h-screen bg-[#f0f2f5] font-sans text-slate-800 flex flex-col" id="applet-root">
      
      {/* Dynamic Demo Warning Box with Instruction Header */}
      <div className="bg-slate-900 text-slate-100 border-b border-slate-800 px-4 py-2.5 text-xs flex flex-col xl:flex-row xl:items-center justify-between gap-3 shadow-sm z-30">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <p className="font-medium text-slate-300">
            🇸🇪 <span className="text-white font-bold">Interaktiv Prototyp:</span> Fastigheten <span className="text-emerald-400 font-semibold">Smeden 14</span>. Testa behörigheter genom att ändra demo-roll till höger.
          </p>
        </div>

        {/* Demo role selectors badge selector */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <span className="text-slate-400 font-semibold text-[11px]">Välj Demo-roll:</span>
          <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700 flex-wrap">
            <button
              onClick={() => {
                setRole("Besökare");
                if (["anslagstavlan", "filer", "kontaktboken", "administration"].includes(activeTab)) {
                  setActiveTab("hem");
                }
              }}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                role === "Besökare"
                  ? "bg-slate-700 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              👤 Besökare
            </button>
            <button
              onClick={() => {
                setRole("Medlem");
                if (activeTab === "administration") {
                  setActiveTab("anslagstavlan");
                }
              }}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                role === "Medlem"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              👥 Medlem
            </button>
            <button
              onClick={() => {
                setRole("Styrelse");
              }}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                role === "Styrelse"
                  ? "bg-violet-600 text-white shadow-xs font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              👑 Styrelse
            </button>
            <button
              onClick={() => {
                setRole("Administrator");
              }}
              className={`px-3 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                role === "Administrator"
                  ? "bg-emerald-600 text-white shadow-xs font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              ⚡ Administrator
            </button>
          </div>
        </div>
      </div>

      {activeTab === "login" ? (
        <div className="flex-1 overflow-y-auto bg-slate-50 flex flex-col min-h-0">
          <LoginView
            onLoginSuccess={(selectedRole) => {
              setRole(selectedRole);
              if (selectedRole === "Styrelse" || selectedRole === "Administrator") {
                setActiveTab("administration");
              } else {
                setActiveTab("anslagstavlan");
              }
            }}
            onCancel={() => {
              setActiveTab("hem");
            }}
          />
        </div>
      ) : role === "Besökare" ? (
        <div className="flex-1 overflow-y-auto bg-white flex flex-col min-h-0">
          <HomeView
            notices={notices}
            role={role}
            onSetRole={setRole}
            onNavigate={handleTabClick}
            activeTab={activeTab}
          />
        </div>
      ) : (
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 relative">
        {/* Main Layout Area: Sidebar + Main Frame */}
        
        {/* Sidebar Navigation Drawer */}
        <aside className={`lg:w-64 bg-[#1e293b] flex flex-col shrink-0 border-r border-slate-800 transition-all ${mobileMenuOpen ? "flex h-auto w-full absolute inset-x-0 top-0 z-30 shadow-xl border-b" : "hidden lg:flex"}`}>
          <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
            <div className="text-white font-bold text-lg flex items-center gap-2.5">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-xs font-bold shadow-xs">BRF</div>
              <div className="leading-none">
                <div className="text-white text-sm font-bold tracking-tight">BRF PORTALEN</div>
                <div className="text-[9px] text-slate-400 font-mono tracking-wider mt-0.5">SMEDEN 14</div>
              </div>
            </div>
            {/* Mobile close button */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-3.5 space-y-4 overflow-y-auto">
            {/* Public Section */}
            <div>
              <div className="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-2 px-2">Offentlig info</div>
              <div className="space-y-0.5">
                <button
                  onClick={() => handleTabClick("hem")}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer text-left ${
                    activeTab === "hem"
                      ? "bg-blue-600/15 text-blue-400 border-l-2 border-blue-500 pl-2.5"
                      : "text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <Home className="w-3.5 h-3.5 shrink-0" />
                  Hem & Fastighet
                </button>
                <button
                  onClick={() => handleTabClick("vara_foretag")}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer text-left ${
                    activeTab === "vara_foretag"
                      ? "bg-blue-600/15 text-blue-400 border-l-2 border-blue-500 pl-2.5"
                      : "text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5 shrink-0" />
                  Våra Företag
                </button>
                <button
                  onClick={() => handleTabClick("lediga_lokaler")}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer text-left ${
                    activeTab === "lediga_lokaler"
                      ? "bg-blue-600/15 text-blue-400 border-l-2 border-blue-500 pl-2.5"
                      : "text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 shrink-0" />
                  Lediga Lokaler Järfälla
                </button>
                <button
                  onClick={() => handleTabClick("om_oss")}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer text-left ${
                    activeTab === "om_oss"
                      ? "bg-blue-600/15 text-blue-400 border-l-2 border-blue-500 pl-2.5"
                      : "text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <Info className="w-3.5 h-3.5 shrink-0" />
                  Om Föreningen
                </button>
                <button
                  onClick={() => handleTabClick("kontakt")}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer text-left ${
                    activeTab === "kontakt"
                      ? "bg-blue-600/15 text-blue-400 border-l-2 border-blue-500 pl-2.5"
                      : "text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 shrink-0" />
                  Kontakt & Jour
                </button>
              </div>
            </div>

            {/* Members Section */}
            <div>
              <div className="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-2 px-2 flex items-center justify-between">
                <span>Medlemsportal</span>
                {(role as string) === "Besökare" && <Lock className="w-2.5 h-2.5 text-slate-600" />}
              </div>
              <div className="space-y-0.5">
                {(role as string) === "Besökare" ? (
                  <div className="px-3 py-2 bg-slate-800/20 text-slate-500 text-[10px] rounded border border-slate-700/50 mb-1 space-y-1">
                    <p className="leading-tight text-slate-400">Låst för besökare.</p>
                    <p className="text-[9px] text-slate-500">Välj "Medlem" ovan för att ta del av dolda sidor.</p>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleTabClick("anslagstavlan")}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer text-left ${
                        activeTab === "anslagstavlan"
                          ? "bg-blue-600/15 text-blue-400 border-l-2 border-blue-500 pl-2.5"
                          : "text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      <Bell className="w-3.5 h-3.5 shrink-0" />
                      Anslagstavlan
                    </button>
                    <button
                      onClick={() => handleTabClick("filer")}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer text-left ${
                        activeTab === "filer"
                          ? "bg-blue-600/15 text-blue-400 border-l-2 border-blue-500 pl-2.5"
                          : "text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5 shrink-0" />
                      Blanketter & Filer
                    </button>
                    <button
                      onClick={() => handleTabClick("kontaktboken")}
                      className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer text-left ${
                        activeTab === "kontaktboken"
                          ? "bg-blue-600/15 text-blue-400 border-l-2 border-blue-500 pl-2.5"
                          : "text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      <Users className="w-3.5 h-3.5 shrink-0" />
                      Kontaktboken
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Administration Section */}
            {role === "Styrelse" && (
              <div>
                <div className="text-slate-500 text-[9px] font-bold uppercase tracking-wider mb-2 px-2">Administration</div>
                <button
                  onClick={() => handleTabClick("administration")}
                  className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer text-left ${
                    activeTab === "administration"
                      ? "bg-violet-600/20 text-violet-400 border-l-2 border-violet-500 pl-2.5"
                      : "text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 shrink-0" />
                  Ändra användare
                </button>
              </div>
            )}
          </nav>

          {/* Profile Status Box at the bottom */}
          <div className="p-4 border-t border-slate-700/50 mt-auto bg-slate-900/60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold text-xs shrink-0 uppercase">
                {getCurrentUserName().charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-white font-semibold truncate">{getCurrentUserName()}</div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5 leading-none bg-slate-800 px-1.5 py-0.5 rounded w-fit">Rättighet: {role}</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Workspace Canvas (Full width on right) */}
        <div className="flex-grow flex flex-col min-w-0 overflow-x-hidden">
          {/* Top Header Panel */}
          <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 shrink-0 sticky top-0 z-10 shadow-3xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-sm font-bold text-slate-900 transition-all uppercase tracking-tight">
                {activeTab === "hem" && "Föreningsöversikt & Välkommen"}
                {activeTab === "vara_foretag" && "Våra Lokala Företag / Entreprenörer"}
                {activeTab === "lediga_lokaler" && "Lediga Lokaler & Fastighetssök i Järfälla"}
                {activeTab === "om_oss" && "Föreningsinformation"}
                {activeTab === "kontakt" && "Kontakt & Felanmälan"}
                {activeTab === "anslagstavlan" && "Medlemsanslagstavla"}
                {activeTab === "filer" && "Dokument & Blankettarkiv"}
                {activeTab === "kontaktboken" && "Medlemskontaktboken"}
                {activeTab === "administration" && "System- & Styrelseadministration"}
              </h1>
            </div>

            {/* Quick CTAs / Search Mock */}
            <div className="flex items-center gap-3">
              <span className="hidden md:inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-600 text-[10px] font-bold px-2.5 py-1 rounded">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                PORTAL ONLINE
              </span>
              
              {(role as string) === "Besökare" ? (
                <button
                  onClick={() => {
                    setRole("Medlem");
                    setActiveTab("anslagstavlan");
                  }}
                  className="bg-blue-600 text-white text-[11px] font-black tracking-tight px-3 py-1.5 rounded-md hover:bg-blue-700 transition"
                >
                  LOGGA IN
                </button>
              ) : (
                <button
                  onClick={() => {
                    setRole("Besökare");
                    setActiveTab("hem");
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold px-3 py-1.5 rounded-md transition"
                >
                  LOGGA UT
                </button>
              )}
            </div>
          </header>

          {/* Core Applet Content Stage */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {activeTab === "hem" && (
              <HomeView
                notices={notices}
                role={role}
                onSetRole={setRole}
                onNavigate={handleTabClick}
                activeTab={activeTab}
                profiles={profiles}
              />
            )}

            {activeTab === "vara_foretag" && <OurCompaniesView profiles={profiles} />}

            {activeTab === "lediga_lokaler" && (
              <AvailableSpacesView
                spaces={spaces}
                role={role}
                onDeleteSpace={handleDeleteSpace}
              />
            )}

            {activeTab === "om_oss" && <AboutUsView />}

            {activeTab === "kontakt" && <ContactPublicView />}

            {activeTab === "anslagstavlan" && (
              <NoticeboardView
                notices={notices}
                role={role}
                currentUserName={getCurrentUserName()}
                onAddNotice={handleAddNotice}
                onDeleteNotice={handleDeleteNotice}
              />
            )}

            {activeTab === "filer" && (
              <DocumentHubView
                files={files}
                role={role}
                onAddFile={handleAddFile}
                onDeleteFile={handleDeleteFile}
              />
            )}

            {activeTab === "kontaktboken" && (
              <ContactBookView profiles={profiles} />
            )}

            {activeTab === "administration" && (
              <AdminView
                role={role}
                profiles={profiles}
                notices={notices}
                files={files}
                spaces={spaces}
                onAddProfile={handleAddProfile}
                onUpdateRole={handleUpdateRole}
                onDeleteProfile={handleDeleteProfile}
                onDeleteNotice={handleDeleteNotice}
                onDeleteFile={handleDeleteFile}
                onAddSpace={handleAddSpace}
                onDeleteSpace={handleDeleteSpace}
              />
            )}
          </main>

          {/* High Density Dark Footer */}
          <footer className="h-8 bg-slate-900 border-t border-slate-800 flex items-center justify-between px-6 text-[10px] text-slate-400 flex-shrink-0">
            <div>Föreningsportal v2.0.2 • Fastighetsbeteckning: Smeden 14, Stockholm</div>
            <div className="flex gap-4">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> 
                Databas Online
              </span>
              <span>Inloggad som {(role as string) === "Besökare" ? "Gäst" : role === "Medlem" ? "Medlem" : "Styrelse"}</span>
            </div>
          </footer>
        </div>

      </div>
      )}
    </div>
  );
}
