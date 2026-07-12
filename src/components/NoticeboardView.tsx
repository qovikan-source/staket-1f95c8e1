/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, Plus, ThumbsUp, Pin, Trash2, Calendar, User, Tag, AlertTriangle, X, Pencil } from "lucide-react";
import { NoticePost, NoticeboardCategory, NOTICEBOARD_CATEGORIES, UserRole } from "../types";

interface NoticeboardViewProps {
  notices: NoticePost[];
  role: UserRole;
  currentUserName: string;
  onAddNotice: (notice: Omit<NoticePost, "id" | "date"> & { date?: string }) => void;
  onDeleteNotice: (id: string) => void;
  onUpdateNotice?: (notice: NoticePost) => void;
  highlightedNoticeId?: string;
  initialCategory?: NoticeboardCategory | "Alla";
}

export default function NoticeboardView({
  notices = [],
  role,
  currentUserName,
  onAddNotice,
  onDeleteNotice,
  onUpdateNotice,
  highlightedNoticeId,
  initialCategory = "Alla",
}: NoticeboardViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<NoticeboardCategory | "Alla">(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);
  
  React.useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  const [showAddModal, setShowAddModal] = useState(false);

  // Form states for new notice
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<NoticeboardCategory>("Information från Föreningsstyrelse");
  const [newContent, setNewContent] = useState("");
  const [newIsPinned, setNewIsPinned] = useState(false);
  const [newDate, setNewDate] = useState(new Date().toISOString().split("T")[0]);

  // Likes simulation per notice
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [selectedNoticeForDetail, setSelectedNoticeForDetail] = useState<NoticePost | null>(null);

  // Edit notice states
  const [editingNotice, setEditingNotice] = useState<NoticePost | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState<NoticeboardCategory>("Information från Föreningsstyrelse");
  const [editContent, setEditContent] = useState("");
  const [editIsPinned, setEditIsPinned] = useState(false);
  const [editDate, setEditDate] = useState("");

  React.useEffect(() => {
    if (editingNotice) {
      setEditTitle(editingNotice.title);
      setEditCategory(editingNotice.category);
      setEditContent(editingNotice.content);
      setEditIsPinned(editingNotice.isPinned);
      setEditDate(editingNotice.date);
    }
  }, [editingNotice]);

  React.useEffect(() => {
    if (highlightedNoticeId) {
      const found = notices.find(n => n.id === highlightedNoticeId);
      if (found) {
        setSelectedNoticeForDetail(found);
      }
      setTimeout(() => {
        const element = document.getElementById(`notice-card-${highlightedNoticeId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 300);
    }
  }, [highlightedNoticeId, notices]);

  const handleLike = (id: string) => {
    setLikes((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    onAddNotice({
      title: newTitle,
      category: newCategory,
      content: newContent,
      isPinned: newIsPinned,
      author: currentUserName,
      date: newDate,
    });

    // Reset states
    setNewTitle("");
    setNewCategory("Information från Föreningsstyrelse");
    setNewContent("");
    setNewIsPinned(false);
    setNewDate(new Date().toISOString().split("T")[0]);
    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNotice || !editTitle || !editContent) return;

    if (onUpdateNotice) {
      onUpdateNotice({
        ...editingNotice,
        title: editTitle,
        category: editCategory,
        content: editContent,
        isPinned: editIsPinned,
        date: editDate,
      });
    }

    setEditingNotice(null);
  };

  // Filter & Search logic
  const filteredNotices = [...notices]
    .sort((a, b) => b.date.localeCompare(a.date))
    .filter((n) => {
      const matchesSearch =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "Alla" || n.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

  // Count helper
  const getCategoryCount = (cat: NoticeboardCategory) => {
    return notices.filter((n) => n.category === cat).length;
  };

  // Divide into Pinned & Unpinned
  const pinnedNotices = filteredNotices.filter((n) => n.isPinned);
  const regularNotices = filteredNotices.filter((n) => !n.isPinned);

  const ITEMS_PER_PAGE = 6;
  const totalPages = Math.ceil(regularNotices.length / ITEMS_PER_PAGE);
  const paginatedRegularNotices = regularNotices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-8 animate-fade-in" id="noticeboard-view">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-sans font-bold tracking-tight text-slate-900">Anslagstavlan</h1>
          <p className="text-slate-500 text-sm">
            Här visas alla anslag, koder, larmrutiner och allmänna föreningsbeslut grupperade efter ämne.
          </p>
        </div>

        {/* Administrator controls */}
        {role === "Administrator" && (
          <button
            id="btn-new-notice"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer text-xs font-semibold shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Skapa ny post
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-3xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            id="input-notice-search"
            type="text"
            aria-label="Sök bland anslag"
            placeholder="Sök bland anslag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/50 focus:bg-white focus:outline-emerald-500 transition-colors"
          />
        </div>

        {/* Categories selector dropdown for mobile/tablet alongside chips */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-sm font-bold text-slate-500 whitespace-nowrap hidden sm:inline">Kategori:</span>
          <select
            id="select-notice-filter"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as any)}
            className="w-full md:w-64 px-3 py-2.5 rounded-xl border border-slate-200 text-sm bg-slate-50 focus:bg-white focus:outline-emerald-500 font-bold uppercase transition-colors cursor-pointer text-slate-700"
          >
            <option value="Alla">ALLA ÄMNEN / KATEGORIER ({notices.length})</option>
            {NOTICEBOARD_CATEGORIES.map((cat, i) => (
              <option key={i} value={cat}>
                {cat.toUpperCase()} ({getCategoryCount(cat)})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Categories Horizontal Scroll Chips for visual elegance on desktop */}
      <div className="space-y-2 hidden md:block">
        <h2 className="text-sm font-extrabold text-slate-400 uppercase tracking-wider">FILTRERA SNABBT</h2>
        <div className="flex flex-wrap gap-2 pb-2">
          <button
            onClick={() => setSelectedCategory("Alla")}
            className={`px-4 py-2 rounded-full text-sm font-bold cursor-pointer transition-all border ${
              selectedCategory === "Alla"
                ? "bg-slate-900 text-white border-slate-950 shadow-2xs"
                : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            ALLA ({notices.length})
          </button>
          {NOTICEBOARD_CATEGORIES.map((cat, idx) => {
            const count = getCategoryCount(cat);
            return (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold cursor-pointer transition-all border flex items-center gap-2 ${
                  selectedCategory === cat
                    ? "bg-emerald-500 text-slate-950 border-emerald-500 shadow-2xs"
                    : "bg-white text-slate-600 border-slate-100 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{cat.toUpperCase()}</span>
                <span className={`text-[11px] rounded-full px-2 py-0.5 font-extrabold ${selectedCategory === cat ? 'bg-emerald-600 text-emerald-50' : 'bg-slate-100 text-slate-500'}`}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main noticeboard listings grid */}
      <div className="space-y-6">
        {pinnedNotices.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-emerald-700 tracking-wider uppercase flex items-center gap-1.5 bg-emerald-50/50 p-2 rounded-lg w-fit">
              <Pin className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" /> Fastnålade Viktiga Anslag
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pinnedNotices.map((post) => {
                const isHighlighted = post.id === highlightedNoticeId;
                return (
                  <div
                    key={post.id}
                    id={`notice-card-${post.id}`}
                    onClick={() => setSelectedNoticeForDetail(post)}
                    className={`bg-white border-2 p-6 rounded-2xl shadow-xs relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-all cursor-pointer group/card ${
                      isHighlighted
                        ? "border-[#B68F52] ring-4 ring-[#B68F52]/40 scale-[1.01]"
                        : "border-emerald-500 hover:border-emerald-600"
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 rounded-bl-full opacity-5 pointer-events-none"></div>
                  
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <span className="inline-block px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-emerald-800 bg-emerald-50 rounded-md uppercase border border-emerald-100">
                        {post.category}
                      </span>
                      {role === "Administrator" && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingNotice(post);
                            }}
                            title="Redigera anslag"
                            className="p-1 rounded-md text-slate-400 hover:text-blue-550 hover:bg-blue-50 transition-colors cursor-pointer"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm(`Är du säker på att du vill radera anslaget "${post.title}"?`)) {
                                onDeleteNotice(post.id);
                              }
                            }}
                            title="Radera anslag"
                            className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5 group-hover/card:text-[#B68F52] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">
                        {post.content}
                      </p>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-50 mt-5 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <User className="w-3 h-3" /> {post.author}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {post.date}
                      </div>
                    </div>
                  </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Regular Notices Section */}
        <div className="space-y-3">
          {pinnedNotices.length > 0 && (
            <h3 className="text-xs font-bold text-slate-400 tracking-wider uppercase border-b border-slate-100 pb-2">
              Övriga Meddelanden
            </h3>
          )}

          {filteredNotices.length === 0 ? (
            <div className="border border-dashed border-slate-200 p-12 rounded-2xl text-center bg-slate-50/50 space-y-2">
              <AlertTriangle className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="font-bold text-slate-700 text-sm">Inga anslag matchar din sökning</p>
              <p className="text-xs text-slate-400">Ändra filterkategori eller skriv ett annat sökord.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                {paginatedRegularNotices.map((post) => {
                  const isHighlighted = post.id === highlightedNoticeId;
                  return (
                    <div
                      key={post.id}
                      id={`notice-card-${post.id}`}
                      onClick={() => setSelectedNoticeForDetail(post)}
                      className={`p-5 rounded-2xl border transition-all flex flex-col justify-between hover:shadow-xs cursor-pointer group/card ${
                        isHighlighted
                          ? "bg-white border-[#B68F52] ring-4 ring-[#B68F52]/40 scale-[1.01]"
                          : "bg-white border-slate-100 hover:border-slate-200 shadow-2xs"
                      }`}
                    >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <span className="inline-block px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-slate-600 bg-slate-50 border border-slate-100 rounded-md uppercase">
                          {post.category}
                        </span>
                        {role === "Administrator" && (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingNotice(post);
                              }}
                              title="Redigera anslag"
                              className="p-1 rounded-md text-slate-400 hover:text-blue-550 hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Är du säker på att du vill radera anslaget "${post.title}"?`)) {
                                  onDeleteNotice(post.id);
                                }
                              }}
                              title="Radera anslag"
                              className="p-1 rounded-md text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="font-bold text-slate-800 text-sm leading-snug group-hover/card:text-[#B68F52] transition-colors">{post.title}</h4>
                        <p className="text-xs text-slate-500 whitespace-pre-wrap leading-relaxed line-clamp-6">
                          {post.content}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50 mt-5 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <User className="w-3 h-3" /> {post.author}
                        </span>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {post.date}
                        </span>
                      </div>
                    </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-100 mt-8">
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold bg-white hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer text-slate-700"
                  >
                    Föregående
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      if (totalPages <= 3) return true;
                      if (currentPage === 1) return page <= 3;
                      if (currentPage === totalPages) return page >= totalPages - 2;
                      return page >= currentPage - 1 && page <= currentPage + 1;
                    })
                    .map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center rounded-xl text-sm sm:text-base font-bold transition-all cursor-pointer ${
                        currentPage === page
                          ? "bg-slate-900 text-white shadow-2xs"
                          : "bg-white text-slate-600 border border-slate-150 hover:bg-slate-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold bg-white hover:bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer text-slate-700"
                  >
                    Nästa
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Skapa ny post Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/45 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-xl overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between p-5 bg-slate-900 text-white">
              <div className="space-y-0.5">
                <h3 className="font-bold text-base">Nytt anslag på tavlan</h3>
                <p className="text-[10px] text-slate-300">Meddelandet publiceras direkt i medlemslistan.</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                Stäng
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label htmlFor="form-title" className="text-xs font-bold text-slate-600">Rubrik / Titel *</label>
                <input
                  id="form-title"
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Skriv en informativ rubrik"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label htmlFor="form-category" className="text-xs font-bold text-slate-600">Kategori *</label>
                  <select
                    id="form-category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as NoticeboardCategory)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold uppercase bg-white text-slate-800 cursor-pointer"
                  >
                    {NOTICEBOARD_CATEGORIES.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="form-date" className="text-xs font-bold text-slate-600">Publiceringsdatum *</label>
                  <input
                    id="form-date"
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    id="form-pin"
                    type="checkbox"
                    checked={newIsPinned}
                    onChange={(e) => setNewIsPinned(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 accent-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="form-pin" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    📌 Nåla fast
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="form-content" className="text-xs font-bold text-slate-600">Innehåll / Beskrivning *</label>
                <textarea
                  id="form-content"
                  required
                  rows={5}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Beskriv anslaget utförligt med datum, koder, tider eller eventuella anvisningar..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg bg-white border border-slate-200 cursor-pointer"
                >
                  Avbryt
                </button>
                <button
                  id="btn-publish-notice"
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg border border-emerald-500 cursor-pointer shadow-2xs"
                >
                  Publicera nu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Redigera post Modal */}
      {editingNotice && (
        <div className="fixed inset-0 bg-slate-950/45 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 w-full max-w-xl overflow-hidden animate-scale-up">
            <div className="flex items-center justify-between p-5 bg-slate-900 text-white">
              <div className="space-y-0.5">
                <h3 className="font-bold text-base">Redigera anslag</h3>
                <p className="text-[10px] text-slate-300">Ändringarna uppdateras direkt i medlemslistan.</p>
              </div>
              <button
                onClick={() => setEditingNotice(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-1 bg-slate-800 rounded-lg cursor-pointer"
              >
                Stäng
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label htmlFor="edit-form-title" className="text-xs font-bold text-slate-600">Rubrik / Titel *</label>
                <input
                  id="edit-form-title"
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Skriv en informativ rubrik"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label htmlFor="edit-form-category" className="text-xs font-bold text-slate-600">Kategori *</label>
                  <select
                    id="edit-form-category"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as NoticeboardCategory)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm font-semibold uppercase bg-white text-slate-800 cursor-pointer"
                  >
                    {NOTICEBOARD_CATEGORIES.map((cat, idx) => (
                      <option key={idx} value={cat}>
                        {cat.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label htmlFor="edit-form-date" className="text-xs font-bold text-slate-600">Publiceringsdatum *</label>
                  <input
                    id="edit-form-date"
                    type="date"
                    required
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    id="edit-form-pin"
                    type="checkbox"
                    checked={editIsPinned}
                    onChange={(e) => setEditIsPinned(e.target.checked)}
                    className="w-4 h-4 text-emerald-500 accent-emerald-500 cursor-pointer"
                  />
                  <label htmlFor="edit-form-pin" className="text-xs font-semibold text-slate-700 cursor-pointer">
                    📌 Nåla fast
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="edit-form-content" className="text-xs font-bold text-slate-600">Innehåll / Beskrivning *</label>
                <textarea
                  id="edit-form-content"
                  required
                  rows={5}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  placeholder="Beskriv anslaget utförligt med datum, koder, tider eller eventuella anvisningar..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingNotice(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 rounded-lg bg-white border border-slate-200 cursor-pointer"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg border border-emerald-500 cursor-pointer shadow-2xs"
                >
                  Spara ändringar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedNoticeForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white max-w-2xl w-full rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            {/* Header */}
            <div className="bg-[#0B2C24] text-white p-6 relative">
              <button
                onClick={() => setSelectedNoticeForDetail(null)}
                className="absolute top-4 right-4 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-full transition-colors cursor-pointer"
                title="Stäng fönster"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="space-y-2.5">
                <span className="inline-block px-2.5 py-0.5 text-[9px] font-bold tracking-wider text-emerald-100 bg-emerald-800/60 rounded-md uppercase border border-emerald-700/50">
                  {selectedNoticeForDetail.category}
                </span>
                <h3 className="text-xl font-sans font-bold leading-snug pr-8 text-white">
                  {selectedNoticeForDetail.title}
                </h3>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6 flex-1">
              <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-normal">
                {selectedNoticeForDetail.content}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> Skrivet av: &nbsp;<span className="font-semibold text-slate-600">{selectedNoticeForDetail.author}</span>
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Publicerat: &nbsp;<span className="font-semibold text-slate-600">{selectedNoticeForDetail.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedNoticeForDetail(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200/60 rounded-xl bg-slate-100 transition-colors cursor-pointer"
                >
                  Stäng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
