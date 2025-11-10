import { z } from 'zod';

const StarEntrySchema = z.object({
  requestId: z.string(),
  situation: z.string(),
  task: z.string(),
  action: z.string(),
  result: z.string(),
  timestamp: z.string(),
});

export type StarEntry = z.infer<typeof StarEntrySchema>;

export class StarLogger {
  private entries: StarEntry[] = [];

  addEntry(entry: StarEntry): void {
    StarEntrySchema.parse(entry);
    this.entries.push(entry);
  }

  getEntries(): StarEntry[] {
    return [...this.entries];
  }
}
