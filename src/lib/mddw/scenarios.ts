import type { FoodGroupId } from "./foodGroups";

export interface FoodItem {
  id: string;
  name: string;
  nameTe?: string;
  emoji: string;
  group: FoodGroupId;
}

export interface Scenario {
  id: string;
  patient: string;
  weeks: number;
  region: string;
  regionTe?: string;
  meals: { time: string; timeTe?: string; items: string[]; itemsTe?: string[] }[];
  foods: FoodItem[];
}

// Helper to keep typing short
const f = (id: string, name: string, nameTe: string, emoji: string, group: FoodGroupId): FoodItem => ({ id, name, nameTe, emoji, group });

export const SCENARIOS: Scenario[] = [
  {
    id: "s1", patient: "లక్ష్మి రెడ్డి", weeks: 28, region: "Coastal Andhra (Rural)", regionTe: "తీరాంధ్ర (గ్రామీణ)",
    meals: [
      { time: "Morning", timeTe: "ఉదయం", items: ["Rice", "Sambar", "Buttermilk"], itemsTe: ["అన్నం", "సాంబార్", "మజ్జిగ"] },
      { time: "Lunch", timeTe: "మధ్యాహ్నం", items: ["Rice", "Fish Curry", "Drumstick Leaves"], itemsTe: ["అన్నం", "చేప కూర", "మునగ ఆకుల కూర"] },
      { time: "Evening", timeTe: "సాయంత్రం", items: ["Mango"], itemsTe: ["మామిడి"] },
      { time: "Dinner", timeTe: "రాత్రి", items: ["Ragi Mudde", "Spinach"], itemsTe: ["రాగి ముద్ద", "పాలకూర కూర"] },
    ],
    foods: [
      f("rice", "Rice", "అన్నం", "🍚", "grains"),
      f("sambar", "Sambar", "సాంబార్", "🫘", "pulses"),
      f("buttermilk", "Buttermilk", "మజ్జిగ", "🥛", "dairy"),
      f("fish", "Fish", "చేప", "🐟", "meat"),
      f("drumstick", "Drumstick Leaves", "మునగ ఆకులు", "🥬", "dglv"),
      f("mango", "Mango", "మామిడి", "🥭", "vitaminA"),
      f("ragi", "Ragi Mudde", "రాగి ముద్ద", "🌾", "grains"),
      f("palak", "Spinach", "పాలకూర", "🥬", "dglv"),
    ],
  },
  {
    id: "s2", patient: "సావిత్రి నాయుడు", weeks: 16, region: "Rayalaseema (Urban)", regionTe: "రాయలసీమ (పట్టణ)",
    meals: [
      { time: "Morning", timeTe: "ఉదయం", items: ["Idli", "Sambar", "Milk"], itemsTe: ["ఇడ్లీ", "సాంబార్", "పాలు"] },
      { time: "Lunch", timeTe: "మధ్యాహ్నం", items: ["Rice", "Toor Dal", "Brinjal Curry"], itemsTe: ["అన్నం", "కందిపప్పు", "వంకాయ కూర"] },
      { time: "Snack", timeTe: "అల్పాహారం", items: ["Papaya"], itemsTe: ["బొప్పాయి"] },
      { time: "Dinner", timeTe: "రాత్రి", items: ["Dosa", "Chicken Curry"], itemsTe: ["దోసె", "కోడి కూర"] },
    ],
    foods: [
      f("idli", "Idli", "ఇడ్లీ", "🍙", "grains"),
      f("sambar2", "Sambar", "సాంబార్", "🫘", "pulses"),
      f("milk2", "Milk", "పాలు", "🥛", "dairy"),
      f("rice2", "Rice", "అన్నం", "🍚", "grains"),
      f("toorDal", "Toor Dal", "కందిపప్పు", "🫘", "pulses"),
      f("brinjal", "Brinjal", "వంకాయ", "🍆", "otherVeg"),
      f("papaya", "Papaya", "బొప్పాయి", "🍑", "vitaminA"),
      f("dosa", "Dosa", "దోసె", "🥞", "grains"),
      f("chicken", "Chicken", "కోడి", "🍗", "meat"),
    ],
  },
  {
    id: "s3", patient: "పద్మావతి వర్మ", weeks: 32, region: "Telangana (Rural)", regionTe: "తెలంగాణ (గ్రామీణ)",
    meals: [
      { time: "Morning", timeTe: "ఉదయం", items: ["Jowar Roti", "Groundnut Chutney"], itemsTe: ["జొన్న రొట్టె", "వేరుశనగ చట్నీ"] },
      { time: "Lunch", timeTe: "మధ్యాహ్నం", items: ["Rice", "Amaranth Leaves", "Prawns Curry"], itemsTe: ["అన్నం", "తోటకూర", "రొయ్యల కూర"] },
      { time: "Evening", timeTe: "సాయంత్రం", items: ["Guava"], itemsTe: ["జామ"] },
      { time: "Dinner", timeTe: "రాత్రి", items: ["Rice", "Pumpkin Curry"], itemsTe: ["అన్నం", "గుమ్మడికాయ కూర"] },
    ],
    foods: [
      f("jowar", "Jowar Roti", "జొన్న రొట్టె", "🫓", "grains"),
      f("groundnut", "Groundnut", "వేరుశనగ", "🥜", "nuts"),
      f("rice3", "Rice", "అన్నం", "🍚", "grains"),
      f("amaranth", "Amaranth Leaves", "తోటకూర", "🥬", "dglv"),
      f("prawns", "Prawns", "రొయ్యలు", "🦐", "meat"),
      f("guava", "Guava", "జామ", "🍐", "otherFruit"),
      f("pumpkin", "Pumpkin", "గుమ్మడికాయ", "🎃", "vitaminA"),
    ],
  },
  {
    id: "s4", patient: "సుభద్ర పిళ్ళై", weeks: 12, region: "Godavari Delta (Vegetarian)", regionTe: "గోదావరి డెల్టా (శాకాహారి)",
    meals: [
      { time: "Morning", timeTe: "ఉదయం", items: ["Upma", "Curd"], itemsTe: ["ఉప్మా", "పెరుగు"] },
      { time: "Lunch", timeTe: "మధ్యాహ్నం", items: ["Rice", "Pesara Dal", "Cabbage"], itemsTe: ["అన్నం", "పెసరపప్పు", "క్యాబేజీ"] },
      { time: "Snack", timeTe: "అల్పాహారం", items: ["Almonds", "Banana"], itemsTe: ["బాదంపప్పు", "అరటి"] },
      { time: "Dinner", timeTe: "రాత్రి", items: ["Rice", "Methi Leaves Curry"], itemsTe: ["అన్నం", "మెంతికూర కూర"] },
    ],
    foods: [
      f("upma", "Upma", "ఉప్మా", "🍚", "grains"),
      f("curd4", "Curd", "పెరుగు", "🥣", "dairy"),
      f("rice4", "Rice", "అన్నం", "🍚", "grains"),
      f("pesara", "Pesara Dal", "పెసరపప్పు", "🫘", "pulses"),
      f("cabbage", "Cabbage", "క్యాబేజీ", "🥬", "otherVeg"),
      f("almond4", "Almonds", "బాదంపప్పు", "🥜", "nuts"),
      f("banana4", "Banana", "అరటి", "🍌", "otherFruit"),
      f("methi4", "Methi Leaves", "మెంతికూర", "🥬", "dglv"),
    ],
  },
  {
    id: "s5", patient: "మల్లమ్మ చంద్రశేఖర్", weeks: 24, region: "Nalgonda (Rural)", regionTe: "నల్గొండ (గ్రామీణ)",
    meals: [
      { time: "Morning", timeTe: "ఉదయం", items: ["Bajra Roti", "Buttermilk"], itemsTe: ["సజ్జ రొట్టె", "మజ్జిగ"] },
      { time: "Lunch", timeTe: "మధ్యాహ్నం", items: ["Rice", "Chana Dal", "Okra"], itemsTe: ["అన్నం", "శనగపప్పు", "బెండకాయ"] },
      { time: "Evening", timeTe: "సాయంత్రం", items: ["Papaya"], itemsTe: ["బొప్పాయి"] },
      { time: "Dinner", timeTe: "రాత్రి", items: ["Rice", "Mustard Greens"], itemsTe: ["అన్నం", "ఆవాల ఆకుల కూర"] },
    ],
    foods: [
      f("bajra", "Bajra Roti", "సజ్జ రొట్టె", "🫓", "grains"),
      f("butter5", "Buttermilk", "మజ్జిగ", "🥛", "dairy"),
      f("rice5", "Rice", "అన్నం", "🍚", "grains"),
      f("chana5", "Chana Dal", "శనగపప్పు", "🫘", "pulses"),
      f("bhindi5", "Okra", "బెండకాయ", "🥦", "otherVeg"),
      f("papaya5", "Papaya", "బొప్పాయి", "🍑", "vitaminA"),
      f("mustard", "Mustard Greens", "ఆవాల ఆకులు", "🥬", "dglv"),
    ],
  },
  {
    id: "s6", patient: "రాజేశ్వరి అయ్యంగార్", weeks: 20, region: "Hyderabad (Non-Veg)", regionTe: "హైదరాబాద్ (మాంసాహారి)",
    meals: [
      { time: "Morning", timeTe: "ఉదయం", items: ["Roti", "Omelette"], itemsTe: ["రొట్టె", "ఆమ్లెట్"] },
      { time: "Lunch", timeTe: "మధ్యాహ్నం", items: ["Biryani", "Raita", "Mutton"], itemsTe: ["బిర్యానీ", "రాయితా", "మటన్"] },
      { time: "Snack", timeTe: "అల్పాహారం", items: ["Apple", "Cashews"], itemsTe: ["ఆపిల్", "జీడిపప్పు"] },
      { time: "Dinner", timeTe: "రాత్రి", items: ["Roti", "Spinach Curry"], itemsTe: ["రొట్టె", "పాలకూర కూర"] },
    ],
    foods: [
      f("roti6", "Roti", "రొట్టె", "🫓", "grains"),
      f("omelette", "Omelette", "ఆమ్లెట్", "🥚", "eggs"),
      f("biryani", "Biryani Rice", "బిర్యానీ", "🍚", "grains"),
      f("raita", "Raita", "రాయితా", "🥣", "dairy"),
      f("mutton", "Mutton", "మటన్", "🍖", "meat"),
      f("apple6", "Apple", "ఆపిల్", "🍎", "otherFruit"),
      f("cashew6", "Cashews", "జీడిపప్పు", "🥜", "nuts"),
      f("palak6", "Spinach", "పాలకూర", "🥬", "dglv"),
    ],
  },
  {
    id: "s7", patient: "విమల కుమారి", weeks: 8, region: "Srikakulam (Tribal)", regionTe: "శ్రీకాకుళం (గిరిజన)",
    meals: [
      { time: "Morning", timeTe: "ఉదయం", items: ["Ragi Porridge", "Groundnut"], itemsTe: ["రాగి గంజి", "వేరుశనగ"] },
      { time: "Lunch", timeTe: "మధ్యాహ్నం", items: ["Rice", "Fish", "Drumstick Leaves"], itemsTe: ["అన్నం", "చేప", "మునగ ఆకులు"] },
      { time: "Snack", timeTe: "అల్పాహారం", items: ["Banana"], itemsTe: ["అరటి"] },
      { time: "Dinner", timeTe: "రాత్రి", items: ["Roti", "Sweet Potato", "Paneer"], itemsTe: ["రొట్టె", "చిలగడదుంప", "పనీర్"] },
    ],
    foods: [
      f("ragi7", "Ragi Porridge", "రాగి గంజి", "🌾", "grains"),
      f("gnut7", "Groundnut", "వేరుశనగ", "🥜", "nuts"),
      f("rice7", "Rice", "అన్నం", "🍚", "grains"),
      f("fish7", "Fish", "చేప", "🐟", "meat"),
      f("drum7", "Drumstick Leaves", "మునగ ఆకులు", "🥬", "dglv"),
      f("banana7", "Banana", "అరటి", "🍌", "otherFruit"),
      f("sweet7", "Sweet Potato", "చిలగడదుంప", "🍠", "vitaminA"),
      f("paneer7", "Paneer", "పనీర్", "🧀", "dairy"),
    ],
  },
  {
    id: "s8", patient: "సీతమ్మ ప్రభు", weeks: 36, region: "Vizag (Urban)", regionTe: "విశాఖపట్నం (పట్టణ)",
    meals: [
      { time: "Morning", timeTe: "ఉదయం", items: ["Bread", "Milk", "Boiled Egg"], itemsTe: ["బ్రెడ్", "పాలు", "ఉడికించిన గుడ్డు"] },
      { time: "Lunch", timeTe: "మధ్యాహ్నం", items: ["Rice", "Prawns", "Carrot"], itemsTe: ["అన్నం", "రొయ్యల కూర", "క్యారెట్"] },
      { time: "Snack", timeTe: "అల్పాహారం", items: ["Sesame Seeds", "Orange"], itemsTe: ["నువ్వులు", "నారంజి"] },
      { time: "Dinner", timeTe: "రాత్రి", items: ["Roti", "Palak Paneer"], itemsTe: ["రొట్టె", "పాలకూర పనీర్"] },
    ],
    foods: [
      f("bread8", "Bread", "బ్రెడ్", "🍞", "grains"),
      f("milk8", "Milk", "పాలు", "🥛", "dairy"),
      f("egg8", "Boiled Egg", "ఉడికించిన గుడ్డు", "🥚", "eggs"),
      f("rice8", "Rice", "అన్నం", "🍚", "grains"),
      f("prawns8", "Prawns", "రొయ్యలు", "🦐", "meat"),
      f("carrot8", "Carrot", "క్యారెట్", "🥕", "vitaminA"),
      f("sesame8", "Sesame Seeds", "నువ్వులు", "🌰", "nuts"),
      f("orange8", "Orange", "నారంజి", "🍊", "otherFruit"),
      f("roti8", "Roti", "రొట్టె", "🫓", "grains"),
      f("palakp", "Palak Paneer", "పాలకూర పనీర్", "🥬", "dglv"),
    ],
  },
  {
    id: "s9", patient: "గిరిజ అనంతుల", weeks: 14, region: "Kurnool (Rural)", regionTe: "కర్నూలు (గ్రామీణ)",
    meals: [
      { time: "Morning", timeTe: "ఉదయం", items: ["Idli", "Curd"], itemsTe: ["ఇడ్లీ", "పెరుగు"] },
      { time: "Lunch", timeTe: "మధ్యాహ్నం", items: ["Rice", "Toor Dal", "Tomato"], itemsTe: ["అన్నం", "కందిపప్పు", "టమోటా"] },
      { time: "Snack", timeTe: "అల్పాహారం", items: ["Pomegranate"], itemsTe: ["దానిమ్మ"] },
      { time: "Dinner", timeTe: "రాత్రి", items: ["Ragi Mudde", "Chicken Curry", "Spinach"], itemsTe: ["రాగి ముద్ద", "కోడి కూర", "పాలకూర"] },
    ],
    foods: [
      f("idli9", "Idli", "ఇడ్లీ", "🍙", "grains"),
      f("curd9", "Curd", "పెరుగు", "🥣", "dairy"),
      f("rice9", "Rice", "అన్నం", "🍚", "grains"),
      f("toor9", "Toor Dal", "కందిపప్పు", "🫘", "pulses"),
      f("tomato9", "Tomato", "టమోటా", "🍅", "otherVeg"),
      f("pomeg", "Pomegranate", "దానిమ్మ", "🍅", "otherFruit"),
      f("ragi9", "Ragi Mudde", "రాగి ముద్ద", "🌾", "grains"),
      f("chicken9", "Chicken", "కోడి", "🍗", "meat"),
      f("palak9", "Spinach", "పాలకూర", "🥬", "dglv"),
    ],
  },
  {
    id: "s10", patient: "అనసూయ మల్లికార్జున్", weeks: 22, region: "Adilabad (Tribal)", regionTe: "ఆదిలాబాద్ (గిరిజన)",
    meals: [
      { time: "Morning", timeTe: "ఉదయం", items: ["Maize Roti", "Groundnut Chutney"], itemsTe: ["మొక్కజొన్న రొట్టె", "వేరుశనగ చట్నీ"] },
      { time: "Lunch", timeTe: "మధ్యాహ్నం", items: ["Rice", "Toor Dal", "Drumstick Leaves"], itemsTe: ["అన్నం", "కందిపప్పు", "మునగ ఆకులు"] },
      { time: "Snack", timeTe: "అల్పాహారం", items: ["Sesame Laddoo"], itemsTe: ["నువ్వుల లడ్డూ"] },
      { time: "Dinner", timeTe: "రాత్రి", items: ["Roti", "Sweet Potato"], itemsTe: ["రొట్టె", "చిలగడదుంప"] },
    ],
    foods: [
      f("maize", "Maize Roti", "మొక్కజొన్న రొట్టె", "🫓", "grains"),
      f("gnut10", "Groundnut", "వేరుశనగ", "🥜", "nuts"),
      f("rice10", "Rice", "అన్నం", "🍚", "grains"),
      f("tur10", "Toor Dal", "కందిపప్పు", "🫘", "pulses"),
      f("drum10", "Drumstick Leaves", "మునగ ఆకులు", "🥬", "dglv"),
      f("sesame10", "Sesame", "నువ్వులు", "🌰", "nuts"),
      f("sweetp10", "Sweet Potato", "చిలగడదుంప", "🍠", "vitaminA"),
    ],
  },
  {
    id: "s11", patient: "శ్యామల భాస్కరరావు", weeks: 30, region: "Krishna District (Veg)", regionTe: "కృష్ణా జిల్లా (శాకాహారి)",
    meals: [
      { time: "Morning", timeTe: "ఉదయం", items: ["Pesarattu", "Milk"], itemsTe: ["పెసరట్టు", "పాలు"] },
      { time: "Lunch", timeTe: "మధ్యాహ్నం", items: ["Rice", "Chana Dal", "Cauliflower"], itemsTe: ["అన్నం", "శనగపప్పు", "కాలీఫ్లవర్"] },
      { time: "Snack", timeTe: "అల్పాహారం", items: ["Banana", "Almonds"], itemsTe: ["అరటి", "బాదంపప్పు"] },
      { time: "Dinner", timeTe: "రాత్రి", items: ["Rice", "Curd", "Methi"], itemsTe: ["అన్నం", "పెరుగు", "మెంతికూర"] },
    ],
    foods: [
      f("pesarat", "Pesarattu", "పెసరట్టు", "🥞", "grains"),
      f("milk11", "Milk", "పాలు", "🥛", "dairy"),
      f("rice11", "Rice", "అన్నం", "🍚", "grains"),
      f("chana11", "Chana Dal", "శనగపప్పు", "🫘", "pulses"),
      f("cauli11", "Cauliflower", "కాలీఫ్లవర్", "🥦", "otherVeg"),
      f("banana11", "Banana", "అరటి", "🍌", "otherFruit"),
      f("almond11", "Almonds", "బాదంపప్పు", "🥜", "nuts"),
      f("curd11", "Curd", "పెరుగు", "🥣", "dairy"),
      f("methi11", "Methi", "మెంతికూర", "🥬", "dglv"),
    ],
  },
  {
    id: "s12", patient: "కమలాదేవి శేషశాయి", weeks: 18, region: "Guntur (Mixed)", regionTe: "గుంటూరు (మిశ్రమ)",
    meals: [
      { time: "Morning", timeTe: "ఉదయం", items: ["Poha", "Tea with Milk"], itemsTe: ["పోహా", "పాలతో చాయ్"] },
      { time: "Lunch", timeTe: "మధ్యాహ్నం", items: ["Rice", "Pesara Dal", "Tomato"], itemsTe: ["అన్నం", "పెసరపప్పు", "టమోటా"] },
      { time: "Snack", timeTe: "అల్పాహారం", items: ["Mango"], itemsTe: ["మామిడి"] },
      { time: "Dinner", timeTe: "రాత్రి", items: ["Rice", "Toor Dal Curry", "Spinach"], itemsTe: ["అన్నం", "కందిపప్పు కూర", "పాలకూర"] },
    ],
    foods: [
      f("poha12", "Poha", "పోహా", "🍚", "grains"),
      f("milk12", "Milk", "పాలు", "🥛", "dairy"),
      f("rice12", "Rice", "అన్నం", "🍚", "grains"),
      f("pesara12", "Pesara Dal", "పెసరపప్పు", "🫘", "pulses"),
      f("tomato12", "Tomato", "టమోటా", "🍅", "otherVeg"),
      f("mango12", "Mango", "మామిడి", "🥭", "vitaminA"),
      f("toor12", "Toor Dal Curry", "కందిపప్పు కూర", "🫘", "pulses"),
      f("palak12", "Spinach", "పాలకూర", "🥬", "dglv"),
    ],
  },
  {
    id: "s13", patient: "మహాలక్ష్మి వెంకటేష్", weeks: 26, region: "Warangal (Veg)", regionTe: "వరంగల్ (శాకాహారి)",
    meals: [
      { time: "Morning", timeTe: "ఉదయం", items: ["Upma", "Coconut Chutney"], itemsTe: ["ఉప్మా", "కొబ్బరి చట్నీ"] },
      { time: "Lunch", timeTe: "మధ్యాహ్నం", items: ["Curd Rice", "Carrot Curry"], itemsTe: ["పెరుగు అన్నం", "క్యారెట్ కూర"] },
      { time: "Snack", timeTe: "అల్పాహారం", items: ["Banana"], itemsTe: ["అరటి"] },
      { time: "Dinner", timeTe: "రాత్రి", items: ["Dosa", "Sambar", "Drumstick Leaves"], itemsTe: ["దోసె", "సాంబార్", "మునగ ఆకుల కూర"] },
    ],
    foods: [
      f("upma13", "Upma", "ఉప్మా", "🍚", "grains"),
      f("curd13", "Curd", "పెరుగు", "🥣", "dairy"),
      f("rice13", "Rice", "అన్నం", "🍚", "grains"),
      f("carrot13", "Carrot", "క్యారెట్", "🥕", "vitaminA"),
      f("banana13", "Banana", "అరటి", "🍌", "otherFruit"),
      f("dosa13", "Dosa", "దోసె", "🥞", "grains"),
      f("sambar13", "Sambar", "సాంబార్", "🫘", "pulses"),
      f("drum13", "Drumstick Leaves", "మునగ ఆకులు", "🥬", "dglv"),
    ],
  },
  {
    id: "s14", patient: "ఉమాదేవి చలపతి", weeks: 10, region: "Eluru (Non-Veg)", regionTe: "ఏలూరు (మాంసాహారి)",
    meals: [
      { time: "Morning", timeTe: "ఉదయం", items: ["Rice", "Egg Curry"], itemsTe: ["అన్నం", "గుడ్డు కూర"] },
      { time: "Lunch", timeTe: "మధ్యాహ్నం", items: ["Rice", "Chole", "Tomato Salad"], itemsTe: ["అన్నం", "శనగల కూర", "టమోటా సలాడ్"] },
      { time: "Snack", timeTe: "అల్పాహారం", items: ["Buttermilk", "Apple"], itemsTe: ["మజ్జిగ", "ఆపిల్"] },
      { time: "Dinner", timeTe: "రాత్రి", items: ["Roti", "Fish Curry", "Amaranth"], itemsTe: ["రొట్టె", "చేప కూర", "తోటకూర"] },
    ],
    foods: [
      f("rice14", "Rice", "అన్నం", "🍚", "grains"),
      f("egg14", "Egg Curry", "గుడ్డు కూర", "🥚", "eggs"),
      f("chole14", "Chole", "శనగల కూర", "🫘", "pulses"),
      f("tomato14", "Tomato", "టమోటా", "🍅", "otherVeg"),
      f("butter14", "Buttermilk", "మజ్జిగ", "🥛", "dairy"),
      f("apple14", "Apple", "ఆపిల్", "🍎", "otherFruit"),
      f("roti14", "Roti", "రొట్టె", "🫓", "grains"),
      f("fish14", "Fish", "చేప", "🐟", "meat"),
      f("amaranth14", "Amaranth Leaves", "తోటకూర", "🥬", "dglv"),
    ],
  },
  {
    id: "s15", patient: "రోహిణి రాఘవేంద్ర", weeks: 34, region: "Nellore (Coastal)", regionTe: "నెల్లూరు (తీరప్రాంత)",
    meals: [
      { time: "Morning", timeTe: "ఉదయం", items: ["Idli", "Sambar", "Milk"], itemsTe: ["ఇడ్లీ", "సాంబార్", "పాలు"] },
      { time: "Lunch", timeTe: "మధ్యాహ్నం", items: ["Rice", "Fish Fry", "Pumpkin Curry"], itemsTe: ["అన్నం", "చేప వేపుడు", "గుమ్మడికాయ కూర"] },
      { time: "Snack", timeTe: "అల్పాహారం", items: ["Papaya"], itemsTe: ["బొప్పాయి"] },
      { time: "Dinner", timeTe: "రాత్రి", items: ["Ragi Mudde", "Chicken Curry", "Spinach"], itemsTe: ["రాగి ముద్ద", "కోడి కూర", "పాలకూర"] },
    ],
    foods: [
      f("idli15", "Idli", "ఇడ్లీ", "🍙", "grains"),
      f("sambar15", "Sambar", "సాంబార్", "🫘", "pulses"),
      f("milk15", "Milk", "పాలు", "🥛", "dairy"),
      f("rice15", "Rice", "అన్నం", "🍚", "grains"),
      f("fish15", "Fish", "చేప", "🐟", "meat"),
      f("pumpkin15", "Pumpkin", "గుమ్మడికాయ", "🎃", "vitaminA"),
      f("papaya15", "Papaya", "బొప్పాయి", "🍑", "vitaminA"),
      f("ragi15", "Ragi Mudde", "రాగి ముద్ద", "🌾", "grains"),
      f("chicken15", "Chicken", "కోడి", "🍗", "meat"),
      f("palak15", "Spinach", "పాలకూర", "🥬", "dglv"),
    ],
  },
  {
    id: "s16", patient: "ఇందిర వెంకటరమణ", weeks: 16, region: "Khammam (Non-Veg)", regionTe: "ఖమ్మం (మాంసాహారి)",
    meals: [
      { time: "Morning", timeTe: "ఉదయం", items: ["Poori", "Potato Curry"], itemsTe: ["పూరీ", "బంగాళాదుంప కూర"] },
      { time: "Lunch", timeTe: "మధ్యాహ్నం", items: ["Rice", "Prawns Curry", "Brinjal"], itemsTe: ["అన్నం", "రొయ్యల కూర", "వంకాయ"] },
      { time: "Snack", timeTe: "అల్పాహారం", items: ["Guava"], itemsTe: ["జామ"] },
      { time: "Dinner", timeTe: "రాత్రి", items: ["Rice", "Egg Curry", "Amaranth"], itemsTe: ["అన్నం", "గుడ్డు కూర", "తోటకూర"] },
    ],
    foods: [
      f("poori16", "Poori", "పూరీ", "🫓", "grains"),
      f("potato16", "Potato", "బంగాళాదుంప", "🥔", "grains"),
      f("rice16", "Rice", "అన్నం", "🍚", "grains"),
      f("prawns16", "Prawns", "రొయ్యలు", "🦐", "meat"),
      f("brinjal16", "Brinjal", "వంకాయ", "🍆", "otherVeg"),
      f("guava16", "Guava", "జామ", "🍐", "otherFruit"),
      f("egg16", "Egg", "గుడ్డు", "🥚", "eggs"),
      f("amaranth16", "Amaranth Leaves", "తోటకూర", "🥬", "dglv"),
    ],
  },
  {
    id: "s17", patient: "అంబికా సుబ్రహ్మణ్యం", weeks: 28, region: "Prakasam (Rural)", regionTe: "ప్రకాశం (గ్రామీణ)",
    meals: [
      { time: "Morning", timeTe: "ఉదయం", items: ["Jowar Roti", "Ghee"], itemsTe: ["జొన్న రొట్టె", "నెయ్యి"] },
      { time: "Lunch", timeTe: "మధ్యాహ్నం", items: ["Rice", "Urad Dal", "Pumpkin"], itemsTe: ["అన్నం", "మినపప్పు", "గుమ్మడికాయ"] },
      { time: "Snack", timeTe: "అల్పాహారం", items: ["Walnuts", "Mango"], itemsTe: ["అక్రోట్", "మామిడి"] },
      { time: "Dinner", timeTe: "రాత్రి", items: ["Roti", "Palak", "Curd"], itemsTe: ["రొట్టె", "పాలకూర", "పెరుగు"] },
    ],
    foods: [
      f("jowar17", "Jowar Roti", "జొన్న రొట్టె", "🫓", "grains"),
      f("ghee17", "Ghee", "నెయ్యి", "🥛", "dairy"),
      f("rice17", "Rice", "అన్నం", "🍚", "grains"),
      f("urad17", "Urad Dal", "మినపప్పు", "🫘", "pulses"),
      f("pumpkin17", "Pumpkin", "గుమ్మడికాయ", "🎃", "vitaminA"),
      f("walnut17", "Walnuts", "అక్రోట్", "🥜", "nuts"),
      f("mango17", "Mango", "మామిడి", "🥭", "vitaminA"),
      f("roti17", "Roti", "రొట్టె", "🫓", "grains"),
      f("palak17", "Palak", "పాలకూర", "🥬", "dglv"),
      f("curd17", "Curd", "పెరుగు", "🥣", "dairy"),
    ],
  },
  {
    id: "s18", patient: "నిర్మల కోటేశ్వరరావు", weeks: 12, region: "Vizianagaram (Tribal)", regionTe: "విజయనగరం (గిరిజన)",
    meals: [
      { time: "Morning", timeTe: "ఉదయం", items: ["Rice Kanji", "Chutney"], itemsTe: ["అన్నం గంజి", "చట్నీ"] },
      { time: "Lunch", timeTe: "మధ్యాహ్నం", items: ["Rice", "Chana Dal", "Amaranth Greens"], itemsTe: ["అన్నం", "శనగపప్పు", "తోటకూర"] },
      { time: "Snack", timeTe: "అల్పాహారం", items: ["Banana", "Groundnut"], itemsTe: ["అరటి", "వేరుశనగ"] },
      { time: "Dinner", timeTe: "రాత్రి", items: ["Rice", "Fish", "Sweet Potato"], itemsTe: ["అన్నం", "చేప", "చిలగడదుంప"] },
    ],
    foods: [
      f("kanji18", "Rice Kanji", "అన్నం గంజి", "🍚", "grains"),
      f("rice18", "Rice", "అన్నం", "🍚", "grains"),
      f("chana18", "Chana Dal", "శనగపప్పు", "🫘", "pulses"),
      f("amaranth18", "Amaranth Greens", "తోటకూర", "🥬", "dglv"),
      f("banana18", "Banana", "అరటి", "🍌", "otherFruit"),
      f("gnut18", "Groundnut", "వేరుశనగ", "🥜", "nuts"),
      f("fish18", "Fish", "చేప", "🐟", "meat"),
      f("sweetp18", "Sweet Potato", "చిలగడదుంప", "🍠", "vitaminA"),
    ],
  },
  {
    id: "s19", patient: "భాగ్యలక్ష్మి పురుషోత్తమ్", weeks: 24, region: "Ongole (Rural)", regionTe: "ఒంగోలు (గ్రామీణ)",
    meals: [
      { time: "Morning", timeTe: "ఉదయం", items: ["Rice", "Sambar"], itemsTe: ["అన్నం", "సాంబార్"] },
      { time: "Lunch", timeTe: "మధ్యాహ్నం", items: ["Rice", "Chana Dal", "Spinach"], itemsTe: ["అన్నం", "శనగపప్పు", "పాలకూర"] },
      { time: "Snack", timeTe: "అల్పాహారం", items: ["Banana", "Groundnut"], itemsTe: ["అరటి", "వేరుశనగ"] },
      { time: "Dinner", timeTe: "రాత్రి", items: ["Rice", "Brinjal Curry", "Egg"], itemsTe: ["అన్నం", "వంకాయ కూర", "గుడ్డు"] },
    ],
    foods: [
      f("rice19", "Rice", "అన్నం", "🍚", "grains"),
      f("sambar19", "Sambar", "సాంబార్", "🫘", "pulses"),
      f("chana19", "Chana Dal", "శనగపప్పు", "🫘", "pulses"),
      f("palak19", "Spinach", "పాలకూర", "🥬", "dglv"),
      f("banana19", "Banana", "అరటి", "🍌", "otherFruit"),
      f("gnut19", "Groundnut", "వేరుశనగ", "🥜", "nuts"),
      f("brinjal19", "Brinjal", "వంకాయ", "🍆", "otherVeg"),
      f("egg19", "Egg", "గుడ్డు", "🥚", "eggs"),
    ],
  },
  {
    id: "s20", patient: "జయమ్మ శ్రీనివాసుల", weeks: 20, region: "Tirupati (Urban)", regionTe: "తిరుపతి (పట్టణ)",
    meals: [
      { time: "Morning", timeTe: "ఉదయం", items: ["Bread", "Milk", "Boiled Egg"], itemsTe: ["బ్రెడ్", "పాలు", "ఉడికించిన గుడ్డు"] },
      { time: "Lunch", timeTe: "మధ్యాహ్నం", items: ["Rice", "Chicken", "Carrot Salad"], itemsTe: ["అన్నం", "కోడి కూర", "క్యారెట్ సలాడ్"] },
      { time: "Snack", timeTe: "అల్పాహారం", items: ["Almonds", "Orange"], itemsTe: ["బాదంపప్పు", "నారంజి"] },
      { time: "Dinner", timeTe: "రాత్రి", items: ["Roti", "Palak Paneer"], itemsTe: ["రొట్టె", "పాలకూర పనీర్"] },
    ],
    foods: [
      f("bread20", "Bread", "బ్రెడ్", "🍞", "grains"),
      f("milk20", "Milk", "పాలు", "🥛", "dairy"),
      f("egg20", "Boiled Egg", "ఉడికించిన గుడ్డు", "🥚", "eggs"),
      f("rice20", "Rice", "అన్నం", "🍚", "grains"),
      f("chicken20", "Chicken", "కోడి", "🍗", "meat"),
      f("carrot20", "Carrot", "క్యారెట్", "🥕", "vitaminA"),
      f("almond20", "Almonds", "బాదంపప్పు", "🥜", "nuts"),
      f("orange20", "Orange", "నారంజి", "🍊", "otherFruit"),
      f("roti20", "Roti", "రొట్టె", "🫓", "grains"),
      f("palakp20", "Palak Paneer", "పాలకూర పనీర్", "🥬", "dglv"),
    ],
  },
];

export function pickScenarioForLevel(level: 1 | 2 | 3, seenIds: string[] = []): Scenario {
  const minItems = level === 1 ? 5 : level === 2 ? 8 : 9;
  const pool = SCENARIOS.filter((s) => s.foods.length >= minItems);
  const fresh = pool.filter((s) => !seenIds.includes(s.id));
  const list = fresh.length ? fresh : pool;
  return list[Math.floor(Math.random() * list.length)];
}

export function trimFoodsForLevel(scenario: Scenario, level: 1 | 2 | 3): Scenario {
  const target = level === 1 ? 5 : level === 2 ? 10 : 15;
  if (scenario.foods.length <= target) return scenario;
  return { ...scenario, foods: scenario.foods.slice(0, target) };
}
