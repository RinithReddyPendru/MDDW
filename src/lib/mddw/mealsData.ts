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
    imageUrl: "/images/meals/andhra_breakfast_idli_1782419612636.png",
    ingredients: [
      { nameKey: "dish_idli_with_peanut_chutney", groupId: "grains" },
      { nameKey: "dish_idli_with_peanut_chutney", groupId: "nuts" },
    ],
  },
  {
    id: "meal_bf_2",
    nameKey: "dish_pesarattu_with_upma",
    category: "breakfast",
    imageUrl: "/images/meals/andhra_breakfast_idli_1782419612636.png",
    ingredients: [
      { nameKey: "dish_pesarattu_with_upma", groupId: "pulses" },
      { nameKey: "dish_pesarattu_with_upma", groupId: "grains" },
    ],
  },
  {
    id: "meal_bf_3",
    nameKey: "dish_uggani_with_bajji",
    category: "breakfast",
    imageUrl: "/images/meals/andhra_breakfast_idli_1782419612636.png",
    ingredients: [
      { nameKey: "dish_uggani_with_bajji", groupId: "grains" },
      { nameKey: "dish_uggani_with_bajji", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_bf_4",
    nameKey: "dish_minapa_dosa_with_tomato_chutney",
    category: "breakfast",
    imageUrl: "/images/meals/andhra_breakfast_idli_1782419612636.png",
    ingredients: [
      { nameKey: "dish_minapa_dosa_with_tomato_chutney", groupId: "grains" },
      { nameKey: "dish_minapa_dosa_with_tomato_chutney", groupId: "pulses" },
      { nameKey: "dish_minapa_dosa_with_tomato_chutney", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_bf_5",
    nameKey: "dish_pongal",
    category: "breakfast",
    imageUrl: "/images/meals/andhra_breakfast_idli_1782419612636.png",
    ingredients: [
      { nameKey: "dish_pongal", groupId: "grains" },
      { nameKey: "dish_pongal", groupId: "pulses" },
    ],
  },
  {
    id: "meal_bf_6",
    nameKey: "dish_puri_with_potato_curry",
    category: "breakfast",
    imageUrl: "/images/meals/andhra_breakfast_idli_1782419612636.png",
    ingredients: [
      { nameKey: "dish_puri_with_potato_curry", groupId: "grains" },
      { nameKey: "dish_puri_with_potato_curry", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_bf_7",
    nameKey: "dish_ragi_sangati_with_groundnut_chutney",
    category: "breakfast",
    imageUrl: "/images/meals/andhra_breakfast_idli_1782419612636.png",
    ingredients: [
      { nameKey: "dish_ragi_sangati_with_groundnut_chutney", groupId: "grains" },
      { nameKey: "dish_ragi_sangati_with_groundnut_chutney", groupId: "nuts" },
    ],
  },
  {
    id: "meal_bf_8",
    nameKey: "dish_atukulu_with_roasted_chana",
    category: "breakfast",
    imageUrl: "/images/meals/andhra_breakfast_idli_1782419612636.png",
    ingredients: [
      { nameKey: "dish_atukulu_with_roasted_chana", groupId: "grains" },
      { nameKey: "dish_atukulu_with_roasted_chana", groupId: "pulses" },
    ],
  },
  {
    id: "meal_bf_9",
    nameKey: "dish_punugulu_with_coconut_chutney",
    category: "breakfast",
    imageUrl: "/images/meals/andhra_breakfast_idli_1782419612636.png",
    ingredients: [
      { nameKey: "dish_punugulu_with_coconut_chutney", groupId: "grains" },
      { nameKey: "dish_punugulu_with_coconut_chutney", groupId: "otherFruit" },
    ],
  },
  {
    id: "meal_bf_10",
    nameKey: "dish_dibba_rotti",
    category: "breakfast",
    imageUrl: "/images/meals/andhra_breakfast_idli_1782419612636.png",
    ingredients: [
      { nameKey: "dish_dibba_rotti", groupId: "grains" },
      { nameKey: "dish_dibba_rotti", groupId: "pulses" },
    ],
  },
  {
    id: "meal_ln_1",
    nameKey: "dish_rice_with_gongura_pachadi_and_dal",
    category: "lunch",
    imageUrl: "/images/meals/andhra_lunch_chicken_1782419632465.png",
    ingredients: [
      { nameKey: "dish_rice_with_gongura_pachadi_and_dal", groupId: "grains" },
      { nameKey: "dish_rice_with_gongura_pachadi_and_dal", groupId: "dglv" },
      { nameKey: "dish_rice_with_gongura_pachadi_and_dal", groupId: "pulses" },
    ],
  },
  {
    id: "meal_ln_2",
    nameKey: "dish_rice_with_gutti_vankaya_kura",
    category: "lunch",
    imageUrl: "/images/meals/andhra_lunch_chicken_1782419632465.png",
    ingredients: [
      { nameKey: "dish_rice_with_gutti_vankaya_kura", groupId: "grains" },
      { nameKey: "dish_rice_with_gutti_vankaya_kura", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_ln_3",
    nameKey: "dish_andhra_chicken_curry_with_rice",
    category: "lunch",
    imageUrl: "/images/meals/andhra_lunch_chicken_1782419632465.png",
    ingredients: [
      { nameKey: "dish_andhra_chicken_curry_with_rice", groupId: "meat" },
      { nameKey: "dish_andhra_chicken_curry_with_rice", groupId: "grains" },
    ],
  },
  {
    id: "meal_ln_4",
    nameKey: "dish_rice_with_sambar_and_cabbage_poriyal",
    category: "lunch",
    imageUrl: "/images/meals/andhra_lunch_chicken_1782419632465.png",
    ingredients: [
      { nameKey: "dish_rice_with_sambar_and_cabbage_poriyal", groupId: "grains" },
      { nameKey: "dish_rice_with_sambar_and_cabbage_poriyal", groupId: "pulses" },
      { nameKey: "dish_rice_with_sambar_and_cabbage_poriyal", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_ln_5",
    nameKey: "dish_pappu_charu_with_rice_and_omelette",
    category: "lunch",
    imageUrl: "/images/meals/andhra_lunch_chicken_1782419632465.png",
    ingredients: [
      { nameKey: "dish_pappu_charu_with_rice_and_omelette", groupId: "grains" },
      { nameKey: "dish_pappu_charu_with_rice_and_omelette", groupId: "pulses" },
      { nameKey: "dish_pappu_charu_with_rice_and_omelette", groupId: "eggs" },
    ],
  },
  {
    id: "meal_ln_6",
    nameKey: "dish_lemon_rice_with_curd",
    category: "lunch",
    imageUrl: "/images/meals/andhra_lunch_chicken_1782419632465.png",
    ingredients: [
      { nameKey: "dish_lemon_rice_with_curd", groupId: "grains" },
      { nameKey: "dish_lemon_rice_with_curd", groupId: "dairy" },
    ],
  },
  {
    id: "meal_ln_7",
    nameKey: "dish_rice_with_royyala_iguru",
    category: "lunch",
    imageUrl: "/images/meals/andhra_lunch_chicken_1782419632465.png",
    ingredients: [
      { nameKey: "dish_rice_with_royyala_iguru", groupId: "grains" },
      { nameKey: "dish_rice_with_royyala_iguru", groupId: "meat" },
    ],
  },
  {
    id: "meal_ln_8",
    nameKey: "dish_ragi_mudde_with_natu_kodi_pulusu",
    category: "lunch",
    imageUrl: "/images/meals/andhra_lunch_chicken_1782419632465.png",
    ingredients: [
      { nameKey: "dish_ragi_mudde_with_natu_kodi_pulusu", groupId: "grains" },
      { nameKey: "dish_ragi_mudde_with_natu_kodi_pulusu", groupId: "meat" },
    ],
  },
  {
    id: "meal_ln_9",
    nameKey: "dish_tomato_pappu_with_rice",
    category: "lunch",
    imageUrl: "/images/meals/andhra_lunch_chicken_1782419632465.png",
    ingredients: [
      { nameKey: "dish_tomato_pappu_with_rice", groupId: "grains" },
      { nameKey: "dish_tomato_pappu_with_rice", groupId: "pulses" },
      { nameKey: "dish_tomato_pappu_with_rice", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_ln_10",
    nameKey: "dish_rice_with_palakura_pappu",
    category: "lunch",
    imageUrl: "/images/meals/andhra_lunch_chicken_1782419632465.png",
    ingredients: [
      { nameKey: "dish_rice_with_palakura_pappu", groupId: "grains" },
      { nameKey: "dish_rice_with_palakura_pappu", groupId: "dglv" },
      { nameKey: "dish_rice_with_palakura_pappu", groupId: "pulses" },
    ],
  },
  {
    id: "meal_sn_1",
    nameKey: "dish_mirchi_bajji",
    category: "snack",
    imageUrl: "/images/meals/andhra_snack_mirchi_1782419653366.png",
    ingredients: [
      { nameKey: "dish_mirchi_bajji", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_sn_2",
    nameKey: "dish_bobbatlu",
    category: "snack",
    imageUrl: "/images/meals/andhra_snack_mirchi_1782419653366.png",
    ingredients: [
      { nameKey: "dish_bobbatlu", groupId: "grains" },
      { nameKey: "dish_bobbatlu", groupId: "pulses" },
    ],
  },
  {
    id: "meal_sn_3",
    nameKey: "dish_roasted_peanuts_and_jaggery",
    category: "snack",
    imageUrl: "/images/meals/andhra_snack_mirchi_1782419653366.png",
    ingredients: [
      { nameKey: "dish_roasted_peanuts_and_jaggery", groupId: "nuts" },
    ],
  },
  {
    id: "meal_sn_4",
    nameKey: "dish_boiled_sweet_potato",
    category: "snack",
    imageUrl: "/images/meals/andhra_snack_mirchi_1782419653366.png",
    ingredients: [
      { nameKey: "dish_boiled_sweet_potato", groupId: "vitaminA" },
    ],
  },
  {
    id: "meal_sn_5",
    nameKey: "dish_ariselu",
    category: "snack",
    imageUrl: "/images/meals/andhra_snack_mirchi_1782419653366.png",
    ingredients: [
      { nameKey: "dish_ariselu", groupId: "grains" },
      { nameKey: "dish_ariselu", groupId: "nuts" },
    ],
  },
  {
    id: "meal_sn_6",
    nameKey: "dish_cut_fruits",
    category: "snack",
    imageUrl: "/images/meals/andhra_snack_mirchi_1782419653366.png",
    ingredients: [
      { nameKey: "dish_cut_fruits", groupId: "vitaminA" },
      { nameKey: "dish_cut_fruits", groupId: "otherFruit" },
    ],
  },
  {
    id: "meal_sn_7",
    nameKey: "dish_murukulu",
    category: "snack",
    imageUrl: "/images/meals/andhra_snack_mirchi_1782419653366.png",
    ingredients: [
      { nameKey: "dish_murukulu", groupId: "grains" },
      { nameKey: "dish_murukulu", groupId: "pulses" },
    ],
  },
  {
    id: "meal_sn_8",
    nameKey: "dish_ragi_biscuits_with_milk",
    category: "snack",
    imageUrl: "/images/meals/andhra_snack_mirchi_1782419653366.png",
    ingredients: [
      { nameKey: "dish_ragi_biscuits_with_milk", groupId: "grains" },
      { nameKey: "dish_ragi_biscuits_with_milk", groupId: "dairy" },
    ],
  },
  {
    id: "meal_sn_9",
    nameKey: "dish_sundal",
    category: "snack",
    imageUrl: "/images/meals/andhra_snack_mirchi_1782419653366.png",
    ingredients: [
      { nameKey: "dish_sundal", groupId: "pulses" },
    ],
  },
  {
    id: "meal_sn_10",
    nameKey: "dish_masala_vada",
    category: "snack",
    imageUrl: "/images/meals/andhra_snack_mirchi_1782419653366.png",
    ingredients: [
      { nameKey: "dish_masala_vada", groupId: "pulses" },
    ],
  },
  {
    id: "meal_dn_1",
    nameKey: "dish_chapati_with_paneer_butter_masala",
    category: "dinner",
    imageUrl: "/images/meals/andhra_dinner_chapati_1782419671015.png",
    ingredients: [
      { nameKey: "dish_chapati_with_paneer_butter_masala", groupId: "grains" },
      { nameKey: "dish_chapati_with_paneer_butter_masala", groupId: "dairy" },
      { nameKey: "dish_chapati_with_paneer_butter_masala", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_dn_2",
    nameKey: "dish_rice_with_rasam_and_potato_fry",
    category: "dinner",
    imageUrl: "/images/meals/andhra_dinner_chapati_1782419671015.png",
    ingredients: [
      { nameKey: "dish_rice_with_rasam_and_potato_fry", groupId: "grains" },
      { nameKey: "dish_rice_with_rasam_and_potato_fry", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_dn_3",
    nameKey: "dish_jowar_roti_with_brinjal_curry",
    category: "dinner",
    imageUrl: "/images/meals/andhra_dinner_chapati_1782419671015.png",
    ingredients: [
      { nameKey: "dish_jowar_roti_with_brinjal_curry", groupId: "grains" },
      { nameKey: "dish_jowar_roti_with_brinjal_curry", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_dn_4",
    nameKey: "dish_rice_with_mutton_kheema",
    category: "dinner",
    imageUrl: "/images/meals/andhra_dinner_chapati_1782419671015.png",
    ingredients: [
      { nameKey: "dish_rice_with_mutton_kheema", groupId: "grains" },
      { nameKey: "dish_rice_with_mutton_kheema", groupId: "meat" },
    ],
  },
  {
    id: "meal_dn_5",
    nameKey: "dish_dosa_with_chicken_stew",
    category: "dinner",
    imageUrl: "/images/meals/andhra_dinner_chapati_1782419671015.png",
    ingredients: [
      { nameKey: "dish_dosa_with_chicken_stew", groupId: "grains" },
      { nameKey: "dish_dosa_with_chicken_stew", groupId: "pulses" },
      { nameKey: "dish_dosa_with_chicken_stew", groupId: "meat" },
    ],
  },
  {
    id: "meal_dn_6",
    nameKey: "dish_rice_with_sorakaya_pappu",
    category: "dinner",
    imageUrl: "/images/meals/andhra_dinner_chapati_1782419671015.png",
    ingredients: [
      { nameKey: "dish_rice_with_sorakaya_pappu", groupId: "grains" },
      { nameKey: "dish_rice_with_sorakaya_pappu", groupId: "otherVeg" },
      { nameKey: "dish_rice_with_sorakaya_pappu", groupId: "pulses" },
    ],
  },
  {
    id: "meal_dn_7",
    nameKey: "dish_upma_with_curd",
    category: "dinner",
    imageUrl: "/images/meals/andhra_dinner_chapati_1782419671015.png",
    ingredients: [
      { nameKey: "dish_upma_with_curd", groupId: "grains" },
      { nameKey: "dish_upma_with_curd", groupId: "dairy" },
    ],
  },
  {
    id: "meal_dn_8",
    nameKey: "dish_rice_with_bendakaya_fry",
    category: "dinner",
    imageUrl: "/images/meals/andhra_dinner_chapati_1782419671015.png",
    ingredients: [
      { nameKey: "dish_rice_with_bendakaya_fry", groupId: "grains" },
      { nameKey: "dish_rice_with_bendakaya_fry", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_dn_9",
    nameKey: "dish_chapati_with_egg_bhurji",
    category: "dinner",
    imageUrl: "/images/meals/andhra_dinner_chapati_1782419671015.png",
    ingredients: [
      { nameKey: "dish_chapati_with_egg_bhurji", groupId: "grains" },
      { nameKey: "dish_chapati_with_egg_bhurji", groupId: "eggs" },
      { nameKey: "dish_chapati_with_egg_bhurji", groupId: "otherVeg" },
    ],
  },
  {
    id: "meal_dn_10",
    nameKey: "dish_rice_with_dosakaya_pachadi",
    category: "dinner",
    imageUrl: "/images/meals/andhra_dinner_chapati_1782419671015.png",
    ingredients: [
      { nameKey: "dish_rice_with_dosakaya_pachadi", groupId: "grains" },
      { nameKey: "dish_rice_with_dosakaya_pachadi", groupId: "otherVeg" },
    ],
  },
];
