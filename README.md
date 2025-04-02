# Weather Agent Python App

A simple weather agent implementation using pydantic-ai-slim.

## Installation

1. Create a virtual environment:
```bash
uv venv                           
source .venv/bin/activate
```

2. Install dependencies:
```bash
uv pip install -r requirements.txt
```

3. Set up environment variables:
   - Copy `.env.sample` to `.env`
   - Update the values in `.env` with your API keys

## Project Structure

```
├── agents/             # Agent definitions
├── core/              # Core functionality
├── tools/             # Tool implementations
├── logs/              # Log files
├── run.py             # Main script
├── run_interactive.py # Interactive mode script
└── requirements.txt   # Project dependencies
```

## Running the Application

There are two ways to run the application:

1. Standard mode:
```bash
python run.py
```
This will run the weather agent with a predefined prompt to check temperatures in London, Ha Noi, and HCM based on conditions.

2. Interactive mode:
```bash
python run_interactive.py
```
This allows you to interact with the agent directly.

## Dependencies

- pydantic-ai-slim: For AI agent implementation
- python-dotenv: For environment variable management
- colorama: For terminal color output

## Environment Variables

Required environment variables (see `.env.sample`):
- Add your required API keys to the `.env` file
