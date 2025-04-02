import json
import os
import re
from datetime import datetime, timezone
from typing import Any, Dict
import colorama
from colorama import Fore, Style

# Initialize colorama for cross-platform color support
colorama.init()

class Logger:
    def __init__(self):
        self.logs = []
        # Regular expression to remove ANSI escape sequences
        self.ansi_escape = re.compile(r'\x1B(?:[@-Z\\-_]|\[[0-?]*[ -/]*[@-~])')

    def _format_json(self, data: Any) -> str:
        """Format JSON data for logging"""
        if isinstance(data, (dict, list)):
            return json.dumps(data, indent=2)
        return str(data)

    def _strip_ansi(self, text: str) -> str:
        """Remove ANSI escape sequences from text"""
        return self.ansi_escape.sub('', text)

    def _log(self, message: str, data: Any = None):
        """Base logging function"""
        now = datetime.now(timezone.utc)
        
        # For console: no timestamp
        console_entry = message
        if data is not None:
            console_entry += f"\n{self._format_json(data)}"
        print(console_entry)

        # For file: full ISO datetime in UTC and no ANSI codes
        file_time = now.isoformat()
        file_message = self._strip_ansi(message)
        file_entry = f"[{file_time}] {file_message}"
        if data is not None:
            file_entry += f"\n{self._format_json(data)}"
        self.logs.append(file_entry)

    def info(self, message: str, data: Any = None):
        """Log info message in blue"""
        colored_message = f"{Fore.BLUE}{Style.BRIGHT}{message}{Style.RESET_ALL}"
        self._log(colored_message, data)

    def success(self, message: str, data: Any = None):
        """Log success message in green"""
        colored_message = f"{Fore.GREEN}{Style.BRIGHT}{message}{Style.RESET_ALL}"
        self._log(colored_message, data)

    def warning(self, message: str, data: Any = None):
        """Log warning message in yellow"""
        colored_message = f"{Fore.YELLOW}{Style.BRIGHT}{message}{Style.RESET_ALL}"
        self._log(colored_message, data)

    def error(self, message: str, data: Any = None):
        """Log error message in red"""
        colored_message = f"{Fore.RED}{Style.BRIGHT}{message}{Style.RESET_ALL}"
        self._log(colored_message, data)

    def tool_called(self, tool_name: str, args: Dict[str, Any]):
        """Log when a tool is called"""
        message = f"{Fore.CYAN}{Style.BRIGHT}🛠️ Tool {tool_name}{Style.RESET_ALL}"
        args_str = f"{Fore.WHITE}called with args:{Style.RESET_ALL}\n{self._format_json(args)}"
        self._log(f"{message} {args_str}")

    def tool_returned(self, tool_name: str, result: Any):
        """Log when a tool returns"""
        message = f"{Fore.CYAN}{Style.BRIGHT}🛠️ Tool {tool_name}{Style.RESET_ALL}"
        result_str = f"{Fore.WHITE}returned:{Style.RESET_ALL}\n{self._format_json(result)}"
        self._log(f"{message} {result_str}")

    def close(self):
        """Save logs to file"""
        timestamp = datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')
        os.makedirs('logs', exist_ok=True)
        filename = f"logs/dev_agent_{timestamp}.log"
        with open(filename, 'w') as f:
            f.write('\n'.join(self.logs))
        print(f"\n📝 Logs saved to {filename}")

# Create a global logger instance
logger = Logger() 
