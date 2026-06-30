import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { User, Phone, MapPin, Rocket } from "lucide-react";
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
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5">
          
          <div className="rounded-3xl overflow-hidden shadow-lg border-4 border-white/40 bg-white relative">
            <img 
              src="/login_hero.png" 
              alt="ASHA Worker Training" 
              className="w-full h-48 object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
              <h2 className="text-white text-2xl font-bold leading-tight">MDD-W Master Challenge</h2>
              <p className="text-white/90 text-sm font-medium mt-1">ASHA Worker Certification Program</p>
            </div>
          </div>

          <NutriCompanion message={t("companionIntro")} />

          <div className="glass rounded-3xl p-6 border-2 border-border/50 shadow-md">
            <h3 className="font-bold text-lg mb-5 text-primary flex items-center gap-2">
              <User className="w-5 h-5" />
              {t("playerDetails")}
            </h3>
            
            <div className="space-y-4">
              <div className="relative">
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">{t("whatsappLabel")}</label>
                <div className="relative flex items-center">
                  <Phone className="absolute left-3 w-5 h-5 text-muted-foreground" />
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-background border-2 border-border rounded-xl pl-10 pr-4 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition font-medium" placeholder={t("whatsappPlaceholder") as string} />
                </div>
              </div>
              <div className="relative">
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">{t("yourName")}</label>
                <div className="relative flex items-center">
                  <User className="absolute left-3 w-5 h-5 text-muted-foreground" />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-background border-2 border-border rounded-xl pl-10 pr-4 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition font-medium" placeholder={t("namePlaceholder") as string} />
                </div>
              </div>
              <div className="relative">
                <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-muted-foreground">{t("villagePHC")}</label>
                <div className="relative flex items-center">
                  <MapPin className="absolute left-3 w-5 h-5 text-muted-foreground" />
                  <input type="text" value={phc} onChange={e => setPhc(e.target.value)} className="w-full bg-background border-2 border-border rounded-xl pl-10 pr-4 py-3.5 outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition font-medium" placeholder={t("phcPlaceholder") as string} />
                </div>
              </div>
            </div>
          </div>

          <button onClick={handleStart} className="mt-2 w-full rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground py-4.5 text-lg font-bold shadow-xl shadow-primary/20 active:scale-[0.98] min-h-[60px] flex items-center justify-center gap-2 transition-all">
            <Rocket className="w-6 h-6" />
            {t("startTraining")}
          </button>
        </motion.div>
      </div>
    </main>
  );
}
