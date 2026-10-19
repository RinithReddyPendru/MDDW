import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Search,
  Home,
  Check,
  Calendar,
  Lock,
  ArrowRight,
  Plus,
  RefreshCw,
  Sun,
  Utensils,
  Apple,
  Coffee,
  X,
  Sparkles,
  ChevronRight,
  ScanBarcode,
  Layers,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Camera,
  Upload,
} from "lucide-react";
import { useLang } from "@/lib/mddw/useLang";
import { LANGS, type Lang } from "@/lib/mddw/translations";
import {
  MOTHER_PROFILES,
  MOTHER_DISHES,
  MDDW_GROUP_INFO,
  type MotherProfile,
  type MealTab,
} from "@/lib/mddw/motherAppData";
import type { FoodGroupId } from "@/lib/mddw/foodGroups";
import { playPop, playSuccess } from "@/lib/mddw/audio";

export const Route = createFileRoute("/mother")({
  component: MotherAppSimulator,
});

type ViewState = "home" | "log" | "celebration" | "baby";

function MotherAppSimulator() {
  const navigate = useNavigate();
  const { lang, setLang } = useLang();

  // Active mother profile (Swathi, Lakshmi, Anitha)
  const [profile, setProfile] = useState<MotherProfile>(MOTHER_PROFILES[0]);

  // View state: 'home' | 'log' | 'celebration'
  const [view, setView] = useState<ViewState>("home");

  // Meal logging state
  const [activeTab, setActiveTab] = useState<MealTab>("breakfast");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // Dishes selected in the current logging session
  const [selectedDishes, setSelectedDishes] = useState<string[]>([]);

  // Overall logged dishes for yesterday (synced to localStorage for ASHA visit mode)
  const [loggedDishes, setLoggedDishes] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("demo_mother_logged_dishes");
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
    return [];
  });
  const isFoodLogged = loggedDishes.length > 0;

  // Sync to localStorage so ASHA Visit simulator (/visit) can read what was logged here
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        if (loggedDishes.length > 0) {
          localStorage.setItem("demo_mother_logged_dishes", JSON.stringify(loggedDishes));
          localStorage.setItem("demo_mother_profile_id", profile.id);
        } else {
          localStorage.removeItem("demo_mother_logged_dishes");
          localStorage.removeItem("demo_mother_profile_id");
        }
      } catch {
        // ignore
      }
    }
  }, [loggedDishes, profile.id]);

  // IFA tablet status
  const [ifaTaken, setIfaTaken] = useState(false);

  // Show camera scanner dialog
  const [showCameraModal, setShowCameraModal] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleScanFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8005/api/v1/scan", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const detectedIds: string[] = [];

      if (Array.isArray(data.dishes) && data.dishes.length > 0) {
        for (const d of data.dishes) {
          const match = MOTHER_DISHES.find(
            (md) =>
              md.name.en.toLowerCase().includes(d.name_en?.toLowerCase() || "") ||
              (d.name_en && md.name.en.toLowerCase().includes(d.name_en.toLowerCase())) ||
              md.name.te.includes(d.name_te || "")
          );
          if (match) {
            detectedIds.push(match.id);
          }
        }
      }

      if (detectedIds.length === 0) {
        // Fallback default sample if custom dish is detected
        detectedIds.push("pesarattu", "idli");
      }

      setSelectedDishes((prev) => Array.from(new Set([...prev, ...detectedIds])));
      playSuccess();
      setIsScanning(false);
      setShowCameraModal(false);
      setView("celebration");
    } catch (err: any) {
      console.warn("Live scanner fetch error:", err);
      setScanError(
        lang === "te"
          ? "సర్వర్‌తో కనెక్ట్ కాలేదు. దయచేసి క్రింది ప్రీసెట్లను ఉపయోగించండి."
          : "Scanner service unreachable. You can use the quick presets below or open the scanner directly."
      );
      setIsScanning(false);
    }
  };

  // Show detailed MDD-W educational breakdown drawer
  const [showMddwDrawer, setShowMddwDrawer] = useState(false);

  // Countdown timer for celebration screen
  const [countdown, setCountdown] = useState(9);
  const countdownIntervalRef = useRef<number | null>(null);

  // Trigger confetti and countdown on celebration
  useEffect(() => {
    if (view === "celebration") {
      playSuccess();
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.35 },
          colors: ["#D81B60", "#FF4081", "#FFD54F", "#4CAF50", "#26A69A"],
        });
      } catch {
        // ignore in SSR
      }

      setCountdown(9);
      countdownIntervalRef.current = window.setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            setView("home");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, [view]);

  // ── CORE MDD-W BACKEND MAPPING LOGIC ─────────────────────────────────
  const mddwAnalysis = useMemo(() => {
    const coveredGroupMap = new Map<FoodGroupId, string[]>(); // groupId -> array of contributing dish names
    const allDishes = Array.from(new Set([...loggedDishes, ...selectedDishes]));

    allDishes.forEach((dId) => {
      const dish = MOTHER_DISHES.find((d) => d.id === dId);
      if (dish) {
        dish.groups.forEach((gId) => {
          if (!coveredGroupMap.has(gId)) {
            coveredGroupMap.set(gId, []);
          }
          coveredGroupMap.get(gId)!.push(dish.name[lang]);
        });
      }
    });

    const coveredGroupIds = Array.from(coveredGroupMap.keys()) as FoodGroupId[];
    const coveredCount = coveredGroupIds.length;
    const meetsDiversity = coveredCount >= 5;
    const missingCount = Math.max(0, 5 - coveredCount);

    const coveredGroupsList = MDDW_GROUP_INFO.filter((g) =>
      coveredGroupIds.includes(g.id)
    ).map((g) => ({
      ...g,
      dishes: Array.from(new Set(coveredGroupMap.get(g.id) || [])),
    }));

    const missingGroupsList = MDDW_GROUP_INFO.filter(
      (g) => !coveredGroupIds.includes(g.id)
    );

    return {
      allDishes,
      coveredGroupMap,
      coveredGroupIds,
      coveredCount,
      meetsDiversity,
      missingCount,
      coveredGroupsList,
      missingGroupsList,
    };
  }, [loggedDishes, selectedDishes, lang]);

  // Filtered dishes for current active tab
  const tabDishes = useMemo(() => {
    return MOTHER_DISHES.filter((d) => {
      const matchesCategory = d.category === activeTab;
      if (!matchesCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        d.name.en.toLowerCase().includes(q) ||
        d.name.te.toLowerCase().includes(q) ||
        d.name.hi.toLowerCase().includes(q)
      );
    });
  }, [activeTab, searchQuery]);

  // Count of items selected per tab
  const getSelectedCountForTab = (tab: MealTab) => {
    return selectedDishes.filter((id) => {
      const d = MOTHER_DISHES.find((dish) => dish.id === id);
      return d?.category === tab;
    }).length;
  };

  const toggleDishSelection = (dishId: string) => {
    playPop();
    setSelectedDishes((prev) =>
      prev.includes(dishId) ? prev.filter((id) => id !== dishId) : [...prev, dishId]
    );
  };

  const handleSaveDishes = () => {
    if (selectedDishes.length === 0) return;
    playSuccess();
    setLoggedDishes((prev) => Array.from(new Set([...prev, ...selectedDishes])));
    setView("celebration");
  };

  const handleResetDemoData = () => {
    playPop();
    setLoggedDishes([]);
    setSelectedDishes([]);
    setIfaTaken(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("demo_mother_logged_dishes");
      localStorage.removeItem("demo_mother_profile_id");
    }
    setView("home");
  };

  const handleProfileChange = (pId: string) => {
    playPop();
    const target = MOTHER_PROFILES.find((p) => p.id === pId) || MOTHER_PROFILES[0];
    setProfile(target);
    setLoggedDishes([]);
    setSelectedDishes([]);
    setIfaTaken(false);
    if (typeof window !== "undefined") {
      localStorage.removeItem("demo_mother_logged_dishes");
      localStorage.removeItem("demo_mother_profile_id");
    }
    setView("home");
  };

  return (
    <div className="min-h-dvh bg-[#EDE8EB] flex flex-col items-center justify-start p-0 sm:py-6 sm:px-4 font-sans text-slate-900 select-none">
      {/* ── DESKTOP SANDBOX UTILITY BAR (OUTSIDE PHONE FRAME) ───────────── */}
      <div className="w-full max-w-[412px] mb-2.5 hidden sm:flex items-center justify-between text-xs text-slate-700 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-[11px] text-[#D81B60]">ASHA Sandbox Mode</span>
        </div>

        <div className="flex items-center gap-2">
          <select
            aria-label="Select Mother"
            value={profile.id}
            onChange={(e) => handleProfileChange(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-lg px-2 py-0.5 text-[11px] cursor-pointer hover:bg-slate-100 transition"
          >
            {MOTHER_PROFILES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name[lang]} (W{p.week}·T{p.trimester})
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleResetDemoData}
            title="Reset Demo Data"
            className="p-1 rounded-md hover:bg-slate-100 text-slate-600 transition flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            title="Exit to Hub"
            className="p-1 rounded-md hover:bg-slate-100 text-slate-600 transition cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── MOBILE PHONE CONTAINER ────────────────────────────────────────── */}
      <div className="w-full sm:max-w-[412px] bg-white min-h-dvh sm:min-h-[850px] sm:max-h-[890px] sm:rounded-[42px] shadow-2xl relative flex flex-col justify-between overflow-x-hidden sm:border-[8px] sm:border-slate-800">
        
        {/* ── VIEW ROUTING ──────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* 1. SCREEN: MOTHER HOME DASHBOARD (Matches Screenshots 1, 8, 9) */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {view === "home" && (
            <motion.main
              key="mother-home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col justify-between overflow-y-auto pb-6"
            >
              <div>
                {/* ── AUTHENTIC DEEP BERRY HEADER (Screenshot 1, 8, 9) ─────── */}
                <div className="bg-[#D81B60] text-white px-5 pt-5 pb-6 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    {/* Avatar circle "S" */}
                    <div className="w-12 h-12 rounded-full bg-white text-[#D81B60] flex items-center justify-center font-extrabold text-2xl shadow-sm">
                      {profile.name[lang].charAt(0)}
                    </div>
                    <div>
                      <p className="text-xs text-white/90 font-medium leading-tight">
                        {lang === "te" ? "స్వాగతం," : lang === "hi" ? "वापसी पर स्वागत है," : "Welcome back,"}
                      </p>
                      <h1 className="text-xl font-extrabold tracking-tight leading-snug">
                        {profile.name[lang]}
                      </h1>
                      <p className="text-xs text-white/90 font-medium">
                        {lang === "te"
                          ? `${profile.week}వ వారం · ${profile.trimester}వ త్రైమాసికం`
                          : lang === "hi"
                          ? `सप्ताह ${profile.week} · तिमाही ${profile.trimester}`
                          : `Week ${profile.week} · Trimester ${profile.trimester}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* EN / TE / HI Language Pill */}
                    <select
                      aria-label="Language"
                      value={lang}
                      onChange={(e) => setLang(e.target.value as Lang)}
                      className="border border-white/70 bg-transparent text-white text-xs font-extrabold px-2.5 py-1 rounded-full cursor-pointer focus:outline-none"
                    >
                      {LANGS.map((l) => (
                        <option key={l.code} value={l.code} className="text-slate-900">
                          {l.code.toUpperCase()}
                        </option>
                      ))}
                    </select>

                    {/* SOS Button */}
                    <button
                      type="button"
                      onClick={() => alert("🚨 Emergency Helplines:\n• Ambulance: 108\n• Health Helpline: 104\n• ASHA Contact")}
                      className="bg-[#D81B60] text-white font-extrabold text-xs px-3.5 py-1 rounded-full border-2 border-white shadow-xs hover:bg-white hover:text-[#D81B60] transition cursor-pointer"
                    >
                      SOS
                    </button>
                  </div>
                </div>

                {/* ── BODY CONTENT ─────────────────────────────────────────── */}
                <div className="px-5 py-4 flex flex-col gap-4">
                  
                  {/* Hero Baby In Womb Section */}
                  <div className="flex flex-col items-center text-center gap-2.5 pt-1">
                    <div className="relative flex items-center justify-center my-1">
                      {/* Pure Circular Baby Illustration (Image 1: 100% circle, zero square artifacts) */}
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                          playPop();
                          setView("baby");
                        }}
                        aria-label="View Your Baby Insights"
                        className="w-56 h-56 rounded-full overflow-hidden cursor-pointer shadow-sm hover:scale-102 active:scale-98 transition flex items-center justify-center bg-transparent"
                      >
                        <img
                          src="/mother_app/baby_circle_v3.png"
                          alt="Baby in womb"
                          className="w-full h-full object-cover rounded-full pointer-events-none"
                        />
                      </div>

                      {/* Right Next Arrow Button (Image 1 & user request: Click redirects to Your Baby screen) */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          playPop();
                          setView("baby");
                        }}
                        aria-label="View Your Baby"
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-10 h-10 rounded-full border-2 border-[#F06292] bg-white text-[#D81B60] flex items-center justify-center shadow-md hover:bg-pink-50 transition cursor-pointer z-20"
                      >
                        <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                      </button>
                    </div>

                    {/* Italic Gestational Quote (Screenshot 1, 8, 9) */}
                    <p className="text-xs sm:text-sm italic font-medium text-slate-600 max-w-xs leading-relaxed px-2">
                      {profile.quote[lang]}
                    </p>

                    {/* Vertical Dashed Line + Lock Icon (Screenshot 1: Only before food is logged) */}
                    {!isFoodLogged && (
                      <div className="flex flex-col items-center gap-1.5 my-1">
                        <div className="w-0.5 h-6 border-l-2 border-dashed border-[#D81B60]/50" />
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#D81B60]">
                          <span className="w-6 h-6 rounded-full bg-[#D81B60] text-white flex items-center justify-center shadow-xs">
                            <Lock className="w-3 h-3 stroke-[2.5]" />
                          </span>
                          <span>
                            {lang === "te"
                              ? "అన్‌లాక్ చేయడానికి ఆహారాన్ని నమోదు చేయండి"
                              : lang === "hi"
                              ? "अनलॉक करने के लिए भोजन दर्ज करें"
                              : "Log food to unlock"}
                          </span>
                        </div>
                        <div className="w-0.5 h-4 border-l-2 border-dashed border-[#D81B60]/50" />
                      </div>
                    )}
                  </div>

                  {/* ── BIG CARD: ADD FOOD FOR YESTERDAY (Screenshots 1 & 8) ─── */}
                  <button
                    type="button"
                    onClick={() => {
                      playPop();
                      setView("log");
                    }}
                    className="w-full rounded-3xl bg-gradient-to-r from-[#D81B60] to-[#C2185B] text-white p-5 flex items-center justify-between shadow-lg shadow-pink-900/15 hover:opacity-95 active:scale-[0.99] transition cursor-pointer relative overflow-hidden"
                  >
                    {/* Subtle silhouette background shapes (Screenshots 1, 8, 9) */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-12">
                      <Apple className="absolute top-2 left-16 w-8 h-8 text-white -rotate-12" />
                      <Sun className="absolute bottom-2 left-28 w-9 h-9 text-white rotate-45" />
                      <Apple className="absolute top-3 right-16 w-9 h-9 text-white rotate-12" />
                      <Coffee className="absolute bottom-2 right-8 w-8 h-8 text-white -rotate-12" />
                    </div>

                    <div className="flex items-center gap-4 min-w-0 relative z-10">
                      {/* Left White Square Icon */}
                      <div className="w-14 h-14 rounded-2xl bg-white text-[#D81B60] flex items-center justify-center shrink-0 shadow-sm">
                        {isFoodLogged ? (
                          <div className="w-8 h-8 rounded-full border-2 border-[#D81B60] flex items-center justify-center">
                            <Plus className="w-5 h-5 stroke-[3] text-[#D81B60]" />
                          </div>
                        ) : (
                          <Utensils className="w-7 h-7 stroke-[2.5]" />
                        )}
                      </div>

                      {/* Card Labels */}
                      <div className="text-left min-w-0">
                        <h2 className="font-extrabold text-lg sm:text-xl leading-tight">
                          {isFoodLogged
                            ? lang === "te"
                              ? "నిన్నటి కోసం మరిన్ని ఆహారాలు చేర్చండి"
                              : lang === "hi"
                              ? "कल के लिए और भोजन जोड़ें"
                              : "Add More Food for\nYesterday"
                            : lang === "te"
                            ? "నిన్నటి ఆహారాన్ని నమోదు చేయండి"
                            : lang === "hi"
                            ? "कल का भोजन दर्ज करें"
                            : "Add food for\nyesterday"}
                        </h2>
                        {!isFoodLogged && (
                          <p className="text-xs text-white/90 font-medium mt-1">
                            {lang === "te"
                              ? "మంగళవారం 13 అక్టోబర్"
                              : lang === "hi"
                              ? "मंगलवार 13 अक्टूबर"
                              : "Tuesday 13 Oct"}
                          </p>
                        )}
                      </div>
                    </div>

                    <ChevronRight className="w-7 h-7 shrink-0 text-white stroke-[2.5]" />
                  </button>

                  {/* ── SECONDARY ACTION: OR SCAN YOUR FOOD (Screenshots 1, 8, 9) */}
                  <div className="text-center -mt-1">
                    <button
                      type="button"
                      onClick={() => setShowCameraModal(true)}
                      className="text-[#D81B60] text-sm font-bold inline-flex items-center gap-1.5 hover:underline cursor-pointer"
                    >
                      <ScanBarcode className="w-4 h-4 stroke-[2.5]" />
                      <span>
                        {lang === "te"
                          ? "లేదా ఆహారాన్ని స్కాన్ చేయండి"
                          : lang === "hi"
                          ? "या भोजन को स्कैन करें"
                          : "or scan your food"}
                      </span>
                    </button>
                  </div>

                  {/* ── CONDITIONAL SECTION 1: PRE-LOGGING FOCUS TRIMESTER (Screenshot 1) */}
                  {!isFoodLogged && (
                    <div className="bg-white border border-slate-100 rounded-3xl p-5 flex flex-col gap-3 shadow-xs">
                      <h3 className="font-extrabold text-sm text-slate-900">
                        {lang === "te"
                          ? "ఈ త్రైమాసికంలో ముఖ్యమైన ఆహారాలు"
                          : lang === "hi"
                          ? "इस तिमाही के मुख्य खाद्य पदार्थ"
                          : "Focus this trimester"}
                      </h3>
                      <div className="grid grid-cols-4 gap-2">
                        {profile.focusDishes.map((item, idx) => (
                          <div key={idx} className="flex flex-col items-center text-center gap-1.5">
                            <div
                              className={`w-14 h-14 rounded-2xl ${item.bgColor} flex items-center justify-center overflow-hidden p-1.5 shadow-2xs`}
                            >
                              <img
                                src={item.image}
                                alt={item.name[lang]}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <span
                              className={`text-[11px] font-bold leading-tight ${
                                idx === 0
                                  ? "text-[#C2185B]"
                                  : idx === 1
                                  ? "text-[#1976D2]"
                                  : idx === 2
                                  ? "text-[#388E3C]"
                                  : "text-[#F57C00]"
                              }`}
                            >
                              {item.name[lang]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── CONDITIONAL SECTION 2: POST-LOGGING CARDS (Screenshots 8 & 9) */}
                  {isFoodLogged && (
                    <>
                      {/* Card A: IFA Tablet Today (Screenshots 8 & 9) */}
                      <div className="bg-[#FFF5F8] border border-pink-200/80 rounded-3xl p-4 flex flex-col gap-3 shadow-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {/* Pill Capsule Icon (Screenshot 8 & 9: Yellow & Red capsule at 45deg) */}
                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-xs shrink-0">
                              <div className="w-5 h-6 relative rotate-[-45deg] flex flex-col rounded-full overflow-hidden shadow-2xs border border-amber-200">
                                <div className="w-full h-1/2 bg-[#FFC107]" />
                                <div className="w-full h-1/2 bg-[#E53935]" />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-extrabold text-sm text-slate-900 leading-tight">
                                {lang === "te"
                                  ? "ఈరోజు IFA మాత్ర"
                                  : lang === "hi"
                                  ? "आज IFA गोली"
                                  : "IFA tablet today"}
                              </h3>
                              <p className="text-[11px] text-slate-500 font-medium">
                                Iron + Folic Acid
                              </p>
                            </div>
                          </div>

                          {/* Toggle Action (Matches Screenshot 8 vs Screenshot 9) */}
                          {ifaTaken ? (
                            <button
                              type="button"
                              onClick={() => {
                                playPop();
                                setIfaTaken(false);
                              }}
                              className="px-3 py-1 rounded-full bg-[#E8F8F0] border border-emerald-200 text-[#2E7D32] text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-2xs"
                            >
                              <div className="w-3.5 h-3.5 rounded-full bg-[#2E7D32] text-white flex items-center justify-center text-[9px] font-bold">
                                ✓
                              </div>
                              <span>{lang === "te" ? "తీసుకున్నారు" : "Taken"}</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  playSuccess();
                                  setIfaTaken(true);
                                }}
                                className="px-3.5 py-1.5 rounded-full bg-[#C2185B] text-white text-xs font-bold shadow-xs hover:bg-[#AD1457] cursor-pointer"
                              >
                                {lang === "te" ? "అవును" : lang === "hi" ? "हाँ" : "Yes"}
                              </button>
                              <button
                                type="button"
                                onClick={() => alert("Please remember to take IFA tablet after lunch or dinner with water!")}
                                className="px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                              >
                                {lang === "te" ? "లేదు" : lang === "hi" ? "नहीं" : "No"}
                              </button>
                            </div>
                          )}
                        </div>

                        {/* 7-Day Adherence Circles (Screenshot 8: empty pink circles; Screenshot 9: Wednesday 'We' checked) */}
                        <div className="border-t border-pink-100/90 pt-2 flex items-center justify-between text-xs text-slate-500">
                          <span className="font-semibold text-[11px]">
                            {lang === "te" ? "గత 7 రోజులు" : "Past 7 days"}
                          </span>
                          <div className="flex items-center gap-2">
                            {["Th", "Fr", "Sa", "Su", "Mo", "Tu", "We"].map((day, idx) => {
                              const isWed = idx === 6;
                              const isChecked = isWed && ifaTaken;
                              return (
                                <div key={day} className="flex flex-col items-center gap-1">
                                  <span className="text-[10px] font-bold text-slate-400">{day}</span>
                                  <div
                                    className={`w-4 h-4 rounded-full flex items-center justify-center border text-[8px] font-extrabold ${
                                      isChecked
                                        ? "bg-[#D81B60] text-white border-[#D81B60] shadow-2xs"
                                        : "border-pink-300 bg-white text-transparent"
                                    }`}
                                  >
                                    {isChecked ? "✔" : ""}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Card B: Add Greens Today (Screenshots 8 & 9) */}
                      <div className="bg-white border border-slate-100 rounded-3xl p-4 flex items-center gap-3.5 shadow-xs">
                        <img
                          src="/mother_app/greens_bowl.png"
                          alt="Greens Salad"
                          className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-xs"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D81B60] bg-pink-100 px-2 py-0.5 rounded-md inline-block">
                            {lang === "te" ? "ఆకుకూరలు" : "GREENS"}
                          </span>
                          <h3 className="font-extrabold text-sm text-slate-900 leading-snug mt-1">
                            {lang === "te"
                              ? "ఈరోజు ఆకుకూరలు చేర్చండి"
                              : lang === "hi"
                              ? "आज भोजन में साग शामिल करें"
                              : "Add greens today"}
                          </h3>
                          <p className="text-xs text-slate-600 leading-relaxed mt-0.5 line-clamp-2">
                            {lang === "te"
                              ? "తోటకూర లేదా మునగాకు సులభంగా లభిస్తుంది — మీ భోజనంలో చిన్న భాగం చేర్చడం వల్ల బిడ్డ బలంగా ఎదుగుతుంది."
                              : "Amaranth leaves is available and easy — a small portion in your meal helps your baby grow."}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* ── BOTTOM BUTTON: ASHA VISIT (Screenshots 1, 8, 9) ───────── */}
              <div className="px-5 pt-3 pb-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    playPop();
                    navigate({ to: "/visit" });
                  }}
                  className="w-full py-3 px-6 rounded-full border-2 border-[#D81B60] text-[#D81B60] bg-white hover:bg-pink-50 font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs transition active:scale-98 cursor-pointer"
                >
                  <Calendar className="w-5 h-5 text-[#D81B60]" />
                  <span>
                    {lang === "te"
                      ? "ఆశా గృహ సందర్శన (ASHA Visit)"
                      : "ASHA Visit"}
                  </span>
                </button>
              </div>
            </motion.main>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* 2. SCREEN: MEAL LOGGING (Screenshots 2, 3, 4, 5, 6)            */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {view === "log" && (
            <motion.div
              key="mother-log"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                {/* ── HEADER (Screenshots 2 & 6) ─────────────────────────── */}
                <div className="sticky top-0 bg-white z-30 border-b border-slate-100 px-4 pt-4 pb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={() => setView("home")}
                      className="p-1 -ml-1 text-slate-800 hover:text-slate-900 cursor-pointer"
                      aria-label="Back to Home"
                    >
                      <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
                    </button>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h2 className="font-extrabold text-base text-slate-900 leading-tight truncate">
                          {lang === "te" ? "నిన్న మీరు ఏమి తిన్నారు?" : "What did you eat yesterday?"}
                        </h2>

                        {/* Pink "2 added" Pill (Screenshot 6) */}
                        {selectedDishes.length > 0 && (
                          <span className="bg-[#F8BBD0] text-[#C2185B] text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shrink-0">
                            {selectedDishes.length} {lang === "te" ? "చేర్చారు" : "added"}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {lang === "te" ? "మంగళ, 13 అక్టోబర్" : "Tue, 13 Oct"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => setShowSearch((v) => !v)}
                      aria-label="Search food"
                      className="p-2 rounded-full hover:bg-slate-100 text-slate-700 cursor-pointer"
                    >
                      <Search className="w-5 h-5 stroke-[2.5]" />
                    </button>

                    <button
                      type="button"
                      onClick={() => setView("home")}
                      aria-label="Home"
                      className="p-2 rounded-full hover:bg-slate-100 text-slate-700 cursor-pointer"
                    >
                      <Home className="w-5 h-5 stroke-[2.5]" />
                    </button>
                  </div>
                </div>

                {/* Optional Search Bar */}
                {showSearch && (
                  <div className="p-3 bg-pink-50 border-b border-pink-100">
                    <input
                      type="text"
                      placeholder={lang === "te" ? "వంటకాన్ని వెతకండి..." : "Search dishes (e.g. Idli, Rice)..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-pink-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#D81B60]"
                    />
                  </div>
                )}

                {/* ── 4 CATEGORY TABS (Screenshot 2, 3, 4, 5, 6) ─────────── */}
                <div className="grid grid-cols-4 border-b border-slate-100 bg-white">
                  {[
                    { id: "breakfast" as MealTab, label: { en: "Breakfast", te: "టిఫిన్", hi: "नाश्ता" }, icon: Sun },
                    { id: "meals" as MealTab, label: { en: "Meals", te: "భోజనం", hi: "भोजन" }, icon: Utensils },
                    { id: "fruits_nuts" as MealTab, label: { en: "Fruits/Nuts", te: "పండ్లు", hi: "फल/मेवे" }, icon: Apple },
                    { id: "snacks" as MealTab, label: { en: "Snacks", te: "స్నాక్స్", hi: "नाश्ता" }, icon: Coffee },
                  ].map((tab) => {
                    const isActive = activeTab === tab.id;
                    const Icon = tab.icon;
                    const countInTab = getSelectedCountForTab(tab.id);

                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          playPop();
                          setActiveTab(tab.id);
                        }}
                        className={`py-3 flex flex-col items-center gap-1.5 transition cursor-pointer relative ${
                          isActive ? "text-[#D81B60] font-extrabold" : "text-slate-500 hover:text-slate-800 font-semibold"
                        }`}
                      >
                        <div className="relative">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition ${
                              isActive
                                ? "border-2 border-[#D81B60] bg-pink-50/50 text-[#D81B60]"
                                : "bg-slate-100/80 text-slate-500"
                            }`}
                          >
                            <Icon className="w-6 h-6 stroke-[2]" />
                          </div>

                          {/* Solid Berry Circle Count Badge on Tab Icon (Screenshot 6) */}
                          {countInTab > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#D81B60] text-white text-[10px] font-extrabold flex items-center justify-center shadow-xs">
                              {countInTab}
                            </span>
                          )}
                        </div>

                        <span className="text-xs">{tab.label[lang]}</span>

                        {/* Active Tab Underline Bar (Screenshot 2, 3, 4, 5, 6) */}
                        {isActive && (
                          <div className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#D81B60] rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* ── 3-COLUMN FOOD GRID (Screenshots 2, 3, 4, 5, 6) ─────── */}
                <div className="p-3 pb-28 grid grid-cols-3 gap-2.5">
                  {tabDishes.map((dish) => {
                    const isSelected = selectedDishes.includes(dish.id);

                    return (
                      <button
                        key={dish.id}
                        type="button"
                        onClick={() => toggleDishSelection(dish.id)}
                        className={`rounded-2xl overflow-hidden transition active:scale-[0.98] cursor-pointer flex flex-col bg-white shadow-2xs ${
                          isSelected
                            ? "border-2 border-[#D81B60]"
                            : "border border-slate-200/90 hover:border-slate-300"
                        }`}
                      >
                        {/* Food Image (Image already includes authentic veg icon [⊡]) */}
                        <div className="relative w-full aspect-square overflow-hidden bg-slate-100">
                          <img
                            src={dish.image}
                            alt={dish.name[lang]}
                            className="w-full h-full object-cover"
                          />

                          {/* Green Circle Checkmark on top-right when selected (Screenshot 6) */}
                          {isSelected && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        {/* Clean Dish Label (Screenshot 2 & 6: Clean white or pink strip, NO tags) */}
                        <div
                          className={`p-2 flex-1 flex items-center ${
                            isSelected ? "bg-[#FCE4EC]" : "bg-white"
                          }`}
                        >
                          <p
                            className={`text-xs font-bold leading-tight line-clamp-2 ${
                              isSelected ? "text-[#D81B60]" : "text-slate-900"
                            }`}
                          >
                            {dish.name[lang]}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── STICKY BOTTOM BUTTON (Screenshot 2 vs Screenshot 6) ─── */}
              <div className="sticky bottom-0 bg-white/95 backdrop-blur-md border-t border-slate-100 p-4 z-40">
                {selectedDishes.length === 0 ? (
                  /* Disabled button when 0 items (Screenshot 2, 3, 4, 5) */
                  <button
                    type="button"
                    disabled
                    className="w-full py-3.5 px-4 rounded-full bg-[#EFE9EC] text-white/90 font-extrabold text-sm flex items-center justify-center gap-2 cursor-not-allowed shadow-2xs"
                  >
                    <div className="w-4 h-4 rounded-full bg-white/50 text-white flex items-center justify-center text-[10px] font-bold">
                      ✓
                    </div>
                    <span>
                      {lang === "te" ? "సేవ్ చేయడానికి వంటకాలను ఎంచుకోండి" : "Select items to save"}
                    </span>
                  </button>
                ) : (
                  /* Solid Berry Pink Save Button (Screenshot 6) */
                  <button
                    type="button"
                    onClick={handleSaveDishes}
                    className="w-full py-3.5 px-6 rounded-full bg-[#D81B60] text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-lg shadow-pink-900/20 active:scale-98 transition cursor-pointer"
                  >
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>
                      {lang === "te"
                        ? `సేవ్ చేయండి (${selectedDishes.length} వంటకాలు)`
                        : `Save (${selectedDishes.length} items)`}
                    </span>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* 3. SCREEN: CELEBRATION / UNLOCKED (Matches Screenshot 7)       */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {view === "celebration" && (
            <motion.div
              key="mother-celebration"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col items-center justify-between p-6 pt-10 text-center relative overflow-y-auto"
            >
              <div className="flex-1 flex flex-col items-center justify-center gap-4 w-full max-w-xs">
                {/* Baby Sprout Illustration (Image 4: Pure circle, zero square artifacts) */}
                <div
                  className="relative flex items-center justify-center my-3 cursor-pointer group"
                  onClick={() => {
                    playPop();
                    setView("baby");
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="View Your Baby"
                >
                  <div className="w-56 h-56 rounded-full overflow-hidden shadow-xs flex items-center justify-center transition-transform hover:scale-102 active:scale-95 bg-transparent">
                    <img
                      src="/mother_app/baby_sprout_v3.png"
                      alt="Baby with sprout"
                      className="w-full h-full object-cover rounded-full pointer-events-none"
                    />
                  </div>
                </div>

                {/* Food Groups Covered Pill Badge (Screenshot 7) */}
                <div className="bg-[#F8BBD0] text-[#D81B60] px-6 py-2 rounded-full font-extrabold text-base shadow-xs">
                  {lang === "te"
                    ? `${mddwAnalysis.coveredCount} ఆహార సమూహాలు పూర్తయ్యాయి`
                    : `${mddwAnalysis.coveredCount} food groups covered`}
                </div>

                {/* White Card: "Every meal you log helps your baby." (Screenshot 7) */}
                <div className="w-full bg-white border border-slate-100 rounded-2xl p-5 shadow-sm text-center">
                  <h3 className="font-extrabold text-slate-800 text-base leading-snug">
                    {lang === "te"
                      ? "మీరు నమోదు చేసే ప్రతి భోజనం మీ బిడ్డ ఎదుగుదలకు తోడ్పడుతుంది."
                      : "Every meal you log helps your baby."}
                  </h3>
                </div>

                {/* Progress Countdown Bar (Screenshot 7) */}
                <div className="w-full flex flex-col gap-1.5 mt-1">
                  <div className="w-full h-1 bg-pink-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#D81B60]"
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 9, ease: "linear" }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    {lang === "te" ? `${countdown}సె లో హోమ్‌కి వెళుతుంది` : `Returning to home in ${countdown}s`}
                  </p>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="w-full max-w-xs flex flex-col gap-3 pt-4">
                {/* Solid Berry Pink "x Go to Home" Button (Screenshot 7) */}
                <button
                  type="button"
                  onClick={() => setView("home")}
                  className="w-full py-3.5 px-6 rounded-full bg-[#D81B60] text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-md hover:bg-[#C2185B] active:scale-98 transition cursor-pointer"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                  <span>{lang === "te" ? "హోమ్‌కి వెళ్ళండి" : "Go to Home"}</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══════════════════════════════════════════════════════════════ */}
          {/* 4. SCREEN: YOUR BABY INSIGHTS (Matches Images 2 & 3)           */}
          {/* ═══════════════════════════════════════════════════════════════ */}
          {view === "baby" && (
            <motion.div
              key="mother-baby"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 flex flex-col justify-between overflow-y-auto bg-[#FFF5F8]/40"
            >
              <div className="pb-8">
                {/* ── HEADER (Image 2) ─────────────────────────────────── */}
                <div className="sticky top-0 bg-white z-30 border-b border-slate-100 px-4 py-3.5 flex items-center justify-between shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setView("home")}
                    className="p-1 -ml-1 text-slate-800 hover:text-slate-900 cursor-pointer"
                    aria-label="Back to Home"
                  >
                    <ArrowLeft className="w-6 h-6 stroke-[2.5]" />
                  </button>

                  <h1 className="font-extrabold text-lg text-slate-900 tracking-tight">
                    {lang === "te" ? "మీ బిడ్డ (Your Baby)" : "Your Baby"}
                  </h1>

                  <button
                    type="button"
                    onClick={() => setView("home")}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-700 cursor-pointer"
                    aria-label="Home"
                  >
                    <Home className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>

                {/* ── BODY SECTIONS (Images 2 & 3) ────────────────────── */}
                <div className="p-4 flex flex-col gap-4">
                  {/* Card 1: Baby Gestational Status (Image 2) */}
                  <div className="bg-white rounded-3xl border border-pink-100/80 p-5 flex flex-col items-center text-center gap-3.5 shadow-xs">
                    {/* Week & Trimester Pill */}
                    <div className="bg-[#FCE4EC] text-slate-700 font-extrabold text-xs px-3.5 py-1 rounded-full border border-pink-200/60 shadow-2xs">
                      {lang === "te"
                        ? `${profile.week}వ వారం, 0వ రోజు · T${profile.trimester}`
                        : `Week ${profile.week}, Day 0 · T${profile.trimester}`}
                    </div>

                    {/* Pure Circular Baby Illustration (Image 2: 100% circle, zero square artifacts) */}
                    <div className="relative flex items-center justify-center my-1">
                      <div className="w-52 h-52 rounded-full overflow-hidden shadow-xs flex items-center justify-center bg-transparent">
                        <img
                          src="/mother_app/baby_circle_v3.png"
                          alt="Baby in womb"
                          className="w-full h-full object-cover rounded-full pointer-events-none"
                        />
                      </div>
                    </div>

                    {/* Baby Size Comparison Box: Brinjal (Image 2) */}
                    <div className="w-full rounded-2xl bg-[#FFF0F5] border border-pink-100 p-4 flex items-center gap-3.5 text-left shadow-2xs">
                      <div className="w-13 h-13 rounded-2xl bg-white shadow-xs flex items-center justify-center text-3xl shrink-0">
                        🍆
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium leading-tight">
                          {lang === "te" ? "మీ బిడ్డ పరిమాణం ఒక" : "Your baby is the size of a"}
                        </p>
                        <h3 className="font-extrabold text-lg text-slate-900 leading-snug">
                          {lang === "te" ? "వంకాయ (Brinjal)" : "Brinjal"}
                        </h3>
                        <p className="text-xs text-slate-600 font-semibold mt-0.5">
                          1.0 kg
                        </p>
                      </div>
                    </div>

                    {/* Delivery Countdown Section (Image 2) */}
                    <div className="w-full border-t border-slate-100 pt-3 text-left">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-extrabold text-slate-900">83</span>
                        <span className="text-sm font-bold text-slate-600">
                          {lang === "te" ? "రోజులు మిగిలి ఉన్నాయి" : "days to go"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-medium mt-0.5">
                        {lang === "te" ? "డెలివరీ అంచనా · 11 జనవరి 2027" : "Expected delivery · 11 January 2027"}
                      </p>

                      {/* Gestational Progress Timeline */}
                      <div className="w-full h-1.5 bg-slate-100 rounded-full relative my-3 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-400 to-[#D81B60] rounded-full"
                          style={{ width: "70%" }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                        <span>Week 28</span>
                        <span>Week 40</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: "Your baby can now..." (Image 2 & 3) */}
                  <div className="bg-white rounded-3xl border border-pink-100/80 p-5 flex flex-col gap-3.5 shadow-xs">
                    <h2 className="font-extrabold text-sm text-slate-900 tracking-tight">
                      {lang === "te" ? "మీ బిడ్డ ఇప్పుడు చేయగలిగేవి..." : "Your baby can now..."}
                    </h2>

                    <div className="flex flex-col gap-3">
                      {/* Milestone 1 */}
                      <div className="flex items-start gap-3">
                        <span className="text-2xl p-2 rounded-xl bg-amber-50 shrink-0">👂</span>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                            {lang === "te" ? "మీ స్వరాన్ని వినగలరు" : "Hear your voice"}
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                            {lang === "te"
                              ? "మీ బిడ్డ మీ గొంతును గుర్తిస్తుంది మరియు దానిని ఓదార్పుగా భావిస్తుంది."
                              : "Your baby recognises you and finds it calming."}
                          </p>
                        </div>
                      </div>

                      <div className="h-px bg-slate-100" />

                      {/* Milestone 2 */}
                      <div className="flex items-start gap-3">
                        <span className="text-2xl p-2 rounded-xl bg-sky-50 shrink-0">👁️</span>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                            {lang === "te" ? "కళ్ళు తెరవడం మరియు మూయడం" : "Open and close eyes"}
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                            {lang === "te"
                              ? "మీ చర్మం గుండా వచ్చే కాంతికి కనుపాపలు ప్రతిస్పందిస్తాయి."
                              : "Pupils respond to bright light through your skin."}
                          </p>
                        </div>
                      </div>

                      <div className="h-px bg-slate-100" />

                      {/* Milestone 3 */}
                      <div className="flex items-start gap-3">
                        <span className="text-2xl p-2 rounded-xl bg-pink-50 shrink-0">🫁</span>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                            {lang === "te" ? "శ్వాస సాధన" : "Practise breathing"}
                          </h4>
                          <p className="text-xs text-slate-500 leading-relaxed mt-0.5">
                            {lang === "te"
                              ? "బయటి ప్రపంచంలో జీవనం కోసం ఊపిరితిత్తులు బలపడుతున్నాయి."
                              : "Lungs are getting stronger for life outside."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Yesterday's Nutrition (Image 3) */}
                  <div className="bg-white rounded-3xl border border-pink-100/80 p-5 flex flex-col gap-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-extrabold text-sm text-slate-900">
                          {lang === "te" ? "నిన్నటి పోషకాహారం" : "Yesterday's nutrition"}
                        </h2>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                          {lang === "te"
                            ? `10 ఆహార సమూహాలలో ${mddwAnalysis.coveredCount} పూర్తయ్యాయి`
                            : `${mddwAnalysis.coveredCount} of 10 food groups covered`}
                        </p>
                      </div>

                      {/* Red Badge (Image 3) */}
                      <div className="w-10 h-10 rounded-full bg-[#C2185B] text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                        {mddwAnalysis.coveredCount}/10
                      </div>
                    </div>

                    {/* Horizontal Food Groups Scroll (Image 3) */}
                    <div className="flex items-stretch gap-2.5 overflow-x-auto pb-2 pt-1 no-scrollbar">
                      {MDDW_GROUP_INFO.map((grp) => {
                        const isCovered = mddwAnalysis.coveredGroupIds.includes(grp.id);
                        return (
                          <div
                            key={grp.id}
                            className={`w-21 rounded-2xl p-2.5 flex flex-col items-center text-center justify-between gap-1.5 shrink-0 transition relative ${
                              isCovered
                                ? "border-2 border-emerald-500 bg-emerald-50/40 shadow-xs"
                                : "border border-slate-200/80 bg-white"
                            }`}
                          >
                            {isCovered && (
                              <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-extrabold shadow-2xs">
                                ✓
                              </div>
                            )}
                            <span className="text-2xl mt-0.5">{grp.emoji}</span>
                            <p className="text-[10px] font-bold text-slate-800 leading-tight">
                              {grp.name[lang]}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card 4: Eat More This Trimester (Image 3) */}
                  <div className="bg-white rounded-3xl border border-pink-100/80 p-5 flex flex-col gap-3 shadow-xs">
                    <div>
                      <h2 className="font-extrabold text-sm text-slate-900">
                        {lang === "te" ? "ఈ త్రైమాసికంలో ఎక్కువగా తినాల్సినవి" : "Eat more this trimester"}
                      </h2>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {lang === "te" ? "ఆకుపచ్చ అంచు = ఈ వారం తిన్నవి" : "Green border = logged this week"}
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {profile.focusDishes.map((item, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center gap-1.5">
                          <div
                            className={`w-14 h-14 rounded-2xl ${item.bgColor} flex items-center justify-center overflow-hidden p-1.5 shadow-2xs ${
                              idx === 1 ? "border-2 border-emerald-500" : ""
                            }`}
                          >
                            <img
                              src={item.image}
                              alt={item.name[lang]}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="text-[11px] font-bold text-slate-800 leading-tight">
                            {item.name[lang]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card 5: Learn & Discover (Image 3) */}
                  <div className="bg-white rounded-3xl border border-pink-100/80 p-5 flex flex-col gap-3 shadow-xs mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="font-extrabold text-sm text-slate-900">
                          {lang === "te" ? "నేర్చుకోండి & తెలుసుకోండి" : "Learn & Discover"}
                        </h2>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {lang === "te"
                            ? "పోషకాహారం, ఆరోగ్యం మరియు వ్యాయామాలపై సమాచారం"
                            : "Videos and articles on nutrition, health and exercises"}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-slate-700 hover:text-[#D81B60] transition cursor-pointer">
                        {lang === "te" ? "మరిన్ని చూడండి →" : "Explore More →"}
                      </span>
                    </div>

                    {/* Article Card (Image 3) */}
                    <div className="w-full rounded-2xl border border-slate-100 p-3 flex items-center justify-between gap-3 shadow-2xs hover:bg-slate-50 transition cursor-pointer">
                      <img
                        src="/mother_app/greens_bowl.png"
                        alt="Healthy meal"
                        className="w-14 h-14 rounded-2xl object-cover shrink-0 shadow-2xs"
                      />
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2">
                          {lang === "te"
                            ? "గర్భధారణ సమయంలో సరైన ఆహారం: మీ బిడ్డకు అవసరమైన పోషకాలు"
                            : "Eating well during pregnancy: What your baby needs"}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium mt-1">
                          5 min · Nutrition
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── ANNAPURNA TELUGU FOOD SCANNER INTEGRATION MODAL ──────────────── */}
        {showCameraModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-5 max-w-sm w-full flex flex-col gap-4 shadow-2xl text-left max-h-[90dvh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-pink-100 text-[#D81B60] flex items-center justify-center text-xl shadow-xs">
                    📸
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">
                      Annapurna Telugu Food Scanner
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      ICMR-NIN (Hyderabad) + Gemini Vision AI
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCameraModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Hidden Native File & Camera Input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleScanFile}
                className="hidden"
              />

              {/* Live AI Food Scan with Gemini + Port 8005 */}
              <button
                type="button"
                disabled={isScanning}
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#D81B60] to-[#C2185B] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:opacity-95 active:scale-98 transition cursor-pointer disabled:opacity-75"
              >
                {isScanning ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Camera className="w-4 h-4 stroke-[2.5]" />
                )}
                <span>
                  {isScanning
                    ? (lang === "te" ? "ఆహారాన్ని గుర్తిస్తున్నాము..." : "Analyzing with Gemini Vision...")
                    : (lang === "te" ? "ఫోటో తీయండి లేదా అప్‌లోడ్ చేయండి" : "Scan Meal Photo / Open Camera")}
                </span>
              </button>

              {/* Scan Error Notice if offline */}
              {scanError && (
                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-medium">
                  {scanError}
                </div>
              )}

              {/* Direct Link to Standalone Web UI on Port 8005 */}
              <a
                href="http://localhost:8005"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 rounded-2xl border border-pink-200 bg-white text-[#D81B60] font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-pink-50 transition cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open Full Scanner Web App (Port 8005) ↗</span>
              </a>

              {/* Or Quick Scan in App */}
              <div className="border border-pink-100 rounded-2xl p-3.5 bg-[#FFF5F8]/50 flex flex-col gap-2.5">
                <span className="text-xs font-extrabold text-[#D81B60] uppercase tracking-wider">
                  Quick In-App Dish Recognition
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Select or snap an Andhra dish to analyze with our Telugu catalog & log food groups:
                </p>

                {/* 1-Click Telugu Dish Presets from Catalog */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {[
                    { id: "pesarattu", name: "Pesarattu (పెసరట్టు)", groups: ["pulses"] },
                    { id: "idli", name: "Idli (ఇడ్లీ)", groups: ["grains", "pulses"] },
                    { id: "pappu_annam", name: "Pappu Rice (పప్పు అన్నం)", groups: ["grains", "pulses"] },
                    { id: "palakura_pappu", name: "Palakura Pappu (పాలకూర)", groups: ["pulses", "dglv"] },
                    { id: "boiled_egg", name: "Boiled Egg (కోడిగుడ్డు)", groups: ["eggs"] },
                    { id: "banana", name: "Banana (అరటిపండు)", groups: ["otherFruit"] },
                  ].map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => {
                        setSelectedDishes((prev) => Array.from(new Set([...prev, sample.id])));
                        playSuccess();
                        setShowCameraModal(false);
                        setView("celebration");
                      }}
                      className="p-2 rounded-xl bg-white border border-pink-200/80 hover:border-[#D81B60] text-left transition text-xs font-bold text-slate-800 shadow-2xs hover:bg-pink-50/50 flex flex-col gap-0.5 cursor-pointer"
                    >
                      <span className="truncate">{sample.name}</span>
                      <span className="text-[10px] text-[#D81B60] font-semibold">
                        +{sample.groups.length} groups
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 w-full pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDishes(["pesarattu", "idli"]);
                    playSuccess();
                    setShowCameraModal(false);
                    setView("celebration");
                  }}
                  className="flex-1 py-2.5 rounded-full bg-[#D81B60] text-white font-bold text-xs shadow-xs hover:bg-[#C2185B] cursor-pointer"
                >
                  Auto-Log Identified Plate (2 groups)
                </button>
                <button
                  type="button"
                  onClick={() => setShowCameraModal(false)}
                  className="px-4 py-2.5 rounded-full bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
