# Weather Agent Python App

A simple weather agent implementation using pydantic-ai-slim.

## Installation

1. Create a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Project Structure

```
python_app/
├── core/           # Core components
│   ├── model.py    # AI model configuration
├── tools/          # Tool implementations
│   ├── weather.py  # Weather tool
└── run.py          # Main entry point
```

## Running the Application

```bash
python run.py
```

The agent will check the temperature in London and suggest sleeping at home if it's above 20 degrees.
