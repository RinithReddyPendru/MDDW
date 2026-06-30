import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { AppHeader } from "@/components/mddw/AppHeader";
import { getFoodGroups, type FoodGroupId } from "@/lib/mddw/foodGroups";
import { useLang } from "@/lib/mddw/useLang";
import { loadProgress } from "@/lib/mddw/storage";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn Food Groups \u2013 MDDW" },
      { name: "description", content: "Explore the 10 MDDW food groups with examples and benefits." },
    ],
  }),
  component: Learn,
});

function Learn() {
  const { t, lang } = useLang();
  const progress = loadProgress();
  const FOOD_GROUPS = getFoodGroups(lang);
  const [open, setOpen] = useState<FoodGroupId | null>(null);

  return (
    <main className="min-h-dvh bg-gradient-premium">
      <AppHeader showBack />
      <div className="mx-auto max-w-xl px-4 py-5">
        <h2 className="text-xl font-bold mb-1">{t("learnFoodGroups")}</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {t("tapToSee")}
        </p>
        <div className="grid grid-cols-1 gap-3">
          {FOOD_GROUPS.map((g, i) => {
            const isOpen = open === g.id;
            return (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-2xl glass border-2 shadow-md overflow-hidden"
                style={{ borderColor: `var(--${g.colorVar})` }}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : g.id)}
                  className="w-full p-4 flex gap-3 items-center text-left active:scale-[0.99] transition min-h-16"
                  aria-expanded={isOpen}
                >
                  <div
                    className="text-3xl rounded-2xl w-14 h-14 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `color-mix(in oklab, var(--${g.colorVar}) 30%, white)` }}
                    aria-hidden
                  >
                    {g.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-muted-foreground font-bold">{t("group")} {i + 1}</div>
                    <div className="font-bold text-base leading-tight">{g.name}</div>
                  </div>
                  <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-xl text-muted-foreground">{"\u25BC"}</motion.div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div
                        className="px-4 pb-4 pt-1 space-y-3"
                        style={{
                          backgroundColor: `color-mix(in oklab, var(--${g.colorVar}) 10%, white)`,
                        }}
                      >
                        <div>
                          <div className="text-[11px] uppercase font-bold text-muted-foreground mb-1.5">
                            {t("examples")}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {g.examples.map((ex) => (
                              <span
                                key={ex}
                                className="rounded-full px-3 py-1 text-xs font-semibold bg-card border"
                                style={{ borderColor: `var(--${g.colorVar})` }}
                              >
                                {ex}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-[11px] uppercase font-bold text-muted-foreground mb-1.5">
                            {t("healthBenefits")}
                          </div>
                          <ul className="space-y-1.5">
                            {g.benefits.map((b) => (
                              <li key={b} className="flex gap-2 text-sm text-foreground/90">
                                <span aria-hidden>{"\u2705"}</span>
                                <span>{b}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
        
        {!progress.hasCompletedTraining && (
          <div className="mt-8 flex justify-center">
            <Link to="/plate" className="w-full rounded-2xl bg-primary text-primary-foreground py-4 text-lg font-bold shadow-md active:scale-[0.98] min-h-14 flex items-center justify-center">
              Next Step: Build a Plate ➡️
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

