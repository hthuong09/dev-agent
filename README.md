# Dev Agent

A customizable framework for building developer-focused AI agents. Dev Agent is an alternative to tools like OpenManus and Manus AI, but with a focus on providing a simple skeleton that developers can easily extend to build custom agents tailored to their specific needs.

## Philosophy

This project is **not** about providing a generic tasks agent for everyone. Instead, it offers a minimal foundation that allows developers to understand and customize every aspect of their AI agents.

## Prerequisites

- Node.js (version specified in `.nvmrc`)
- npm or yarn

## Installation
```bash
git clone https://github.com/hthuong09/dev-agent
cd dev-agent
npm install
```

## Configuration

1. Copy the sample environment file:
```bash
cp .env.sample .env
```

2. Update the `.env` file with your configuration values.

## Project Structure

```
src/
├── agents/     # Agent implementations, you'll need to define the prompt & usable tools here
├── core/       # Core framework components
├── tools/      # Tool implementations, you can be shared between agents
└── index.ts    # Main entry point
```

## Using Dev Agent

Dev Agent supports two modes of operation:
1. Single Query Mode - Process a single query and exit
2. Interactive Mode - Maintain a conversation with the agent

### Single Query Mode

```bash
npm start
```

### Interactive Mode

Interactive mode maintains conversation context between prompts, allowing for more complex interactions:

```bash
npm run start:interactive
```

In interactive mode:
- Type your prompts and press Enter
- The agent will process each prompt while maintaining context
- Type 'stop' to end the session
- The agent will continue processing until it completes the task or explicitly stops

### Creating Custom Tools and Agents

#### 1. Create a Custom Tool

Create a new file in the `src/tools` directory:

```typescript
// src/tools/example.tool.ts
import { tool } from "ai";
import { z } from "zod";

export const ExampleTool = tool({
  description: "Description of what your tool does",
  parameters: z.object({
    param1: z.string().describe("Description of parameter 1"),
    param2: z.number().describe("Description of parameter 2"),
  }),
  execute: async ({ param1, param2 }) => {
    // Your tool implementation here
    return {
      result: `Processed ${param1} with value ${param2}`,
    };
  },
});
```

#### 2. Create a Custom Agent

Create a new file in the `src/agents` directory:

```typescript
// src/agents/example.agent.ts
import { Agent } from "@/core/types";
import { ExampleTool } from "@/tools/example.tool";

export const exampleAgent: Agent = {
  systemPrompt:
    "You are a helpful assistant that can use tools to solve problems. Think carefully about which tool to use.",
  tools: {
    example: ExampleTool,
    // Add more tools as needed
  },
};
```

#### 3. Use Your Agent

For single query mode, update `src/index.ts`:

```typescript
import dotenv from "dotenv";
import { exampleAgent } from "./agents/example.agent";
import { gemini20FlashModel } from "./core/ai.provider";
import { run } from "./core/runner";
dotenv.config();

async function main() {
  await run(
    exampleAgent,
    gemini20FlashModel,
    "Your prompt or user query here"
  );
}

main().catch(console.error);
```

For interactive mode, update `src/run-interactive.ts`:

```typescript
import "dotenv/config";
import { exampleAgent } from "./agents/example.agent";
import { gemini20FlashModel } from "./core/ai.provider";
import { runInteractive } from "./core/runner.interactive";

async function main() {
  await runInteractive(exampleAgent, gemini20FlashModel);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
```
