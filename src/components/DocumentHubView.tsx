/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Folder, FileText, Download, Plus, Trash2, Eye, ShieldAlert, CheckCircle } from "lucide-react";
import { FileItem, FileCategory, BoardFolder, BOARD_FOLDERS, UserRole } from "../types";

interface DocumentHubViewProps {
  files: FileItem[];
  role: UserRole;
  onAddFile: (file: Omit<FileItem, "id" | "uploadedAt">, realFile?: File) => void;
  onDeleteFile: (id: string, name: string, category: FileCategory) => void;
}

export default function DocumentHubView({
  files = [],
  role,
  onAddFile,
  onDeleteFile,
}: DocumentHubViewProps) {
  const [activeCategory, setActiveCategory] = useState<FileCategory>("Medlemsfiler");
  const [selectedFolder, setSelectedFolder] = useState<BoardFolder | "Alla">("Alla");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Download feedback states
  const [downloadingFileId, setDownloadingFileId] = useState<string | null>(null);
  const [downloadSuccessText, setDownloadSuccessText] = useState<string | null>(null);

  // Form states for new file
  const [newFileName, setNewFileName] = useState("");
  const [newFileCategory, setNewFileCategory] = useState<FileCategory>("Medlemsfiler");
  const [newFileFolder, setNewFileFolder] = useState<BoardFolder>("Administration");
  const [newFileSize, setNewFileSize] = useState("1.2 MB");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleDownload = (file: FileItem) => {
    setDownloadingFileId(file.id);
    setTimeout(() => {
      setDownloadingFileId(null);
      setDownloadSuccessText(`Laddade ner: ${file.name}`);
      setTimeout(() => setDownloadSuccessText(null), 3000);
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setNewFileName(file.name);
      
      // Format file size
      const bytes = file.size;
      const k = 1024;
      const sizes = ["Bytes", "KB", "MB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      const sizeStr = parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
      setNewFileSize(sizeStr);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName) return;

    // Normalize name to end with .pdf if not specified
    let name = newFileName.trim();
    if (!name.toLowerCase().endsWith(".pdf") && !name.toLowerCase().endsWith(".docx")) {
      name += ".pdf";
    }

    onAddFile({
      name,
      category: newFileCategory,
      folder: newFileCategory === "Styrelsefiler" ? newFileFolder : undefined,
      fileSize: newFileSize,
      mimeType: selectedFile?.type || "application/pdf",
    }, selectedFile || undefined);

    // Reset Form
    setNewFileName("");
    setNewFileCategory("Medlemsfiler");
    setNewFileFolder("Administration");
    setNewFileSize("1.2 MB");
    setSelectedFile(null);
    setShowUploadModal(false);
  };

  // Filter logic
  const filteredFiles = files.filter((f) => {
    // Basic Search
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category check
    if (f.category !== activeCategory) return false;

    // Subfolder check if Styrelsefiler is active
    if (activeCategory === "Styrelsefiler") {
       if (selectedFolder !== "Alla" && f.folder !== selectedFolder) {
         return false;
       }
    }

    return matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in" id="document-hub">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-sans font-bold tracking-tight text-slate-900">Dokumentarkiv</h1>
          <p className="text-slate-500 text-sm">
            Hämta blanketter, protokoll, stadgar och sammfällighetens ritningar i PDF-format.
          </p>
        </div>

        {/* Styrelse/Admin controls */}
        {(role === "Styrelse" || role === "Administrator") && (
          <button
            id="btn-upload-file"
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Ladda upp dokument
          </button>
        )}
      </div>

      {/* Main Category Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => {
            setActiveCategory("Medlemsfiler");
            setSelectedFolder("Alla");
          }}
          className={`px-6 py-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeCategory === "Medlemsfiler"
              ? "border-emerald-500 text-slate-900"
              : "border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          📁 Medlemsfiler (Allmänt tillgängliga)
        </button>

        <button
          onClick={() => {
            setActiveCategory("Styrelsefiler");
            setSelectedFolder("Alla");
          }}
          className={`relative px-6 py-3.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
            activeCategory === "Styrelsefiler"
              ? "border-emerald-500 text-slate-900"
              : "border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300"
          }`}
        >
          🔒 Styrelsefiler (Endast Styrelse & Admin)
          {role !== "Styrelse" && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          )}
        </button>
      </div>

      {/* RLS Guard notification for Board Files */}
      {activeCategory === "Styrelsefiler" && role !== "Styrelse" && (
        <div className="bg-rose-50 border border-rose-100 p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-4 max-w-xl mx-auto my-12 animate-fade-in shadow-3xs">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-1.5">
            <h3 className="font-bold text-slate-800 text-base">Åtkomst nekad (Säkerhetsregel)</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              Styrelsefiler är skyddade via Row Level Security (RLS) och är endast synliga för styrelsemedlemmar och administratörer.
            </p>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Roll-restriktion: Styrelse / Fastighetsskötare krävs</p>
        </div>
      )}

      {/* Allowed files section */}
      {(activeCategory === "Medlemsfiler" || role === "Styrelse") && (
        <div className="space-y-6">
          {/* Subfolders for Board Files strictly subdivided */}
          {activeCategory === "Styrelsefiler" && (
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Mappar i Styrelsearkiv</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedFolder("Alla")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors border ${
                    selectedFolder === "Alla"
                      ? "bg-slate-900 text-white border-slate-950"
                      : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
                  }`}
                >
                  📁 Alla mappar
                </button>
                {BOARD_FOLDERS.map((fold, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedFolder(fold)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all border flex items-center gap-1.5 ${
                      selectedFolder === fold
                        ? "bg-emerald-500 text-slate-950 border-emerald-500"
                        : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    <Folder className="w-3.5 h-3.5" />
                    {fold}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search bar inside documents */}
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-3xs flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                id="input-document-search"
                type="text"
                placeholder="Sök bland dokument..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500 transition-colors"
              />
            </div>

            <div className="text-xs text-slate-400 font-medium">
              Visar {filteredFiles.length} av {files.filter((f) => f.category === activeCategory).length} filer
            </div>
          </div>

          {/* Download Success message */}
          {downloadSuccessText && (
            <div className="bg-emerald-50 border border-emerald-100 py-3 px-5 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 animate-scale-up">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 animate-bounce" />
              <span>{downloadSuccessText} (Nersparad i hämtade filer)</span>
            </div>
          )}

          {/* Document list */}
          {filteredFiles.length === 0 ? (
            <div className="border border-dashed border-slate-200 p-12 rounded-2xl text-center bg-slate-50/50 space-y-2">
              <Folder className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">Inga filer matchar</p>
              <p className="text-xs text-slate-400">Försök med ett annat sökord.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-4 group hover:border-slate-200"
                >
                  <div className="flex items-center gap-3.5 truncate">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-emerald-50 group-hover:text-emerald-500 group-hover:border-emerald-100 transition-all">
                      <FileText className="w-5 h-5 font-bold" />
                    </div>
                    <div className="truncate space-y-0.5">
                      <h4 className="font-bold text-slate-800 text-xs truncate group-hover:text-slate-900 transition-colors">
                        {file.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        <span>{file.fileSize}</span>
                        <span>•</span>
                        <span>Uppladdad: {file.uploadedAt}</span>
                        {file.folder && (
                          <>
                            <span>•</span>
                            <span className="font-semibold text-emerald-600 flex items-center gap-0.5">
                              <Folder className="w-2.5 h-2.5" /> {file.folder}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleDownload(file)}
                      disabled={downloadingFileId === file.id}
                      className="p-2 rounded-xl text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                      title="Ladda ner PDF"
                    >
                      {downloadingFileId === file.id ? (
                        <span className="flex h-4 w-4 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                        </span>
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </button>

                    {(role === "Styrelse" || role === "Administrator") && (
                      <button
                        onClick={() => onDeleteFile(file.id, file.name, file.category)}
                        className="p-2 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Radera fil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Upload File Unified Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-slate-950/45 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between p-5 bg-slate-900 text-white">
              <div className="space-y-0.5">
                <h3 className="font-bold text-base">Ladda upp nytt dokument</h3>
                <p className="text-[10px] text-slate-300">Medlemsfiler visas för alla medlemmar. Styrelsefiler säkras med RLS.</p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                Stäng
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div className="space-y-1">
                <label htmlFor="upload-name" className="text-xs font-bold text-slate-600">Filnamn *</label>
                <input
                  id="upload-name"
                  type="text"
                  required
                  placeholder="Ex: Årsredovisning_2026.pdf"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:bg-white focus:outline-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label htmlFor="upload-category" className="text-xs font-bold text-slate-600">Behörighet / Kategori *</label>
                  <select
                    id="upload-category"
                    value={newFileCategory}
                    onChange={(e) => setNewFileCategory(e.target.value as FileCategory)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50"
                  >
                    <option value="Medlemsfiler">🔓 Medlemsfiler (Alla inloggade)</option>
                    <option value="Styrelsefiler">🔒 Styrelsefiler (Endast Styrelse)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="upload-size" className="text-xs font-bold text-slate-600">Simulerad storlek</label>
                  <select
                    id="upload-size"
                    value={newFileSize}
                    onChange={(e) => setNewFileSize(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-slate-50"
                  >
                    <option value="350 KB">350 KB</option>
                    <option value="1.2 MB">1.2 MB</option>
                    <option value="2.8 MB">2.8 MB</option>
                    <option value="14.5 MB">14.5 MB</option>
                  </select>
                </div>
              </div>

              {/* Styrelse subfolders if Board Folder is active */}
              {newFileCategory === "Styrelsefiler" && (
                <div className="space-y-1 animate-scale-up">
                  <label htmlFor="upload-folder" className="text-xs font-bold text-slate-600">Välj mapp i Styrelsefiler *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {BOARD_FOLDERS.map((f, index) => (
                      <label
                        key={index}
                        className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 cursor-pointer transition-colors ${
                          newFileFolder === f
                            ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold"
                            : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        <input
                          type="radio"
                          name="form-board-folder"
                          checked={newFileFolder === f}
                          onChange={() => setNewFileFolder(f)}
                          className="sr-only"
                        />
                        <Folder className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                        <span>{f}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Real File Input Area */}
              <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 transition-colors rounded-xl p-5 text-center bg-slate-50 relative cursor-pointer">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept=".pdf,.docx,.doc,.xlsx,.xls,.png,.jpg,.jpeg"
                />
                <FileText className="w-7 h-7 text-slate-400 mx-auto mb-2" />
                <span className="text-xs font-semibold text-slate-700 block truncate px-2">
                  {selectedFile ? `Vald fil: ${selectedFile.name}` : "Välj fil eller släpp dokument här"}
                </span>
                <span className="text-[10px] text-slate-400">
                  {selectedFile ? `${newFileSize}` : "PDF, DOCX, XLSX, Bilder upp till 20MB"}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg bg-white border border-slate-200 cursor-pointer"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg border border-emerald-500 cursor-pointer shadow-2xs"
                >
                  Spara dokument
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
