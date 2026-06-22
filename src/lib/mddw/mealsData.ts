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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Idli_Sambar.JPG/500px-Idli_Sambar.JPG",
    ingredients: [
      { nameKey: "ing_idli", groupId: "grains" },
      { nameKey: "ing_sambar", groupId: "pulses" },
    ],
  },
  {
    id: "poha",
    nameKey: "meal_poha",
    category: "breakfast",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Poha.jpg/500px-Poha.jpg",
    ingredients: [
      { nameKey: "ing_poha", groupId: "grains" },
      { nameKey: "ing_peanuts", groupId: "nuts" },
    ],
  },
  {
    id: "upma",
    nameKey: "meal_upma",
    category: "breakfast",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/A_photo_of_Upma.jpg/500px-A_photo_of_Upma.jpg",
    ingredients: [
      { nameKey: "ing_upma", groupId: "grains" },
      { nameKey: "ing_mixed_veg", groupId: "otherVeg" },
    ],
  },
  {
    id: "masala_dosa",
    nameKey: "meal_masala_dosa",
    category: "breakfast",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Masala_Dosa_with_Chutney_and_Sambar.jpg/500px-Masala_Dosa_with_Chutney_and_Sambar.jpg",
    ingredients: [
      { nameKey: "ing_dosa", groupId: "grains" },
      { nameKey: "ing_potato_masala", groupId: "grains" },
    ],
  },
  {
    id: "aloo_paratha",
    nameKey: "meal_aloo_paratha",
    category: "breakfast",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Aloo_Paratha_also_known_as_Batatay_Jo_Phulko.jpg/500px-Aloo_Paratha_also_known_as_Batatay_Jo_Phulko.jpg",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/3_types_of_lentil.png/500px-3_types_of_lentil.png",
    ingredients: [
      { nameKey: "ing_rice", groupId: "grains" },
      { nameKey: "ing_dal", groupId: "pulses" },
    ],
  },
  {
    id: "chicken_curry",
    nameKey: "meal_chicken_curry",
    category: "lunch",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Indian_Chicken_Curry.jpg/500px-Indian_Chicken_Curry.jpg",
    ingredients: [
      { nameKey: "ing_chicken_curry", groupId: "meat" },
      { nameKey: "ing_roti", groupId: "grains" },
    ],
  },
  {
    id: "rajma_chawal",
    nameKey: "meal_rajma_chawal",
    category: "lunch",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Rajma_Masala_(283208155778).jpg/500px-Rajma_Masala_%283208155778%29.jpg",
    ingredients: [
      { nameKey: "ing_rice", groupId: "grains" },
      { nameKey: "ing_rajma", groupId: "pulses" },
    ],
  },
  {
    id: "veg_biryani",
    nameKey: "meal_veg_biryani",
    category: "lunch",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/%22Hyderabadi_Dum_Biryani%22.jpg/500px-%22Hyderabadi_Dum_Biryani%22.jpg",
    ingredients: [
      { nameKey: "ing_biryani", groupId: "grains" },
      { nameKey: "ing_mixed_veg", groupId: "otherVeg" },
    ],
  },
  {
    id: "fish_curry",
    nameKey: "meal_fish_curry",
    category: "lunch",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Meen_curry_2_%28cropped%29.JPG/500px-Meen_curry_2_%28cropped%29.JPG",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/2020-05-08_19_34_28_Chapati_being_made_in_a_pan_in_the_Franklin_Farm_section_of_Oak_Hill%2C_Fairfax_County%2C_Virginia.jpg/500px-2020-05-08_19_34_28_Chapati_being_made_in_a_pan_in_the_Franklin_Farm_section_of_Oak_Hill%2C_Fairfax_County%2C_Virginia.jpg",
    ingredients: [
      { nameKey: "ing_roti", groupId: "grains" },
      { nameKey: "ing_mixed_veg", groupId: "otherVeg" },
    ],
  },
  {
    id: "palak_paneer",
    nameKey: "meal_palak_paneer",
    category: "dinner",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Palakpaneer_Rayagada_Odisha_0009.jpg/500px-Palakpaneer_Rayagada_Odisha_0009.jpg",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Dall_Khichdi.jpg/500px-Dall_Khichdi.jpg",
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
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Egg_Curry.jpg/500px-Egg_Curry.jpg",
    ingredients: [
      { nameKey: "ing_egg_curry", groupId: "eggs" },
      { nameKey: "ing_roti", groupId: "grains" },
    ],
  },
  {
    id: "bhindi_masala",
    nameKey: "meal_bhindi_masala",
    category: "dinner",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Hong_Kong_Okra_Aug_25_2012.JPG/500px-Hong_Kong_Okra_Aug_25_2012.JPG",
    ingredients: [
      { nameKey: "ing_roti", groupId: "grains" },
      { nameKey: "ing_bhindi", groupId: "otherVeg" },
    ],
  },
];

