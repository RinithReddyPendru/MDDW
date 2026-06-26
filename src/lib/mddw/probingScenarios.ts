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
  "scenario_1": {
    scenarioId: "scenario_1",
    motherName: "Kamala",
    avatarIcon: "👩🏽",
    initialDiscovered: [
      { id: "grains", name: "Grains", emoji: "🌾" },
    ],
    firstStepId: "step1",
    steps: {
      "step1": {
        id: "step1",
        motherText: "scene1_step1_text",
        options: [
          { text: "scene1_step1_opt1", isCorrect: true, nextStepId: "step2" },
          { text: "scene1_step1_opt2", isCorrect: false, feedback: "scene1_step1_fb2" }
        ]
      },
      "step2": {
        id: "step2",
        motherText: "scene1_step2_text",
        options: [
          { text: "scene1_step2_opt1", isCorrect: true, nextStepId: "step3", discoveredGroups: [{ id: "nuts", name: "Nuts", emoji: "🥜" }] },
          { text: "scene1_step2_opt2", isCorrect: false, feedback: "scene1_step2_fb2" }
        ]
      },
      "step3": {
        id: "step3",
        motherText: "scene1_step3_text",
        options: [
          { text: "scene1_step3_opt1", isCorrect: true, nextStepId: "step4", discoveredGroups: [{ id: "vitaminA", name: "Vit-A Rich", emoji: "🥕" }, { id: "otherVeg", name: "Other Veg", emoji: "🍆" }] },
          { text: "scene1_step3_opt2", isCorrect: false, feedback: "scene1_step3_fb2" }
        ]
      },
      "step4": {
        id: "step4",
        motherText: "scene1_step4_text",
        options: [
          { text: "scene1_step4_opt1", isCorrect: true, nextStepId: "step5", discoveredGroups: [{ id: "dairy", name: "Dairy", emoji: "🥛" }] },
          { text: "scene1_step4_opt2", isCorrect: false, feedback: "scene1_step4_fb2" }
        ]
      },
      "step5": {
        id: "step5",
        motherText: "scene1_step5_text",
        options: [
          { text: "scene1_step5_opt1", isCorrect: true, discoveredGroups: [{ id: "otherFruit", name: "Other Fruits", emoji: "🍎" }] }
        ]
      },
    },
    finalLesson: "scene1_finalLesson"
  },
  "scenario_2": {
    scenarioId: "scenario_2",
    motherName: "Sujatha",
    avatarIcon: "👩🏽‍🦱",
    initialDiscovered: [
      { id: "grains", name: "Grains", emoji: "🌾" },
      { id: "pulses", name: "Pulses", emoji: "🥘" },
    ],
    firstStepId: "step1",
    steps: {
      "step1": {
        id: "step1",
        motherText: "scene2_step1_text",
        options: [
          { text: "scene2_step1_opt1", isCorrect: true, nextStepId: "step2" },
          { text: "scene2_step1_opt2", isCorrect: false, feedback: "scene2_step1_fb2" }
        ]
      },
      "step2": {
        id: "step2",
        motherText: "scene2_step2_text",
        options: [
          { text: "scene2_step2_opt1", isCorrect: true, nextStepId: "step3", discoveredGroups: [{ id: "meat", name: "Meat", emoji: "🥩" }] },
          { text: "scene2_step2_opt2", isCorrect: false, feedback: "scene2_step2_fb2" }
        ]
      },
      "step3": {
        id: "step3",
        motherText: "scene2_step3_text",
        options: [
          { text: "scene2_step3_opt1", isCorrect: true, nextStepId: "step4", discoveredGroups: [{ id: "otherVeg", name: "Other Veg", emoji: "🍆" }] },
          { text: "scene2_step3_opt2", isCorrect: false, feedback: "scene2_step3_fb2" }
        ]
      },
      "step4": {
        id: "step4",
        motherText: "scene2_step4_text",
        options: [
          { text: "scene2_step4_opt1", isCorrect: true, nextStepId: "step5", discoveredGroups: [{ id: "dairy", name: "Dairy", emoji: "🥛" }] },
          { text: "scene2_step4_opt2", isCorrect: false, feedback: "scene2_step4_fb2" }
        ]
      },
      "step5": {
        id: "step5",
        motherText: "scene2_step5_text",
        options: [
          { text: "scene2_step5_opt1", isCorrect: true, discoveredGroups: [{ id: "dglv", name: "Greens", emoji: "🥬" }] }
        ]
      },
    },
    finalLesson: "scene2_finalLesson"
  },
  "scenario_3": {
    scenarioId: "scenario_3",
    motherName: "Lakshmi",
    avatarIcon: "👩🏽‍🦰",
    initialDiscovered: [
      { id: "grains", name: "Grains", emoji: "🌾" },
      { id: "pulses", name: "Pulses", emoji: "🥘" },
    ],
    firstStepId: "step1",
    steps: {
      "step1": {
        id: "step1",
        motherText: "scene3_step1_text",
        options: [
          { text: "scene3_step1_opt1", isCorrect: true, nextStepId: "step2" },
          { text: "scene3_step1_opt2", isCorrect: false, feedback: "scene3_step1_fb2" }
        ]
      },
      "step2": {
        id: "step2",
        motherText: "scene3_step2_text",
        options: [
          { text: "scene3_step2_opt1", isCorrect: true, nextStepId: "step3", discoveredGroups: [{ id: "eggs", name: "Eggs", emoji: "🥚" }] },
          { text: "scene3_step2_opt2", isCorrect: false, feedback: "scene3_step2_fb2" }
        ]
      },
      "step3": {
        id: "step3",
        motherText: "scene3_step3_text",
        options: [
          { text: "scene3_step3_opt1", isCorrect: true, nextStepId: "step4", discoveredGroups: [{ id: "dglv", name: "Greens", emoji: "🥬" }] },
          { text: "scene3_step3_opt2", isCorrect: false, feedback: "scene3_step3_fb2" }
        ]
      },
      "step4": {
        id: "step4",
        motherText: "scene3_step4_text",
        options: [
          { text: "scene3_step4_opt1", isCorrect: true, nextStepId: "step5", discoveredGroups: [{ id: "otherVeg", name: "Other Veg", emoji: "🍆" }] },
          { text: "scene3_step4_opt2", isCorrect: false, feedback: "scene3_step4_fb2" }
        ]
      },
      "step5": {
        id: "step5",
        motherText: "scene3_step5_text",
        options: [
          { text: "scene3_step5_opt1", isCorrect: true, discoveredGroups: [{ id: "vitaminA", name: "Vit-A Rich", emoji: "🥕" }] }
        ]
      },
    },
    finalLesson: "scene3_finalLesson"
  },
  "scenario_4": {
    scenarioId: "scenario_4",
    motherName: "Radha",
    avatarIcon: "👩🏽",
    initialDiscovered: [
      { id: "grains", name: "Grains", emoji: "🌾" },
    ],
    firstStepId: "step1",
    steps: {
      "step1": {
        id: "step1",
        motherText: "scene4_step1_text",
        options: [
          { text: "scene4_step1_opt1", isCorrect: true, nextStepId: "step2" },
          { text: "scene4_step1_opt2", isCorrect: false, feedback: "scene4_step1_fb2" }
        ]
      },
      "step2": {
        id: "step2",
        motherText: "scene4_step2_text",
        options: [
          { text: "scene4_step2_opt1", isCorrect: true, nextStepId: "step3", discoveredGroups: [{ id: "otherVeg", name: "Other Veg", emoji: "🍆" }] },
          { text: "scene4_step2_opt2", isCorrect: false, feedback: "scene4_step2_fb2" }
        ]
      },
      "step3": {
        id: "step3",
        motherText: "scene4_step3_text",
        options: [
          { text: "scene4_step3_opt1", isCorrect: true, nextStepId: "step4", discoveredGroups: [{ id: "dairy", name: "Dairy", emoji: "🥛" }] },
          { text: "scene4_step3_opt2", isCorrect: false, feedback: "scene4_step3_fb2" }
        ]
      },
      "step4": {
        id: "step4",
        motherText: "scene4_step4_text",
        options: [
          { text: "scene4_step4_opt1", isCorrect: true, nextStepId: "step5", discoveredGroups: [{ id: "otherFruit", name: "Other Fruits", emoji: "🍎" }] },
          { text: "scene4_step4_opt2", isCorrect: false, feedback: "scene4_step4_fb2" }
        ]
      },
      "step5": {
        id: "step5",
        motherText: "scene4_step5_text",
        options: [
          { text: "scene4_step5_opt1", isCorrect: true, discoveredGroups: [{ id: "nuts", name: "Nuts", emoji: "🥜" }] }
        ]
      },
    },
    finalLesson: "scene4_finalLesson"
  },
  "scenario_5": {
    scenarioId: "scenario_5",
    motherName: "Anjali",
    avatarIcon: "👩🏽‍🦳",
    initialDiscovered: [
      { id: "grains", name: "Grains", emoji: "🌾" },
      { id: "pulses", name: "Pulses", emoji: "🥘" },
    ],
    firstStepId: "step1",
    steps: {
      "step1": {
        id: "step1",
        motherText: "scene5_step1_text",
        options: [
          { text: "scene5_step1_opt1", isCorrect: true, nextStepId: "step2" },
          { text: "scene5_step1_opt2", isCorrect: false, feedback: "scene5_step1_fb2" }
        ]
      },
      "step2": {
        id: "step2",
        motherText: "scene5_step2_text",
        options: [
          { text: "scene5_step2_opt1", isCorrect: true, nextStepId: "step3", discoveredGroups: [{ id: "vitaminA", name: "Vit-A Rich", emoji: "🥕" }] },
          { text: "scene5_step2_opt2", isCorrect: false, feedback: "scene5_step2_fb2" }
        ]
      },
      "step3": {
        id: "step3",
        motherText: "scene5_step3_text",
        options: [
          { text: "scene5_step3_opt1", isCorrect: true, nextStepId: "step4", discoveredGroups: [{ id: "otherVeg", name: "Other Veg", emoji: "🍆" }] },
          { text: "scene5_step3_opt2", isCorrect: false, feedback: "scene5_step3_fb2" }
        ]
      },
      "step4": {
        id: "step4",
        motherText: "scene5_step4_text",
        options: [
          { text: "scene5_step4_opt1", isCorrect: true, nextStepId: "step5", discoveredGroups: [{ id: "eggs", name: "Eggs", emoji: "🥚" }] },
          { text: "scene5_step4_opt2", isCorrect: false, feedback: "scene5_step4_fb2" }
        ]
      },
      "step5": {
        id: "step5",
        motherText: "scene5_step5_text",
        options: [
          { text: "scene5_step5_opt1", isCorrect: true, discoveredGroups: [{ id: "dairy", name: "Dairy", emoji: "🥛" }] }
        ]
      },
    },
    finalLesson: "scene5_finalLesson"
  },
  "scenario_6": {
    scenarioId: "scenario_6",
    motherName: "Meena",
    avatarIcon: "👩🏽‍🦱",
    initialDiscovered: [
      { id: "grains", name: "Grains", emoji: "🌾" },
      { id: "meat", name: "Meat", emoji: "🥩" },
    ],
    firstStepId: "step1",
    steps: {
      "step1": {
        id: "step1",
        motherText: "scene6_step1_text",
        options: [
          { text: "scene6_step1_opt1", isCorrect: true, nextStepId: "step2" },
          { text: "scene6_step1_opt2", isCorrect: false, feedback: "scene6_step1_fb2" }
        ]
      },
      "step2": {
        id: "step2",
        motherText: "scene6_step2_text",
        options: [
          { text: "scene6_step2_opt1", isCorrect: true, nextStepId: "step3", discoveredGroups: [{ id: "dairy", name: "Dairy", emoji: "🥛" }] },
          { text: "scene6_step2_opt2", isCorrect: false, feedback: "scene6_step2_fb2" }
        ]
      },
      "step3": {
        id: "step3",
        motherText: "scene6_step3_text",
        options: [
          { text: "scene6_step3_opt1", isCorrect: true, nextStepId: "step4", discoveredGroups: [{ id: "pulses", name: "Pulses", emoji: "🥘" }] },
          { text: "scene6_step3_opt2", isCorrect: false, feedback: "scene6_step3_fb2" }
        ]
      },
      "step4": {
        id: "step4",
        motherText: "scene6_step4_text",
        options: [
          { text: "scene6_step4_opt1", isCorrect: true, nextStepId: "step5", discoveredGroups: [{ id: "dglv", name: "Greens", emoji: "🥬" }] },
          { text: "scene6_step4_opt2", isCorrect: false, feedback: "scene6_step4_fb2" }
        ]
      },
      "step5": {
        id: "step5",
        motherText: "scene6_step5_text",
        options: [
          { text: "scene6_step5_opt1", isCorrect: true, discoveredGroups: [{ id: "otherFruit", name: "Other Fruits", emoji: "🍎" }] }
        ]
      },
    },
    finalLesson: "scene6_finalLesson"
  },
};
