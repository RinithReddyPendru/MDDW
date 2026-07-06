import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useRef, useEffect } from "react";
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
import { Certificate } from "@/components/mddw/Certificate";
import { PROBING_SCENARIOS, type ProbingScenarioData } from "@/lib/mddw/probingScenarios";
import { IMAGE_SCENARIOS, type ImageScenarioData } from "@/lib/mddw/imageScenarios";


function FallbackImage({ src, alt, className, fallbackEmoji, fallbackClassName }: { src: string, alt: string, className: string, fallbackEmoji: string, fallbackClassName: string }) {
  const [error, setError] = useState(false);
  if (error || !src) {
    return <div className={fallbackClassName} aria-hidden>{fallbackEmoji}</div>;
  }
  return (
    <img 
      src={src} 
      alt={alt} 
      className={className}
      onError={() => setError(true)}
    />
  );
}

export const Route = createFileRoute("/game")({
  head: () => ({
    meta: [
      { title: "MDDW Quiz Challenge" },
      { name: "description", content: "Interactive MDD-W Training." },
    ],
  }),
  component: GamePage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      mode: search.mode as string || 'image',
    }
  },
});

type GameMode = "standard" | "counseling" | "visual";

export type Question =
  | { type: "single_food"; food: QuizFood; options: FoodGroupId[]; correctIndex: number; }
  | { type: "scenario"; scenarioKey: string; customQuestionKey?: string; foods: QuizFood[]; options: FoodGroupId[]; correctIndices: number[]; }
  | { type: "image_dish"; data: ImageScenarioData; options: FoodGroupId[]; correctIndices: number[]; }
  | { type: "probing_scenario"; data: ProbingScenarioData; };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildQuestions(mode: GameMode, FOOD_GROUPS: ReturnType<typeof getFoodGroups>): Question[] {
  const allGroupIds = FOOD_GROUPS.map(g => g.id);

  if (mode === "counseling") {
    const keys = shuffle(Object.keys(PROBING_SCENARIOS)).slice(0, 5);
    return keys.map(k => ({ type: "probing_scenario", data: PROBING_SCENARIOS[k] }));
  }
  
  if (mode === "visual") {
    const imgs = shuffle(IMAGE_SCENARIOS).slice(0, 5);
    return imgs.map(img => ({
      type: "image_dish",
      data: img,
      options: allGroupIds,
      correctIndices: allGroupIds.map((id, i) => img.correctGroups.includes(id) ? i : -1).filter(i => i !== -1)
    }));
  }

  // standard mode
  const foods = shuffle(QUIZ_FOODS).slice(0, 8);
  const normalQs: Question[] = foods.map((food) => {
    const distractors = shuffle(
      allGroupIds.filter((id) => id !== food.group)
    ).slice(0, 3);
    const opts = shuffle([food.group, ...distractors]);
    return {
      type: "single_food",
      food,
      options: opts,
      correctIndex: opts.indexOf(food.group),
    };
  });

  const s1Foods = [QUIZ_FOODS.find(f => f.name === "Rice")!, QUIZ_FOODS.find(f => f.name === "Toor Dal")!, QUIZ_FOODS.find(f => f.name === "Palak")!];
  const s1Groups: FoodGroupId[] = ["grains", "pulses", "dglv"];
  const s1Distractors = shuffle(allGroupIds.filter(id => !s1Groups.includes(id))).slice(0, 3);
  const s1Opts = shuffle([...s1Groups, ...s1Distractors]);
  const s1Correct = s1Opts.map((id, i) => s1Groups.includes(id) ? i : -1).filter(i => i !== -1);
  
  const s2Foods = [QUIZ_FOODS.find(f => f.name === "Chapati / Roti")!, QUIZ_FOODS.find(f => f.name === "Boiled Egg")!, QUIZ_FOODS.find(f => f.name === "Milk")!];
  const s2Groups: FoodGroupId[] = ["grains", "eggs", "dairy"];
  const s2Distractors = shuffle(allGroupIds.filter(id => !s2Groups.includes(id))).slice(0, 3);
  const s2Opts = shuffle([...s2Groups, ...s2Distractors]);
  const s2Correct = s2Opts.map((id, i) => s2Groups.includes(id) ? i : -1).filter(i => i !== -1);

  const scenarios: Question[] = [
    { type: "scenario", scenarioKey: "scenarioKamala", foods: s1Foods, options: s1Opts, correctIndices: s1Correct },
    { type: "scenario", scenarioKey: "scenarioRani", foods: s2Foods, options: s2Opts, correctIndices: s2Correct },
  ];

  return [...normalQs, ...scenarios].slice(0, 10);
}

function GamePage() {
  const { t, lang } = useLang();
  const FOOD_GROUPS = getFoodGroups(lang);
  const FOOD_GROUP_MAP = Object.fromEntries(FOOD_GROUPS.map((g) => [g.id, g])) as any;
  const modeSequence: GameMode[] = ["standard", "counseling", "visual"];
  
  // Load saved round progress (so ASHAs can resume from where they left off)
  const savedProgress = typeof window !== "undefined" ? loadProgress() : null;
  const resumeIndex = savedProgress?.savedRoundIndex ?? 0;
  
  const [phase, setPhase] = useState<"playing" | "result">("playing");
  const [currentModeIndex, setCurrentModeIndex] = useState(resumeIndex);
  
  // Initialize game state — resume from saved round if available
  const [questions, setQuestions] = useState<Question[]>(() => buildQuestions(modeSequence[resumeIndex] || "standard", FOOD_GROUPS));
  
  const [qIdx, setQIdx] = useState(0);
  const [standardScore, setStandardScore] = useState(savedProgress?.savedStandardScore ?? 0);
  const [counselingScore, setCounselingScore] = useState(savedProgress?.savedCounselingScore ?? 0);
  const [visualScore, setVisualScore] = useState(savedProgress?.savedVisualScore ?? 0);
  const [correct, setCorrect] = useState(savedProgress?.savedCorrect ?? 0);
  const [wrong, setWrong] = useState(savedProgress?.savedWrong ?? 0);
  
  const [mistakes, setMistakes] = useState<{question: string, userAnswer: string, correctAnswer: string}[]>(savedProgress?.savedMistakes ?? []);
  
  // Load user details from storage on init
  const [userName] = useState(() => {
    if (typeof window === "undefined") return "";
    return loadProgress().userName || "";
  });
  const [phoneNumber] = useState(() => {
    if (typeof window === "undefined") return "";
    return loadProgress().phoneNumber || "";
  });
  const [phcName] = useState(() => {
    if (typeof window === "undefined") return "";
    return loadProgress().phcName || "";
  });

  const handleNextQuestion = (pts: number, c: number, w: number, m: any[]) => {
    try {

    const activeMode = modeSequence[currentModeIndex];
    if (activeMode === "standard") setStandardScore(s => s + pts);
    else if (activeMode === "counseling") setCounselingScore(s => s + pts);
    else if (activeMode === "visual") setVisualScore(s => s + pts);
    
    setCorrect(prev => prev + c);
    setWrong(prev => prev + w);
    setMistakes(prev => [...prev, ...m]);
    
    if (qIdx + 1 >= questions.length) {
      if (currentModeIndex + 1 < modeSequence.length) {
        const nextModeIdx = currentModeIndex + 1;
        const nextMode = modeSequence[nextModeIdx];
        setCurrentModeIndex(nextModeIdx);
        setQuestions(buildQuestions(nextMode, FOOD_GROUPS));
        setQIdx(0);
        
        // Save round progress so ASHAs can resume if they close the app
        const pState = loadProgress();
        pState.savedRoundIndex = nextModeIdx;
        pState.savedStandardScore = activeMode === "standard" ? standardScore + pts : standardScore;
        pState.savedCounselingScore = activeMode === "counseling" ? counselingScore + pts : counselingScore;
        pState.savedVisualScore = activeMode === "visual" ? visualScore + pts : visualScore;
        pState.savedCorrect = correct + c;
        pState.savedWrong = wrong + w;
        pState.savedMistakes = [...mistakes, ...m];
        saveProgress(pState);
      } else {
        const finalStandard = activeMode === "standard" ? standardScore + pts : standardScore;
        const finalCounseling = activeMode === "counseling" ? counselingScore + pts : counselingScore;
        const finalVisual = activeMode === "visual" ? visualScore + pts : visualScore;
        const finalScore = finalStandard + finalCounseling + finalVisual;

        recordResult({
          level: 1,
          score: finalScore,
          correct: correct + c,
          wrong: wrong + w,
          groupsConsumed: 0,
          passedMDDW: finalScore >= 16,
          date: Date.now(),
          userName,
          phcName,
          phoneNumber,
          mistakes: [...mistakes, ...m]
        });
        
        // Mark training as completely finished and clear saved round
        const pState = loadProgress();
        pState.hasCompletedTraining = true;
        pState.savedRoundIndex = undefined;
        pState.savedStandardScore = undefined;
        pState.savedCounselingScore = undefined;
        pState.savedVisualScore = undefined;
        pState.savedCorrect = undefined;
        pState.savedWrong = undefined;
        pState.savedMistakes = undefined;
        saveProgress(pState);
        
        if (pState.sheetsWebhookUrl && typeof window !== "undefined") {
          fetch(pState.sheetsWebhookUrl, {
            method: "POST",
            mode: "no-cors",
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify({
              name: userName,
              phc: phcName,
              phone: phoneNumber,
              standard_score: finalStandard,
              counseling_score: finalCounseling,
              visual_score: finalVisual,
              total: 20
            })
          }).catch(e => console.error(e));
        }
        setPhase("result");
      }
    } else {
      setQIdx(i => i + 1);
    }
    } catch (e: any) {
      alert("Error transitioning: " + e.message);
      console.error(e);
    }
  };

  const current = questions[qIdx];

  return (
    <main 
      className="min-h-dvh flex flex-col bg-cover bg-center relative"
      style={{ backgroundImage: 'url("/game_hero.png")' }}
    >
      <div className="absolute inset-0 bg-background/85 backdrop-blur-2xl z-0" />
      <div className="relative z-10 flex flex-col h-full w-full">
        <AppHeader showBack />
        <div className="mx-auto max-w-xl px-4 py-5 w-full">
        <AnimatePresence mode="wait">
          {phase === "playing" && !current && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="text-5xl animate-bounce">🍽️</div>
              <p className="text-muted-foreground font-medium">{t("loading") || "Loading questions..."}</p>
            </motion.div>
          )}
          {phase === "playing" && current && current.type === "probing_scenario" && (
            <PlayProbing key={"p" + qIdx} q={current as any} qIdx={qIdx} total={questions.length} onNext={handleNextQuestion} t={t} lang={lang} foodGroupMap={FOOD_GROUP_MAP} allGroups={FOOD_GROUPS} />
          )}
          {phase === "playing" && current && current.type === "image_dish" && (
            <PlayImageDish key={"p" + qIdx} q={current as any} qIdx={qIdx} total={questions.length} onNext={handleNextQuestion} foodGroupMap={FOOD_GROUP_MAP} t={t} />
          )}
          {phase === "playing" && current && (current.type === "single_food" || current.type === "scenario") && (
            <Play key={"p" + qIdx} q={current as any} qIdx={qIdx} total={questions.length} onNext={handleNextQuestion} foodGroupMap={FOOD_GROUP_MAP} lang={lang} t={t} />
          )}
          {phase === "result" && (
            <Result key="res" standardScore={standardScore} counselingScore={counselingScore} visualScore={visualScore} correct={correct} wrong={wrong} total={20} mistakes={mistakes} userName={userName} phcName={phcName} lang={lang} t={t} />
          )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

function Intro({ onStart, t }: { onStart: (n: string, p: string, phone: string) => void; t: (k: any) => string }) {
  const [name, setName] = useState("");
  const [phc, setPhc] = useState("");
  const [phone, setPhone] = useState("");


  const handleStart = () => {
    if (!name.trim()) return alert(t("enterNameAlert"));
    if (!phone.trim()) return alert(t("whatsappAlert"));
    
    const state = loadProgress();
    state.userName = name;
    state.phcName = phc;
    saveProgress(state);
    onStart(name, phc, phone);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
      <NutriCompanion message={t("companionIntro")} />
      
      <div className="glass rounded-2xl p-5 border-2 border-border/50 mb-4 shadow-sm text-center">
        <h3 className="font-bold text-lg mb-2">Grand Challenge</h3>
        <p className="text-sm text-muted-foreground">Complete 3 rounds of challenges to earn your MDD-W certification.</p>
        <div className="flex gap-2 justify-center mt-3 text-xs font-semibold">
          <span className="bg-primary/10 text-primary px-3 py-1 rounded-full">📚 Standard</span>
          <span className="bg-secondary/10 text-secondary px-3 py-1 rounded-full">🗣️ Counseling</span>
          <span className="bg-blue-500/10 text-blue-500 px-3 py-1 rounded-full">📸 Real Meals</span>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 border-2 border-border/50 mb-2 shadow-sm">
        <h3 className="font-bold mb-4">{t("playerDetails")}</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1 text-muted-foreground">{t("whatsappLabel")}</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition" placeholder={t("whatsappPlaceholder") as string} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-muted-foreground">{t("yourName")}</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition" placeholder={t("namePlaceholder")} />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1 text-muted-foreground">{t("villagePHC")}</label>
            <input type="text" value={phc} onChange={e => setPhc(e.target.value)} className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition" placeholder={t("phcPlaceholder")} />
          </div>
        </div>
      </div>

      <button onClick={handleStart} className="mt-3 w-full rounded-2xl bg-primary text-primary-foreground py-4 text-lg font-bold shadow-md active:scale-[0.98] min-h-14">
        🚀 Start Training
      </button>
    </motion.div>
  );
}

function Play({ q, qIdx, total, onNext, foodGroupMap, lang, t }: any) {
  const [picked, setPicked] = useState<number | null>(null);
  const [multiPicked, setMultiPicked] = useState<number[]>([]);
  const [multiSubmitted, setMultiSubmitted] = useState(false);
  
  const answered = picked !== null;
  const isCorrect = q.type === "single_food" && picked === q.correctIndex;
  
  let companionMessage = "";
  if (answered || multiSubmitted) {
    if (q.type === "single_food") {
      companionMessage = isCorrect ? t("hint_correct") : t("hint_wrong").replace("{food}", getQuizFoodName(q.food, lang)).replace("{group}", foodGroupMap[q.options[q.correctIndex]]?.name);
    } else {
      const correctSet = new Set(q.correctIndices);
      const pickedSet = new Set(multiPicked);
      const isPerfect = correctSet.size === pickedSet.size && [...correctSet].every(x => pickedSet.has(x as number));
      companionMessage = isPerfect ? t("hint_correct") : `${t("wrongMsg")} ${q.correctIndices.map((idx:any) => foodGroupMap[q.options[idx]]?.name).join(", ")}`;
    }
  }

  const handlePick = (i: number) => {
    if (q.type === "scenario") {
      if (multiSubmitted) return;
      playPop();
      setMultiPicked(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
      return;
    }
    if (picked !== null) return;
    setPicked(i);
    const ok = i === q.correctIndex;
    if (ok) playSuccess(); else playFailure();
  };

  const submitMulti = () => {
    if (multiSubmitted || q.type !== "scenario") return;
    setMultiSubmitted(true);
    const correctSet = new Set(q.correctIndices);
    const pickedSet = new Set(multiPicked);
    const isPerfect = correctSet.size === pickedSet.size && [...correctSet].every(x => pickedSet.has(x as number));
    if (isPerfect) playSuccess(); else playFailure();
  };

  const finish = () => {
    if (q.type === "single_food") {
      if (isCorrect) onNext(1, 1, 0, []);
      else onNext(0, 0, 1, [{ question: getQuizFoodName(q.food, lang), userAnswer: foodGroupMap[q.options[picked!]]?.name, correctAnswer: foodGroupMap[q.options[q.correctIndex]]?.name }]);
    } else {
      const correctSet = new Set(q.correctIndices);
      const pickedSet = new Set(multiPicked);
      const isPerfect = correctSet.size === pickedSet.size && [...correctSet].every(x => pickedSet.has(x as number));
      if (isPerfect) onNext(1, 1, 0, []);
      else onNext(0, 0, 1, [{ question: t(q.scenarioKey), userAnswer: multiPicked.map(i => foodGroupMap[q.options[i]]?.name).join(", "), correctAnswer: q.correctIndices.map((i:any) => foodGroupMap[q.options[i]]?.name).join(", ") }]);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-3">
         <div className="font-bold text-primary text-sm tracking-widest uppercase">Standard Round</div>
         <div className="text-muted-foreground text-sm">Q {qIdx + 1} / {total}</div>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden mb-5">
        <motion.div className="h-full bg-primary" initial={{ width: 0 }} animate={{ width: `${((qIdx + 1) / total) * 100}%` }} transition={{ duration: 0.4 }} />
      </div>

      {q.type === "single_food" ? (
        <div className="rounded-3xl glass border-2 border-border/50 p-6 text-center shadow-lg">
          {q.food.imagePath ? (
            <FallbackImage src={`${import.meta.env.BASE_URL || '/'}${q.food.imagePath.replace(/^\//, '')}`} alt={getQuizFoodName(q.food, lang)} className="w-32 h-32 object-cover rounded-full mx-auto mb-3 shadow-md border-4 border-white bg-white" fallbackEmoji={q.food.emoji} fallbackClassName="text-7xl mb-3" />
          ) : (
            <div className="text-7xl mb-3" aria-hidden>{q.food.emoji}</div>
          )}
          <div className="text-xs uppercase font-bold text-muted-foreground">{t("whichFoodGroup")}</div>
          <div className="text-2xl font-bold mt-1">{getQuizFoodName(q.food, lang)}</div>
        </div>
      ) : (
        <div className="rounded-3xl glass border-2 border-border/50 p-6 text-center shadow-lg">
          <div className="text-xl md:text-2xl font-bold mb-6">{t(q.scenarioKey)}</div>
          <div className="flex justify-center gap-6 mb-6">
            {q.foods.map((f:any) => (
              <div key={f.name} className="flex flex-col items-center gap-2">
                {f.imagePath ? (
                  <FallbackImage src={`${import.meta.env.BASE_URL || '/'}${f.imagePath.replace(/^\//, '')}`} alt={getQuizFoodName(f, lang)} className="w-20 h-20 object-cover rounded-full shadow-sm border-2 border-white bg-white" fallbackEmoji={f.emoji} fallbackClassName="text-5xl" />
                ) : (
                  <span className="text-5xl" aria-hidden>{f.emoji}</span>
                )}
                <span className="text-xs font-bold text-muted-foreground uppercase">{getQuizFoodName(f, lang)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 grid gap-2.5 grid-cols-1">
        {q.options.map((opt:any, i:number) => {
          const g = foodGroupMap[opt];
          if (!g) return null;
          if (q.type === "scenario") {
            const isPicked = multiPicked.includes(i);
            const isRight = q.correctIndices.includes(i);
            let stateClass = "bg-card border-border";
            if (multiSubmitted) {
              if (isRight && isPicked) stateClass = "bg-secondary/20 border-secondary";
              else if (isRight && !isPicked) stateClass = "bg-secondary/10 border-secondary border-dashed opacity-80";
              else if (!isRight && isPicked) stateClass = "bg-destructive/15 border-destructive";
              else stateClass = "bg-card border-border opacity-50";
            } else if (isPicked) stateClass = "bg-primary/10 border-primary border-2";
            return (
              <button key={opt} onClick={() => handlePick(i)} disabled={multiSubmitted} className={`rounded-2xl border-2 p-4 text-left flex items-center gap-3 transition ${stateClass}`}>
                <span className="text-2xl" aria-hidden>{g.emoji}</span>
                <span className="flex-1 font-bold">{g.name}</span>
                {multiSubmitted && isRight && isPicked && <span className="text-secondary text-xl">✅</span>}
                {multiSubmitted && !isRight && isPicked && <span className="text-destructive text-xl">❌</span>}
              </button>
            );
          } else {
            const isPicked = picked === i;
            const isRight = i === q.correctIndex;
            let stateClass = "bg-card border-border";
            if (answered) {
              if (isRight) stateClass = "bg-secondary/15 border-secondary";
              else if (isPicked) stateClass = "bg-destructive/15 border-destructive";
              else stateClass = "bg-card border-border opacity-60";
            }
            return (
              <button key={opt} onClick={() => handlePick(i)} disabled={answered} className={`rounded-2xl border-2 p-4 text-left flex items-center gap-3 transition ${stateClass}`}>
                <span className="text-2xl" aria-hidden>{g.emoji}</span>
                <span className="flex-1 font-bold">{g.name}</span>
                {answered && isRight && <span className="text-secondary text-xl">✅</span>}
                {answered && isPicked && !isRight && <span className="text-destructive text-xl">❌</span>}
              </button>
            );
          }
        })}
      </div>

      {q.type === "scenario" && !multiSubmitted && multiPicked.length > 0 && (
        <button onClick={submitMulti} className="mt-6 w-full rounded-2xl bg-primary text-primary-foreground py-4 text-lg font-bold">{t("submitAnswer")}</button>
      )}

      {((q.type === "single_food" && answered) || (q.type === "scenario" && multiSubmitted)) && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex flex-col gap-3">
          <NutriCompanion message={companionMessage} compact />
          <button onClick={finish} className="w-full rounded-2xl bg-primary text-primary-foreground py-4 text-lg font-bold">{t("next")}</button>
        </motion.div>
      )}
    </motion.div>
  );
}

function PlayImageDish({ q, qIdx, total, onNext, foodGroupMap, t }: any) {
  const [multiPicked, setMultiPicked] = useState<number[]>([]);
  const [multiSubmitted, setMultiSubmitted] = useState(false);
  const isRight = (i: number) => q.correctIndices.includes(i);
  
  const handlePick = (i: number) => {
    if (multiSubmitted) return;
    playPop();
    setMultiPicked(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]);
  };
  
  const submitMulti = () => {
    if (multiSubmitted) return;
    setMultiSubmitted(true);
    const correctSet = new Set(q.correctIndices);
    const pickedSet = new Set(multiPicked);
    const isPerfect = correctSet.size === pickedSet.size && [...correctSet].every(x => pickedSet.has(x as number));
    if (isPerfect) playSuccess(); else playFailure();
  };

  const finish = () => {
    const correctSet = new Set(q.correctIndices);
    const pickedSet = new Set(multiPicked);
    const isPerfect = correctSet.size === pickedSet.size && [...correctSet].every(x => pickedSet.has(x as number));
    
    if (isPerfect) onNext(1, 1, 0, []);
    else onNext(0, 0, 1, [{ question: q.data.dishNameKey, userAnswer: multiPicked.map(i => foodGroupMap[q.options[i]]?.name).join(", "), correctAnswer: q.correctIndices.map((i:any) => foodGroupMap[q.options[i]]?.name).join(", ") }]);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="flex items-center justify-between mb-3">
         <div className="font-bold text-blue-500 text-sm tracking-widest uppercase">Visual Round</div>
         <div className="text-muted-foreground text-sm">Q {qIdx + 1} / {total}</div>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden mb-5">
        <motion.div className="h-full bg-blue-500" initial={{ width: 0 }} animate={{ width: `${((qIdx + 1) / total) * 100}%` }} transition={{ duration: 0.4 }} />
      </div>

      <div className="rounded-3xl glass border-2 border-border/50 overflow-hidden shadow-lg mb-5 relative">
        <div className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold uppercase backdrop-blur-sm z-10">
          Real-Life Meal
        </div>
        <img src={`${import.meta.env.BASE_URL || '/'}${q.data.imagePath.replace(/^\//, '')}`} alt="Meal" className="w-full h-64 object-cover object-center" />
        <div className="p-4 bg-card">
          <h3 className="font-bold text-lg mb-1">What food groups can you spot?</h3>
          <p className="text-sm text-muted-foreground">Select all that apply.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {q.options.map((opt:any, i:number) => {
          const g = foodGroupMap[opt];
          if (!g) return null;
          const isPicked = multiPicked.includes(i);
          const right = isRight(i);
          let stateClass = "bg-card border-border";
          if (multiSubmitted) {
            if (right && isPicked) stateClass = "bg-secondary/20 border-secondary text-foreground";
            else if (right && !isPicked) stateClass = "bg-secondary/10 border-secondary border-dashed text-foreground opacity-80";
            else if (!right && isPicked) stateClass = "bg-destructive/15 border-destructive text-foreground";
            else stateClass = "bg-card border-border opacity-50";
          } else if (isPicked) stateClass = "bg-blue-500/10 border-blue-500 border-2 text-foreground";
          
          return (
            <button key={opt} onClick={() => handlePick(i)} disabled={multiSubmitted} className={`rounded-2xl border-2 p-3 text-left flex items-center gap-2 transition ${stateClass}`}>
              <span className="text-xl" aria-hidden>{g.emoji}</span>
              <span className="flex-1 font-bold text-xs leading-tight">{g.name}</span>
            </button>
          );
        })}
      </div>

      {!multiSubmitted && multiPicked.length > 0 && (
        <button onClick={submitMulti} className="mt-6 w-full rounded-2xl bg-blue-500 text-white py-4 text-lg font-bold shadow-md">{t("submitAnswer")}</button>
      )}

      {multiSubmitted && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 flex flex-col gap-3">
          <button onClick={finish} className="w-full rounded-2xl bg-blue-500 text-white py-4 text-lg font-bold shadow-md">{t("next")}</button>
        </motion.div>
      )}
    </motion.div>
  );
}

function PlayProbing({ q, qIdx, total, onNext, t, lang, foodGroupMap, allGroups }: any) {
  const data = q.data;
  const [stepId, setStepId] = useState(data.firstStepId);
  const [discovered, setDiscovered] = useState(data.initialDiscovered);
  const [finished, setFinished] = useState(false);
  
  // Scoring
  const [earnedPoints, setEarnedPoints] = useState(20);
  const [wrongCount, setWrongCount] = useState(0);
  const [mistakes, setMistakes] = useState<any[]>([]);

  // Suggestion Step State
  const [suggestStep, setSuggestStep] = useState(false);
  const [suggestOptions, setSuggestOptions] = useState<any[]>([]);

  // Chat History
  type ChatMessage = { id: string; sender: 'mother' | 'user'; text: string; isFeedback?: boolean };
  const [chat, setChat] = useState<ChatMessage[]>([
    { id: 'm0', sender: 'mother', text: t(data.steps[data.firstStepId].motherText) }
  ]);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chat]);

  const currentStep = data.steps[stepId];

  const handleOption = (opt: any) => {
    // Add user's choice to chat
    setChat(prev => [...prev, { id: 'u' + Date.now(), sender: 'user', text: t(opt.text) }]);

    if (opt.feedback && !opt.isCorrect) {
      playFailure();
      setEarnedPoints(p => Math.max(0, p - 5));
      setWrongCount(w => w + 1);
      setMistakes(m => [...m, { question: t(currentStep.motherText), userAnswer: t(opt.text), correctAnswer: "Explore other options" }]);
      
      const fbk = t(opt.feedback) !== opt.feedback ? t(opt.feedback) : opt.feedback;
      setTimeout(() => {
        setChat(prev => [...prev, { id: 'm' + Date.now(), sender: 'mother', text: fbk, isFeedback: true }]);
      }, 500);
      return;
    }
    
    playSuccess();
    
    let newDiscovered = [...discovered];
    if (opt.discoveredGroups) {
      newDiscovered = [...newDiscovered, ...opt.discoveredGroups];
      setDiscovered(newDiscovered);
    }
    
    if (opt.nextStepId) {
      setStepId(opt.nextStepId);
      setTimeout(() => {
        setChat(prev => [...prev, { id: 'm' + Date.now(), sender: 'mother', text: t(data.steps[opt.nextStepId].motherText) }]);
      }, 500);
    } else if (opt.isCorrect) {
      const uniqueGroupIds = Array.from(new Set(newDiscovered.map(g => g.id)));
      if (uniqueGroupIds.length < 5) {
        const missingGroups = allGroups.filter((g:any) => !uniqueGroupIds.includes(g.id));
        const presentGroups = allGroups.filter((g:any) => uniqueGroupIds.includes(g.id));
        
        const correctOpt = missingGroups[Math.floor(Math.random() * missingGroups.length)];
        const distractors = [...presentGroups].sort(() => 0.5 - Math.random()).slice(0, 2);
        if (distractors.length < 2) {
           const otherMissing = missingGroups.filter((g:any) => g.id !== correctOpt.id).sort(() => 0.5 - Math.random()).slice(0, 2 - distractors.length);
           distractors.push(...otherMissing);
        }
        
        const opts = [
           { group: correctOpt, isCorrect: true },
           { group: distractors[0], isCorrect: false },
           { group: distractors[1], isCorrect: false }
        ].sort(() => 0.5 - Math.random());
        
        setSuggestOptions(opts);
        setSuggestStep(true);
        setTimeout(() => {
          setChat(prev => [...prev, { id: 'm' + Date.now(), sender: 'mother', text: t("suggest_prompt") !== "suggest_prompt" ? t("suggest_prompt") : "It seems the mother only ate a few foods. What additional food group could you suggest to her to improve her diet?", isFeedback: true }]);
        }, 500);
      } else {
        setFinished(true);
        setTimeout(() => {
          setChat(prev => [...prev, { id: 'm' + Date.now(), sender: 'mother', text: t(data.finalLesson) }]);
        }, 500);
      }
    }
  };
  
  const handleSuggestPick = (opt: any) => {
    setChat(prev => [...prev, { id: 'u' + Date.now(), sender: 'user', text: opt.group.name }]);
    
    if (opt.isCorrect) {
      playSuccess();
      setFinished(true);
      setSuggestStep(false);
      setDiscovered([...discovered, { id: opt.group.id, name: opt.group.name, emoji: opt.group.emoji }]);
      setTimeout(() => {
        setChat(prev => [...prev, { id: 'm' + Date.now(), sender: 'mother', text: t(data.finalLesson) }]);
      }, 500);
    } else {
      playFailure();
      setEarnedPoints(p => Math.max(0, p - 5));
      setWrongCount(w => w + 1);
      setMistakes(m => [...m, { question: "Suggest a missing food group", userAnswer: opt.group.name, correctAnswer: "A food group she hasn't eaten yet" }]);
      setTimeout(() => {
        setChat(prev => [...prev, { id: 'm' + Date.now(), sender: 'mother', text: t("suggest_wrong") !== "suggest_wrong" ? t("suggest_wrong") : "Not quite! Try suggesting a food group she missed.", isFeedback: true }]);
      }, 500);
    }
  };

  const getT = (key: string, fallback: string) => {
    const val = t(key as any);
    return val === key ? fallback : val;
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full min-h-[400px]">
      <div className="flex items-center justify-between mb-3 shrink-0">
         <div className="font-bold text-purple-600 text-sm tracking-widest uppercase">{getT('modeCounseling', 'Counseling Practice')}</div>
         <div className="text-muted-foreground text-sm">Q {qIdx + 1} / {total}</div>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden mb-4 shrink-0">
        <motion.div className="h-full bg-purple-600" initial={{ width: 0 }} animate={{ width: `${((qIdx + 1) / total) * 100}%` }} transition={{ duration: 0.4 }} />
      </div>

      <div className="flex-1 overflow-hidden flex flex-col glass rounded-3xl border-2 border-border/50 mb-4 shadow-sm relative" style={{ minHeight: '300px' }}>
        <div className="p-3 border-b-2 border-border/50 bg-card flex flex-col gap-3 shrink-0 z-10">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-xl shadow-inner">
               {data.avatarIcon}
             </div>
             <div>
               <div className="font-bold text-sm leading-tight">{data.motherName}</div>
               <div className="text-xs text-muted-foreground">Mother</div>
             </div>
           </div>
           
           {discovered.length > 0 && (
             <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide w-full">
               <AnimatePresence>
                 {discovered.map((g: any, i: number) => {
                   const translatedG = foodGroupMap[g.id];
                   return (
                     <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-card border border-border px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1.5 shrink-0 whitespace-nowrap" title={translatedG?.name || g.name}>
                       <span>{translatedG?.emoji || g.emoji}</span> <span>{translatedG?.name || g.name}</span>
                     </motion.div>
                   );
                 })}
               </AnimatePresence>
             </div>
           )}
        </div>

        <div ref={chatRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scroll-smooth">
          {chat.map((msg, i) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl p-3 text-sm md:text-base font-medium shadow-sm ${msg.sender === 'user' ? 'bg-primary text-primary-foreground rounded-tr-sm' : msg.isFeedback ? 'bg-destructive/15 text-destructive border border-destructive/30 rounded-tl-sm' : 'bg-purple-600/10 text-foreground border border-purple-600/20 rounded-tl-sm'}`}>
                 {msg.text}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="shrink-0 space-y-3">
        {!finished && !suggestStep && (
          <>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{getT('askNext', 'What will you ask next?')}</div>
            <div className="grid grid-cols-1 gap-2">
              {currentStep.options.map((opt: any, i: number) => (
                <button key={i} onClick={() => handleOption(opt)} className="w-full text-left bg-card hover:bg-muted border-2 border-border p-3.5 rounded-2xl font-medium transition active:scale-[0.98] text-sm md:text-base">
                  {t(opt.text)}
                </button>
              ))}
            </div>
          </>
        )}
        
        {suggestStep && !finished && (
          <>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">{getT('selectFoodGroup', 'Select a food group')}</div>
            <div className="grid grid-cols-1 gap-2">
              {suggestOptions.map((opt: any, i: number) => (
                <button key={i} onClick={() => handleSuggestPick(opt)} className="w-full text-left bg-card hover:bg-muted border-2 border-border p-3.5 rounded-2xl font-medium transition active:scale-[0.98] flex items-center gap-3">
                  <span className="text-2xl">{opt.group.emoji}</span> <span>{opt.group.name}</span>
                </button>
              ))}
            </div>
          </>
        )}

        {finished && (
          <button onClick={() => onNext(wrongCount === 0 ? 1 : 0, wrongCount === 0 ? 1 : 0, wrongCount > 0 ? 1 : 0, mistakes)} className="mt-2 w-full rounded-2xl bg-purple-600 text-white py-4 text-lg font-bold shadow-md min-h-14 relative z-50 pointer-events-auto cursor-pointer" style={{ WebkitTapHighlightColor: "transparent", touchAction: "manipulation" }}>
            {getT('finishScenario', 'Finish Scenario ➡️')}
          </button>
        )}
      </div>
    </motion.div>
  );
}


function Result({ standardScore, counselingScore, visualScore, correct, wrong, total, mistakes, userName, phcName, onAgain, lang, t }: any) {
  const score = standardScore + counselingScore + visualScore;
  const pct = Math.round((correct / total) * 100);
  const passed = score >= 16;
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;
    try {
      const canvas = await html2canvas(certificateRef.current, { scale: 2 });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `MDDW_Certificate_${userName.replace(/\s+/g, "_")}.png`;
      link.click();
    } catch (e) {
      console.error(e);
      alert("Could not generate certificate. Please try again.");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col gap-4">
      <NutriCompanion message={passed ? t("companionResultPass") : t("companionResultFail")} />
      <div className={`rounded-3xl p-6 text-center shadow-lg ${passed ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground"}`}>
        <div className="text-6xl mb-2" aria-hidden>{passed ? "🎉🏆" : "💪📚"}</div>
        <h2 className="text-2xl font-bold">{passed ? t("greatWork") : t("keepPracticing")}</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 mt-4">
        <Stat label="Total Score" value={`${score}/20`} accent />
        <Stat label={t("accuracy")} value={`${pct}%`} accent />
        <Stat label="Standard" value={`${standardScore}/10`} />
        <Stat label="Counseling" value={`${counselingScore}/5`} />
        <Stat label="Visual Meals" value={`${visualScore}/5`} />
        <Stat label={t("wrongAnswers")} value={`${wrong}/${total}`} />
      </div>

      {mistakes.length > 0 && (
        <div className="mt-6">
          <h3 className="font-bold text-lg mb-3">{t("reviewMistakes")}</h3>
          <div className="space-y-3">
            {mistakes.map((m:any, i:number) => (
              <div key={i} className="bg-card border-2 border-border rounded-xl p-3 text-sm">
                <div className="font-semibold text-base mb-1">
                  {t(m.question as any) === m.question ? m.question.replace(/^(dish_|ing_)/, '').replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : t(m.question as any)}
                </div>
                <div className="text-destructive mb-0.5">❌ {t("youAnswered")} {m.userAnswer}</div>
                <div className="text-secondary">✅ {t("correctAnswer")} {m.correctAnswer}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {true && (
        <div className="mt-6 border-t-2 border-border pt-6">
          <h3 className="font-bold text-lg mb-4 text-center text-primary">🏅 Your Certificate</h3>
          <div className="mb-4"><Certificate userName={userName} phcName={phcName} score={score} pct={pct} lang={lang} t={t} isPreview={true} /></div>
          <button onClick={downloadCertificate} className="w-full rounded-2xl bg-blue-600 hover:bg-blue-700 text-white py-4 font-bold min-h-14 shadow-md flex items-center justify-center gap-2">
            <span className="text-xl">📥</span> {t("downloadCertificate")}
          </button>
          <div className="absolute top-[-9999px] left-[-9999px] pointer-events-none">
            <Certificate userName={userName} phcName={phcName} score={score} pct={pct} lang={lang} t={t} isPreview={false} certificateRef={certificateRef} />
          </div>
        </div>
      )}

      <div className="mt-5 flex justify-center">
        <Link to="/progress" className="w-full rounded-2xl bg-primary text-primary-foreground py-4 text-lg font-bold shadow-md text-center min-h-14 flex items-center justify-center">
          🏠 Unlocked: Return to Home Screen
        </Link>
      </div>
    </motion.div>
  );
}

function Stat({ label, value, accent }: any) {
  return (
    <div className={`rounded-2xl p-4 border-2 ${accent ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
      <div className="text-xs font-semibold uppercase text-muted-foreground">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${accent ? "text-primary" : "text-foreground"}`}>{value}</div>
    </div>
  );
}
