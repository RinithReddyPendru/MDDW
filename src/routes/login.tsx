import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { AppHeader } from "@/components/mddw/AppHeader";
import { useLang } from "@/lib/mddw/useLang";
import { loadProgress, saveProgress } from "@/lib/mddw/storage";
import { NutriCompanion } from "@/components/mddw/NutriCompanion";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  const { t } = useLang();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phc, setPhc] = useState("");
  const [phone, setPhone] = useState("");

  const handleStart = () => {
    if (!name.trim()) return alert(t("enterNameAlert") || "Please enter your name");
    if (!phone.trim()) return alert(t("whatsappAlert") || "Please enter your WhatsApp number");
    
    const state = loadProgress();
    state.userName = name;
    state.phcName = phc;
    state.phoneNumber = phone;
    saveProgress(state);
    
    // Redirect to the first step of the training flow
    navigate({ to: "/learn" });
  };

  return (
    <main className="min-h-dvh flex flex-col bg-gradient-premium">
      <AppHeader />
      <div className="mx-auto w-full max-w-xl px-4 py-6 flex-1 flex flex-col gap-6 justify-center">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
          <NutriCompanion message={t("companionIntro")} />
          
          <div className="glass rounded-2xl p-5 border-2 border-border/50 shadow-sm text-center">
            <h3 className="font-bold text-lg mb-2">Grand Challenge</h3>
            <p className="text-sm text-muted-foreground">Please enter your details to start your mandatory MDD-W certification training.</p>
          </div>

          <div className="glass rounded-2xl p-5 border-2 border-border/50 shadow-sm">
            <h3 className="font-bold mb-4">{t("playerDetails")}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-1 text-muted-foreground">{t("whatsappLabel")}</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition" placeholder={t("whatsappPlaceholder") as string} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-muted-foreground">{t("yourName")}</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition" placeholder={t("namePlaceholder") as string} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1 text-muted-foreground">{t("villagePHC")}</label>
                <input type="text" value={phc} onChange={e => setPhc(e.target.value)} className="w-full bg-background border-2 border-border rounded-xl px-4 py-3 outline-none focus:border-primary transition" placeholder={t("phcPlaceholder") as string} />
              </div>
            </div>
          </div>

          <button onClick={handleStart} className="mt-3 w-full rounded-2xl bg-primary text-primary-foreground py-4 text-lg font-bold shadow-md active:scale-[0.98] min-h-14">
            🚀 Start Training
          </button>
        </motion.div>
      </div>
    </main>
  );
}
