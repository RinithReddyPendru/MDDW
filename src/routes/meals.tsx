import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/lib/mddw/useLang";
import { MDDW_MEALS, MealCategory } from "@/lib/mddw/mealsData";
import { getFoodGroups } from "@/lib/mddw/foodGroups";
import { AppHeader } from "@/components/mddw/AppHeader";

export const Route = createFileRoute("/meals")({
  component: MealsComponent,
});

function MealsComponent() {
  const { lang, t } = useLang();
  const [activeTab, setActiveTab] = useState<MealCategory>("breakfast");
  const [expandedDish, setExpandedDish] = useState<string | null>(null);

  const foodGroups = getFoodGroups(lang);
  const activeMeals = MDDW_MEALS.filter((m) => m.category === activeTab);

  const tabs: { id: MealCategory; label: string }[] = [
    { id: "breakfast", label: t("tabBreakfast") },
    { id: "lunch", label: t("tabLunch") },
    { id: "dinner", label: t("tabDinner") },
  ];

  return (
    <main className="min-h-dvh flex flex-col bg-background">
      <AppHeader />
      <div className="flex-1 mx-auto w-full max-w-xl px-4 py-6 flex flex-col gap-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-5xl mb-2">{"\uD83D\uDD0DM\uD83C\uDF72"}</div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            {t("dishDecoderTitle")}
          </h1>
          <p className="text-muted-foreground">{t("dishDecoderDesc")}</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex rounded-2xl bg-muted/50 p-1 mt-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setExpandedDish(null);
              }}
              className={`flex-1 rounded-xl py-3 text-sm font-semibold transition-all ${
                activeTab===tab.id ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dish List */}
        <div className="flex flex-col gap-3">
          <AnimatePresence mode="popLayout">
            {activeMeals.map((meal) => {
              const isExpanded = expandedDish===meal.id;

              return (
                <motion.div
                  key={meal.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`overflow-hidden rounded-2xl border-2 transition-colors ${
                    isExpanded
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/50"
                  }`}
                >
                  <button
                    onClick={() => setExpandedDish(isExpanded ? null : meal.id)}
                    className="flex w-full items-center justify-between p-4 text-left font-bold text-lg active:scale-[0.99] transition-transform"
                  >
                    <span>{t(meal.nameKey)}</span>
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="text-xl text-primary"
                    >
                      {"\u25BC"}
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 pt-1 flex flex-col gap-2">
                          {meal.ingredients.map((ing, i) => {
                            const group = foodGroups.find((g) => g.id === ing.groupId);
                            if (!group) return null;

                            return (
                              <div
                                key={i}
                                className="flex items-center justify-between rounded-xl bg-background p-3 shadow-sm border border-border"
                              >
                                <span className="font-semibold text-foreground">
                                  {t(ing.nameKey)}
                                </span>
                                <div
                                  className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${group.colorVar}-bg/20 text-${group.colorVar.replace("group-", "")}`}
                                  style={{ backgroundColor: `var(--${group.colorVar}-bg)`, color: `var(--${group.colorVar}-text)` }}
                                >
                                  <span>{group.emoji}</span>
                                  <span>{group.name}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}



