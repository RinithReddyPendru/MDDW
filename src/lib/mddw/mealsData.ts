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
  {
    id: "meal_bf_1",
    nameKey: "dish_idli_with_peanut_chutney",
    category: "breakfast",
    imageUrl: "/images/meals/idli_peanut_chutney.png",
    ingredients: [
      { nameKey: "ing_idli_with_peanut_chutney_grains", groupId: "grains" },
      { nameKey: "ing_idli_with_peanut_chutney_nuts", groupId: "nuts" },
    ],
  },
  {
    id: "meal_bf_2",
    nameKey: "dish_pesarattu_with_upma",
    category: "breakfast",
    imageUrl: "/images/meals/pesarattu_upma.png",
    ingredients: [
      { nameKey: "ing_pesarattu_with_upma_pulses", groupId: "pulses" },
      { nameKey: "ing_pesarattu_with_upma_grains", groupId: "grains" },
    ],
  },
  {
    id: "meal_bf_3",
    nameKey: "dish_uggani_with_bajji",
    category: "breakfast",
    imageUrl: "/images/meals/uggani_bajji.png",
    ingredients: [
      { nameKey: "ing_uggani_with_bajji_grains", groupId: "grains" },
      { nameKey: "ing_uggani_with_bajji_otherVeg", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_bf_4",
    nameKey: "dish_minapa_dosa_with_tomato_chutney",
    category: "breakfast",
    imageUrl: "/images/meals/minapa_dosa.png",
    ingredients: [
      { nameKey: "ing_minapa_dosa_with_tomato_chutney_grains", groupId: "grains" },
      { nameKey: "ing_minapa_dosa_with_tomato_chutney_pulses", groupId: "pulses" },
      { nameKey: "ing_minapa_dosa_with_tomato_chutney_otherVeg", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_bf_5",
    nameKey: "dish_pongal",
    category: "breakfast",
    imageUrl: "/images/meals/pongal.png",
    ingredients: [
      { nameKey: "ing_pongal_grains", groupId: "grains" },
      { nameKey: "ing_pongal_pulses", groupId: "pulses" },
    ],
  },
  {
    id: "meal_bf_6",
    nameKey: "dish_puri_with_potato_curry",
    category: "breakfast",
    imageUrl: "/images/meals/puri_potato_curry.png",
    ingredients: [
      { nameKey: "ing_puri_with_potato_curry_grains", groupId: "grains" },
      { nameKey: "ing_puri_with_potato_curry_otherVeg", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_bf_7",
    nameKey: "dish_ragi_sangati_with_groundnut_chutney",
    category: "breakfast",
    imageUrl: "/images/meals/ragi_sangati_chutney.png",
    ingredients: [
      { nameKey: "ing_ragi_sangati_with_groundnut_chutney_grains", groupId: "grains" },
      { nameKey: "ing_ragi_sangati_with_groundnut_chutney_nuts", groupId: "nuts" },
    ],
  },
  {
    id: "meal_bf_8",
    nameKey: "dish_atukulu_with_roasted_chana",
    category: "breakfast",
    imageUrl: "/images/meals/atukulu_chana.png",
    ingredients: [
      { nameKey: "ing_atukulu_with_roasted_chana_grains", groupId: "grains" },
      { nameKey: "ing_atukulu_with_roasted_chana_pulses", groupId: "pulses" },
    ],
  },
  {
    id: "meal_bf_9",
    nameKey: "dish_punugulu_with_coconut_chutney",
    category: "breakfast",
    imageUrl: "/images/meals/punugulu_coconut.png",
    ingredients: [
      { nameKey: "ing_punugulu_with_coconut_chutney_grains", groupId: "grains" },
      { nameKey: "ing_punugulu_with_coconut_chutney_otherFruit", groupId: "otherFruit" },
    ],
  },
  {
    id: "meal_bf_10",
    nameKey: "dish_dibba_rotti",
    category: "breakfast",
    imageUrl: "/images/meals/dibba_rotti.png",
    ingredients: [
      { nameKey: "ing_dibba_rotti_grains", groupId: "grains" },
      { nameKey: "ing_dibba_rotti_pulses", groupId: "pulses" },
    ],
  },
  {
    id: "meal_ln_1",
    nameKey: "dish_rice_with_gongura_pachadi_and_dal",
    category: "lunch",
    imageUrl: "/images/meals/dal_rice.png",
    ingredients: [
      { nameKey: "ing_rice_with_gongura_pachadi_and_dal_grains", groupId: "grains" },
      { nameKey: "ing_rice_with_gongura_pachadi_and_dal_dglv", groupId: "dglv" },
      { nameKey: "ing_rice_with_gongura_pachadi_and_dal_pulses", groupId: "pulses" },
    ],
  },
  {
    id: "meal_ln_2",
    nameKey: "dish_rice_with_gutti_vankaya_kura",
    category: "lunch",
    imageUrl: "/images/meals/rice_gutti_vankaya.png",
    ingredients: [
      { nameKey: "ing_rice_with_gutti_vankaya_kura_grains", groupId: "grains" },
      { nameKey: "ing_rice_with_gutti_vankaya_kura_otherVeg", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_ln_3",
    nameKey: "dish_andhra_chicken_curry_with_rice",
    category: "lunch",
    imageUrl: "/images/meals/chicken_curry_rice.png",
    ingredients: [
      { nameKey: "ing_andhra_chicken_curry_with_rice_meat", groupId: "meat" },
      { nameKey: "ing_andhra_chicken_curry_with_rice_grains", groupId: "grains" },
    ],
  },
  {
    id: "meal_ln_4",
    nameKey: "dish_rice_with_sambar_and_cabbage_poriyal",
    category: "lunch",
    imageUrl: "/images/meals/rice_sambar.png",
    ingredients: [
      { nameKey: "ing_rice_with_sambar_and_cabbage_poriyal_grains", groupId: "grains" },
      { nameKey: "ing_rice_with_sambar_and_cabbage_poriyal_pulses", groupId: "pulses" },
      { nameKey: "ing_rice_with_sambar_and_cabbage_poriyal_otherVeg", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_ln_5",
    nameKey: "dish_pappu_charu_with_rice_and_omelette",
    category: "lunch",
    imageUrl: "/images/meals/egg_curry.png",
    ingredients: [
      { nameKey: "ing_pappu_charu_with_rice_and_omelette_grains", groupId: "grains" },
      { nameKey: "ing_pappu_charu_with_rice_and_omelette_pulses", groupId: "pulses" },
      { nameKey: "ing_pappu_charu_with_rice_and_omelette_eggs", groupId: "eggs" },
    ],
  },
  {
    id: "meal_ln_6",
    nameKey: "dish_lemon_rice_with_curd",
    category: "lunch",
    imageUrl: "/images/meals/lemon_rice.png",
    ingredients: [
      { nameKey: "ing_lemon_rice_with_curd_grains", groupId: "grains" },
      { nameKey: "ing_lemon_rice_with_curd_dairy", groupId: "dairy" },
    ],
  },
  {
    id: "meal_ln_7",
    nameKey: "dish_rice_with_royyala_iguru",
    category: "lunch",
    imageUrl: "/images/meals/fish_curry.png",
    ingredients: [
      { nameKey: "ing_rice_with_royyala_iguru_grains", groupId: "grains" },
      { nameKey: "ing_rice_with_royyala_iguru_meat", groupId: "meat" },
    ],
  },
  {
    id: "meal_ln_8",
    nameKey: "dish_ragi_mudde_with_natu_kodi_pulusu",
    category: "lunch",
    imageUrl: "/images/meals/chicken_curry.png",
    ingredients: [
      { nameKey: "ing_ragi_mudde_with_natu_kodi_pulusu_grains", groupId: "grains" },
      { nameKey: "ing_ragi_mudde_with_natu_kodi_pulusu_meat", groupId: "meat" },
    ],
  },
  {
    id: "meal_ln_9",
    nameKey: "dish_tomato_pappu_with_rice",
    category: "lunch",
    imageUrl: "/images/meals/tomato_pappu.png",
    ingredients: [
      { nameKey: "ing_tomato_pappu_with_rice_grains", groupId: "grains" },
      { nameKey: "ing_tomato_pappu_with_rice_pulses", groupId: "pulses" },
      { nameKey: "ing_tomato_pappu_with_rice_otherVeg", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_ln_10",
    nameKey: "dish_rice_with_palakura_pappu",
    category: "lunch",
    imageUrl: "/images/meals/palak_paneer.png",
    ingredients: [
      { nameKey: "ing_rice_with_palakura_pappu_grains", groupId: "grains" },
      { nameKey: "ing_rice_with_palakura_pappu_dglv", groupId: "dglv" },
      { nameKey: "ing_rice_with_palakura_pappu_pulses", groupId: "pulses" },
    ],
  },
  {
    id: "meal_sn_1",
    nameKey: "dish_mirchi_bajji",
    category: "snack",
    imageUrl: "/images/meals/mirchi_bajji.png",
    ingredients: [
      { nameKey: "ing_mirchi_bajji_otherVeg", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_sn_2",
    nameKey: "dish_bobbatlu",
    category: "snack",
    imageUrl: "/images/meals/bobbatlu.png",
    ingredients: [
      { nameKey: "ing_bobbatlu_grains", groupId: "grains" },
      { nameKey: "ing_bobbatlu_pulses", groupId: "pulses" },
    ],
  },
  {
    id: "meal_sn_3",
    nameKey: "dish_roasted_peanuts_and_jaggery",
    category: "snack",
    imageUrl: "/images/meals/andhra_snack_mirchi_1782419653366.png",
    ingredients: [
      { nameKey: "ing_roasted_peanuts_and_jaggery_nuts", groupId: "nuts" },
    ],
  },
  {
    id: "meal_sn_4",
    nameKey: "dish_boiled_sweet_potato",
    category: "snack",
    imageUrl: "/images/meals/aloo_paratha.png",
    ingredients: [
      { nameKey: "ing_boiled_sweet_potato_vitaminA", groupId: "vitaminA" },
    ],
  },
  {
    id: "meal_sn_5",
    nameKey: "dish_ariselu",
    category: "snack",
    imageUrl: "/images/meals/andhra_dinner_chapati_1782419671015.png",
    ingredients: [
      { nameKey: "ing_ariselu_grains", groupId: "grains" },
      { nameKey: "ing_ariselu_nuts", groupId: "nuts" },
    ],
  },
  {
    id: "meal_sn_6",
    nameKey: "dish_cut_fruits",
    category: "snack",
    imageUrl: "/images/meals/andhra_breakfast_idli_1782419612636.png",
    ingredients: [
      { nameKey: "ing_cut_fruits_vitaminA", groupId: "vitaminA" },
      { nameKey: "ing_cut_fruits_otherFruit", groupId: "otherFruit" },
    ],
  },
  {
    id: "meal_sn_7",
    nameKey: "dish_murukulu",
    category: "snack",
    imageUrl: "/images/meals/andhra_snack_mirchi_1782419653366.png",
    ingredients: [
      { nameKey: "ing_murukulu_grains", groupId: "grains" },
      { nameKey: "ing_murukulu_pulses", groupId: "pulses" },
    ],
  },
  {
    id: "meal_sn_8",
    nameKey: "dish_ragi_biscuits_with_milk",
    category: "snack",
    imageUrl: "/images/meals/andhra_snack_mirchi_1782419653366.png",
    ingredients: [
      { nameKey: "ing_ragi_biscuits_with_milk_grains", groupId: "grains" },
      { nameKey: "ing_ragi_biscuits_with_milk_dairy", groupId: "dairy" },
    ],
  },
  {
    id: "meal_sn_9",
    nameKey: "dish_sundal",
    category: "snack",
    imageUrl: "/images/meals/andhra_snack_mirchi_1782419653366.png",
    ingredients: [
      { nameKey: "ing_sundal_pulses", groupId: "pulses" },
    ],
  },
  {
    id: "meal_sn_10",
    nameKey: "dish_masala_vada",
    category: "snack",
    imageUrl: "/images/meals/andhra_snack_mirchi_1782419653366.png",
    ingredients: [
      { nameKey: "ing_masala_vada_pulses", groupId: "pulses" },
    ],
  },
  {
    id: "meal_dn_1",
    nameKey: "dish_chapati_with_paneer_butter_masala",
    category: "dinner",
    imageUrl: "/images/meals/palak_paneer.png",
    ingredients: [
      { nameKey: "ing_chapati_with_paneer_butter_masala_grains", groupId: "grains" },
      { nameKey: "ing_chapati_with_paneer_butter_masala_dairy", groupId: "dairy" },
      { nameKey: "ing_chapati_with_paneer_butter_masala_otherVeg", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_dn_2",
    nameKey: "dish_rice_with_rasam_and_potato_fry",
    category: "dinner",
    imageUrl: "/images/meals/dal_rice.png",
    ingredients: [
      { nameKey: "ing_rice_with_rasam_and_potato_fry_grains", groupId: "grains" },
      { nameKey: "ing_rice_with_rasam_and_potato_fry_otherVeg", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_dn_3",
    nameKey: "dish_jowar_roti_with_brinjal_curry",
    category: "dinner",
    imageUrl: "/images/meals/roti_sabzi.png",
    ingredients: [
      { nameKey: "ing_jowar_roti_with_brinjal_curry_grains", groupId: "grains" },
      { nameKey: "ing_jowar_roti_with_brinjal_curry_otherVeg", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_dn_4",
    nameKey: "dish_rice_with_mutton_kheema",
    category: "dinner",
    imageUrl: "/images/meals/chicken_curry.png",
    ingredients: [
      { nameKey: "ing_rice_with_mutton_kheema_grains", groupId: "grains" },
      { nameKey: "ing_rice_with_mutton_kheema_meat", groupId: "meat" },
    ],
  },
  {
    id: "meal_dn_5",
    nameKey: "dish_dosa_with_chicken_stew",
    category: "dinner",
    imageUrl: "/images/meals/masala_dosa.png",
    ingredients: [
      { nameKey: "ing_dosa_with_chicken_stew_grains", groupId: "grains" },
      { nameKey: "ing_dosa_with_chicken_stew_pulses", groupId: "pulses" },
      { nameKey: "ing_dosa_with_chicken_stew_meat", groupId: "meat" },
    ],
  },
  {
    id: "meal_dn_6",
    nameKey: "dish_rice_with_sorakaya_pappu",
    category: "dinner",
    imageUrl: "/images/meals/dal_rice.png",
    ingredients: [
      { nameKey: "ing_rice_with_sorakaya_pappu_grains", groupId: "grains" },
      { nameKey: "ing_rice_with_sorakaya_pappu_otherVeg", groupId: "otherVeg" },
      { nameKey: "ing_rice_with_sorakaya_pappu_pulses", groupId: "pulses" },
    ],
  },
  {
    id: "meal_dn_7",
    nameKey: "dish_upma_with_curd",
    category: "dinner",
    imageUrl: "/images/meals/upma.png",
    ingredients: [
      { nameKey: "ing_upma_with_curd_grains", groupId: "grains" },
      { nameKey: "ing_upma_with_curd_dairy", groupId: "dairy" },
    ],
  },
  {
    id: "meal_dn_8",
    nameKey: "dish_rice_with_bendakaya_fry",
    category: "dinner",
    imageUrl: "/images/meals/bhindi_masala.png",
    ingredients: [
      { nameKey: "ing_rice_with_bendakaya_fry_grains", groupId: "grains" },
      { nameKey: "ing_rice_with_bendakaya_fry_otherVeg", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_dn_9",
    nameKey: "dish_chapati_with_egg_bhurji",
    category: "dinner",
    imageUrl: "/images/meals/egg_curry.png",
    ingredients: [
      { nameKey: "ing_chapati_with_egg_bhurji_grains", groupId: "grains" },
      { nameKey: "ing_chapati_with_egg_bhurji_eggs", groupId: "eggs" },
      { nameKey: "ing_chapati_with_egg_bhurji_otherVeg", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_dn_10",
    nameKey: "dish_rice_with_dosakaya_pachadi",
    category: "dinner",
    imageUrl: "/images/meals/dal_rice.png",
    ingredients: [
      { nameKey: "ing_rice_with_dosakaya_pachadi_grains", groupId: "grains" },
      { nameKey: "ing_rice_with_dosakaya_pachadi_otherVeg", groupId: "otherVeg" },
    ],
  },
];
