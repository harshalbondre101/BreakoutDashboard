export const API_BASE_URL = 'https://ai-customer-care-b1ey.onrender.com';
export const API_CHARTS_BASE_URL = 'https://ai-customer-care-b1ey.onrender.com/api/dashboard';
export const XI_BASE_URL = 'https://ai-customer-care-b1ey.onrender.com/ElevenLabs';
export let XI_API_KEY = process.env.NEXT_PUBLIC_XI_API_KEY || '';

export function setXiApiKey(newKey: string) {
  XI_API_KEY = newKey;
}
