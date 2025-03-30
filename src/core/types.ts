import { ToolSet } from "ai";

export type Agent = {
  systemPrompt: string;
  tools: ToolSet;
};
