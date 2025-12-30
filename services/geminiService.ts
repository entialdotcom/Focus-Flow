import { GoogleGenAI, Type } from "@google/genai";
import { Quote } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchQuote = async (activityName: string): Promise<Quote> => {
  try {
    const model = 'gemini-3-flash-preview';
    
    const response = await ai.models.generateContent({
      model: model,
      contents: `Generate a short, inspiring quote relevant to the activity: "${activityName}". 
      
      The quote MUST strictly focus on one of the following themes: 
      - Inner peace and tranquility
      - Gratitude and appreciation
      - Conscious breathing and presence
      - Connection to the present moment
      - Love, friendship, and compassion
      - Mindfulness and awareness

      It should be concise (max 20 words).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            quote: { type: Type.STRING },
            author: { type: Type.STRING }
          },
          required: ["quote", "author"]
        }
      }
    });

    const jsonText = response.text;
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