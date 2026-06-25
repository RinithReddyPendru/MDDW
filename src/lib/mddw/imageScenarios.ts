
import type { FoodGroupId } from "./foodGroups";

export type ImageScenarioData = {
  id: string;
  imagePath: string;
  dishNameKey: string;
  correctGroups: FoodGroupId[];
};

export const IMAGE_SCENARIOS: ImageScenarioData[] = [
  { id: "img_1", imagePath: "/assets/images/aloo_paratha.png", dishNameKey: "Aloo Paratha", correctGroups: ["grains", "otherVeg"] },
  { id: "img_2", imagePath: "/assets/images/bhindi_masala.png", dishNameKey: "Bhindi Masala with Roti", correctGroups: ["grains", "otherVeg"] },
  { id: "img_3", imagePath: "/assets/images/chicken_curry.png", dishNameKey: "Chicken Curry with Rice", correctGroups: ["grains", "meat"] },
  { id: "img_4", imagePath: "/assets/images/dal_rice.png", dishNameKey: "Dal Rice", correctGroups: ["grains", "pulses"] },
  { id: "img_5", imagePath: "/assets/images/egg_curry.png", dishNameKey: "Egg Curry with Roti", correctGroups: ["grains", "eggs"] },
  { id: "img_6", imagePath: "/assets/images/idli_sambar.png", dishNameKey: "Idli Sambar", correctGroups: ["grains", "pulses", "otherVeg"] },
  { id: "img_7", imagePath: "/assets/images/khichdi.png", dishNameKey: "Khichdi", correctGroups: ["grains", "pulses"] },
  { id: "img_8", imagePath: "/assets/images/palak_paneer.png", dishNameKey: "Palak Paneer with Roti", correctGroups: ["grains", "dglv", "dairy"] },
  { id: "img_9", imagePath: "/assets/images/rajma_chawal.png", dishNameKey: "Rajma Chawal", correctGroups: ["grains", "pulses"] },
  { id: "img_10", imagePath: "/assets/images/veg_biryani.png", dishNameKey: "Veg Biryani", correctGroups: ["grains", "otherVeg", "vitaminA"] },
];
