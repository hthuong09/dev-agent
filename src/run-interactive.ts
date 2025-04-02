import "dotenv/config";
import { weatherAgent } from "./agents/weather.agent";
import { gemini20FlashModel } from "./core/ai.provider";
import { runInteractive } from "./core/runner.interactive";

async function main() {
  await runInteractive(weatherAgent, gemini20FlashModel);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
