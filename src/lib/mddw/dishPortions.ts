import type { Lang } from "./translations";
import type { MotherDish } from "./motherAppData";
import type { FoodGroupId } from "./foodGroups";

export type PortionSize = "small" | "medium" | "large";

export interface DishPortionData {
  dishId: string;
  portion: PortionSize;
  portionLabel: string;
  portionAmount: string;
  accompaniments: string[];
}

export interface AccompanimentOption {
  id: string;
  name: Record<Lang, string>;
  image: string;
  groups: FoodGroupId[];
}

// Dishes that are counted as discrete units (e.g. 2 idlis, 1 dosa)
const COUNTABLE_DISH_IDS = new Set([
  "idli",
  "rava_idli",
  "dosa_plain",
  "masala_dosa",
  "pesarattu",
  "chapati",
  "chapati_meal",
  "puri",
  "puri_meal",
  "parota",
  "parota_meal",
  "millet_roti",
  "millet_roti_meal",
  "sarva_pindi",
  "sarva_pindi_meal",
  "banana",
  "apple",
  "guava",
  "orange",
  "boiled_egg",
  "egg",
  "ariselu",
  "boorelu",
  "bobbatlu",
  "sunnundalu",
  "boondi_laddu",
  "madatha_kaja",
]);

export function isDishCountable(dishId: string): boolean {
  return COUNTABLE_DISH_IDS.has(dishId.toLowerCase());
}

export function getDishPortionInfo(dish: MotherDish, lang: Lang) {
  const countable = isDishCountable(dish.id);

  if (countable) {
    let unitSmall = "2";
    let unitMedium = "3";
    let unitLarge = "4";
    let unitName = { en: "items", te: "ముక్కలు", hi: "पीस" };

    if (dish.id.includes("idli")) {
      unitName = { en: "idlis", te: "ఇడ్లీలు", hi: "इडली" };
      unitSmall = "2 idlis";
      unitMedium = "3 idlis";
      unitLarge = "4 idlis";
      if (lang === "te") {
        unitSmall = "2 ఇడ్లీలు";
        unitMedium = "3 ఇడ్లీలు";
        unitLarge = "4 ఇడ్లీలు";
      } else if (lang === "hi") {
        unitSmall = "2 इडली";
        unitMedium = "3 इडली";
        unitLarge = "4 इडली";
      }
    } else if (dish.id.includes("dosa") || dish.id.includes("pesarattu")) {
      unitName = { en: "dosas", te: "దోశలు", hi: "डोसा" };
      unitSmall = "1 dosa";
      unitMedium = "2 dosas";
      unitLarge = "3 dosas";
      if (lang === "te") {
        unitSmall = "1 దోశ";
        unitMedium = "2 దోశలు";
        unitLarge = "3 దోశలు";
      } else if (lang === "hi") {
        unitSmall = "1 डोसा";
        unitMedium = "2 डोसा";
        unitLarge = "3 डोसा";
      }
    } else if (dish.id.includes("puri")) {
      unitName = { en: "puris", te: "పూరీలు", hi: "पूरी" };
      unitSmall = "2 puris";
      unitMedium = "3 puris";
      unitLarge = "4 puris";
      if (lang === "te") {
        unitSmall = "2 పూరీలు";
        unitMedium = "3 పూరీలు";
        unitLarge = "4 పూరీలు";
      } else if (lang === "hi") {
        unitSmall = "2 पूरी";
        unitMedium = "3 पूरी";
        unitLarge = "4 पूरी";
      }
    } else if (dish.id.includes("chapati") || dish.id.includes("roti") || dish.id.includes("parota")) {
      unitName = { en: "rotis", te: "రొట్టెలు", hi: "रोटी" };
      unitSmall = "1 roti";
      unitMedium = "2 rotis";
      unitLarge = "3 rotis";
      if (lang === "te") {
        unitSmall = "1 రొట్టె";
        unitMedium = "2 రొట్టెలు";
        unitLarge = "3 రొట్టెలు";
      } else if (lang === "hi") {
        unitSmall = "1 रोटी";
        unitMedium = "2 रोटी";
        unitLarge = "3 रोटी";
      }
    } else if (dish.id.includes("egg")) {
      unitName = { en: "eggs", te: "గుడ్లు", hi: "अंडे" };
      unitSmall = "1 egg";
      unitMedium = "2 eggs";
      unitLarge = "3 eggs";
      if (lang === "te") {
        unitSmall = "1 గుడ్డు";
        unitMedium = "2 గుడ్లు";
        unitLarge = "3 గుడ్లు";
      } else if (lang === "hi") {
        unitSmall = "1 अंडा";
        unitMedium = "2 अंडे";
        unitLarge = "3 अंडे";
      }
    } else if (dish.id === "banana") {
      unitName = { en: "bananas", te: "అరటిపండ్లు", hi: "केले" };
      unitSmall = "1 banana";
      unitMedium = "2 bananas";
      unitLarge = "3 bananas";
      if (lang === "te") {
        unitSmall = "1 అరటిపండు";
        unitMedium = "2 అరటిపండ్లు";
        unitLarge = "3 అరటిపండ్లు";
      } else if (lang === "hi") {
        unitSmall = "1 केला";
        unitMedium = "2 केले";
        unitLarge = "3 केले";
      }
    } else if (dish.id === "apple") {
      unitName = { en: "apples", te: "యాపిల్స్", hi: "सेब" };
      unitSmall = lang === "te" ? "1 యాపిల్" : lang === "hi" ? "1 सेब" : "1 apple";
      unitMedium = lang === "te" ? "2 యాపిల్స్" : lang === "hi" ? "2 सेब" : "2 apples";
      unitLarge = lang === "te" ? "3 యాపిల్స్" : lang === "hi" ? "3 सेब" : "3 apples";
    } else if (dish.id === "guava") {
      unitName = { en: "guavas", te: "జామకాయలు", hi: "अमरूद" };
      unitSmall = lang === "te" ? "1 జామకాయ" : lang === "hi" ? "1 अमरूद" : "1 guava";
      unitMedium = lang === "te" ? "2 జామకాయలు" : lang === "hi" ? "2 अमरूद" : "2 guavas";
      unitLarge = lang === "te" ? "3 జామకాయలు" : lang === "hi" ? "3 अमरूद" : "3 guavas";
    } else if (dish.id === "orange") {
      unitName = { en: "oranges", te: "నారింజలు", hi: "संतरे" };
      unitSmall = lang === "te" ? "1 నారింజ" : lang === "hi" ? "1 संतरा" : "1 orange";
      unitMedium = lang === "te" ? "2 నారింజలు" : lang === "hi" ? "2 संतरे" : "2 oranges";
      unitLarge = lang === "te" ? "3 నారింజలు" : lang === "hi" ? "3 संतरे" : "3 oranges";
    } else if (dish.id.includes("laddu") || dish.id.includes("sunnundalu")) {
      unitName = { en: "laddus", te: "లడ్డూలు", hi: "लड्डू" };
      unitSmall = lang === "te" ? "1 లడ్డూ" : lang === "hi" ? "1 लड्डू" : "1 laddu";
      unitMedium = lang === "te" ? "2 లడ్డూలు" : lang === "hi" ? "2 लड्डू" : "2 laddus";
      unitLarge = lang === "te" ? "3 లడ్డూలు" : lang === "hi" ? "3 लड्डू" : "3 laddus";
    } else if (dish.id.includes("sarva_pindi")) {
      unitName = { en: "pieces", te: "ముక్కలు", hi: "पीस" };
      unitSmall = lang === "te" ? "1 సర్వ పిండి" : lang === "hi" ? "1 सर्व पिंडी" : "1 piece";
      unitMedium = lang === "te" ? "2 సర్వ పిండి" : lang === "hi" ? "2 सर्व पिंडी" : "2 pieces";
      unitLarge = lang === "te" ? "3 సర్వ పిండి" : lang === "hi" ? "3 सर्व पिंडी" : "3 pieces";
    } else {
      unitSmall = `1 ${unitName[lang]}`;
      unitMedium = `2 ${unitName[lang]}`;
      unitLarge = `3 ${unitName[lang]}`;
    }

    // High quality portion image assets for each countable dish
    let smallImg = "/mother_app/portions/sweet_small.png";
    let mediumImg = "/mother_app/portions/sweet_med.png";
    let largeImg = "/mother_app/portions/sweet_large.png";
    let headerImg = dish.image;

    const id = dish.id.toLowerCase();
    if (id.includes("idli")) {
      smallImg = "/mother_app/portions/idli_small.png";
      mediumImg = "/mother_app/portions/idli_med.png";
      largeImg = "/mother_app/portions/idli_large.png";
      headerImg = "/mother_app/portion_idli_header.png";
    } else if (id.includes("dosa") || id.includes("pesarattu")) {
      smallImg = "/mother_app/portions/dosa_small.png";
      mediumImg = "/mother_app/portions/dosa_med.png";
      largeImg = "/mother_app/portions/dosa_large.png";
    } else if (id.includes("chapati")) {
      smallImg = "/mother_app/portions/chapati_small.png";
      mediumImg = "/mother_app/portions/chapati_med.png";
      largeImg = "/mother_app/portions/chapati_large.png";
    } else if (id.includes("puri")) {
      smallImg = "/mother_app/portions/puri_small.png";
      mediumImg = "/mother_app/portions/puri_med.png";
      largeImg = "/mother_app/portions/puri_large.png";
    } else if (id.includes("parota")) {
      smallImg = "/mother_app/portions/parota_small.png";
      mediumImg = "/mother_app/portions/parota_med.png";
      largeImg = "/mother_app/portions/parota_large.png";
    } else if (id.includes("millet_roti") || id.includes("roti")) {
      smallImg = "/mother_app/portions/millet_roti_small.png";
      mediumImg = "/mother_app/portions/millet_roti_med.png";
      largeImg = "/mother_app/portions/millet_roti_large.png";
    } else if (id.includes("sarva_pindi")) {
      smallImg = "/mother_app/portions/sarva_pindi_small.png";
      mediumImg = "/mother_app/portions/sarva_pindi_med.png";
      largeImg = "/mother_app/portions/sarva_pindi_large.png";
    } else if (id.includes("egg")) {
      smallImg = "/mother_app/portions/egg_small.png";
      mediumImg = "/mother_app/portions/egg_med.png";
      largeImg = "/mother_app/portions/egg_large.png";
    } else if (id === "banana") {
      smallImg = "/mother_app/portions/banana_small.png";
      mediumImg = "/mother_app/portions/banana_med.png";
      largeImg = "/mother_app/portions/banana_large.png";
    } else if (id === "apple") {
      smallImg = "/mother_app/portions/apple_small.png";
      mediumImg = "/mother_app/portions/apple_med.png";
      largeImg = "/mother_app/portions/apple_large.png";
    } else if (id === "guava") {
      smallImg = "/mother_app/portions/guava_small.png";
      mediumImg = "/mother_app/portions/guava_med.png";
      largeImg = "/mother_app/portions/guava_large.png";
    } else if (id === "orange") {
      smallImg = "/mother_app/portions/orange_small.png";
      mediumImg = "/mother_app/portions/orange_med.png";
      largeImg = "/mother_app/portions/orange_large.png";
    } else if (id.includes("laddu") || id.includes("sunnundalu")) {
      smallImg = "/mother_app/portions/laddu_small.png";
      mediumImg = "/mother_app/portions/laddu_med.png";
      largeImg = "/mother_app/portions/laddu_large.png";
    } else if (id.includes("bobbatlu")) {
      smallImg = "/mother_app/portions/bobbatlu_small.png";
      mediumImg = "/mother_app/portions/bobbatlu_med.png";
      largeImg = "/mother_app/portions/bobbatlu_large.png";
    } else {
      smallImg = "/mother_app/portions/sweet_small.png";
      mediumImg = "/mother_app/portions/sweet_med.png";
      largeImg = "/mother_app/portions/sweet_large.png";
    }

    return {
      isCountable: true,
      headerImg,
      portions: [
        {
          id: "small" as PortionSize,
          title: { en: "Small", te: "చిన్నది", hi: "छोटा" },
          amount: unitSmall,
          image: smallImg,
        },
        {
          id: "medium" as PortionSize,
          title: { en: "Medium", te: "మధ్యస్థం", hi: "मध्यम" },
          amount: unitMedium,
          image: mediumImg,
        },
        {
          id: "large" as PortionSize,
          title: { en: "Large", te: "పెద్దది", hi: "बड़ा" },
          amount: unitLarge,
          image: largeImg,
        },
      ],
    };
  }

  // Non-countable dishes (Upma, Rice, Curries, Dal, Poha, etc.)
  let smallImg = "/mother_app/portion_bowl_small.png";
  let mediumImg = "/mother_app/portion_bowl_medium.png";
  let largeImg = "/mother_app/portion_bowl_large.png";
  let headerImg = "/mother_app/portion_upma_header.png";

  if (!dish.id.includes("upma")) {
    headerImg = dish.image;
    // For other non-countables, we can use the bowl images or dish image
    smallImg = "/mother_app/portion_bowl_small.png";
    mediumImg = "/mother_app/portion_bowl_medium.png";
    largeImg = "/mother_app/portion_bowl_large.png";
  }

  return {
    isCountable: false,
    headerImg,
    portions: [
      {
        id: "small" as PortionSize,
        title: { en: "Small", te: "చిన్నది", hi: "छोटा" },
        amount: lang === "te" ? "½ గిన్నె" : lang === "hi" ? "½ कटोरी" : "½ bowl",
        image: smallImg,
      },
      {
        id: "medium" as PortionSize,
        title: { en: "Medium", te: "మధ్యస్థం", hi: "मध्यम" },
        amount: lang === "te" ? "1 గిన్నె" : lang === "hi" ? "1 कटोरी" : "1 bowl",
        image: mediumImg,
      },
      {
        id: "large" as PortionSize,
        title: { en: "Large", te: "పెద్దది", hi: "बड़ा" },
        amount: lang === "te" ? "1½ గిన్నెలు" : lang === "hi" ? "1½ कटोरी" : "1½ bowls",
        image: largeImg,
      },
    ],
  };
}

export const ALL_ACCOMPANIMENTS: AccompanimentOption[] = [
  {
    id: "sambar",
    name: { en: "Sambar", te: "సాంబారు", hi: "सांभर" },
    image: "/mother_app/side_sambar.png",
    groups: ["pulses", "otherVeg"],
  },
  {
    id: "chutney",
    name: { en: "Coconut Chutney", te: "కొబ్బరి చట్నీ", hi: "नारियल चटनी" },
    image: "/mother_app/side_chutney.png",
    groups: ["nuts"],
  },
  {
    id: "other",
    name: { en: "Allam / Other Chutney", te: "అల్లం పచ్చడి / ఇతర", hi: "अदरक / अन्य चटनी" },
    image: "/mother_app/side_other.png",
    groups: ["otherVeg"],
  },
  {
    id: "kurma",
    name: { en: "Veg Kurma / Aloo", te: "కూరగాయల కుర్మా", hi: "वेज कुर्मा / आलू" },
    image: "/mother_app/side_kurma.png",
    groups: ["otherVeg"],
  },
  {
    id: "dal",
    name: { en: "Pappu / Dal", te: "పప్పు / దాల్", hi: "दाल / तड़का" },
    image: "/mother_app/side_dal.png",
    groups: ["pulses", "dglv"],
  },
  {
    id: "curd",
    name: { en: "Curd / Raita", te: "పెరుగు / రైతా", hi: "दही / रायता" },
    image: "/mother_app/side_curd.png",
    groups: ["dairy"],
  },
  {
    id: "milk",
    name: { en: "Milk / Badam Milk", te: "పాలు / బాదం పాలు", hi: "दूध / बादाम दूध" },
    image: "/mother_app/side_milk.png",
    groups: ["dairy", "nuts"],
  },
  {
    id: "nuts",
    name: { en: "Dry Fruits / Seeds", te: "డ్రై ఫ్రూట్స్", hi: "मेवे / बीज" },
    image: "/mother_app/side_chutney.png",
    groups: ["nuts"],
  },
  {
    id: "pickle",
    name: { en: "Pickle / Avakaya", te: "ఆవకాయ / ఊరగాయ", hi: "अचार" },
    image: "/mother_app/side_other.png",
    groups: ["otherVeg"],
  },
  {
    id: "papad",
    name: { en: "Appadam / Papad", te: "అప్పడం", hi: "पापड़" },
    image: "/mother_app/portion_idli_small.png",
    groups: ["pulses"],
  },
  {
    id: "tea",
    name: { en: "Tea / Hot Milk", te: "టీ / వేడి పాలు", hi: "चाय / दूध" },
    image: "/mother_app/side_milk.png",
    groups: ["dairy"],
  },
];

export const COMMON_ACCOMPANIMENTS = ALL_ACCOMPANIMENTS;

export function getDishAccompaniments(dish: MotherDish): AccompanimentOption[] {
  const id = dish.id.toLowerCase();
  const cat = dish.category;

  // 1. Tiffins (Idli, Rava Idli, Dosa, Masala Dosa, Pesarattu, Upma, Pongal)
  if (
    id.includes("idli") ||
    id.includes("dosa") ||
    id.includes("pesarattu") ||
    id.includes("upma") ||
    id.includes("pongal")
  ) {
    return [
      ALL_ACCOMPANIMENTS.find((a) => a.id === "sambar")!,
      ALL_ACCOMPANIMENTS.find((a) => a.id === "chutney")!,
      ALL_ACCOMPANIMENTS.find((a) => a.id === "other")!,
    ];
  }

  // 2. Rotis, Puris & Breads (Chapati, Puri, Parota, Millet Roti)
  if (
    id.includes("chapati") ||
    id.includes("puri") ||
    id.includes("parota") ||
    id.includes("roti")
  ) {
    return [
      ALL_ACCOMPANIMENTS.find((a) => a.id === "kurma")!,
      ALL_ACCOMPANIMENTS.find((a) => a.id === "dal")!,
      ALL_ACCOMPANIMENTS.find((a) => a.id === "curd")!,
    ];
  }

  // 3. Rice & Main Meals
  if (
    id.includes("rice") ||
    id.includes("annam") ||
    id.includes("java")
  ) {
    if (id.includes("curd_rice") || id.includes("pulihora")) {
      return [
        ALL_ACCOMPANIMENTS.find((a) => a.id === "pickle")!,
        ALL_ACCOMPANIMENTS.find((a) => a.id === "curd")!,
        ALL_ACCOMPANIMENTS.find((a) => a.id === "papad")!,
      ];
    }

    return [
      ALL_ACCOMPANIMENTS.find((a) => a.id === "dal")!,
      ALL_ACCOMPANIMENTS.find((a) => a.id === "curd")!,
      ALL_ACCOMPANIMENTS.find((a) => a.id === "sambar")!,
    ];
  }

  // 4. Fruits & Nuts
  if (cat === "fruits_nuts") {
    return [
      ALL_ACCOMPANIMENTS.find((a) => a.id === "milk")!,
      ALL_ACCOMPANIMENTS.find((a) => a.id === "curd")!,
      ALL_ACCOMPANIMENTS.find((a) => a.id === "nuts")!,
    ];
  }

  // 5. Snacks & Sweets (Poha, Sarva Pindi, Laddu, Ariselu, etc.)
  return [
    ALL_ACCOMPANIMENTS.find((a) => a.id === "chutney")!,
    ALL_ACCOMPANIMENTS.find((a) => a.id === "tea")!,
    ALL_ACCOMPANIMENTS.find((a) => a.id === "other")!,
  ];
}
