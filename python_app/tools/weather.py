from pydantic import BaseModel
from pydantic_ai import agent

class WeatherToolParams(BaseModel):
    """ Getting temperature of a location """
    location: str

def get_temperature(f: WeatherToolParams) -> str:
    import random
    temperature = random.randint(20, 100)
    return {
        "location": f.location,
        "temperature": temperature
    }
