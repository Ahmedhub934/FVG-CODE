import { StarEntry } from './star-logger.js';

export interface WrapUpSummary {
  sessionId: string;
  advocate: string;
  entries: StarEntry[];
  summary: string;
}

export function buildWrapUp(sessionId: string, advocate: string, entries: StarEntry[]): WrapUpSummary {
  const summaryLines = entries.map((entry) => `• ${entry.requestId}: ${entry.result}`);
  return {
    sessionId,
    advocate,
    entries,
    summary: summaryLines.join('\n'),
  };
}
