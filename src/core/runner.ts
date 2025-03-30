import { generateText, LanguageModel } from "ai";
import chalk from "chalk";
import { jsonFormatForLog, logger } from "./logger";
import { getWrappedTools } from "./tool";
import { Agent } from "./types";

const shouldStop = (response: any) => {
  return (
    response?.toolResults?.length === 1 &&
    response?.toolResults[0]?.toolName === "stop"
  );
};

export const run = async (
  agent: Agent,
  model: LanguageModel,
  prompt: string
) => {
  let iteration = 0;
  const { systemPrompt, tools } = agent;
  let shouldStopIteration = false;
  let currentPrompt = `System prompt: ${systemPrompt}\nUser prompt: ${prompt}`;

  logger.info(chalk.bold.cyan("🤖 Starting Dev Agent"));
  logger.info(chalk.bold.blue("📝 System prompt:"), systemPrompt);
  logger.info(chalk.bold.magenta("❓ User prompt:"), prompt);

  while (!shouldStopIteration) {
    iteration++;
    logger.info(
      chalk.yellow.bold(
        `\n🔄 --- Iteration #${iteration} start at ${new Date().toLocaleTimeString()} ---`
      )
    );

    const response = await generateText({
      model,
      prompt: currentPrompt,
      tools: getWrappedTools(tools),
    });

    const shouldStopIteration = shouldStop(response);

    if (shouldStopIteration) {
      const stopResult = response.toolResults[0].result as {
        success: boolean;
        result: string;
      };
      logger.success(chalk.bold.green("✅ Task Complete"));
      logger.info(
        chalk.green(
          `🎯 Success: ${
            stopResult.success
              ? chalk.bold.green("TRUE")
              : chalk.bold.red("FALSE")
          }`
        )
      );
      logger.info(chalk.green("📊 Result:"), stopResult.result);
      break;
    }

    let additionalPrompt = "";
    if (response.text) {
      additionalPrompt = `Agent: ${response.text}`;
      logger.info(chalk.blue.bold("🤖 Agent response:"), response.text.trim());
    }
    if (response.toolResults.length > 0) {
      additionalPrompt += `Tool results: ${JSON.stringify(
        response.toolResults.map((r) => ({
          toolName: r.toolName,
          args: r.args,
          result: r.result,
        }))
      )}`;
      response.toolResults.forEach((r) => {
        logger.info(
          chalk.cyan.bold(`🛠️ Tool ${chalk.italic(r.toolName)}`),
          chalk.gray("called with args:"),
          jsonFormatForLog(r.args),
          chalk.gray("and returned result:"),
          jsonFormatForLog(r.result)
        );
      });
    }

    currentPrompt = `${currentPrompt}\n---\n${additionalPrompt}`;
  }

  logger.close();
};
