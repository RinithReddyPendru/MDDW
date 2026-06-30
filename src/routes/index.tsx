import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/mddw/AppHeader";
import { useLang } from "@/lib/mddw/useLang";
import { NutriCompanion } from "@/components/mddw/NutriCompanion";
import { loadProgress } from "@/lib/mddw/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MDDW Master Challenge \u2013 ASHA Worker Training" },
      { name: "description", content: "Train ASHA workers on Minimum Dietary Diversity for Women through interactive games." },
      { name: "theme-color", content: "#D97000" },
      { property: "og:title", content: "MDDW Master Challenge" },
      { property: "og:description", content: "Interactive MDDW training for ASHA workers." },
    ],
    links: [{ rel: "manifest", href: "/manifest.webmanifest" }],
  }),
  component: Index,
});

function Index() {
  const { t } = useLang();
  const progress = loadProgress();
  const stats = [
    { value: "10", label: t("foodGroups") },
    { value: "\u22655", label: t("requiredDaily") },
    { value: "3", label: t("levels") },
  ];

  return (
    <main className="min-h-dvh flex flex-col bg-gradient-premium">
      <AppHeader />
      <div className="mx-auto w-full max-w-xl px-4 py-6 flex-1 flex flex-col gap-6">
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl bg-gradient-to-br from-primary/90 to-accent/90 backdrop-blur-md text-primary-foreground p-6 shadow-xl border border-white/20"
        >
          <div className="text-4xl mb-2" aria-hidden>{"\u{1F33D}\u{1F35A}"}</div>
          <h2 className="text-2xl font-bold text-balance leading-tight">{t("appTitle")}</h2>
          <p className="mt-2 text-sm opacity-95 text-balance">{t("heroDesc")}</p>
        </motion.section>

        <NutriCompanion message={t("companionHome")} />

        <div className="grid grid-cols-3 gap-3">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i, duration: 0.3 }}
              className="rounded-2xl glass p-3 text-center shadow-sm"
            >
              <div className="text-2xl font-bold text-primary">{s.value}</div>
              <div className="text-[11px] text-muted-foreground font-medium leading-tight mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>

        <nav className="flex flex-col gap-3">
          <Link
            to="/learn"
            className="rounded-2xl bg-secondary text-secondary-foreground px-5 py-4 text-lg font-bold text-center shadow-md active:scale-[0.98] transition min-h-14 flex items-center justify-center gap-2"
          >
            {"📖"} {t("learnFoodGroups")}
          </Link>
          <Link
            to="/plate"
            className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-4 text-lg font-bold text-center shadow-md active:scale-[0.98] transition min-h-14 flex items-center justify-center gap-2"
          >
            {"🍽"} {t("buildPlate")}
          </Link>
          <Link
            to="/meals"
            className="rounded-2xl bg-primary text-primary-foreground px-5 py-4 text-lg font-bold text-center shadow-md active:scale-[0.98] transition min-h-14 flex items-center justify-center gap-2"
          >
            {"📸"} {t("dishDecoderTitle")}
          </Link>
          <Link
            to="/game" search={{ mode: "counseling" }}
            className="rounded-2xl bg-amber-600 hover:bg-amber-700 text-white px-5 py-4 text-lg font-bold text-center shadow-md active:scale-[0.98] transition min-h-14 flex items-center justify-center gap-2"
          >
            {"🗣"} {t("startTraining")}
          </Link>
          <Link
            to="/progress"
            className="rounded-2xl bg-card text-foreground border-2 border-border/50 px-5 py-4 text-lg font-bold text-center shadow-sm active:scale-[0.98] transition min-h-14 flex items-center justify-center gap-2"
          >
            {"📈"} {t("myProgress")}
          </Link>
        </nav>

        <p className="text-center text-xs text-muted-foreground mt-auto pt-4">
          {t("mddwExplain")}
        </p>
        <footer className="mt-8 mb-4 text-center">
          <div className="glass inline-block px-4 py-2 rounded-full shadow-sm">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Developed for ASHA Workers
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
