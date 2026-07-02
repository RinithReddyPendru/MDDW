import { type LangKey } from "./translations";
import { type FoodGroupId } from "./foodGroups";

export type MealCategory = "breakfast" | "lunch" | "snack" | "dinner";

export interface MealIngredient {
  nameKey: string;
  groupId: FoodGroupId;
}

export interface Meal {
  id: string;
  nameKey: string;
  category: MealCategory;
  imageUrl: string;
  ingredients: MealIngredient[];
}

export const MDDW_MEALS: Meal[] = [
  // BREAKFAST
  {
    id: "meal_bf_1",
    nameKey: "dish_idli_with_peanut_chutney",
    category: "breakfast",
    imageUrl: "/images/meals/idli_peanut_chutney.png",
    ingredients: [
      { nameKey: "ing_idli_with_peanut_chutney_grains", groupId: "grains" },
      { nameKey: "ing_idli_with_peanut_chutney_nuts", groupId: "nuts" }
    ]
  },
  {
    id: "meal_bf_2",
    nameKey: "dish_pesarattu_with_upma",
    category: "breakfast",
    imageUrl: "/images/meals/pesarattu_upma.png",
    ingredients: [
      { nameKey: "ing_pesarattu_with_upma_pulses", groupId: "pulses" },
      { nameKey: "ing_pesarattu_with_upma_grains", groupId: "grains" }
    ]
  },
  {
    id: "meal_bf_3",
    nameKey: "dish_uggani_with_bajji",
    category: "breakfast",
    imageUrl: "/images/meals/uggani_bajji.png",
    ingredients: [
      { nameKey: "ing_uggani_with_bajji_grains", groupId: "grains" },
      { nameKey: "ing_uggani_with_bajji_veg", groupId: "other_veg" }
    ]
  },
  {
    id: "meal_bf_4",
    nameKey: "dish_minapa_dosa_with_tomato_chutney",
    category: "breakfast",
    imageUrl: "/images/meals/minapa_dosa.png",
    ingredients: [
      { nameKey: "ing_minapa_dosa_with_tomato_chutney_grains", groupId: "grains" },
      { nameKey: "ing_minapa_dosa_with_tomato_chutney_veg", groupId: "other_veg" }
    ]
  },
  {
    id: "meal_bf_5",
    nameKey: "dish_pongal",
    category: "breakfast",
    imageUrl: "/images/meals/pongal.png",
    ingredients: [
      { nameKey: "ing_pongal_grains", groupId: "grains" },
      { nameKey: "ing_pongal_pulses", groupId: "pulses" }
    ]
  },
  {
    id: "meal_bf_6",
    nameKey: "dish_puri_with_potato_curry",
    category: "breakfast",
    imageUrl: "/images/meals/puri_potato_curry.png",
    ingredients: [
      { nameKey: "ing_puri_with_potato_curry_grains", groupId: "grains" },
      { nameKey: "ing_puri_with_potato_curry_roots", groupId: "roots" }
    ]
  },
  {
    id: "meal_bf_7",
    nameKey: "dish_masala_dosa",
    category: "breakfast",
    imageUrl: "/images/meals/masala_dosa.png",
    ingredients: [
      { nameKey: "ing_masala_dosa_grains", groupId: "grains" },
      { nameKey: "ing_masala_dosa_roots", groupId: "roots" }
    ]
  },

  // LUNCH
  {
    id: "meal_l_1",
    nameKey: "dish_rice_with_gutti_vankaya_kura",
    category: "lunch",
    imageUrl: "/images/meals/rice_gutti_vankaya.png",
    ingredients: [
      { nameKey: "ing_rice_with_gutti_vankaya_kura_grains", groupId: "grains" },
      { nameKey: "ing_rice_with_gutti_vankaya_kura_veg", groupId: "other_veg" }
    ]
  },
  {
    id: "meal_l_2",
    nameKey: "dish_andhra_chicken_curry_with_rice",
    category: "lunch",
    imageUrl: "/images/meals/chicken_curry_rice.png",
    ingredients: [
      { nameKey: "ing_andhra_chicken_curry_with_rice_grains", groupId: "grains" },
      { nameKey: "ing_andhra_chicken_curry_with_rice_meat", groupId: "meat" }
    ]
  },
  {
    id: "meal_l_3",
    nameKey: "dish_rice_with_sambar_and_cabbage_poriyal",
    category: "lunch",
    imageUrl: "/images/meals/rice_sambar.png",
    ingredients: [
      { nameKey: "ing_rice_with_sambar_and_cabbage_poriyal_grains", groupId: "grains" },
      { nameKey: "ing_rice_with_sambar_and_cabbage_poriyal_pulses", groupId: "pulses" },
      { nameKey: "ing_rice_with_sambar_and_cabbage_poriyal_veg", groupId: "other_veg" }
    ]
  },
  {
    id: "meal_l_4",
    nameKey: "dish_lemon_rice_with_curd",
    category: "lunch",
    imageUrl: "/images/meals/lemon_rice.png",
    ingredients: [
      { nameKey: "ing_lemon_rice_with_curd_grains", groupId: "grains" },
      { nameKey: "ing_lemon_rice_with_curd_dairy", groupId: "dairy" },
      { nameKey: "ing_lemon_rice_with_curd_pulses", groupId: "pulses" },
      { nameKey: "ing_lemon_rice_with_curd_nuts", groupId: "nuts" }
    ]
  },
  {
    id: "meal_l_5",
    nameKey: "dish_fish_curry_with_rice",
    category: "lunch",
    imageUrl: "/images/meals/fish_curry.png",
    ingredients: [
      { nameKey: "ing_fish_curry_with_rice_grains", groupId: "grains" },
      { nameKey: "ing_fish_curry_with_rice_meat", groupId: "meat" }
    ]
  },
  {
    id: "meal_l_6",
    nameKey: "dish_egg_curry_with_rice",
    category: "lunch",
    imageUrl: "/images/meals/egg_curry.png",
    ingredients: [
      { nameKey: "ing_egg_curry_with_rice_grains", groupId: "grains" },
      { nameKey: "ing_egg_curry_with_rice_eggs", groupId: "eggs" }
    ]
  },

  // SNACKS
  {
    id: "meal_s_1",
    nameKey: "dish_mirchi_bajji",
    category: "snack",
    imageUrl: "/images/meals/mirchi_bajji.png",
    ingredients: [
      { nameKey: "ing_mirchi_bajji_veg", groupId: "other_veg" }
    ]
  },
  {
    id: "meal_s_2",
    nameKey: "dish_bobbatlu",
    category: "snack",
    imageUrl: "/images/meals/bobbatlu.png",
    ingredients: [
      { nameKey: "ing_bobbatlu_grains", groupId: "grains" },
      { nameKey: "ing_bobbatlu_pulses", groupId: "pulses" },
      { nameKey: "ing_bobbatlu_dairy", groupId: "dairy" }
    ]
  },
  {
    id: "meal_s_3",
    nameKey: "dish_punugulu_with_coconut_chutney",
    category: "snack",
    imageUrl: "/images/meals/punugulu_coconut.png",
    ingredients: [
      { nameKey: "ing_punugulu_with_coconut_chutney_grains", groupId: "grains" },
      { nameKey: "ing_punugulu_with_coconut_chutney_nuts", groupId: "nuts" }
    ]
  },
  {
    id: "meal_s_4",
    nameKey: "dish_dibba_rotti",
    category: "snack",
    imageUrl: "/images/meals/dibba_rotti.png",
    ingredients: [
      { nameKey: "ing_dibba_rotti_grains", groupId: "grains" },
      { nameKey: "ing_dibba_rotti_pulses", groupId: "pulses" }
    ]
  },
  {
    id: "meal_s_5",
    nameKey: "dish_atukulu_with_roasted_chana",
    category: "snack",
    imageUrl: "/images/meals/atukulu_chana.png",
    ingredients: [
      { nameKey: "ing_atukulu_with_roasted_chana_grains", groupId: "grains" },
      { nameKey: "ing_atukulu_with_roasted_chana_pulses", groupId: "pulses" },
      { nameKey: "ing_atukulu_with_roasted_chana_nuts", groupId: "nuts" }
    ]
  },
  {
    id: "meal_s_6",
    nameKey: "dish_upma",
    category: "snack",
    imageUrl: "/images/meals/upma.png",
    ingredients: [
      { nameKey: "ing_upma_grains", groupId: "grains" }
    ]
  },

  // DINNER
  {
    id: "meal_d_1",
    nameKey: "dish_ragi_sangati_with_groundnut_chutney",
    category: "dinner",
    imageUrl: "/images/meals/ragi_sangati_chutney.png",
    ingredients: [
      { nameKey: "ing_ragi_sangati_with_groundnut_chutney_grains", groupId: "grains" },
      { nameKey: "ing_ragi_sangati_with_groundnut_chutney_nuts", groupId: "nuts" }
    ]
  },
  {
    id: "meal_d_2",
    nameKey: "dish_tomato_pappu_with_rice",
    category: "dinner",
    imageUrl: "/images/meals/tomato_pappu.png",
    ingredients: [
      { nameKey: "ing_tomato_pappu_with_rice_grains", groupId: "grains" },
      { nameKey: "ing_tomato_pappu_with_rice_pulses", groupId: "pulses" },
      { nameKey: "ing_tomato_pappu_with_rice_veg", groupId: "other_veg" }
    ]
  },
  {
    id: "meal_d_3",
    nameKey: "dish_dal_rice",
    category: "dinner",
    imageUrl: "/images/meals/dal_rice.png",
    ingredients: [
      { nameKey: "ing_dal_rice_grains", groupId: "grains" },
      { nameKey: "ing_dal_rice_pulses", groupId: "pulses" }
    ]
  },
  {
    id: "meal_d_4",
    nameKey: "dish_roti_sabzi",
    category: "dinner",
    imageUrl: "/images/meals/roti_sabzi.png",
    ingredients: [
      { nameKey: "ing_roti_sabzi_grains", groupId: "grains" },
      { nameKey: "ing_roti_sabzi_veg", groupId: "other_veg" }
    ]
  },
  {
    id: "meal_d_5",
    nameKey: "dish_bhindi_masala_rice",
    category: "dinner",
    imageUrl: "/images/meals/bhindi_masala.png",
    ingredients: [
      { nameKey: "ing_bhindi_masala_rice_grains", groupId: "grains" },
      { nameKey: "ing_bhindi_masala_rice_veg", groupId: "other_veg" }
    ]
  },
  {
    id: "meal_d_6",
    nameKey: "dish_palak_paneer_roti",
    category: "dinner",
    imageUrl: "/images/meals/palak_paneer.png",
    ingredients: [
      { nameKey: "ing_palak_paneer_roti_grains", groupId: "grains" },
      { nameKey: "ing_palak_paneer_roti_dairy", groupId: "dairy" },
      { nameKey: "ing_palak_paneer_roti_leafy", groupId: "leafy_greens" }
    ]
  }
];
