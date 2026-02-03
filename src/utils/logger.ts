export type LogLevel = 'debug' | 'info' | 'error';

export interface LoggerOptions {
  verbose?: boolean;
  debug?: boolean;
}

export class Logger {
  private verbose: boolean;
  private debugMode: boolean;

  constructor(options: LoggerOptions = {}) {
    this.verbose = options.verbose ?? false;
    this.debugMode = options.debug ?? false;
  }

  setVerbose(value: boolean): void {
    this.verbose = value;
  }

  setDebug(value: boolean): void {
    this.debugMode = value;
    if (value) this.verbose = true;
  }

  debug(message: string, ...args: unknown[]): void {
    if (this.verbose) {
      console.debug(`[commitgen] ${message}`, ...args);
    }
  }

  trace(phase: string, data: Record<string, unknown>): void {
    if (this.debugMode) {
      console.debug(`[commitgen:trace] ${phase}`, JSON.stringify(data, null, 2));
    }
  }

  info(message: string, ...args: unknown[]): void {
    console.info(`[commitgen] ${message}`, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    console.error(`[commitgen] ${message}`, ...args);
  }
}

let defaultLogger: Logger | null = null;

export function getLogger(options: { verbose?: boolean; debug?: boolean } = {}): Logger {
  const { verbose = false, debug = false } = typeof options === 'boolean' ? { verbose: options } : options;
  if (!defaultLogger) {
    defaultLogger = new Logger({ verbose, debug });
  } else {
    defaultLogger.setVerbose(verbose);
    defaultLogger.setDebug(debug);
  }
  return defaultLogger;
}
