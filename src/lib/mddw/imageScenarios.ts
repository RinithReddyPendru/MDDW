import type { FoodGroupId } from "./foodGroups";

export type ImageScenarioData = {
  id: string;
  imagePath: string;
  dishNameKey: string;
  correctGroups: FoodGroupId[];
  mealType: "breakfast" | "lunch" | "snack" | "dinner";
};

export const IMAGE_SCENARIOS: ImageScenarioData[] = [
  { id: "img_bf_1", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_idli_with_peanut_chutney", correctGroups: ["grains", "nuts"], mealType: "breakfast" },
  { id: "img_bf_2", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_pesarattu_with_upma", correctGroups: ["pulses", "grains"], mealType: "breakfast" },
  { id: "img_bf_3", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_uggani_with_bajji", correctGroups: ["grains", "otherVeg"], mealType: "breakfast" },
  { id: "img_bf_4", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_minapa_dosa_with_tomato_chutney", correctGroups: ["grains", "pulses", "otherVeg"], mealType: "breakfast" },
  { id: "img_bf_5", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_pongal", correctGroups: ["grains", "pulses"], mealType: "breakfast" },
  { id: "img_bf_6", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_puri_with_potato_curry", correctGroups: ["grains", "otherVeg"], mealType: "breakfast" },
  { id: "img_bf_7", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_ragi_sangati_with_groundnut_chutney", correctGroups: ["grains", "nuts"], mealType: "breakfast" },
  { id: "img_bf_8", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_atukulu_poha_with_roasted_chana", correctGroups: ["grains", "pulses"], mealType: "breakfast" },
  { id: "img_bf_9", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_punugulu_with_coconut_chutney", correctGroups: ["grains", "otherFruit"], mealType: "breakfast" },
  { id: "img_bf_10", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_dibba_rotti", correctGroups: ["grains", "pulses"], mealType: "breakfast" },
  { id: "img_ln_1", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_rice_with_gongura_pachadi_and_dal", correctGroups: ["grains", "dglv", "pulses"], mealType: "lunch" },
  { id: "img_ln_2", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_rice_with_gutti_vankaya_kura", correctGroups: ["grains", "otherVeg"], mealType: "lunch" },
  { id: "img_ln_3", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_andhra_chicken_curry_with_rice", correctGroups: ["meat", "grains"], mealType: "lunch" },
  { id: "img_ln_4", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_rice_with_sambar_and_cabbage_poriyal", correctGroups: ["grains", "pulses", "otherVeg"], mealType: "lunch" },
  { id: "img_ln_5", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_pappu_charu_with_rice_and_omelette", correctGroups: ["grains", "pulses", "eggs"], mealType: "lunch" },
  { id: "img_ln_6", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_lemon_rice_with_curd", correctGroups: ["grains", "dairy"], mealType: "lunch" },
  { id: "img_ln_7", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_rice_with_royyala_iguru", correctGroups: ["grains", "meat"], mealType: "lunch" },
  { id: "img_ln_8", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_ragi_mudde_with_natu_kodi_pulusu", correctGroups: ["grains", "meat"], mealType: "lunch" },
  { id: "img_ln_9", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_tomato_pappu_with_rice", correctGroups: ["grains", "pulses", "otherVeg"], mealType: "lunch" },
  { id: "img_ln_10", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_rice_with_palakura_pappu", correctGroups: ["grains", "dglv", "pulses"], mealType: "lunch" },
  { id: "img_sn_1", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_mirchi_bajji", correctGroups: ["otherVeg"], mealType: "snack" },
  { id: "img_sn_2", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_bobbatlu", correctGroups: ["grains", "pulses"], mealType: "snack" },
  { id: "img_sn_3", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_roasted_peanuts_and_jaggery", correctGroups: ["nuts"], mealType: "snack" },
  { id: "img_sn_4", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_boiled_sweet_potato", correctGroups: ["vitaminA"], mealType: "snack" },
  { id: "img_sn_5", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_ariselu", correctGroups: ["grains", "nuts"], mealType: "snack" },
  { id: "img_sn_6", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_cut_fruits", correctGroups: ["vitaminA", "otherFruit"], mealType: "snack" },
  { id: "img_sn_7", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_murukulu", correctGroups: ["grains", "pulses"], mealType: "snack" },
  { id: "img_sn_8", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_ragi_biscuits_with_milk", correctGroups: ["grains", "dairy"], mealType: "snack" },
  { id: "img_sn_9", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_sundal", correctGroups: ["pulses"], mealType: "snack" },
  { id: "img_sn_10", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_masala_vada", correctGroups: ["pulses"], mealType: "snack" },
  { id: "img_dn_1", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_chapati_with_paneer_butter_masala", correctGroups: ["grains", "dairy", "otherVeg"], mealType: "dinner" },
  { id: "img_dn_2", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_rice_with_rasam_and_potato_fry", correctGroups: ["grains", "otherVeg"], mealType: "dinner" },
  { id: "img_dn_3", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_jowar_roti_with_brinjal_curry", correctGroups: ["grains", "otherVeg"], mealType: "dinner" },
  { id: "img_dn_4", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_rice_with_mutton_kheema", correctGroups: ["grains", "meat"], mealType: "dinner" },
  { id: "img_dn_5", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_dosa_with_chicken_stew", correctGroups: ["grains", "pulses", "meat"], mealType: "dinner" },
  { id: "img_dn_6", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_rice_with_sorakaya_pappu", correctGroups: ["grains", "otherVeg", "pulses"], mealType: "dinner" },
  { id: "img_dn_7", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_upma_with_curd", correctGroups: ["grains", "dairy"], mealType: "dinner" },
  { id: "img_dn_8", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_rice_with_bendakaya_fry", correctGroups: ["grains", "otherVeg"], mealType: "dinner" },
  { id: "img_dn_9", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_chapati_with_egg_bhurji", correctGroups: ["grains", "eggs", "otherVeg"], mealType: "dinner" },
  { id: "img_dn_10", imagePath: "/assets/images/placeholder_dish.png", dishNameKey: "dish_rice_with_dosakaya_pachadi", correctGroups: ["grains", "otherVeg"], mealType: "dinner" },
];
