import { FoodGroupId } from "./foodGroups";

export type MealCategory = "breakfast" | "lunch" | "dinner";

export interface MealIngredient {
  nameKey: string;
  groupId: FoodGroupId;
}

export interface MealDish {
  id: string;
  nameKey: string;
  category: MealCategory;
  ingredients: MealIngredient[];
}

export const MDDW_MEALS: MealDish[] = [
  // BREAKFAST
  {
    id: "b1",
    nameKey: "dish_idli_sambar",
    category: "breakfast",
    ingredients: [
      { nameKey: "ing_rice", groupId: "grains" },
      { nameKey: "ing_urad_dal", groupId: "pulses" },
      { nameKey: "ing_mixed_veg", groupId: "otherVeg" },
    ],
  },
  {
    id: "b2",
    nameKey: "dish_upma",
    category: "breakfast",
    ingredients: [
      { nameKey: "ing_semolina", groupId: "grains" },
      { nameKey: "ing_mixed_veg", groupId: "otherVeg" },
    ],
  },
  {
    id: "b3",
    nameKey: "dish_pesarattu",
    category: "breakfast",
    ingredients: [
      { nameKey: "ing_moong_dal", groupId: "pulses" },
      { nameKey: "ing_rice", groupId: "grains" },
    ],
  },
  {
    id: "b4",
    nameKey: "dish_puri_potato",
    category: "breakfast",
    ingredients: [
      { nameKey: "ing_wheat", groupId: "grains" },
      { nameKey: "ing_potato", groupId: "otherVeg" },
    ],
  },
  {
    id: "b5",
    nameKey: "dish_egg_dosa",
    category: "breakfast",
    ingredients: [
      { nameKey: "ing_rice", groupId: "grains" },
      { nameKey: "ing_urad_dal", groupId: "pulses" },
      { nameKey: "ing_egg", groupId: "eggs" },
    ],
  },

  // LUNCH
  {
    id: "l1",
    nameKey: "dish_sambar_rice",
    category: "lunch",
    ingredients: [
      { nameKey: "ing_rice", groupId: "grains" },
      { nameKey: "ing_toor_dal", groupId: "pulses" },
      { nameKey: "ing_mixed_veg", groupId: "otherVeg" },
    ],
  },
  {
    id: "l2",
    nameKey: "dish_palakura_annam",
    category: "lunch",
    ingredients: [
      { nameKey: "ing_rice", groupId: "grains" },
      { nameKey: "ing_spinach", groupId: "dglv" },
    ],
  },
  {
    id: "l3",
    nameKey: "dish_chicken_pulao",
    category: "lunch",
    ingredients: [
      { nameKey: "ing_rice", groupId: "grains" },
      { nameKey: "ing_chicken", groupId: "meat" },
    ],
  },
  {
    id: "l4",
    nameKey: "dish_curd_rice",
    category: "lunch",
    ingredients: [
      { nameKey: "ing_rice", groupId: "grains" },
      { nameKey: "ing_curd", groupId: "dairy" },
    ],
  },
  {
    id: "l5",
    nameKey: "dish_veg_biryani",
    category: "lunch",
    ingredients: [
      { nameKey: "ing_rice", groupId: "grains" },
      { nameKey: "ing_mixed_veg", groupId: "otherVeg" },
    ],
  },

  // DINNER
  {
    id: "d1",
    nameKey: "dish_roti_tomato_dal",
    category: "dinner",
    ingredients: [
      { nameKey: "ing_wheat", groupId: "grains" },
      { nameKey: "ing_toor_dal", groupId: "pulses" },
      { nameKey: "ing_tomato", groupId: "otherVeg" },
    ],
  },
  {
    id: "d2",
    nameKey: "dish_chapati_gongura",
    category: "dinner",
    ingredients: [
      { nameKey: "ing_wheat", groupId: "grains" },
      { nameKey: "ing_toor_dal", groupId: "pulses" },
      { nameKey: "ing_gongura", groupId: "dglv" },
    ],
  },
  {
    id: "d3",
    nameKey: "dish_egg_curry_rice",
    category: "dinner",
    ingredients: [
      { nameKey: "ing_rice", groupId: "grains" },
      { nameKey: "ing_egg", groupId: "eggs" },
      { nameKey: "ing_onion_tomato", groupId: "otherVeg" },
    ],
  },
  {
    id: "d4",
    nameKey: "dish_bisi_bele_bath",
    category: "dinner",
    ingredients: [
      { nameKey: "ing_rice", groupId: "grains" },
      { nameKey: "ing_toor_dal", groupId: "pulses" },
      { nameKey: "ing_mixed_veg", groupId: "otherVeg" },
    ],
  },
  {
    id: "d5",
    nameKey: "dish_fish_pulusu_rice",
    category: "dinner",
    ingredients: [
      { nameKey: "ing_rice", groupId: "grains" },
      { nameKey: "ing_fish", groupId: "meat" },
      { nameKey: "ing_onion_tomato", groupId: "otherVeg" },
    ],
  },
];

