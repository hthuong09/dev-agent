from dotenv import load_dotenv
from pydantic_ai.models.gemini import GeminiModel

# Load environment variables from .env file
load_dotenv()

gemini_2_0_flash_model = GeminiModel('gemini-2.0-flash', provider='google-gla') 
