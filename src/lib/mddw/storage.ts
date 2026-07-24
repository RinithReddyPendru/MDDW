import type { Lang } from "./translations";
import { t } from "./translations";

export interface GameResult {
  level: 1 | 2 | 3;
  score: number;
  correct: number;
  wrong: number;
  groupsConsumed: number;
  passedMDDW: boolean;
  date: number;
  userName?: string;
  phcName?: string;
  phoneNumber?: string;
  mistakes?: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
  }[];
}

export interface ProgressState {
  results: GameResult[];
  unlockedLevel: 1 | 2 | 3;
  highestScore: number;
  badges: string[];
  lang: Lang;
  userName?: string;
  phcName?: string;
  phoneNumber?: string;
  sheetsWebhookUrl?: string;
  hasCompletedTraining?: boolean;
  /** Saved game round so ASHAs can resume from where they left off */
  savedRoundIndex?: number;
  savedQIdx?: number;
  savedStandardScore?: number;
  savedCounselingScore?: number;
  savedVisualScore?: number;
  savedCorrect?: number;
  savedWrong?: number;
  savedMistakes?: { question: string; userAnswer: string; correctAnswer: string }[];
}

const KEY = "mddw_progress_v1";

const DEFAULT: ProgressState = {
  results: [],
  unlockedLevel: 1,
  highestScore: 0,
  badges: [],
  lang: "te",
  userName: "",
  phcName: "",
  phoneNumber: "",
  sheetsWebhookUrl: "https://script.google.com/macros/s/AKfycbzFeaYmJCqD6XYFl-RtsqS2N33DKxHsptZqu43rIuVEGr03cj4HgnXvL44LiN53ZUKN/exec",
  hasCompletedTraining: false,
};

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw);
    const state = { ...DEFAULT, ...parsed };
    
    // Auto-migrate old webhook URL to the new working one
    const oldUrl = "https://script.google.com/macros/s/AKfycbw7H7aBhQsG5_P8g6xZISmsE4QnHh5pSvl24t7Q6Bba5cXQ2PuGfahU0l63FpROXLbo/exec";
    if (!state.sheetsWebhookUrl || state.sheetsWebhookUrl === oldUrl || state.sheetsWebhookUrl === "") {
      state.sheetsWebhookUrl = DEFAULT.sheetsWebhookUrl;
    }
    
    return state;
  } catch {
    return DEFAULT;
  }
}

export function saveProgress(p: ProgressState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(p));
}

export function setLang(lang: Lang) {
  const p = loadProgress();
  p.lang = lang;
  saveProgress(p);
}

export function recordResult(result: GameResult): ProgressState {
  const p = loadProgress();
  p.results.push(result);
  p.highestScore = Math.max(p.highestScore, result.score);
  if (result.score >= 60 && result.level === p.unlockedLevel && p.unlockedLevel < 3) {
    p.unlockedLevel = (p.unlockedLevel + 1) as 1 | 2 | 3;
  }
  // Badges
  const earned = new Set(p.badges);
  if (p.results.length >= 1) earned.add("food_beginner");
  if (p.results.length >= 3) earned.add("nutrition_learner");
  if (p.highestScore >= 70) earned.add("nutrition_champion");
  if (p.highestScore >= 90) earned.add("mddw_expert");
  if (p.unlockedLevel === 3 && p.results.some((r) => r.level === 3 && r.score >= 80)) earned.add("asha_master");
  p.badges = Array.from(earned);
  saveProgress(p);
  return p;
}

export interface BadgeDef {
  id: string;
  nameKey: string;
  descKey: string;
  emoji: string;
}

const BADGE_DEFS: BadgeDef[] = [
  { id: "food_beginner", nameKey: "badgeFoodBeginner", descKey: "badgeFoodBeginnerDesc", emoji: "\uD83C\uDF3E" },
  { id: "nutrition_learner", nameKey: "badgeNutritionLearner", descKey: "badgeNutritionLearnerDesc", emoji: "\uD83D\uDCDA" },
  { id: "nutrition_champion", nameKey: "badgeNutritionChampion", descKey: "badgeNutritionChampionDesc", emoji: "\uD83C\uDFC6" },
  { id: "mddw_expert", nameKey: "badgeMddwExpert", descKey: "badgeMddwExpertDesc", emoji: "\u2B50" },
  { id: "asha_master", nameKey: "badgeAshaMaster", descKey: "badgeAshaMasterDesc", emoji: "\uD83D\uDC51" },
];

export function getBadges(lang: Lang): { id: string; name: string; emoji: string; desc: string }[] {
  return BADGE_DEFS.map((b) => ({
    id: b.id,
    name: t(lang, b.nameKey as any),
    emoji: b.emoji,
    desc: t(lang, b.descKey as any),
  }));
}

// Backward compat export (English badges)
export const BADGES = getBadges("en");

export interface AdminRow {
  date: string;
  name: string;
  phc: string;
  phone: string;
  score: number;
}

const ADMIN_DB_KEY = "mddw_admin_db";

export function loadAdminDatabase(): AdminRow[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ADMIN_DB_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function saveToAdminDatabase(row: AdminRow) {
  if (typeof window === "undefined") return;
  
  // 1. Save locally as backup
  const db = loadAdminDatabase();
  db.push(row);
  localStorage.setItem(ADMIN_DB_KEY, JSON.stringify(db));

  // 2. Send to Google Sheets Webhook
  const state = loadProgress();
  if (state.sheetsWebhookUrl && state.sheetsWebhookUrl.startsWith("http")) {
    try {
      await fetch(state.sheetsWebhookUrl, {
        method: 'POST',
        mode: 'no-cors', // Prevents CORS errors from blocking the request
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(row)
      });
      console.log("Data successfully sent to Google Sheets");
    } catch (e) {
      console.error("Failed to send data to Google Sheets", e);
    }
  }
}
