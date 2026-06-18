/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Folder, FileText, Download, Plus, Trash2, Eye, ShieldAlert, CheckCircle, Settings } from "lucide-react";
import { FileItem, FileCategory, BoardFolder, BOARD_FOLDERS, UserRole } from "../types";

interface DocumentHubViewProps {
  files: FileItem[];
  role: UserRole;
  onAddFile: (file: Omit<FileItem, "id">, realFile?: File) => Promise<void>;
  onDeleteFile: (id: string, name: string, category: FileCategory, folder?: BoardFolder) => void;
}

interface UploadQueueItem {
  id: string;
  file: File;
  name: string;
  category: FileCategory;
  folder?: BoardFolder;
  customDate: string;
  fileSize: string;
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

  // Bulk upload queue states
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  // Bulk defaults state
  const [bulkCategory, setBulkCategory] = useState<FileCategory | "">("");
  const [bulkFolder, setBulkFolder] = useState<BoardFolder | "">("");
  const [bulkDate, setBulkDate] = useState<string>("");

  const applyBulkCategory = (cat: FileCategory) => {
    setBulkCategory(cat);
    setUploadQueue((prev) =>
      prev.map((item) => {
        const updated = { ...item, category: cat };
        if (cat === "Medlemsfiler") {
          updated.folder = undefined;
        } else if (cat === "Styrelsefiler" && !updated.folder) {
          updated.folder = bulkFolder || "Administration";
        }
        return updated;
      })
    );
  };

  const applyBulkFolder = (fld: BoardFolder) => {
    setBulkFolder(fld);
    setUploadQueue((prev) =>
      prev.map((item) => {
        if (item.category === "Styrelsefiler") {
          return { ...item, folder: fld };
        }
        return item;
      })
    );
  };

  const applyBulkDate = (dateStr: string) => {
    setBulkDate(dateStr);
    setUploadQueue((prev) =>
      prev.map((item) => ({ ...item, customDate: dateStr }))
    );
  };

  const handleDownload = (file: FileItem) => {
    setDownloadingFileId(file.id);
    setTimeout(() => {
      setDownloadingFileId(null);
      setDownloadSuccessText(`Laddade ner: ${file.name}`);
      setTimeout(() => setDownloadSuccessText(null), 3000);
    }, 1200);
  };

  const handleMultipleFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      const newQueueItems: UploadQueueItem[] = filesArray.map((file, i) => {
        // Format file size
        const bytes = file.size;
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB"];
        const idx = Math.floor(Math.log(bytes) / Math.log(k));
        const sizeStr = parseFloat((bytes / Math.pow(k, idx)).toFixed(1)) + " " + sizes[idx];

        return {
          id: `queue-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
          file,
          name: file.name,
          category: bulkCategory || activeCategory,
          folder: (bulkCategory || activeCategory) === "Styrelsefiler" ? (bulkFolder || "Administration") : undefined,
          customDate: bulkDate || new Date().toISOString().split("T")[0],
          fileSize: sizeStr,
        };
      });
      setUploadQueue((prev) => [...prev, ...newQueueItems]);
      e.target.value = "";
    }
  };

  const handleRemoveFromQueue = (id: string) => {
    setUploadQueue((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateQueueItem = (id: string, updates: Partial<UploadQueueItem>) => {
    setUploadQueue((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const merged = { ...item, ...updates };
        if (merged.category === "Medlemsfiler") {
          merged.folder = undefined;
        } else if (merged.category === "Styrelsefiler" && !merged.folder) {
          merged.folder = "Administration";
        }
        return merged;
      })
    );
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadQueue.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < uploadQueue.length; i++) {
        const item = uploadQueue[i];
        setUploadProgress(`Laddar upp ${i + 1} av ${uploadQueue.length}: ${item.name}...`);

        let finalName = item.name.trim();
        if (!finalName.toLowerCase().endsWith(".pdf") && !finalName.toLowerCase().endsWith(".docx")) {
          finalName += ".pdf";
        }

        await onAddFile(
          {
            name: finalName,
            category: item.category,
            folder: item.folder,
            fileSize: item.fileSize,
            uploadedAt: item.customDate,
            mimeType: item.file.type || "application/pdf",
          },
          item.file
        );
      }
      setDownloadSuccessText(`Laddade upp ${uploadQueue.length} dokument.`);
      setUploadQueue([]);
      setBulkCategory("");
      setBulkFolder("");
      setBulkDate("");
      setShowUploadModal(false);
      setTimeout(() => setDownloadSuccessText(null), 4000);
    } catch (err) {
      console.error("Bulk upload failed:", err);
      alert("Ett fel uppstod under uppladdningen: " + (err as Error).message);
    } finally {
      setIsUploading(false);
      setUploadProgress("");
    }
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
        {role === "Administrator" && (
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
          {role !== "Styrelse" && role !== "Administrator" && (
            <span className="absolute top-1 right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          )}
        </button>
      </div>

      {/* RLS Guard notification for Board Files */}
      {activeCategory === "Styrelsefiler" && role !== "Styrelse" && role !== "Administrator" && (
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
      {(activeCategory === "Medlemsfiler" || role === "Styrelse" || role === "Administrator") && (
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

                    {role === "Administrator" && (
                      <button
                        onClick={() => {
                          if (window.confirm(`Är du säker på att du vill radera filen "${file.name}" permanent?`)) {
                            onDeleteFile(file.id, file.name, file.category, file.folder);
                          }
                        }}
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
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-5 bg-slate-900 text-white shrink-0">
              <div className="space-y-0.5">
                <h3 className="font-bold text-base">Ladda upp dokument (Bulk)</h3>
                <p className="text-[10px] text-slate-300">Medlemsfiler visas för alla medlemmar. Styrelsefiler säkras i undermappar.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (!isUploading) {
                    setUploadQueue([]);
                    setBulkCategory("");
                    setBulkFolder("");
                    setBulkDate("");
                    setShowUploadModal(false);
                  }
                }}
                disabled={isUploading}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2.5 py-1 bg-slate-800 rounded-lg cursor-pointer transition-colors disabled:opacity-40"
              >
                Stäng
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
              {uploadQueue.length === 0 ? (
                /* Empty Queue: Drag and Drop / Choose Files Area */
                <div className="border-2 border-dashed border-slate-200 hover:border-emerald-400 transition-colors rounded-xl p-8 text-center bg-slate-50 relative cursor-pointer min-h-[200px] flex flex-col items-center justify-center">
                  <input
                    type="file"
                    multiple
                    onChange={handleMultipleFilesChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf,.docx,.doc,.xlsx,.xls,.png,.jpg,.jpeg"
                  />
                  <Plus className="w-8 h-8 text-slate-400 mb-2" />
                  <span className="text-xs font-semibold text-slate-700 block">Välj filer eller släpp dem här</span>
                  <span className="text-[10px] text-slate-400 block mt-1">Du kan välja flera filer samtidigt för bulk-uppladdning</span>
                  <span className="text-[9px] text-slate-350 block mt-2">PDF, DOCX, XLSX, Bilder upp till 20MB</span>
                </div>
              ) : (
                /* Active Queue List */
                <div className="space-y-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Uppladdningskö ({uploadQueue.length}st dokument)</div>
                  
                  {/* Bulk Settings Card */}
                  <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-4 space-y-3 shadow-3xs">
                    <div className="flex items-center gap-2 text-emerald-800">
                      <Settings className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold uppercase tracking-wider">⚡ Bulk-inställningar (Applicera på alla filer i kön)</span>
                    </div>
                    <p className="text-[10px] text-slate-500">
                      Välj värden nedan för att uppdatera kategori, undermapp och dokumentdatum för alla filer i kön samtidigt. Du kan fortfarande finjustera enskilda filer efteråt.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">Gemensam Kategori</label>
                        <select
                          value={bulkCategory}
                          onChange={(e) => applyBulkCategory(e.target.value as FileCategory)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-750 focus:outline-emerald-500 text-xs"
                          disabled={isUploading}
                        >
                          <option value="">-- Välj kategori --</option>
                          <option value="Medlemsfiler">🔓 Medlemsfiler</option>
                          <option value="Styrelsefiler">🔒 Styrelsefiler</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">Gemensam Mapp</label>
                        <select
                          value={bulkFolder}
                          onChange={(e) => applyBulkFolder(e.target.value as BoardFolder)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-750 focus:outline-emerald-500 text-xs disabled:opacity-50"
                          disabled={isUploading || bulkCategory !== "Styrelsefiler"}
                        >
                          <option value="">-- Välj mapp --</option>
                          {BOARD_FOLDERS.map((f, i) => (
                            <option key={i} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-bold text-slate-500 uppercase">Gemensamt Datum</label>
                        <input
                          type="date"
                          value={bulkDate}
                          onChange={(e) => applyBulkDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white text-slate-750 focus:outline-emerald-500 text-xs"
                          disabled={isUploading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-1">
                    {uploadQueue.map((item) => (
                      <div key={item.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-750 truncate">
                            <FileText className="w-4 h-4 text-emerald-600 shrink-0 font-bold" />
                            <span className="truncate max-w-[250px] sm:max-w-[320px]">{item.file.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({item.fileSize})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveFromQueue(item.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Ta bort från kön"
                            disabled={isUploading}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Title and date row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Filnamn i portalen *</label>
                            <input
                              type="text"
                              required
                              value={item.name}
                              onChange={(e) => handleUpdateQueueItem(item.id, { name: e.target.value })}
                              className="w-full px-2.5 py-1.5 border border-slate-250 rounded-lg bg-white text-slate-750 focus:outline-emerald-500"
                              disabled={isUploading}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Dokumentdatum *</label>
                            <input
                              type="date"
                              required
                              value={item.customDate}
                              onChange={(e) => handleUpdateQueueItem(item.id, { customDate: e.target.value })}
                              className="w-full px-2.5 py-1.5 border border-slate-250 rounded-lg bg-white text-slate-750 focus:outline-emerald-500"
                              disabled={isUploading}
                            />
                          </div>
                        </div>

                        {/* Category and Board Folder row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-500 uppercase">Kategori *</label>
                            <select
                              value={item.category}
                              onChange={(e) => handleUpdateQueueItem(item.id, { category: e.target.value as FileCategory })}
                              className="w-full px-2.5 py-1.5 border border-slate-250 rounded-lg bg-white text-slate-750 focus:outline-emerald-500"
                              disabled={isUploading}
                            >
                              <option value="Medlemsfiler">🔓 Medlemsfiler</option>
                              <option value="Styrelsefiler">🔒 Styrelsefiler</option>
                            </select>
                          </div>

                          {item.category === "Styrelsefiler" && (
                            <div className="space-y-1 animate-scale-up">
                              <label className="text-[10px] font-bold text-slate-500 uppercase">Mapp i Styrelsearkiv *</label>
                              <select
                                value={item.folder}
                                onChange={(e) => handleUpdateQueueItem(item.id, { folder: e.target.value as BoardFolder })}
                                className="w-full px-2.5 py-1.5 border border-slate-250 rounded-lg bg-white text-slate-750 focus:outline-emerald-500"
                                disabled={isUploading}
                              >
                                {BOARD_FOLDERS.map((f, i) => (
                                  <option key={i} value={f}>{f}</option>
                                ))}
                              </select>
                            </div>
                          )}
                        </div>

                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      className="relative inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer transition-colors"
                      disabled={isUploading}
                    >
                      <input
                        type="file"
                        multiple
                        onChange={handleMultipleFilesChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept=".pdf,.docx,.doc,.xlsx,.xls,.png,.jpg,.jpeg"
                      />
                      <Plus className="w-4 h-4" /> Välj fler filer...
                    </button>
                    <span className="text-xs text-slate-400 font-semibold font-mono">Totalt: {uploadQueue.length}st</span>
                  </div>
                </div>
              )}

              {/* Progress Panel for active upload operations */}
              {isUploading && (
                <div className="bg-slate-900 text-white p-4 rounded-xl flex items-center gap-3 animate-pulse border border-slate-950 shadow-sm shrink-0">
                  <div className="w-4 h-4 rounded-full border-2 border-t-emerald-400 border-white/20 animate-spin"></div>
                  <span className="text-xs font-bold uppercase tracking-wider">{uploadProgress || "Sparar dokument..."}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setUploadQueue([]);
                    setBulkCategory("");
                    setBulkFolder("");
                    setBulkDate("");
                    setShowUploadModal(false);
                  }}
                  disabled={isUploading}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg bg-white border border-slate-200 cursor-pointer disabled:opacity-40"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={uploadQueue.length === 0 || isUploading}
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg border border-emerald-500 cursor-pointer shadow-2xs disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
                >
                  {isUploading ? "Sparar..." : `Spara alla ${uploadQueue.length} filer`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
