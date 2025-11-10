import { Configuration, OpenAIApi } from 'openai';
import { z } from 'zod';

const SummarySchema = z.object({
  keySteps: z.array(z.string()),
  navigation: z.array(z.string()),
  highlights: z.array(z.string()),
});

export interface SummarizationInput {
  content: string;
  context?: string;
}

export interface SummarizationResult {
  keySteps: string[];
  navigation: string[];
  highlights: string[];
}

export class SummarizationService {
  private readonly client: OpenAIApi;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY is required');
    }
    this.client = new OpenAIApi(new Configuration({ apiKey }));
  }

  async summarize(input: SummarizationInput): Promise<SummarizationResult> {
    const prompt = `You are assisting an advocate navigating Maestro/KM. Summarize the content and list clear steps the user should take.\nContent:\n${input.content}\nContext:${input.context || 'N/A'}`;

    const response = await this.client.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You summarize knowledgebase content for call center advocates.' },
        { role: 'user', content: prompt },
      ],
    });

    const text = response.data.choices[0]?.message?.content ?? '';
    const parsed = SummarySchema.safeParse(JSON.parse(text));

    if (!parsed.success) {
      throw new Error('Failed to parse summarization result');
    }

    return parsed.data;
  }
}
