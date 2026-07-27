type LogLevel = "info" | "warn" | "error" | "debug";

interface LogPayload {
  message: string;
  context?: Record<string, unknown>;
  error?: Error | unknown;
}

const isDev = process.env.NODE_ENV !== "production";

function formatLog(level: LogLevel, { message, context, error }: LogPayload): string {
  const timestamp = new Date().toISOString();
  let formatted = `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
  if (context && Object.keys(context).length > 0) {
    formatted += ` | context=${JSON.stringify(context)}`;
  }
  if (error) {
    const errObj = error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error;
    formatted += ` | error=${JSON.stringify(errObj)}`;
  }
  return formatted;
}

/**
 * Lightweight application logger compliant with CODING_STANDARDS.md.
 * Only logs to console during development or when explicit error occurs.
 */
export const logger = {
  info(message: string, context?: Record<string, unknown>): void {
    if (isDev) {
      console.log(formatLog("info", { message, context }));
    }
  },

  warn(message: string, context?: Record<string, unknown>): void {
    if (isDev) {
      console.warn(formatLog("warn", { message, context }));
    }
  },

  error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void {
    console.error(formatLog("error", { message, context, error }));
  },

  debug(message: string, context?: Record<string, unknown>): void {
    if (isDev) {
      console.debug(formatLog("debug", { message, context }));
    }
  },
};
