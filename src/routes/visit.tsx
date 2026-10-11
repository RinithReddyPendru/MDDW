import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ArrowLeft,
  Info,
  X,
  Check,
  Plus,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { useLang } from "@/lib/mddw/useLang";
import { LANGS, type Lang } from "@/lib/mddw/translations";
import type { FoodGroupId } from "@/lib/mddw/foodGroups";
import {
  MOTHER_VISIT_PROFILES,
  VISIT_DISHES,
  type MotherVisitProfile,
} from "@/lib/mddw/ashaVisitData";
import { playPop, playSuccess, playFailure } from "@/lib/mddw/audio";

export const Route = createFileRoute("/visit")({
  component: AshaVisitSimulator,
});

type VisitStep = "pin" | "overview" | "recall" | "gaps" | "complete";

const GROUP_META: {
  id: FoodGroupId;
  emoji: string;
  shortName: Record<Lang, string>;
}[] = [
  { id: "grains", emoji: "🌾", shortName: { en: "Grain", te: "ధాన్యాలు", hi: "अनाज" } },
  { id: "pulses", emoji: "🫘", shortName: { en: "Pulses", te: "పప్పులు", hi: "दालें" } },
  { id: "nuts", emoji: "🥜", shortName: { en: "Nuts", te: "గింజలు / పల్లీలు", hi: "मेवे / मूंगफली" } },
  { id: "dairy", emoji: "🥛", shortName: { en: "Dairy", te: "పాలు / పెరుగు", hi: "दूध / दही" } },
  { id: "meat", emoji: "🍗", shortName: { en: "Meat", te: "మాంసం / చేపలు", hi: "मांस / मछली" } },
  { id: "eggs", emoji: "🥚", shortName: { en: "Eggs", te: "గుడ్లు", hi: "अंडे" } },
  { id: "dglv", emoji: "🥬", shortName: { en: "Greens", te: "ఆకుకూరలు", hi: "हरी पत्तेदार" } },
  { id: "vitaminA", emoji: "🥕", shortName: { en: "Vit-A", te: "విటమిన్-ఎ", hi: "विटामिन-ए" } },
  { id: "otherVeg", emoji: "🍅", shortName: { en: "Veg", te: "కూరగాయలు", hi: "सब्जियां" } },
  { id: "otherFruit", emoji: "🍌", shortName: { en: "Fruit", te: "పండ్లు", hi: "फल" } },
];

const TRIMESTER_LABELS: Record<"T1" | "T2" | "T3", Record<Lang, string>> = {
  T1: { en: "T1", te: "1వ త్రైమాసికం", hi: "पहली तिमाही" },
  T2: { en: "T2", te: "2వ త్రైమాసికం", hi: "दूसरी तिमाही" },
  T3: { en: "T3", te: "3వ త్రైమాసికం", hi: "तीसरी तिमाही" },
};

const UI_TEXT = {
  ashaBadge: {
    en: "ASHA",
    te: "ఆశా",
    hi: "आशा",
  },
  ashaVisitMode: {
    en: "ASHA visit mode",
    te: "ఆశా గృహ సందర్శన మోడ్",
    hi: "आशा गृह भ्रमण मोड",
  },
  loginAlertDesc: {
    en: "A login alert will be sent to your registered number.",
    te: "మీ రిజిస్టర్డ్ నంబర్‌కు లాగిన్ అలర్ట్ పంపబడుతుంది.",
    hi: "आपके पंजीकृत नंबर पर एक लॉगिन अलर्ट भेजा जाएगा।",
  },
  ashaIdLabel: {
    en: "ASHA ID (Training PIN: 1234)",
    te: "ఆశా ID (శిక్షణ PIN: 1234)",
    hi: "आशा आईडी (प्रशिक्षण पिन: 1234)",
  },
  autoFillPin: {
    en: "Auto-fill 1234 ✨",
    te: "1234 ఆటో-ఫిల్ ✨",
    hi: "1234 ऑटो-फिल ✨",
  },
  forgotPin: {
    en: "Forgot PIN?",
    te: "PIN మర్చిపోయారా?",
    hi: "पिन भूल गए?",
  },
  autoLockNotice: {
    en: "ASHA mode auto-locks after 30 minutes of inactivity.",
    te: "30 నిమిషాల పాటు వాడకపోతే ఆశా మోడ్ ఆటో-లాక్ అవుతుంది.",
    hi: "30 मिनट की निष्क्रियता के बाद आशा मोड ऑटो-लॉक हो जाता है।",
  },
  cancel: {
    en: "Cancel",
    te: "రద్దు చేయి",
    hi: "रद्द करें",
  },
  continueBtn: {
    en: "Continue",
    te: "కొనసాగించు",
    hi: "जारी रखें",
  },
  pinHintToast: {
    en: "Standard Training PIN is 1 2 3 4. Tap 'Auto-fill 1234' or type 1234!",
    te: "శిక్షణ కోసం ప్రామాణిక PIN: 1 2 3 4. దయచేసి 1234 ఎంటర్ చేయండి!",
    hi: "प्रशिक्षण के लिए मानक पिन 1 2 3 4 है। कृपया 1234 दर्ज करें!",
  },
  overviewTitle: {
    en: "30-day overview",
    te: "30-రోజుల నివేదిక",
    hi: "30-दिन का विवरण",
  },
  weekTrimesterSub: {
    en: "{name} · Week {week} · {trimester}",
    te: "{name} · {week}వ వారం · {trimester}",
    hi: "{name} · सप्ताह {week} · {trimester}",
  },
  todaySub: {
    en: "{name} · today",
    te: "{name} · ఈరోజు",
    hi: "{name} · आज",
  },
  switchMotherTooltip: {
    en: "Switch to another random mother sample",
    te: "మరొక తల్లి ప్రొఫైల్‌కు మార్చండి",
    hi: "किसी अन्य माँ की प्रोफाइल चुनें",
  },
  daysLabel: {
    en: "days",
    te: "రోజులు",
    hi: "दिन",
  },
  belowTarget: {
    en: "Below target",
    te: "లక్ష్యం కంటే తక్కువ",
    hi: "लक्ष्य से कम",
  },
  onTrack: {
    en: "On track",
    te: "సరైన మార్గంలో",
    hi: "सही ट्रैक पर",
  },
  yourLastVisit: {
    en: "Your last visit:",
    te: "మీ గత సందర్శన:",
    hi: "आपकी पिछली विजिट:",
  },
  eatingRarely: {
    en: "Eating rarely — talk about these",
    te: "అరుదుగా తింటున్నవి — వీటి గురించి మాట్లాడండి",
    hi: "बहुत कम खाए जाने वाले — इन पर बात करें",
  },
  under10Days: {
    en: "under 10 days",
    te: "10 రోజుల కంటే తక్కువ",
    hi: "10 दिनों से कम",
  },
  nextRecallBtn: {
    en: "Next: recall yesterday →",
    te: "తదుపరి: నిన్నటి ఆహార సేకరణ →",
    hi: "अगला: कल का आहार रिकॉल →",
  },
  recallTitle: {
    en: "Recall yesterday",
    te: "నిన్నటి ఆహార వివరాలు",
    hi: "कल का आहार",
  },
  whatDidMotherEat: {
    en: "What did {name} eat · yesterday",
    te: "నిన్న {name} ఏమి తిన్నారు",
    hi: "कल {name} ने क्या खाया",
  },
  recallInstruction: {
    en: "Tap any item from Mother Logged to add it below. Add anything she missed using Quick Add.",
    te: "తల్లి నమోదు చేసిన వాటిలో ఆమె నిజంగా తిన్న వాటిని నొక్కండి. మర్చిపోయిన వాటిని '+ మరిన్ని చేర్చండి' ద్వారా చేర్చండి.",
    hi: "माँ द्वारा दर्ज किए गए आइटम पर टैप करके नीचे जोड़ें। छूटे हुए आइटम को '+ और जोड़ें' से जोड़ें।",
  },
  motherSaysLabel: {
    en: "When you ask her what she ate yesterday, she says:",
    te: "నిన్న ఏమి తిన్నారని మీరు అడిగినప్పుడు, తల్లి ఇలా చెబుతోంది:",
    hi: "जब आप पूछती हैं कि कल क्या खाया, तो माँ कहती है:",
  },
  motherLoggedHeader: {
    en: "MOTHER LOGGED",
    te: "తల్లి నమోదు చేసినవి",
    hi: "माँ द्वारा दर्ज",
  },
  ashaAddsHeader: {
    en: "ASHA ADDS (CONFIRMED + MISSED)",
    te: "ఆశా నిర్ధారించినవి (నిజంగా తిన్నవి)",
    hi: "आशा द्वारा पुष्टि (पुष्टि + छूटे हुए)",
  },
  addMoreBtn: {
    en: "+ Add more",
    te: "+ మరిన్ని చేర్చండి",
    hi: "+ और जोड़ें",
  },
  quickAddTitle: {
    en: "Quick Add Dish (Missed by Mother)",
    te: "తల్లి మర్చిపోయిన వంటకాన్ని చేర్చండి",
    hi: "माँ द्वारा छूटा हुआ व्यंजन जोड़ें",
  },
  doneBtn: {
    en: "Done ✓",
    te: "పూర్తయింది ✓",
    hi: "हो गया ✓",
  },
  tapMotherHelper: {
    en: "Tap mother's items to confirm · ✓ Added to ASHA Adds · + Quick add below",
    te: "నిర్ధారించడానికి తల్లి ఐటమ్స్ నొక్కండి · ✓ ఆశా జాబితాకు చేర్చబడింది · + కింద మరిన్ని చేర్చండి",
    hi: "पुष्टि करने के लिए माँ के आइटम टैप करें · ✓ आशा सूची में जोड़ा गया · + नीचे से और जोड़ें",
  },
  saveRecallBtn: {
    en: "Save recall ({count} items) →",
    te: "నివేదిక సేవ్ చేయండి ({count} వంటకాలు) →",
    hi: "रिकॉल सेव करें ({count} आइटम) →",
  },
  todaysGapsTitle: {
    en: "Today's gaps",
    te: "నేటి పోషకాహార లోపాలు",
    hi: "आज की पोषण कमियां",
  },
  yesterdaysCoachingFocus: {
    en: "Yesterday's coaching focus",
    te: "నిన్నటి ఆహారం ఆధారంగా సలహా",
    hi: "कल के आहार पर आधारित परामर्श",
  },
  foodGroupsMissingTitle: {
    en: "{count} food group(s) missing",
    te: "{count} ఆహార వర్గాలు లోపించాయి",
    hi: "{count} खाद्य समूह छूटे हैं",
  },
  notEatenDiscuss: {
    en: "These food groups were not eaten yesterday — discuss with the mother.",
    te: "ఈ ఆహార వర్గాలు నిన్న తినలేదు — తల్లితో చర్చించండి.",
    hi: "ये खाद्य समूह कल नहीं खाए गए — माँ के साथ चर्चा करें।",
  },
  groupsFraction: {
    en: "{num} / {den} groups",
    te: "{num} / {den} వర్గాలు",
    hi: "{num} / {den} समूह",
  },
  tappedInAppYesterday: {
    en: "tapped in app yesterday",
    te: "నిన్న యాప్‌లో నొక్కినవి",
    hi: "कल ऐप में टैप किए गए",
  },
  recallCoveredHeader: {
    en: "RECALL COVERED",
    te: "నిజంగా తిన్నవి",
    hi: "रिकॉल में कवर",
  },
  missingCountLabel: {
    en: "{count} missing",
    te: "{count} తక్కువ",
    hi: "{count} छूटे",
  },
  suggestedCoachingHeader: {
    en: "SUGGESTED COACHING",
    te: "సూచించిన పోషకాహార సలహా",
    hi: "सुझाया गया पोषण परामर्श",
  },
  suggestedCoachingBody: {
    en: "Focus today on: {groups}. Encourage the mother to include these food groups in her next meal and to log them in the app.",
    te: "ఈరోజు దృష్టి పెట్టాల్సినవి: {groups}. తదుపరి భోజనంలో ఈ ఆహార వర్గాలను చేర్చుకోవాలని మరియు యాప్‌లో నమోదు చేయాలని తల్లిని ప్రోత్సహించండి.",
    hi: "आज इन पर ध्यान दें: {groups}। माँ को अगले भोजन में इन खाद्य समूहों को शामिल करने और ऐप में लॉग करने के लिए प्रोत्साहित करें।",
  },
  showComparisonTable: {
    en: "Show full comparison table",
    te: "పూర్తి పోలిక పట్టికను చూడండి",
    hi: "पूरी तुलना तालिका देखें",
  },
  foodGroupCol: {
    en: "FOOD GROUP",
    te: "ఆహార వర్గం",
    hi: "खाद्य समूह",
  },
  ashaAddedCol: {
    en: "ASHA ADDED",
    te: "ఆశా చేర్చినవి",
    hi: "आशा द्वारा जोड़ा गया",
  },
  nextObservationsBtn: {
    en: "Next: observations →",
    te: "తదుపరి: పరిశీలనలు పూర్తి →",
    hi: "अगला: अवलोकन →",
  },
  visitCompleteTitle: {
    en: "Visit complete",
    te: "సందర్శన పూర్తయింది",
    hi: "विजिट पूर्ण",
  },
  visitRecordedHeading: {
    en: "Visit recorded",
    te: "సందర్శన నమోదు చేయబడింది",
    hi: "विजिट रिकॉर्ड की गई",
  },
  visitRecordedDesc: {
    en: "Thank you for the home visit. {name}'s record has been updated.",
    te: "గృహ సందర్శనకు ధన్యవాదాలు. {name} యొక్క రికార్డు అప్‌డేట్ చేయబడింది.",
    hi: "गृह भ्रमण के लिए धन्यवाद। {name} का रिकॉर्ड अपडेट कर दिया गया है।",
  },
  visitSummaryHeader: {
    en: "VISIT SUMMARY",
    te: "సందర్శన సారాంశం",
    hi: "विजिट सारांश",
  },
  engagementRow: {
    en: "Engagement",
    te: "యాప్ వినియోగం",
    hi: "ऐप सक्रियता",
  },
  engagementValue: {
    en: "{days} of 30 days",
    te: "30 రోజులలో {days} రోజులు",
    hi: "30 दिनों में से {days} दिन",
  },
  yesterdaysCoverageRow: {
    en: "Yesterday's coverage",
    te: "నిన్నటి ఆహార వర్గాలు",
    hi: "कल का आहार कवरेज",
  },
  coverageValue: {
    en: "{count} of 10 groups",
    te: "10 వర్గాలలో {count} వర్గాలు",
    hi: "10 समूहों में से {count} समूह",
  },
  gapsFoundRow: {
    en: "Gaps found",
    te: "కనుగొన్న లోపాలు",
    hi: "पाई गई कमियां",
  },
  ifaAdherenceRow: {
    en: "IFA adherence",
    te: "IFA మాత్రల వినియోగం",
    hi: "IFA गोलियों का सेवन",
  },
  visitDurationRow: {
    en: "Visit duration",
    te: "సందర్శన సమయం",
    hi: "विजिट की अवधि",
  },
  recordedVal: {
    en: "Recorded",
    te: "నమోదైంది",
    hi: "रिकॉर्ड किया गया",
  },
  closeAshaModeBtn: {
    en: "Close ASHA mode",
    te: "ఆశా మోడ్ మూసివేయండి",
    hi: "आशा मोड बंद करें",
  },
  practiceAnotherMotherBtn: {
    en: "Practice with Another Random Mother 🔄",
    te: "మరొక తల్లి ప్రొఫైల్‌తో ప్రాక్టీస్ చేయండి 🔄",
    hi: "किसी अन्य माँ के साथ अभ्यास करें 🔄",
  },
};

function pickRandomMother(excludeId?: string): MotherVisitProfile {
  const pool = excludeId
    ? MOTHER_VISIT_PROFILES.filter((m) => m.id !== excludeId)
    : MOTHER_VISIT_PROFILES;
  return pool[Math.floor(Math.random() * pool.length)];
}

function AshaVisitSimulator() {
  const navigate = useNavigate();
  const { lang, setLang } = useLang();

  const [mother, setMother] = useState<MotherVisitProfile>(() => pickRandomMother());
  const [step, setStep] = useState<VisitStep>("pin");
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""]);
  const [pinError, setPinError] = useState(false);
  const [showPinHint, setShowPinHint] = useState(false);

  // Recall step state
  const [ashaDishes, setAshaDishes] = useState<string[]>(() =>
    mother.motherLoggedDishes.slice(0, 2)
  );
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showComparisonTable, setShowComparisonTable] = useState(true);

  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleLanguageChange = (nextLang: Lang) => {
    playPop();
    setLang(nextLang);
  };

  const randomizeMother = () => {
    playPop();
    const nextMother = pickRandomMother(mother.id);
    setMother(nextMother);
    setAshaDishes(nextMother.motherLoggedDishes.slice(0, 2));
    setShowQuickAdd(false);
  };

  const handlePinChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...pinDigits];
    next[index] = digit;
    setPinDigits(next);
    setPinError(false);

    if (digit && index < 3) {
      pinRefs[index + 1].current?.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    }
    if (e.key === "Enter") {
      handlePinSubmit();
    }
  };

  const handleAutoFillPin = () => {
    playPop();
    setPinDigits(["1", "2", "3", "4"]);
    setPinError(false);
  };

  const handlePinSubmit = () => {
    const code = pinDigits.join("");
    if (code === "1234") {
      playSuccess();
      setStep("overview");
    } else {
      playFailure();
      setPinError(true);
    }
  };

  const toggleDishInRecall = (dishId: string) => {
    playPop();
    setAshaDishes((prev) =>
      prev.includes(dishId) ? prev.filter((id) => id !== dishId) : [...prev, dishId]
    );
  };

  // Compute groups covered by Mother Logged vs ASHA Added
  const { motherGroups, ashaGroups, missingFromLogged, focusGroups } = useMemo(() => {
    const mSet = new Set<FoodGroupId>();
    mother.motherLoggedDishes.forEach((dId) => {
      const dish = VISIT_DISHES.find((d) => d.id === dId);
      dish?.groups.forEach((g) => mSet.add(g));
    });

    const aSet = new Set<FoodGroupId>();
    ashaDishes.forEach((dId) => {
      const dish = VISIT_DISHES.find((d) => d.id === dId);
      dish?.groups.forEach((g) => aSet.add(g));
    });

    // Groups that Mother claimed to log, but were NOT in ASHA's confirmed recall
    const diffLogged = Array.from(mSet).filter((g) => !aSet.has(g));

    // If diffLogged is non-empty, show those as the immediate coaching gaps (matches Screenshot 4 & 5!)
    // Otherwise show the top rarely-eaten groups from the 30-day overview that weren't eaten yesterday
    let focus: FoodGroupId[] = diffLogged;
    if (focus.length === 0) {
      focus = GROUP_META.map((g) => g.id)
        .filter((id) => !aSet.has(id) && mother.daysPerGroup[id] < 5)
        .slice(0, 2);
    }

    return {
      motherGroups: mSet,
      ashaGroups: aSet,
      missingFromLogged: diffLogged,
      focusGroups: focus,
    };
  }, [mother, ashaDishes]);

  // ── SCREEN 1: PIN ENTRY (ASHA VISIT MODE) ───────────────────────────────
  if (step === "pin") {
    const isPinReady = pinDigits.join("") === "1234";
    return (
      <main className="min-h-dvh bg-white flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl sm:border sm:border-slate-200 sm:shadow-xl p-6 flex flex-col gap-6 relative">
          {/* Top bar with language switcher & close X */}
          <div className="flex items-center justify-between">
            <select
              aria-label="Language"
              value={lang}
              onChange={(e) => handleLanguageChange(e.target.value as Lang)}
              className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 hover:bg-slate-50 transition cursor-pointer"
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => navigate({ to: "/" })}
              className="p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100 transition"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Green Hero Card (Matches Screenshot 1) */}
          <div className="bg-[#EAF5F0] border border-[#CBE4D8] rounded-2xl p-6 flex flex-col items-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#1B6E4D] text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-[#0F4730] tracking-tight">
              {UI_TEXT.ashaVisitMode[lang]}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xs">
              {UI_TEXT.loginAlertDesc[lang]}
            </p>
          </div>

          {/* ASHA ID 4-digit PIN Input */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                {UI_TEXT.ashaIdLabel[lang]}
              </label>
              <button
                type="button"
                onClick={handleAutoFillPin}
                className="text-xs font-bold text-[#1B6E4D] bg-[#EAF5F0] px-2.5 py-1 rounded-md hover:bg-[#d5ece2] transition"
              >
                {UI_TEXT.autoFillPin[lang]}
              </button>
            </div>

            <div className="flex items-center justify-center gap-3.5 my-1">
              {pinDigits.map((digit, idx) => (
                <input
                  key={idx}
                  ref={pinRefs[idx]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handlePinChange(idx, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(idx, e)}
                  className={`w-16 h-18 text-center text-2xl font-extrabold rounded-2xl border-2 outline-none transition ${
                    pinError
                      ? "border-red-500 bg-red-50 text-red-700"
                      : digit
                      ? "border-[#1B6E4D] bg-[#EAF5F0]/40 text-[#0F4730]"
                      : "border-slate-200 bg-slate-50/70 text-slate-800 focus:border-[#1B6E4D] focus:bg-white"
                  }`}
                />
              ))}
            </div>

            {pinError && (
              <p className="text-xs text-center font-bold text-red-600">
                {UI_TEXT.pinHintToast[lang]}
              </p>
            )}

            <button
              type="button"
              onClick={() => setShowPinHint((v) => !v)}
              className="text-sm font-bold text-[#0066CC] hover:underline self-center mt-1"
            >
              {UI_TEXT.forgotPin[lang]}
            </button>

            {showPinHint && (
              <div className="text-xs text-center bg-blue-50 text-blue-800 border border-blue-200 rounded-xl p-2.5 font-medium">
                💡 {UI_TEXT.pinHintToast[lang]}
              </div>
            )}
          </div>

          {/* Auto-lock info box */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-start gap-2.5 text-slate-600 text-xs leading-relaxed">
            <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>{UI_TEXT.autoLockNotice[lang]}</span>
          </div>

          {/* Cancel & Continue Buttons */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="col-span-1 py-3.5 px-4 rounded-xl border border-slate-300 font-bold text-slate-800 hover:bg-slate-50 transition"
            >
              {UI_TEXT.cancel[lang]}
            </button>
            <button
              type="button"
              onClick={handlePinSubmit}
              className={`col-span-2 py-3.5 px-6 rounded-xl font-bold text-white transition shadow-sm ${
                isPinReady
                  ? "bg-[#1B6E4D] hover:bg-[#145A3E] active:scale-[0.99]"
                  : "bg-[#8AB8A5] hover:bg-[#7aa995]"
              }`}
            >
              {UI_TEXT.continueBtn[lang]}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // Progress bar percentage for steps 2..5
  const progressPercent =
    step === "overview" ? 25 : step === "recall" ? 50 : step === "gaps" ? 75 : 100;

  const headerTitle =
    step === "overview"
      ? UI_TEXT.overviewTitle[lang]
      : step === "recall"
      ? UI_TEXT.recallTitle[lang]
      : step === "gaps"
      ? UI_TEXT.todaysGapsTitle[lang]
      : UI_TEXT.visitCompleteTitle[lang];

  const headerSub =
    step === "overview"
      ? UI_TEXT.weekTrimesterSub[lang]
          .replace("{name}", mother.name[lang])
          .replace("{week}", String(mother.week))
          .replace("{trimester}", TRIMESTER_LABELS[mother.trimester][lang])
      : step === "recall"
      ? UI_TEXT.whatDidMotherEat[lang].replace("{name}", mother.name[lang])
      : step === "gaps"
      ? UI_TEXT.yesterdaysCoachingFocus[lang]
      : UI_TEXT.todaySub[lang].replace("{name}", mother.name[lang]);

  const handleBack = () => {
    playPop();
    if (step === "overview") setStep("pin");
    else if (step === "recall") setStep("overview");
    else if (step === "gaps") setStep("recall");
    else if (step === "complete") setStep("gaps");
  };

  return (
    <main className="min-h-dvh bg-[#F8FAF9] flex flex-col items-center">
      <div className="w-full max-w-md min-h-dvh bg-white sm:shadow-xl flex flex-col justify-between">
        {/* Top App Bar (Matches Screenshots 2–6) */}
        <header className="sticky top-0 z-30 bg-white">
          <div className="px-4 py-3.5 flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={handleBack}
                className="p-1.5 -ml-1.5 rounded-full hover:bg-slate-100 text-slate-800 transition shrink-0"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h1 className="font-extrabold text-lg text-slate-900 leading-tight truncate">
                  {headerTitle}
                </h1>
                <p className="text-xs text-slate-500 truncate mt-0.5">{headerSub}</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={randomizeMother}
                title={UI_TEXT.switchMotherTooltip[lang]}
                className="p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <select
                aria-label="Language"
                value={lang}
                onChange={(e) => handleLanguageChange(e.target.value as Lang)}
                className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-extrabold text-slate-800 hover:bg-slate-50 transition cursor-pointer"
              >
                {LANGS.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
              <span className="px-2.5 py-1 rounded-full bg-[#145A3E] text-white text-xs font-extrabold tracking-wide">
                {UI_TEXT.ashaBadge[lang]}
              </span>
            </div>
          </div>

          {/* Green Step Progress Bar */}
          <div className="w-full h-1 bg-slate-100">
            <div
              className="h-full bg-[#22A06B] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </header>

        {/* Body Content */}
        <div className="flex-1 px-4 py-5 flex flex-col gap-5 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* ── SCREEN 2: 30-DAY OVERVIEW ────────────────────────────── */}
            {step === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-5"
              >
                {/* Dark Green 30-Day Banner */}
                <div className="bg-[#1B6E4D] text-white rounded-2xl p-5 shadow-sm">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-4xl font-extrabold tracking-tight">
                        {mother.activeDays30}
                      </span>
                      <span className="text-base text-white/85 font-medium">
                        / 30 {UI_TEXT.daysLabel[lang]}
                      </span>
                    </div>
                    <span className="bg-[#0F4730] text-white text-xs font-bold px-3.5 py-1.5 rounded-full">
                      {mother.activeDays30 < 15
                        ? UI_TEXT.belowTarget[lang]
                        : UI_TEXT.onTrack[lang]}
                    </span>
                  </div>

                  <div className="border-t border-white/15 my-3.5" />

                  <div className="flex items-center gap-2 text-xs text-white/90 font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#63E6BE] inline-block" />
                    <span>
                      {UI_TEXT.yourLastVisit[lang]} {mother.lastVisitText[lang]}
                    </span>
                  </div>
                </div>

                {/* Eating Rarely Section Header */}
                <div>
                  <div className="flex items-center justify-between mb-2.5 px-1">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#D9381E] inline-block" />
                      <span className="text-xs font-extrabold text-[#C92A2A]">
                        {UI_TEXT.eatingRarely[lang]}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">
                      {UI_TEXT.under10Days[lang]}
                    </span>
                  </div>

                  {/* 10 Food Groups List Card */}
                  <div className="bg-white rounded-2xl border border-slate-200/90 divide-y divide-slate-100 shadow-2xs overflow-hidden">
                    {GROUP_META.map((g) => {
                      const days = mother.daysPerGroup[g.id] ?? 0;
                      const isRare = days < 10;
                      return (
                        <div
                          key={g.id}
                          className="px-4 py-3.5 flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3.5">
                            <span className="text-2xl leading-none">{g.emoji}</span>
                            <span className="font-semibold text-sm text-slate-800">
                              {g.shortName[lang]}
                            </span>
                          </div>
                          <span
                            className={`text-sm font-extrabold ${
                              isRare ? "text-[#C92A2A]" : "text-[#1B6E4D]"
                            }`}
                          >
                            {days} {UI_TEXT.daysLabel[lang]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── SCREEN 3: RECALL YESTERDAY ───────────────────────────── */}
            {step === "recall" && (
              <motion.div
                key="recall"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-5"
              >
                {/* Light Green Instruction Box */}
                <div className="bg-[#EAF5F0] border border-[#B8DEC9] rounded-2xl p-4 flex items-start gap-3 text-[#0F4730]">
                  <div className="w-5 h-5 rounded-full bg-[#1B6E4D] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    i
                  </div>
                  <p className="text-sm font-medium leading-relaxed">
                    {UI_TEXT.recallInstruction[lang]}
                  </p>
                </div>

                {/* Simulated Pregnant Woman Dialogue Card (for Training Realism) */}
                <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 flex flex-col gap-1.5">
                  <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                    <span>👩🏽</span>
                    <span>{UI_TEXT.motherSaysLabel[lang]}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 italic leading-snug">
                    "{mother.motherDialogue[lang]}"
                  </p>
                </div>

                {/* MOTHER LOGGED */}
                <div className="flex flex-col gap-2.5">
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    {UI_TEXT.motherLoggedHeader[lang]}
                  </h2>
                  <div className="flex flex-wrap gap-2.5">
                    {mother.motherLoggedDishes.map((dishId) => {
                      const dish = VISIT_DISHES.find((d) => d.id === dishId);
                      if (!dish) return null;
                      const isSelected = ashaDishes.includes(dishId);
                      return (
                        <button
                          key={dishId}
                          type="button"
                          onClick={() => toggleDishInRecall(dishId)}
                          className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-1.5 transition ${
                            isSelected
                              ? "border-2 border-[#1B6E4D] bg-[#EAF5F0] text-[#0F4730]"
                              : "border border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                        >
                          {isSelected ? (
                            <Check className="w-4 h-4 text-[#1B6E4D]" />
                          ) : (
                            <Plus className="w-4 h-4 text-slate-400" />
                          )}
                          <span>{dish.name[lang]}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ASHA ADDS (CONFIRMED + MISSED) */}
                <div className="flex flex-col gap-2.5">
                  <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                    {UI_TEXT.ashaAddsHeader[lang]}
                  </h2>
                  <div className="flex flex-wrap gap-2.5 items-center">
                    {ashaDishes.map((dishId) => {
                      const dish = VISIT_DISHES.find((d) => d.id === dishId);
                      if (!dish) return null;
                      return (
                        <button
                          key={dishId}
                          type="button"
                          onClick={() => toggleDishInRecall(dishId)}
                          className="px-4 py-2 rounded-full bg-[#1B6E4D] text-white text-sm font-bold flex items-center gap-2 shadow-2xs hover:bg-[#145A3E] transition"
                        >
                          <span>{dish.name[lang]}</span>
                          <span className="text-white/80 text-base leading-none">×</span>
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => {
                        playPop();
                        setShowQuickAdd((v) => !v);
                      }}
                      className="px-4 py-2 rounded-full border-2 border-[#1B6E4D] text-[#1B6E4D] bg-white hover:bg-[#EAF5F0]/50 text-sm font-bold transition"
                    >
                      {UI_TEXT.addMoreBtn[lang]}
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {UI_TEXT.tapMotherHelper[lang]}
                  </p>
                </div>

                {/* Quick Add Dish Picker Drawer */}
                {showQuickAdd && (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                        {UI_TEXT.quickAddTitle[lang]}
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowQuickAdd(false)}
                        className="text-xs font-bold text-slate-500 hover:text-slate-800"
                      >
                        {UI_TEXT.doneBtn[lang]}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto pt-1">
                      {VISIT_DISHES.filter(
                        (d) => !mother.motherLoggedDishes.includes(d.id)
                      ).map((dish) => {
                        const added = ashaDishes.includes(dish.id);
                        return (
                          <button
                            key={dish.id}
                            type="button"
                            onClick={() => toggleDishInRecall(dish.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                              added
                                ? "bg-[#1B6E4D] text-white border-[#1B6E4D]"
                                : "bg-white text-slate-700 border-slate-300 hover:border-[#1B6E4D]"
                            }`}
                          >
                            {added ? "✓ " : "+ "}
                            {dish.name[lang]}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── SCREEN 4: TODAY'S GAPS (COMPARISON & COACHING) ────────── */}
            {step === "gaps" && (
              <motion.div
                key="gaps"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-4"
              >
                {/* Yellow Missing Food Groups Alert Box */}
                <div className="bg-[#FFF9DB] border border-[#F59F00]/50 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-[#D97706] shrink-0" />
                    <h2 className="font-extrabold text-base text-slate-900">
                      {UI_TEXT.foodGroupsMissingTitle[lang].replace(
                        "{count}",
                        String(focusGroups.length)
                      )}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    {UI_TEXT.notEatenDiscuss[lang]}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {focusGroups.map((gId) => {
                      const meta = GROUP_META.find((m) => m.id === gId);
                      if (!meta) return null;
                      return (
                        <span
                          key={gId}
                          className="inline-flex items-center gap-1.5 bg-white border border-[#F59F00]/40 px-3 py-1.5 rounded-full text-xs font-extrabold text-slate-800 shadow-2xs"
                        >
                          <span>{meta.emoji}</span>
                          <span>{meta.shortName[lang]}</span>
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* 2-Column Summary Cards: MOTHER LOGGED vs RECALL COVERED */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      {UI_TEXT.motherLoggedHeader[lang]}
                    </span>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                      {UI_TEXT.groupsFraction[lang]
                        .replace("{num}", String(motherGroups.size))
                        .replace("{den}", "10")}
                    </div>
                    <span className="text-xs text-slate-500">
                      {UI_TEXT.tappedInAppYesterday[lang]}
                    </span>
                  </div>

                  <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col gap-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      {UI_TEXT.recallCoveredHeader[lang]}
                    </span>
                    <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                      {UI_TEXT.groupsFraction[lang]
                        .replace("{num}", String(ashaGroups.size))
                        .replace("{den}", String(motherGroups.size))}
                    </div>
                    <span className="text-xs font-extrabold text-[#D97706]">
                      {UI_TEXT.missingCountLabel[lang].replace(
                        "{count}",
                        String(focusGroups.length)
                      )}
                    </span>
                  </div>
                </div>

                {/* SUGGESTED COACHING Card */}
                <div className="bg-[#EAF5F0] border border-[#B8DEC9] border-l-4 border-l-[#1B6E4D] rounded-2xl p-4 flex flex-col gap-1.5">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-[#1B6E4D]">
                    {UI_TEXT.suggestedCoachingHeader[lang]}
                  </span>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium">
                    {UI_TEXT.suggestedCoachingBody[lang].replace(
                      "{groups}",
                      focusGroups
                        .map(
                          (gId) =>
                            GROUP_META.find((m) => m.id === gId)?.shortName[lang] || gId
                        )
                        .join(", ")
                    )}
                  </p>
                </div>

                {/* Collapsible Full Comparison Table */}
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => setShowComparisonTable((v) => !v)}
                    className="w-full flex items-center justify-between py-2 text-sm font-bold text-slate-800"
                  >
                    <span>{UI_TEXT.showComparisonTable[lang]}</span>
                    {showComparisonTable ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </button>

                  {showComparisonTable && (
                    <div className="mt-2 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                      <div className="grid grid-cols-12 bg-[#EAF5F0] px-4 py-3 text-[11px] font-extrabold uppercase tracking-wider text-[#0F4730]">
                        <div className="col-span-6">{UI_TEXT.foodGroupCol[lang]}</div>
                        <div className="col-span-3 text-center">
                          {UI_TEXT.motherLoggedHeader[lang]}
                        </div>
                        <div className="col-span-3 text-center">
                          {UI_TEXT.ashaAddedCol[lang]}
                        </div>
                      </div>

                      <div className="divide-y divide-slate-100">
                        {GROUP_META.map((g) => {
                          const inMother = motherGroups.has(g.id);
                          const inAsha = ashaGroups.has(g.id);
                          return (
                            <div
                              key={g.id}
                              className="grid grid-cols-12 items-center px-4 py-3 text-sm"
                            >
                              <div className="col-span-6 flex items-center gap-2.5 font-bold text-slate-800">
                                <span className="text-lg">{g.emoji}</span>
                                <span>{g.shortName[lang]}</span>
                              </div>
                              <div className="col-span-3 text-center font-bold">
                                {inMother ? (
                                  <span className="text-[#1B6E4D] text-base">✓</span>
                                ) : (
                                  <span className="text-slate-300">—</span>
                                )}
                              </div>
                              <div className="col-span-3 text-center font-bold">
                                {inAsha ? (
                                  <span className="text-[#1B6E4D] text-base">✓</span>
                                ) : (
                                  <span className="text-slate-300">—</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── SCREEN 5: VISIT COMPLETE ─────────────────────────────── */}
            {step === "complete" && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col items-center text-center gap-5 pt-4"
              >
                <div className="w-20 h-20 rounded-full bg-[#1B6E4D] text-white flex items-center justify-center shadow-lg">
                  <ShieldCheck className="w-10 h-10" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    {UI_TEXT.visitRecordedHeading[lang]}
                  </h2>
                  <p className="text-sm text-slate-600 max-w-xs leading-relaxed">
                    {UI_TEXT.visitRecordedDesc[lang].replace(
                      "{name}",
                      mother.name[lang]
                    )}
                  </p>
                </div>

                {/* VISIT SUMMARY Card */}
                <div className="w-full bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs text-left mt-2">
                  <div className="bg-[#EAF5F0] px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-[#0F4730]">
                    {UI_TEXT.visitSummaryHeader[lang]}
                  </div>
                  <div className="divide-y divide-slate-100 text-sm">
                    <div className="px-4 py-3.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">
                        {UI_TEXT.engagementRow[lang]}
                      </span>
                      <span className="font-extrabold text-slate-900">
                        {UI_TEXT.engagementValue[lang].replace(
                          "{days}",
                          String(mother.activeDays30)
                        )}
                      </span>
                    </div>
                    <div className="px-4 py-3.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">
                        {UI_TEXT.yesterdaysCoverageRow[lang]}
                      </span>
                      <span className="font-extrabold text-slate-900">
                        {UI_TEXT.coverageValue[lang].replace(
                          "{count}",
                          String(ashaGroups.size)
                        )}
                      </span>
                    </div>
                    <div className="px-4 py-3.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">
                        {UI_TEXT.gapsFoundRow[lang]}
                      </span>
                      <span className="font-extrabold text-[#D97706]">
                        {focusGroups.length}
                      </span>
                    </div>
                    <div className="px-4 py-3.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">
                        {UI_TEXT.ifaAdherenceRow[lang]}
                      </span>
                      <span className="font-extrabold text-slate-900">
                        {mother.ifaAdherence}
                      </span>
                    </div>
                    <div className="px-4 py-3.5 flex items-center justify-between">
                      <span className="text-slate-500 font-medium">
                        {UI_TEXT.visitDurationRow[lang]}
                      </span>
                      <span className="font-extrabold text-slate-900">
                        {UI_TEXT.recordedVal[lang]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Practice Another Random Mother Button */}
                <button
                  type="button"
                  onClick={() => {
                    randomizeMother();
                    setStep("overview");
                  }}
                  className="w-full py-3.5 px-4 rounded-xl border-2 border-[#1B6E4D] text-[#1B6E4D] font-extrabold text-sm hover:bg-[#EAF5F0] transition"
                >
                  {UI_TEXT.practiceAnotherMotherBtn[lang]}
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sticky Bottom CTA Bar */}
        <footer className="sticky bottom-0 z-20 bg-white border-t border-slate-100 p-4">
          {step === "overview" && (
            <button
              type="button"
              onClick={() => {
                playPop();
                setStep("recall");
              }}
              className="w-full py-4 rounded-xl bg-[#1B6E4D] hover:bg-[#145A3E] text-white font-extrabold text-base shadow-md active:scale-[0.99] transition"
            >
              {UI_TEXT.nextRecallBtn[lang]}
            </button>
          )}

          {step === "recall" && (
            <button
              type="button"
              onClick={() => {
                playSuccess();
                setStep("gaps");
              }}
              className="w-full py-4 rounded-xl bg-[#1B6E4D] hover:bg-[#145A3E] text-white font-extrabold text-base shadow-md active:scale-[0.99] transition"
            >
              {UI_TEXT.saveRecallBtn[lang].replace(
                "{count}",
                String(ashaDishes.length)
              )}
            </button>
          )}

          {step === "gaps" && (
            <button
              type="button"
              onClick={() => {
                playSuccess();
                setStep("complete");
              }}
              className="w-full py-4 rounded-xl bg-[#1B6E4D] hover:bg-[#145A3E] text-white font-extrabold text-base shadow-md active:scale-[0.99] transition"
            >
              {UI_TEXT.nextObservationsBtn[lang]}
            </button>
          )}

          {step === "complete" && (
            <button
              type="button"
              onClick={() => {
                playPop();
                navigate({ to: "/" });
              }}
              className="w-full py-4 rounded-xl bg-[#1B6E4D] hover:bg-[#145A3E] text-white font-extrabold text-base shadow-md active:scale-[0.99] transition"
            >
              {UI_TEXT.closeAshaModeBtn[lang]}
            </button>
          )}
        </footer>
      </div>
    </main>
  );
}
