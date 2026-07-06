import type { FoodGroupId } from "./foodGroups";

export type ImageScenarioData = {
  id: string;
  imagePath: string;
  dishNameKey: string;
  correctGroups: FoodGroupId[];
  mealType: "breakfast" | "lunch" | "snack" | "dinner";
};

export const IMAGE_SCENARIOS: ImageScenarioData[] = [
  { id: "img_simple_1", imagePath: "/images/meals/dal_rice.png", dishNameKey: "Pappu Rice (Dal & Rice)", correctGroups: ["grains", "pulses"], mealType: "lunch" },
  { id: "img_simple_2", imagePath: "/images/meals/tomato_pappu.png", dishNameKey: "Tomato Pappu with Rice", correctGroups: ["grains", "pulses", "otherVeg"], mealType: "lunch" },
  { id: "img_simple_3", imagePath: "/images/meals/chicken_curry_rice.png", dishNameKey: "Chicken Curry with Rice", correctGroups: ["grains", "meat"], mealType: "dinner" },
  { id: "img_simple_4", imagePath: "/images/meals/roti_sabzi.png", dishNameKey: "Roti with Sabzi", correctGroups: ["grains", "otherVeg"], mealType: "dinner" },
  { id: "img_simple_5", imagePath: "/images/meals/rice_gutti_vankaya.png", dishNameKey: "Rice with Gutti Vankaya", correctGroups: ["grains", "otherVeg"], mealType: "lunch" }
];
