import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppHeader } from "@/components/mddw/AppHeader";
import {
  FOOD_GROUPS,
  FOOD_GROUP_MAP,
  QUIZ_FOODS,
  type FoodGroupId,
  type QuizFood,
} from "@/lib/mddw/foodGroups";
import { recordResult, loadProgress, saveProgress } from "@/lib/mddw/storage";
import { useLang } from "@/lib/mddw/useLang";
import html2canvas from "html2canvas";

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
  
  const [mistakes, setMistakes] = useState<{question: string, userAnswer: string, correctAnswer: string}[]>([]);
  const [userName, setUserName] = useState("");
  const [phcName, setPhcName] = useState("");

  const start = (name: string, phc: string) => {
    setUserName(name);
    setPhcName(phc);
    setQuestions(buildQuestions());
    setQIdx(0);
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setMistakes([]);
    setPicked(null);
    setPhase("playing");
  };

  const handleAgain = () => {
    setPhase("intro");
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
      setMistakes((m) => [...m, {
        question: current.food.name,
        userAnswer: FOOD_GROUP_MAP[current.options[i]].name,
        correctAnswer: FOOD_GROUP_MAP[current.options[current.correctIndex]].name
      }]);
    }
  };

  const handleNext = () => {
    if (qIdx + 1 >= questions.length) {
      const final = Math.max(0, score);
      const res = recordResult({
        level: 1,
        score: final,
        correct,
        wrong,
        groupsConsumed: 0,
        passedMDDW: final >= 60,
        date: Date.now(),
        userName,
        phcName,
        mistakes
      });
      
      // Auto trigger google sheets webhook if set
      const pState = loadProgress();
      if (pState.sheetsWebhookUrl && typeof window !== "undefined") {
        fetch(pState.sheetsWebhookUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({
            userName,
            phcName,
            score: final,
            correct,
            total: TOTAL_QUESTIONS,
            date: new Date().toISOString()
          })
        }).catch(e => console.error(e));
      }

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
              mistakes={mistakes}
              userName={userName}
              phcName={phcName}
              onAgain={handleAgain}
              t={t}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function Intro({ onStart, t }: { onStart: (n: string, p: string) => void; t: (k: any) => string }) {
  const p = loadProgress();
  const [name, setName] = useState(p.userName || "");
  const [phc, setPhc] = useState(p.phcName || "");

  const handleStart = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    const state = loadProgress();
    state.userName = name;
    state.phcName = phc;
    saveProgress(state);
    onStart(name, phc);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
      <div className="rounded-3xl bg-gradient-to-br from-primary to-accent text-primary-foreground p-6 shadow-lg mb-6">
        <div className="text-5xl mb-2" aria-hidden>🧠🍱</div>
        <h2 className="text-2xl font-bold">Food Group Quiz</h2>
        <p className="mt-2 text-sm opacity-95">
          {TOTAL_QUESTIONS} questions. A food item will appear — choose the correct food group from 4 options.
        </p>
      </div>
      
      <div className="bg-card rounded-2xl p-5 border-2 border-border mb-6">
        <h3 className="font-bold mb-4">Player Details</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-muted-foreground">Your Name *</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition"
              placeholder="e.g. Sunita"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-muted-foreground">Village / PHC</label>
            <input 
              type="text" 
              value={phc}
              onChange={e => setPhc(e.target.value)}
              className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition"
              placeholder="e.g. Rampur PHC"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-card border-2 border-secondary p-4 text-center">
          <div className="text-2xl font-bold text-secondary">+{POINTS_CORRECT}</div>
          <div className="text-xs text-muted-foreground font-semibold">Correct</div>
        </div>
        <div className="rounded-2xl bg-card border-2 border-destructive p-4 text-center">
          <div className="text-2xl font-bold text-destructive">{POINTS_WRONG}</div>
          <div className="text-xs text-muted-foreground font-semibold">Wrong</div>
        </div>
      </div>
      <button
        onClick={handleStart}
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
  mistakes,
  userName,
  phcName,
  onAgain,
  t,
}: {
  score: number;
  correct: number;
  wrong: number;
  total: number;
  mistakes: {question: string, userAnswer: string, correctAnswer: string}[];
  userName: string;
  phcName: string;
  onAgain: () => void;
  t: (k: any) => string;
}) {
  const pct = Math.round((correct / total) * 100);
  const passed = pct >= 60;
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    try {
      const canvas = await html2canvas(certificateRef.current, { scale: 2 });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `MDDW_Certificate_${userName.replace(/\\s+/g, "_")}.png`;
      link.click();
    } catch (e) {
      console.error(e);
      alert("Could not generate certificate. Please try again.");
    }
  };

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

      {mistakes.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold text-lg mb-3">Review Mistakes</h3>
          <div className="space-y-3">
            {mistakes.map((m, i) => (
              <div key={i} className="bg-card border-2 border-border rounded-xl p-3 text-sm">
                <div className="font-semibold text-base mb-1">{m.question}</div>
                <div className="text-destructive mb-0.5">✗ You answered: {m.userAnswer}</div>
                <div className="text-secondary">✓ Correct: {m.correctAnswer}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {passed && (
        <>
          <button
            onClick={downloadCertificate}
            className="mt-6 w-full rounded-2xl bg-blue-600 text-white py-4 font-bold min-h-14 active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
          >
            <span className="text-xl">🎓</span> Download Certificate
          </button>
          
          {/* Hidden Certificate DOM for html2canvas */}
          <div className="overflow-hidden h-0 w-0 absolute opacity-0 pointer-events-none">
            <div ref={certificateRef} className="w-[800px] h-[600px] bg-white p-12 text-black flex flex-col items-center justify-center relative border-[12px] border-green-600 font-sans">
              <div className="absolute top-8 left-8 text-6xl">🧠🍱</div>
              <div className="absolute top-8 right-8 text-6xl opacity-20">🏆</div>
              <h1 className="text-4xl font-bold text-green-700 uppercase tracking-widest mb-4">Certificate of Completion</h1>
              <h2 className="text-2xl font-semibold text-gray-600 mb-8">MDDW Master Challenge</h2>
              <p className="text-lg mb-4 text-gray-500">This certifies that</p>
              <h3 className="text-5xl font-bold text-gray-900 border-b-2 border-gray-300 pb-2 px-12 mb-6 text-center capitalize">{userName}</h3>
              {phcName && <p className="text-xl text-gray-600 mb-6 font-medium">({phcName})</p>}
              <p className="text-lg text-gray-500 text-center max-w-lg mb-8">
                has successfully completed the Minimum Dietary Diversity for Women (MDDW) training module with a score of <strong>{pct}%</strong>.
              </p>
              <div className="flex justify-between w-full max-w-md mt-4">
                <div className="text-center">
                  <div className="font-bold text-gray-800 text-xl border-b border-gray-400 pb-1 mb-1">{new Date().toLocaleDateString()}</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">Date</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-800 text-xl border-b border-gray-400 pb-1 mb-1">{score} Points</div>
                  <div className="text-sm text-gray-500 uppercase tracking-wide">Score</div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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
