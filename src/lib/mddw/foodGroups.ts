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

export const FOOD_GROUPS: FoodGroup[] = [
  {
    id: "grains",
    name: "Grains & Starches",
    emoji: "🌾",
    examples: ["Rice", "Roti / Chapati", "Poha", "Idli", "Dosa", "Upma", "Potato", "Bread"],
    benefits: [
      "Main source of energy (carbohydrates)",
      "Provides B-vitamins for the nervous system",
      "Whole grains add fibre for healthy digestion",
    ],
    colorVar: "group-grains",
  },
  {
    id: "pulses",
    name: "Pulses (Beans, Peas, Lentils)",
    emoji: "🫘",
    examples: ["Toor Dal", "Moong Dal", "Rajma", "Chana", "Sambar", "Lobia"],
    benefits: [
      "Excellent plant protein for muscle growth",
      "Rich in iron — helps prevent anaemia",
      "High in fibre and folate, important in pregnancy",
    ],
    colorVar: "group-pulses",
  },
  {
    id: "nuts",
    name: "Nuts & Seeds",
    emoji: "🥜",
    examples: ["Groundnut", "Sesame (Til)", "Almond", "Cashew", "Walnut", "Flax seeds"],
    benefits: [
      "Healthy fats for brain development",
      "Provides protein, calcium and magnesium",
      "Sesame & almonds boost calcium for bones",
    ],
    colorVar: "group-nuts",
  },
  {
    id: "dairy",
    name: "Dairy",
    emoji: "🥛",
    examples: ["Milk", "Curd / Dahi", "Buttermilk", "Paneer", "Cheese"],
    benefits: [
      "Best source of calcium for strong bones & teeth",
      "Provides high-quality protein and vitamin B12",
      "Curd improves gut health",
    ],
    colorVar: "group-dairy",
  },
  {
    id: "meat",
    name: "Meat, Poultry & Fish",
    emoji: "🍗",
    examples: ["Chicken", "Mutton", "Fish", "Prawns", "Liver"],
    benefits: [
      "Rich in haem-iron (easily absorbed) — fights anaemia",
      "High-quality protein and vitamin B12",
      "Fish gives omega-3 for baby's brain growth",
    ],
    colorVar: "group-meat",
  },
  {
    id: "eggs",
    name: "Eggs",
    emoji: "🥚",
    examples: ["Boiled Egg", "Omelette", "Egg Curry"],
    benefits: [
      "Complete protein with all essential amino acids",
      "Provides choline for baby's brain development",
      "Affordable source of vitamin A, D and B12",
    ],
    colorVar: "group-eggs",
  },
  {
    id: "dglv",
    name: "Dark Green Leafy Vegetables",
    emoji: "🥬",
    examples: ["Palak", "Methi", "Drumstick Leaves", "Amaranth (Chaulai)", "Mustard greens"],
    benefits: [
      "Loaded with iron and folate — prevent anaemia",
      "Rich in calcium and vitamin K for bones",
      "Provides vitamin A for healthy eyes & skin",
    ],
    colorVar: "group-dglv",
  },
  {
    id: "vitaminA",
    name: "Vitamin A-rich Fruits & Vegetables",
    emoji: "🥕",
    examples: ["Carrot", "Pumpkin", "Sweet Potato", "Mango", "Papaya", "Red Bell Pepper"],
    benefits: [
      "Vitamin A protects eyesight (prevents night blindness)",
      "Boosts immunity against infections",
      "Supports healthy skin and baby's growth",
    ],
    colorVar: "group-vitamin-a",
  },
  {
    id: "otherVeg",
    name: "Other Vegetables",
    emoji: "🥦",
    examples: ["Tomato", "Brinjal", "Cauliflower", "Bhindi (Okra)", "Cabbage", "Onion"],
    benefits: [
      "Provides fibre, vitamin C and antioxidants",
      "Low calorie — keeps weight healthy",
      "Helps digestion and prevents constipation",
    ],
    colorVar: "group-other-veg",
  },
  {
    id: "otherFruit",
    name: "Other Fruits",
    emoji: "🍎",
    examples: ["Banana", "Guava", "Apple", "Orange", "Grapes", "Pomegranate"],
    benefits: [
      "Vitamin C boosts immunity & iron absorption",
      "Natural sugars give quick energy",
      "Fibre keeps digestion smooth",
    ],
    colorVar: "group-other-fruit",
  },
];

export const FOOD_GROUP_MAP: Record<FoodGroupId, FoodGroup> = Object.fromEntries(
  FOOD_GROUPS.map((g) => [g.id, g])
) as Record<FoodGroupId, FoodGroup>;

export interface QuizFood {
  name: string;
  emoji: string;
  group: FoodGroupId;
}

export const QUIZ_FOODS: QuizFood[] = [
  { name: "Rice", emoji: "🍚", group: "grains" },
  { name: "Chapati", emoji: "🫓", group: "grains" },
  { name: "Idli", emoji: "🍥", group: "grains" },
  { name: "Potato", emoji: "🥔", group: "grains" },
  { name: "Poha", emoji: "🥣", group: "grains" },
  { name: "Toor Dal", emoji: "🍲", group: "pulses" },
  { name: "Rajma", emoji: "🫘", group: "pulses" },
  { name: "Chana", emoji: "🌰", group: "pulses" },
  { name: "Sambar", emoji: "🥘", group: "pulses" },
  { name: "Groundnut", emoji: "🥜", group: "nuts" },
  { name: "Almond", emoji: "🌰", group: "nuts" },
  { name: "Sesame (Til)", emoji: "⚪", group: "nuts" },
  { name: "Milk", emoji: "🥛", group: "dairy" },
  { name: "Curd", emoji: "🍶", group: "dairy" },
  { name: "Paneer", emoji: "🧀", group: "dairy" },
  { name: "Chicken", emoji: "🍗", group: "meat" },
  { name: "Fish", emoji: "🐟", group: "meat" },
  { name: "Mutton", emoji: "🥩", group: "meat" },
  { name: "Prawns", emoji: "🦐", group: "meat" },
  { name: "Boiled Egg", emoji: "🥚", group: "eggs" },
  { name: "Omelette", emoji: "🍳", group: "eggs" },
  { name: "Palak", emoji: "🥬", group: "dglv" },
  { name: "Methi Leaves", emoji: "🌿", group: "dglv" },
  { name: "Drumstick Leaves", emoji: "🍃", group: "dglv" },
  { name: "Carrot", emoji: "🥕", group: "vitaminA" },
  { name: "Pumpkin", emoji: "🎃", group: "vitaminA" },
  { name: "Mango", emoji: "🥭", group: "vitaminA" },
  { name: "Papaya", emoji: "🍈", group: "vitaminA" },
  { name: "Sweet Potato", emoji: "🍠", group: "vitaminA" },
  { name: "Tomato", emoji: "🍅", group: "otherVeg" },
  { name: "Brinjal", emoji: "🍆", group: "otherVeg" },
  { name: "Cauliflower", emoji: "🥦", group: "otherVeg" },
  { name: "Bhindi", emoji: "🌶️", group: "otherVeg" },
  { name: "Banana", emoji: "🍌", group: "otherFruit" },
  { name: "Guava", emoji: "🍐", group: "otherFruit" },
  { name: "Apple", emoji: "🍎", group: "otherFruit" },
  { name: "Orange", emoji: "🍊", group: "otherFruit" },
  { name: "Grapes", emoji: "🍇", group: "otherFruit" },
];
