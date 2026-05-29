import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const getGeminiModel = (model: string = 'gemini-1.5-flash') => {
  return genAI.getGenerativeModel({ model });
};

export async function analyzeMeterPhoto(imageBase64: string) {
  const model = getGeminiModel();
  const prompt = "Analyze this utility meter photo. Extract the numeric reading (kWh for electricity or cubic meters for water). Return only the number.";

  const result = await model.generateContent([
    prompt,
    {
      inlineData: {
        data: imageBase64,
        mimeType: "image/jpeg"
      }
    }
  ]);

  return result.response.text();
}
