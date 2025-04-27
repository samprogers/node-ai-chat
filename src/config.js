import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY
export const api = new OpenAI({
     apiKey: openaiApiKey // This is also the default, can be omitted
});
