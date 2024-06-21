import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

async function GenerateOutput(eventsofDay) {

  const prompt = `${eventsofDay}. Write like a human, for humans. Craft two engaging social media posts tailored for LinkedIn and Twitter audiences. Use simple language .Each post should creatively highlight the following events. Ensure the tone is conversational and impactful. Focus on engaging the respective platform's audience, encouraging interaction, and driving interest in the events.`

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  const promptTokens = (await model.countTokens(prompt)).totalTokens;
  const completionTokens = (await model.countTokens(text)).totalTokens;
  return {text,promptTokens,completionTokens};  
}

export default GenerateOutput;