import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/mddw/AppHeader";
import { BADGES, loadProgress, type ProgressState } from "@/lib/mddw/storage";
import { useLang } from "@/lib/mddw/useLang";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "My Progress — MDDW" },
      { name: "description", content: "Track your MDDW training progress and badges." },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const { t } = useLang();
  const [p, setP] = useState<ProgressState | null>(null);
  useEffect(() => { setP(loadProgress()); }, []);

  if (!p) return null;

  const games = p.results.length;
  const avg = games ? Math.round(p.results.reduce((s, r) => s + r.score, 0) / games) : 0;
  const completion = Math.min(100, Math.round((p.unlockedLevel / 3) * 100));

  return (
    <main className="min-h-dvh">
      <AppHeader showBack />
      <div className="mx-auto max-w-xl px-4 py-5">
        <h2 className="text-xl font-bold mb-4">{t("myProgress")}</h2>

        {games === 0 ? (
          <div className="rounded-2xl bg-card border-2 border-dashed border-border p-8 text-center text-muted-foreground">
            {t("noProgress")}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Card label={t("gamesPlayed")} value={games} />
            <Card label={t("highestScore")} value={p.highestScore} />
            <Card label={t("averageScore")} value={avg} />
            <Card label={t("completion")} value={`${completion}%`} />
          </div>
        )}

        <h3 className="text-lg font-bold mt-6 mb-3">{t("badges")}</h3>
        <div className="grid grid-cols-2 gap-3">
          {BADGES.map((b, i) => {
            const earned = p.badges.includes(b.id);
            return (
              <motion.div
                key={b.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-2xl border-2 p-4 text-center ${
                  earned ? "bg-accent/20 border-accent" : "bg-muted border-border opacity-60"
                }`}
              >
                <div className={`text-4xl ${earned ? "" : "grayscale"}`} aria-hidden>{b.emoji}</div>
                <div className="font-bold text-sm mt-1">{b.name}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">{b.desc}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-card border-2 border-border p-4">
      <div className="text-xs font-semibold uppercase text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold text-primary mt-1">{value}</div>
    </div>
  );
}
