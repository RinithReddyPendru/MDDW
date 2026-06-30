import type { Lang } from "./translations";

export type FoodGroupId =
  | "grains"
  | "pulses"
  | "nuts"
  | "dairy"
  | "meat"
  | "eggs"
  | "dglv"
  | "vitaminA"
  | "otherVeg"
  | "otherFruit";

export interface FoodGroup {
  id: FoodGroupId;
  name: string;
  emoji: string;
  examples: string[];
  benefits: string[];
  colorVar: string;
}

interface LocalizedFoodGroup {
  id: FoodGroupId;
  emoji: string;
  colorVar: string;
  name: Record<Lang, string>;
  examples: Record<Lang, string[]>;
  benefits: Record<Lang, string[]>;
}

const FOOD_GROUPS_RAW: LocalizedFoodGroup[] = [
  {
    id: "grains",
    emoji: "🌾",
    colorVar: "group-grains",
    name: {
      en: "Grains & Starches",
      hi: "अनाज और स्टार्च",
      te: "ధాన్యాలు మరియు పిండి పదార్థాలు",
    },
    examples: {
      en: ["Rice", "Roti / Chapati", "Poha", "Idli", "Dosa", "Upma", "Potato", "Bread"],
      hi: ["चावल", "रोटी / चपाती", "पोहा", "इडली", "डोसा", "उपमा", "आलू", "ब्रेड"],
      te: ["బియ్యం", "రోటీ / చపాతీ", "అటుకులు", "ఇడ్లీ", "దోశ", "ఉప్మా", "బంగాళదుంప", "బ్రెడ్"],
    },
    benefits: {
      en: [
        "Main source of energy (carbohydrates)",
        "Fuel for daily activities",
      ],
      hi: [
        "ऊर्जा का मुख्य स्रोत",
        "दैनिक गतिविधियों के लिए ईंधन",
      ],
      te: [
        "శక్తికి ప్రధాన మూలం",
        "రోజువారీ పనులకు ఇంధనం",
      ],
    },
  },
  {
    id: "pulses",
    emoji: "🫘",
    colorVar: "group-pulses",
    name: {
      en: "Pulses & Beans",
      hi: "दालें और फलियाँ",
      te: "పప్పులు మరియు చిక్కుళ్లు",
    },
    examples: {
      en: ["Toor Dal", "Moong Dal", "Chana", "Rajma", "Soybean", "Lentils"],
      hi: ["तूर दाल", "मूंग दाल", "चना", "राजमा", "सोयाबीन", "मसूर"],
      te: ["కంది పప్పు", "పెసర పప్పు", "శనగలు", "రాజ్మా", "సోయాబీన్", "మసూర్"],
    },
    benefits: {
      en: ["Plant-based protein", "Muscle repair", "Rich in iron and fiber"],
      hi: ["प्रोटीन का स्रोत", "मांसपेशियों की मरम्मत", "आयरन और फाइबर से भरपूर"],
      te: ["ప్రోటీన్ మూలం", "కండరాల మరమ్మత్తు", "ఐరన్ మరియు ఫైబర్ ఎక్కువ"],
    },
  },
  {
    id: "nuts",
    emoji: "🥜",
    colorVar: "group-nuts",
    name: {
      en: "Nuts & Seeds",
      hi: "मेवे और बीज",
      te: "గింజలు మరియు విత్తనాలు",
    },
    examples: {
      en: ["Groundnuts (Peanuts)", "Almonds", "Walnuts", "Sesame Seeds", "Flax Seeds"],
      hi: ["मूंगफली", "बादाम", "अखरोट", "तिल", "अलसी"],
      te: ["వేరుశెనగలు", "బాదం", "అక్రోట్", "నువ్వులు", "అవిసె గింజలు"],
    },
    benefits: {
      en: ["Healthy fats", "Brain function", "Energy dense"],
      hi: ["स्वस्थ वसा", "मस्तिष्क के लिए", "ऊर्जा"],
      te: ["ఆరోగ్యకరమైన కొవ్వులు", "మెదడు పనితీరు", "శక్తి"],
    },
  },
  {
    id: "dairy",
    emoji: "🥛",
    colorVar: "group-dairy",
    name: {
      en: "Dairy",
      hi: "डेयरी",
      te: "పాలు మరియు పాల పదార్థాలు",
    },
    examples: {
      en: ["Milk", "Curd / Dahi", "Paneer", "Buttermilk"],
      hi: ["दूध", "दही", "पनीर", "छाछ"],
      te: ["పాలు", "పెరుగు", "పనీర్", "మజ్జిగ"],
    },
    benefits: {
      en: ["Calcium for bones", "Protein", "Vitamin D"],
      hi: ["हड्डियों के लिए कैल्शियम", "प्रोटीन", "विटामिन D"],
      te: ["ఎముకలకు కాల్షియం", "ప్రోటీన్", "విటమిన్ డి"],
    },
  },
  {
    id: "meat",
    emoji: "🍗",
    colorVar: "group-meat",
    name: {
      en: "Meat, Fish & Poultry",
      hi: "मांस और मछली",
      te: "మాంసం మరియు చేపలు",
    },
    examples: {
      en: ["Chicken", "Fish", "Mutton", "Prawns"],
      hi: ["चिकन", "मछली", "मटन", "झींगा"],
      te: ["కోడి మాంసం", "చేపలు", "మేక మాంసం", "రొయ్యలు"],
    },
    benefits: {
      en: ["High quality protein", "Easily absorbed iron", "Vitamin B12"],
      hi: ["उच्च गुणवत्ता वाला प्रोटीन", "आयरन", "विटामिन B12"],
      te: ["నాణ్యమైన ప్రోటీన్", "సులభంగా శోషించబడే ఐరన్", "విటమిన్ బి12"],
    },
  },
  {
    id: "eggs",
    emoji: "🍳",
    colorVar: "group-eggs",
    name: {
      en: "Eggs",
      hi: "अंडे",
      te: "గుడ్లు",
    },
    examples: {
      en: ["Boiled Egg", "Omelette", "Egg Curry"],
      hi: ["उबला अंडा", "ऑमलेट", "अंडा करी"],
      te: ["ఉడికించిన గుడ్డు", "ఆమ్లెట్", "గుడ్డు కూర"],
    },
    benefits: {
      en: ["Complete protein", "Choline for brain", "Easy to cook"],
      hi: ["संपूर्ण प्रोटीन", "मस्तिष्क के लिए", "पकाने में आसान"],
      te: ["సంపూర్ణ ప్రోటీన్", "మెదడుకు మంచిది", "వండడం సులభం"],
    },
  },
  {
    id: "dglv",
    emoji: "🌿",
    colorVar: "group-dglv",
    name: {
      en: "Dark Green Leafy Veg",
      hi: "हरी पत्तेदार सब्जियाँ",
      te: "ఆకుకూరలు",
    },
    examples: {
      en: ["Spinach (Palak)", "Amaranth", "Methi", "Drumstick leaves", "Mustard leaves"],
      hi: ["पालक", "चौलाई", "मेथी", "सहजन पत्ते", "सरसों"],
      te: ["పాలకూర", "తోటకూర", "మెంతి కూర", "మునగ ఆకు", "ఆవ ఆకు"],
    },
    benefits: {
      en: ["Rich in iron and folic acid", "Prevents anemia", "Vitamins A & C"],
      hi: ["आयरन और फोलिक एसिड", "एनीमिया से बचाव", "विटामिन A & C"],
      te: ["ఐరన్ & ఫోలిక్ యాసిడ్", "రక్తహీనతను నివారిస్తుంది", "విటమిన్ ఎ & సి"],
    },
  },
  {
    id: "vitaminA",
    emoji: "🥕",
    colorVar: "group-vitamin-a",
    name: {
      en: "Vitamin A Rich",
      hi: "विटामिन A से भरपूर",
      te: "విటమిన్-ఎ సమృద్ధిగా ఉండే పండ్లు మరియు కూరగాయలు",
    },
    examples: {
      en: ["Carrot", "Pumpkin", "Mango", "Papaya", "Sweet Potato"],
      hi: ["गाजर", "कद्दू", "आम", "पपीता", "शकरकंदी"],
      te: ["క్యారెట్", "గుమ్మడి", "మామిడి", "బొప్పాయ", "చిలకడ దుంప"],
    },
    benefits: {
      en: ["Good eyesight", "Immunity building", "Healthy skin"],
      hi: ["अच्छी आंखें", "रोग प्रतिरोधक क्षमता", "स्वस्त त्वचा"],
      te: ["కంటి చూపుకు మంచిది", "రోగ నిరోధక శక్తి", "ఆరోగ్యకరమైన చర్మం"],
    },
  },
  {
    id: "otherVeg",
    emoji: "🍆",
    colorVar: "group-other-veg",
    name: {
      en: "Other Vegetables",
      hi: "अन्य सब्जियाँ",
      te: "ఇతర కూరగాయలు",
    },
    examples: {
      en: ["Tomato", "Onion", "Brinjal", "Cauliflower", "Bhindi"],
      hi: ["टमाटर", "प्याज", "बैंगन", "फूलगोभी", "भिंडी"],
      te: ["టమాటా", "ఉల్లిపాయ", "వంకాయ", "కాలీఫ్లవర్", "బెండకాయ"],
    },
    benefits: {
      en: ["Fiber for digestion", "Micronutrients", "Hydration"],
      hi: ["पाचन के लिए फाइबर", "सूक्ष्म पोषक तत्व", "हाइड्रेशन"],
      te: ["జీర్ణక్రియకు ఫైబర్", "సూక్ష్మ పోషకాలు", "నీటి శాతం"],
    },
  },
  {
    id: "otherFruit",
    emoji: "🍎",
    colorVar: "group-other-fruit",
    name: {
      en: "Other Fruits",
      hi: "अन्य फल",
      te: "ఇతర పండ్లు",
    },
    examples: {
      en: ["Banana", "Apple", "Guava", "Orange", "Grapes"],
      hi: ["केला", "सेब", "अमरूद", "संतरा", "अंगूर"],
      te: ["అరటి", "ఆపిల్", "జామ", "నారింజ", "ద్రాక్ష"],
    },
    benefits: {
      en: ["Vitamin C", "Natural sugars", "Antioxidants"],
      hi: ["विटामिन C", "प्राकृतिक शर्करा", "एंटीऑक्सीडेंट"],
      te: ["విటమిన్ సి", "సహజ చక్కెరలు", "యాంటీఆక్సిడెంట్స్"],
    },
  },
];

export function getFoodGroups(lang: Lang): FoodGroup[] {
  return FOOD_GROUPS_RAW.map((g) => ({
    id: g.id,
    name: g.name[lang] || g.name.en,
    emoji: g.emoji,
    examples: g.examples[lang] || g.examples.en,
    benefits: g.benefits[lang] || g.benefits.en,
    colorVar: g.colorVar,
  }));
}

export interface QuizFood {
  name: string;
  nameTe: string;
  nameHi: string;
  emoji: string;
  group: FoodGroupId;
}

export function getQuizFoodName(food: QuizFood, lang: Lang): string {
  if (lang === "te") return food.nameTe || food.name;
  if (lang === "hi") return food.nameHi || food.name;
  return food.name;
}

export const QUIZ_FOODS: QuizFood[] = [
  { name: "Rice", nameTe: "బియ్యం", nameHi: "चावल", emoji: "🍚", group: "grains" },
  { name: "Chapati / Roti", nameTe: "చపాతీ / రోటీ", nameHi: "चपाती / रोटी", emoji: "🫓", group: "grains" },
  { name: "Bread", nameTe: "బ్రెడ్", nameHi: "ब्रेड", emoji: "🍞", group: "grains" },
  { name: "Potato", nameTe: "బంగాళదుంప", nameHi: "आलू", emoji: "🥔", group: "grains" },
  { name: "Toor Dal", nameTe: "కంది పప్పు", nameHi: "तूर दाल", emoji: "🫘", group: "pulses" },
  { name: "Rajma", nameTe: "రాజ్మా", nameHi: "राजमा", emoji: "🫚", group: "pulses" },
  { name: "Chana", nameTe: "శనగపప్పు", nameHi: "छोले", emoji: "🫙", group: "pulses" },
  { name: "Moong Dal", nameTe: "పెసర పప్పు", nameHi: "मूंग दाल", emoji: "🫔", group: "pulses" },
  { name: "Groundnut", nameTe: "వేరుశెనగ", nameHi: "मूंगफली", emoji: "🥜", group: "nuts" },
  { name: "Almond", nameTe: "బాదం", nameHi: "बादाम", emoji: "🌰", group: "nuts" },
  { name: "Walnut", nameTe: "అక్రోట్", nameHi: "अखरोट", emoji: "🌰", group: "nuts" },
  { name: "Milk", nameTe: "పాలు", nameHi: "दूध", emoji: "🥛", group: "dairy" },
  { name: "Curd", nameTe: "పెరుగు", nameHi: "दही", emoji: "🍶", group: "dairy" },
  { name: "Paneer", nameTe: "పనీర్", nameHi: "पनीर", emoji: "🧀", group: "dairy" },
  { name: "Butter", nameTe: "వెన్న", nameHi: "मख्खन", emoji: "🧈", group: "dairy" },
  { name: "Chicken", nameTe: "కోడి", nameHi: "मुर्गी", emoji: "🍗", group: "meat" },
  { name: "Fish", nameTe: "చేప", nameHi: "मछली", emoji: "🐟", group: "meat" },
  { name: "Mutton", nameTe: "మటన్", nameHi: "मटन", emoji: "🥩", group: "meat" },
  { name: "Prawns", nameTe: "రొయ్యలు", nameHi: "झींगा", emoji: "🦐", group: "meat" },
  { name: "Boiled Egg", nameTe: "ఉడికించిన గుడ్డు", nameHi: "उबला अंडा", emoji: "🥚", group: "eggs" },
  { name: "Omelette", nameTe: "ఆమ్లెట్", nameHi: "ऑमलेट", emoji: "🍳", group: "eggs" },
  { name: "Palak", nameTe: "పాలకూర", nameHi: "पालक", emoji: "🥬", group: "dglv" },
  { name: "Methi", nameTe: "మెంతి ఆకు", nameHi: "मेथी", emoji: "🌿", group: "dglv" },
  { name: "Drumstick Leaves", nameTe: "మునగ ఆకు", nameHi: "सहजन", emoji: "🍃", group: "dglv" },
  { name: "Carrot", nameTe: "క్యారెట్", nameHi: "गाजर", emoji: "🥕", group: "vitaminA" },
  { name: "Pumpkin", nameTe: "గుమ్మడి", nameHi: "कद्दू", emoji: "🎃", group: "vitaminA" },
  { name: "Mango", nameTe: "మామిడి", nameHi: "आम", emoji: "🥭", group: "vitaminA" },
  { name: "Papaya", nameTe: "బొప్పాయ", nameHi: "पपीता", emoji: "🍐", group: "vitaminA" },
  { name: "Sweet Potato", nameTe: "చిలకదదుంప", nameHi: "शकरकंदी", emoji: "🍠", group: "vitaminA" },
  { name: "Tomato", nameTe: "టమాటా", nameHi: "टमाटर", emoji: "🍅", group: "otherVeg" },
  { name: "Brinjal", nameTe: "వంకాయ", nameHi: "बैंगन", emoji: "🍆", group: "otherVeg" },
  { name: "Cauliflower", nameTe: "కాలీఫ్లవర్", nameHi: "फूलगोभी", emoji: "🥦", group: "otherVeg" },
  { name: "Onion", nameTe: "ఉల్లిపాయ", nameHi: "प्याज", emoji: "🧅", group: "otherVeg" },
  { name: "Cucumber", nameTe: "దోసకాయ", nameHi: "खीरा", emoji: "🥒", group: "otherVeg" },
  { name: "Banana", nameTe: "అరటి", nameHi: "केला", emoji: "🍌", group: "otherFruit" },
  { name: "Guava", nameTe: "జామ", nameHi: "अमरूद", emoji: "🍐", group: "otherFruit" },
  { name: "Apple", nameTe: "ఆపిల్", nameHi: "सेब", emoji: "🍎", group: "otherFruit" },
  { name: "Orange", nameTe: "నారింజ", nameHi: "संतरा", emoji: "🍊", group: "otherFruit" },
  { name: "Grapes", nameTe: "ద్రాక్ష", nameHi: "अंगूर", emoji: "🍇", group: "otherFruit" },
  { name: "Pomegranate", nameTe: "దానిమ్మ", nameHi: "अनार", emoji: "🍅", group: "otherFruit" },
];
