import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppHeader } from "@/components/mddw/AppHeader";
import { useLang } from "@/lib/mddw/useLang";
import { LANGS, type Lang } from "@/lib/mddw/translations";
import { loadProgress } from "@/lib/mddw/storage";
import { getFoodGroups, QUIZ_FOODS, type QuizFood, type FoodGroupId } from "@/lib/mddw/foodGroups";
import { playPop, playSuccess } from "@/lib/mddw/audio";

export const Route = createFileRoute("/plate")({
  head: () => ({
    meta: [
      { title: "ASHA Diversity Plate Builder" },
      { name: "description", content: "Interactive dietary diversity plate builder for ASHA training." },
    ],
  }),
  component: PlateSandbox,
});

function getRandomSandboxFoods(): QuizFood[] {
  const groups: FoodGroupId[] = [
    "grains",
    "pulses",
    "nuts",
    "dairy",
    "meat",
    "eggs",
    "dglv",
    "vitaminA",
    "otherVeg",
    "otherFruit"
  ];
  return groups.map(groupId => {
    const groupFoods = QUIZ_FOODS.filter(f => f.group === groupId);
    return groupFoods[Math.floor(Math.random() * groupFoods.length)];
  });
}

function PlateSandbox() {
  const { t, lang } = useLang();
  const progress = loadProgress();
  const FOOD_GROUPS = getFoodGroups(lang);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sandboxFoods, setSandboxFoods] = useState<QuizFood[]>(() => getRandomSandboxFoods());
  const [celebrated, setCelebrated] = useState(false);

  const activeGroups = new Set(
    sandboxFoods.filter(f => selectedIds.includes(f.name)).map(f => f.group)
  );

  const score = activeGroups.size;
  const isDiverse = score >= 5;

  if (isDiverse && !celebrated) {
    playSuccess();
    setCelebrated(true);
  } else if (!isDiverse && celebrated) {
    setCelebrated(false);
  }

  const toggleFood = (name: string) => {
    playPop();
    setSelectedIds(prev =>
      prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]
    );
  };

  const handleClear = () => {
    playPop();
    setSelectedIds([]);
    setSandboxFoods(getRandomSandboxFoods());
  };

  return (
    <main 
      className="h-dvh flex flex-col overflow-hidden bg-cover bg-center relative"
      style={{ backgroundImage: 'url("/game_hero.png")' }}
    >
      <div className="absolute inset-0 bg-background/85 backdrop-blur-2xl z-0" />
      <div className="relative z-10 flex flex-col h-full w-full">
        <AppHeader showBack />
        
        {/* Responsive layout container: Row on laptop (md), Column on mobile */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8 px-4 py-3 max-w-5xl mx-auto w-full overflow-y-auto md:overflow-hidden">
        
        {/* LEFT COLUMN: Title & Plate Arena */}
        <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full md:w-1/2 h-auto">
          {/* Header Details */}
          <div className="text-center md:mb-2">
            <h2 className="text-lg md:text-2xl font-bold text-foreground leading-tight">{t("plateTitle")}</h2>
            <p className="text-[11px] md:text-xs text-muted-foreground leading-tight mt-0.5">{t("plateDesc")}</p>
          </div>

          {/* Visual Plate Arena */}
          <div className="relative aspect-square w-full max-w-[250px] sm:max-w-[280px] md:max-w-[340px] mx-auto rounded-full bg-gradient-to-br from-card/85 to-card/35 backdrop-blur-md border-[6px] border-primary/15 shadow-xl flex items-center justify-center transition-all duration-300">
            {/* Outer dotted rim */}
            <div className="absolute inset-2.5 rounded-full border border-dashed border-muted-foreground/35 flex items-center justify-center">
              {/* Inner plate well */}
              <div className="absolute inset-2.5 rounded-full bg-gradient-to-br from-background/35 to-background/10 shadow-inner flex items-center justify-center">
                {selectedIds.length === 0 ? (
                  <span className="text-[11px] md:text-xs font-semibold text-muted-foreground/60 select-none text-center px-5 leading-relaxed">
                    🍽️ Tap foods to add them to your plate
                  </span>
                ) : (
                  <div className="relative w-full h-full">
                    <AnimatePresence>
                      {sandboxFoods.filter(f => selectedIds.includes(f.name)).map((f, idx, arr) => {
                        const total = arr.length;
                        const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
                        const radius = isMobile ? 78 : 108; // circular placement radius
                        const angle = (idx * 2 * Math.PI) / total;
                        const x = radius * Math.cos(angle);
                        const y = radius * Math.sin(angle);

                        return (
                          <motion.div
                            key={f.name}
                            initial={{ scale: 0, x: 0, y: 80 }}
                            animate={{ scale: 1.25, x: x, y: y }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: "spring", stiffness: 150 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl md:text-4xl select-none filter drop-shadow-md cursor-pointer hover:scale-135 transition-transform"
                            onClick={() => toggleFood(f.name)}
                          >
                            {f.emoji}
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>
            {/* Plate bottom score badge */}
            <div className="absolute -bottom-3 z-10 bg-primary text-primary-foreground font-bold px-3 py-1 rounded-full text-xs md:text-sm shadow-md border border-primary-foreground/20">
              {score} / 10 Groups
            </div>
          </div>

          {/* Celebration Banner - Inline & compact */}
          <div className="min-h-8 flex items-center justify-center md:mt-2">
            <AnimatePresence>
              {isDiverse && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-secondary text-secondary-foreground rounded-xl px-4 py-1.5 text-center font-bold text-xs shadow-sm border border-secondary-foreground/10"
                >
                  {t("diversityAchieved")} 🥦🥛🍳
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Selected Ingredients list dynamically updated */}
          <div className="w-full max-w-sm mt-1 flex flex-col items-center gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              {t("selectedIngredients")}
            </span>
            <div className="flex flex-wrap justify-center gap-1.5 min-h-[36px] w-full py-1.5 px-2 rounded-xl bg-card/45 border border-border/20 backdrop-blur-sm">
              {sandboxFoods.filter(f => selectedIds.includes(f.name)).length === 0 ? (
                <span className="text-[10px] text-muted-foreground/50 italic py-0.5">
                  {t("emptyPlate")}
                </span>
              ) : (
                <AnimatePresence>
                  {sandboxFoods.filter(f => selectedIds.includes(f.name)).map(f => {
                    const label = lang === "te" ? f.nameTe : lang === "hi" ? f.nameHi : f.name;
                    return (
                      <motion.div
                        key={f.name}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        layout
                        className="flex items-center gap-1 bg-primary/10 border border-primary/20 text-foreground px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-sm"
                      >
                        <span>{f.emoji}</span>
                        <span>{label}</span>
                        <button
                          onClick={() => toggleFood(f.name)}
                          className="ml-1 hover:text-destructive transition text-[9px] font-bold opacity-60 hover:opacity-100"
                        >
                          ✕
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Badges & Food Grid Selection */}
        <div className="flex-1 flex flex-col justify-center gap-4 w-full md:w-1/2 h-auto md:border-l md:border-border/30 md:pl-8">
          
          {/* Active Group Badges Card */}
          <div className="glass rounded-xl p-3 border border-border/50 shadow-sm">
            <h3 className="font-bold text-[10px] md:text-xs mb-2 uppercase tracking-wider text-muted-foreground text-center">
              {t("groupsOnPlate")}
            </h3>
            <div className="flex flex-wrap justify-center gap-2">
              {FOOD_GROUPS.map(g => {
                const active = activeGroups.has(g.id);
                return (
                  <div
                    key={g.id}
                    title={g.name}
                    className={`w-8 h-8 md:w-9 md:h-9 rounded-full flex items-center justify-center text-lg md:text-xl transition border ${
                      active
                        ? "bg-primary/20 border-primary shadow-sm scale-110"
                        : "bg-muted/40 border-transparent opacity-40"
                    }`}
                  >
                    {g.emoji}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selection Tray: Horizontal Scroll on Mobile, Static Grid on Laptop */}
          <div className="flex flex-col gap-1.5">
            {/* Mobile (touch swipe) */}
            <div className="flex md:hidden gap-2.5 overflow-x-auto px-1 py-2 scrollbar-none snap-x">
              {sandboxFoods.map((f, idx) => {
                const active = selectedIds.includes(f.name);
                const label = lang === "te" ? f.nameTe : lang === "hi" ? f.nameHi : f.name;
                return (
                  <motion.button
                    key={f.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    onClick={() => toggleFood(f.name)}
                    className={`flex-shrink-0 snap-center flex flex-col items-center gap-1 p-2 w-[72px] rounded-xl border transition active:scale-95 ${
                      active
                        ? "bg-primary/20 border-primary shadow-sm"
                        : "bg-card border-border hover:bg-muted"
                    }`}
                  >
                    <span className="text-2xl">{f.emoji}</span>
                    <span className="text-[10px] font-bold truncate max-w-full text-center leading-none text-muted-foreground">
                      {label}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Laptop/Desktop (5x2 clean grid for easy mouse-clicks) */}
            <div className="hidden md:grid grid-cols-5 gap-2.5">
              {sandboxFoods.map((f, idx) => {
                const active = selectedIds.includes(f.name);
                const label = lang === "te" ? f.nameTe : lang === "hi" ? f.nameHi : f.name;
                return (
                  <motion.button
                    key={f.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.02, type: "spring", stiffness: 150 }}
                    onClick={() => toggleFood(f.name)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition active:scale-95 ${
                      active
                        ? "bg-primary/20 border-primary shadow-sm"
                        : "bg-card border-border hover:bg-muted"
                    }`}
                  >
                    <span className="text-2xl">{f.emoji}</span>
                    <span className="text-[10px] font-bold truncate max-w-full text-center leading-none text-muted-foreground">
                      {label}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex gap-2.5">
            <button
              onClick={handleClear}
              className="flex-1 rounded-xl bg-muted hover:bg-muted/80 text-foreground py-2.5 font-bold text-center active:scale-[0.98] border border-border transition text-xs"
            >
              ❌ {t("clearPlate")}
            </button>
            <Link
              to="/"
              className="flex-1 rounded-xl bg-primary text-primary-foreground py-2.5 font-bold text-center active:scale-[0.98] transition text-xs shadow-md"
            >
              🏠 {t("home")}
            </Link>
          </div>
          
          {isDiverse && !progress.hasCompletedTraining && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-4">
              <Link to="/meals" className="w-full rounded-2xl bg-primary text-primary-foreground py-4 text-lg font-bold shadow-md active:scale-[0.98] min-h-14 flex items-center justify-center">
                Next Step: Dish Breakdown ➡️
              </Link>
            </motion.div>
          )}
        </div>

      </div>
      </div>
    </main>
  );
}
