import asyncio
from core.ai_provider import gemini_2_0_flash_model
from agents.weather_agent import weather_agent
from core.runner import run

async def main():
    await run(
        agent_config=weather_agent,
        model=gemini_2_0_flash_model,
        prompt="What is the temperature in London, if temperature is above 30°C, find temperature in Ha Noi otherwise find temperature in HCM"
    )

if __name__ == '__main__':
    asyncio.run(main())
