import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/mddw/AppHeader";
import { FOOD_GROUPS } from "@/lib/mddw/foodGroups";
import { useLang } from "@/lib/mddw/useLang";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn Food Groups — MDDW" },
      { name: "description", content: "Explore the 10 MDDW food groups with examples." },
    ],
  }),
  component: Learn,
});

function Learn() {
  const { t } = useLang();
  return (
    <main className="min-h-dvh">
      <AppHeader showBack />
      <div className="mx-auto max-w-xl px-4 py-5">
        <h2 className="text-xl font-bold mb-1">{t("learnFoodGroups")}</h2>
        <p className="text-sm text-muted-foreground mb-4">10 {t("foodGroups")}</p>
        <div className="grid grid-cols-1 gap-3">
          {FOOD_GROUPS.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl bg-card border-2 p-4 shadow-sm flex gap-3 items-start"
              style={{ borderColor: `var(--${g.colorVar})` }}
            >
              <div
                className="text-3xl rounded-2xl w-14 h-14 flex items-center justify-center shrink-0"
                style={{ backgroundColor: `color-mix(in oklab, var(--${g.colorVar}) 25%, white)` }}
                aria-hidden
              >
                {g.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-base">{i + 1}. {g.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{t("examples")}</div>
                <div className="text-sm mt-1 text-foreground/90">{g.examples.join(", ")}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
