import dotenv from "dotenv";
import { weatherAgent } from "./agents/weather.agent";
import { gemini20FlashModel } from "./core/ai.provider";
import { run } from "./core/runner";
dotenv.config();

async function main() {
  await run(
    weatherAgent,
    gemini20FlashModel,
    "What is the weather in London? If the weather is more than 20 degrees, tell me to sleeep at home"
  );
}

main().catch(console.error);
