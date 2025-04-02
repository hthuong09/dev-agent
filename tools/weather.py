from pydantic import BaseModel
from pydantic_ai import agent
from core.decorators import confirmation_required_tool

class WeatherToolParams(BaseModel):
    """ Getting temperature of a location """
    location: str

@confirmation_required_tool
def get_temperature(f: WeatherToolParams) -> str:
    import random
    temperature = random.randint(20, 100)
    return {
        "location": f.location,
        "temperature": temperature
    }
