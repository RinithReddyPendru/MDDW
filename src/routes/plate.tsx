import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppHeader } from "@/components/mddw/AppHeader";
import { useLang } from "@/lib/mddw/useLang";
import { getFoodGroups } from "@/lib/mddw/foodGroups";
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

const SANDBOX_FOODS = [
  { name: "Rice", nameTe: "అన్నం", emoji: "🍚", group: "grains" },
  { name: "Toor Dal", nameTe: "కంది పప్పు", emoji: "🍲", group: "pulses" },
  { name: "Groundnut", nameTe: "వేరుశెనగలు", emoji: "🥜", group: "nuts" },
  { name: "Milk", nameTe: "పాలు", emoji: "🥛", group: "dairy" },
  { name: "Chicken", nameTe: "కోడి మాంసం", emoji: "🍗", group: "meat" },
  { name: "Boiled Egg", nameTe: "గుడ్డు", emoji: "🍳", group: "eggs" },
  { name: "Palak", nameTe: "పాలకూర", emoji: "🌿", group: "dglv" },
  { name: "Carrot", nameTe: "క్యారెట్", emoji: "🥕", group: "vitaminA" },
  { name: "Tomato", nameTe: "టమాటా", emoji: "🍅", group: "otherVeg" },
  { name: "Banana", nameTe: "అరటి పండు", emoji: "🍌", group: "otherFruit" },
];

function PlateSandbox() {
  const { t, lang } = useLang();
  const FOOD_GROUPS = getFoodGroups(lang);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [celebrated, setCelebrated] = useState(false);

  const activeGroups = new Set(
    SANDBOX_FOODS.filter(f => selectedIds.includes(f.name)).map(f => f.group)
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
  };

  return (
    <main className="h-dvh flex flex-col bg-gradient-premium overflow-hidden">
      <AppHeader showBack />
      
      {/* Responsive layout container: Row on laptop (md), Column on mobile */}
      <div className="flex-1 flex flex-col md:flex-row items-center justify-center md:gap-10 px-4 py-3 max-w-4xl mx-auto w-full overflow-hidden">
        
        {/* LEFT COLUMN: Title & Plate Arena */}
        <div className="flex-1 flex flex-col items-center justify-between md:justify-center md:gap-6 w-full h-full md:h-auto overflow-hidden">
          {/* Header Details */}
          <div className="text-center md:mb-2">
            <h2 className="text-lg md:text-2xl font-bold text-foreground leading-tight">{t("plateTitle")}</h2>
            <p className="text-[11px] md:text-xs text-muted-foreground leading-tight mt-0.5">{t("plateDesc")}</p>
          </div>

          {/* Visual Plate Arena */}
          <div className="relative aspect-square w-full max-w-[210px] sm:max-w-[230px] md:max-w-[280px] mx-auto rounded-full bg-card/60 backdrop-blur-md border-4 border-primary/20 shadow-lg flex items-center justify-center">
            <div className="absolute inset-3 rounded-full border border-dashed border-muted-foreground/20 flex items-center justify-center">
              {selectedIds.length === 0 ? (
                <span className="text-[11px] md:text-xs font-semibold text-muted-foreground/60 select-none text-center px-4 leading-relaxed">
                  🍽️ Tap foods to add them to your plate
                </span>
              ) : (
                <div className="relative w-full h-full">
                  <AnimatePresence>
                    {SANDBOX_FOODS.filter(f => selectedIds.includes(f.name)).map((f, idx, arr) => {
                      const total = arr.length;
                      const radius = 55; // circular placement radius
                      const angle = (idx * 2 * Math.PI) / total;
                      const x = radius * Math.cos(angle);
                      const y = radius * Math.sin(angle);

                      return (
                        <motion.div
                          key={f.name}
                          initial={{ scale: 0, x: 0, y: 80 }}
                          animate={{ scale: 1.1, x: x, y: y }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{ type: "spring", stiffness: 150 }}
                          className="absolute top-[40%] left-[43%] text-3xl select-none"
                        >
                          {f.emoji}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
            {/* Plate center score badge */}
            <div className="absolute z-10 bg-primary text-primary-foreground font-bold px-2.5 py-0.5 rounded-full text-[10px] md:text-xs shadow-md">
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
        </div>

        {/* RIGHT COLUMN: Badges & Food Grid Selection */}
        <div className="flex-1 flex flex-col justify-end md:justify-center gap-4 w-full h-auto overflow-hidden md:border-l md:border-border/30 md:pl-8">
          
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
              {SANDBOX_FOODS.map(f => {
                const active = selectedIds.includes(f.name);
                const label = lang === "te" ? f.nameTe : f.name;
                return (
                  <button
                    key={f.name}
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
                  </button>
                );
              })}
            </div>

            {/* Laptop/Desktop (5x2 clean grid for easy mouse-clicks) */}
            <div className="hidden md:grid grid-cols-5 gap-2.5">
              {SANDBOX_FOODS.map(f => {
                const active = selectedIds.includes(f.name);
                const label = lang === "te" ? f.nameTe : f.name;
                return (
                  <button
                    key={f.name}
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
                  </button>
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
        </div>

      </div>
    </main>
  );
}
