from tools.weather import get_temperature
from core.agent_config import AgentConfig

weather_agent = AgentConfig(
    system_prompt="""You are a weather agent. You can use tool to find temperature.
If the temperature is above 30°C, suggest indoor activities.
If the temperature is below 10°C, suggest warm clothing.""",
    tools=[get_temperature]
) 
