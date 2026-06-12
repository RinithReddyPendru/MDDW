import type { Lang } from "./translations";

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
  sheetsWebhookUrl?: string;
}

const KEY = "mddw_progress_v1";

const DEFAULT: ProgressState = {
  results: [],
  unlockedLevel: 1,
  highestScore: 0,
  badges: [],
  lang: "en",
  userName: "",
  phcName: "",
  sheetsWebhookUrl: "",
};

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    return { ...DEFAULT, ...JSON.parse(raw) };
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

export const BADGES: { id: string; name: string; emoji: string; desc: string }[] = [
  { id: "food_beginner", name: "Food Group Beginner", emoji: "🌱", desc: "Played your first game" },
  { id: "nutrition_learner", name: "Nutrition Learner", emoji: "📚", desc: "Played 3 games" },
  { id: "nutrition_champion", name: "Nutrition Champion", emoji: "🏆", desc: "Scored 70+" },
  { id: "mddw_expert", name: "MDDW Expert", emoji: "⭐", desc: "Scored 90+" },
  { id: "asha_master", name: "ASHA Master", emoji: "👑", desc: "Mastered Level 3" },
];
