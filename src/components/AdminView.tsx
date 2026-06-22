/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { dbService } from "../lib/db";
import { Users, FileText, Bell, Plus, ArrowUp, ArrowDown, Edit2, Trash2, CheckCircle2, AlertTriangle, ShieldCheck, Building2, Sparkles, Image, Upload, Copy } from "lucide-react";
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

type AdminSubTab = "användare" | "filer" | "anslagstavla" | "lediga_lokaler" | "ai_support" | "galleri";

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
  const [editBoardTitle, setEditBoardTitle] = useState("");
  const [editHideInContactBook, setEditHideInContactBook] = useState(false);
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
  const [boardTitle, setBoardTitle] = useState("");
  const [hideInContactBook, setHideInContactBook] = useState(false);
  const [logoFileName, setLogoFileName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  // Gallery states
  const [selectedGalleryLogoUrl, setSelectedGalleryLogoUrl] = useState("");
  const [editSelectedGalleryLogoUrl, setEditSelectedGalleryLogoUrl] = useState("");
  const [showGalleryPickerModal, setShowGalleryPickerModal] = useState<"add" | "edit" | null>(null);
  const [galleryLogos, setGalleryLogos] = useState<{ name: string; url: string }[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(false);
  const [galleryUploadFile, setGalleryUploadFile] = useState<File | null>(null);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Space Gallery states
  const [galleryCategory, setGalleryCategory] = useState<"logos" | "spaces">("logos");
  const [spaceImages, setSpaceImages] = useState<{ name: string; url: string }[]>([]);
  const [isLoadingSpaceImages, setIsLoadingSpaceImages] = useState(false);
  const [spaceImageUploadFile, setSpaceImageUploadFile] = useState<File | null>(null);
  const [isUploadingSpaceImage, setIsUploadingSpaceImage] = useState(false);
  const [selectedGallerySpaceImageUrls, setSelectedGallerySpaceImageUrls] = useState<string[]>([]);
  const [showSpaceGalleryPickerModal, setShowSpaceGalleryPickerModal] = useState<boolean>(false);

  const fetchGalleryLogos = async () => {
    setIsLoadingGallery(true);
    try {
      const list = await dbService.listCompanyLogos();
      setGalleryLogos(list);
    } catch (err) {
      console.error("Failed to load gallery logos:", err);
    } finally {
      setIsLoadingGallery(false);
    }
  };

  const fetchSpaceImages = async () => {
    setIsLoadingSpaceImages(true);
    try {
      const list = await dbService.listSpaceImages();
      setSpaceImages(list);
    } catch (err) {
      console.error("Failed to load space images:", err);
    } finally {
      setIsLoadingSpaceImages(false);
    }
  };

  const handleDeleteGalleryLogo = async (name: string) => {
    if (!window.confirm("Är du säker på att du vill ta bort den här logotypen permanent från galleriet?")) return;
    try {
      await dbService.deleteCompanyLogo(name);
      fetchGalleryLogos();
    } catch (err) {
      alert("Kunde inte radera logotypen.");
    }
  };

  const handleDeleteSpaceImage = async (name: string) => {
    if (!window.confirm("Är du säker på att du vill ta bort den här bilden permanent från galleriet?")) return;
    try {
      await dbService.deleteSpaceImage(name);
      fetchSpaceImages();
    } catch (err) {
      alert("Kunde inte radera bilden.");
    }
  };

  useEffect(() => {
    if (subTab === "galleri") {
      if (galleryCategory === "logos") {
        fetchGalleryLogos();
      } else {
        fetchSpaceImages();
      }
    }
  }, [subTab, galleryCategory]);

  useEffect(() => {
    if (showGalleryPickerModal) {
      fetchGalleryLogos();
    }
  }, [showGalleryPickerModal]);

  useEffect(() => {
    if (showSpaceGalleryPickerModal) {
      fetchSpaceImages();
    }
  }, [showSpaceGalleryPickerModal]);

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

    let logoUrl = selectedGalleryLogoUrl || "";
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
      logo: logoUrl || logoFileName,
      boardTitle,
      hideInContactBook
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
    setBoardTitle("");
    setHideInContactBook(false);
    setLogoFileName("");
    setSelectedGalleryLogoUrl("");
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
    setEditBoardTitle(p.boardTitle || "");
    setEditHideInContactBook(p.hideInContactBook || false);
    setEditLogoFileName(p.logo || "");
    setEditSelectedGalleryLogoUrl(p.logo || "");
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

    let logoUrl = editSelectedGalleryLogoUrl || editingProfile.logo || "";
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
      boardTitle: editBoardTitle,
      hideInContactBook: editHideInContactBook,
      ...(editPassword ? { password: editPassword } : {})
    });

    setEditingProfile(null);
    setEditSelectedGalleryLogoUrl("");
    setEditLogoFileName("");
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

    const finalImgUrls = selectedGallerySpaceImageUrls.length > 0 
      ? selectedGallerySpaceImageUrls 
      : [spaceImgUrl || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800"];

    onAddSpace({
      title: spaceTitle,
      location: spaceLocation,
      description: spaceDescription,
      suitableFor: suitableList.length > 0 ? suitableList : ["Allsidig kommersiell användning"],
      totalArea: spaceTotalArea,
      detailsLowerLevel: spaceDetailsLower || "Körbar tillträdesyta med vikport.",
      detailsUpperLevel: spaceDetailsUpper || "Öppen planlösning.",
      securityInfo: spaceSecurityInfo || "Stäket företagscenter har 24h övervakningssystem",
      imgUrl: finalImgUrls[0],
      imgUrls: finalImgUrls
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
    setSelectedGallerySpaceImageUrls([]);
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

        <button
          onClick={() => setSubTab("galleri")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors border ${
            subTab === "galleri"
              ? "bg-slate-900 text-white border-slate-950"
              : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
          }`}
        >
          <Image className="w-4 h-4" />
          Galleri &amp; Bilder
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

      {/* ACTIVE SUBTAB 5 - GALLERY */}
      {subTab === "galleri" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-bold text-slate-800 text-base">Bildgalleri</h3>
              <p className="text-xs text-slate-500">Hantera uppladdade bilder för lokaler och medlemslogotyper.</p>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl w-full max-w-sm shrink-0 mb-4">
            <button
              onClick={() => setGalleryCategory("logos")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                galleryCategory === "logos" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Företagslogotyper
            </button>
            <button
              onClick={() => setGalleryCategory("spaces")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg cursor-pointer transition-colors ${
                galleryCategory === "spaces" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Lokalbilder
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-2xs p-6">
            <div className="mb-6 flex flex-col sm:flex-row items-center gap-4 justify-between border-b border-slate-100 pb-6">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
                    <Upload className="w-5 h-5" />
                 </div>
                 <div>
                   <h4 className="font-bold text-slate-800 text-sm">Ladda upp ny bild</h4>
                   <p className="text-[10px] text-slate-500">Accepterade format: JPG, PNG, WEBP.</p>
                 </div>
               </div>
               
               <div className="flex items-center gap-2 w-full sm:w-auto">
                 <input
                   type="file"
                   accept="image/*"
                   onChange={(e) => {
                     const file = e.target.files?.[0] || null;
                     if (galleryCategory === "logos") setGalleryUploadFile(file);
                     else setSpaceImageUploadFile(file);
                   }}
                   className="flex-1 sm:w-48 text-[10px] text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-100 file:text-slate-700 file:text-xs file:font-bold hover:file:bg-slate-200 cursor-pointer"
                   id="gallery-direct-upload"
                 />
                 <button
                   onClick={async () => {
                     if (galleryCategory === "logos" && galleryUploadFile) {
                       setIsUploadingGallery(true);
                       try {
                         await dbService.uploadCompanyLogo(galleryUploadFile);
                         setGalleryUploadFile(null);
                         const input = document.getElementById("gallery-direct-upload") as HTMLInputElement;
                         if (input) input.value = "";
                         fetchGalleryLogos();
                       } catch(err) {
                         alert("Kunde inte ladda upp logotyp.");
                       } finally {
                         setIsUploadingGallery(false);
                       }
                     } else if (galleryCategory === "spaces" && spaceImageUploadFile) {
                       setIsUploadingSpaceImage(true);
                       try {
                         await dbService.uploadSpaceImage(spaceImageUploadFile);
                         setSpaceImageUploadFile(null);
                         const input = document.getElementById("gallery-direct-upload") as HTMLInputElement;
                         if (input) input.value = "";
                         fetchSpaceImages();
                       } catch(err) {
                         alert("Kunde inte ladda upp lokalbild.");
                       } finally {
                         setIsUploadingSpaceImage(false);
                       }
                     }
                   }}
                   disabled={(galleryCategory === "logos" ? !galleryUploadFile || isUploadingGallery : !spaceImageUploadFile || isUploadingSpaceImage)}
                   className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                 >
                   {galleryCategory === "logos" 
                      ? (isUploadingGallery ? "Laddar..." : "Ladda upp")
                      : (isUploadingSpaceImage ? "Laddar..." : "Ladda upp")}
                 </button>
               </div>
            </div>

            {/* Gallery Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {(galleryCategory === "logos" ? galleryLogos : spaceImages).length === 0 ? (
                <div className="col-span-full py-12 text-center text-slate-400 text-xs font-semibold">
                  Inga {galleryCategory === "logos" ? "logotyper" : "lokalbilder"} hittades i galleriet.
                </div>
              ) : (
                (galleryCategory === "logos" ? galleryLogos : spaceImages).map((img, idx) => (
                  <div key={idx} className="group relative bg-slate-50 rounded-xl border border-slate-200 overflow-hidden aspect-square flex items-center justify-center">
                    <img src={img.url} alt={img.name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
                    
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2">
                       <button
                         type="button"
                         onClick={() => {
                           navigator.clipboard.writeText(img.url);
                           alert("Länk kopierad till urklipp!");
                         }}
                         className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm cursor-pointer"
                         title="Kopiera länk"
                       >
                         <Copy className="w-4 h-4" />
                       </button>
                       <button
                         type="button"
                         onClick={() => {
                           if (galleryCategory === "logos") handleDeleteGalleryLogo(img.name);
                           else handleDeleteSpaceImage(img.name);
                         }}
                         className="p-2 bg-rose-500/80 hover:bg-rose-500 text-white rounded-lg backdrop-blur-sm cursor-pointer"
                         title="Radera bild"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                    </div>

                    <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-slate-900/80 to-transparent">
                      <p className="text-[9px] text-white font-mono truncate">{img.name}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
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

              <div className="pt-4 pb-2 border-t border-slate-100 flex items-center justify-center">
                <span className="text-[10px] text-slate-500 font-semibold tracking-wide uppercase">
                  Profiluppgifter
                </span>
              </div>

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

                {(role === "Styrelse" || role === "Administrator") && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Styrelse-post / Roll</label>
                    <input
                      id="user-board-title"
                      type="text"
                      placeholder="t.ex. Ordförande, Sekreterare"
                      value={boardTitle}
                      onChange={(e) => setBoardTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                    />
                  </div>
                )}

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
                  <button
                    type="button"
                    onClick={() => setShowGalleryPickerModal("add")}
                    className="w-full mt-1.5 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Image className="w-3.5 h-3.5 text-slate-400" />
                    Välj från galleri
                  </button>
                  {selectedGalleryLogoUrl && (
                    <div className="mt-1.5 text-[10px] text-emerald-600 font-semibold bg-emerald-50 p-1.5 rounded border border-emerald-100 flex items-center justify-between">
                      <span className="truncate">Vald: {logoFileName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGalleryLogoUrl("");
                          setLogoFileName("");
                        }}
                        className="text-rose-500 font-bold hover:underline"
                      >
                        Rensa
                      </button>
                    </div>
                  )}
                  <p className="text-[9px] text-slate-400 mt-1">(önskad storlek: 400x240)</p>
                  <div className="flex items-center gap-2 pt-3">
                    <input
                      type="checkbox"
                      id="hideInContactBook"
                      checked={hideInContactBook}
                      onChange={(e) => setHideInContactBook(e.target.checked)}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-950 h-4 w-4 cursor-pointer"
                    />
                    <label htmlFor="hideInContactBook" className="text-xs text-slate-700 font-semibold select-none cursor-pointer">
                      Dölj i kontaktboken
                    </label>
                  </div>
                </div>
              </div>

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

                {(editRole === "Styrelse" || editRole === "Administrator") && (
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Styrelse-post / Roll</label>
                    <input
                      type="text"
                      placeholder="t.ex. Ordförande, Sekreterare"
                      value={editBoardTitle}
                      onChange={(e) => setEditBoardTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-md text-xs"
                    />
                  </div>
                )}

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
                  <button
                    type="button"
                    onClick={() => setShowGalleryPickerModal("edit")}
                    className="w-full mt-1.5 py-1.5 border border-slate-200 rounded-md bg-white hover:bg-slate-50 text-slate-700 text-[10px] font-bold cursor-pointer flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Image className="w-3.5 h-3.5 text-slate-400" />
                    Välj från galleri
                  </button>
                  {editSelectedGalleryLogoUrl && (
                    <div className="mt-1.5 text-[10px] text-emerald-600 font-semibold bg-emerald-50 p-1.5 rounded border border-emerald-100 flex items-center justify-between">
                      <span className="truncate">Vald: {editLogoFileName}</span>
                      <button
                        type="button"
                        onClick={() => {
                          setEditSelectedGalleryLogoUrl("");
                          setEditLogoFileName("");
                        }}
                        className="text-rose-500 font-bold hover:underline"
                      >
                        Rensa
                      </button>
                    </div>
                  )}
                  <p className="text-[9px] text-slate-400 mt-1">(önskad storlek: 400x240)</p>
                  <div className="flex items-center gap-2 pt-3">
                    <input
                      type="checkbox"
                      id="editHideInContactBook"
                      checked={editHideInContactBook}
                      onChange={(e) => setEditHideInContactBook(e.target.checked)}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-950 h-4 w-4 cursor-pointer"
                    />
                    <label htmlFor="editHideInContactBook" className="text-xs text-slate-700 font-semibold select-none cursor-pointer">
                      Dölj i kontaktboken
                    </label>
                  </div>
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
                <label className="text-[10px] font-bold text-slate-500 uppercase">Lokalbilder (Välj från galleri)</label>
                {selectedGallerySpaceImageUrls.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2 animate-fade-in">
                    {selectedGallerySpaceImageUrls.map((url, idx) => (
                      <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-200">
                         <img src={url} alt={`Vald bild ${idx+1}`} className="w-full h-full object-cover" />
                         <button
                           type="button"
                           onClick={() => setSelectedGallerySpaceImageUrls(prev => prev.filter(u => u !== url))}
                           className="absolute top-1 right-1 p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-md cursor-pointer shadow-sm"
                         >
                           <Trash2 className="w-3 h-3" />
                         </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setShowSpaceGalleryPickerModal(true)}
                      className="aspect-video rounded-xl border border-dashed border-slate-300 hover:border-slate-400 hover:bg-slate-50 flex flex-col items-center justify-center text-slate-400 hover:text-slate-500 cursor-pointer transition-colors"
                    >
                      <Plus className="w-4 h-4 mb-1" />
                      <span className="text-[10px] font-bold">Lägg till</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowSpaceGalleryPickerModal(true)}
                    className="w-full py-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold cursor-pointer flex items-center justify-center gap-2 transition-colors"
                  >
                    <Image className="w-4 h-4 text-slate-400" />
                    Välj bilder från galleri
                  </button>
                )}
                <p className="text-[9px] text-slate-400 mt-1">Du kan välja flera bilder till samma annons.</p>
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

      {/* Logo Gallery Picker Modal */}
      {showGalleryPickerModal && (
        <div className="fixed inset-0 bg-slate-950/45 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between p-5 bg-slate-900 text-white shrink-0">
              <div className="space-y-0.5">
                <h3 className="font-bold text-base flex items-center gap-2"><Image className="w-5 h-5"/> Välj Företagslogotyp</h3>
                <p className="text-[10px] text-slate-300">Välj en logotyp från galleriet för att koppla till medlemmen.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowGalleryPickerModal(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2.5 py-1 bg-slate-800 rounded-lg cursor-pointer transition-colors"
              >
                Stäng
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {isLoadingGallery ? (
                 <div className="py-12 flex items-center justify-center text-slate-400 font-bold text-xs">Laddar galleri...</div>
              ) : galleryLogos.length === 0 ? (
                 <div className="py-12 text-center text-slate-400 font-bold text-xs">Inga logotyper hittades i galleriet. Vänligen ladda upp via "Galleri"-fliken först, eller ladda upp filen direkt.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {galleryLogos.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                         if (showGalleryPickerModal === "add") {
                           setSelectedGalleryLogoUrl(img.url);
                           setLogoFileName(img.name);
                         } else {
                           setEditSelectedGalleryLogoUrl(img.url);
                           setEditLogoFileName(img.name);
                         }
                         setShowGalleryPickerModal(null);
                      }}
                      className="group relative bg-slate-50 rounded-xl border border-slate-200 overflow-hidden aspect-square flex items-center justify-center hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                         <span className="px-3 py-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-lg shadow-sm">VÄLJ</span>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-slate-900/80 to-transparent">
                        <p className="text-[9px] text-white font-mono truncate">{img.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Space Images Gallery Picker Modal */}
      {showSpaceGalleryPickerModal && (
        <div className="fixed inset-0 bg-slate-950/45 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between p-5 bg-slate-900 text-white shrink-0">
              <div className="space-y-0.5">
                <h3 className="font-bold text-base flex items-center gap-2"><Image className="w-5 h-5"/> Välj Lokalbilder</h3>
                <p className="text-[10px] text-slate-300">Välj en eller flera bilder från galleriet att visa i annonsen.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSpaceGalleryPickerModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2.5 py-1 bg-slate-800 rounded-lg cursor-pointer transition-colors"
              >
                Klar
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {isLoadingSpaceImages ? (
                 <div className="py-12 flex items-center justify-center text-slate-400 font-bold text-xs">Laddar galleri...</div>
              ) : spaceImages.length === 0 ? (
                 <div className="py-12 text-center text-slate-400 font-bold text-xs">Inga lokalbilder hittades i galleriet. Vänligen ladda upp via "Galleri"-fliken först.</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {spaceImages.map((img, idx) => {
                    const isSelected = selectedGallerySpaceImageUrls.includes(img.url);
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                           setSelectedGallerySpaceImageUrls(prev => 
                             isSelected 
                               ? prev.filter(u => u !== img.url)
                               : [...prev, img.url]
                           );
                        }}
                        className={`group relative rounded-xl border-2 overflow-hidden aspect-video flex items-center justify-center transition-all cursor-pointer ${
                          isSelected ? "border-emerald-500 shadow-md ring-2 ring-emerald-500/20" : "border-slate-200 hover:border-slate-300 bg-slate-50"
                        }`}
                      >
                        <img src={img.url} alt={img.name} className={`w-full h-full object-cover transition-transform duration-300 ${isSelected ? "scale-105" : "group-hover:scale-105"}`} />
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-sm">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                        )}
                        <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-slate-900/80 to-transparent">
                          <p className="text-[9px] text-white font-mono truncate">{img.name}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


