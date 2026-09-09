import OpenAI from "openai";
import aiConfig from "./aiConfig.js";

if (!aiConfig.apiKey) {
    throw new Error("OPENAI_API_KEY is not configured");
}

const client = new OpenAI({
    apiKey: aiConfig.apiKey
});

export default client;