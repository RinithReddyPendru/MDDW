import type { FoodGroupId } from "./foodGroups";

export type ImageScenarioData = {
  id: string;
  imagePath: string;
  dishNameKey: string;
  correctGroups: FoodGroupId[];
  mealType: "breakfast" | "lunch" | "snack" | "dinner";
};

export const IMAGE_SCENARIOS: ImageScenarioData[] = [
  { id: "img_single_1", imagePath: "/images/foods/food_boiled_egg.png", dishNameKey: "Boiled Egg", correctGroups: ["eggs"], mealType: "snack" },
  { id: "img_single_2", imagePath: "/images/foods/food_rice.png", dishNameKey: "Rice", correctGroups: ["grains"], mealType: "lunch" },
  { id: "img_single_3", imagePath: "/images/foods/food_milk.png", dishNameKey: "Glass of Milk", correctGroups: ["dairy"], mealType: "breakfast" },
  { id: "img_single_4", imagePath: "/images/foods/food_palak.png", dishNameKey: "Palak (Spinach)", correctGroups: ["dglv"], mealType: "dinner" },
  { id: "img_single_5", imagePath: "/images/foods/food_walnut.png", dishNameKey: "Walnuts", correctGroups: ["nuts"], mealType: "snack" },
  { id: "img_single_6", imagePath: "/images/foods/food_chapati.png", dishNameKey: "Chapati / Roti", correctGroups: ["grains"], mealType: "lunch" },
  { id: "img_single_7", imagePath: "/images/foods/food_omelette.png", dishNameKey: "Omelette", correctGroups: ["eggs"], mealType: "breakfast" },
  { id: "img_single_8", imagePath: "/images/foods/food_pomegranate.png", dishNameKey: "Pomegranate", correctGroups: ["otherFruit"], mealType: "snack" }
];
