import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/mddw/AppHeader";
import { getBadges, loadProgress, saveProgress, type ProgressState } from "@/lib/mddw/storage";
import { useLang } from "@/lib/mddw/useLang";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Certificate } from "@/components/mddw/Certificate";
import { generateNativeCertificate } from "@/lib/mddw/certificateGenerator";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "My Progress \u2013 MDDW" },
      { name: "description", content: "Track your MDDW training progress and badges." },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [p, setP] = useState<ProgressState | null>(null);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const certRef = useRef<HTMLDivElement>(null);

  const handleDownloadCert = async () => {
    if (!certRef.current) return;
    setIsGenerating(true);
    try {
      const formattedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
      const fileName = `MDDW_Certificate_${p?.userName || "ASHA"}.png`;
      await generateNativeCertificate(p?.userName || "ASHA", formattedDate, fileName);
    } catch (e: any) {
      console.error(e);
      alert("Failed to generate certificate: " + (e?.message || "Unknown error"));
    }
    setIsGenerating(false);
  };
  
  const handleUnlockApp = () => {
    if (!p) return;
    const newState = { ...p, hasCompletedTraining: true };
    saveProgress(newState);
    setP(newState);
  };

  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => { 
    const data = loadProgress();
    setP(data); 
    setWebhookUrl(data.sheetsWebhookUrl || "");
  }, []);

  const handleSaveSettings = () => {
    if (!p) return;
    const newState = { ...p, sheetsWebhookUrl: webhookUrl };
    saveProgress(newState);
    setP(newState);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!p) return null;

  const games = p.results.length;
  const avg = games ? Math.round(p.results.reduce((s, r) => s + r.score, 0) / games) : 0;
  const completion = Math.min(100, Math.round((p.unlockedLevel / 3) * 100));

  const chartData = p.results.map((r, i) => ({
    attempt: i + 1,
    score: r.score
  }));

  const badges = getBadges(lang);

  return (
    <main className="h-dvh flex flex-col md:flex-row bg-gradient-premium overflow-hidden">
      {/* Desktop Split Screen: Left Side Hero Image */}
      <div className="flex w-full h-[35vh] md:h-auto shrink-0 md:w-1/2 relative flex-col items-center justify-center p-4 md:p-8 lg:p-12 border-b md:border-b-0 md:border-r border-border/50 bg-white/20 backdrop-blur-sm overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }}
          className="rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border-4 md:border-8 border-white/60 bg-white max-w-2xl w-full h-full md:h-auto flex flex-col"
        >
          <img 
            src="/progress_hero.png" 
            alt="My Progress" 
            className="w-full flex-1 object-cover md:object-cover bg-primary/5 min-h-0 aspect-[4/3] md:aspect-auto"
          />
          <div className="bg-primary/10 p-3 md:p-6 text-center border-t border-primary/20 shrink-0">
            <h2 className="text-primary text-xl md:text-3xl font-bold leading-tight tracking-tight">Your Achievements</h2>
            <p className="text-primary/80 text-sm md:text-lg font-medium mt-1 md:mt-2">Tracking your journey to empower the community</p>
          </div>
        </motion.div>
      </div>

      {/* Right Side Content (Full width on mobile) */}
      <div className="w-full md:w-1/2 flex flex-col flex-1 overflow-y-auto pb-20">
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/20 shadow-sm">
          <AppHeader showBack />
        </div>
        
        <div className="mx-auto w-full max-w-xl px-4 py-6 md:py-10 flex-1 flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t("myProgress")}</h1>
            <p className="text-muted-foreground mt-1 text-base md:text-lg">See how far you've come!</p>
          </div>

        {!p.hasCompletedTraining && games > 0 && (
          <div className="mb-8">
            <button
              onClick={handleUnlockApp}
              className="w-full rounded-2xl bg-amber-500 hover:bg-amber-600 text-white py-5 text-xl font-bold shadow-md active:scale-[0.98] transition flex items-center justify-center gap-3 animate-pulse"
            >
              🎉 Complete Training & Unlock App 🎉
            </button>
          </div>
        )}

        {p.hasCompletedTraining && (
          <div className="mb-10">
            <div className="glass rounded-3xl p-5 border-2 border-border/50 shadow-sm flex flex-col items-center overflow-hidden">
              <h3 className="font-bold text-xl text-primary mb-4">Your Certificate</h3>
              <div className="w-full max-w-full mb-6">
                <Certificate 
                  userName={p.userName || ""}
                  phcName={p.phcName || ""}
                  date={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  isPreview={true}
                />
              </div>
              <div className="fixed inset-0 opacity-0 -z-10 pointer-events-none overflow-hidden">
                <Certificate 
                  ref={certRef}
                  userName={p.userName || ""}
                  phcName={p.phcName || ""}
                  date={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  isPreview={false}
                />
              </div>
              <button
                onClick={handleDownloadCert}
                disabled={isGenerating}
                className="w-full rounded-2xl bg-primary text-primary-foreground py-4 text-lg font-bold shadow-sm active:scale-[0.98] transition flex items-center justify-center gap-2"
              >
                {isGenerating ? "Generating..." : "⬇️ Download Certificate"}
              </button>
              
              <button
                onClick={() => navigate({ to: "/" })}
                className="w-full mt-3 rounded-2xl bg-secondary text-secondary-foreground py-3 text-sm font-bold shadow-sm active:scale-[0.98] transition"
              >
                {t("returnToDashboard") || "Return to Dashboard"}
              </button>
            </div>
          </div>
        )}

        {games === 0 ? (
          <div className="rounded-2xl bg-card border-2 border-dashed border-border p-8 text-center text-muted-foreground">
            {t("noProgress")}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              <Card label={t("gamesPlayed")} value={games} />
              <Card label={t("highestScore")} value={p.highestScore} />
              <Card label={t("averageScore")} value={avg} />
              <Card label={t("completion")} value={`${completion}%`} />
            </div>

            <div className="glass rounded-2xl p-5 border-2 border-border/50 shadow-sm">
              <h3 className="font-bold mb-4">{t("scoreHistory")}</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis dataKey="attempt" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: "#22c55e" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        <h3 className="text-lg font-bold mt-6 mb-3">{t("badges")}</h3>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((b, i) => {
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

        <h3 className="text-lg font-bold mt-8 mb-3">{t("sheetsIntegration")}</h3>
        <div className="glass rounded-2xl p-5 border-2 border-border/50 mb-6 shadow-sm">
          <p className="text-sm text-muted-foreground mb-4">
            {t("sheetsDesc")}
          </p>
          <div className="space-y-3">
            <input 
              type="text" 
              value={webhookUrl}
              onChange={e => setWebhookUrl(e.target.value)}
              className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition text-sm"
              placeholder={t("webhookPlaceholder")}
            />
            <button
              onClick={handleSaveSettings}
              className="w-full rounded-xl bg-primary text-primary-foreground py-3 font-bold shadow-sm active:scale-[0.98]"
            >
              {isSaved ? t("saved") : t("saveWebhook")}
            </button>
          </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl glass border-2 border-border/50 p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold text-primary mt-1">{value}</div>
    </div>
  );
}

