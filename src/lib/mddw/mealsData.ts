import { type LangKey } from "./translations";
import { type FoodGroupId } from "./foodGroups";

export type MealCategory = "breakfast" | "lunch" | "dinner";

export interface MealIngredient {
  nameKey: LangKey;
  groupId: FoodGroupId;
}

export interface Meal {
  id: string;
  nameKey: LangKey;
  category: MealCategory;
  imageUrl: string;
  ingredients: MealIngredient[];
}

export const MDDW_MEALS: Meal[] = [
  {
    id: "idli_sambar",
    nameKey: "meal_idli_sambar",
    category: "breakfast",
    imageUrl: "/images/meals/idli_sambar.png",
    ingredients: [
      { nameKey: "ing_idli", groupId: "grains" },
      { nameKey: "ing_sambar", groupId: "pulses" },
    ],
  },
  {
    id: "poha",
    nameKey: "meal_poha",
    category: "breakfast",
    imageUrl: "/images/meals/poha.png",
    ingredients: [
      { nameKey: "ing_poha", groupId: "grains" },
      { nameKey: "ing_peanuts", groupId: "nuts" },
    ],
  },
  {
    id: "upma",
    nameKey: "meal_upma",
    category: "breakfast",
    imageUrl: "/images/meals/upma.png",
    ingredients: [
      { nameKey: "ing_upma", groupId: "grains" },
      { nameKey: "ing_mixed_veg", groupId: "otherVeg" },
    ],
  },
  {
    id: "masala_dosa",
    nameKey: "meal_masala_dosa",
    category: "breakfast",
    imageUrl: "/images/meals/masala_dosa.png",
    ingredients: [
      { nameKey: "ing_dosa", groupId: "grains" },
      { nameKey: "ing_potato_masala", groupId: "grains" },
    ],
  },
  {
    id: "aloo_paratha",
    nameKey: "meal_aloo_paratha",
    category: "breakfast",
    imageUrl: "/images/meals/aloo_paratha.png",
    ingredients: [
      { nameKey: "ing_paratha", groupId: "grains" },
      { nameKey: "ing_potato_masala", groupId: "grains" },
    ],
  },

  // lunch
  {
    id: "dal_rice",
    nameKey: "meal_dal_rice",
    category: "lunch",
    imageUrl: "/images/meals/dal_rice.png",
    ingredients: [
      { nameKey: "ing_rice", groupId: "grains" },
      { nameKey: "ing_dal", groupId: "pulses" },
    ],
  },
  {
    id: "chicken_curry",
    nameKey: "meal_chicken_curry",
    category: "lunch",
    imageUrl: "/images/meals/chicken_curry.png",
    ingredients: [
      { nameKey: "ing_chicken_curry", groupId: "meat" },
      { nameKey: "ing_roti", groupId: "grains" },
    ],
  },
  {
    id: "rajma_chawal",
    nameKey: "meal_rajma_chawal",
    category: "lunch",
    imageUrl: "/images/meals/rajma_chawal.png",
    ingredients: [
      { nameKey: "ing_rice", groupId: "grains" },
      { nameKey: "ing_rajma", groupId: "pulses" },
    ],
  },
  {
    id: "veg_biryani",
    nameKey: "meal_veg_biryani",
    category: "lunch",
    imageUrl: "/images/meals/veg_biryani.png",
    ingredients: [
      { nameKey: "ing_biryani", groupId: "grains" },
      { nameKey: "ing_mixed_veg", groupId: "otherVeg" },
    ],
  },
  {
    id: "fish_curry",
    nameKey: "meal_fish_curry",
    category: "lunch",
    imageUrl: "/images/meals/fish_curry.png",
    ingredients: [
      { nameKey: "ing_fish_curry", groupId: "meat" },
      { nameKey: "ing_rice", groupId: "grains" },
    ],
  },

  // dinner
  {
    id: "roti_sabzi",
    nameKey: "meal_roti_sabzi",
    category: "dinner",
    imageUrl: "/images/meals/roti_sabzi.png",
    ingredients: [
      { nameKey: "ing_roti", groupId: "grains" },
      { nameKey: "ing_mixed_veg", groupId: "otherVeg" },
    ],
  },
  {
    id: "palak_paneer",
    nameKey: "meal_palak_paneer",
    category: "dinner",
    imageUrl: "/images/meals/palak_paneer.png",
    ingredients: [
      { nameKey: "ing_roti", groupId: "grains" },
      { nameKey: "ing_palak", groupId: "dglv" },
      { nameKey: "ing_paneer", groupId: "dairy" },
    ],
  },
  {
    id: "khichdi",
    nameKey: "meal_khichdi",
    category: "dinner",
    imageUrl: "/images/meals/khichdi.png",
    ingredients: [
      { nameKey: "ing_rice", groupId: "grains" },
      { nameKey: "ing_dal", groupId: "pulses" },
      { nameKey: "ing_ghee", groupId: "dairy" },
    ],
  },
  {
    id: "egg_curry",
    nameKey: "meal_egg_curry",
    category: "dinner",
    imageUrl: "/images/meals/egg_curry.png",
    ingredients: [
      { nameKey: "ing_egg_curry", groupId: "eggs" },
      { nameKey: "ing_roti", groupId: "grains" },
    ],
  },
  {
    id: "bhindi_masala",
    nameKey: "meal_bhindi_masala",
    category: "dinner",
    imageUrl: "/images/meals/bhindi_masala.png",
    ingredients: [
      { nameKey: "ing_roti", groupId: "grains" },
      { nameKey: "ing_bhindi", groupId: "otherVeg" },
    ],
  },
];

