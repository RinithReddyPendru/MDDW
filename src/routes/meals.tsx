import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/mddw/useLang";
import { MDDW_MEALS, MealCategory } from "@/lib/mddw/mealsData";
import { getFoodGroups } from "@/lib/mddw/foodGroups";
import { AppHeader } from "@/components/mddw/AppHeader";
import { loadProgress } from "@/lib/mddw/storage";

export const Route = createFileRoute("/meals")({
  component: MealsComponent,
});

function MealsComponent() {
  const { lang, t } = useLang();
  const progress = loadProgress();
  const getImgUrl = (path: string) => path.startsWith('http') ? path : `${import.meta.env.BASE_URL || '/'}${path.replace(/^\//, '')}`;
  const [activeTab, setActiveTab] = useState<MealCategory>("breakfast");
  const [expandedDish, setExpandedDish] = useState<string | null>(null);

  const activeMeals = MDDW_MEALS.filter((m) => m.category === activeTab);

  const tabs: { id: MealCategory; label: string }[] = [
    { id: "breakfast", label: t("tabBreakfast") },
    { id: "lunch", label: t("tabLunch") },
    { id: "snack", label: t("tabSnack") || "Snacks" },
    { id: "dinner", label: t("tabDinner") },
  ];

  return (
    <main className="min-h-dvh flex flex-col bg-background pb-10">
      <AppHeader showBack />
      <div className="flex-1 mx-auto w-full max-w-xl px-4 py-6 flex flex-col gap-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold text-foreground mb-3 tracking-tight">
            Dish Decoder
          </h1>
          <p className="text-muted-foreground font-medium text-lg">
            Tap a dish to discover its food groups
          </p>
        </motion.div>

        <div className="flex rounded-full bg-muted/60 p-1.5 shadow-inner">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setExpandedDish(null);
                }}
                className={`relative flex-1 rounded-full py-3 text-sm font-bold transition-colors ${
                  isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground/80"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabIndicator"
                    className="absolute inset-0 bg-background rounded-full shadow-md"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Vertical List */}
        <div className="flex flex-col gap-5">
          <AnimatePresence mode="popLayout">
            {activeMeals.map((meal) => (
              <motion.button
                layoutId={`card-${meal.id}`}
                key={meal.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setExpandedDish(meal.id)}
                className="relative w-full h-56 rounded-[2rem] overflow-hidden shadow-lg group border border-border/30 bg-muted"
              >
                <img 
                  src={getImgUrl(meal.imageUrl)} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-left">
                  <h3 className="text-white font-extrabold text-2xl leading-tight drop-shadow-xl">
                    {t(meal.nameKey)}
                  </h3>
                </div>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
        
        {!progress.hasCompletedTraining && (
            <div className="mt-4 flex justify-center">
              <Link to="/game" className="w-full rounded-2xl bg-amber-600 hover:bg-amber-700 text-white py-4 text-lg font-bold shadow-md active:scale-[0.98] min-h-14 flex items-center justify-center">
                Next Step: Grand Challenge ➡️
              </Link>
            </div>
          )}
      </div>

      <AnimatePresence>
        {expandedDish && (
          <DishModal 
            mealId={expandedDish} 
            onClose={() => setExpandedDish(null)} 
            lang={lang} 
            t={t} 
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function DishModal({ mealId, onClose, lang, t }: any) {
  const meal = MDDW_MEALS.find((m: any) => m.id === mealId);
  const foodGroups = getFoodGroups(lang);
  if (!meal) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none p-0 sm:p-6">
        <motion.div
          layoutId={`card-${meal.id}`}
          className="bg-background rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden w-full max-w-md max-h-[90dvh] flex flex-col pointer-events-auto"
        >
          <div className="relative h-72 shrink-0">
             <img src={getImgUrl(meal.imageUrl)} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
             
             <button 
               onClick={onClose} 
               className="absolute top-5 right-5 bg-black/40 hover:bg-black/60 text-white w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md transition-colors"
             >
               <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                 <path d="M13 1L1 13M1 1L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
             </button>

             <h2 className="absolute bottom-5 left-6 text-3xl font-black text-foreground drop-shadow-md">
               {t(meal.nameKey)}
             </h2>
          </div>
          
          <div className="p-6 overflow-y-auto flex flex-col gap-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Ingredients & Groups
            </h3>
            <div className="flex flex-col gap-3">
              {meal.ingredients.map((ing: any, i: number) => {
                 const group = foodGroups.find((g: any) => g.id === ing.groupId);
                 if (!group) return null;
                 return (
                   <motion.div 
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: i * 0.05 + 0.1 }}
                     key={i} 
                     className="flex items-center justify-between bg-muted/40 p-4 rounded-2xl border border-border/50"
                   >
                      <div className="flex flex-col pr-3">
                        <span className="font-bold text-base text-foreground">{t(ing.nameKey)}</span>
                        <span className="text-xs font-medium text-muted-foreground mt-0.5 line-clamp-2">
                          {group.name} • {group.examples.join(", ")}
                        </span>
                      </div>
                      <div
                        className="flex items-center justify-center w-10 h-10 rounded-full shadow-sm shrink-0"
                        style={{ backgroundColor: `var(--${group.colorVar}-bg)`, color: `var(--${group.colorVar}-text)` }}
                      >
                        <span className="text-xl">{group.emoji}</span>
                      </div>
                   </motion.div>
                 )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}
