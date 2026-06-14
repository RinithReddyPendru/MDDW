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

  // Trigger celebration chime once when hitting diverse threshold
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
    <main className="min-h-dvh bg-gradient-premium pb-10">
      <AppHeader showBack />
      <div className="mx-auto max-w-xl px-4 py-5 flex flex-col gap-6">
        {/* Title details */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">{t("plateTitle")}</h2>
          <p className="text-sm text-muted-foreground mt-1">{t("plateDesc")}</p>
        </div>

        {/* Visual Plate Arena */}
        <div className="relative aspect-square w-full max-w-[280px] mx-auto rounded-full bg-card/60 backdrop-blur-md border-4 border-primary/20 shadow-xl flex items-center justify-center overflow-hidden">
          <div className="absolute inset-4 rounded-full border border-dashed border-muted-foreground/20 flex items-center justify-center">
            {selectedIds.length === 0 ? (
              <span className="text-sm font-semibold text-muted-foreground/60 select-none text-center px-6">
                🍽️ Tap foods below to add them to your plate
              </span>
            ) : (
              <div className="relative w-full h-full">
                <AnimatePresence>
                  {SANDBOX_FOODS.filter(f => selectedIds.includes(f.name)).map((f, idx, arr) => {
                    const total = arr.length;
                    const radius = 65; // px
                    const angle = (idx * 2 * Math.PI) / total;
                    const x = radius * Math.cos(angle);
                    const y = radius * Math.sin(angle);

                    return (
                      <motion.div
                        key={f.name}
                        initial={{ scale: 0, x: 0, y: 100 }}
                        animate={{ scale: 1.1, x: x, y: y }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 150 }}
                        className="absolute top-[40%] left-[45%] text-4xl select-none"
                      >
                        {f.emoji}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
          {/* Plate center badge */}
          <div className="absolute z-10 bg-primary text-primary-foreground font-bold px-3 py-1 rounded-full text-xs shadow-md">
            {score} / 10 Groups
          </div>
        </div>

        {/* Celebration Banner */}
        <AnimatePresence>
          {isDiverse && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-secondary text-secondary-foreground rounded-2xl p-4 text-center font-bold text-sm shadow-md border-2 border-secondary-foreground/20"
            >
              {t("diversityAchieved")} 🥦🥛🥚
            </motion.div>
          )}
        </AnimatePresence>

        {/* Selected food group listing grid */}
        <div className="glass rounded-2xl p-5 border border-border/50">
          <h3 className="font-bold text-xs mb-3 uppercase tracking-wider text-muted-foreground">
            {t("groupsOnPlate")}
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {FOOD_GROUPS.map(g => {
              const active = activeGroups.has(g.id);
              return (
                <div
                  key={g.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                    active
                      ? "bg-primary/10 border-primary text-foreground"
                      : "bg-muted/30 border-transparent text-muted-foreground opacity-60"
                  }`}
                >
                  <span className="text-base">{g.emoji}</span>
                  <span className="truncate">{g.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Food grid (Toggles) */}
        <div className="grid grid-cols-5 gap-2.5">
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
                <span className="text-3xl">{f.emoji}</span>
                <span className="text-[10px] font-bold truncate max-w-full text-center leading-none text-muted-foreground">
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-2.5">
          <button
            onClick={handleClear}
            className="flex-1 rounded-2xl bg-muted hover:bg-muted/80 text-foreground py-3.5 font-bold text-center active:scale-[0.98] border border-border transition min-h-12 text-sm"
          >
            ❌ {t("clearPlate")}
          </button>
          <Link
            to="/"
            className="flex-1 rounded-2xl bg-primary text-primary-foreground py-3.5 font-bold text-center active:scale-[0.98] transition min-h-12 text-sm shadow-md"
          >
            🏠 {t("home")}
          </Link>
        </div>
      </div>
    </main>
  );
}
