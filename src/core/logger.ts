import fs from "fs";
import path from "path";
import util from "util";

export interface LogOptions {
  logToFile?: boolean;
  logDir?: string;
  sessionId?: string;
}

class Logger {
  private logFile: string | null = null;
  private logStream: fs.WriteStream | null = null;
  private options: LogOptions = {
    logToFile: true,
    logDir: "./logs",
    sessionId: new Date().toISOString().replace(/[:.]/g, "-"),
  };

  constructor(options?: LogOptions) {
    if (options) {
      this.options = { ...this.options, ...options };
    }

    if (this.options.logToFile) {
      this.setupFileLogging();
    }
  }

  private setupFileLogging() {
    const { logDir, sessionId } = this.options;

    // Create log directory if it doesn't exist
    if (!fs.existsSync(logDir!)) {
      fs.mkdirSync(logDir!, { recursive: true });
    }

    this.logFile = path.join(logDir!, `dev-agent-${sessionId}.log`);
    this.logStream = fs.createWriteStream(this.logFile, { flags: "a" });

    // Log basic session info
    this.writeToFile(`=== Dev Agent Session: ${sessionId} ===\n`);
    this.writeToFile(`Started at: ${new Date().toISOString()}\n\n`);
  }

  private formatArgsForFile(args: any[]): string {
    return args
      .map((arg) => (typeof arg === "string" ? arg : JSON.stringify(arg)))
      .join(" ");
  }

  private writeToFile(message: string) {
    if (this.logStream) {
      const now = new Date().toISOString();
      // Strip ANSI color codes for file output
      const cleanMessage = util.stripVTControlCharacters(message);
      this.logStream.write(`${now} - ${cleanMessage}\n`);
    }
  }

  private writeToConsole(...args: any[]) {
    console.log(...args);
  }

  info(...args: any[]) {
    this.writeToConsole(...args);
    this.writeToFile(`[INFO] ${this.formatArgsForFile(args)}`);
  }

  success(...args: any[]) {
    this.writeToConsole(...args);
    this.writeToFile(`[SUCCESS] ${this.formatArgsForFile(args)}`);
  }

  warning(...args: any[]) {
    this.writeToConsole(...args);
    this.writeToFile(`[WARNING] ${this.formatArgsForFile(args)}`);
  }

  error(...args: any[]) {
    this.writeToConsole(...args);
    this.writeToFile(`[ERROR] ${this.formatArgsForFile(args)}`);
  }

  close() {
    if (this.logStream) {
      this.writeToFile(`\nSession ended at: ${new Date().toISOString()}\n`);
      this.logStream.end();
    }
  }
}

export const jsonFormatForLog = (obj: any) => {
  return util.inspect(obj, {
    showHidden: false,
    depth: null,
    colors: true,
  });
};

// Export singleton instance
export const logger = new Logger();

// Export class for custom instances
export default Logger;
