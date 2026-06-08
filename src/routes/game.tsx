import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppHeader } from "@/components/mddw/AppHeader";
import {
  FOOD_GROUPS,
  FOOD_GROUP_MAP,
  QUIZ_FOODS,
  type FoodGroupId,
  type QuizFood,
} from "@/lib/mddw/foodGroups";
import { recordResult } from "@/lib/mddw/storage";
import { useLang } from "@/lib/mddw/useLang";

export const Route = createFileRoute("/game")({
  head: () => ({
    meta: [
      { title: "MDDW Quiz Challenge" },
      { name: "description", content: "MCQ quiz: pick the correct food group for each food item." },
    ],
  }),
  component: GamePage,
});

const TOTAL_QUESTIONS = 10;
const POINTS_CORRECT = 10;
const POINTS_WRONG = -5;

interface Question {
  food: QuizFood;
  options: FoodGroupId[]; // 4 options, one is food.group
  correctIndex: number;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(): Question[] {
  const foods = shuffle(QUIZ_FOODS).slice(0, TOTAL_QUESTIONS);
  return foods.map((food) => {
    const distractors = shuffle(
      FOOD_GROUPS.map((g) => g.id).filter((id) => id !== food.group)
    ).slice(0, 3);
    const opts = shuffle([food.group, ...distractors]);
    return {
      food,
      options: opts,
      correctIndex: opts.indexOf(food.group),
    };
  });
}

type Phase = "intro" | "playing" | "result";

function GamePage() {
  const { t } = useLang();
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const start = () => {
    setQuestions(buildQuestions());
    setQIdx(0);
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setPicked(null);
    setPhase("playing");
  };

  const current = questions[qIdx];

  const handlePick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    const ok = i === current.correctIndex;
    if (ok) {
      setScore((s) => s + POINTS_CORRECT);
      setCorrect((c) => c + 1);
    } else {
      setScore((s) => s + POINTS_WRONG);
      setWrong((w) => w + 1);
    }
  };

  const handleNext = () => {
    if (qIdx + 1 >= questions.length) {
      const final = Math.max(0, score);
      recordResult({
        level: 1,
        score: final,
        correct,
        wrong,
        groupsConsumed: 0,
        passedMDDW: final >= 60,
        date: Date.now(),
      });
      setPhase("result");
    } else {
      setQIdx((i) => i + 1);
      setPicked(null);
    }
  };

  return (
    <main className="min-h-dvh">
      <AppHeader showBack />
      <div className="mx-auto max-w-xl px-4 py-5">
        <AnimatePresence mode="wait">
          {phase === "intro" && <Intro key="i" onStart={start} t={t} />}
          {phase === "playing" && current && (
            <Play
              key={"p" + qIdx}
              q={current}
              qIdx={qIdx}
              total={questions.length}
              score={score}
              picked={picked}
              onPick={handlePick}
              onNext={handleNext}
            />
          )}
          {phase === "result" && (
            <Result
              key="r"
              score={Math.max(0, score)}
              correct={correct}
              wrong={wrong}
              total={questions.length}
              onAgain={start}
              t={t}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function Intro({ onStart, t }: { onStart: () => void; t: (k: any) => string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="rounded-3xl bg-gradient-to-br from-primary to-accent text-primary-foreground p-6 shadow-lg">
        <div className="text-5xl mb-2" aria-hidden>🧠🍱</div>
        <h2 className="text-2xl font-bold">Food Group Quiz</h2>
        <p className="mt-2 text-sm opacity-95">
          {TOTAL_QUESTIONS} questions. A food item will appear — choose the correct food group from 4 options.
        </p>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card border-2 border-secondary p-4 text-center">
          <div className="text-2xl font-bold text-secondary">+{POINTS_CORRECT}</div>
          <div className="text-xs text-muted-foreground font-semibold">Correct answer</div>
        </div>
        <div className="rounded-2xl bg-card border-2 border-destructive p-4 text-center">
          <div className="text-2xl font-bold text-destructive">{POINTS_WRONG}</div>
          <div className="text-xs text-muted-foreground font-semibold">Wrong answer</div>
        </div>
      </div>
      <button
        onClick={onStart}
        className="mt-5 w-full rounded-2xl bg-primary text-primary-foreground py-4 text-lg font-bold shadow-md active:scale-[0.98] min-h-14"
      >
        ▶ {t("startTraining")}
      </button>
    </motion.div>
  );
}

function Play({
  q,
  qIdx,
  total,
  score,
  picked,
  onPick,
  onNext,
}: {
  q: Question;
  qIdx: number;
  total: number;
  score: number;
  picked: number | null;
  onPick: (i: number) => void;
  onNext: () => void;
}) {
  const answered = picked !== null;
  const isCorrect = picked === q.correctIndex;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* HUD */}
      <div className="flex items-center gap-3 text-sm mb-3">
        <div className="font-bold text-primary">⭐ {score}</div>
        <div className="text-muted-foreground">
          Q {qIdx + 1} / {total}
        </div>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden mb-5">
        <motion.div
          className="h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${((qIdx + 1) / total) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Food card */}
      <motion.div
        key={qIdx}
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="rounded-3xl bg-card border-2 border-border p-6 text-center shadow-md"
      >
        <div className="text-7xl mb-3" aria-hidden>
          {q.food.emoji}
        </div>
        <div className="text-xs uppercase font-bold text-muted-foreground tracking-wide">
          Which food group?
        </div>
        <div className="text-2xl font-bold mt-1">{q.food.name}</div>
      </motion.div>

      {/* Options */}
      <div className="mt-5 grid grid-cols-1 gap-2.5">
        {q.options.map((gid, i) => {
          const g = FOOD_GROUP_MAP[gid];
          const isPicked = picked === i;
          const isRight = i === q.correctIndex;
          let stateClass = "bg-card border-border";
          if (answered) {
            if (isRight) stateClass = "bg-secondary/15 border-secondary text-foreground";
            else if (isPicked) stateClass = "bg-destructive/15 border-destructive text-foreground";
            else stateClass = "bg-card border-border opacity-60";
          }
          return (
            <motion.button
              key={gid}
              onClick={() => onPick(i)}
              disabled={answered}
              whileTap={!answered ? { scale: 0.98 } : undefined}
              animate={
                answered && isPicked && !isRight
                  ? { x: [0, -6, 6, -4, 4, 0] }
                  : {}
              }
              transition={{ duration: 0.35 }}
              className={`rounded-2xl border-2 p-4 text-left min-h-16 flex items-center gap-3 shadow-sm transition ${stateClass}`}
            >
              <span className="text-2xl shrink-0" aria-hidden>{g.emoji}</span>
              <span className="flex-1 font-bold text-sm leading-tight">{g.name}</span>
              {answered && isRight && <span className="text-secondary text-xl">✓</span>}
              {answered && isPicked && !isRight && <span className="text-destructive text-xl">✗</span>}
            </motion.button>
          );
        })}
      </div>

      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4"
        >
          <div
            className={`rounded-2xl p-4 text-center font-bold ${
              isCorrect
                ? "bg-secondary text-secondary-foreground"
                : "bg-accent text-accent-foreground"
            }`}
          >
            {isCorrect ? "🎉 Correct! +10 points" : `❌ Correct answer: ${FOOD_GROUP_MAP[q.options[q.correctIndex]].name}`}
          </div>
          <button
            onClick={onNext}
            className="mt-3 w-full rounded-2xl bg-primary text-primary-foreground py-4 text-lg font-bold shadow-md active:scale-[0.98] min-h-14"
          >
            {qIdx + 1 >= total ? "See Results →" : "Next Question →"}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

function Result({
  score,
  correct,
  wrong,
  total,
  onAgain,
  t,
}: {
  score: number;
  correct: number;
  wrong: number;
  total: number;
  onAgain: () => void;
  t: (k: any) => string;
}) {
  const pct = Math.round((correct / total) * 100);
  const passed = pct >= 60;
  const stars = useMemo(() => {
    if (pct >= 90) return 3;
    if (pct >= 70) return 2;
    if (pct >= 50) return 1;
    return 0;
  }, [pct]);

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
      <div
        className={`rounded-3xl p-6 text-center shadow-lg ${
          passed ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground"
        }`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 220 }}
          className="text-6xl mb-2"
          aria-hidden
        >
          {passed ? "🏆" : "💪"}
        </motion.div>
        <h2 className="text-2xl font-bold">{passed ? "Great Work!" : "Keep Practicing"}</h2>
        <div className="mt-2 text-3xl tracking-widest">
          {"⭐".repeat(stars) + "☆".repeat(3 - stars)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <Stat label="Final Score" value={score} accent />
        <Stat label="Accuracy" value={`${pct}%`} accent />
        <Stat label={t("correctAnswers")} value={`${correct}/${total}`} />
        <Stat label={t("wrongAnswers")} value={`${wrong}/${total}`} />
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <button
          onClick={onAgain}
          className="rounded-2xl bg-primary text-primary-foreground py-4 font-bold min-h-14 active:scale-[0.98]"
        >
          ↻ {t("playAgain")}
        </button>
        <Link
          to="/learn"
          className="rounded-2xl bg-card border-2 border-border text-foreground py-4 font-bold min-h-14 text-center active:scale-[0.98]"
        >
          📖 Review Food Groups
        </Link>
        <Link
          to="/"
          className="rounded-2xl bg-muted text-foreground py-3 font-semibold text-center min-h-12 active:scale-[0.98]"
        >
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
