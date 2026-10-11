import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  ArrowLeft,
  ArrowRight,
  Info,
  X,
  Check,
  Plus,
  AlertTriangle,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Volume2,
  Square,
  Utensils,
  Award,
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
  shortName: Record<Lang, string>;
}[] = [
  { id: "grains", shortName: { en: "Grains & Millets", te: "ధాన్యాలు / చిరుధాన్యాలు", hi: "अनाज और बाजरा" } },
  { id: "pulses", shortName: { en: "Pulses & Dal", te: "పప్పు ధాన్యాలు", hi: "दालें और फलियां" } },
  { id: "nuts", shortName: { en: "Nuts & Seeds (Palli)", te: "గింజలు / పల్లీలు", hi: "मेवे और मूंगफली" } },
  { id: "dairy", shortName: { en: "Milk & Curd (Perugu)", te: "పాలు / పెరుగు", hi: "दूध और दही" } },
  { id: "meat", shortName: { en: "Meat, Fish & Chicken", te: "మాంసం / చేపలు", hi: "मांस, मछली और चिकन" } },
  { id: "eggs", shortName: { en: "Eggs (Guddu)", te: "కోడిగుడ్లు", hi: "अंडे" } },
  { id: "dglv", shortName: { en: "Dark Leafy Greens", te: "ఆకుకూరలు", hi: "हरी पत्तेदार सब्जियां" } },
  { id: "vitaminA", shortName: { en: "Vit-A Fruit & Veg", te: "విటమిన్-ఎ పండ్లు/కూరలు", hi: "विटामिन-ए फल और सब्जी" } },
  { id: "otherVeg", shortName: { en: "Other Vegetables", te: "ఇతర కూరగాయలు", hi: "अन्य सब्जियां" } },
  { id: "otherFruit", shortName: { en: "Other Fruits", te: "ఇతర పండ్లు", hi: "अन्य फल" } },
];

const TRIMESTER_LABELS: Record<"T1" | "T2" | "T3", Record<Lang, string>> = {
  T1: { en: "1st Trimester", te: "1వ త్రైమాసికం", hi: "पहली तिमाही" },
  T2: { en: "2nd Trimester", te: "2వ త్రైమాసికం", hi: "दूसरी तिमाही" },
  T3: { en: "3rd Trimester", te: "3వ త్రైమాసికం", hi: "तीसरी तिमाही" },
};

const STEP_TABS: {
  id: Exclude<VisitStep, "pin">;
  label: Record<Lang, string>;
}[] = [
  {
    id: "overview",
    label: { en: "1. 30-Day Report", te: "1. 30-రోజుల నివేదిక", hi: "1. 30-दिन रिपोर्ट" },
  },
  {
    id: "recall",
    label: { en: "2. Food Recall", te: "2. నిన్నటి ఆహారం", hi: "2. कल का आहार" },
  },
  {
    id: "gaps",
    label: { en: "3. Today's Gaps", te: "3. పోషకాహార లోపాలు", hi: "3. पोषण कमियां" },
  },
  {
    id: "complete",
    label: { en: "4. Summary", te: "4. ముగింపు", hi: "4. सारांश" },
  },
];

const UI_TEXT = {
  ashaVisitMode: {
    en: "ASHA Home Visit Training",
    te: "ఆశా గృహ సందర్శన శిక్షణ",
    hi: "आशा गृह भ्रमण प्रशिक्षण",
  },
  loginAlertDesc: {
    en: "Enter your 4-digit ASHA Training PIN (1234) to start practicing real pregnant mother home visits.",
    te: "గర్భిణీ తల్లుల గృహ సందర్శన ప్రాక్టీస్ ప్రారంభించడానికి 4-అంకెల ఆశా PIN (1234) ఎంటర్ చేయండి.",
    hi: "गर्भवती माताओं के गृह भ्रमण का अभ्यास शुरू करने के लिए अपना 4-अंकीय आशा पिन (1234) दर्ज करें।",
  },
  ashaIdLabel: {
    en: "Enter 4-Digit ASHA PIN (Standard: 1234)",
    te: "4-అంకెల ఆశా PIN ఎంటర్ చేయండి (PIN: 1234)",
    hi: "4-अंकीय आशा पिन दर्ज करें (मानक: 1234)",
  },
  autoFillPin: {
    en: "Fill 1234 Automatically",
    te: "1234 ఆటో-ఫిల్ చేయండి",
    hi: "1234 स्वतः भरें",
  },
  forgotPin: {
    en: "Need the training PIN?",
    te: "శిక్షణ PIN కావాలా?",
    hi: "प्रशिक्षण पिन चाहिए?",
  },
  autoLockNotice: {
    en: "Each visit loads a new mother scenario so you can practice all types of dietary recall cases.",
    te: "ప్రతి సందర్శనలో వేర్వేరు తల్లుల ఆహార వివరాలు వస్తాయి, తద్వారా అన్ని రకాల కేసులను మీరు ప్రాక్టీస్ చేయవచ్చు.",
    hi: "प्रत्येक विजिट में एक नई माँ का मामला आता है ताकि आप सभी प्रकार के आहार रिकॉल का अभ्यास कर सकें।",
  },
  cancel: {
    en: "Back to Home",
    te: "హోమ్‌కు వెళ్ళండి",
    hi: "होम पर वापस",
  },
  continueBtn: {
    en: "Start Home Visit",
    te: "గృహ సందర్శన ప్రారంభించండి",
    hi: "गृह भ्रमण शुरू करें",
  },
  pinHintToast: {
    en: "Standard Training PIN is 1 2 3 4. Tap 'Fill 1234 Automatically' or type 1234.",
    te: "శిక్షణ కోసం ప్రామాణిక PIN: 1 2 3 4. దయచేసి 1234 ఎంటర్ చేయండి.",
    hi: "प्रशिक्षण के लिए मानक पिन 1 2 3 4 है। कृपया 1234 दर्ज करें।",
  },
  practiceTrackerBadge: {
    en: "Practice Goal: {done} / 3 Visits Completed",
    te: "ప్రాక్టీస్ లక్ష్యం: {done} / 3 సందర్శనలు పూర్తయ్యాయి",
    hi: "अभ्यास लक्ष्य: {done} / 3 विजिट पूर्ण",
  },
  switchMotherBtn: {
    en: "New Mother",
    te: "మరొక తల్లి",
    hi: "नई माँ",
  },
  weekTrimesterSub: {
    en: "Week {week} · {trimester}",
    te: "{week}వ వారం · {trimester}",
    hi: "सप्ताह {week} · {trimester}",
  },
  overviewHeading: {
    en: "{name}'s Last 30 Days App Report",
    te: "{name} గత 30 రోజుల ఆహార నివేదిక",
    hi: "{name} की पिछले 30 दिनों की रिपोर्ट",
  },
  daysLoggedSub: {
    en: "Days logged in the app out of the last 30 days",
    te: "గత 30 రోజులలో యాప్‌లో నమోదు చేసిన రోజులు",
    hi: "पिछले 30 दिनों में ऐप में दर्ज किए गए दिन",
  },
  daysLabel: {
    en: "days",
    te: "రోజులు",
    hi: "दिन",
  },
  belowTarget: {
    en: "Needs Follow-up (<15 days)",
    te: "తక్కువ వినియోగం (<15 రోజులు)",
    hi: "कम सक्रियता (<15 दिन)",
  },
  onTrack: {
    en: "Good Engagement",
    te: "మంచి వినియోగం",
    hi: "अच्छी सक्रियता",
  },
  yourLastVisit: {
    en: "Last ASHA visit:",
    te: "గత ఆశా సందర్శన:",
    hi: "पिछली आशा विजिट:",
  },
  eatingRarelyHeading: {
    en: "10 Food Groups Coverage (Last 30 Days)",
    te: "10 ఆహార వర్గాల వివరాలు (గత 30 రోజులు)",
    hi: "10 खाद्य समूहों का विवरण (पिछले 30 दिन)",
  },
  under10Days: {
    en: "Red = eaten under 10 days",
    te: "ఎరుపు = 10 రోజుల కంటే తక్కువ తిన్నవి",
    hi: "लाल = 10 दिनों से कम खाए गए",
  },
  nextRecallBtn: {
    en: "Continue to Step 2: Yesterday's Recall",
    te: "2వ దశకు వెళ్ళండి: నిన్నటి ఆహార వివరాలు",
    hi: "चरण 2 पर जाएं: कल का आहार रिकॉल",
  },
  recallHeading: {
    en: "What Did {name} Actually Eat Yesterday?",
    te: "నిన్న {name} నిజంగా ఏమి తిన్నారు?",
    hi: "कल {name} ने वास्तव में क्या खाया?",
  },
  step1ListenTitle: {
    en: "Step A: Listen to {name} explain what she ate yesterday",
    te: "మొదటి పని: నిన్న ఏమి తిన్నారో {name} మాటల్లోనే వినండి",
    hi: "पहला काम: {name} की आवाज़ में सुनें कि कल उन्होंने क्या खाया",
  },
  askMotherTeluguBtn: {
    en: "Play Mother's Voice (Andhra Telugu)",
    te: "తల్లి మాట వినండి (ఆంధ్ర తెలుగు వాయిస్)",
    hi: "माँ की बात सुनें (आंध्र तेलुगु आवाज़)",
  },
  listenTranslatedBtn: {
    en: "Play in English (Andhra Accent)",
    te: "ఇంగ్లీష్‌లో వినండి",
    hi: "हिंदी में सुनें",
  },
  clickToHearHint: {
    en: "Press the green button above to hear the mother tell you what she ate from morning to night yesterday.",
    te: "నిన్న పొద్దున్నుంచి రాత్రి దాకా తల్లి ఏమి తిన్నారో వినడానికి పైనున్న ఆకుపచ్చ బటన్‌ను నొక్కండి.",
    hi: "माँ ने कल सुबह से रात तक क्या खाया, यह सुनने के लिए ऊपर दिए गए हरे बटन को दबाएं।",
  },
  stopAudioBtn: {
    en: "Stop Audio",
    te: "ఆడియో ఆపండి",
    hi: "ऑडियो रोकें",
  },
  listenCoachingBtn: {
    en: "Listen to Coaching",
    te: "సలహాను వినండి",
    hi: "सलाह सुनें",
  },
  motherLoggedHeader: {
    en: "Step B: Dishes Clicked by Mother in Her Phone App",
    te: "రెండవ పని: తల్లి తన ఫోన్ యాప్‌లో నొక్కిన వంటకాలు",
    hi: "दूसरा काम: माँ द्वारा अपने फोन ऐप में दबाए गए व्यंजन",
  },
  motherLoggedSub: {
    en: "Tap ONLY the dishes below that {name} actually ate yesterday:",
    te: "వీటిలో నిన్న {name} నిజంగా తిన్న వంటకాలను మాత్రమే నొక్కి ఎంచుకోండి:",
    hi: "इनमें से केवल उन व्यंजनों को चुनें जो {name} ने कल वास्तव में खाए:",
  },
  otherDishesHeader: {
    en: "Step C: Other Dishes (Did she eat anything NOT clicked above?)",
    te: "మూడవ పని: ఇతర వంటకాలు (పైన లేనివి ఏమైనా తిన్నారా?)",
    hi: "तीसरा काम: अन्य व्यंजन (क्या उन्होंने ऊपर न दिखने वाला कुछ खाया?)",
  },
  otherDishesSub: {
    en: "If {name} mentioned eating any dish below, tap to add it to her recall:",
    te: "తల్లి చెప్పిన వాటిలో ఏవైనా వంటకాలు పైన లేకపోతే, ఇక్కడ నొక్కి చేర్చండి:",
    hi: "यदि {name} ने नीचे दिए गए किसी व्यंजन को खाने की बात कही है, तो उसे चुनें:",
  },
  selectedBadge: {
    en: "Confirmed",
    te: "ఎంచుకున్నారు",
    hi: "चयनित",
  },
  tapToSelectBadge: {
    en: "Tap to add",
    te: "చేర్చడానికి నొక్కండి",
    hi: "जोड़ने के लिए दबाएं",
  },
  ashaAddsHeader: {
    en: "Your Confirmed Recall List ({count} dishes · {groups}/10 food groups)",
    te: "మీరు నిర్ధారించిన నిన్నటి ఆహార జాబితా ({count} వంటకాలు · {groups}/10 ఆహార వర్గాలు)",
    hi: "आपकी पुष्टि की गई सूची ({count} व्यंजन · {groups}/10 खाद्य समूह)",
  },
  emptyAshaAddsHint: {
    en: "No dishes selected yet. First listen to the mother above, then tap the dishes she ate.",
    te: "ఇంకా ఏ వంటకాలు ఎంచుకోలేదు. ముందుగా పైన తల్లి మాట విని, ఆమె తిన్న వంటకాలను నొక్కండి.",
    hi: "अभी तक कोई व्यंजन नहीं चुना गया है। पहले ऊपर माँ की बात सुनें, फिर उनके द्वारा खाए गए व्यंजन चुनें।",
  },
  selectAtLeastOneError: {
    en: "Please select at least 1 dish that the mother ate yesterday before continuing.",
    te: "కొనసాగే ముందు దయచేసి నిన్న తల్లి తిన్న కనీసం ఒక్క వంటకాన్నైనా ఎంచుకోండి.",
    hi: "आगे बढ़ने से पहले कृपया माँ द्वारा कल खाया गया कम से कम 1 व्यंजन चुनें।",
  },
  saveRecallBtn: {
    en: "Save Recall & Check Gaps ({count} dishes)",
    te: "నివేదిక సేవ్ చేసి లోపాలు చూడండి ({count} వంటకాలు)",
    hi: "रिकॉल सेव करें और कमियां देखें ({count} व्यंजन)",
  },
  recallPerfectTitle: {
    en: "Great Listening! You matched 100% of what {name} ate.",
    te: "అద్భుతం! {name} తిన్న అన్ని వంటకాలను మీరు సరిగ్గా గుర్తించారు.",
    hi: "बहुत बढ़िया! आपने {name} द्वारा खाए गए सभी व्यंजनों को सही पहचाना।",
  },
  recallCheckTitle: {
    en: "Recall Check: Compare your selection with what {name} said",
    te: "పరిశీలన: తల్లి చెప్పిన దానితో మీ ఎంపికను పోల్చి చూడండి",
    hi: "रिकॉल जांच: माँ की बात से अपने चयन की तुलना करें",
  },
  missedDishesLabel: {
    en: "She ate this, but you didn't select it:",
    te: "తల్లి ఇవి తిన్నారు, కానీ మీరు ఎంపిక చేయలేదు:",
    hi: "माँ ने यह खाया, लेकिन आपने नहीं चुना:",
  },
  extraDishesLabel: {
    en: "You selected this, but she didn't eat it yesterday:",
    te: "తల్లి ఇవి తినలేదు, కానీ మీరు ఎంచుకున్నారు:",
    hi: "माँ ने यह नहीं खाया, लेकिन आपने चुन लिया:",
  },
  applyCorrectDishesBtn: {
    en: "Auto-Fix My Dish Selection",
    te: "సరైన వంటకాలను ఆటోమేటిక్‌గా సరిచేయండి",
    hi: "सही व्यंजन स्वतः लागू करें",
  },
  todaysGapsTitle: {
    en: "Yesterday's Nutrition Gaps & Coaching",
    te: "నిన్నటి పోషకాహార లోపాలు & సలహా",
    hi: "कल की पोषण कमियां और परामर्श",
  },
  foodGroupsMissingTitle: {
    en: "{count} of 10 Food Groups Were Missing Yesterday",
    te: "నిన్న 10 ఆహార వర్గాలలో {count} వర్గాలు లోపించాయి",
    hi: "कल 10 में से {count} खाद्य समूह छूटे थे",
  },
  notEatenDiscuss: {
    en: "Counsel {name} to include these missing food groups in today's meals:",
    te: "ఈరోజు భోజనంలో ఈ క్రింది ఆహార వర్గాలను తప్పనిసరిగా చేర్చుకోమని {name}కి సలహా ఇవ్వండి:",
    hi: "आज के भोजन में इन छूटे हुए खाद्य समूहों को शामिल करने के लिए {name} को सलाह दें:",
  },
  motherLoggedBoxLabel: {
    en: "Mother Clicked in App",
    te: "తల్లి యాప్‌లో నొక్కినవి",
    hi: "माँ ने ऐप में दबाया",
  },
  recallCoveredHeader: {
    en: "Confirmed by ASHA Recall",
    te: "ఆశా నిర్ధారించినవి",
    hi: "आशा द्वारा पुष्टि",
  },
  groupsUnit: {
    en: "of 10 food groups",
    te: "/ 10 ఆహార వర్గాలు",
    hi: "/ 10 खाद्य समूह",
  },
  suggestedCoachingHeader: {
    en: "Counseling Advice to Give Mother",
    te: "తల్లికి ఇవ్వాల్సిన పోషకాహార సలహా",
    hi: "माँ को दी जाने वाली पोषण सलाह",
  },
  suggestedCoachingBody: {
    en: "Focus today on adding: {groups}. Advise {name} to include affordable local options from these groups in her next meal and log only what she eats in the app.",
    te: "ఈరోజు ఆహారంలో చేర్చాల్సినవి: {groups}. తదుపరి భోజనంలో ఈ ఆహార వర్గాలను చేర్చుకోవాలని మరియు తిన్న వాటిని మాత్రమే యాప్‌లో నమోదు చేయాలని {name}కి సూచించండి.",
    hi: "आज इन पर ध्यान दें: {groups}। {name} को अगले भोजन में इन खाद्य समूहों को शामिल करने और ऐप में केवल खाए गए भोजन को दर्ज करने के लिए प्रोत्साहित करें।",
  },
  showComparisonTable: {
    en: "10 Food Groups Comparison (App vs ASHA Recall)",
    te: "10 ఆహార వర్గాల పూర్తి పోలిక పట్టిక",
    hi: "10 खाद्य समूहों की तुलना तालिका",
  },
  foodGroupCol: {
    en: "Food Group",
    te: "ఆహార వర్గం",
    hi: "खाद्य समूह",
  },
  ashaAddedCol: {
    en: "ASHA Confirmed",
    te: "ఆశా నిర్ధారణ",
    hi: "आशा पुष्टि",
  },
  nextObservationsBtn: {
    en: "Complete Home Visit & View Summary",
    te: "సందర్శన పూర్తి చేసి సారాంశం చూడండి",
    hi: "विजिट पूरी करें और सारांश देखें",
  },
  visitCompleteTitle: {
    en: "Home Visit Recorded",
    te: "గృహ సందర్శన నమోదు చేయబడింది",
    hi: "गृह भ्रमण रिकॉर्ड किया गया",
  },
  visitRecordedDesc: {
    en: "Well done! You completed {name}'s 24-hour dietary recall and nutrition counseling.",
    te: "చాలా బాగుంది! మీరు {name} యొక్క 24-గంటల ఆహార సేకరణ మరియు పోషకాహార సలహాను పూర్తి చేశారు.",
    hi: "बहुत बढ़िया! आपने {name} का 24-घंटे का आहार रिकॉल और पोषण परामर्श पूरा कर लिया है।",
  },
  visitSummaryHeader: {
    en: "Home Visit Summary",
    te: "గృహ సందర్శన సారాంశం",
    hi: "गृह भ्रमण सारांश",
  },
  recallAccuracyRow: {
    en: "Your Recall Dish Accuracy",
    te: "మీ ఆహార గుర్తింపు ఖచ్చితత్వం",
    hi: "आपकी आहार पहचान सटीकता",
  },
  engagementRow: {
    en: "30-Day App Engagement",
    te: "30-రోజుల యాప్ వినియోగం",
    hi: "30-दिन ऐप सक्रियता",
  },
  engagementValue: {
    en: "{days} of 30 days",
    te: "30 రోజులలో {days} రోజులు",
    hi: "30 दिनों में से {days} दिन",
  },
  yesterdaysCoverageRow: {
    en: "Yesterday's Food Groups",
    te: "నిన్న తిన్న ఆహార వర్గాలు",
    hi: "कल के खाद्य समूह",
  },
  coverageValue: {
    en: "{count} of 10 groups",
    te: "10 వర్గాలలో {count} వర్గాలు",
    hi: "10 समूहों में से {count} समूह",
  },
  gapsFoundRow: {
    en: "Missing Groups Counseled",
    te: "సలహా ఇచ్చిన లోపాలు",
    hi: "परामर्श दिए गए छूटे समूह",
  },
  ifaAdherenceRow: {
    en: "IFA Tablet Adherence",
    te: "IFA ఐరన్ మాత్రల వినియోగం",
    hi: "IFA आयरन गोलियों का सेवन",
  },
  closeAshaModeBtn: {
    en: "Return to Main Menu",
    te: "ప్రధాన మెనూకు వెళ్ళండి",
    hi: "मुख्य मेनू पर लौटें",
  },
  practiceAnotherMotherBtn: {
    en: "Practice Next Mother Scenario ({next}/3)",
    te: "తదుపరి తల్లి ప్రొఫైల్‌తో ప్రాక్టీస్ చేయండి ({next}/3)",
    hi: "अगली माँ के साथ अभ्यास करें ({next}/3)",
  },
};

function getScenarioBucket(m: MotherVisitProfile): "over" | "under" | "mixed" {
  const hasExtraLogged = m.motherLoggedDishes.some(
    (d) => !m.recommendedAshaDishes.includes(d)
  );
  const hasMissedByMother = m.recommendedAshaDishes.some(
    (d) => !m.motherLoggedDishes.includes(d)
  );
  if (hasExtraLogged && hasMissedByMother) return "mixed";
  if (hasMissedByMother) return "under";
  return "over";
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

let balancedMotherDeck: string[] = [];

function pickRandomMother(excludeId?: string): MotherVisitProfile {
  if (balancedMotherDeck.length === 0) {
    const over = shuffleArray(
      MOTHER_VISIT_PROFILES.filter((m) => getScenarioBucket(m) === "over")
    );
    const under = shuffleArray(
      MOTHER_VISIT_PROFILES.filter((m) => getScenarioBucket(m) === "under")
    );
    const mixed = shuffleArray(
      MOTHER_VISIT_PROFILES.filter((m) => getScenarioBucket(m) === "mixed")
    );
    const maxLen = Math.max(over.length, under.length, mixed.length);
    const nextDeck: string[] = [];
    for (let i = 0; i < maxLen; i++) {
      const triad = shuffleArray(
        [over[i], under[i], mixed[i]].filter(Boolean) as MotherVisitProfile[]
      );
      for (const m of triad) {
        nextDeck.push(m.id);
      }
    }
    if (excludeId && nextDeck[0] === excludeId && nextDeck.length > 1) {
      [nextDeck[0], nextDeck[1]] = [nextDeck[1], nextDeck[0]];
    }
    balancedMotherDeck = nextDeck;
  }

  let nextId = balancedMotherDeck.shift()!;
  if (excludeId && nextId === excludeId && balancedMotherDeck.length > 0) {
    const altId = balancedMotherDeck.shift()!;
    balancedMotherDeck.unshift(nextId);
    nextId = altId;
  }

  return (
    MOTHER_VISIT_PROFILES.find((m) => m.id === nextId) || MOTHER_VISIT_PROFILES[0]
  );
}

function AshaVisitSimulator() {
  const navigate = useNavigate();
  const { lang, setLang } = useLang();

  const [mother, setMother] = useState<MotherVisitProfile>(() => pickRandomMother());
  const [step, setStep] = useState<VisitStep>("pin");
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", ""]);
  const [pinError, setPinError] = useState(false);
  const [showPinHint, setShowPinHint] = useState(false);

  // Recall step state — starts empty so the ASHA worker must fill it herself!
  const [ashaDishes, setAshaDishes] = useState<string[]>([]);
  const [motherSpoken, setMotherSpoken] = useState(false);
  const [recallError, setRecallError] = useState(false);
  const [showComparisonTable, setShowComparisonTable] = useState(true);
  const [completedMotherIds, setCompletedMotherIds] = useState<string[]>([]);
  const [speakingSource, setSpeakingSource] = useState<
    "mother_te" | "mother_lang" | "coaching" | null
  >(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const pinRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setSpeakingSource(null);
  }, []);

  useEffect(() => {
    stopAudio();
    return () => stopAudio();
  }, [step, lang, mother.id, stopAudio]);

  const speakWithFallback = (
    text: string,
    source: "mother_te" | "mother_lang" | "coaching",
    mp3Url?: string,
    ttsLocale?: string
  ) => {
    if (speakingSource === source) {
      stopAudio();
      return;
    }
    stopAudio();
    setSpeakingSource(source);

    const runBrowserTTS = () => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        setSpeakingSource(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang =
        ttsLocale || (lang === "te" ? "te-IN" : lang === "hi" ? "hi-IN" : "en-IN");
      utterance.rate = 0.92;
      utterance.onend = () => setSpeakingSource(null);
      utterance.onerror = () => setSpeakingSource(null);
      window.speechSynthesis.speak(utterance);
    };

    if (mp3Url && typeof window !== "undefined") {
      const audio = new Audio(mp3Url);
      audioRef.current = audio;
      audio.onended = () => setSpeakingSource(null);
      audio.onerror = () => runBrowserTTS();
      audio.play().catch(() => runBrowserTTS());
    } else {
      runBrowserTTS();
    }
  };

  const handleLanguageChange = (nextLang: Lang) => {
    playPop();
    stopAudio();
    setLang(nextLang);
  };

  const randomizeMother = () => {
    playPop();
    stopAudio();
    const nextMother = pickRandomMother(mother.id);
    setMother(nextMother);
    setAshaDishes([]);
    setMotherSpoken(false);
    setRecallError(false);
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

  const handlePinKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
      pinRefs[index - 1].current?.focus();
    } else if (e.key === "Enter") {
      handlePinSubmit();
    }
  };

  const handleAutoFillPin = () => {
    playPop();
    setPinDigits(["1", "2", "3", "4"]);
    setPinError(false);
  };

  const handlePinSubmit = () => {
    const pin = pinDigits.join("");
    if (pin === "1234") {
      playSuccess();
      setPinError(false);
      setStep("overview");
    } else {
      playFailure();
      setPinError(true);
    }
  };

  const toggleDishInRecall = (dishId: string) => {
    playPop();
    setRecallError(false);
    setAshaDishes((prev) =>
      prev.includes(dishId)
        ? prev.filter((id) => id !== dishId)
        : [...prev, dishId]
    );
  };

  const motherLoggedGroups = useMemo(() => {
    const set = new Set<FoodGroupId>();
    mother.motherLoggedDishes.forEach((dId) => {
      const dish = VISIT_DISHES.find((d) => d.id === dId);
      dish?.groups.forEach((g) => set.add(g));
    });
    return set;
  }, [mother]);

  const ashaGroups = useMemo(() => {
    const set = new Set<FoodGroupId>();
    ashaDishes.forEach((dId) => {
      const dish = VISIT_DISHES.find((d) => d.id === dId);
      dish?.groups.forEach((g) => set.add(g));
    });
    return set;
  }, [ashaDishes]);

  const missingGroups = useMemo(() => {
    return GROUP_META.filter((g) => !ashaGroups.has(g.id));
  }, [ashaGroups]);

  const focusGroups = useMemo(() => {
    const sorted = [...missingGroups].sort(
      (a, b) =>
        (mother.daysPerGroup[a.id] ?? 0) - (mother.daysPerGroup[b.id] ?? 0)
    );
    return sorted.slice(0, 6);
  }, [missingGroups, mother]);

  // Recall accuracy check: compare ashaDishes vs mother.recommendedAshaDishes
  const missedDishObjs = useMemo(() => {
    return mother.recommendedAshaDishes
      .filter((id) => !ashaDishes.includes(id))
      .map((id) => VISIT_DISHES.find((d) => d.id === id))
      .filter(Boolean);
  }, [mother, ashaDishes]);

  const extraDishObjs = useMemo(() => {
    return ashaDishes
      .filter((id) => !mother.recommendedAshaDishes.includes(id))
      .map((id) => VISIT_DISHES.find((d) => d.id === id))
      .filter(Boolean);
  }, [mother, ashaDishes]);

  const isRecallPerfect =
    missedDishObjs.length === 0 && extraDishObjs.length === 0 && ashaDishes.length > 0;

  const recallAccuracyPercent = useMemo(() => {
    const targetSet = new Set(mother.recommendedAshaDishes);
    const chosenSet = new Set(ashaDishes);
    const union = new Set([...targetSet, ...chosenSet]);
    if (union.size === 0) return 0;
    let intersection = 0;
    union.forEach((id) => {
      if (targetSet.has(id) && chosenSet.has(id)) intersection++;
    });
    return Math.round((intersection / union.size) * 100);
  }, [mother, ashaDishes]);

  const otherDishesList = useMemo(() => {
    return VISIT_DISHES.filter((d) => !mother.motherLoggedDishes.includes(d.id));
  }, [mother]);

  // ── SCREEN 1: 4-DIGIT PIN LOGIN ──────────────────────────────────────────
  if (step === "pin") {
    const isPinReady = pinDigits.join("").length === 4;
    return (
      <main className="min-h-dvh bg-[#F4F7F5] flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-lg bg-white rounded-2xl border border-[#D5E2DC] p-6 sm:p-8 flex flex-col gap-6">
          {/* Top Bar */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{UI_TEXT.cancel[lang]}</span>
            </button>

            <select
              aria-label="Language"
              value={lang}
              onChange={(e) => handleLanguageChange(e.target.value as Lang)}
              className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50 transition cursor-pointer"
            >
              {LANGS.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>

          {/* Hero Banner */}
          <div className="bg-[#EAF5F0] border border-[#C2DFD0] rounded-2xl p-6 flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#145A3E] text-white flex items-center justify-center">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F3826]">
              {UI_TEXT.ashaVisitMode[lang]}
            </h1>
            <p className="text-sm sm:text-base text-[#234838] leading-relaxed max-w-md">
              {UI_TEXT.loginAlertDesc[lang]}
            </p>
          </div>

          {/* PIN Input Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <label className="text-sm font-extrabold text-slate-800">
                {UI_TEXT.ashaIdLabel[lang]}
              </label>
              <button
                type="button"
                onClick={handleAutoFillPin}
                className="text-xs sm:text-sm font-extrabold text-[#145A3E] bg-[#EAF5F0] border border-[#B8DEC9] px-3.5 py-1.5 rounded-xl hover:bg-[#d8ede3] transition cursor-pointer"
              >
                {UI_TEXT.autoFillPin[lang]}
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 sm:gap-4 max-w-xs mx-auto w-full">
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
                  className={`h-16 sm:h-18 text-center text-2xl sm:text-3xl font-extrabold rounded-xl border-2 outline-none transition ${
                    pinError
                      ? "border-red-600 bg-red-50 text-red-800"
                      : digit
                      ? "border-[#145A3E] bg-[#EAF5F0]/60 text-[#0F3826]"
                      : "border-slate-300 bg-slate-50 text-slate-900 focus:border-[#145A3E] focus:bg-white"
                  }`}
                />
              ))}
            </div>

            {pinError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs sm:text-sm text-center font-bold text-red-700">
                {UI_TEXT.pinHintToast[lang]}
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowPinHint((v) => !v)}
              className="text-sm font-bold text-[#145A3E] hover:underline self-center cursor-pointer"
            >
              {UI_TEXT.forgotPin[lang]}
            </button>

            {showPinHint && (
              <div className="text-xs sm:text-sm text-center bg-[#EAF5F0] text-[#0F3826] border border-[#B8DEC9] rounded-xl p-3 font-semibold">
                {UI_TEXT.pinHintToast[lang]}
              </div>
            )}
          </div>

          {/* Info Note */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start gap-3 text-slate-700 text-xs sm:text-sm leading-relaxed">
            <Info className="w-5 h-5 text-[#145A3E] shrink-0 mt-0.5" />
            <span>{UI_TEXT.autoLockNotice[lang]}</span>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={handlePinSubmit}
            className={`w-full py-4 px-6 rounded-xl font-extrabold text-base sm:text-lg text-white flex items-center justify-center gap-2 transition cursor-pointer ${
              isPinReady
                ? "bg-[#145A3E] hover:bg-[#0F4730] active:scale-[0.99]"
                : "bg-[#5B8E7A] hover:bg-[#4c7d69]"
            }`}
          >
            <span>{UI_TEXT.continueBtn[lang]}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    );
  }

  const handleBack = () => {
    playPop();
    if (step === "overview") setStep("pin");
    else if (step === "recall") setStep("overview");
    else if (step === "gaps") setStep("recall");
    else if (step === "complete") setStep("gaps");
  };

  const canJumpToStep = (target: Exclude<VisitStep, "pin">) => {
    if (target === "overview" || target === "recall") return true;
    if ((target === "gaps" || target === "complete") && ashaDishes.length > 0) return true;
    return false;
  };

  return (
    <main className="min-h-dvh bg-[#F4F7F5] flex flex-col items-center pb-24">
      <div className="w-full max-w-2xl flex flex-col gap-5 px-3 sm:px-6 pt-3 sm:pt-5">
        {/* Top Navigation & Mother Profile Header */}
        <header className="bg-white rounded-2xl border border-[#D5E2DC] p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={handleBack}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 transition shrink-0 cursor-pointer"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-extrabold text-xl sm:text-2xl text-[#0F3826] leading-tight">
                    {mother.name[lang]}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-lg bg-[#EAF5F0] border border-[#B8DEC9] text-[#0F3826] text-xs font-extrabold">
                    {UI_TEXT.weekTrimesterSub[lang]
                      .replace("{week}", String(mother.week))
                      .replace("{trimester}", TRIMESTER_LABELS[mother.trimester][lang])}
                  </span>
                </div>
                <p className="text-xs font-bold text-[#145A3E] mt-0.5">
                  {UI_TEXT.practiceTrackerBadge[lang].replace(
                    "{done}",
                    String(Math.min(completedMotherIds.length, 3))
                  )}
                </p>
              </div>
            </div>

            {/* Right Controls: New Mother + Language */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={randomizeMother}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs sm:text-sm font-bold text-slate-800 transition cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-[#145A3E]" />
                <span>{UI_TEXT.switchMotherBtn[lang]}</span>
              </button>

              <select
                aria-label="Language"
                value={lang}
                onChange={(e) => handleLanguageChange(e.target.value as Lang)}
                className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs sm:text-sm font-extrabold text-slate-800 hover:bg-slate-50 transition cursor-pointer"
              >
                {LANGS.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4-Step Interactive Stepper Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-100">
            {STEP_TABS.map((t) => {
              const isActive = step === t.id;
              const enabled = canJumpToStep(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  disabled={!enabled}
                  onClick={() => {
                    if (enabled) {
                      playPop();
                      setStep(t.id);
                    }
                  }}
                  className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-extrabold text-center transition ${
                    isActive
                      ? "bg-[#145A3E] text-white"
                      : enabled
                      ? "bg-[#EAF5F0] text-[#0F3826] hover:bg-[#d8ede3] cursor-pointer"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {t.label[lang]}
                </button>
              );
            })}
          </div>
        </header>

        {/* Step Body Content */}
        <AnimatePresence mode="wait">
          {/* ── SCREEN 2: 30-DAY OVERVIEW ────────────────────────────── */}
          {step === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              {/* 30-Day Summary Banner */}
              <div className="bg-[#145A3E] text-white rounded-2xl p-5 sm:p-6 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-white">
                      {UI_TEXT.overviewHeading[lang].replace("{name}", mother.name[lang])}
                    </h2>
                    <p className="text-xs sm:text-sm text-[#CBE4D8] mt-0.5">
                      {UI_TEXT.daysLoggedSub[lang]}
                    </p>
                  </div>
                  <span className="bg-[#0B3523] border border-[#2C7A5B] text-white text-xs sm:text-sm font-extrabold px-3.5 py-1.5 rounded-xl">
                    {mother.activeDays30 < 15
                      ? UI_TEXT.belowTarget[lang]
                      : UI_TEXT.onTrack[lang]}
                  </span>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-extrabold tracking-tight">
                    {mother.activeDays30}
                  </span>
                  <span className="text-lg sm:text-xl text-[#CBE4D8] font-bold">
                    / 30 {UI_TEXT.daysLabel[lang]}
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-[#0B3523] overflow-hidden">
                  <div
                    className="h-full bg-[#63E6BE] rounded-full transition-all"
                    style={{ width: `${Math.min(100, (mother.activeDays30 / 30) * 100)}%` }}
                  />
                </div>

                <div className="text-xs sm:text-sm text-[#DCEEE5] font-semibold pt-1 border-t border-white/15">
                  {UI_TEXT.yourLastVisit[lang]} {mother.lastVisitText[lang]}
                </div>
              </div>

              {/* 10 Food Groups Coverage Grid */}
              <div className="bg-white rounded-2xl border border-[#D5E2DC] p-5 sm:p-6 flex flex-col gap-4">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0F3826]">
                    {UI_TEXT.eatingRarelyHeading[lang]}
                  </h3>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200">
                    {UI_TEXT.under10Days[lang]}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {GROUP_META.map((g) => {
                    const days = mother.daysPerGroup[g.id] ?? 0;
                    const isRare = days < 10;
                    return (
                      <div
                        key={g.id}
                        className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
                          isRare
                            ? "bg-red-50/40 border-red-200/80"
                            : "bg-[#F4FAF7] border-[#C2DFD0]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-sm sm:text-base text-slate-900">
                            {g.shortName[lang]}
                          </span>
                          <span
                            className={`text-sm font-extrabold px-2.5 py-0.5 rounded-lg ${
                              isRare
                                ? "bg-red-100 text-[#B91C1C]"
                                : "bg-[#D8EDE3] text-[#0F3826]"
                            }`}
                          >
                            {days} / 30 {UI_TEXT.daysLabel[lang]}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-200/80 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              isRare ? "bg-[#DC2626]" : "bg-[#145A3E]"
                            }`}
                            style={{ width: `${Math.min(100, (days / 30) * 100)}%` }}
                          />
                        </div>
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
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              {/* STEP A: Listen to Mother Card */}
              <div className="bg-white rounded-2xl border-2 border-[#145A3E] p-5 sm:p-6 flex flex-col gap-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#0F3826]">
                    {UI_TEXT.recallHeading[lang].replace("{name}", mother.name[lang])}
                  </h2>
                  <p className="text-sm font-semibold text-slate-600 mt-1">
                    {UI_TEXT.step1ListenTitle[lang].replace("{name}", mother.name[lang])}
                  </p>
                </div>

                {/* Large Audio Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setMotherSpoken(true);
                      speakWithFallback(
                        mother.motherDialogue.te,
                        "mother_te",
                        `/audio/visit_${mother.id}_te.mp3`,
                        "te-IN"
                      );
                    }}
                    className={`sm:col-span-2 min-h-14 py-3.5 px-5 rounded-xl font-extrabold text-sm sm:text-base flex items-center justify-center gap-2.5 transition cursor-pointer ${
                      speakingSource === "mother_te"
                        ? "bg-red-600 text-white animate-pulse"
                        : "bg-[#145A3E] hover:bg-[#0F4730] text-white"
                    }`}
                  >
                    {speakingSource === "mother_te" ? (
                      <>
                        <Square className="w-5 h-5 fill-current shrink-0" />
                        <span>{UI_TEXT.stopAudioBtn[lang]}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-5 h-5 shrink-0" />
                        <span>{UI_TEXT.askMotherTeluguBtn[lang]}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMotherSpoken(true);
                      const altLang = lang === "te" ? "en" : lang;
                      speakWithFallback(
                        mother.motherDialogue[altLang],
                        "mother_lang",
                        `/audio/visit_${mother.id}_${altLang}.mp3`,
                        altLang === "hi" ? "hi-IN" : "en-IN"
                      );
                    }}
                    className={`min-h-14 py-3.5 px-4 rounded-xl font-extrabold text-xs sm:text-sm border-2 flex items-center justify-center gap-2 transition cursor-pointer ${
                      speakingSource === "mother_lang"
                        ? "bg-red-600 text-white border-red-600 animate-pulse"
                        : "bg-[#EAF5F0] text-[#0F3826] border-[#B8DEC9] hover:bg-[#d8ede3]"
                    }`}
                  >
                    {speakingSource === "mother_lang" ? (
                      <>
                        <Square className="w-4 h-4 fill-current shrink-0" />
                        <span>{UI_TEXT.stopAudioBtn[lang]}</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4 shrink-0" />
                        <span>{UI_TEXT.listenTranslatedBtn[lang]}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Spoken Dialogue Box */}
                {!motherSpoken ? (
                  <div className="bg-[#F4FAF7] border border-[#C2DFD0] rounded-xl p-4 text-sm font-semibold text-[#145A3E]">
                    {UI_TEXT.clickToHearHint[lang]}
                  </div>
                ) : (
                  <div className="bg-[#FFFBEB] border border-amber-300 rounded-xl p-4 flex flex-col gap-2">
                    <p className="text-base sm:text-lg font-bold text-slate-900 leading-relaxed">
                      "{mother.motherDialogue.te}"
                    </p>
                    {lang !== "te" && (
                      <p className="text-sm font-semibold text-slate-700 leading-relaxed border-t border-amber-200 pt-2">
                        "{mother.motherDialogue[lang]}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* STEP B: Dishes Clicked by Mother in Her Phone App */}
              <div className="bg-white rounded-2xl border border-[#D5E2DC] p-5 sm:p-6 flex flex-col gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0F3826]">
                    {UI_TEXT.motherLoggedHeader[lang]}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">
                    {UI_TEXT.motherLoggedSub[lang].replace("{name}", mother.name[lang])}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {mother.motherLoggedDishes.map((dishId) => {
                    const dish = VISIT_DISHES.find((d) => d.id === dishId);
                    if (!dish) return null;
                    const isSelected = ashaDishes.includes(dishId);
                    const groupNames = dish.groups
                      .map((gId) => GROUP_META.find((g) => g.id === gId)?.shortName[lang])
                      .filter(Boolean)
                      .join(" + ");

                    return (
                      <button
                        key={dishId}
                        type="button"
                        onClick={() => toggleDishInRecall(dishId)}
                        className={`p-4 rounded-xl border-2 text-left flex items-center justify-between gap-3 transition cursor-pointer ${
                          isSelected
                            ? "border-[#145A3E] bg-[#EAF5F0] text-[#0F3826]"
                            : "border-slate-300 bg-white hover:border-[#145A3E]/60 hover:bg-slate-50 text-slate-900"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-extrabold text-base leading-snug">
                            {dish.name[lang]}
                          </div>
                          <div className="text-xs font-semibold text-slate-600 mt-0.5 truncate">
                            {groupNames}
                          </div>
                        </div>

                        <span
                          className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-extrabold ${
                            isSelected
                              ? "bg-[#145A3E] text-white"
                              : "bg-slate-100 text-slate-700"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>{UI_TEXT.selectedBadge[lang]}</span>
                            </>
                          ) : (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>{UI_TEXT.tapToSelectBadge[lang]}</span>
                            </>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* STEP C: Other Dishes (Always visible — no hidden drawer!) */}
              <div className="bg-white rounded-2xl border border-[#D5E2DC] p-5 sm:p-6 flex flex-col gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-[#0F3826]">
                    {UI_TEXT.otherDishesHeader[lang]}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">
                    {UI_TEXT.otherDishesSub[lang].replace("{name}", mother.name[lang])}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {otherDishesList.map((dish) => {
                    const isSelected = ashaDishes.includes(dish.id);
                    const groupNames = dish.groups
                      .map((gId) => GROUP_META.find((g) => g.id === gId)?.shortName[lang])
                      .filter(Boolean)
                      .join(" + ");

                    return (
                      <button
                        key={dish.id}
                        type="button"
                        onClick={() => toggleDishInRecall(dish.id)}
                        className={`p-3.5 rounded-xl border-2 text-left flex items-center justify-between gap-2.5 transition cursor-pointer ${
                          isSelected
                            ? "border-[#145A3E] bg-[#EAF5F0] text-[#0F3826]"
                            : "border-slate-200 bg-slate-50/70 hover:border-[#145A3E]/50 hover:bg-white text-slate-800"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-sm sm:text-base leading-snug">
                            {dish.name[lang]}
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 truncate">
                            {groupNames}
                          </div>
                        </div>

                        <span
                          className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-extrabold ${
                            isSelected
                              ? "bg-[#145A3E] text-white"
                              : "bg-white border border-slate-300 text-slate-700"
                          }`}
                        >
                          {isSelected ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Confirmed Selection Summary Card */}
              <div className="bg-[#EAF5F0] border border-[#B8DEC9] rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="text-sm sm:text-base font-extrabold text-[#0F3826] flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-[#145A3E]" />
                    <span>
                      {UI_TEXT.ashaAddsHeader[lang]
                        .replace("{count}", String(ashaDishes.length))
                        .replace("{groups}", String(ashaGroups.size))}
                    </span>
                  </h3>
                </div>

                {ashaDishes.length === 0 ? (
                  <p className="text-xs sm:text-sm font-semibold text-[#234838]">
                    {UI_TEXT.emptyAshaAddsHint[lang]}
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {ashaDishes.map((dishId) => {
                      const dish = VISIT_DISHES.find((d) => d.id === dishId);
                      if (!dish) return null;
                      return (
                        <button
                          key={dishId}
                          type="button"
                          onClick={() => toggleDishInRecall(dishId)}
                          className="px-3.5 py-2 rounded-xl bg-[#145A3E] text-white text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 hover:bg-[#0F4730] transition cursor-pointer"
                        >
                          <span>{dish.name[lang]}</span>
                          <X className="w-3.5 h-3.5" />
                        </button>
                      );
                    })}
                  </div>
                )}

                {recallError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs sm:text-sm font-bold text-red-700">
                    {UI_TEXT.selectAtLeastOneError[lang]}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── SCREEN 4: TODAY'S GAPS ───────────────────────────────── */}
          {step === "gaps" && (
            <motion.div
              key="gaps"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              {/* Recall Accuracy Feedback Card */}
              {isRecallPerfect ? (
                <div className="bg-[#EAF5F0] border-2 border-[#145A3E] rounded-2xl p-5 flex items-start gap-3.5">
                  <CheckCircle2 className="w-6 h-6 text-[#145A3E] shrink-0 mt-0.5" />
                  <div>
                    <h2 className="font-extrabold text-base sm:text-lg text-[#0F3826]">
                      {UI_TEXT.recallPerfectTitle[lang].replace(
                        "{name}",
                        mother.name[lang]
                      )}
                    </h2>
                  </div>
                </div>
              ) : (
                <div className="bg-[#FFFBEB] border-2 border-amber-400 rounded-2xl p-5 flex flex-col gap-3.5">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                      <h2 className="font-extrabold text-base sm:text-lg text-amber-950">
                        {UI_TEXT.recallCheckTitle[lang].replace(
                          "{name}",
                          mother.name[lang]
                        )}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        playSuccess();
                        setAshaDishes([...mother.recommendedAshaDishes]);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#145A3E] hover:bg-[#0F4730] text-white text-xs sm:text-sm font-extrabold transition cursor-pointer"
                    >
                      {UI_TEXT.applyCorrectDishesBtn[lang]}
                    </button>
                  </div>

                  {missedDishObjs.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-amber-900">
                        {UI_TEXT.missedDishesLabel[lang]}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {missedDishObjs.map((d) => (
                          <span
                            key={d!.id}
                            className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs sm:text-sm font-extrabold text-slate-900"
                          >
                            + {d!.name[lang]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {extraDishObjs.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs sm:text-sm font-bold text-red-800">
                        {UI_TEXT.extraDishesLabel[lang]}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {extraDishObjs.map((d) => (
                          <span
                            key={d!.id}
                            className="px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-xs sm:text-sm font-extrabold text-red-800"
                          >
                            × {d!.name[lang]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2-Column Comparison Cards: App Clicked vs ASHA Confirmed */}
              <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-white rounded-2xl border border-[#D5E2DC] p-4 sm:p-5 flex flex-col gap-1">
                  <span className="text-xs sm:text-sm font-bold text-slate-600">
                    {UI_TEXT.motherLoggedBoxLabel[lang]}
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                    {motherLoggedGroups.size}{" "}
                    <span className="text-sm sm:text-base font-bold text-slate-500">
                      {UI_TEXT.groupsUnit[lang]}
                    </span>
                  </div>
                </div>

                <div className="bg-[#EAF5F0] rounded-2xl border border-[#B8DEC9] p-4 sm:p-5 flex flex-col gap-1">
                  <span className="text-xs sm:text-sm font-bold text-[#145A3E]">
                    {UI_TEXT.recallCoveredHeader[lang]}
                  </span>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#0F3826] mt-1">
                    {ashaGroups.size}{" "}
                    <span className="text-sm sm:text-base font-bold text-[#234838]">
                      {UI_TEXT.groupsUnit[lang]}
                    </span>
                  </div>
                </div>
              </div>

              {/* Missing Food Groups Card */}
              <div className="bg-white rounded-2xl border border-[#D5E2DC] p-5 sm:p-6 flex flex-col gap-4">
                <div>
                  <h3 className="font-extrabold text-lg sm:text-xl text-[#9A3412]">
                    {UI_TEXT.foodGroupsMissingTitle[lang].replace(
                      "{count}",
                      String(missingGroups.length)
                    )}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                    {UI_TEXT.notEatenDiscuss[lang].replace("{name}", mother.name[lang])}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {focusGroups.map((g) => (
                    <div
                      key={g.id}
                      className="px-4 py-3 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] flex items-center justify-between gap-2"
                    >
                      <span className="font-extrabold text-sm sm:text-base text-[#7C2D12]">
                        {g.shortName[lang]}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white text-[#9A3412] border border-[#FDBA74]">
                        {mother.daysPerGroup[g.id] ?? 0}/30 {UI_TEXT.daysLabel[lang]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Coaching Card with Voice Playback */}
              {(() => {
                const coachingText = UI_TEXT.suggestedCoachingBody[lang]
                  .replace(
                    "{groups}",
                    focusGroups
                      .slice(0, 3)
                      .map((g) => g.shortName[lang])
                      .join(", ")
                  )
                  .replace("{name}", mother.name[lang]);
                return (
                  <div className="bg-[#EAF5F0] border border-[#B8DEC9] rounded-2xl p-5 sm:p-6 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="text-base sm:text-lg font-extrabold text-[#0F3826]">
                        {UI_TEXT.suggestedCoachingHeader[lang]}
                      </h3>
                      <button
                        type="button"
                        onClick={() => speakWithFallback(coachingText, "coaching")}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition cursor-pointer ${
                          speakingSource === "coaching"
                            ? "bg-red-600 text-white animate-pulse"
                            : "bg-[#145A3E] hover:bg-[#0F4730] text-white"
                        }`}
                      >
                        {speakingSource === "coaching" ? (
                          <>
                            <Square className="w-4 h-4 fill-current" />
                            <span>{UI_TEXT.stopAudioBtn[lang]}</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4" />
                            <span>{UI_TEXT.listenCoachingBtn[lang]}</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-sm sm:text-base text-[#18392B] leading-relaxed font-semibold">
                      {coachingText}
                    </p>
                  </div>
                );
              })()}

              {/* Collapsible 10-Group Comparison Table */}
              <div className="bg-white rounded-2xl border border-[#D5E2DC] overflow-hidden">
                <button
                  type="button"
                  onClick={() => {
                    playPop();
                    setShowComparisonTable((v) => !v);
                  }}
                  className="w-full px-5 py-4 flex items-center justify-between text-left font-extrabold text-sm sm:text-base text-[#0F3826] hover:bg-slate-50 transition cursor-pointer"
                >
                  <span>{UI_TEXT.showComparisonTable[lang]}</span>
                  {showComparisonTable ? (
                    <ChevronUp className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  )}
                </button>

                {showComparisonTable && (
                  <div className="border-t border-slate-100 divide-y divide-slate-100 text-sm">
                    <div className="grid grid-cols-12 px-5 py-2.5 bg-slate-50 text-xs font-extrabold text-slate-600">
                      <div className="col-span-6">{UI_TEXT.foodGroupCol[lang]}</div>
                      <div className="col-span-3 text-center">
                        {UI_TEXT.motherLoggedBoxLabel[lang]}
                      </div>
                      <div className="col-span-3 text-center">
                        {UI_TEXT.ashaAddedCol[lang]}
                      </div>
                    </div>

                    {GROUP_META.map((g) => {
                      const inMother = motherLoggedGroups.has(g.id);
                      const inAsha = ashaGroups.has(g.id);
                      return (
                        <div
                          key={g.id}
                          className="grid grid-cols-12 items-center px-5 py-3"
                        >
                          <div className="col-span-6 font-bold text-slate-800">
                            {g.shortName[lang]}
                          </div>
                          <div className="col-span-3 flex justify-center">
                            {inMother ? (
                              <span className="w-6 h-6 rounded-md bg-slate-200 text-slate-800 flex items-center justify-center font-extrabold text-xs">
                                ✓
                              </span>
                            ) : (
                              <span className="text-slate-300 font-bold">—</span>
                            )}
                          </div>
                          <div className="col-span-3 flex justify-center">
                            {inAsha ? (
                              <span className="w-6 h-6 rounded-md bg-[#145A3E] text-white flex items-center justify-center font-extrabold text-xs">
                                ✓
                              </span>
                            ) : (
                              <span className="text-red-500 font-bold text-xs">✗</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ── SCREEN 5: VISIT COMPLETE ─────────────────────────────── */}
          {step === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-5"
            >
              {/* Completion Hero Card */}
              <div className="bg-white rounded-2xl border border-[#D5E2DC] p-6 sm:p-8 flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#145A3E] text-white flex items-center justify-center">
                  <Award className="w-9 h-9" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F3826]">
                    {UI_TEXT.visitCompleteTitle[lang]}
                  </h2>
                  <p className="text-sm sm:text-base text-slate-600 max-w-md leading-relaxed">
                    {UI_TEXT.visitRecordedDesc[lang].replace(
                      "{name}",
                      mother.name[lang]
                    )}
                  </p>
                </div>

                {/* 3-Visit Progress Pill */}
                <div className="px-4 py-2 rounded-xl bg-[#EAF5F0] border border-[#B8DEC9] text-sm font-extrabold text-[#0F3826]">
                  {UI_TEXT.practiceTrackerBadge[lang].replace(
                    "{done}",
                    String(Math.min(completedMotherIds.length, 3))
                  )}
                </div>
              </div>

              {/* Visit Summary Card */}
              <div className="bg-white rounded-2xl border border-[#D5E2DC] overflow-hidden">
                <div className="bg-[#EAF5F0] px-5 py-3.5 text-sm font-extrabold text-[#0F3826]">
                  {UI_TEXT.visitSummaryHeader[lang]}
                </div>
                <div className="divide-y divide-slate-100 text-sm sm:text-base">
                  <div className="px-5 py-4 flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">
                      {UI_TEXT.recallAccuracyRow[lang]}
                    </span>
                    <span className="font-extrabold text-[#145A3E]">
                      {recallAccuracyPercent}%
                    </span>
                  </div>
                  <div className="px-5 py-4 flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">
                      {UI_TEXT.engagementRow[lang]}
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {UI_TEXT.engagementValue[lang].replace(
                        "{days}",
                        String(mother.activeDays30)
                      )}
                    </span>
                  </div>
                  <div className="px-5 py-4 flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">
                      {UI_TEXT.yesterdaysCoverageRow[lang]}
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {UI_TEXT.coverageValue[lang].replace(
                        "{count}",
                        String(ashaGroups.size)
                      )}
                    </span>
                  </div>
                  <div className="px-5 py-4 flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">
                      {UI_TEXT.gapsFoundRow[lang]}
                    </span>
                    <span className="font-extrabold text-[#B45309]">
                      {missingGroups.length}
                    </span>
                  </div>
                  <div className="px-5 py-4 flex items-center justify-between">
                    <span className="text-slate-600 font-semibold">
                      {UI_TEXT.ifaAdherenceRow[lang]}
                    </span>
                    <span className="font-extrabold text-slate-900">
                      {mother.ifaAdherence}
                    </span>
                  </div>
                </div>
              </div>

              {/* Practice Another Mother Button */}
              <button
                type="button"
                onClick={() => {
                  randomizeMother();
                  setStep("overview");
                }}
                className="w-full py-4 px-5 rounded-xl bg-[#145A3E] hover:bg-[#0F4730] text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RefreshCw className="w-5 h-5" />
                <span>
                  {UI_TEXT.practiceAnotherMotherBtn[lang].replace(
                    "{next}",
                    String(Math.min(completedMotherIds.length + 1, 3))
                  )}
                </span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fixed High-Contrast Bottom Action Bar */}
      <footer className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur-xs border-t border-[#D5E2DC] p-3.5 sm:p-4">
        <div className="max-w-2xl mx-auto">
          {step === "overview" && (
            <button
              type="button"
              onClick={() => {
                playPop();
                setStep("recall");
              }}
              className="w-full py-4 px-6 rounded-xl bg-[#145A3E] hover:bg-[#0F4730] text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 active:scale-[0.99] transition cursor-pointer"
            >
              <span>{UI_TEXT.nextRecallBtn[lang]}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {step === "recall" && (
            <button
              type="button"
              onClick={() => {
                if (ashaDishes.length === 0) {
                  playFailure();
                  setRecallError(true);
                  return;
                }
                playSuccess();
                setStep("gaps");
              }}
              className={`w-full py-4 px-6 rounded-xl text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 active:scale-[0.99] transition cursor-pointer ${
                ashaDishes.length === 0
                  ? "bg-[#5B8E7A] hover:bg-[#4c7d69]"
                  : "bg-[#145A3E] hover:bg-[#0F4730]"
              }`}
            >
              <span>
                {UI_TEXT.saveRecallBtn[lang].replace(
                  "{count}",
                  String(ashaDishes.length)
                )}
              </span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {step === "gaps" && (
            <button
              type="button"
              onClick={() => {
                playSuccess();
                setCompletedMotherIds((prev) =>
                  prev.includes(mother.id) ? prev : [...prev, mother.id]
                );
                setStep("complete");
              }}
              className="w-full py-4 px-6 rounded-xl bg-[#145A3E] hover:bg-[#0F4730] text-white font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 active:scale-[0.99] transition cursor-pointer"
            >
              <span>{UI_TEXT.nextObservationsBtn[lang]}</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {step === "complete" && (
            <button
              type="button"
              onClick={() => {
                playPop();
                navigate({ to: "/" });
              }}
              className="w-full py-4 px-6 rounded-xl border-2 border-[#145A3E] bg-white hover:bg-[#EAF5F0] text-[#0F3826] font-extrabold text-base sm:text-lg flex items-center justify-center gap-2 active:scale-[0.99] transition cursor-pointer"
            >
              <span>{UI_TEXT.closeAshaModeBtn[lang]}</span>
            </button>
          )}
        </div>
      </footer>
    </main>
  );
}
