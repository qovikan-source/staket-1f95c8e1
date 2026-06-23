/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = "Styrelse" | "Medlem" | "Hyresgäst" | "Administrator" | "Besökare";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  orgNr: string;
  company: string;
  unit: string; // e.g. "Lokal 22" or "22"
  address: string;
  description?: string;
  website?: string;
  logo?: string;
  boardTitle?: string;
  hideInContactBook?: boolean;
  hideInCompanyPage?: boolean;
}

export type NoticeboardCategory =
  | "Grind Information & Öppettider"
  | "Stadgar"
  | "Skyltning på fasad"
  | "Markiser"
  | "Luftkonditioneringsapparatar"
  | "Uthyrningskontrakt"
  | "Sophantering"
  | "Parkeringsplatser"
  | "Larm & Övervakning"
  | "Årsmöten & Föreningens Styrelse"
  | "Ekonomi"
  | "Skadegörelse & Inbrott"
  | "Övrigt"
  | "Information från Föreningsstyrelse";

export const NOTICEBOARD_CATEGORIES: NoticeboardCategory[] = [
  "Grind Information & Öppettider",
  "Stadgar",
  "Skyltning på fasad",
  "Markiser",
  "Luftkonditioneringsapparatar",
  "Uthyrningskontrakt",
  "Sophantering",
  "Parkeringsplatser",
  "Larm & Övervakning",
  "Årsmöten & Föreningens Styrelse",
  "Ekonomi",
  "Skadegörelse & Inbrott",
  "Information från Föreningsstyrelse",
  "Övrigt",
];

export type FileCategory = "Medlemsfiler" | "Styrelsefiler";

export type BoardFolder = "Administration" | "Ekonomi" | "Pantbrev" | "Arkiv";

export const BOARD_FOLDERS: BoardFolder[] = [
  "Administration",
  "Ekonomi",
  "Pantbrev",
  "Arkiv"
];

export interface FileItem {
  id: string;
  name: string;
  category: FileCategory;
  folder?: BoardFolder; // visible if category is Styrelsefiler
  uploadedAt: string;
  fileSize: string;
  mimeType: string;
  url?: string;
  isOptimistic?: boolean;
}

export interface NoticePost {
  id: string;
  title: string;
  category: NoticeboardCategory;
  content: string;
  date: string;
  isPinned: boolean;
  author: string;
}

export interface VacantSpace {
  id: string;
  title: string;
  location: string;
  description: string;
  suitableFor: string[];
  totalArea: string;
  detailsLowerLevel: string;
  detailsUpperLevel: string;
  securityInfo: string;
  imgUrl?: string;
  imgUrls?: string[];
  createdAt: string;
}


