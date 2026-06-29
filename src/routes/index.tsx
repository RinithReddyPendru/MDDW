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
          {!progress.hasCompletedTraining ? (
            <div className="glass rounded-3xl p-6 shadow-sm border-2 border-border/50 flex flex-col gap-5">
              <div className="text-center">
                <h3 className="font-bold text-lg text-primary">Your Training Path</h3>
                <p className="text-sm text-muted-foreground">Complete these steps to unlock the full app</p>
              </div>
              <div className="flex flex-col gap-2 relative">
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border z-0" />
                <div className="flex items-center gap-4 relative z-10 bg-card p-3 rounded-2xl border">
                  <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold shrink-0">1</div>
                  <div className="font-semibold text-sm flex-1">📖 Learn Food Groups</div>
                </div>
                <div className="flex items-center gap-4 relative z-10 bg-card p-3 rounded-2xl border">
                  <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold shrink-0">2</div>
                  <div className="font-semibold text-sm flex-1">🍽 Build a Plate</div>
                </div>
                <div className="flex items-center gap-4 relative z-10 bg-card p-3 rounded-2xl border">
                  <div className="w-6 h-6 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-xs font-bold shrink-0">3</div>
                  <div className="font-semibold text-sm flex-1">📸 Dish Breakdown</div>
                </div>
                <div className="flex items-center gap-4 relative z-10 bg-card p-3 rounded-2xl border">
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
              <Link to="/learn" className="rounded-2xl bg-secondary text-secondary-foreground px-5 py-4 text-lg font-bold text-center shadow-md active:scale-[0.98] transition min-h-14 flex items-center justify-center gap-2">
                {"📖"} {t("learnFoodGroups")}
              </Link>
              <Link to="/plate" className="rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-4 text-lg font-bold text-center shadow-md active:scale-[0.98] transition min-h-14 flex items-center justify-center gap-2">
                {"🍽"} {t("buildPlate")}
              </Link>
              <Link to="/meals" className="rounded-2xl bg-primary text-primary-foreground px-5 py-4 text-lg font-bold text-center shadow-md active:scale-[0.98] transition min-h-14 flex items-center justify-center gap-2">
                {"📸"} {t("dishDecoderTitle")}
              </Link>
              <Link to="/game" className="rounded-2xl bg-amber-600 hover:bg-amber-700 text-white px-5 py-4 text-lg font-bold text-center shadow-md active:scale-[0.98] transition min-h-14 flex items-center justify-center gap-2">
                {"🗣"} {t("startTraining")}
              </Link>
              <Link to="/progress" className="rounded-2xl bg-card text-foreground border-2 border-border/50 px-5 py-4 text-lg font-bold text-center shadow-sm active:scale-[0.98] transition min-h-14 flex items-center justify-center gap-2">
                {"📈"} {t("myProgress")}
              </Link>
            </>
          )}
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
