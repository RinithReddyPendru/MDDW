import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Upload,
  Clipboard,
  RefreshCw,
  Check,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  Flame,
  Dumbbell,
  HeartPulse,
  Zap,
  Sliders,
  ChevronDown,
  ChevronUp,
  Info,
} from "lucide-react";
import { useLang } from "@/lib/mddw/useLang";
import { LANGS, type Lang } from "@/lib/mddw/translations";
import { isMuted, toggleMute, playSuccess, playPop } from "@/lib/mddw/audio";

export const Route = createFileRoute("/scanner")({
  head: () => ({
    meta: [
      { title: "Smart Telugu Food Scanner – ICMR-NIN & MDD-W" },
      { name: "description", content: "AI food image recognition with ICMR-NIN nutrition values and MDD-W 10 food groups diversity tracking." },
    ],
  }),
  component: ScannerPage,
  errorComponent: ScannerErrorFallback,
});

interface ScannedItem {
  name_en: string;
  name_te: string;
  cluster?: string;
  estimated_grams: number;
  catalog_id?: string;
  food_groups?: string[];
  per_100g?: Record<string, number>;
}

interface ScanTotals {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  iron_mg: number;
  calcium_mg: number;
  folate_ug: number;
  vit_a_ug: number;
  vit_c_mg: number;
  sodium_mg: number;
  total_grams?: number;
}

interface ScanResponse {
  is_food_image: boolean;
  plate_title_en: string;
  plate_title_te: string;
  meal_type?: string;
  items: ScannedItem[];
  totals: ScanTotals;
  mddw_diversity?: {
    food_group_codes: string[];
    food_group_names_en: string[];
    food_group_names_te: string[];
    mddw_score: number;
    meets_mddw_threshold: boolean;
  };
  model_used?: string;
  usage_and_cost?: {
    total_tokens?: number;
    estimated_paid_cost_inr?: number;
    cached?: boolean;
  };
  error?: string;
}

const MDDW_FOOD_GROUPS: { code: string; emoji: string; name: Record<Lang, string> }[] = [
  { code: "G1", emoji: "🌾", name: { en: "Grains & Tubers", te: "ధాన్యాలు & దుంపలు", hi: "अनाज और कंद" } },
  { code: "G2", emoji: "🫘", name: { en: "Pulses & Dal", te: "పప్పు ధాన్యాలు", hi: "दालें और फलियां" } },
  { code: "G3", emoji: "🥜", name: { en: "Nuts & Seeds", te: "గింజలు & పల్లీలు", hi: "मेवे और तिलहन" } },
  { code: "G4", emoji: "🥛", name: { en: "Dairy & Milk", te: "పాలు & పెరుగు", hi: "दूध और दही" } },
  { code: "G5", emoji: "🍗", name: { en: "Meat & Fish", te: "మాంసం & చేపలు", hi: "मांस और मछली" } },
  { code: "G6", emoji: "🥚", name: { en: "Eggs", te: "కోడిగుడ్లు", hi: "अंडे" } },
  { code: "G7", emoji: "🥬", name: { en: "Dark Green Greens", te: "ఆకుకూరలు (తోటకూర, పాలకూర)", hi: "हरी पत्तेदार सब्जियां" } },
  { code: "G8", emoji: "🥕", name: { en: "Vitamin-A Veg/Fruits", te: "విటమిన్-ఎ కూరలు (క్యారెట్, బొప్పాయి)", hi: "विटामिन-ए युक्त सब्जियां" } },
  { code: "G9", emoji: "🍅", name: { en: "Other Vegetables", te: "ఇతర కూరగాయలు (వంకాయ, బెండ)", hi: "अन्य सब्जियां" } },
  { code: "G10", emoji: "🍌", name: { en: "Other Fruits", te: "ఇతర పండ్లు (అరటి, జామ)", hi: "अन्य फल" } },
];

const SCANNER_API_URL = "https://telugu-food-scanner.vercel.app/api/v1/scan";

const SAMPLE_DISHES = [
  { id: "pesarattu", name: "పెసరట్టు (Pesarattu)", emoji: "🥞", hint: "Breakfast" },
  { id: "gutti_vankaya", name: "గుత్తి వంకాయ కూర (Gutti Vankaya)", emoji: "🍆", hint: "Lunch Curry" },
  { id: "biryani", name: "రొయ్యలు/చికెన్ బిర్యానీ (Biryani)", emoji: "🍗", hint: "Meals" },
  { id: "gongura_pappu", name: "గోంగూర పప్పు (Gongura Pappu)", emoji: "🥬", hint: "Dal" },
  { id: "keera_salad", name: "కీరా దోసకాయ సలాడ్ (Cucumber Salad)", emoji: "🥒", hint: "Raw Salad" },
];

function ScannerPage() {
  const { lang, setLang, t } = useLang();
  const navigate = useNavigate();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Portion & Oil Modifiers
  const [portionFactor, setPortionFactor] = useState(1.0);
  const [oilModifier, setOilModifier] = useState<"low" | "mod" | "high">("mod");
  const [showMicronutrients, setShowMicronutrients] = useState(false);
  const [preferredModel, setPreferredModel] = useState("auto");

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  // Listen for Ctrl+V paste
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.startsWith("image/")) {
          const file = items[i].getAsFile();
          if (file) {
            handleImageFile(file);
            break;
          }
        }
      }
    };
    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  // Client-side image compression to 800px max JPEG (~80-120KB)
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 800;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = Math.round((h * maxDim) / w);
              w = maxDim;
            } else {
              w = Math.round((w * maxDim) / h);
              h = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(file);
            return;
          }
          ctx.drawImage(img, 0, 0, w, h);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else resolve(file);
            },
            "image/jpeg",
            0.85
          );
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleImageFile = async (file: File) => {
    try {
      setErrorMsg(null);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setSelectedFile(file);
      playPop();
      await triggerScan(file);
    } catch (err: any) {
      setErrorMsg(err.message || "చిత్రాన్ని చదవడం సాధ్యం కాలేదు (Failed to read image)");
    }
  };

  const triggerScan = async (file: File) => {
    setIsScanning(true);
    setErrorMsg(null);
    try {
      const compressedBlob = await compressImage(file);
      const formData = new FormData();
      formData.append("file", compressedBlob, "food_scan.jpg");
      if (preferredModel !== "auto") {
        formData.append("preferred_model", preferredModel);
      }

      const res = await fetch(SCANNER_API_URL, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`API ${res.status}: ${errText.slice(0, 100)}`);
      }

      const data: ScanResponse = await res.json();
      if (!data.is_food_image) {
        setErrorMsg(
          lang === "te"
            ? "చిత్రంలో ఆహారం స్పష్టంగా కనిపించడం లేదు. దయచేసి స్పష్టమైన ఆహార ప్లేట్ ఫోటోను తీయండి."
            : "No food clearly detected. Please take a clear photo of the food plate."
        );
      } else {
        setScanResult(data);
        setPortionFactor(1.0);
        setOilModifier("mod");
        playSuccess();
      }
    } catch (err: any) {
      setErrorMsg(
        lang === "te"
          ? "స్కానింగ్ విఫలమైంది. దయచేసి నెట్‌వర్క్ కనెక్షన్‌ను తనిఖీ చేసి మళ్ళీ ప్రయత్నించండి."
          : `Scan error: ${err.message || "Failed to reach Annapurna Scanner API"}`
      );
    } finally {
      setIsScanning(false);
    }
  };

  // Nutrition adjustment based on portion & oil modifier
  const computeAdjustedNutrition = () => {
    if (!scanResult || !scanResult.totals) return null;
    const base = scanResult.totals;
    const oilMult = oilModifier === "low" ? 0.85 : oilModifier === "high" ? 1.2 : 1.0;
    const adjGrams = Math.round((base.total_grams || 250) * portionFactor);

    // Fat scales with portion * oil
    const fat = Math.round(base.fat_g * portionFactor * oilMult * 10) / 10;
    const deltaFat = fat - base.fat_g * portionFactor;
    const calories = Math.max(0, Math.round(base.calories * portionFactor + deltaFat * 9.0));

    return {
      calories,
      protein_g: Math.round(base.protein_g * portionFactor * 10) / 10,
      carbs_g: Math.round(base.carbs_g * portionFactor * 10) / 10,
      fat_g: fat,
      fiber_g: Math.round(base.fiber_g * portionFactor * 10) / 10,
      iron_mg: Math.round(base.iron_mg * portionFactor * 100) / 100,
      calcium_mg: Math.round(base.calcium_mg * portionFactor * 10) / 10,
      folate_ug: Math.round(base.folate_ug * portionFactor * 10) / 10,
      vit_a_ug: Math.round(base.vit_a_ug * portionFactor * 10) / 10,
      vit_c_mg: Math.round(base.vit_c_mg * portionFactor * 10) / 10,
      sodium_mg: Math.round(base.sodium_mg * portionFactor),
      total_grams: adjGrams,
    };
  };

  const adjustedNutrition = computeAdjustedNutrition();

  const resetScanner = () => {
    setImagePreview(null);
    setSelectedFile(null);
    setScanResult(null);
    setErrorMsg(null);
    playPop();
  };

  return (
    <main className="min-h-dvh flex flex-col bg-gradient-to-b from-amber-50/70 via-background to-background text-foreground pb-12">
      {/* Sticky Navigation Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border shadow-xs">
        <div className="mx-auto max-w-xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="inline-flex items-center justify-center h-10 w-10 rounded-full text-foreground hover:bg-muted active:scale-95 transition"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-base font-bold leading-tight flex items-center gap-1.5 text-amber-900 dark:text-amber-300">
                <span>📸</span>
                <span>{lang === "te" ? "స్మార్ట్ ఆహార స్కానర్" : lang === "hi" ? "स्मार्ट फूड स्कैनर" : "Telugu Food Scanner"}</span>
              </h1>
              <p className="text-[11px] text-muted-foreground leading-tight">
                ICMR-NIN IFCT 2017 & MDD-W (Hyderabad)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              aria-label="Language"
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              className="rounded-lg border border-border bg-card px-2 py-1.5 text-xs font-semibold"
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <div className="mx-auto w-full max-w-xl px-4 py-6 flex flex-col gap-6">
        {/* Hidden File Inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleImageFile(e.target.files[0])}
        />

        {/* Viewfinder / Preview Hero Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-amber-600/30 bg-black aspect-[4/3] flex items-center justify-center">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Scanned Food"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center text-amber-100">
              <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mb-3 border border-amber-400/40">
                <Camera className="w-8 h-8 text-amber-400" />
              </div>
              <p className="font-bold text-lg text-white">
                {lang === "te" ? "ఆహార ప్లేట్ ఫోటోను తీయండి" : "Capture or Upload Food Plate"}
              </p>
              <p className="text-xs text-amber-200/80 mt-1 max-w-xs">
                {lang === "te"
                  ? "ఆంధ్రా & తెలంగాణ వంటకాలు, టిఫిన్లు, పప్పులు, కూరలను తక్షణమే గుర్తిస్తుంది"
                  : "Identifies authentic Telugu curries, dals, tiffins, and salads"}
              </p>
            </div>
          )}

          {/* Golden Viewfinder Framing Corners */}
          <div className="absolute top-4 left-4 w-7 h-7 border-t-4 border-l-4 border-amber-400 rounded-tl-lg pointer-events-none" />
          <div className="absolute top-4 right-4 w-7 h-7 border-t-4 border-r-4 border-amber-400 rounded-tr-lg pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-7 h-7 border-b-4 border-l-4 border-amber-400 rounded-bl-lg pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-7 h-7 border-b-4 border-r-4 border-amber-400 rounded-br-lg pointer-events-none" />

          {/* Scanning Radar Overlay Animation */}
          {isScanning && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center gap-3 text-white z-20">
              <div className="w-16 h-16 rounded-full border-4 border-amber-400 border-t-transparent animate-spin flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-amber-300 animate-pulse" />
              </div>
              <p className="font-extrabold text-lg text-amber-300 animate-pulse">
                {lang === "te" ? "AI విశ్లేషిస్తోంది..." : "AI Vision Analyzing..."}
              </p>
              <p className="text-xs text-amber-100/90 font-medium">
                ICMR-NIN పోషకాలు & MDD-W లెక్కింపు జరుగుతోంది
              </p>
            </div>
          )}
        </div>

        {/* Action Controls / Shutter Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={isScanning}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 active:scale-98 text-white font-bold py-4 shadow-md transition disabled:opacity-50"
          >
            <Camera className="w-5 h-5" />
            <span>{lang === "te" ? "కెమెరా తెరవండి" : "Take Photo"}</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
            className="flex items-center justify-center gap-2 rounded-2xl bg-card border-2 border-amber-600/30 hover:bg-muted active:scale-98 text-foreground font-bold py-4 shadow-xs transition disabled:opacity-50"
          >
            <Upload className="w-5 h-5 text-amber-600" />
            <span>{lang === "te" ? "గ్యాలరీ నుండి" : "Gallery Upload"}</span>
          </button>
        </div>

        {/* Desktop Helper Paste Badge */}
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20">
            <Clipboard className="w-3.5 h-3.5" />
            <span>{lang === "te" ? "కంప్యూటర్‌లో: Ctrl + V తో చిత్రాన్ని పేస్ట్ చేయవచ్చు" : "Paste image directly with Ctrl+V"}</span>
          </span>
        </div>

        {/* Error Notification Alert */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-destructive/10 border-2 border-destructive/30 text-destructive flex items-start gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="text-sm font-semibold">{errorMsg}</div>
          </div>
        )}

        {/* Detailed Scan Result Display */}
        {scanResult && adjustedNutrition && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-5 rounded-3xl bg-card p-5 sm:p-6 shadow-xl border-2 border-amber-500/30"
          >
            {/* Dish Header & Telugu Script Badge */}
            <div className="flex flex-col gap-1 border-b border-border/60 pb-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-900 dark:text-amber-300 border border-amber-500/30">
                  {scanResult.meal_type || "Telugu Meal"}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {scanResult.model_used?.split("-").slice(0, 3).join("-")} | {scanResult.usage_and_cost?.cached ? "⚡ 0ms Cached" : "AI Fresh"}
                </span>
              </div>

              <h2 className="text-2xl font-black text-amber-900 dark:text-amber-200 mt-1 leading-snug">
                {scanResult.plate_title_te || scanResult.plate_title_en}
              </h2>
              {scanResult.plate_title_te && (
                <p className="text-sm font-medium text-muted-foreground">
                  {scanResult.plate_title_en}
                </p>
              )}
            </div>

            {/* Detected Components Chips */}
            {scanResult.items && scanResult.items.length > 0 && (
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  {lang === "te" ? "గుర్తించిన వంటకాలు & భాగాలు" : "Detected Dish Components"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {scanResult.items.map((item, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 border border-amber-300/60 dark:border-amber-700/60 text-xs font-bold"
                    >
                      <span>{item.name_te || item.name_en}</span>
                      <span className="text-[11px] opacity-75 font-normal">
                        ({Math.round(item.estimated_grams * portionFactor)}g)
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 4 Core ICMR-NIN Nutrient Cards */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                {lang === "te" ? "ప్రధాన పోషక విలువలు (ICMR-NIN IFCT)" : "Core ICMR-NIN Nutrition"}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {/* Calories */}
                <div className="rounded-2xl p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                      {lang === "te" ? "కేలరీలు" : "Calories"}
                    </div>
                    <div className="text-2xl font-black text-emerald-900 dark:text-emerald-100 mt-0.5">
                      {adjustedNutrition.calories}
                    </div>
                    <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400">kcal</div>
                  </div>
                  <Flame className="w-8 h-8 text-emerald-600/70" />
                </div>

                {/* Protein */}
                <div className="rounded-2xl p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-blue-800 dark:text-blue-300">
                      {lang === "te" ? "ప్రోటీన్" : "Protein"}
                    </div>
                    <div className="text-2xl font-black text-blue-900 dark:text-blue-100 mt-0.5">
                      {adjustedNutrition.protein_g}
                    </div>
                    <div className="text-[11px] text-blue-700/80 dark:text-blue-400">grams (g)</div>
                  </div>
                  <Dumbbell className="w-8 h-8 text-blue-600/70" />
                </div>

                {/* Iron */}
                <div className="rounded-2xl p-4 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-purple-800 dark:text-purple-300">
                      {lang === "te" ? "ఐరన్ (రక్తహీనత నివారణ)" : "Iron (Anti-Anemia)"}
                    </div>
                    <div className="text-2xl font-black text-purple-900 dark:text-purple-100 mt-0.5">
                      {adjustedNutrition.iron_mg}
                    </div>
                    <div className="text-[11px] text-purple-700/80 dark:text-purple-400">milligrams (mg)</div>
                  </div>
                  <Zap className="w-8 h-8 text-purple-600/70" />
                </div>

                {/* Calcium */}
                <div className="rounded-2xl p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-amber-800 dark:text-amber-300">
                      {lang === "te" ? "కాల్షియం (ఎముకల బలం)" : "Calcium (Bone Health)"}
                    </div>
                    <div className="text-2xl font-black text-amber-900 dark:text-amber-100 mt-0.5">
                      {adjustedNutrition.calcium_mg}
                    </div>
                    <div className="text-[11px] text-amber-700/80 dark:text-amber-400">milligrams (mg)</div>
                  </div>
                  <HeartPulse className="w-8 h-8 text-amber-600/70" />
                </div>
              </div>
            </div>

            {/* WHO / FAO MDD-W 10 Food Groups Tracker */}
            {scanResult.mddw_diversity && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-sm text-amber-950 dark:text-amber-200">
                      {lang === "te" ? "MDD-W ఆహార వైవిధ్య స్కోరు" : "MDD-W Diversity Score"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {lang === "te"
                        ? "గర్భిణీ/బాలింతలకు రోజుకు కనీసం 5 ఆహార సమూహాలు తప్పనిసరి"
                        : "Threshold: At least 5 of 10 food groups in 24 hours"}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-600 text-white font-black text-sm">
                    <span>{scanResult.mddw_diversity.mddw_score}</span>
                    <span className="text-xs opacity-80">/ 10</span>
                  </div>
                </div>

                {/* 10 Food Group Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                  {MDDW_FOOD_GROUPS.map((fg) => {
                    const isFulfilled = scanResult.mddw_diversity?.food_group_codes.includes(fg.code);
                    return (
                      <div
                        key={fg.code}
                        className={`flex items-center gap-1.5 p-2 rounded-xl text-xs transition border ${
                          isFulfilled
                            ? "bg-amber-600 text-white font-bold border-amber-700 shadow-xs"
                            : "bg-muted/40 text-muted-foreground/60 border-border/30 opacity-60"
                        }`}
                      >
                        <span className="text-base">{fg.emoji}</span>
                        <span className="truncate">{fg.name[lang] || fg.name.en}</span>
                        {isFulfilled && <Check className="w-3.5 h-3.5 ml-auto shrink-0" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Portion & Cooking Oil Modifiers */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <Sliders className="w-4 h-4 text-amber-600" />
                <span>{lang === "te" ? "భోజన పరిమాణం & నూనె సర్దుబాటు" : "Portion & Cooking Oil Adjustment"}</span>
              </div>

              {/* Portion Factor */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{lang === "te" ? "పరిమాణం (Portion):" : "Portion:"}</span>
                <div className="flex gap-1.5">
                  {[0.5, 1.0, 1.5, 2.0].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPortionFactor(p)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-xs transition ${
                        portionFactor === p
                          ? "bg-amber-600 text-white"
                          : "bg-card border border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      {p}x
                    </button>
                  ))}
                </div>
              </div>

              {/* Oil Modifier */}
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{lang === "te" ? "నూనె వాడకం (Oil):" : "Oil Level:"}</span>
                <div className="flex gap-1.5">
                  {[
                    { id: "low", label: lang === "te" ? "తక్కువ" : "Low" },
                    { id: "mod", label: lang === "te" ? "సాధారణ" : "Moderate" },
                    { id: "high", label: lang === "te" ? "ఎక్కువ" : "High" },
                  ].map((o) => (
                    <button
                      key={o.id}
                      onClick={() => setOilModifier(o.id as any)}
                      className={`px-2.5 py-1 rounded-lg font-bold text-xs transition ${
                        oilModifier === o.id
                          ? "bg-amber-600 text-white"
                          : "bg-card border border-border text-foreground hover:bg-muted"
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Expandable Complete Micronutrients Accordion */}
            <div className="border-t border-border/50 pt-2">
              <button
                onClick={() => setShowMicronutrients(!showMicronutrients)}
                className="w-full flex items-center justify-between py-2 text-xs font-bold text-muted-foreground hover:text-foreground transition"
              >
                <span>{lang === "te" ? "అన్ని సూక్ష్మ పోషక వివరాలు (All Micronutrients)" : "All Micronutrients Details"}</span>
                {showMicronutrients ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              <AnimatePresence>
                {showMicronutrients && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden pt-2"
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50">
                        <div className="text-[11px] text-muted-foreground">కార్బోహైడ్రేట్లు (Carbs)</div>
                        <div className="font-bold text-sm text-foreground">{adjustedNutrition.carbs_g} g</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50">
                        <div className="text-[11px] text-muted-foreground">కొవ్వు (Total Fat)</div>
                        <div className="font-bold text-sm text-foreground">{adjustedNutrition.fat_g} g</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50">
                        <div className="text-[11px] text-muted-foreground">పీచు (Fiber)</div>
                        <div className="font-bold text-sm text-foreground">{adjustedNutrition.fiber_g} g</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50">
                        <div className="text-[11px] text-muted-foreground">ఫోలేట్ (Folate)</div>
                        <div className="font-bold text-sm text-foreground">{adjustedNutrition.folate_ug} µg</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50">
                        <div className="text-[11px] text-muted-foreground">విటమిన్-ఎ (Vit-A)</div>
                        <div className="font-bold text-sm text-foreground">{adjustedNutrition.vit_a_ug} µg</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50">
                        <div className="text-[11px] text-muted-foreground">విటమిన్-సి (Vit-C)</div>
                        <div className="font-bold text-sm text-foreground">{adjustedNutrition.vit_c_mg} mg</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50">
                        <div className="text-[11px] text-muted-foreground">సోడియం (Sodium)</div>
                        <div className="font-bold text-sm text-foreground">{adjustedNutrition.sodium_mg} mg</div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-muted/40 border border-border/50">
                        <div className="text-[11px] text-muted-foreground">మొత్తం బరువు (Weight)</div>
                        <div className="font-bold text-sm text-foreground">{adjustedNutrition.total_grams} g</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={resetScanner}
                className="flex-1 py-3.5 px-4 rounded-2xl bg-amber-600 hover:bg-amber-500 active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{lang === "te" ? "మరొక ఫోటో స్కాన్ చేయండి" : "Scan Another Meal"}</span>
              </button>

              <Link
                to="/visit"
                className="flex-1 py-3.5 px-4 rounded-2xl bg-[#1B6E4D] hover:bg-[#145A3E] active:scale-98 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition text-center"
              >
                <span>🛡️</span>
                <span>{lang === "te" ? "ఆశా విజిట్ మోడ్‌కు వెళ్ళండి" : "ASHA Home Visit"}</span>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Quick Sample Dishes Carousel (for instant testing without camera) */}
        {!scanResult && (
          <div className="rounded-3xl p-5 bg-card border border-border/60 shadow-xs flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="font-bold text-xs text-foreground uppercase tracking-wider">
                {lang === "te" ? "నమూనా వంటకాలను పరీక్షించండి" : "Try Sample Telugu Dishes"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_DISHES.map((d) => (
                <button
                  key={d.id}
                  disabled={isScanning}
                  onClick={async () => {
                    // Fetch sample image from scanner API
                    setIsScanning(true);
                    setErrorMsg(null);
                    try {
                      const res = await fetch(`https://telugu-food-scanner.vercel.app/api/v1/scan-sample/${d.id === "pesarattu" ? "JM-106" : d.id === "gutti_vankaya" ? "JM-25" : d.id === "gongura_pappu" ? "JM-03" : "JM-101"}`);
                      if (!res.ok) {
                        // Fallback: trigger scan by calling calculate or direct endpoint
                        const calcRes = await fetch("https://telugu-food-scanner.vercel.app/api/v1/calculate", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            items: [{ dish_id: d.id === "pesarattu" ? "JM-106" : d.id === "gutti_vankaya" ? "JM-25" : "JM-03", grams: 180 }],
                          }),
                        });
                        const calcData = await calcRes.json();
                        setScanResult({
                          is_food_image: true,
                          plate_title_en: calcData.items?.[0]?.name_en || d.name,
                          plate_title_te: calcData.items?.[0]?.name_te || d.name,
                          meal_type: d.hint,
                          items: calcData.items || [],
                          totals: calcData.totals,
                          mddw_diversity: {
                            food_group_codes: calcData.food_groups_fulfilled || ["G1", "G2"],
                            food_group_names_en: ["Grains", "Pulses"],
                            food_group_names_te: ["ధాన్యాలు", "పప్పులు"],
                            mddw_score: (calcData.food_groups_fulfilled || ["G1", "G2"]).length,
                            meets_mddw_threshold: (calcData.food_groups_fulfilled || []).length >= 5,
                          },
                          model_used: "Annapurna-ICMR-NIN",
                          usage_and_cost: { total_tokens: 0, estimated_paid_cost_inr: 0, cached: true },
                        });
                      } else {
                        const data = await res.json();
                        setScanResult(data);
                      }
                      playSuccess();
                    } catch (err: any) {
                      setErrorMsg("నమూనా లోడ్ కాలేదు (Failed to load sample)");
                    } finally {
                      setIsScanning(false);
                    }
                  }}
                  className="p-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 active:scale-98 border border-amber-500/20 text-left flex items-center justify-between text-xs font-bold text-amber-950 dark:text-amber-200 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{d.emoji}</span>
                    <span>{d.name}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-600/20 text-amber-900 dark:text-amber-300">
                    {d.hint}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function ScannerErrorFallback({ error, reset }: { error: any; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-amber-50 to-background text-foreground text-center">
      <div className="max-w-md w-full bg-card p-6 rounded-3xl border-2 border-amber-500/30 shadow-xl flex flex-col gap-4">
        <div className="text-4xl">📸⚠️</div>
        <h2 className="text-xl font-bold text-amber-900 dark:text-amber-200">
          ఆహార స్కానర్ లోడ్ కాలేదు
        </h2>
        <p className="text-xs text-muted-foreground">
          {error instanceof Error ? error.message : "Something went wrong loading the food scanner."}
        </p>
        <div className="flex gap-2 justify-center mt-2">
          <button
            onClick={() => reset()}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition"
          >
            మళ్ళీ ప్రయత్నించండి (Try again)
          </button>
          <Link
            to="/"
            className="px-4 py-2.5 rounded-xl bg-card border border-border text-foreground hover:bg-muted font-bold text-xs shadow-xs transition"
          >
            హోమ్ పేజీ (Go home)
          </Link>
        </div>
      </div>
    </div>
  );
}

