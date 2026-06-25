import type { FoodGroupId } from "./foodGroups";

export type ProbingOption = {
  text: string;
  isCorrect: boolean;
  feedback?: string;
  discoveredGroups?: { id: FoodGroupId; name: string; emoji: string }[];
  nextStepId?: string;
};

export type ProbingStep = {
  id: string;
  motherText: string;
  options: ProbingOption[];
};

export type ProbingScenarioData = {
  scenarioId: string;
  motherName: string;
  avatarIcon: string;
  initialDiscovered: { id: FoodGroupId; name: string; emoji: string }[];
  steps: Record<string, ProbingStep>;
  firstStepId: string;
  finalLesson: string;
};

export const PROBING_SCENARIOS: Record<string, ProbingScenarioData> = {
  "scenario_a": {
    scenarioId: "scenario_a",
    motherName: "Sujatha",
    avatarIcon: "👩🏽",
    initialDiscovered: [
      { id: "grains", name: "Grains", emoji: "🌾" },
      { id: "pulses", name: "Pulses", emoji: "🫘" },
    ],
    firstStepId: "step1",
    steps: {
      "step1": {
        id: "step1",
        motherText: '"Nothing special today. Just rice and pappu (dal)."',
        options: [
          { text: "Okay, rice and dal. Done.", isCorrect: false, feedback: "Too quick! You may have missed foods. Try asking more." },
          { text: "What did you drink with your meals?", isCorrect: true, nextStepId: "step2" },
          { text: "Did you eat anything in between?", isCorrect: false, feedback: "Good question, but usually it's best to ask about drinks with meals first as they are easily forgotten." }
        ]
      },
      "step2": {
        id: "step2",
        motherText: '"Oh yes, I had tea with milk in the morning."',
        options: [
          { text: "That's enough.", isCorrect: false, feedback: "Too quick! Try asking more." },
          { text: "Any snacks in the afternoon?", isCorrect: true, discoveredGroups: [{ id: "dairy", name: "Dairy", emoji: "🥛" }], nextStepId: "step3" }
        ]
      },
      "step3": {
        id: "step3",
        motherText: '"I ate some groundnuts and a little spinach from yesterday."',
        options: [
          { text: "Okay, thank you! I'll record that.", isCorrect: true, discoveredGroups: [
            { id: "nuts", name: "Nuts", emoji: "🥜" },
            { id: "dglv", name: "Greens", emoji: "🌿" }
          ] }
        ]
      }
    },
    finalLesson: "You found 5 food groups by asking well! If you had stopped at 'rice and dal,' you would have recorded only 2. Good probing found 5."
  },
  "scenario_b": {
    scenarioId: "scenario_b",
    motherName: "Kamala",
    avatarIcon: "🧕🏽",
    initialDiscovered: [
      { id: "eggs", name: "Eggs", emoji: "🥚" }
    ],
    firstStepId: "step1",
    steps: {
      "step1": {
        id: "step1",
        motherText: '"I only ate an egg today."',
        options: [
          { text: "Okay, I will record 1 group.", isCorrect: false, feedback: "Too quick! It's rare for someone to only eat one egg all day. Ask about staples." },
          { text: "Are you sure? Did you have tea or milk?", isCorrect: true, nextStepId: "step2" }
        ]
      },
      "step2": {
        id: "step2",
        motherText: '"Yes, I had tea with milk in the morning."',
        options: [
          { text: "What about rice or roti?", isCorrect: true, discoveredGroups: [{ id: "dairy", name: "Dairy", emoji: "🥛" }], nextStepId: "step3" }
        ]
      },
      "step3": {
        id: "step3",
        motherText: '"Ah yes, I had 2 rotis with the egg."',
        options: [
          { text: "Great, thank you for sharing!", isCorrect: true, discoveredGroups: [{ id: "grains", name: "Grains", emoji: "🌾" }] }
        ]
      }
    },
    finalLesson: "Excellent! By asking follow-up questions, you discovered Kamala had milk and roti, pushing her closer to a diverse diet."
  }
};
