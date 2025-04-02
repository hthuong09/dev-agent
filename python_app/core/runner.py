import asyncio
from typing import Any
from datetime import datetime, timezone
from pydantic_ai import Agent
from pydantic_ai.models.gemini import GeminiModel
from core.agent_config import AgentConfig
from core.logger import logger

class Runner:
    def __init__(self, agent_config: AgentConfig, model: GeminiModel):
        self.agent_config = agent_config
        self.agent = Agent(
            model=model,
            system_prompt=agent_config.system_prompt,
            tools=agent_config.tools,
        )

    async def run(self, prompt: str) -> None:
        logger.info("🤖 Starting Dev Agent")
        logger.info("📝 System prompt:", self.agent_config.system_prompt)
        logger.info("❓ User prompt:", prompt)

        iteration = 0
        async with self.agent.iter(prompt) as agent_run:
            async for node in agent_run:
                # Only increment iteration when we get a model response (LLM call)
                if hasattr(node, 'model_response'):
                    iteration += 1
                    utc_time = datetime.now(timezone.utc).strftime('%H:%M:%S')
                    logger.warning(f"🔄 --- Iteration #{iteration} start at {utc_time} UTC ---")
                    
                    # Handle model responses (tool calls and text)
                    for part in node.model_response.parts:
                        if part.part_kind == 'tool-call':
                            logger.tool_called(part.tool_name, part.args)
                        elif part.part_kind == 'text':
                            logger.info("🤖 Agent response:", part.content.strip())
                
                # Handle tool returns
                elif hasattr(node, 'request'):
                    for part in node.request.parts:
                        if part.part_kind == 'tool-return':
                            logger.tool_returned(part.tool_name, part.content)
                
                # Handle completion
                elif hasattr(node, 'data'):
                    logger.success("✅ Task Complete")
                    logger.info("📊 Final Result:", node.data)

        logger.close()

async def run(agent_config: AgentConfig, model: GeminiModel, prompt: str) -> None:
    """Run the agent with the given configuration and prompt"""
    runner = Runner(agent_config, model)
    await runner.run(prompt)
