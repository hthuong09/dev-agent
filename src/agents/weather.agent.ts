import { Agent } from "@/core/types";
import { WeatherTool } from "@/tools/weather.tool";

export const weatherAgent: Agent = {
  systemPrompt:
    "You are a weather agent. You can access to tool to get weather temperature.",
  tools: {
    weather: WeatherTool,
  },
};
