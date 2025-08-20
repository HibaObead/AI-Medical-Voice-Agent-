import OpenAI from 'openai';

export const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENAI_API_KEY,

});


// import OpenAI from "openai";

// // Safety check to prevent server crash if the key is missing
// if (!process.env.OPEN_ROUTER_API_KEY) {
//     throw new Error("OPEN_ROUTER_API_KEY is missing in environment variables!");
// }

// export const openai = new OpenAI({
//     apiKey: process.env.OPEN_ROUTER_API_KEY,
//     baseURL: "https://openrouter.ai/api/v1",
// });
