import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AppHeader } from "@/components/mddw/AppHeader";
import {
  getFoodGroups,
  QUIZ_FOODS,
  getQuizFoodName,
  type FoodGroupId,
  type QuizFood,
} from "@/lib/mddw/foodGroups";
import { recordResult, loadProgress, saveProgress } from "@/lib/mddw/storage";
import { playPop, playSuccess, playFailure } from "@/lib/mddw/audio";
import { useLang } from "@/lib/mddw/useLang";
import html2canvas from "html2canvas";
import { NutriCompanion } from "@/components/mddw/NutriCompanion";

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
const POINTS_WRONG = 0;

export type Question =
  | { type: "single_food"; food: QuizFood; options: FoodGroupId[]; correctIndex: number; }
  | { type: "scenario"; scenarioKey: string; customQuestionKey?: string; foods: QuizFood[]; options: FoodGroupId[]; correctIndices: number[]; };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(FOOD_GROUPS: ReturnType<typeof getFoodGroups>): Question[] {
  // 8 normal questions
  const foods = shuffle(QUIZ_FOODS).slice(0, 8);
  const normalQs: Question[] = foods.map((food) => {
    const distractors = shuffle(
      FOOD_GROUPS.map((g) => g.id).filter((id) => id !== food.group)
    ).slice(0, 3);
    const opts = shuffle([food.group, ...distractors]);
    return {
      type: "single_food",
      food,
      options: opts,
      correctIndex: opts.indexOf(food.group),
    };
  });

  // Scenario 1: Kamala (Rice, Toor Dal, Spinach) -> groups: grains, pulses, dglv
  const s1Foods = [QUIZ_FOODS.find(f => f.name === "Rice")!, QUIZ_FOODS.find(f => f.name === "Toor Dal")!, QUIZ_FOODS.find(f => f.name === "Palak")!];
  const s1Groups: FoodGroupId[] = ["grains", "pulses", "dglv"];
  const s1Distractors = shuffle(FOOD_GROUPS.map(g => g.id).filter(id => !s1Groups.includes(id))).slice(0, 3);
  const s1Opts = shuffle([...s1Groups, ...s1Distractors]);
  const s1Correct = s1Opts.map((id, i) => s1Groups.includes(id) ? i : -1).filter(i => i !== -1);
  
  // Scenario 2: Rani (Roti, Boiled Egg, Milk) -> groups: grains, eggs, dairy
  const s2Foods = [QUIZ_FOODS.find(f => f.name === "Chapati / Roti")!, QUIZ_FOODS.find(f => f.name === "Boiled Egg")!, QUIZ_FOODS.find(f => f.name === "Milk")!];
  const s2Groups: FoodGroupId[] = ["grains", "eggs", "dairy"];
  const s2Distractors = shuffle(FOOD_GROUPS.map(g => g.id).filter(id => !s2Groups.includes(id))).slice(0, 3);
  const s2Opts = shuffle([...s2Groups, ...s2Distractors]);
  const s2Correct = s2Opts.map((id, i) => s2Groups.includes(id) ? i : -1).filter(i => i !== -1);

  
  // Scenario 3: Recommendation (Grains, Pulses, Dairy). Missing 2 for 5-group minimum.
  const s3Foods = [QUIZ_FOODS.find(f => f.name === "Rice")!, QUIZ_FOODS.find(f => f.name === "Toor Dal")!, QUIZ_FOODS.find(f => f.name === "Milk")!];
  const s3CorrectGroups: FoodGroupId[] = ["dglv", "vit_a_rich"];
  const s3Distractors = shuffle(FOOD_GROUPS.map(g => g.id).filter(id => !s3CorrectGroups.includes(id) && !["grains", "pulses", "dairy"].includes(id))).slice(0, 3);
  const s3Opts = shuffle([...s3CorrectGroups, ...s3Distractors]);
  const s3Correct = s3Opts.map((id, i) => s3CorrectGroups.includes(id) ? i : -1).filter(i => i !== -1);

  const scenarios: Question[] = [
    { type: "scenario", scenarioKey: "scenarioCounseling", customQuestionKey: "scenarioQuestionMissing", foods: s3Foods, options: s3Opts, correctIndices: s3Correct },
    { type: "scenario", scenarioKey: "scenarioKamala", foods: s1Foods, options: s1Opts, correctIndices: s1Correct },
    { type: "scenario", scenarioKey: "scenarioRani", foods: s2Foods, options: s2Opts, correctIndices: s2Correct },
  ];

  return [...normalQs, ...scenarios];
}

type Phase = "intro" | "playing" | "result";

function GamePage() {
  const { t, lang } = useLang();
  const FOOD_GROUPS = getFoodGroups(lang);
  const FOOD_GROUP_MAP = Object.fromEntries(FOOD_GROUPS.map((g) => [g.id, g])) as Record<FoodGroupId, (typeof FOOD_GROUPS)[0]>;
  const [phase, setPhase] = useState<Phase>("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [multiPicked, setMultiPicked] = useState<number[]>([]);
  const [multiSubmitted, setMultiSubmitted] = useState(false);
  
  const [mistakes, setMistakes] = useState<{question: string, userAnswer: string, correctAnswer: string}[]>([]);
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phcName, setPhcName] = useState("");

  const start = (name: string, phc: string) => {
    setUserName(name);
    setPhcName(phc);
    setQuestions(buildQuestions(FOOD_GROUPS));
    setQIdx(0);
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setMistakes([]);
    setPicked(null);
    setMultiPicked([]);
    setMultiSubmitted(false);
    setPhase("playing");
  };

  const handleAgain = () => {
    setPhase("intro");
  };

  const current = questions[qIdx];

  const handlePick = (i: number) => {
    if (current.type === "scenario") {
      if (multiSubmitted) return;
      playPop();
      setMultiPicked(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
      return;
    }

    if (picked !== null) return;
    setPicked(i);
    const ok = (current.type === "single_food") && i === current.correctIndex;
    if (ok) {
      playSuccess();
      setScore((s) => s + POINTS_CORRECT);
      setCorrect((c) => c + 1);
    } else {
      playFailure();
      setScore((s) => Math.max(0, s + POINTS_WRONG));
      setWrong((w) => w + 1);
      setMistakes((m) => [...m, {
        question: getQuizFoodName((current as any).food, lang),
        userAnswer: FOOD_GROUP_MAP[current.options[i]]?.name ?? current.options[i],
        correctAnswer: FOOD_GROUP_MAP[current.options[(current as any).correctIndex]]?.name ?? current.options[(current as any).correctIndex]
      }]);
    }
  };

  const handleSubmitMulti = () => {
    if (multiSubmitted || current.type !== "scenario") return;
    setMultiSubmitted(true);
    
    const correctSet = new Set(current.correctIndices);
    const pickedSet = new Set(multiPicked);
    const isPerfect = correctSet.size === pickedSet.size && [...correctSet].every(x => pickedSet.has(x));
    
    if (isPerfect) {
      playSuccess();
      setScore((s) => s + POINTS_CORRECT);
      setCorrect((c) => c + 1);
    } else {
      playFailure();
      setScore((s) => Math.max(0, s + POINTS_WRONG));
      setWrong((w) => w + 1);
      setMistakes((m) => [...m, {
        question: t(current.scenarioKey as any),
        userAnswer: multiPicked.map(idx => FOOD_GROUP_MAP[current.options[idx]]?.name ?? current.options[idx]).join(", "),
        correctAnswer: current.correctIndices.map(idx => FOOD_GROUP_MAP[current.options[idx]]?.name ?? current.options[idx]).join(", ")
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
            name: userName,
            phc: phcName,
            score: final,
            correct: correct,
            total: TOTAL_QUESTIONS
          })
        }).catch(e => console.error(e));
      }

      setPhase("result");
    } else {
      setQIdx((i) => i + 1);
      setPicked(null);
      setMultiPicked([]);
      setMultiSubmitted(false);
    }
  };

  return (
    <main className="min-h-dvh bg-gradient-premium">
      <AppHeader showBack />
      <div className="mx-auto max-w-xl px-4 py-5">
        <AnimatePresence mode="wait">
          {phase === "intro" && <Intro key="i" onStart={start} t={t} />}
          {phase === "playing" && current && (
            <Play
              key={"p" + qIdx}
              multiPicked={multiPicked}
              multiSubmitted={multiSubmitted}
              onMultiSubmit={handleSubmitMulti}
              q={current}
              qIdx={qIdx}
              total={questions.length}
              score={score}
              picked={picked}
              onPick={handlePick}
              onNext={handleNext}
              foodGroupMap={FOOD_GROUP_MAP}
              lang={lang}
              t={t}
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
              lang={lang}
              t={t}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function Intro({ onStart, t }: { onStart: (n: string, p: string) => void; t: (k: any) => string }) {
  const [name, setName] = useState("");
  const [phc, setPhc] = useState("");

  const handleStart = () => {
    if (!name.trim()) {
      alert(t("enterNameAlert"));
      return;
    }
    const state = loadProgress();
    state.userName = name;
    state.phcName = phc;
    saveProgress(state);
    onStart(name, phc);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
      <NutriCompanion message={t("companionIntro")} />
      <div className="rounded-3xl bg-gradient-to-br from-primary to-accent text-primary-foreground p-6 shadow-lg mb-6">
        <div className="text-5xl mb-2" aria-hidden>{"\uD83C\uDF3D\uD83C\uDF5A"}</div>
        <h2 className="text-2xl font-bold">{t("foodGroupQuiz")}</h2>
        <p className="mt-2 text-sm opacity-95">
          {TOTAL_QUESTIONS} {t("quizDesc")}
        </p>
      </div>
      
      <div className="glass rounded-2xl p-5 border-2 border-border/50 mb-6 shadow-sm">
        <h3 className="font-bold mb-4">{t("playerDetails")}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-muted-foreground">{t("yourName")}</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition"
              placeholder={t("namePlaceholder")}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-muted-foreground">{t("villagePHC")}</label>
            <input 
              type="text" 
              value={phc}
              onChange={e => setPhc(e.target.value)}
              className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition"
              placeholder={t("phcPlaceholder")}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl glass border-2 border-secondary/50 p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-secondary">+{POINTS_CORRECT}</div>
          <div className="text-xs text-muted-foreground font-semibold">{t("correctPoints")}</div>
        </div>
        <div className="rounded-2xl glass border-2 border-border/50 p-4 text-center shadow-sm">
          <div className="text-2xl font-bold text-muted-foreground">{POINTS_WRONG}</div>
          <div className="text-xs text-muted-foreground font-semibold">{t("wrongPoints")}</div>
        </div>
      </div>
      <button
        onClick={handleStart}
        className="mt-5 w-full rounded-2xl bg-primary text-primary-foreground py-4 text-lg font-bold shadow-md active:scale-[0.98] min-h-14"
      >
        {"\uD83D\uDE80"} {t("startTraining")}
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
  multiPicked,
  multiSubmitted,
  onPick,
  onNext,
  onMultiSubmit,
  foodGroupMap,
  lang,
  t,
}: {
  q: Question;
  qIdx: number;
  total: number;
  score: number;
  picked: number | null;
  multiPicked: number[];
  multiSubmitted: boolean;
  onPick: (i: number) => void;
  onNext: () => void;
  onMultiSubmit: () => void;
  foodGroupMap: Record<string, { name: string; emoji: string; colorVar: string }>;
  lang: import("@/lib/mddw/translations").Lang;
  t: (k: any) => string;
}) {
  const answered = picked !== null;
  const isCorrect = q.type === "single_food" && picked === q.correctIndex;

  // Dynamic ASHA Companion speech guidance and hints
  let companionMessage = "";
  if (answered || multiSubmitted) {
    if (q.type === "single_food") {
      if (isCorrect) {
        companionMessage = t("hint_correct");
      } else {
        const correctGroupName = foodGroupMap[q.options[q.correctIndex]]?.name ?? q.options[q.correctIndex];
        companionMessage = t("hint_wrong")
          .replace("{food}", getQuizFoodName(q.food, lang))
          .replace("{group}", correctGroupName);
      }
    } else {
      const correctSet = new Set(q.correctIndices);
      const pickedSet = new Set(multiPicked);
      const isPerfect = correctSet.size === pickedSet.size && [...correctSet].every(x => pickedSet.has(x));
      if (isPerfect) {
        companionMessage = t("hint_correct");
      } else {
        const correctGroupNames = q.correctIndices.map(idx => foodGroupMap[q.options[idx]]?.name).join(", ");
        companionMessage = t("hint_wrong")
          .replace("{food}", t(q.scenarioKey))
          .replace("{group}", correctGroupNames);
      }
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* HUD */}
      <div className="flex items-center gap-3 text-sm mb-3">
        <div className="font-bold text-primary">{"\u2B50"} {score}</div>
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
      {q.type === "single_food" ? (
        <motion.div
          key={"s"+qIdx}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-3xl glass border-2 border-border/50 p-6 text-center shadow-lg"
        >
          <div className="text-7xl mb-3" aria-hidden>
            {q.food.emoji}
          </div>
          <div className="text-xs uppercase font-bold text-muted-foreground tracking-wide">
            {t("whichFoodGroup")}
          </div>
          <div className="text-2xl font-bold mt-1">{getQuizFoodName(q.food, lang)}</div>
        </motion.div>
      ) : (
        <motion.div
          key={"c"+qIdx}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="rounded-3xl glass border-2 border-border/50 p-6 text-center shadow-lg"
        >
          <div className="text-xl md:text-2xl font-bold leading-relaxed mb-6">{t(q.scenarioKey as any)}</div>
          <div className="flex justify-center gap-6 mb-6">
            {q.foods.map(f => (
              <div key={f.name} className="flex flex-col items-center gap-2">
                <span className="text-5xl md:text-6xl" aria-hidden>{f.emoji}</span>
                <span className="text-xs font-bold text-muted-foreground uppercase">{getQuizFoodName(f, lang)}</span>
              </div>
            ))}
          </div>
          <div className="text-sm uppercase font-bold text-primary tracking-wide">
              {t((q.customQuestionKey || "scenarioQuestion") as any)}
            </div>
        </motion.div>
      )}

      {/* Options */}
      <div className={`mt-5 grid gap-2.5 grid-cols-1`}>
        {q.options.map((opt, i) => {
          const g = foodGroupMap[opt as string];
          if (!g) return null;
          
          if (q.type === "scenario") {
            const isPicked = multiPicked.includes(i);
            const isRight = q.correctIndices.includes(i);
            let stateClass = "bg-card border-border";
            if (multiSubmitted) {
              if (isRight && isPicked) stateClass = "bg-secondary/20 border-secondary text-foreground";
              else if (isRight && !isPicked) stateClass = "bg-secondary/10 border-secondary border-dashed text-foreground opacity-80";
              else if (!isRight && isPicked) stateClass = "bg-destructive/15 border-destructive text-foreground";
              else stateClass = "bg-card border-border opacity-50";
            } else if (isPicked) {
              stateClass = "bg-primary/10 border-primary border-2 text-foreground";
            }
            
            return (
              <motion.button
                key={opt}
                onClick={() => onPick(i)}
                disabled={multiSubmitted}
                whileTap={!multiSubmitted ? { scale: 0.98 } : undefined}
                className={`rounded-2xl border-2 p-4 text-left min-h-16 flex items-center gap-3 shadow-sm transition ${stateClass}`}
              >
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center shrink-0 ${isPicked ? 'bg-primary border-primary' : 'border-muted-foreground/30'}`}>
                  {isPicked && <div className="w-3 h-3 bg-primary-foreground rounded-sm" />}
                </div>
                <span className="text-2xl shrink-0" aria-hidden>{g.emoji}</span>
                <span className="flex-1 font-bold text-sm leading-tight">{g.name}</span>
                {multiSubmitted && isRight && isPicked && <span className="text-secondary text-xl">{"\u2705"}</span>}
                {multiSubmitted && isRight && !isPicked && <span className="text-secondary/50 text-sm">Missed</span>}
                {multiSubmitted && !isRight && isPicked && <span className="text-destructive text-xl">{"\u274C"}</span>}
              </motion.button>
            );
          }

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
              key={opt}
              onClick={() => onPick(i)}
              disabled={answered}
              whileTap={!answered ? { scale: 0.98 } : undefined}
              animate={answered && isPicked && !isRight ? { x: [0, -6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.35 }}
              className={`rounded-2xl border-2 p-4 text-left min-h-16 flex items-center gap-3 shadow-sm transition ${stateClass}`}
            >
              <span className="text-2xl shrink-0" aria-hidden>{g.emoji}</span>
              <span className="flex-1 font-bold text-sm leading-tight">{g.name}</span>
              {answered && isRight && <span className="text-secondary text-xl">{"\u2705"}</span>}
              {answered && isPicked && !isRight && <span className="text-destructive text-xl">{"\u274C"}</span>}
            </motion.button>
          );
        })}
      </div>

      {q.type === "scenario" && !multiSubmitted && multiPicked.length > 0 && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onMultiSubmit}
          className="mt-6 w-full rounded-2xl bg-primary text-primary-foreground py-4 text-lg font-bold shadow-md active:scale-[0.98] min-h-14"
        >
          {t("submitAnswer" as any)}
        </motion.button>
      )}

      {((q.type === "single_food" && answered) || (q.type === "scenario" && multiSubmitted)) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex flex-col gap-3"
        >
          <NutriCompanion message={companionMessage} compact />
          <div
            className={`rounded-2xl p-4 text-center font-bold ${
              isCorrect
                ? "bg-secondary text-secondary-foreground"
                : "bg-accent text-accent-foreground"
            }`}
          >
            {
    q.type === "scenario" 
      ? (
          (() => {
            const correctSet = new Set(q.correctIndices);
            const pickedSet = new Set(multiPicked);
            const isPerfect = correctSet.size === pickedSet.size && [...correctSet].every(x => pickedSet.has(x));
            return isPerfect ? `\uD83C\uDF89 ${t("correctMsg")}` : `\uD83D\uDCA1 ${t("wrongMsg")} ${q.correctIndices.map(idx => foodGroupMap[q.options[idx]]?.name).join(", ")}`;
          })()
        )
      : (
          isCorrect ? `\uD83C\uDF89 ${t("correctMsg")}` : `\uD83D\uDCA1 ${t("wrongMsg")} ${foodGroupMap[q.options[q.correctIndex]]?.name ?? q.options[q.correctIndex]}`
        )
  }
          </div>
          <button
            onClick={onNext}
            className="mt-3 w-full rounded-2xl bg-primary text-primary-foreground py-4 text-lg font-bold shadow-md active:scale-[0.98] min-h-14"
          >
            {qIdx + 1 >= total ? `${t("seeResults")} \u27A1\uFE0F` : `${t("nextQuestion")} \u27A1\uFE0F`}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

interface CertificateProps {
  userName: string;
  phcName: string;
  score: number;
  pct: number;
  lang: string;
  t: (k: any) => string;
  isPreview?: boolean;
  certificateRef?: React.RefObject<HTMLDivElement | null>;
}

function Certificate({
  userName,
  phcName,
  score,
  pct,
  lang,
  t,
  isPreview = false,
  certificateRef,
}: CertificateProps) {
  const formattedDate = new Date().toLocaleDateString(
    lang === "en" ? "en-US" : lang === "hi" ? "hi-IN" : "te-IN",
    { year: "numeric", month: "long", day: "numeric" }
  );

  const containerClasses = isPreview
    ? "w-full max-w-lg aspect-[4/3] rounded-2xl shadow-xl border-[8px] sm:border-[12px] border-emerald-800 bg-gradient-to-br from-[#faf6eb] via-[#fdfcf7] to-[#f5edd6] p-4 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden text-black font-sans mx-auto"
    : "w-[800px] h-[600px] border-[16px] border-emerald-800 bg-gradient-to-br from-[#faf6eb] via-[#fdfcf7] to-[#f5edd6] p-12 flex flex-col items-center justify-center relative overflow-hidden text-black font-sans";

  const innerBorderClasses = isPreview
    ? "absolute inset-1 sm:inset-2 border border-amber-500/30 rounded-lg sm:rounded-xl pointer-events-none"
    : "absolute inset-3 border-2 border-amber-500/30 pointer-events-none";

  const cornerFlourish = (position: "top-left" | "top-right" | "bottom-left" | "bottom-right") => {
    const classes = {
      "top-left": "top-2 left-2 border-t-2 border-l-2",
      "top-right": "top-2 right-2 border-t-2 border-r-2",
      "bottom-left": "bottom-2 left-2 border-b-2 border-l-2",
      "bottom-right": "bottom-2 right-2 border-b-2 border-r-2",
    }[position];
    const printableClasses = {
      "top-left": "top-4 left-4 border-t-[3px] border-l-[3px]",
      "top-right": "top-4 right-4 border-t-[3px] border-r-[3px]",
      "bottom-left": "bottom-4 left-4 border-b-[3px] border-l-[3px]",
      "bottom-right": "bottom-4 right-4 border-b-[3px] border-r-[3px]",
    }[position];
    return (
      <div
        className={`absolute ${isPreview ? classes : printableClasses} border-amber-500/50 ${
          isPreview ? "w-3 h-3 sm:w-4 sm:h-4" : "w-6 h-6"
        } pointer-events-none`}
      />
    );
  };

  return (
    <div ref={certificateRef} className={containerClasses}>
      {/* Borders and flourishes */}
      <div className={innerBorderClasses} />
      {cornerFlourish("top-left")}
      {cornerFlourish("top-right")}
      {cornerFlourish("bottom-left")}
      {cornerFlourish("bottom-right")}

      {/* Decorative Top Leaf/Crest Icon */}
      <div className={`flex items-center justify-center ${isPreview ? "mb-1 sm:mb-2" : "mb-3"}`}>
        <div
          className={`relative flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 rounded-full shadow-md border border-amber-200 ${
            isPreview ? "w-10 h-10 sm:w-12 sm:h-12" : "w-16 h-16"
          }`}
        >
          <span className={isPreview ? "text-xl sm:text-2xl" : "text-3xl"}>{"\uD83C\uDFC6"}</span>
        </div>
      </div>

      {/* Title & Subtitle */}
      <h1
        className={`font-serif font-extrabold text-emerald-950 tracking-wider uppercase text-center ${
          isPreview ? "text-lg sm:text-2xl mb-0.5" : "text-3xl mb-1"
        }`}
      >
        {t("certificateTitle")}
      </h1>
      <h2
        className={`font-sans font-bold text-amber-700 tracking-wide text-center uppercase ${
          isPreview ? "text-[10px] sm:text-sm mb-3 sm:mb-4" : "text-md mb-6"
        }`}
      >
        {t("certificateSubtitle")}
      </h2>

      {/* Certifies text */}
      <p className={`italic text-gray-500 text-center ${isPreview ? "text-[10px] sm:text-xs mb-1" : "text-sm mb-2"}`}>
        {t("certifiesText")}
      </p>

      {/* Recipient Name */}
      <h3
        className={`font-serif font-black text-gray-900 border-b-2 border-amber-400/50 pb-0.5 px-4 sm:px-8 text-center capitalize tracking-wide ${
          isPreview ? "text-lg sm:text-2xl mb-1 max-w-[280px] sm:max-w-md truncate" : "text-4xl mb-2 px-12"
        }`}
      >
        {userName}
      </h3>

      {/* PHC/Village */}
      {phcName && (
        <p className={`font-semibold text-emerald-800 text-center ${isPreview ? "text-[10px] sm:text-sm mb-3" : "text-md mb-4"}`}>
          ({phcName})
        </p>
      )}

      {/* Completion description */}
      <p
        className={`text-gray-600 text-center leading-relaxed ${
          isPreview ? "text-[10px] sm:text-xs max-w-[280px] sm:max-w-xs mb-4" : "text-sm max-w-md mb-8"
        }`}
      >
        {t("completedText")}
      </p>

      {/* Footer Column Section */}
      <div className={`flex justify-between items-center w-full ${isPreview ? "max-w-[280px] sm:max-w-xs mt-1 px-2" : "max-w-md mt-4 px-4"}`}>
        {/* Date */}
        <div className="text-center flex-1">
          <div
            className={`font-serif font-bold text-gray-800 border-b border-gray-300 pb-0.5 mb-0.5 ${
              isPreview ? "text-[9px] sm:text-xs" : "text-sm"
            }`}
          >
            {formattedDate}
          </div>
          <div className={`text-gray-400 uppercase tracking-wider font-semibold ${isPreview ? "text-[8px]" : "text-[10px]"}`}>
            {t("dateLabel")}
          </div>
        </div>

        {/* Seal */}
        <div className="flex-1 flex justify-center">
          <div
            className={`relative bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 rounded-full shadow-lg border border-amber-200 flex items-center justify-center ${
              isPreview ? "w-10 h-10 sm:w-12 sm:h-12" : "w-16 h-16"
            }`}
          >
            <span className={isPreview ? "text-lg sm:text-xl" : "text-2xl"}>{"\uD83C\uDF96\uFE0F"}</span>
          </div>
        </div>

        {/* Signature */}
        <div className="text-center flex-1">
          <div
            className={`font-serif italic text-emerald-800 font-semibold border-b border-gray-300 pb-0.5 mb-0.5 ${
              isPreview ? "text-[9px] sm:text-xs" : "text-sm"
            }`}
          >
            {"\u2728"} Janani Mitra
          </div>
          <div className={`text-gray-400 uppercase tracking-wider font-semibold ${isPreview ? "text-[8px]" : "text-[10px]"}`}>
            Program Coordinator
          </div>
        </div>
      </div>
    </div>
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
  lang,
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
  lang: string;
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
      link.download = `MDDW_Certificate_${userName.replace(/\s+/g, "_")}.png`;
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
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-4">
      <NutriCompanion message={passed ? t("companionResultPass") : t("companionResultFail")} />
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
          {passed ? "\uD83C\uDF89\uD83C\uDFC6" : "\uD83D\uDCAA\uD83D\uDCDA"}
        </motion.div>
        <h2 className="text-2xl font-bold">{passed ? t("greatWork") : t("keepPracticing")}</h2>
        <div className="mt-2 text-3xl tracking-widest">
          {"\u2B50".repeat(stars) + "\u2606".repeat(3 - stars)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <Stat label={t("finalScore")} value={score} accent />
        <Stat label={t("accuracy")} value={`${pct}%`} accent />
        <Stat label={t("correctAnswers")} value={`${correct}/${total}`} />
        <Stat label={t("wrongAnswers")} value={`${wrong}/${total}`} />
      </div>

      {mistakes.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold text-lg mb-3">{t("reviewMistakes")}</h3>
          <div className="space-y-3">
            {mistakes.map((m, i) => (
              <div key={i} className="bg-card border-2 border-border rounded-xl p-3 text-sm">
                <div className="font-semibold text-base mb-1">{m.question}</div>
                <div className="text-destructive mb-0.5">{"\u274C"} {t("youAnswered")} {m.userAnswer}</div>
                <div className="text-secondary">{"\u2705"} {t("correctAnswer")} {m.correctAnswer}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {true && (
        <div className="mt-6 border-t-2 border-border pt-6">
          <h3 className="font-bold text-lg mb-4 text-center text-primary">
            {"\uD83C\uDFC5"} {t("certificatePreview" as any) || "Your Certificate"}
          </h3>
          
          {/* Certificate Live Preview */}
          <div className="mb-4">
            <Certificate
              userName={userName}
              phcName={phcName}
              score={score}
              pct={pct}
              lang={lang}
              t={t}
              isPreview={true}
            />
          </div>
          
          {/* Download Button */}
          <button
            onClick={downloadCertificate}
            className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white py-4 font-bold min-h-14 active:scale-[0.98] shadow-md flex items-center justify-center gap-2 transition-colors"
          >
            <span className="text-xl">{"\uD83D\uDCE5"}</span> {t("downloadCertificate")}
          </button>
          
          {/* Hidden Certificate DOM for html2canvas */}
          <div className="absolute top-[-9999px] left-[-9999px] pointer-events-none">
            <Certificate
              userName={userName}
              phcName={phcName}
              score={score}
              pct={pct}
              lang={lang}
              t={t}
              isPreview={false}
              certificateRef={certificateRef}
            />
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-col gap-2">
        <button
          onClick={onAgain}
          className="rounded-2xl bg-primary text-primary-foreground py-4 font-bold min-h-14 active:scale-[0.98]"
        >
          {"\uD83D\uDD01"} {t("playAgain")}
        </button>
        <Link
          to="/learn"
          className="rounded-2xl bg-card border-2 border-border text-foreground py-4 font-bold min-h-14 text-center active:scale-[0.98]"
        >
          {"\uD83D\uDCD6"} {t("reviewFoodGroups")}
        </Link>
        <Link
          to="/"
          className="rounded-2xl bg-muted text-foreground py-3 font-semibold text-center min-h-12 active:scale-[0.98]"
        >
          {"\uD83C\uDFE0"} {t("home")}
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

// Force trigger HMR
