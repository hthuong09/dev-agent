from dataclasses import dataclass
from typing import List, Callable

@dataclass
class AgentConfig:
    """Base configuration for all agents"""
    system_prompt: str
    tools: List[Callable] 
