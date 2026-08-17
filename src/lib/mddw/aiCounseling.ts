import OpenAI from "openai";

// Define the system prompt for the AI acting as the Mother
export const MOTHER_SYSTEM_PROMPT = `
You are Lakshmi, a 25-year-old pregnant mother living in a rural village in Andhra Pradesh. 
An ASHA worker (community health worker) has come to counsel you on your diet.
Your goal is to have a natural, conversational roleplay.

YOUR CURRENT SITUATION:
- Yesterday, you only ate Rice and Toor Dal. You did not eat any vegetables, fruits, dairy, or meat.
- You are feeling a bit tired.
- You believe that eating eggs during pregnancy is bad for the baby (a common local myth).
- You are polite but slightly hesitant to change your diet because food is expensive.

RULES FOR YOUR RESPONSES:
1. ALWAYS reply in natural, colloquial Telugu (using Telugu script). 
2. Keep your responses short (1-3 sentences maximum). People in real life speak in short sentences.
3. If the ASHA asks you what you ate, tell them "I ate only rice and dal."
4. If the ASHA tells you to eat eggs, resist at first due to the myth. If they explain *why* it's good gently, you can agree.
5. If the ASHA successfully convinces you to eat at least 3 new food groups (e.g., vegetables, milk, eggs), you should agree to change your diet.

JSON OUTPUT FORMAT:
You must ALWAYS respond in valid JSON format. Do not use markdown blocks like \`\`\`json. Just raw JSON.
Format:
{
  "message": "Your spoken reply in Telugu",
  "convinced": boolean
}

Set "convinced" to true ONLY IF the ASHA has successfully identified what you are missing and has convinced you to eat a diverse diet (at least 5 food groups total). Otherwise, keep it false.
`;

export async function sendCounselingMessage(
  apiKey: string,
  chatHistory: { role: "user" | "assistant" | "system"; content: string }[],
  userMessage: string
) {
  const openai = new OpenAI({
    apiKey: apiKey,
    dangerouslyAllowBrowser: true,
  });

  const messages = [
    { role: "system", content: MOTHER_SYSTEM_PROMPT },
    ...chatHistory,
    { role: "user", content: userMessage },
  ];

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages as any,
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No response from AI");

    const parsed = JSON.parse(content);
    return {
      message: parsed.message || "...",
      convinced: parsed.convinced || false,
    };
  } catch (error) {
    console.error("OpenAI Error:", error);
    throw new Error("Failed to get response from AI. Please check your API key.");
  }
}
