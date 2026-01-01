import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { Quote } from "../types";

// Initialize Gemini Client
const genAI = new GoogleGenerativeAI(process.env.API_KEY || "");

export const fetchQuote = async (activityName: string): Promise<Quote> => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            quote: { type: SchemaType.STRING },
            author: { type: SchemaType.STRING }
          },
          required: ["quote", "author"]
        }
      }
    });

    const prompt = `Generate a short, inspiring quote relevant to the activity: "${activityName}".

      The quote MUST strictly focus on one of the following themes:
      - Inner peace and tranquility
      - Gratitude and appreciation
      - Conscious breathing and presence
      - Connection to the present moment
      - Love, friendship, and compassion
      - Mindfulness and awareness

      It should be concise (max 20 words).`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const jsonText = response.text();

    if (!jsonText) throw new Error("No text returned");

    const data = JSON.parse(jsonText);
    return {
      text: data.quote,
      author: data.author
    };

  } catch (error) {
    console.error("Error fetching quote:", error);
    // Fallback quote
    return {
      text: "Peace comes from within. Do not seek it without.",
      author: "Buddha"
    };
  }
};
