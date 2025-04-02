import random
from typing import Dict, Any

def get_temperature(location: str) -> Dict[str, Any]:
    """Get the temperature for a given location.
    For testing purposes, this returns a random temperature.
    """
    temperature = random.randint(-10, 40)
    return {
        "location": location,
        "temperature": temperature
    } 
