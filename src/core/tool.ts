import { tool, ToolSet } from "ai";
import chalk from "chalk";
import { z } from "zod";
import { logger } from "./logger";

export const StopTool = tool({
  description:
    "This tool should be called if the operation is success or there is no more action can be done",
  parameters: z.object({
    success: z.boolean().describe("The operation is success"),
    result: z.string().describe("The result of the operation"),
  }),
  execute: async ({ success, result }) => {
    return {
      success,
      result,
    };
  },
});

export const getWrappedTools = (tools: ToolSet) => {
  return {
    stop: StopTool,
    ...Object.fromEntries(
      Object.entries(tools).map(([key, tool]) => [
        key,
        {
          ...tool,
          execute: async (args: any, options: any) => {
            try {
              return {
                success: true,
                result: await tool.execute?.(args, options),
              };
            } catch (error) {
              logger.error(
                chalk.red(`❌ Error executing tool ${chalk.bold(key)}`),
                chalk.red(String(error))
              );

              return {
                success: false,
                error,
              };
            }
          },
        },
      ])
    ),
  };
};
