import asyncio
from typing import List
from pydantic_ai import Agent
from pydantic_ai.models.gemini import GeminiModel
from core.agent_config import AgentConfig
from core.logger import logger
from pydantic_ai.messages import ModelMessage

async def run_interactive(agent_config: AgentConfig, model: GeminiModel, prompt: str = None) -> None:
    """Run the agent in interactive mode with the given configuration.
    Maintains conversation context between prompts using message history.
    """
    # Create agent for conversation management
    agent = Agent(
        model=model,
        system_prompt=agent_config.system_prompt,
        tools=agent_config.tools,
    )

    print("\n🤖 Interactive Dev Agent Session")
    print("Type 'stop' to end the session\n")

    try:
        # Initialize message history
        message_history: List[ModelMessage] = []
        
        # If initial prompt is provided, start with it
        if prompt:
            print(f"👤 Initial prompt: {prompt}\n")
        
        while True:
            # Get user input if no initial prompt, or for subsequent prompts
            current_prompt = prompt if prompt is not None else input("👤 Enter your prompt: ").strip()
            prompt = None  # Clear initial prompt after first use
            
            # Check if user wants to stop
            if current_prompt.lower() == 'stop':
                print("\n👋 Ending session. Goodbye!")
                break
            
            # Skip empty prompts
            if not current_prompt:
                print("❌ Please enter a valid prompt")
                continue
            
            print("\n") # Add spacing before agent response
            
            try:
                # Start new conversation with message history
                if not message_history:
                    logger.info("🤖 Starting Dev Agent")
                    logger.info("📝 System prompt:", agent_config.system_prompt)
                
                logger.info("❓ User prompt:", current_prompt)
                
                async with agent.iter(current_prompt, message_history=message_history) as conversation:
                    async for node in conversation:
                        if hasattr(node, 'model_response'):
                            for part in node.model_response.parts:
                                if part.part_kind == 'tool-call':
                                    logger.tool_called(part.tool_name, part.args)
                                elif part.part_kind == 'text':
                                    logger.info("🤖 Agent response:", part.content.strip())
                        elif hasattr(node, 'request'):
                            for part in node.request.parts:
                                if part.part_kind == 'tool-return':
                                    logger.tool_returned(part.tool_name, part.content)
                        elif hasattr(node, 'data'):
                            logger.success("✅ Task Complete")
                            logger.info("📊 Final Result:", node.data)

                    # Update message history with the conversation result
                    message_history = conversation.result.all_messages()

            except Exception as e:
                logger.error(f"❌ Error: {str(e)}")
                # Reset message history on error to start fresh
                message_history = []
            
            print("\n") # Add spacing after agent response

    except KeyboardInterrupt:
        print("\n\n👋 Session interrupted. Goodbye!")
    finally:
        logger.close() 
