import { MDDW_MEALS } from "./mealsData";
import type { FoodGroupId } from "./foodGroups";

export type ImageScenarioData = {
  id: string;
  imagePath: string;
  dishNameKey: string;
  correctGroups: FoodGroupId[];
  mealType: "breakfast" | "lunch" | "snack" | "dinner";
};

export const IMAGE_SCENARIOS: ImageScenarioData[] = MDDW_MEALS.map((meal, index) => ({
  id: `img_${meal.category}_${index}`,
  imagePath: meal.imageUrl,
  dishNameKey: meal.nameKey,
  correctGroups: meal.ingredients.map(ing => ing.groupId),
  mealType: meal.category
}));
