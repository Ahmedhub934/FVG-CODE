import pino from 'pino';

export interface Logger {
  info: (obj: unknown, msg?: string) => void;
  warn: (obj: unknown, msg?: string) => void;
  error: (obj: unknown, msg?: string) => void;
  debug: (obj: unknown, msg?: string) => void;
}

export function createLogger(): Logger {
  return pino({ level: process.env.LOG_LEVEL || 'info' });
}
