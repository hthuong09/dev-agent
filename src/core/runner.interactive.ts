import { generateText, LanguageModel } from "ai";
import chalk from "chalk";
import readline from "readline";
import { jsonFormatForLog, logger } from "./logger";
import { getWrappedTools } from "./tool";
import { Agent } from "./types";

/**
 * Create a readline interface for user input
 */
function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

const shouldStop = (response: any) => {
  return (
    response?.toolResults?.length === 1 &&
    response?.toolResults[0]?.toolName === "stop"
  );
};

/**
 * Run the agent in interactive mode with the given configuration.
 * Maintains conversation context between prompts.
 */
export async function runInteractive(
  agent: Agent,
  model: LanguageModel,
  initialPrompt?: string
): Promise<void> {
  const { systemPrompt, tools } = agent;
  let messageHistory = "";

  console.log("\n🤖 Interactive Dev Agent Session");
  console.log("Type 'stop' to end the session\n");

  const rl = createReadlineInterface();

  try {
    // If initial prompt is provided, start with it
    if (initialPrompt) {
      console.log(`👤 Initial prompt: ${initialPrompt}\n`);
    }

    while (true) {
      // Get user input
      const currentPrompt =
        initialPrompt ||
        (await new Promise<string>((resolve) => {
          rl.question("👤 Enter your prompt: ", resolve);
        }));
      initialPrompt = undefined; // Clear initial prompt after first use

      // Check if user wants to stop
      if (currentPrompt.toLowerCase() === "stop") {
        console.log("\n👋 Ending session. Goodbye!");
        break;
      }

      // Skip empty prompts
      if (!currentPrompt.trim()) {
        console.log("❌ Please enter a valid prompt");
        continue;
      }

      console.log("\n"); // Add spacing before agent response

      try {
        // Start new conversation with message history
        if (!messageHistory) {
          logger.info(chalk.bold.cyan("🤖 Starting Dev Agent"));
          logger.info(chalk.bold.blue("📝 System prompt:"), systemPrompt);
          messageHistory = `System prompt: ${systemPrompt}`;
        }

        logger.info(chalk.bold.magenta("❓ User prompt:"), currentPrompt);

        let isComplete = false;
        let fullPrompt = `${messageHistory}\nUser prompt: ${currentPrompt}`;
        let additionalPrompt = "";

        while (!isComplete) {
          const response = await generateText({
            model,
            prompt: fullPrompt,
            tools: getWrappedTools(tools),
          });

          if (response.text) {
            additionalPrompt += `Agent: ${response.text}\n`;
            logger.info(
              chalk.blue.bold("🤖 Agent response:"),
              response.text.trim()
            );
          }

          if (response.toolResults.length > 0) {
            const toolResultsStr = response.toolResults.map((r) => ({
              toolName: r.toolName,
              args: r.args,
              result: r.result,
            }));
            additionalPrompt += `Tool results: ${JSON.stringify(
              toolResultsStr
            )}\n`;

            response.toolResults.forEach((r) => {
              logger.info(
                chalk.cyan.bold(`🛠️ Tool ${chalk.italic(r.toolName)}`),
                chalk.gray("called with args:"),
                jsonFormatForLog(r.args),
                chalk.gray("and returned result:"),
                jsonFormatForLog(r.result)
              );
            });

            // Check if the model wants to stop
            if (shouldStop(response)) {
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
              isComplete = true;
              break;
            }
          } else {
            // If no tool calls and we got a text response, consider it complete
            isComplete = true;
          }

          // Update the prompt with the latest interaction
          fullPrompt = `${fullPrompt}\n---\n${additionalPrompt}`;
        }

        // Update message history with the complete interaction
        messageHistory = fullPrompt;
      } catch (error) {
        logger.error(
          `❌ Error: ${error instanceof Error ? error.message : String(error)}`
        );
        // Reset message history on error to start fresh
        messageHistory = "";
      }

      console.log("\n"); // Add spacing after agent response
    }
  } catch (error) {
    if (error instanceof Error && error.name === "InterruptError") {
      console.log("\n\n👋 Session interrupted. Goodbye!");
    } else {
      throw error;
    }
  } finally {
    rl.close();
    logger.close();
  }
}
