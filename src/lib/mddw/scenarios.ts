import type { FoodGroupId } from "./foodGroups";

export interface FoodItem {
  id: string;
  name: string;
  emoji: string;
  group: FoodGroupId;
}

export interface Scenario {
  id: string;
  patient: string;
  weeks: number;
  region: string;
  meals: { time: string; items: string[] }[];
  foods: FoodItem[];
}

// Helper to keep typing short
const f = (id: string, name: string, emoji: string, group: FoodGroupId): FoodItem => ({ id, name, emoji, group });

export const SCENARIOS: Scenario[] = [
  {
    id: "s1", patient: "Priya Devi", weeks: 28, region: "North Indian (Rural)",
    meals: [
      { time: "Morning", items: ["2 Rotis", "Dal", "Milk"] },
      { time: "Lunch", items: ["Rice", "Brinjal Curry", "Curd"] },
      { time: "Evening", items: ["Banana"] },
      { time: "Dinner", items: ["Palak", "Boiled Egg"] },
    ],
    foods: [
      f("roti", "Roti", "🫓", "grains"),
      f("dal", "Dal", "🫘", "pulses"),
      f("milk", "Milk", "🥛", "dairy"),
      f("rice", "Rice", "🍚", "grains"),
      f("brinjal", "Brinjal", "🍆", "otherVeg"),
      f("curd", "Curd", "🥣", "dairy"),
      f("banana", "Banana", "🍌", "otherFruit"),
      f("palak", "Palak", "🥬", "dglv"),
      f("egg", "Boiled Egg", "🥚", "eggs"),
    ],
  },
  {
    id: "s2", patient: "Lakshmi Reddy", weeks: 16, region: "South Indian (Urban)",
    meals: [
      { time: "Morning", items: ["Idli", "Sambar", "Coffee with Milk"] },
      { time: "Lunch", items: ["Rice", "Drumstick Leaves Curry", "Buttermilk"] },
      { time: "Snack", items: ["Mango"] },
      { time: "Dinner", items: ["Dosa", "Chicken Curry"] },
    ],
    foods: [
      f("idli", "Idli", "🍙", "grains"),
      f("sambar", "Sambar", "🫘", "pulses"),
      f("milk2", "Milk", "🥛", "dairy"),
      f("rice2", "Rice", "🍚", "grains"),
      f("drumstick", "Drumstick Leaves", "🥬", "dglv"),
      f("buttermilk", "Buttermilk", "🥛", "dairy"),
      f("mango", "Mango", "🥭", "vitaminA"),
      f("dosa", "Dosa", "🥞", "grains"),
      f("chicken", "Chicken", "🍗", "meat"),
    ],
  },
  {
    id: "s3", patient: "Meena Kumari", weeks: 32, region: "Tribal",
    meals: [
      { time: "Morning", items: ["Ragi Porridge", "Groundnut"] },
      { time: "Lunch", items: ["Rice", "Amaranth Leaves", "Fish Curry"] },
      { time: "Evening", items: ["Guava"] },
      { time: "Dinner", items: ["Roti", "Pumpkin Curry"] },
    ],
    foods: [
      f("ragi", "Ragi", "🌾", "grains"),
      f("groundnut", "Groundnut", "🥜", "nuts"),
      f("rice3", "Rice", "🍚", "grains"),
      f("amaranth", "Amaranth", "🥬", "dglv"),
      f("fish", "Fish", "🐟", "meat"),
      f("guava", "Guava", "🍐", "otherFruit"),
      f("roti3", "Roti", "🫓", "grains"),
      f("pumpkin", "Pumpkin", "🎃", "vitaminA"),
    ],
  },
  {
    id: "s4", patient: "Sunita Patel", weeks: 12, region: "Gujarat (Vegetarian)",
    meals: [
      { time: "Morning", items: ["Poha", "Curd"] },
      { time: "Lunch", items: ["Roti", "Rajma", "Cabbage"] },
      { time: "Snack", items: ["Almonds", "Apple"] },
      { time: "Dinner", items: ["Khichdi", "Methi"] },
    ],
    foods: [
      f("poha", "Poha", "🍚", "grains"),
      f("curd4", "Curd", "🥣", "dairy"),
      f("roti4", "Roti", "🫓", "grains"),
      f("rajma", "Rajma", "🫘", "pulses"),
      f("cabbage", "Cabbage", "🥬", "otherVeg"),
      f("almond", "Almonds", "🥜", "nuts"),
      f("apple", "Apple", "🍎", "otherFruit"),
      f("khichdi", "Khichdi", "🍚", "grains"),
      f("methi", "Methi", "🥬", "dglv"),
    ],
  },
  {
    id: "s5", patient: "Kavita Singh", weeks: 24, region: "Bihar (Rural)",
    meals: [
      { time: "Morning", items: ["Sattu Drink", "Roti"] },
      { time: "Lunch", items: ["Rice", "Moong Dal", "Bhindi"] },
      { time: "Evening", items: ["Papaya"] },
      { time: "Dinner", items: ["Roti", "Sarson Saag"] },
    ],
    foods: [
      f("sattu", "Sattu", "🫘", "pulses"),
      f("roti5", "Roti", "🫓", "grains"),
      f("rice5", "Rice", "🍚", "grains"),
      f("moong", "Moong Dal", "🫘", "pulses"),
      f("bhindi", "Bhindi", "🥦", "otherVeg"),
      f("papaya", "Papaya", "🧡", "vitaminA"),
      f("saag", "Sarson Saag", "🥬", "dglv"),
    ],
  },
  {
    id: "s6", patient: "Anjali Nair", weeks: 20, region: "Kerala (Non-Veg)",
    meals: [
      { time: "Morning", items: ["Appam", "Egg Curry"] },
      { time: "Lunch", items: ["Rice", "Fish Curry", "Cabbage Thoran"] },
      { time: "Snack", items: ["Tender Coconut", "Banana"] },
      { time: "Dinner", items: ["Rice", "Chicken Stew"] },
    ],
    foods: [
      f("appam", "Appam", "🥞", "grains"),
      f("egg6", "Egg", "🥚", "eggs"),
      f("rice6", "Rice", "🍚", "grains"),
      f("fish6", "Fish", "🐟", "meat"),
      f("cabbage6", "Cabbage", "🥬", "otherVeg"),
      f("banana6", "Banana", "🍌", "otherFruit"),
      f("chicken6", "Chicken", "🍗", "meat"),
    ],
  },
  {
    id: "s7", patient: "Rekha Sharma", weeks: 8, region: "Rajasthan (Veg)",
    meals: [
      { time: "Morning", items: ["Bajra Roti", "Buttermilk"] },
      { time: "Lunch", items: ["Dal", "Rice", "Carrot"] },
      { time: "Snack", items: ["Cashew", "Orange"] },
      { time: "Dinner", items: ["Roti", "Methi Sabzi", "Paneer"] },
    ],
    foods: [
      f("bajra", "Bajra Roti", "🫓", "grains"),
      f("buttermilk7", "Buttermilk", "🥛", "dairy"),
      f("dal7", "Dal", "🫘", "pulses"),
      f("rice7", "Rice", "🍚", "grains"),
      f("carrot", "Carrot", "🥕", "vitaminA"),
      f("cashew", "Cashew", "🥜", "nuts"),
      f("orange", "Orange", "🍊", "otherFruit"),
      f("methi7", "Methi", "🥬", "dglv"),
      f("paneer", "Paneer", "🧀", "dairy"),
    ],
  },
  {
    id: "s8", patient: "Geeta Yadav", weeks: 36, region: "UP (Rural)",
    meals: [
      { time: "Morning", items: ["Paratha", "Curd"] },
      { time: "Lunch", items: ["Roti", "Chana Dal", "Tomato Sabzi"] },
      { time: "Snack", items: ["Guava"] },
      { time: "Dinner", items: ["Rice", "Palak Paneer"] },
    ],
    foods: [
      f("paratha", "Paratha", "🫓", "grains"),
      f("curd8", "Curd", "🥣", "dairy"),
      f("roti8", "Roti", "🫓", "grains"),
      f("chana", "Chana Dal", "🫘", "pulses"),
      f("tomato", "Tomato", "🍅", "otherVeg"),
      f("guava8", "Guava", "🍐", "otherFruit"),
      f("rice8", "Rice", "🍚", "grains"),
      f("palak8", "Palak", "🥬", "dglv"),
      f("paneer8", "Paneer", "🧀", "dairy"),
    ],
  },
  {
    id: "s9", patient: "Mariam Khan", weeks: 14, region: "Hyderabad (Non-Veg)",
    meals: [
      { time: "Morning", items: ["Roti", "Omelette"] },
      { time: "Lunch", items: ["Biryani", "Raita", "Mutton"] },
      { time: "Snack", items: ["Dates", "Apple"] },
      { time: "Dinner", items: ["Roti", "Bhindi"] },
    ],
    foods: [
      f("roti9", "Roti", "🫓", "grains"),
      f("omelette", "Omelette", "🥚", "eggs"),
      f("biryani", "Biryani Rice", "🍚", "grains"),
      f("raita", "Raita", "🥣", "dairy"),
      f("mutton", "Mutton", "🍖", "meat"),
      f("apple9", "Apple", "🍎", "otherFruit"),
      f("bhindi9", "Bhindi", "🥦", "otherVeg"),
    ],
  },
  {
    id: "s10", patient: "Pushpa Tiwari", weeks: 22, region: "MP (Tribal)",
    meals: [
      { time: "Morning", items: ["Maize Roti", "Groundnut Chutney"] },
      { time: "Lunch", items: ["Rice", "Tur Dal", "Drumstick Leaves"] },
      { time: "Snack", items: ["Sesame Laddoo"] },
      { time: "Dinner", items: ["Roti", "Sweet Potato"] },
    ],
    foods: [
      f("maize", "Maize Roti", "🫓", "grains"),
      f("gnut10", "Groundnut", "🥜", "nuts"),
      f("rice10", "Rice", "🍚", "grains"),
      f("tur", "Tur Dal", "🫘", "pulses"),
      f("drumstick10", "Drumstick Leaves", "🥬", "dglv"),
      f("sesame", "Sesame", "🌰", "nuts"),
      f("sweetpotato", "Sweet Potato", "🍠", "vitaminA"),
    ],
  },
  {
    id: "s11", patient: "Shanti Devi", weeks: 30, region: "Haryana (Veg)",
    meals: [
      { time: "Morning", items: ["Paratha", "Milk"] },
      { time: "Lunch", items: ["Roti", "Rajma", "Cauliflower"] },
      { time: "Snack", items: ["Banana", "Almonds"] },
      { time: "Dinner", items: ["Khichdi", "Curd", "Methi"] },
    ],
    foods: [
      f("paratha11", "Paratha", "🫓", "grains"),
      f("milk11", "Milk", "🥛", "dairy"),
      f("roti11", "Roti", "🫓", "grains"),
      f("rajma11", "Rajma", "🫘", "pulses"),
      f("cauli", "Cauliflower", "🥦", "otherVeg"),
      f("banana11", "Banana", "🍌", "otherFruit"),
      f("almond11", "Almonds", "🥜", "nuts"),
      f("khichdi11", "Khichdi", "🍚", "grains"),
      f("curd11", "Curd", "🥣", "dairy"),
      f("methi11", "Methi", "🥬", "dglv"),
    ],
  },
  {
    id: "s12", patient: "Saraswati Bai", weeks: 18, region: "Maharashtra (Veg)",
    meals: [
      { time: "Morning", items: ["Poha", "Tea with Milk"] },
      { time: "Lunch", items: ["Bhakri", "Pithla", "Tomato"] },
      { time: "Snack", items: ["Mango"] },
      { time: "Dinner", items: ["Rice", "Amti", "Spinach"] },
    ],
    foods: [
      f("poha12", "Poha", "🍚", "grains"),
      f("milk12", "Milk", "🥛", "dairy"),
      f("bhakri", "Bhakri", "🫓", "grains"),
      f("pithla", "Pithla (Besan)", "🫘", "pulses"),
      f("tomato12", "Tomato", "🍅", "otherVeg"),
      f("mango12", "Mango", "🥭", "vitaminA"),
      f("rice12", "Rice", "🍚", "grains"),
      f("amti", "Amti Dal", "🫘", "pulses"),
      f("spinach", "Spinach", "🥬", "dglv"),
    ],
  },
  {
    id: "s13", patient: "Padma Iyer", weeks: 26, region: "Tamil Nadu (Veg)",
    meals: [
      { time: "Morning", items: ["Upma", "Coconut Chutney"] },
      { time: "Lunch", items: ["Curd Rice", "Carrot Poriyal"] },
      { time: "Snack", items: ["Banana"] },
      { time: "Dinner", items: ["Dosa", "Sambar", "Drumstick Leaves"] },
    ],
    foods: [
      f("upma", "Upma", "🍚", "grains"),
      f("curd13", "Curd", "🥣", "dairy"),
      f("rice13", "Rice", "🍚", "grains"),
      f("carrot13", "Carrot", "🥕", "vitaminA"),
      f("banana13", "Banana", "🍌", "otherFruit"),
      f("dosa13", "Dosa", "🥞", "grains"),
      f("sambar13", "Sambar", "🫘", "pulses"),
      f("drumstick13", "Drumstick Leaves", "🥬", "dglv"),
    ],
  },
  {
    id: "s14", patient: "Jasleen Kaur", weeks: 10, region: "Punjab (Veg)",
    meals: [
      { time: "Morning", items: ["Aloo Paratha", "Curd"] },
      { time: "Lunch", items: ["Roti", "Chole", "Salad Tomato"] },
      { time: "Snack", items: ["Lassi", "Apple"] },
      { time: "Dinner", items: ["Sarson Saag", "Makki Roti"] },
    ],
    foods: [
      f("aloop", "Aloo Paratha", "🫓", "grains"),
      f("curd14", "Curd", "🥣", "dairy"),
      f("roti14", "Roti", "🫓", "grains"),
      f("chole", "Chole", "🫘", "pulses"),
      f("tomato14", "Tomato", "🍅", "otherVeg"),
      f("lassi", "Lassi", "🥛", "dairy"),
      f("apple14", "Apple", "🍎", "otherFruit"),
      f("saag14", "Sarson Saag", "🥬", "dglv"),
      f("makki", "Makki Roti", "🫓", "grains"),
    ],
  },
  {
    id: "s15", patient: "Devika Menon", weeks: 34, region: "Karnataka (Non-Veg)",
    meals: [
      { time: "Morning", items: ["Idli", "Sambar", "Milk"] },
      { time: "Lunch", items: ["Rice", "Fish Fry", "Pumpkin Curry"] },
      { time: "Snack", items: ["Papaya"] },
      { time: "Dinner", items: ["Ragi Mudde", "Chicken Curry", "Spinach"] },
    ],
    foods: [
      f("idli15", "Idli", "🍙", "grains"),
      f("sambar15", "Sambar", "🫘", "pulses"),
      f("milk15", "Milk", "🥛", "dairy"),
      f("rice15", "Rice", "🍚", "grains"),
      f("fish15", "Fish", "🐟", "meat"),
      f("pumpkin15", "Pumpkin", "🎃", "vitaminA"),
      f("papaya15", "Papaya", "🧡", "vitaminA"),
      f("ragi15", "Ragi", "🌾", "grains"),
      f("chicken15", "Chicken", "🍗", "meat"),
      f("spinach15", "Spinach", "🥬", "dglv"),
    ],
  },
  {
    id: "s16", patient: "Anita Das", weeks: 16, region: "Bengal (Non-Veg)",
    meals: [
      { time: "Morning", items: ["Luchi", "Aloo Sabzi"] },
      { time: "Lunch", items: ["Rice", "Fish Curry", "Brinjal"] },
      { time: "Snack", items: ["Guava"] },
      { time: "Dinner", items: ["Rice", "Egg Curry", "Spinach"] },
    ],
    foods: [
      f("luchi", "Luchi", "🫓", "grains"),
      f("aloo", "Aloo", "🥔", "otherVeg"),
      f("rice16", "Rice", "🍚", "grains"),
      f("fish16", "Fish", "🐟", "meat"),
      f("brinjal16", "Brinjal", "🍆", "otherVeg"),
      f("guava16", "Guava", "🍐", "otherFruit"),
      f("egg16", "Egg", "🥚", "eggs"),
      f("spinach16", "Spinach", "🥬", "dglv"),
    ],
  },
  {
    id: "s17", patient: "Sushila Bisht", weeks: 28, region: "Uttarakhand (Hills)",
    meals: [
      { time: "Morning", items: ["Mandua Roti", "Ghee"] },
      { time: "Lunch", items: ["Rice", "Gahat Dal", "Pumpkin"] },
      { time: "Snack", items: ["Walnuts", "Apple"] },
      { time: "Dinner", items: ["Roti", "Palak", "Curd"] },
    ],
    foods: [
      f("mandua", "Mandua Roti", "🫓", "grains"),
      f("ghee", "Ghee", "🥛", "dairy"),
      f("rice17", "Rice", "🍚", "grains"),
      f("gahat", "Gahat Dal", "🫘", "pulses"),
      f("pumpkin17", "Pumpkin", "🎃", "vitaminA"),
      f("walnut", "Walnuts", "🥜", "nuts"),
      f("apple17", "Apple", "🍎", "otherFruit"),
      f("roti17", "Roti", "🫓", "grains"),
      f("palak17", "Palak", "🥬", "dglv"),
      f("curd17", "Curd", "🥣", "dairy"),
    ],
  },
  {
    id: "s18", patient: "Radha Kumari", weeks: 12, region: "Jharkhand (Tribal)",
    meals: [
      { time: "Morning", items: ["Rice", "Saag"] },
      { time: "Lunch", items: ["Rice", "Urad Dal", "Bhindi"] },
      { time: "Snack", items: ["Mahua Fruit"] },
      { time: "Dinner", items: ["Rice", "Fish", "Sweet Potato"] },
    ],
    foods: [
      f("rice18", "Rice", "🍚", "grains"),
      f("saag18", "Saag", "🥬", "dglv"),
      f("urad", "Urad Dal", "🫘", "pulses"),
      f("bhindi18", "Bhindi", "🥦", "otherVeg"),
      f("mahua", "Mahua Fruit", "🍇", "otherFruit"),
      f("fish18", "Fish", "🐟", "meat"),
      f("sweetpotato18", "Sweet Potato", "🍠", "vitaminA"),
    ],
  },
  {
    id: "s19", patient: "Heera Bai", weeks: 24, region: "Chhattisgarh (Rural)",
    meals: [
      { time: "Morning", items: ["Rice Kanji", "Chutney"] },
      { time: "Lunch", items: ["Rice", "Chana Dal", "Bhaji (Greens)"] },
      { time: "Snack", items: ["Banana", "Groundnut"] },
      { time: "Dinner", items: ["Rice", "Brinjal", "Egg"] },
    ],
    foods: [
      f("kanji", "Rice Kanji", "🍚", "grains"),
      f("rice19", "Rice", "🍚", "grains"),
      f("chana19", "Chana Dal", "🫘", "pulses"),
      f("bhaji", "Bhaji Greens", "🥬", "dglv"),
      f("banana19", "Banana", "🍌", "otherFruit"),
      f("gnut19", "Groundnut", "🥜", "nuts"),
      f("brinjal19", "Brinjal", "🍆", "otherVeg"),
      f("egg19", "Egg", "🥚", "eggs"),
    ],
  },
  {
    id: "s20", patient: "Fatima Begum", weeks: 20, region: "Urban (Mixed)",
    meals: [
      { time: "Morning", items: ["Bread", "Milk", "Boiled Egg"] },
      { time: "Lunch", items: ["Rice", "Chicken", "Carrot Salad"] },
      { time: "Snack", items: ["Almonds", "Orange"] },
      { time: "Dinner", items: ["Roti", "Palak Paneer"] },
    ],
    foods: [
      f("bread", "Bread", "🍞", "grains"),
      f("milk20", "Milk", "🥛", "dairy"),
      f("egg20", "Boiled Egg", "🥚", "eggs"),
      f("rice20", "Rice", "🍚", "grains"),
      f("chicken20", "Chicken", "🍗", "meat"),
      f("carrot20", "Carrot", "🥕", "vitaminA"),
      f("almond20", "Almonds", "🥜", "nuts"),
      f("orange20", "Orange", "🍊", "otherFruit"),
      f("roti20", "Roti", "🫓", "grains"),
      f("palak20", "Palak", "🥬", "dglv"),
      f("paneer20", "Paneer", "🧀", "dairy"),
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
  // keep first N foods (deterministic per scenario)
  return { ...scenario, foods: scenario.foods.slice(0, target) };
}
