import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { AppHeader } from "@/components/mddw/AppHeader";
import { useLang } from "@/lib/mddw/useLang";
import { NutriCompanion } from "@/components/mddw/NutriCompanion";
import { loadProgress } from "@/lib/mddw/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MDDW Master Challenge \u2013 ASHA Training" },
      { name: "description", content: "Train ASHAs on Minimum Dietary Diversity for Women through interactive games." },
      { name: "theme-color", content: "#D97000" },
      { property: "og:title", content: "MDDW Master Challenge" },
      { property: "og:description", content: "Interactive MDDW training for ASHAs." },
    ],
    links: [{ rel: "manifest", href: "/manifest.webmanifest" }],
  }),
  component: Index,
});

function Index() {
  const { t } = useLang();
  const progress = loadProgress();

  // Redirect to login if user hasn't registered yet
  if (!progress.userName || !progress.phoneNumber) {
    return <Navigate to="/login" replace />;
  }
  const stats = [
    { value: "10", label: t("foodGroups") },
    { value: "\u22655", label: t("requiredDaily") },
    { value: "3", label: t("levels") },
  ];

  return (
    <main className="h-dvh flex flex-col md:flex-row bg-gradient-premium overflow-hidden">
      {/* Desktop Split Screen: Left Side Hero Image */}
      <div className="flex w-full h-[35vh] md:h-auto shrink-0 md:w-1/2 relative flex-col items-center justify-center p-4 md:p-8 lg:p-12 border-b md:border-b-0 md:border-r border-border/50 bg-white/20 backdrop-blur-sm overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border-4 md:border-8 border-white/80 bg-white max-w-2xl w-full h-full md:h-auto flex flex-col"
        >
          <img 
            src="/dashboard_hero.png" 
            alt="Dashboard" 
            className="w-full flex-1 object-cover md:object-cover bg-primary/5 min-h-0 aspect-[4/3] md:aspect-auto"
          />
        </motion.div>
      </div>

      {/* Right Side Content (Full width on mobile) */}
      <div className="w-full md:w-1/2 flex flex-col flex-1 overflow-y-auto">
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/20 shadow-sm">
          <AppHeader />
        </div>
        
        <div className="mx-auto w-full max-w-xl px-4 py-6 md:py-10 flex-1 flex flex-col gap-6">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="hidden md:block mb-1">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1 text-lg">Welcome back, {progress.userName}!</p>
          </motion.div>

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
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ delay: 0.1 * i, duration: 0.3 }}
                className="rounded-2xl glass-heavy p-3 text-center shadow-sm"
              >
                <div className="text-2xl font-bold text-primary">{s.value}</div>
                <div className="text-[11px] text-muted-foreground font-medium leading-tight mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>

          <nav className="flex flex-col gap-3">
            {!progress.hasCompletedTraining ? (
              <div className="glass rounded-3xl p-6 shadow-sm border-2 border-border/50 flex flex-col gap-5">
                <div className="text-center">
                  <h3 className="font-bold text-lg text-primary">Your Training Path</h3>
                  <p className="text-sm text-muted-foreground">Complete these steps to unlock the full app</p>
                </div>
                <div className="flex flex-col gap-2 relative">
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border z-0" />
                  <div className="flex items-center gap-4 relative z-10 bg-card p-3 rounded-2xl border glass">
                    <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold shrink-0">1</div>
                    <div className="font-semibold text-sm flex-1">📖 Learn Food Groups</div>
                  </div>
                  <div className="flex items-center gap-4 relative z-10 bg-card p-3 rounded-2xl border glass">
                    <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold shrink-0">2</div>
                    <div className="font-semibold text-sm flex-1">🍽 Build a Plate</div>
                  </div>
                  <div className="flex items-center gap-4 relative z-10 bg-card p-3 rounded-2xl border glass">
                    <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold shrink-0">3</div>
                    <div className="font-semibold text-sm flex-1">📸 Dish Breakdown</div>
                  </div>
                  <div className="flex items-center gap-4 relative z-10 bg-card p-3 rounded-2xl border glass">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">4</div>
                    <div className="font-semibold text-sm flex-1">🎖 Grand Challenge</div>
                  </div>
                </div>
                <Link to="/learn" className="rounded-2xl bg-primary text-primary-foreground py-4 text-lg font-bold text-center shadow-md active:scale-[0.98] transition">
                  Continue Training ➡️
                </Link>
              </div>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/learn" className="rounded-2xl bg-secondary/90 backdrop-blur-md text-secondary-foreground px-5 py-4 text-lg font-bold shadow-md min-h-14 flex items-center justify-center gap-2">
                    {"📖"} {t("learnFoodGroups")}
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/plate" className="rounded-2xl bg-emerald-600/90 backdrop-blur-md text-white px-5 py-4 text-lg font-bold shadow-md min-h-14 flex items-center justify-center gap-2">
                    {"🍽"} {t("buildPlate")}
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/meals" className="rounded-2xl bg-primary/90 backdrop-blur-md text-primary-foreground px-5 py-4 text-lg font-bold shadow-md min-h-14 flex items-center justify-center gap-2">
                    {"📸"} {t("dishDecoderTitle")}
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/game" className="rounded-2xl bg-amber-600/90 backdrop-blur-md text-white px-5 py-4 text-lg font-bold shadow-md min-h-14 flex items-center justify-center gap-2">
                    {"🗣"} {progress.savedRoundIndex !== undefined ? t("resumeChallenge" as any) || "Resume Challenge" : t("startTraining")}
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.96 }}>
                  <Link to="/progress" className="rounded-2xl glass-heavy text-foreground border-2 border-border/50 px-5 py-4 text-lg font-bold shadow-sm min-h-14 flex items-center justify-center gap-2">
                    {"📈"} {t("myProgress")}
                  </Link>
                </motion.div>
              </>
            )}
          </nav>

          <p className="text-center text-xs text-muted-foreground mt-auto pt-4">
            {t("mddwExplain")}
          </p>
          <footer className="mt-8 mb-4 text-center">
            <div className="glass inline-block px-4 py-2 rounded-full shadow-sm border border-white/20">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                Developed for ASHA's
              </p>
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}
