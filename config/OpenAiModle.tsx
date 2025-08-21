import OpenAI from 'openai';

// Safety check to prevent server crash if the key is missing
if (!process.env.OPEN_ROUTER_API_KEY) {
    console.error("❌ OPEN_ROUTER_API_KEY is missing in environment variables!");
    console.error("Please add OPEN_ROUTER_API_KEY=your_api_key_here to your .env file");
} else {
    console.log("✅ OPEN_ROUTER_API_KEY is configured");
}

export const openai = new OpenAI({
    baseURL: process.env.OPENAI_BASE_URL || 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPEN_ROUTER_API_KEY,
    // Identify your app to OpenRouter to avoid 401s on some keys
    // See: https://openrouter.ai/docs#identification
    defaultHeaders: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        'X-Title': process.env.NEXT_PUBLIC_APP_NAME || 'AI Medical Voice Agent',
    },
});
