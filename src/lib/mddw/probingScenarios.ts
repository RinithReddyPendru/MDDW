
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
    finalLesson: "You found 5 food groups by asking well! Good probing found hidden dairy, nuts, and greens."
  },
  "scenario_2": {
    scenarioId: "scenario_2",
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
    finalLesson: "Excellent! By asking follow-up questions, you discovered Kamala had milk and roti."
  },
  "scenario_3": {
    scenarioId: "scenario_3",
    motherName: "Lakshmi",
    avatarIcon: "👩🏽‍🦱",
    initialDiscovered: [
      { id: "grains", name: "Grains", emoji: "🌾" },
    ],
    firstStepId: "step1",
    steps: {
      "step1": {
        id: "step1",
        motherText: '"I had upma in the morning, nothing else yet."',
        options: [
          { text: "Did you add anything to the upma?", isCorrect: true, nextStepId: "step2" },
          { text: "Okay, I will record grains.", isCorrect: false, feedback: "Ask about ingredients mixed into the upma!" }
        ]
      },
      "step2": {
        id: "step2",
        motherText: '"I added some peanuts and carrots."',
        options: [
          { text: "Thank you!", isCorrect: true, discoveredGroups: [{ id: "nuts", name: "Nuts", emoji: "🥜" }, { id: "vitaminA", name: "Vit-A Rich", emoji: "🥕" }] }
        ]
      }
    },
    finalLesson: "Mixed dishes often hide other food groups! Always ask what went into them."
  },
  "scenario_4": {
    scenarioId: "scenario_4",
    motherName: "Radha",
    avatarIcon: "👩🏾",
    initialDiscovered: [
      { id: "grains", name: "Grains", emoji: "🌾" },
      { id: "meat", name: "Meat", emoji: "🍗" }
    ],
    firstStepId: "step1",
    steps: {
      "step1": {
        id: "step1",
        motherText: '"I had chicken biryani."',
        options: [
          { text: "Did you have anything with the biryani?", isCorrect: true, nextStepId: "step2" },
          { text: "Okay, rice and chicken.", isCorrect: false, feedback: "Biryani is often eaten with sides. Ask about them!" }
        ]
      },
      "step2": {
        id: "step2",
        motherText: '"Yes, I had a bowl of curd (raita)."',
        options: [
          { text: "Got it!", isCorrect: true, discoveredGroups: [{ id: "dairy", name: "Dairy", emoji: "🥛" }] }
        ]
      }
    },
    finalLesson: "Side dishes like raita or chutneys often contribute additional food groups!"
  },
  "scenario_5": {
    scenarioId: "scenario_5",
    motherName: "Anjali",
    avatarIcon: "👩🏽",
    initialDiscovered: [
      { id: "grains", name: "Grains", emoji: "🌾" },
      { id: "pulses", name: "Pulses", emoji: "🫘" }
    ],
    firstStepId: "step1",
    steps: {
      "step1": {
        id: "step1",
        motherText: '"I ate idli and sambar."',
        options: [
          { text: "Did you have any chutney?", isCorrect: true, nextStepId: "step2" },
          { text: "Okay.", isCorrect: false, feedback: "Idli is rarely eaten without chutney." }
        ]
      },
      "step2": {
        id: "step2",
        motherText: '"Yes, I had coconut chutney."',
        options: [
          { text: "Thank you.", isCorrect: true, discoveredGroups: [{ id: "otherFruit", name: "Other Fruits", emoji: "🥥" }] }
        ]
      }
    },
    finalLesson: "Coconut chutney counts towards the other fruits/veg group! Good catch."
  },
  "scenario_6": {
    scenarioId: "scenario_6",
    motherName: "Meena",
    avatarIcon: "👩🏻",
    initialDiscovered: [
      { id: "grains", name: "Grains", emoji: "🌾" }
    ],
    firstStepId: "step1",
    steps: {
      "step1": {
        id: "step1",
        motherText: '"I had a couple of rotis for dinner."',
        options: [
          { text: "What did you eat the rotis with?", isCorrect: true, nextStepId: "step2" },
          { text: "Okay.", isCorrect: false, feedback: "Roti is usually eaten with a curry or sabzi." }
        ]
      },
      "step2": {
        id: "step2",
        motherText: '"I had them with some leftover palak paneer."',
        options: [
          { text: "Thank you.", isCorrect: true, discoveredGroups: [{ id: "dglv", name: "Greens", emoji: "🌿" }, { id: "dairy", name: "Dairy", emoji: "🥛" }] }
        ]
      }
    },
    finalLesson: "Always ask what staples like roti or rice were eaten with."
  },
  "scenario_7": {
    scenarioId: "scenario_7",
    motherName: "Sunita",
    avatarIcon: "👩🏽‍🦳",
    initialDiscovered: [
      { id: "grains", name: "Grains", emoji: "🌾" },
      { id: "otherVeg", name: "Other Veg", emoji: "🍆" }
    ],
    firstStepId: "step1",
    steps: {
      "step1": {
        id: "step1",
        motherText: '"I had rice and brinjal curry."',
        options: [
          { text: "Did you drink anything or eat any fruit during the day?", isCorrect: true, nextStepId: "step2" },
          { text: "Okay.", isCorrect: false, feedback: "Ask about fruits or drinks." }
        ]
      },
      "step2": {
        id: "step2",
        motherText: '"I had a banana in the evening."',
        options: [
          { text: "Thank you.", isCorrect: true, discoveredGroups: [{ id: "otherFruit", name: "Other Fruits", emoji: "🍌" }] }
        ]
      }
    },
    finalLesson: "Fruits are often eaten as snacks and missed if you only ask about meals."
  },
  "scenario_8": {
    scenarioId: "scenario_8",
    motherName: "Pooja",
    avatarIcon: "👩🏽",
    initialDiscovered: [
      { id: "grains", name: "Grains", emoji: "🌾" }
    ],
    firstStepId: "step1",
    steps: {
      "step1": {
        id: "step1",
        motherText: '"I ate poha in the morning."',
        options: [
          { text: "Did it have any vegetables or nuts?", isCorrect: true, nextStepId: "step2" },
          { text: "Okay.", isCorrect: false, feedback: "Poha often contains other ingredients." }
        ]
      },
      "step2": {
        id: "step2",
        motherText: '"Yes, it had peanuts and green peas."',
        options: [
          { text: "Thank you.", isCorrect: true, discoveredGroups: [{ id: "nuts", name: "Nuts", emoji: "🥜" }, { id: "pulses", name: "Pulses", emoji: "🫘" }] }
        ]
      }
    },
    finalLesson: "Great! You uncovered nuts and pulses hidden in the poha."
  },
  "scenario_9": {
    scenarioId: "scenario_9",
    motherName: "Kavya",
    avatarIcon: "👧🏽",
    initialDiscovered: [
      { id: "grains", name: "Grains", emoji: "🌾" },
      { id: "pulses", name: "Pulses", emoji: "🫘" }
    ],
    firstStepId: "step1",
    steps: {
      "step1": {
        id: "step1",
        motherText: '"I had khichdi."',
        options: [
          { text: "Did you have any ghee or oil on top?", isCorrect: false, feedback: "Ghee doesn't count towards MDD-W groups. Ask about sides." },
          { text: "Did you eat it with anything else?", isCorrect: true, nextStepId: "step2" }
        ]
      },
      "step2": {
        id: "step2",
        motherText: '"I had it with a boiled egg."',
        options: [
          { text: "Thank you.", isCorrect: true, discoveredGroups: [{ id: "eggs", name: "Eggs", emoji: "🥚" }] }
        ]
      }
    },
    finalLesson: "Sides are important! Khichdi is often eaten with papad, pickle, curd, or eggs."
  },
  "scenario_10": {
    scenarioId: "scenario_10",
    motherName: "Geeta",
    avatarIcon: "👩🏽",
    initialDiscovered: [
      { id: "grains", name: "Grains", emoji: "🌾" },
      { id: "otherVeg", name: "Other Veg", emoji: "🍅" }
    ],
    firstStepId: "step1",
    steps: {
      "step1": {
        id: "step1",
        motherText: '"I had dosa and tomato chutney."',
        options: [
          { text: "Did you drink anything?", isCorrect: true, nextStepId: "step2" },
          { text: "Okay.", isCorrect: false, feedback: "Ask about drinks." }
        ]
      },
      "step2": {
        id: "step2",
        motherText: '"Yes, I drank buttermilk."',
        options: [
          { text: "Thank you.", isCorrect: true, discoveredGroups: [{ id: "dairy", name: "Dairy", emoji: "🥛" }] }
        ]
      }
    },
    finalLesson: "Buttermilk is a great source of dairy and is often missed if not asked about directly."
  }
};
