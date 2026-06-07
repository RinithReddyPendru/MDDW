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
  colorVar: string; // tailwind var key
}

export const FOOD_GROUPS: FoodGroup[] = [
  { id: "grains", name: "Grains & Staples", emoji: "🌾", examples: ["Rice", "Roti", "Poha", "Idli", "Dosa", "Upma"], colorVar: "group-grains" },
  { id: "pulses", name: "Pulses", emoji: "🫘", examples: ["Dal", "Rajma", "Chana", "Moong", "Sambar"], colorVar: "group-pulses" },
  { id: "nuts", name: "Nuts & Seeds", emoji: "🥜", examples: ["Groundnut", "Sesame", "Almond", "Cashew"], colorVar: "group-nuts" },
  { id: "dairy", name: "Dairy", emoji: "🥛", examples: ["Milk", "Curd", "Buttermilk", "Paneer", "Ghee"], colorVar: "group-dairy" },
  { id: "meat", name: "Meat, Poultry & Fish", emoji: "🍗", examples: ["Chicken", "Fish", "Mutton", "Prawns"], colorVar: "group-meat" },
  { id: "eggs", name: "Eggs", emoji: "🥚", examples: ["Boiled Egg", "Omelette"], colorVar: "group-eggs" },
  { id: "dglv", name: "Dark Green Leafy Veg", emoji: "🥬", examples: ["Palak", "Methi", "Drumstick Leaves", "Amaranth"], colorVar: "group-dglv" },
  { id: "vitaminA", name: "Vitamin A Fruits & Veg", emoji: "🥕", examples: ["Carrot", "Mango", "Papaya", "Pumpkin", "Sweet Potato"], colorVar: "group-vitamin-a" },
  { id: "otherVeg", name: "Other Vegetables", emoji: "🥦", examples: ["Tomato", "Brinjal", "Cauliflower", "Bhindi", "Cabbage"], colorVar: "group-other-veg" },
  { id: "otherFruit", name: "Other Fruits", emoji: "🍎", examples: ["Banana", "Guava", "Apple", "Orange", "Grapes"], colorVar: "group-other-fruit" },
];

export const FOOD_GROUP_MAP: Record<FoodGroupId, FoodGroup> = Object.fromEntries(
  FOOD_GROUPS.map((g) => [g.id, g])
) as Record<FoodGroupId, FoodGroup>;
