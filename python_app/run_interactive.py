import asyncio
from core.ai_provider import gemini_2_0_flash_model
from agents.weather_agent import weather_agent
from core.runner_interactive import run_interactive

if __name__ == "__main__":
    asyncio.run(run_interactive(weather_agent, gemini_2_0_flash_model)) 
