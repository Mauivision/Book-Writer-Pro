import OpenAI from 'openai';

export const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is not configured. Please add it to your .env.local file.');
  }
  return new OpenAI({ apiKey });
}; 