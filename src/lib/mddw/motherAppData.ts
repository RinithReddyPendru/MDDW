import type { FoodGroupId } from "./foodGroups";
import type { Lang } from "./translations";

export type MealTab = "breakfast" | "meals" | "fruits_nuts" | "snacks";

export interface MotherDish {
  id: string;
  name: Record<Lang, string>;
  category: MealTab;
  image: string;
  isVeg: boolean;
  groups: FoodGroupId[];
}

export interface MotherProfile {
  id: string;
  name: Record<Lang, string>;
  week: number;
  trimester: 1 | 2 | 3;
  quote: Record<Lang, string>;
  focusDishes: {
    name: Record<Lang, string>;
    image: string;
    bgColor: string;
  }[];
}

export interface GroupInfo {
  id: FoodGroupId;
  emoji: string;
  name: Record<Lang, string>;
  quickTip: Record<Lang, string>;
}

export const MDDW_GROUP_INFO: GroupInfo[] = [
  {
    id: "grains",
    emoji: "🌾",
    name: { en: "Grains & White Roots", te: "ధాన్యాలు & దుంపలు", hi: "अनाज और कंद" },
    quickTip: { en: "Rice, Roti, Idli, Dosa", te: "అన్నం, రోటీ, ఇడ్లీ, దోశ", hi: "चावल, रोटी, इडली" },
  },
  {
    id: "pulses",
    emoji: "🫘",
    name: { en: "Pulses & Dal", te: "పప్పు ధాన్యాలు", hi: "दालें और फलियां" },
    quickTip: { en: "Pappu, Sambar, Sprouts, Chana", te: "కందిపప్పు, పెసరపప్పు, శనగలు", hi: "दाल, सांभर, अंकुरित मूंग" },
  },
  {
    id: "nuts",
    emoji: "🥜",
    name: { en: "Nuts & Seeds", te: "గింజలు & పల్లీలు", hi: "मेवे और मूंगफली" },
    quickTip: { en: "Groundnut chutney, Badam, Sesame", te: "పల్లి చట్నీ, బాదం, నువ్వులు", hi: "मूंगफली चटनी, बादाम" },
  },
  {
    id: "dairy",
    emoji: "🥛",
    name: { en: "Dairy (Milk & Curd)", te: "పాలు & పెరుగు", hi: "दूध और दही" },
    quickTip: { en: "Curd/Perugu, Milk, Lassi", te: "పెరుగు, పాలు, లస్సీ, మజ్జిగ", hi: "दूध, दही, छाछ" },
  },
  {
    id: "meat",
    emoji: "🍗",
    name: { en: "Meat, Poultry & Fish", te: "మాంసం & చేపలు", hi: "मांस और मछली" },
    quickTip: { en: "Chicken, Fish curry, Mutton", te: "చికెన్, చేపల పులుసు, మాంసం", hi: "चिकन, मछली करी" },
  },
  {
    id: "eggs",
    emoji: "🥚",
    name: { en: "Eggs", te: "కోడిగుడ్లు", hi: "अंडे" },
    quickTip: { en: "Boiled egg, Omelette", te: "ఉడికించిన గుడ్డు, ఆమ్లెట్", hi: "उबला अंडा, ऑमलेट" },
  },
  {
    id: "dglv",
    emoji: "🥬",
    name: { en: "Dark Leafy Greens", te: "ఆకుకూరలు", hi: "हरी पत्तेदार सब्जियां" },
    quickTip: { en: "Thotakura, Munagaku, Palak, Gongura", te: "తోటకూర, మునగాకు, పాలకూర", hi: "पालक, सहजन के पत्ते" },
  },
  {
    id: "vitaminA",
    emoji: "🥕",
    name: { en: "Vit-A Fruits & Veg", te: "విటమిన్-ఎ పండ్లు & కూరలు", hi: "विटामिन-ए फल व सब्जी" },
    quickTip: { en: "Papaya, Mango, Carrot, Pumpkin", te: "బొప్పాయి, మామిడి, క్యారెట్", hi: "पपीता, आम, गाजर" },
  },
  {
    id: "otherVeg",
    emoji: "🍅",
    name: { en: "Other Vegetables", te: "ఇతర కూరగాయలు", hi: "अन्य सब्जियां" },
    quickTip: { en: "Tomato, Brinjal, Bendakaya, Dondakaya", te: "టమాటా, వంకాయ, బెండకాయ", hi: "टमाटर, बैंगन, भिंडी" },
  },
  {
    id: "otherFruit",
    emoji: "🍌",
    name: { en: "Other Fruits", te: "ఇతర పండ్లు", hi: "अन्य फल" },
    quickTip: { en: "Banana, Guava, Apple, Grapes", te: "అరటిపండు, జామకాయ, దానిమ్మ", hi: "केला, अमरूद, सेब" },
  },
];

export const MOTHER_PROFILES: MotherProfile[] = [
  {
    id: "swathi",
    name: { en: "Swathi", te: "స్వాతి", hi: "स्वाति" },
    week: 27,
    trimester: 3,
    quote: {
      en: "I can now hear your heartbeat — it's the most comforting sound in my world.",
      te: "నేను ఇప్పుడు మీ గుండె చప్పుడు వినగలను — ఇది నా ప్రపంచంలో అత్యంత ఓదార్పునిచ్చే శబ్దం.",
      hi: "अब मैं आपकी धड़कन सुन सकती हूँ — यह मेरी दुनिया की सबसे सुकून देने वाली आवाज़ है।",
    },
    focusDishes: [
      { name: { en: "Chicken Curry", te: "చికెన్ కూర", hi: "चिकन करी" }, image: "/mother_app/focus_chicken.png", bgColor: "bg-pink-100" },
      { name: { en: "Ragi Mudda", te: "రాగి ముద్ద", hi: "रागी मुड्डा" }, image: "/mother_app/focus_ragi.png", bgColor: "bg-amber-100" },
      { name: { en: "Leafy Green Dal", te: "ఆకుకూర పప్పు", hi: "पालक दाल" }, image: "/mother_app/focus_dal.png", bgColor: "bg-emerald-100" },
      { name: { en: "Fish Curry", te: "చేపల పులుసు", hi: "मछली करी" }, image: "/mother_app/focus_fish.png", bgColor: "bg-sky-100" },
    ],
  },
  {
    id: "lakshmi",
    name: { en: "Lakshmi", te: "లక్ష్మి", hi: "लक्ष्मी" },
    week: 22,
    trimester: 2,
    quote: {
      en: "I feel your little kicks every evening — growing stronger day by day.",
      te: "ప్రతి సాయంత్రం మీ చిన్న కదలికలు తెలుస్తున్నాయి — రోజురోజుకూ బలంగా ఎదుగుతున్నారు.",
      hi: "हर शाम मुझे आपकी हल्की हलचल महसूस होती है — दिन-ब-दिन और मजबूत हो रहे हैं।",
    },
    focusDishes: [
      { name: { en: "Leafy Green Dal", te: "ఆకుకూర పప్పు", hi: "पालक दाल" }, image: "/mother_app/focus_dal.png", bgColor: "bg-emerald-100" },
      { name: { en: "Boiled Egg", te: "ఉడికించిన గుడ్డు", hi: "उबला अंडा" }, image: "/mother_app/focus_chicken.png", bgColor: "bg-amber-100" },
      { name: { en: "Curd (Perugu)", te: "పెరుగు", hi: "दही" }, image: "/mother_app/focus_ragi.png", bgColor: "bg-pink-100" },
      { name: { en: "Drumstick Leaves", te: "మునగాకు", hi: "सहजन" }, image: "/mother_app/focus_dal.png", bgColor: "bg-emerald-100" },
    ],
  },
  {
    id: "anitha",
    name: { en: "Anitha", te: "అనిత", hi: "अनिता" },
    week: 14,
    trimester: 1,
    quote: {
      en: "A tiny life is taking shape inside me — every healthy bite is for you.",
      te: "నాలో ఒక చిన్న ప్రాణం రూపుదిద్దుకుంటోంది — నేను తినే ప్రతి ఆరోగ్యకరమైన ముద్ద మీ కోసమే.",
      hi: "मेरे अंदर एक नन्हीं सी जान आकार ले रही है — हर पौष्टिक निवाला आपके लिए है।",
    },
    focusDishes: [
      { name: { en: "Milk & Curd", te: "పాలు & పెరుగు", hi: "दूध और दही" }, image: "/mother_app/focus_ragi.png", bgColor: "bg-pink-100" },
      { name: { en: "Banana & Guava", te: "అరటి & జామకాయ", hi: "केला और अमरूद" }, image: "/mother_app/focus_dal.png", bgColor: "bg-amber-100" },
      { name: { en: "Sprouts", te: "మొలకలు", hi: "अंकुरित मूंग" }, image: "/mother_app/focus_chicken.png", bgColor: "bg-emerald-100" },
      { name: { en: "Leafy Greens", te: "ఆకుకూరలు", hi: "हरी पत्तेदार" }, image: "/mother_app/focus_fish.png", bgColor: "bg-sky-100" },
    ],
  },
];

export const MOTHER_DISHES: MotherDish[] = [
  // ── BREAKFAST (12 dishes from Screenshot 2) ──────────────────────────
  {
    id: "pesarattu",
    name: { en: "Pesarattu", te: "పెసరట్టు", hi: "पेसरट्टू" },
    category: "breakfast",
    image: "/mother_app/foods/pesarattu.png",
    isVeg: true,
    groups: ["pulses"],
  },
  {
    id: "idli",
    name: { en: "Idli", te: "ఇడ్లీ", hi: "इडली" },
    category: "breakfast",
    image: "/mother_app/foods/idli.png",
    isVeg: true,
    groups: ["grains", "pulses"],
  },
  {
    id: "dosa_plain",
    name: { en: "Dosa (plain)", te: "దోశ (సాదా)", hi: "डोसा (सादा)" },
    category: "breakfast",
    image: "/mother_app/foods/dosa_plain.png",
    isVeg: true,
    groups: ["grains", "pulses"],
  },
  {
    id: "upma",
    name: { en: "Upma", te: "ఉప్మా", hi: "उपमा" },
    category: "breakfast",
    image: "/mother_app/foods/upma.png",
    isVeg: true,
    groups: ["grains"],
  },
  {
    id: "rava_idli",
    name: { en: "Rava Idli", te: "రవ్వ ఇడ్లీ", hi: "रवा इडली" },
    category: "breakfast",
    image: "/mother_app/foods/rava_idli.png",
    isVeg: true,
    groups: ["grains"],
  },
  {
    id: "masala_dosa",
    name: { en: "Masala Dosa", te: "మసాలా దోశ", hi: "मसाला डोसा" },
    category: "breakfast",
    image: "/mother_app/foods/masala_dosa.png",
    isVeg: true,
    groups: ["grains", "pulses", "otherVeg"],
  },
  {
    id: "poha",
    name: { en: "Poha / Atukulu", te: "పోహా / అటుకులు", hi: "पोहा / चिवड़ा" },
    category: "breakfast",
    image: "/mother_app/foods/poha.png",
    isVeg: true,
    groups: ["grains", "nuts"],
  },
  {
    id: "chapati",
    name: { en: "Chapati / Roti", te: "చపాతీ / రోటీ", hi: "चपाती / रोटी" },
    category: "breakfast",
    image: "/mother_app/foods/chapati.png",
    isVeg: true,
    groups: ["grains"],
  },
  {
    id: "puri",
    name: { en: "Puri", te: "పూరి", hi: "पूरी" },
    category: "breakfast",
    image: "/mother_app/foods/puri.png",
    isVeg: true,
    groups: ["grains"],
  },
  {
    id: "parota",
    name: { en: "Parota", te: "పరోటా", hi: "परोठा" },
    category: "breakfast",
    image: "/mother_app/foods/parota.png",
    isVeg: true,
    groups: ["grains"],
  },
  {
    id: "millet_roti",
    name: { en: "Millet Roti", te: "మిల్లెట్ రోటీ", hi: "बाजरा / ज्वार रोटी" },
    category: "breakfast",
    image: "/mother_app/foods/millet_roti.png",
    isVeg: true,
    groups: ["grains"],
  },
  {
    id: "sarva_pindi",
    name: { en: "Sarva Pindi", te: "సర్వ పిండి", hi: "सर्व पिंडी" },
    category: "breakfast",
    image: "/mother_app/foods/sarva_pindi.png",
    isVeg: true,
    groups: ["grains", "pulses", "nuts"],
  },

  // ── MEALS (12 dishes from Screenshot 3) ──────────────────────────────
  {
    id: "chapati_meal",
    name: { en: "Chapati / Roti", te: "చపాతీ / రోటీ", hi: "चपाती / रोटी" },
    category: "meals",
    image: "/mother_app/foods/chapati_meal.png",
    isVeg: true,
    groups: ["grains"],
  },
  {
    id: "puri_meal",
    name: { en: "Puri", te: "పూరి", hi: "पूरी" },
    category: "meals",
    image: "/mother_app/foods/puri_meal.png",
    isVeg: true,
    groups: ["grains"],
  },
  {
    id: "parota_meal",
    name: { en: "Parota", te: "పరోటా", hi: "परोठा" },
    category: "meals",
    image: "/mother_app/foods/parota_meal.png",
    isVeg: true,
    groups: ["grains"],
  },
  {
    id: "millet_roti_meal",
    name: { en: "Millet Roti (Jonna/Sajja/Ragi)", te: "జొన్న / సజ్జ / రాగి రొట్టె", hi: "ज्वार / बाजरा / रागी रोटी" },
    category: "meals",
    image: "/mother_app/foods/millet_roti_meal.png",
    isVeg: true,
    groups: ["grains"],
  },
  {
    id: "sarva_pindi_meal",
    name: { en: "Sarva Pindi", te: "సర్వ పిండి", hi: "सर्व पिंडी" },
    category: "meals",
    image: "/mother_app/foods/sarva_pindi_meal.png",
    isVeg: true,
    groups: ["grains", "pulses", "nuts"],
  },
  {
    id: "java",
    name: { en: "Java", te: "జావ", hi: "जावा (रागी दलिया)" },
    category: "meals",
    image: "/mother_app/foods/java.png",
    isVeg: true,
    groups: ["grains"],
  },
  {
    id: "pongal",
    name: { en: "Pongal", te: "పొంగల్", hi: "पोंगल" },
    category: "meals",
    image: "/mother_app/foods/pongal.png",
    isVeg: true,
    groups: ["grains", "pulses"],
  },
  {
    id: "plain_rice",
    name: { en: "Plain Rice (Annam)", te: "తెల్ల అన్నం", hi: "सादा चावल" },
    category: "meals",
    image: "/mother_app/foods/plain_rice.png",
    isVeg: true,
    groups: ["grains"],
  },
  {
    id: "pappu_annam",
    name: { en: "Pappu Annam", te: "పప్పు అన్నం", hi: "दाल चावल" },
    category: "meals",
    image: "/mother_app/foods/pappu_annam.png",
    isVeg: true,
    groups: ["grains", "pulses"],
  },
  {
    id: "curd_rice",
    name: { en: "Curd Rice", te: "పెరుగన్నం", hi: "दही चावल" },
    category: "meals",
    image: "/mother_app/foods/curd_rice.png",
    isVeg: true,
    groups: ["grains", "dairy"],
  },
  {
    id: "ghee_rice",
    name: { en: "Ghee Rice", te: "నెయ్యి అన్నం", hi: "घी चावल" },
    category: "meals",
    image: "/mother_app/foods/ghee_rice.png",
    isVeg: true,
    groups: ["grains", "dairy"],
  },
  {
    id: "pulihora",
    name: { en: "Lemon Rice / Pulihora", te: "పులిహోర", hi: "पुलीहोरा / लेमन राइस" },
    category: "meals",
    image: "/mother_app/foods/pulihora.png",
    isVeg: true,
    groups: ["grains", "nuts"],
  },

  // ── FRUITS/NUTS (12 dishes from Screenshot 4) ────────────────────────
  {
    id: "banana",
    name: { en: "Banana", te: "అరటిపండు", hi: "केला" },
    category: "fruits_nuts",
    image: "/mother_app/foods/banana.png",
    isVeg: true,
    groups: ["otherFruit"],
  },
  {
    id: "apple",
    name: { en: "Apple", te: "యాపిల్", hi: "सेब" },
    category: "fruits_nuts",
    image: "/mother_app/foods/apple.png",
    isVeg: true,
    groups: ["otherFruit"],
  },
  {
    id: "guava",
    name: { en: "Guava (Jamakaya)", te: "జామకాయ", hi: "अमरूद" },
    category: "fruits_nuts",
    image: "/mother_app/foods/guava.png",
    isVeg: true,
    groups: ["otherFruit"],
  },
  {
    id: "orange",
    name: { en: "Orange / Mosambi", te: "నారింజ / బత్తాయి", hi: "संतरा / मौसमी" },
    category: "fruits_nuts",
    image: "/mother_app/foods/orange.png",
    isVeg: true,
    groups: ["vitaminA", "otherFruit"],
  },
  {
    id: "grapes",
    name: { en: "Grapes", te: "ద్రాక్ష", hi: "अंगूर" },
    category: "fruits_nuts",
    image: "/mother_app/foods/grapes.png",
    isVeg: true,
    groups: ["otherFruit"],
  },
  {
    id: "pomegranate",
    name: { en: "Pomegranate (Danimma)", te: "దానిమ్మ", hi: "अनार" },
    category: "fruits_nuts",
    image: "/mother_app/foods/pomegranate.png",
    isVeg: true,
    groups: ["otherFruit"],
  },
  {
    id: "pineapple",
    name: { en: "Pineapple", te: "అనాసపండు", hi: "अनानास" },
    category: "fruits_nuts",
    image: "/mother_app/foods/pineapple.png",
    isVeg: true,
    groups: ["otherFruit"],
  },
  {
    id: "sapota",
    name: { en: "Sapota", te: "సపోటా", hi: "चीकू / सपोटा" },
    category: "fruits_nuts",
    image: "/mother_app/foods/sapota.png",
    isVeg: true,
    groups: ["otherFruit"],
  },
  {
    id: "watermelon",
    name: { en: "Watermelon / Muskmelon", te: "పుచ్చకాయ / ఖర్బూజా", hi: "तरबूज / खरबूजा" },
    category: "fruits_nuts",
    image: "/mother_app/foods/watermelon.png",
    isVeg: true,
    groups: ["otherFruit"],
  },
  {
    id: "mango",
    name: { en: "Mango", te: "మామిడిపండు", hi: "आम" },
    category: "fruits_nuts",
    image: "/mother_app/foods/mango.png",
    isVeg: true,
    groups: ["vitaminA"],
  },
  {
    id: "papaya",
    name: { en: "Papaya", te: "బొప్పాయి", hi: "पपीता" },
    category: "fruits_nuts",
    image: "/mother_app/foods/papaya.png",
    isVeg: true,
    groups: ["vitaminA"],
  },
  {
    id: "custard_apple",
    name: { en: "Custard Apple (Sitaphal)", te: "సీతాఫలం", hi: "सीताफल / शरीफा" },
    category: "fruits_nuts",
    image: "/mother_app/foods/custard_apple.png",
    isVeg: true,
    groups: ["otherFruit"],
  },

  // ── SNACKS (12 dishes from Screenshot 5) ─────────────────────────────
  {
    id: "milk_glass",
    name: { en: "Milk (glass)", te: "గ్లాసు పాలు", hi: "दूध (गिलास)" },
    category: "snacks",
    image: "/mother_app/foods/milk_glass.png",
    isVeg: true,
    groups: ["dairy"],
  },
  {
    id: "lassi",
    name: { en: "Lassi", te: "లస్సీ", hi: "लस्सी" },
    category: "snacks",
    image: "/mother_app/foods/lassi.png",
    isVeg: true,
    groups: ["dairy"],
  },
  {
    id: "badam_milk",
    name: { en: "Badam Milk", te: "బాదం పాలు", hi: "बादाम दूध" },
    category: "snacks",
    image: "/mother_app/foods/badam_milk.png",
    isVeg: true,
    groups: ["dairy", "nuts"],
  },
  {
    id: "boost_horlicks",
    name: { en: "Boost/Horlicks (with milk)", te: "బూస్ట్ / హార్లిక్స్ (పాలతో)", hi: "बूस्ट / हॉर्लिक्स (दूध के साथ)" },
    category: "snacks",
    image: "/mother_app/foods/boost_horlicks.png",
    isVeg: true,
    groups: ["dairy"],
  },
  {
    id: "sprouts",
    name: { en: "Sprouts (Molakallu)", te: "మొలకలు", hi: "अंकुरित मूंग / चने" },
    category: "snacks",
    image: "/mother_app/foods/sprouts.png",
    isVeg: true,
    groups: ["pulses"],
  },
  {
    id: "sunnundalu",
    name: { en: "Sunnundalu", te: "సున్నుండలు", hi: "सुन्नुंडालु (उड़द लड्डू)" },
    category: "snacks",
    image: "/mother_app/foods/sunnundalu.png",
    isVeg: true,
    groups: ["pulses"],
  },
  {
    id: "boondi_laddu",
    name: { en: "Boondi Laddu", te: "బూందీ లడ్డూ", hi: "बूंदी लड्डू" },
    category: "snacks",
    image: "/mother_app/foods/boondi_laddu.png",
    isVeg: true,
    groups: ["pulses"],
  },
  {
    id: "boorelu",
    name: { en: "Boorelu / Burelu / Poornalu", te: "బూరెలు / పూర్ణాలు", hi: "बूरेलु / पूर्नालु" },
    category: "snacks",
    image: "/mother_app/foods/boorelu.png",
    isVeg: true,
    groups: ["pulses", "grains"],
  },
  {
    id: "bobbatlu",
    name: { en: "Bobbatlu / Puran Poli", te: "బొబ్బట్లు", hi: "बोब्बलु / पूरन पोली" },
    category: "snacks",
    image: "/mother_app/foods/bobbatlu.png",
    isVeg: true,
    groups: ["pulses", "grains"],
  },
  {
    id: "ariselu",
    name: { en: "Ariselu", te: "అరిసెలు", hi: "अरिसेलु" },
    category: "snacks",
    image: "/mother_app/foods/ariselu.png",
    isVeg: true,
    groups: ["grains"],
  },
  {
    id: "pootharekulu",
    name: { en: "Pootharekulu", te: "పూతరేకులు", hi: "पूथरेकुलु" },
    category: "snacks",
    image: "/mother_app/foods/pootharekulu.png",
    isVeg: true,
    groups: ["grains"],
  },
  {
    id: "madatha_kaja",
    name: { en: "Madatha Kaja", te: "మడత కాజా", hi: "मड़था काजा" },
    category: "snacks",
    image: "/mother_app/foods/madatha_kaja.png",
    isVeg: true,
    groups: ["grains"],
  },
];
