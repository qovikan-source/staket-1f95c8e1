/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, NoticePost, FileItem, VacantSpace } from "./types";

export const initialSpaces: VacantSpace[] = [
  {
    id: "space-kallhall-1",
    title: "Kombilokal i Kallhäll",
    location: "Kallhäll, Järfälla",
    description: "Fräscha lokal som har ett fantastiskt läge i köpstarkt område intill E18 samt Rotebro/ Stäketleden och E4:an. Välkända grannar som K-Rauta, Bilprovningen, Scania, Hemköp, McDonalds m.fl.",
    suitableFor: [
      "bilförsäljning, bil och däck verkstad mm",
      "showroom och kontor eller lokalt utlämningsställe",
      "en hantverksfirma (t.ex. vvs, elektriker, rörmokare, snickare) som behöver kombinerad lager och verkstad",
      "en butiksverksamhet som behöver höglager",
      "en entreprenad- eller åkerifirma som behöver maskingarage",
      "eller enligt andra önskemål, bara ej biltvätthall"
    ],
    totalArea: "ca 215 kvm fördelad lika på två plan och två egna parkeringsplats.",
    detailsLowerLevel: "Nedre planet har högt till tak ca 5 m. Hög manuell vik port 4x4,5m. Golvvärme och god bärighet samt golvbrunn med oljeavskiljare.",
    detailsUpperLevel: "Övre plan har idag en öppen planlösning. (Kan rums indelas om så önskas).",
    securityInfo: "Stäket företagscenter har 24h övervakningssystem och eget hemsidan.",
    imgUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800",
    createdAt: "2026-06-17"
  }
];

export const initialProfiles: UserProfile[] = [
  {
    id: "p1",
    name: "Alexander Krasar",
    role: "Styrelse",
    email: "alexander.krasar@foreningen.se",
    phone: "070-123 45 67",
    orgNr: "556123-4567",
    company: "Krasar Holding AB",
    unit: "Lokal 22",
    address: "Regeringsgatan 48, Stockholm",
  },
  {
    id: "p2",
    name: "Murat Kizil",
    role: "Styrelse",
    email: "murat.kizil@fastighet.se",
    phone: "073-987 65 43",
    orgNr: "559321-7654",
    company: "Kizil Entreprenad",
    unit: "Lokal 12",
    address: "Sveavägen 104, Stockholm",
  },
  {
    id: "p2.5",
    name: "Zinar Soran",
    role: "Styrelse",
    email: "zinar.soran@foreningen.se",
    phone: "076-555 44 33",
    orgNr: "559555-4433",
    company: "Soran Web & IT",
    unit: "Lokal 14",
    address: "Sveavägen 108, Stockholm",
  },
  {
    id: "p3",
    name: "Maria Andersson",
    role: "Styrelse",
    email: "maria.andersson@ekonomipartner.se",
    phone: "08-540 123 00",
    orgNr: "556789-1011",
    company: "Ekonomipartner Sthlm",
    unit: "Lokal 10",
    address: "Kungsgatan 12, Stockholm",
  },
  {
    id: "p4",
    name: "Thomas Berglund",
    role: "Medlem",
    email: "thomas.b@berglundscatering.se",
    phone: "076-222 33 44",
    orgNr: "556444-5555",
    company: "Berglunds Catering",
    unit: "Lokal 5",
    address: "Regeringsgatan 50, Stockholm",
  },
  {
    id: "p5",
    name: "Karin Nilsson",
    role: "Medlem",
    email: "karin@nilssonsbageri.se",
    phone: "072-555 66 77",
    orgNr: "556777-8888",
    company: "Nilssons Stenugnsbageri",
    unit: "Lokal 8",
    address: "Regeringsgatan 52, Stockholm",
  },
  {
    id: "p6",
    name: "Jonas Sjöberg",
    role: "Medlem",
    email: "jonas@sjoberg-it.se",
    phone: "070-888 99 00",
    orgNr: "559111-2222",
    company: "Sjöberg IT-Konsult",
    unit: "Lokal 15",
    address: "Sveavägen 106, Stockholm",
  },
  {
    id: "p7",
    name: "Lars Holm",
    role: "Medlem",
    email: "lars.holm@holmsjuridik.se",
    phone: "073-444 55 66",
    orgNr: "556333-2222",
    company: "Holms Juridiska Byrå",
    unit: "Lokal 3",
    address: "Kungsgatan 14, Stockholm",
  },
];

export const initialNotices: NoticePost[] = [
  {
    id: "n1",
    title: "ÅRSMÖTE 2026-05-27",
    category: "Årsmöten & Föreningens Styrelse",
    content: "Härmed kallas medlemmarna i Brf. Stäkets Företagscenter till ordinarie föreningsstämma. Dagordning och stämmomaterial har skickats till samtliga medlemmar och finns tillgängligt i dokumentarkivet.",
    date: "2026-04-27",
    isPinned: true,
    author: "Alexander Krasar (Ordförande)",
  },
  {
    id: "n2",
    title: "ÅRSMÖTE 2025-05-27",
    category: "Årsmöten & Föreningens Styrelse",
    content: "Kallelse till ordinarie föreningsstämma i Brf. Stäkets Företagscenter. Fullmaktsblanketter och årsberättelse finns under 'FILER' -> 'Medlemsfiler'.",
    date: "2025-05-06",
    isPinned: false,
    author: "Alexander Krasar (Styrelse)",
  },
  {
    id: "n3",
    title: "ÅRSMÖTE 2024-06-18",
    category: "Årsmöten & Föreningens Styrelse",
    content: "Kallelse till ordinarie föreningsstämma i Brf. Stäkets Företagscenter. Vi ses i det gemensamma konferensrummet kl 18.00.",
    date: "2024-05-10",
    isPinned: false,
    author: "Leif Mansor (Styrelse)",
  },
  {
    id: "n4",
    title: "Viktig information gällande grind koder och sommartider",
    category: "Grind Information & Öppettider",
    content: "Från och med den 20 juni kommer grindarna att hållas öppna måndag till fredag kl 07.00 - 18.00. Övriga tider krävs giltig passerbricka eller kod. Den nya sommarkoden för kvällar och helger har skickats ut via e-post till alla registrerade lokalägare. Vänligen lämna inte ut koden till obehöriga av säkerhetsskäl.",
    date: "2024-05-01",
    isPinned: false,
    author: "Alexander Krasar (Ordförande)",
  },
  {
    id: "n5",
    title: "Nya Parkeringsavgifter och Laddplatser för samtliga lokaler",
    category: "Parkeringsplatser",
    content: "Föreningen har nu färdigställt installationen av ytterligare 4 laddplatser för elbil på innergården. Boende och lokalägare kan ansöka om hyresavtal för dessa specifika platser genom att maila styrelsen. Priset justeras enligt budgetbeslutet till 850 kr/mån för standardplats och 1200 kr/mån + elförbrukning för laddplats.",
    date: "2024-04-12",
    isPinned: false,
    author: "Leif Mansor",
  },
  {
    id: "n6",
    title: "Soptömning under midsommarhelgen samt container på plats",
    category: "Sophantering & Container",
    content: "Det kommer finnas en stor grovavfallscontainer uppställd på parkeringens baksida. Passa på att rensa ur era lokaler. Observera att miljöfarligt avfall, elektronik och däck INTE får slängas i denna container. Soptömningen sker som vanligt tisdagen efter midsommar.",
    date: "2024-04-10",
    isPinned: false,
    author: "Leif Mansor",
  },
];

export const initialFiles: FileItem[] = [
  {
    id: "f1",
    name: "Föreningens_Stadgar_Fastställda_2024.pdf",
    category: "Medlemsfiler",
    uploadedAt: "2026-01-15",
    fileSize: "1.4 MB",
    mimeType: "application/pdf",
  },
  {
    id: "f2",
    name: "Ordningsregler_Gemensamma_Utrymmen.pdf",
    category: "Medlemsfiler",
    uploadedAt: "2026-02-10",
    fileSize: "320 KB",
    mimeType: "application/pdf",
  },
  {
    id: "f3",
    name: "Årsredovisning_BRF_Samfällighet_2025.pdf",
    category: "Medlemsfiler",
    uploadedAt: "2026-04-20",
    fileSize: "2.8 MB",
    mimeType: "application/pdf",
  },
  {
    id: "f4",
    name: "Grovsopor_och_Sophantering_Instruktion.pdf",
    category: "Medlemsfiler",
    uploadedAt: "2026-05-01",
    fileSize: "680 KB",
    mimeType: "application/pdf",
  },
  {
    id: "f5",
    name: "Styrelseprotokoll_2026_05_28.pdf",
    category: "Styrelsefiler",
    folder: "Administration",
    uploadedAt: "2026-05-30",
    fileSize: "450 KB",
    mimeType: "application/pdf",
  },
  {
    id: "f6",
    name: "Styrelseprotokoll_2026_04_14.pdf",
    category: "Styrelsefiler",
    folder: "Administration",
    uploadedAt: "2026-04-16",
    fileSize: "410 KB",
    mimeType: "application/pdf",
  },
  {
    id: "f7",
    name: "Budget_Prognos_Utfall_Q1_2026.pdf",
    category: "Styrelsefiler",
    folder: "Ekonomi",
    uploadedAt: "2026-04-25",
    fileSize: "1.2 MB",
    mimeType: "application/pdf",
  },
  {
    id: "f8",
    name: "Skatteverket_Bokslut_Inkomstdeklaration_2025.pdf",
    category: "Styrelsefiler",
    folder: "Ekonomi",
    uploadedAt: "2026-03-10",
    fileSize: "1.9 MB",
    mimeType: "application/pdf",
  },
  {
    id: "f9",
    name: "Pantbrev_Fastighet_Lokal_22.pdf",
    category: "Styrelsefiler",
    folder: "Pantbrev",
    uploadedAt: "2026-02-14",
    fileSize: "850 KB",
    mimeType: "application/pdf",
  },
  {
    id: "f10",
    name: "Pantbrev_Fastighet_Lokal_12.pdf",
    category: "Styrelsefiler",
    folder: "Pantbrev",
    uploadedAt: "2026-02-18",
    fileSize: "850 KB",
    mimeType: "application/pdf",
  },
  {
    id: "f11",
    name: "Arkiverade_Ritningar_Fasad_Sektion_1985.pdf",
    category: "Styrelsefiler",
    folder: "Arkiv",
    uploadedAt: "2025-09-01",
    fileSize: "14.5 MB",
    mimeType: "application/pdf",
  },
];

// Helper functions for reading/writing with LocalStorage
const KEY_PROFILES = "forening_profiles_db";
const KEY_NOTICES = "forening_notices_db";
const KEY_FILES = "forening_files_db";

export function loadProfiles(): UserProfile[] {
  try {
    const data = localStorage.getItem(KEY_PROFILES);
    if (!data) {
      localStorage.setItem(KEY_PROFILES, JSON.stringify(initialProfiles));
      return initialProfiles;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : initialProfiles;
  } catch (e) {
    console.error("Failed to load profiles from local storage, falling back to initial data.", e);
    return initialProfiles;
  }
}

export function saveProfiles(profiles: UserProfile[]) {
  try {
    localStorage.setItem(KEY_PROFILES, JSON.stringify(profiles || []));
  } catch (e) {
    console.error("Failed to save profiles to local storage", e);
  }
}

export function loadNotices(): NoticePost[] {
  try {
    const data = localStorage.getItem(KEY_NOTICES);
    if (!data) {
      localStorage.setItem(KEY_NOTICES, JSON.stringify(initialNotices));
      return initialNotices;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : initialNotices;
  } catch (e) {
    console.error("Failed to load notices from local storage, falling back to initial data.", e);
    return initialNotices;
  }
}

export function saveNotices(notices: NoticePost[]) {
  try {
    localStorage.setItem(KEY_NOTICES, JSON.stringify(notices || []));
  } catch (e) {
    console.error("Failed to save notices to local storage", e);
  }
}

export function loadFiles(): FileItem[] {
  try {
    const data = localStorage.getItem(KEY_FILES);
    if (!data) {
      localStorage.setItem(KEY_FILES, JSON.stringify(initialFiles));
      return initialFiles;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : initialFiles;
  } catch (e) {
    console.error("Failed to load files from local storage, falling back to initial data.", e);
    return initialFiles;
  }
}

export function saveFiles(files: FileItem[]) {
  try {
    localStorage.setItem(KEY_FILES, JSON.stringify(files || []));
  } catch (e) {
    console.error("Failed to save files to local storage", e);
  }
}

const KEY_SPACES = "forening_spaces_db";

export function loadSpaces(): VacantSpace[] {
  try {
    const data = localStorage.getItem(KEY_SPACES);
    if (!data) {
      localStorage.setItem(KEY_SPACES, JSON.stringify(initialSpaces));
      return initialSpaces;
    }
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : initialSpaces;
  } catch (e) {
    console.error("Failed to load spaces from local storage, falling back to initial data.", e);
    return initialSpaces;
  }
}

export function saveSpaces(spaces: VacantSpace[]) {
  try {
    localStorage.setItem(KEY_SPACES, JSON.stringify(spaces || []));
  } catch (e) {
    console.error("Failed to save spaces to local storage", e);
  }
}

