import { supabase } from "./supabase";
import { UserProfile, NoticePost, FileItem, VacantSpace, UserRole, NoticeboardCategory, FileCategory, BoardFolder } from "../types";

// =========================================================================
// Mappings between frontend CamelCase and PostgreSQL SnakeCase
// =========================================================================

function mapProfileToFrontend(db: any): UserProfile {
  return {
    id: db.id,
    name: db.name,
    role: db.role as UserRole,
    email: db.email,
    phone: db.phone || "",
    orgNr: db.org_nr || "",
    company: db.company || "",
    unit: db.unit || "",
    address: db.address || "",
    description: db.description || "",
    website: db.website || "",
    logo: db.logo || "",
  };
}

function mapProfileToDb(p: Partial<UserProfile>) {
  return {
    name: p.name,
    role: p.role,
    email: p.email,
    phone: p.phone,
    org_nr: p.orgNr,
    company: p.company,
    unit: p.unit,
    address: p.address,
    description: p.description,
    website: p.website,
    logo: p.logo,
  };
}

function mapNoticeToFrontend(db: any): NoticePost {
  return {
    id: db.id,
    title: db.title,
    category: db.category as NoticeboardCategory,
    content: db.content,
    date: db.date,
    isPinned: db.is_pinned ?? false,
    author: db.author,
  };
}

function mapNoticeToDb(n: Partial<NoticePost>) {
  return {
    title: n.title,
    category: n.category,
    content: n.content,
    date: n.date,
    is_pinned: n.isPinned,
    author: n.author,
  };
}

function mapFileToFrontend(db: any): FileItem {
  let folderVal = db.folder;
  if (folderVal === "Pantbrev Lgh Betekn.") {
    folderVal = "Pantbrev";
  }
  return {
    id: db.id,
    name: db.name,
    category: db.category as FileCategory,
    folder: folderVal as BoardFolder | undefined,
    uploadedAt: db.uploaded_at,
    fileSize: db.file_size,
    mimeType: db.mime_type || "application/pdf",
    url: db.url,
  };
}

function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[åä]/g, "a")
    .replace(/[ÅÄ]/g, "A")
    .replace(/ö/g, "o")
    .replace(/Ö/g, "O")
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_\-\.]/g, "");
}

/**
 * Computes the storage path inside the (now private) `documents` bucket for
 * a given FileItem, mirroring the layout used by `uploadFile`.
 */
function storagePathForFile(file: FileItem): string {
  const sanitizedName = sanitizeFilename(file.name);
  const rawFolder = file.folder as string | undefined;
  const storageFolder =
    rawFolder === "Pantbrev" || rawFolder === "Pantbrev Lgh Betekn." ? "Pantbrev" : rawFolder;
  const subfolder =
    file.category === "Styrelsefiler" && storageFolder ? `styrelse/${storageFolder}` : "medlemmar";
  return `${subfolder}/${sanitizedName}`;
}

function mapSpaceToFrontend(db: any): VacantSpace {
  return {
    id: db.id,
    title: db.title,
    location: db.location,
    description: db.description,
    suitableFor: db.suitable_for || [],
    totalArea: db.total_area,
    detailsLowerLevel: db.details_lower_level || "",
    detailsUpperLevel: db.details_upper_level || "",
    securityInfo: db.security_info || "",
    imgUrl: db.img_url || "",
    createdAt: db.created_at ? new Date(db.created_at).toISOString().split("T")[0] : "",
  };
}

function mapSpaceToDb(s: Partial<VacantSpace>) {
  return {
    title: s.title,
    location: s.location,
    description: s.description,
    suitable_for: s.suitableFor,
    total_area: s.totalArea,
    details_lower_level: s.detailsLowerLevel,
    details_upper_level: s.detailsUpperLevel,
    security_info: s.securityInfo,
    img_url: s.imgUrl,
  };
}

// =========================================================================
// database Operations Service
// =========================================================================

export const dbService = {
  // --- PROFILES ---
  async getProfiles(): Promise<UserProfile[]> {
    const { data, error } = await supabase.from("profiles").select("*").order("name");
    if (error) throw error;
    return (data || []).map(mapProfileToFrontend);
  },

  async getProfileByEmail(email: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("email", email)
      .maybeSingle();
    if (error) throw error;
    return data ? mapProfileToFrontend(data) : null;
  },

  async insertProfile(p: Omit<UserProfile, "id">): Promise<UserProfile> {
    const { data, error } = await supabase.from("profiles").insert(mapProfileToDb(p)).select().single();
    if (error) throw error;
    return mapProfileToFrontend(data);
  },

  async registerUserAndProfile(p: Omit<UserProfile, "id"> & { password?: string }): Promise<UserProfile> {
    if (p.password) {
      try {
        const { data, error } = await supabase.rpc("create_new_user", {
          new_email: p.email,
          new_password: p.password,
          new_role: p.role,
          new_name: p.name,
          new_phone: p.phone || "",
          new_company: p.company || "",
          new_org_nr: p.orgNr || "",
          new_unit: p.unit || "",
          new_address: p.address || "",
          new_description: p.description || "",
          new_website: p.website || "",
          new_logo: p.logo || "",
        });
        
        if (error) {
          console.warn("RPC registration failed, falling back to profile-only insertion:", error.message);
        } else if (data) {
          return {
            id: data.id,
            name: p.name,
            role: p.role as UserRole,
            email: p.email,
            phone: p.phone || "",
            orgNr: p.orgNr || "",
            company: p.company || "",
            unit: p.unit || "",
            address: p.address || "",
            description: p.description || "",
            website: p.website || "",
            logo: p.logo || "",
          };
        }
      } catch (err) {
        console.warn("RPC call threw, falling back to profile-only insertion:", err);
      }
    }
    
    // Fallback: original profile-only insertion
    return this.insertProfile(p);
  },

  async updateProfile(id: string, p: Partial<UserProfile>): Promise<UserProfile> {
    const { data, error } = await supabase.from("profiles").update(mapProfileToDb(p)).eq("id", id).select().single();
    if (error) throw error;
    return mapProfileToFrontend(data);
  },

  async deleteProfile(id: string): Promise<void> {
    const { error } = await supabase.from("profiles").delete().eq("id", id);
    if (error) throw error;
  },

  // --- NOTICES ---
  async getNotices(): Promise<NoticePost[]> {
    const { data, error } = await supabase.from("notices").select("*").order("is_pinned", { ascending: false }).order("date", { ascending: false });
    if (error) throw error;
    return (data || []).map(mapNoticeToFrontend);
  },

  async insertNotice(n: Omit<NoticePost, "id" | "date"> & { date?: string }): Promise<NoticePost> {
    const noticeData = {
      ...n,
      date: n.date || new Date().toISOString().split("T")[0],
    };
    const { data, error } = await supabase.from("notices").insert(mapNoticeToDb(noticeData)).select().single();
    if (error) throw error;
    return mapNoticeToFrontend(data);
  },

  async updateNotice(id: string, n: Partial<NoticePost>): Promise<NoticePost> {
    const { data, error } = await supabase.from("notices").update(mapNoticeToDb(n)).eq("id", id).select().single();
    if (error) throw error;
    return mapNoticeToFrontend(data);
  },

  async deleteNotice(id: string): Promise<void> {
    const { error } = await supabase.from("notices").delete().eq("id", id);
    if (error) throw error;
  },

  // --- VACANT SPACES ---
  async getSpaces(): Promise<VacantSpace[]> {
    const { data, error } = await supabase.from("vacant_spaces").select("*").order("created_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(mapSpaceToFrontend);
  },

  async insertSpace(s: Omit<VacantSpace, "id" | "createdAt">): Promise<VacantSpace> {
    const { data, error } = await supabase.from("vacant_spaces").insert(mapSpaceToDb(s)).select().single();
    if (error) throw error;
    return mapSpaceToFrontend(data);
  },

  async deleteSpace(id: string): Promise<void> {
    const { error } = await supabase.from("vacant_spaces").delete().eq("id", id);
    if (error) throw error;
  },

  // --- FILES & STORAGE ---
  async getFiles(): Promise<FileItem[]> {
    const { data, error } = await supabase.from("files").select("*").order("uploaded_at", { ascending: false });
    if (error) throw error;
    return (data || []).map(mapFileToFrontend);
  },

  async deleteFile(id: string, name: string, category: FileCategory, folder?: BoardFolder): Promise<void> {
    // 1. Delete from database
    const { error: dbError } = await supabase.from("files").delete().eq("id", id);
    if (dbError) throw dbError;

    // 2. Delete from Supabase Storage using sanitized name
    const sanitizedName = sanitizeFilename(name);
    const pathsToDelete = [
      `medlemmar/${sanitizedName}`,
      `styrelse/${sanitizedName}`,
    ];
    if (folder) {
      const storageFolder = (folder as string === "Pantbrev" || folder as string === "Pantbrev Lgh Betekn.") ? "Pantbrev" : folder;
      pathsToDelete.push(`${storageFolder}/${sanitizedName}`);
      pathsToDelete.push(`styrelse/${storageFolder}/${sanitizedName}`);
      if (storageFolder === "Pantbrev") {
        pathsToDelete.push(`Pantbrev Lgh Betekn./${sanitizedName}`);
        pathsToDelete.push(`styrelse/Pantbrev Lgh Betekn./${sanitizedName}`);
      }
    }
    const { error: storageError } = await supabase.storage.from("documents").remove(pathsToDelete);
    if (storageError) {
      console.warn("Deleted database row, but failed to delete storage object:", storageError.message);
    }
  },

  /**
   * Uploads file to storage bucket and inserts metadata row in public.files database table.
   */
  async uploadFile(
    file: File,
    category: FileCategory,
    folder?: BoardFolder,
    customDate?: string
  ): Promise<FileItem> {
    const sanitizedName = sanitizeFilename(file.name);
    const storageFolder = (folder as string === "Pantbrev" || folder as string === "Pantbrev Lgh Betekn.") ? "Pantbrev" : folder;
    const subfolder = (category === "Styrelsefiler" && storageFolder) ? `styrelse/${storageFolder}` : "medlemmar";
    const filePath = `${subfolder}/${sanitizedName}`;

    // 1. Upload file binary to storage bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    // 2. Get Public URL
    const { data: { publicUrl } } = supabase.storage
      .from("documents")
      .getPublicUrl(filePath);

    // 3. Format file size
    const formatBytes = (bytes: number, decimals = 1) => {
      if (!bytes) return "0 Bytes";
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };

    // 4. Register record in public.files table
    const dbRecord = {
      name: file.name, // Keep the original Swedish name for frontend display!
      category: category,
      folder: folder === "Pantbrev" ? "Pantbrev Lgh Betekn." : (folder || null),
      file_size: formatBytes(file.size),
      mime_type: file.type || "application/octet-stream",
      url: publicUrl,
      uploaded_at: customDate || new Date().toISOString().split("T")[0],
    };

    const { data: dbData, error: dbError } = await supabase
      .from("files")
      .insert(dbRecord)
      .select()
      .single();

    if (dbError) {
      // Clean up uploaded file from storage if DB insert fails
      await supabase.storage.from("documents").remove([filePath]);
      throw dbError;
    }

    return mapFileToFrontend(dbData);
  },

  async uploadCompanyLogo(file: File): Promise<string> {
    const sanitizedName = sanitizeFilename(file.name);
    const filePath = `logos/${Date.now()}-${sanitizedName}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from("documents")
      .getPublicUrl(filePath);

    return publicUrl;
  }
};
