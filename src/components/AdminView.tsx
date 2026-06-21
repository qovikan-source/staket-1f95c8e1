/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { dbService } from "../lib/db";
import { Users, FileText, Bell, Plus, ArrowUp, ArrowDown, Edit2, Trash2, CheckCircle2, AlertTriangle, ShieldCheck, Building2, Sparkles } from "lucide-react";
import { UserProfile, UserRole, NoticePost, FileItem, VacantSpace, FileCategory } from "../types";

// @ts-ignore
import technicalManualText from "../../docs/technical_manual.md?raw";

interface AdminViewProps {
  role: UserRole;
  profiles: UserProfile[];
  notices: NoticePost[];
  files: FileItem[];
  spaces: VacantSpace[];
  onAddProfile: (profile: Omit<UserProfile, "id"> & { password?: string }) => void;
  onUpdateRole: (id: string, role: UserRole) => void;
  onUpdateProfile: (id: string, profile: Partial<UserProfile> & { password?: string }) => void;
  onDeleteProfile: (id: string) => void;
  onDeleteNotice: (id: string) => void;
  onDeleteFile: (id: string, name: string, category: FileCategory) => void;
  onAddSpace: (space: Omit<VacantSpace, "id" | "createdAt">) => void;
  onDeleteSpace: (id: string) => void;
  activeProfileName?: string;
}

type AdminSubTab = "användare" | "filer" | "anslagstavla" | "lediga_lokaler" | "ai_support";

export default function AdminView({
  role: activeUserRole,
  profiles,
  notices,
  files,
  spaces = [],
  onAddProfile,
  onUpdateRole,
  onUpdateProfile,
  onDeleteProfile,
  onDeleteNotice,
  onDeleteFile,
  onAddSpace,
  onDeleteSpace,
  activeProfileName = "Admin",
}: AdminViewProps) {
  const [subTab, setSubTab] = useState<AdminSubTab>("användare");
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddSpaceModal, setShowAddSpaceModal] = useState(false);
  // Sorting state for profiles
  const [sortField, setSortField] = useState<keyof UserProfile>("unit");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filtering state for profiles
  const [roleFilter, setRoleFilter] = useState<"Alla" | "Medlemmar" | "Hyresgäst" | "Styrelse" | "Administrator">("Alla");

  // Editing profile states
  const [editingProfile, setEditingProfile] = useState<UserProfile | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<UserRole>("Medlem");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editOrgNr, setEditOrgNr] = useState("");
  const [editUnit, setEditUnit] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editWebsite, setEditWebsite] = useState("");
  const [editLogoFileName, setEditLogoFileName] = useState("");
  const [editLogoFile, setEditLogoFile] = useState<File | null>(null);
  const [editPassword, setEditPassword] = useState("");
  const [editRepeatPassword, setEditRepeatPassword] = useState("");
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);

  // Form states for new available space
  const [spaceTitle, setSpaceTitle] = useState("");
  const [spaceLocation, setSpaceLocation] = useState("Skarprättarvägen 7, Järfälla");
  const [spaceDescription, setSpaceDescription] = useState("");
  const [spaceSuitableForRaw, setSpaceSuitableForRaw] = useState(""); 
  const [spaceTotalArea, setSpaceTotalArea] = useState("");
  const [spaceDetailsLower, setSpaceDetailsLower] = useState("");
  const [spaceDetailsUpper, setSpaceDetailsUpper] = useState("");
  const [spaceSecurityInfo, setSpaceSecurityInfo] = useState("Stäket företagscenter har 24h övervakningssystem");
  const [spaceImgUrl, setSpaceImgUrl] = useState("");

  // Form states for new member
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>("Medlem");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [orgNr, setOrgNr] = useState("");
  const [unit, setUnit] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");
  const [logoFileName, setLogoFileName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const handleSort = (field: keyof UserProfile) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
    if (!emailRegex.test(email)) {
      alert("Ange en giltig e-postadress.");
      return;
    }

    if (password !== repeatPassword) {
      alert("Lösenorden matchar inte.");
      return;
    }

    let logoUrl = "";
    if (logoFile) {
      setIsUploadingLogo(true);
      try {
        logoUrl = await dbService.uploadCompanyLogo(logoFile);
      } catch (err) {
        console.error("Failed to upload company logo:", err);
        alert("Kunde inte ladda upp logotypen. Skapar medlem utan logotyp.");
      } finally {
        setIsUploadingLogo(false);
      }
    }

    onAddProfile({
      name,
      role,
      email,
      password,
      phone: phone || "Ej angivet",
      orgNr: orgNr || "Xxxxxx-xxxx",
      company: company || "Enskild Firma / Privat",
      unit: unit ? (unit.startsWith("Lokal") ? unit : `Lokal ${unit}`) : "Ej angivet",
      address: address || "Regeringsgatan 48, Stockholm",
      description,
      website,
      logo: logoUrl || logoFileName
    });

    // Reset Form
    setName("");
    setRole("Medlem");
    setEmail("");
    setPassword("");
    setRepeatPassword("");
    setPhone("");
    setCompany("");
    setOrgNr("");
    setUnit("");
    setAddress("");
    setDescription("");
    setWebsite("");
    setLogoFileName("");
    setLogoFile(null);
    setShowAddUserModal(false);
  };

  const startEditing = (p: UserProfile) => {
    setEditingProfile(p);
    setEditName(p.name || "");
    setEditRole(p.role || "Medlem");
    setEditEmail(p.email || "");
    setEditPhone(p.phone || "");
    setEditCompany(p.company || "");
    setEditOrgNr(p.orgNr || "");
    setEditUnit(p.unit ? p.unit.replace("Lokal ", "") : "");
    setEditAddress(p.address || "");
    setEditDescription(p.description || "");
    setEditWebsite(p.website || "");
    setEditLogoFileName(p.logo || "");
    setEditLogoFile(null);
    setEditPassword("");
    setEditRepeatPassword("");
  };

  const handleEditUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfile) return;

    setIsUpdatingUser(true);

    if (editEmail) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/;
      if (!emailRegex.test(editEmail)) {
        alert("Ange en giltig e-postadress.");
        setIsUpdatingUser(false);
        return;
      }
    }

    if (editPassword) {
      if (editPassword !== editRepeatPassword) {
        alert("Lösenorden matchar inte.");
        setIsUpdatingUser(false);
        return;
      }
      if (editPassword.length < 6) {
        alert("Lösenordet måste vara minst 6 tecken långt.");
        setIsUpdatingUser(false);
        return;
      }
    }

    let logoUrl = editingProfile.logo || "";
    if (editLogoFile) {
      try {
        logoUrl = await dbService.uploadCompanyLogo(editLogoFile);
      } catch (err) {
        console.error("Failed to upload company logo:", err);
      }
    }

    onUpdateProfile(editingProfile.id, {
      name: editName,
      role: editRole,
      email: editEmail,
      phone: editPhone || "Ej angivet",
      orgNr: editOrgNr || "Xxxxxx-xxxx",
      company: editCompany || "Enskild Firma / Privat",
      unit: editUnit ? (editUnit.startsWith("Lokal") ? editUnit : `Lokal ${editUnit}`) : "Ej angivet",
      address: editAddress || "Regeringsgatan 48, Stockholm",
      description: editDescription,
      website: editWebsite,
      logo: logoUrl,
      ...(editPassword ? { password: editPassword } : {})
    });

    setEditingProfile(null);
    setIsUpdatingUser(false);
  };

  const handleAddSpaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spaceTitle || !spaceDescription || !spaceTotalArea) {
      alert("Vänligen fyll i rubrik, beskrivning och storlek.");
      return;
    }

    const suitableList = spaceSuitableForRaw
      .split(/[\n,;]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0);

    onAddSpace({
      title: spaceTitle,
      location: spaceLocation,
      description: spaceDescription,
      suitableFor: suitableList.length > 0 ? suitableList : ["Allsidig kommersiell användning"],
      totalArea: spaceTotalArea,
      detailsLowerLevel: spaceDetailsLower || "Körbar tillträdesyta med vikport.",
      detailsUpperLevel: spaceDetailsUpper || "Öppen planlösning.",
      securityInfo: spaceSecurityInfo || "Stäket företagscenter har 24h övervakningssystem",
      imgUrl: spaceImgUrl || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800"
    });

    // Reset Form
    setSpaceTitle("");
    setSpaceLocation("Skarprättarvägen 7, Järfälla");
    setSpaceDescription("");
    setSpaceSuitableForRaw("");
    setSpaceTotalArea("");
    setSpaceDetailsLower("");
    setSpaceDetailsUpper("");
    setSpaceSecurityInfo("Stäket företagscenter har 24h övervakningssystem och eget hemsidan");
    setSpaceImgUrl("");
    setShowAddSpaceModal(false);
  };

  // Filter profiles by roleFilter, then sort based on field
  const filteredProfilesForTable = profiles.filter((p) => {
    if (roleFilter === "Alla") return true;
    if (roleFilter === "Medlemmar") return p.role === "Medlem";
    return p.role === roleFilter;
  });

  const sortedProfiles = [...filteredProfilesForTable].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    // Extraction helper for units since they come formatted as "Lokal 22" or "Lokal 5"
    if (sortField === "unit") {
      const aNum = parseInt((a.unit || "").replace(/\D/g, ""), 10) || 0;
      const bNum = parseInt((b.unit || "").replace(/\D/g, ""), 10) || 0;
      return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
    }

    const aStr = String(aVal || "").toLowerCase();
    const bStr = String(bVal || "").toLowerCase();

    if (aStr < bStr) return sortDirection === "asc" ? -1 : 1;
    if (aStr > bStr) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="space-y-8 animate-fade-in" id="admin-view">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-wider">Administration</span>
          </div>
          <h1 className="text-3xl font-sans font-bold tracking-tight text-slate-900">Styrelseportalen</h1>
          <p className="text-slate-500 text-sm">
            Full kontroll över medlemsregistret, uppladdade filer, samt radering av inlägg på anslagstavlan.
          </p>
        </div>

        {/* Quick statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Medlemmar</span>
            <span className="text-lg font-bold text-slate-800">{profiles.length}st</span>
          </div>
          <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Anslag</span>
            <span className="text-lg font-bold text-slate-800">{notices.length}st</span>
          </div>
          <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 text-center">
            <span className="text-[10px] text-slate-400 font-bold block uppercase">Filer</span>
            <span className="text-lg font-bold text-slate-800">{files.length}st</span>
          </div>
          <div className="bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100 text-center bg-amber-50/20 border-amber-500/10">
            <span className="text-[10px] text-amber-600 font-extrabold block uppercase tracking-wider">Lediga lokaler</span>
            <span className="text-lg font-bold text-slate-900">{spaces.length}st</span>
          </div>
        </div>
      </div>

      {/* Admin Subtabs selection */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSubTab("användare")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors border ${
            subTab === "användare"
              ? "bg-slate-900 text-white border-slate-950"
              : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
          }`}
        >
          <Users className="w-4 h-4" />
          Användare & Medlemmar
        </button>

        <button
          onClick={() => setSubTab("filer")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors border ${
            subTab === "filer"
              ? "bg-slate-900 text-white border-slate-950"
              : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
          }`}
        >
          <FileText className="w-4 h-4" />
          Kontrollera Filer ({files.length})
        </button>

        <button
          onClick={() => setSubTab("anslagstavla")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors border ${
            subTab === "anslagstavla"
              ? "bg-slate-900 text-white border-slate-950"
              : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
          }`}
        >
          <Bell className="w-4 h-4" />
          Radera Anslag ({notices.length})
        </button>

        <button
          onClick={() => setSubTab("lediga_lokaler")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors border ${
            subTab === "lediga_lokaler"
              ? "bg-slate-900 text-white border-slate-950"
              : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
          }`}
        >
          <Building2 className="w-4 h-4" />
          Lediga Lokaler Järfälla ({spaces.length})
        </button>
      </div>

      {/* ACTIVE SUBTAB 1 - USERS MANAGEMENT */}
      {subTab === "användare" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-bold text-slate-800 text-base">Medlemsregister</h3>
              <p className="text-xs text-slate-500">Klicka på kolumnrubrikerna för att sortera efter Lokal, Namn eller Roll.</p>
            </div>
            {activeUserRole === "Administrator" && (
              <button
                id="btn-add-member"
                onClick={() => setShowAddUserModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-xl cursor-pointer shadow-3xs"
              >
                <Plus className="w-4 h-4" />
                Skapa ny användare
              </button>
            )}
          </div>

          {/* Role Filter Tabs */}
          <div className="flex flex-wrap gap-1.5 pb-1">
            {([
              { key: "Alla", label: "Alla" },
              { key: "Medlemmar", label: "Medlemmar" },
              { key: "Hyresgäst", label: "Hyresgäster" },
              { key: "Styrelse", label: "Styrelse" },
              { key: "Administrator", label: "Administrator" }
            ] as const).map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setRoleFilter(opt.key)}
                className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold border transition-colors cursor-pointer ${
                  roleFilter === opt.key
                    ? "bg-slate-900 text-white border-slate-950 shadow-2xs"
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold text-[10px] uppercase tracking-wider">
                    <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors" onClick={() => handleSort("unit")}>
                      <div className="flex items-center gap-1">
                        Lokal {sortField === "unit" && (sortDirection === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                      </div>
                    </th>
                    <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors" onClick={() => handleSort("name")}>
                      <div className="flex items-center gap-1">
                        Namn {sortField === "name" && (sortDirection === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                      </div>
                    </th>
                    <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors" onClick={() => handleSort("company")}>
                      <div className="flex items-center gap-1">
                        Företag {sortField === "company" && (sortDirection === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                      </div>
                    </th>
                    <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors" onClick={() => handleSort("orgNr")}>
                      <div className="flex items-center gap-1">
                        Org.nr {sortField === "orgNr" && (sortDirection === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                      </div>
                    </th>
                    <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors" onClick={() => handleSort("email")}>
                      <div className="flex items-center gap-1">
                        E-post {sortField === "email" && (sortDirection === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                      </div>
                    </th>
                    <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors" onClick={() => handleSort("phone")}>
                      <div className="flex items-center gap-1">
                        Telefon {sortField === "phone" && (sortDirection === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                      </div>
                    </th>
                    <th className="px-5 py-3.5 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors" onClick={() => handleSort("role")}>
                      <div className="flex items-center gap-1">
                        Roll {sortField === "role" && (sortDirection === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />)}
                      </div>
                    </th>
                    {activeUserRole === "Administrator" && <th className="px-5 py-3.5 text-right">Åtgärder</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {sortedProfiles.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/55 transition-colors">
                      <td className="px-5 py-4 font-bold text-slate-800">{p.unit}</td>
                      <td className="px-5 py-4 font-semibold text-slate-700">{p.name}</td>
                      <td className="px-5 py-4 text-slate-500 truncate max-w-[140px]">{p.company}</td>
                      <td className="px-5 py-4 text-slate-500 font-mono">{p.orgNr}</td>
                      <td className="px-5 py-4 text-slate-500 font-mono">{p.email}</td>
                      <td className="px-5 py-4 text-slate-500 whitespace-nowrap">{p.phone}</td>
                      <td className="px-5 py-4">
                        <select
                          value={p.role}
                          onChange={(e) => onUpdateRole(p.id, e.target.value as UserRole)}
                          disabled={activeUserRole !== "Administrator"}
                          className={`px-2 py-1 rounded-md border text-[11px] font-semibold bg-white ${
                            activeUserRole === "Administrator" ? "border-slate-200 cursor-pointer" : "border-transparent appearance-none"
                          }`}
                        >
                          <option value="Administrator">Administrator</option>
                          <option value="Styrelse">Styrelse</option>
                          <option value="Medlem">Medlem</option>
                          <option value="Hyresgäst">Hyresgäst</option>
                        </select>
                      </td>
                      {activeUserRole === "Administrator" && (
                        <td className="px-5 py-4 text-right whitespace-nowrap space-x-1">
                          <button
                            onClick={() => startEditing(p)}
                            className="p-1.5 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Redigera användare"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span className="hidden lg:inline text-[10px] font-semibold">Ändra</span>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Är du säker på att du vill radera användaren "${p.name}"? Detta tar bort medlemmens profil permanent.`)) {
                                onDeleteProfile(p.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Radera användare"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden lg:inline text-[10px] font-semibold">Ta bort</span>
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE SUBTAB 2 - FILES REPO OVERVIEW */}
      {subTab === "filer" && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-0.5">
            <h3 className="font-bold text-slate-800 text-base">Dokumenthantering</h3>
            <p className="text-xs text-slate-500">Du kan läsa medlemsfiler och radera föråldrade dokument ur databasen.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map((file) => (
              <div key={file.id} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center justify-between gap-4">
                <div className="truncate">
                  <span className={`inline-block px-1.5 py-0.2 text-[9px] font-bold rounded uppercase mb-1 ${file.category === 'Styrelsefiler' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
                    {file.category} {file.folder ? `• ${file.folder}` : ""}
                  </span>
                  <p className="font-bold text-xs text-slate-800 truncate">{file.name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{file.fileSize} • Spara-datum: {file.uploadedAt}</p>
                </div>

                {activeUserRole === "Administrator" && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Är du säker på att du vill radera filen "${file.name}" permanent?`)) {
                        onDeleteFile(file.id, file.name, file.category);
                      }
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 shrink-0 transition-all cursor-pointer"
                    title="Radera fil permanent"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE SUBTAB 3 - NOTICEBOARD MODERATION */}
      {subTab === "anslagstavla" && (
        <div className="space-y-4 animate-fade-in">
          <div className="space-y-0.5">
            <h3 className="font-bold text-slate-800 text-base">Modereringspanel</h3>
            <p className="text-xs text-slate-500">Radera eller justera anslag på anslagstavlan direkt.</p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs">
            <div className="divide-y divide-slate-100">
              {notices.map((post) => (
                <div key={post.id} className="p-4 flex items-start justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-slate-100 text-slate-500 border border-slate-200">
                        {post.category}
                      </span>
                      {post.isPinned && <span className="text-[10px] text-emerald-600 font-bold">📌 FÄST</span>}
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm">{post.title}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2 md:line-clamp-none leading-relaxed">
                      {post.content}
                    </p>
                    <span className="text-[10px] text-slate-400 block pt-1">Av: {post.author} • Publicerat: {post.date}</span>
                  </div>

                  {activeUserRole === "Administrator" && (
                    <button
                      onClick={() => {
                        if (window.confirm(`Är du säker på att du vill radera anslaget "${post.title}"?`)) {
                          onDeleteNotice(post.id);
                        }
                      }}
                      className="p-2 ml-auto text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                      title="Radera anslag"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVE SUBTAB 4 - VACANT SPACES MANAGER */}
      {subTab === "lediga_lokaler" && (
        <div className="space-y-4 animate-fade-in" id="admin-spaces-manager">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-bold text-slate-800 text-base">Annonser för lediga lokaler</h3>
              <p className="text-xs text-slate-500">Skapa, kontrollera och ta bort fastighetsannonser för tillgängliga ytor.</p>
            </div>
            {activeUserRole === "Administrator" && (
              <button
                onClick={() => setShowAddSpaceModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-900 text-xs font-bold rounded-xl cursor-pointer shadow-3xs border border-amber-600 uppercase"
              >
                <Plus className="w-4 h-4" />
                Skapa Ny Annons
              </button>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs">
            {spaces.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-semibold">
                Det finns inga aktiva lokalannonser just nu. Skapa en ny annons ovan.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {spaces.map((space) => (
                  <div key={space.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-amber-100 text-amber-800 border border-amber-200">
                          {space.totalArea.startsWith("ca ") ? space.totalArea.split(" ").slice(0, 3).join(" ") : space.totalArea.split(" ").slice(0, 2).join(" ")}
                        </span>
                        <span className="text-[10px] text-slate-450 font-semibold">Skapad: {space.createdAt}</span>
                      </div>
                      <h4 className="font-bold text-slate-800 text-sm">{space.title}</h4>
                      <p className="text-xs text-slate-500 truncate max-w-sm sm:max-w-xl leading-relaxed">{space.description}</p>
                      <p className="text-[10px] text-slate-400 font-mono">Läge: {space.location}</p>
                    </div>

                    {activeUserRole === "Administrator" && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Är du säker på att du vill radera annonsen "${space.title}"?`)) {
                            onDeleteSpace(space.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 text-xs font-bold"
                        title="Radera annons"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Ta bort</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-slate-950/45 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between p-5 bg-slate-900 text-white shrink-0">
              <div className="space-y-0.5">
                <h3 className="font-bold text-base">Registrera ny medlem</h3>
                <p className="text-[10px] text-slate-300">Medlemmen läggs automatiskt in i medlemsmatrikeln och kontaktboken.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2.5 py-1 bg-slate-800 rounded-lg cursor-pointer transition-colors"
              >
                Stäng
              </button>
            </div>

            <form onSubmit={handleAddUser} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Namn *</label>
                <input
                  id="user-name"
                  type="text"
                  required
                  placeholder="Namn"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">E-postadress *</label>
                <input
                  id="user-email"
                  type="email"
                  required
                  placeholder="E-postadress"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md bg-blue-50/50 text-xs text-blue-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Roll *</label>
                <select
                  id="user-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md bg-slate-50 text-xs"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Styrelse">Styrelse</option>
                  <option value="Medlem">Medlem</option>
                  <option value="Hyresgäst">Hyresgäst</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Lösenord *</label>
                <input
                  id="user-password"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md bg-blue-50/50 text-xs text-blue-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Upprepa Lösenord *</label>
                <input
                  id="user-repeat-password"
                  type="password"
                  placeholder="Upprepa Lösenord"
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                />
              </div>

              {(role === "Medlem" || role === "Hyresgäst") && (
                <div className="pt-4 pb-2 border-t border-slate-100 flex items-center justify-center">
                  <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">
                    Fylles I Endast För Rollen "Medlem" eller "Hyresgäst".
                  </span>
                </div>
              )}

              {(role === "Medlem" || role === "Hyresgäst") && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Företag</label>
                    <input
                      id="user-company"
                      type="text"
                      placeholder="Företag"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Lokal NR</label>
                    <input
                      id="user-unit"
                      type="text"
                      placeholder="Lokal NR"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Adress</label>
                    <input
                      id="user-address"
                      type="text"
                      placeholder="Adress"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Telefon</label>
                    <input
                      id="user-phone"
                      type="text"
                      placeholder="Telefon"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Org. Nr.</label>
                    <input
                      id="user-orgnr"
                      type="text"
                      placeholder="Org. Nr."
                      value={orgNr}
                      onChange={(e) => setOrgNr(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Beskrivning</label>
                    <textarea
                      id="user-description"
                      placeholder="Beskrivning"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Webbaddress</label>
                    <input
                      id="user-website"
                      type="text"
                      placeholder="Webbaddress"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-semibold mb-1 block">Logotyp:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        setLogoFile(file);
                        setLogoFileName(file ? file.name : "");
                      }}
                      className="w-full text-[10px] text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border file:border-slate-300 file:bg-white file:text-xs file:font-semibold hover:file:bg-slate-50 cursor-pointer"
                    />
                    <p className="text-[9px] text-slate-400 mt-1">(önskad storlek: 400x240)</p>
                  </div>
                </div>
              )}

              <div className="pt-2 shrink-0">
                <button
                  id="btn-save-new-profile"
                  type="submit"
                  disabled={isUploadingLogo}
                  className="w-full px-5 py-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 border border-slate-950 cursor-pointer shadow-md rounded-lg disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                  {isUploadingLogo ? "LADDAR UPP LOGOTYP..." : "SKAPA ANVÄNDARE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingProfile && (
        <div className="fixed inset-0 bg-slate-950/45 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between p-5 bg-slate-900 text-white shrink-0">
              <div className="space-y-0.5">
                <h3 className="font-bold text-base">Redigera medlemsinformation</h3>
                <p className="text-[10px] text-slate-300">Ändra uppgifterna för {editingProfile.name}.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProfile(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2.5 py-1 bg-slate-800 rounded-lg cursor-pointer transition-colors"
              >
                Avbryt
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Namn *</label>
                <input
                  type="text"
                  required
                  placeholder="Namn"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">E-postadress *</label>
                <input
                  type="email"
                  required
                  placeholder="E-postadress"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs bg-slate-50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Roll *</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md bg-slate-50 text-xs"
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Styrelse">Styrelse</option>
                  <option value="Medlem">Medlem</option>
                  <option value="Hyresgäst">Hyresgäst</option>
                </select>
              </div>

              <div className="pt-4 pb-2 border-t border-slate-100 flex items-center justify-center">
                <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">
                  Säkerhetsuppgifter (Valfritt)
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Lösenord (Lämna tomt för att behålla nuvarande)</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Upprepa Lösenord</label>
                <input
                  type="password"
                  placeholder="Upprepa Lösenord"
                  value={editRepeatPassword}
                  onChange={(e) => setEditRepeatPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                />
              </div>

              <div className="pt-4 pb-2 border-t border-slate-100 flex items-center justify-center">
                <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">
                  Medlems- &amp; Profiluppgifter
                </span>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Företag / Organisation</label>
                  <input
                    type="text"
                    placeholder="Företagsnamn"
                    value={editCompany}
                    onChange={(e) => setEditCompany(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Lokal NR</label>
                  <input
                    type="text"
                    placeholder="t.ex. 22"
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Adress</label>
                  <input
                    type="text"
                    placeholder="Gatuadress"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Telefon</label>
                  <input
                    type="text"
                    placeholder="Telefonnummer"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Org. Nr.</label>
                  <input
                    type="text"
                    placeholder="Organisationsnummer"
                    value={editOrgNr}
                    onChange={(e) => setEditOrgNr(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Beskrivning</label>
                  <textarea
                    placeholder="Beskrivning av verksamheten..."
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Webbaddress</label>
                  <input
                    type="text"
                    placeholder="t.ex. www.foretaget.se"
                    value={editWebsite}
                    onChange={(e) => setEditWebsite(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-semibold mb-1 block">Logotyp / Bild:</label>
                  {editLogoFileName && (
                    <div className="text-[10px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 mb-2 flex items-center justify-between">
                      <span className="truncate">{editLogoFileName}</span>
                      <button
                        type="button"
                        onClick={() => setEditLogoFileName("")}
                        className="text-rose-500 font-bold hover:underline"
                      >
                        Ta bort
                      </button>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setEditLogoFile(file);
                      setEditLogoFileName(file ? file.name : "");
                    }}
                    className="w-full text-[10px] text-slate-500 file:mr-4 file:py-1 file:px-2 file:rounded file:border file:border-slate-300 file:bg-white file:text-xs file:font-semibold hover:file:bg-slate-50 cursor-pointer"
                  />
                  <p className="text-[9px] text-slate-400 mt-1">(önskad storlek: 400x240)</p>
                </div>
              </div>

              <div className="pt-2 shrink-0">
                <button
                  type="submit"
                  disabled={isUpdatingUser}
                  className="w-full px-5 py-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 border border-slate-950 cursor-pointer shadow-md rounded-lg disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                  {isUpdatingUser ? "Sparar ändringar..." : "SPARA MEDLEM"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Available Space Modal */}
      {showAddSpaceModal && (
        <div className="fixed inset-0 bg-slate-950/45 flex items-center justify-center p-4 z-50 animate-fade-in" id="add-space-modal">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-xl overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between p-5 bg-slate-900 text-white">
              <div className="space-y-0.5">
                <h3 className="font-bold text-base">Skapa ny annons för ledig lokal</h3>
                <p className="text-[10px] text-slate-300">Annonsen kommer att synas direkt under sektionen "Lediga Lokaler Järfälla".</p>
              </div>
              <button
                onClick={() => setShowAddSpaceModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                Stäng
              </button>
            </div>

            <form onSubmit={handleAddSpaceSubmit} className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Rubrik / Namn *</label>
                <input
                  type="text"
                  required
                  placeholder="t.ex. Kombilokal i Kallhäll"
                  value={spaceTitle}
                  onChange={(e) => setSpaceTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Geografiskt läge / Adress *</label>
                <input
                  type="text"
                  required
                  value={spaceLocation}
                  onChange={(e) => setSpaceLocation(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Huvudbeskrivning *</label>
                <textarea
                  required
                  placeholder="Beskriv lokalen, omgivningen, förbindelser och kända grannar..."
                  rows={4}
                  value={spaceDescription}
                  onChange={(e) => setSpaceDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs resize-y"
                />
              </div>

              <div className="space-y-1 block">
                <label className="text-[10px] font-bold text-slate-500 uppercase block">Lokalen passar utmärkt för (Ange en per rad eller separerat med kommatecken):</label>
                <textarea
                  placeholder="t.ex.&#10;bilförsäljning, bil och däck verkstad&#10;showroom och kontor&#10;hantverksfirma med kombinerat lager"
                  rows={3}
                  value={spaceSuitableForRaw}
                  onChange={(e) => setSpaceSuitableForRaw(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs resize-y font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Total Yta / Storlek *</label>
                <input
                  type="text"
                  required
                  placeholder="t.ex. ca 215 kvm fördelad lika på två plan"
                  value={spaceTotalArea}
                  onChange={(e) => setSpaceTotalArea(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Nedre plan detaljer</label>
                  <input
                    type="text"
                    placeholder="t.ex. 5m takhöjd, vikport 4x4.5m, golvvärme, brunn"
                    value={spaceDetailsLower}
                    onChange={(e) => setSpaceDetailsLower(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Övre plan detaljer</label>
                  <input
                    type="text"
                    placeholder="t.ex. öppen planlösning (can rumsindelas)"
                    value={spaceDetailsUpper}
                    onChange={(e) => setSpaceDetailsUpper(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Säkerhet &amp; Övrigt</label>
                <input
                  type="text"
                  value={spaceSecurityInfo}
                  onChange={(e) => setSpaceSecurityInfo(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Bild URL (Valfri länk till foto)</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={spaceImgUrl}
                  onChange={(e) => setSpaceImgUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full px-5 py-3 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 border border-slate-950 cursor-pointer shadow-md rounded uppercase tracking-wider"
                >
                  Publicera Annons
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
