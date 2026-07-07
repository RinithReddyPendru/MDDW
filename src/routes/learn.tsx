import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
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
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="h-dvh flex flex-col md:flex-row bg-gradient-premium overflow-hidden"
    >
      {/* Desktop Split Screen: Left Side Hero Image */}
      <div className="flex w-full h-[35vh] md:h-auto shrink-0 md:w-1/2 relative flex-col items-center justify-center p-4 md:p-8 lg:p-12 border-b md:border-b-0 md:border-r border-border/50 bg-white/20 backdrop-blur-sm overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="rounded-3xl overflow-hidden shadow-2xl shadow-primary/20 border-4 md:border-8 border-white/80 bg-white max-w-2xl w-full h-full md:h-auto flex flex-col"
        >
          <img 
            src="/learn_hero.png" 
            alt="Learning Food Groups" 
            className="w-full flex-1 object-cover md:object-cover bg-primary/5 min-h-0 aspect-[4/3] md:aspect-auto"
          />
          <div className="bg-primary/10 p-3 md:p-6 text-center border-t border-primary/20 shrink-0">
            <h2 className="text-primary text-xl md:text-3xl font-bold leading-tight tracking-tight">Nutrition Education</h2>
            <p className="text-primary/80 text-sm md:text-lg font-medium mt-1 md:mt-2">Empowering communities with dietary knowledge</p>
          </div>
        </motion.div>
      </div>

      {/* Right Side Content (Full width on mobile) */}
      <div ref={scrollRef} className="w-full md:w-1/2 flex flex-col flex-1 overflow-y-auto pb-10 relative">
        <motion.div style={{ y: y1 }} className="absolute top-20 right-10 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <motion.div style={{ y: y2 }} className="absolute bottom-40 left-10 w-72 h-72 bg-secondary/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/20 shadow-sm">
          <AppHeader showBack />
        </div>
        
        <div className="mx-auto w-full max-w-xl px-4 py-6 md:py-10 flex-1 flex flex-col">
          {/* Desktop Header */}
          <div className="hidden md:flex items-center gap-4 mb-6">
            <Link to="/" className="w-10 h-10 rounded-full bg-white/50 hover:bg-white flex items-center justify-center shadow-sm transition-colors text-lg font-bold">
              {"\u2190"}
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("learnFoodGroups")}</h1>
              <p className="text-muted-foreground mt-1 text-lg">{t("tapToSee")}</p>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="md:hidden mb-5">
            <h2 className="text-2xl font-bold text-foreground">{t("learnFoodGroups")}</h2>
            <p className="text-sm text-muted-foreground mt-1">{t("tapToSee")}</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {FOOD_GROUPS.map((g, i) => {
              const isOpen = open === g.id;
              return (
                <motion.div
                  key={g.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="rounded-2xl glass border-2 shadow-sm overflow-hidden"
                  style={{ borderColor: `var(--${g.colorVar})` }}
                >
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setOpen(isOpen ? null : g.id)}
                    className="w-full p-4 flex gap-3 items-center text-left transition min-h-16 hover:bg-white/40"
                    aria-expanded={isOpen}
                  >
                    <motion.div
                      animate={isOpen ? { rotate: [0, -10, 10, -10, 0], scale: 1.1 } : { scale: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-3xl rounded-2xl w-14 h-14 flex items-center justify-center shrink-0 shadow-sm"
                      style={{ backgroundColor: `color-mix(in oklab, var(--${g.colorVar}) 30%, white)` }}
                      aria-hidden
                    >
                      {g.emoji}
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">{t("group")} {i + 1}</div>
                      <div className="font-bold text-lg leading-tight mt-0.5">{g.name}</div>
                    </div>
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-xl text-muted-foreground">{"\u25BC"}</motion.div>
                  </motion.button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div
                          className="px-5 pb-5 pt-2 space-y-4"
                          style={{
                            backgroundColor: `color-mix(in oklab, var(--${g.colorVar}) 10%, white)`,
                          }}
                        >
                          <div>
                            <div className="text-[11px] uppercase font-bold text-muted-foreground mb-2 tracking-wider">
                              {t("examples")}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {g.examples.map((ex) => (
                                <span
                                  key={ex}
                                  className="rounded-full px-3 py-1.5 text-xs font-bold bg-white/80 shadow-sm border"
                                  style={{ borderColor: `var(--${g.colorVar})`, color: `var(--${g.colorVar})` }}
                                >
                                  {ex}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] uppercase font-bold text-muted-foreground mb-2 tracking-wider">
                              {t("healthBenefits")}
                            </div>
                            <ul className="space-y-2">
                              {g.benefits.map((b) => (
                                <li key={b} className="flex gap-2.5 text-sm font-medium text-foreground/90">
                                  <span aria-hidden className="shrink-0">{"\u2705"}</span>
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
          
          <div className="mt-8 flex justify-center">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
              <Link to="/plate" className="w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground py-4 text-lg font-bold shadow-xl shadow-primary/20 min-h-14 flex items-center justify-center transition-all">{t("nextStepBuildPlate")}</Link>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.main>
  );
}

