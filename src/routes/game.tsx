import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppHeader } from "@/components/mddw/AppHeader";
import { FOOD_GROUPS, FOOD_GROUP_MAP, type FoodGroupId } from "@/lib/mddw/foodGroups";
import { pickScenarioForLevel, trimFoodsForLevel, type Scenario, type FoodItem } from "@/lib/mddw/scenarios";
import { loadProgress, recordResult } from "@/lib/mddw/storage";
import { useLang } from "@/lib/mddw/useLang";

export const Route = createFileRoute("/game")({
  head: () => ({
    meta: [
      { title: "MDDW Challenge — Game" },
      { name: "description", content: "Classify foods into MDDW groups and calculate dietary diversity." },
    ],
  }),
  component: GamePage,
});

type Phase = "select-level" | "scenario" | "playing" | "result";

function GamePage() {
  const { t } = useLang();
  const [phase, setPhase] = useState<Phase>("select-level");
  const [level, setLevel] = useState<1 | 2 | 3>(1);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [unlocked, setUnlocked] = useState<1 | 2 | 3>(1);

  useEffect(() => {
    setUnlocked(loadProgress().unlockedLevel);
  }, []);

  const startLevel = (lv: 1 | 2 | 3) => {
    const sc = trimFoodsForLevel(pickScenarioForLevel(lv), lv);
    setLevel(lv);
    setScenario(sc);
    setPhase("scenario");
  };

  return (
    <main className="min-h-dvh">
      <AppHeader showBack />
      <div className="mx-auto max-w-xl px-4 py-5">
        <AnimatePresence mode="wait">
          {phase === "select-level" && (
            <LevelSelect key="ls" unlocked={unlocked} onStart={startLevel} t={t} />
          )}
          {phase === "scenario" && scenario && (
            <ScenarioCard key="sc" scenario={scenario} level={level} t={t} onPlay={() => setPhase("playing")} />
          )}
          {phase === "playing" && scenario && (
            <PlayBoard
              key="pb"
              scenario={scenario}
              level={level}
              t={t}
              onFinish={(res) => {
                const p = recordResult({ ...res, level, date: Date.now() });
                setUnlocked(p.unlockedLevel);
                setPhase("result");
                setLastResult(res);
              }}
            />
          )}
          {phase === "result" && lastResultRef.current && (
            <ResultView
              key="rs"
              result={lastResultRef.current}
              level={level}
              t={t}
              onPlayAgain={() => startLevel(level)}
              onNext={() => {
                const next = Math.min(3, level + 1) as 1 | 2 | 3;
                startLevel(next);
              }}
              canAdvance={lastResultRef.current.score >= 60 && level < 3}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );

  // Refs/state for result are tracked here
  function setLastResult(r: ResultData) {
    lastResultRef.current = r;
  }
}

const lastResultRef: { current: ResultData | null } = { current: null };

interface ResultData {
  score: number;
  correct: number;
  wrong: number;
  groupsConsumed: number;
  passedMDDW: boolean;
}

function LevelSelect({
  unlocked, onStart, t,
}: { unlocked: 1 | 2 | 3; onStart: (l: 1 | 2 | 3) => void; t: (k: any) => string }) {
  const levels: { lv: 1 | 2 | 3; label: string; items: number; color: string }[] = [
    { lv: 1, label: t("easy"), items: 5, color: "from-secondary to-secondary/70" },
    { lv: 2, label: t("medium"), items: 10, color: "from-accent to-primary" },
    { lv: 3, label: t("hard"), items: 15, color: "from-primary to-destructive" },
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <h2 className="text-xl font-bold mb-1">MDDW Challenge</h2>
      <p className="text-sm text-muted-foreground mb-4">{t("unlockTip")}</p>
      <div className="grid gap-3">
        {levels.map((l) => {
          const locked = l.lv > unlocked;
          return (
            <button
              key={l.lv}
              disabled={locked}
              onClick={() => onStart(l.lv)}
              className={`rounded-2xl text-left p-5 shadow-md min-h-20 flex items-center gap-4 transition active:scale-[0.98] ${
                locked
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : `bg-gradient-to-br ${l.color} text-primary-foreground`
              }`}
            >
              <div className="text-4xl font-black opacity-90">{l.lv}</div>
              <div className="flex-1">
                <div className="text-lg font-bold">{t("level")} {l.lv} · {l.label}</div>
                <div className="text-sm opacity-90">{l.items} foods · 90s</div>
              </div>
              <div className="text-2xl">{locked ? "🔒" : "▶"}</div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

function ScenarioCard({
  scenario, level, t, onPlay,
}: { scenario: Scenario; level: 1 | 2 | 3; t: (k: any) => string; onPlay: () => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="rounded-2xl bg-card border-2 border-border p-5 shadow-md">
        <div className="text-xs font-bold uppercase text-primary tracking-wide">{t("dietaryRecall")}</div>
        <h2 className="text-xl font-bold mt-1">{scenario.patient}</h2>
        <div className="text-sm text-muted-foreground">{scenario.weeks} {t("weeks")} · {scenario.region}</div>
        <div className="mt-4 space-y-3">
          {scenario.meals.map((m) => (
            <div key={m.time} className="rounded-xl bg-muted/60 p-3">
              <div className="text-xs font-bold uppercase text-secondary">{m.time}</div>
              <div className="text-sm mt-1">{m.items.join(" · ")}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-3 text-center">{t("dragHint")}</div>
      <button
        onClick={onPlay}
        className="mt-3 w-full rounded-2xl bg-primary text-primary-foreground py-4 text-lg font-bold shadow-md active:scale-[0.98] min-h-14"
      >
        ▶ {t("play")} · {t("level")} {level}
      </button>
    </motion.div>
  );
}

function PlayBoard({
  scenario, level, t, onFinish,
}: {
  scenario: Scenario;
  level: 1 | 2 | 3;
  t: (k: any) => string;
  onFinish: (r: ResultData) => void;
}) {
  const [remaining, setRemaining] = useState<FoodItem[]>(scenario.foods);
  const [selected, setSelected] = useState<FoodItem | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [consumedGroups, setConsumedGroups] = useState<Set<FoodGroupId>>(new Set());
  const [feedback, setFeedback] = useState<{ groupId: FoodGroupId; ok: boolean } | null>(null);
  const [time, setTime] = useState(90);
  const finishedRef = useRef(false);

  const totalFoods = scenario.foods.length;

  useEffect(() => {
    if (finishedRef.current) return;
    if (time <= 0 || remaining.length === 0) {
      if (!finishedRef.current) {
        finishedRef.current = true;
        const passed = consumedGroups.size >= 5;
        onFinish({
          score: Math.max(0, score),
          correct, wrong,
          groupsConsumed: consumedGroups.size,
          passedMDDW: passed,
        });
      }
      return;
    }
    const id = setTimeout(() => setTime((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [time, remaining.length, score, correct, wrong, consumedGroups, onFinish]);

  const handleDrop = (groupId: FoodGroupId) => {
    if (!selected) return;
    const ok = selected.group === groupId;
    setFeedback({ groupId, ok });
    setTimeout(() => setFeedback(null), 450);
    if (ok) {
      setScore((s) => s + 10);
      setCorrect((c) => c + 1);
      setConsumedGroups((set) => new Set(set).add(groupId));
      setRemaining((list) => list.filter((f) => f.id !== selected.id));
    } else {
      setScore((s) => s - 5);
      setWrong((w) => w + 1);
    }
    setSelected(null);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* HUD */}
      <div className="sticky top-[57px] z-30 -mx-4 px-4 py-2 bg-background/95 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3 text-sm">
          <div className="font-bold text-primary">⭐ {score}</div>
          <div className="text-muted-foreground">✓ {correct} · ✗ {wrong}</div>
          <div className="ml-auto font-bold tabular-nums">{time}s</div>
        </div>
        <div className="h-1.5 mt-1 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-1000 linear"
            style={{ width: `${(time / 90) * 100}%` }}
          />
        </div>
        <div className="text-[11px] text-muted-foreground mt-1">
          {totalFoods - remaining.length}/{totalFoods} · {consumedGroups.size}/10 {t("foodGroups").toLowerCase()}
        </div>
      </div>

      {/* Food items to classify */}
      <div className="mt-4">
        <div className="text-xs font-bold uppercase text-muted-foreground mb-2">Foods</div>
        <div className="flex flex-wrap gap-2 min-h-16">
          <AnimatePresence>
            {remaining.map((f) => {
              const isSel = selected?.id === f.id;
              return (
                <motion.button
                  key={f.id}
                  layout
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.3, opacity: 0 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelected(isSel ? null : f)}
                  className={`rounded-2xl px-3 py-2 text-sm font-semibold border-2 shadow-sm min-h-12 flex items-center gap-2 ${
                    isSel
                      ? "bg-primary text-primary-foreground border-primary ring-4 ring-primary/30"
                      : "bg-card text-foreground border-border"
                  }`}
                >
                  <span className="text-xl" aria-hidden>{f.emoji}</span>
                  <span>{f.name}</span>
                </motion.button>
              );
            })}
          </AnimatePresence>
          {remaining.length === 0 && (
            <div className="text-sm text-secondary font-semibold py-3">All foods classified! 🎉</div>
          )}
        </div>
      </div>

      {/* Drop zones */}
      <div className="mt-5">
        <div className="text-xs font-bold uppercase text-muted-foreground mb-2">Tap a group</div>
        <div className="grid grid-cols-2 gap-2.5">
          {FOOD_GROUPS.map((g) => {
            const fb = feedback?.groupId === g.id ? feedback : null;
            const consumed = consumedGroups.has(g.id);
            return (
              <motion.button
                key={g.id}
                onClick={() => handleDrop(g.id)}
                disabled={!selected}
                whileTap={selected ? { scale: 0.96 } : undefined}
                animate={
                  fb
                    ? fb.ok
                      ? { backgroundColor: "var(--color-success)", scale: [1, 1.05, 1] }
                      : { x: [0, -6, 6, -4, 4, 0], backgroundColor: "var(--color-destructive)" }
                    : {}
                }
                transition={{ duration: 0.35 }}
                className={`rounded-2xl border-2 p-3 text-left min-h-20 shadow-sm transition ${
                  selected ? "cursor-pointer" : "opacity-90"
                } ${fb ? "text-primary-foreground" : "bg-card text-foreground"}`}
                style={
                  !fb
                    ? {
                        borderColor: `var(--${g.colorVar})`,
                        backgroundColor: consumed
                          ? `color-mix(in oklab, var(--${g.colorVar}) 18%, white)`
                          : undefined,
                      }
                    : { borderColor: "transparent" }
                }
                aria-label={g.name}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl" aria-hidden>{g.emoji}</span>
                  {consumed && !fb && <span className="text-xs text-secondary font-bold">✓</span>}
                </div>
                <div className="text-xs font-bold mt-1 leading-tight">{g.name}</div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => {
          if (finishedRef.current) return;
          finishedRef.current = true;
          onFinish({
            score: Math.max(0, score),
            correct, wrong,
            groupsConsumed: consumedGroups.size,
            passedMDDW: consumedGroups.size >= 5,
          });
        }}
        className="mt-6 w-full rounded-2xl bg-secondary text-secondary-foreground py-3 font-bold min-h-12 active:scale-[0.98]"
      >
        {t("finish")} · {t("level")} {level}
      </button>
    </motion.div>
  );
}

function ResultView({
  result, level, t, onPlayAgain, onNext, canAdvance,
}: {
  result: ResultData;
  level: 1 | 2 | 3;
  t: (k: any) => string;
  onPlayAgain: () => void;
  onNext: () => void;
  canAdvance: boolean;
}) {
  const passed = result.passedMDDW;
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
      <div className={`rounded-3xl p-6 text-center shadow-lg ${passed ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground"}`}>
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220 }}
          className="text-6xl mb-2"
          aria-hidden
        >
          {passed ? "🎉" : "💪"}
        </motion.div>
        <h2 className="text-2xl font-bold">{passed ? t("meetsMDDW") : t("needsImprovement")}</h2>
        <p className="text-sm opacity-90 mt-1">{t("mddwExplain")}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <Stat label={t("finalScore")} value={result.score} accent />
        <Stat label={t("diversity")} value={`${result.groupsConsumed}/10`} accent />
        <Stat label={t("correctAnswers")} value={result.correct} />
        <Stat label={t("wrongAnswers")} value={result.wrong} />
      </div>

      <div className="mt-5 flex flex-col gap-2">
        {canAdvance && (
          <button onClick={onNext} className="rounded-2xl bg-primary text-primary-foreground py-4 font-bold min-h-14 active:scale-[0.98]">
            {t("nextLevel")} →
          </button>
        )}
        <button onClick={onPlayAgain} className="rounded-2xl bg-card border-2 border-border text-foreground py-4 font-bold min-h-14 active:scale-[0.98]">
          ↻ {t("playAgain")}
        </button>
        <Link to="/" className="rounded-2xl bg-muted text-foreground py-3 font-semibold text-center min-h-12 active:scale-[0.98]">
          🏠 {t("home")}
        </Link>
      </div>
    </motion.div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 border-2 ${accent ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
      <div className="text-xs font-semibold uppercase text-muted-foreground">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${accent ? "text-primary" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

// silence unused warning
void FOOD_GROUP_MAP;
