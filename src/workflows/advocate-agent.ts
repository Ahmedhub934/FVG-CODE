import { maestroIntents } from '../data/intents.js';
import { ReferenceLookupService } from '../services/reference-lookup.js';
import { SummarizationService } from '../services/summarization.js';
import { Spellchecker } from '../utils/spellcheck.js';
import { buildRequestForma, RequestForma } from './request-forma.js';
import { StarLogger } from './star-logger.js';
import { buildWrapUp, WrapUpSummary } from './wrap-up.js';

export interface AdvocateAgentRunInput {
  input: string;
  attachments: Array<{ type: 'text' | 'image'; content: string }>;
}

export interface AdvocateAgentOptions {
  logger: { info: (obj: unknown, message?: string) => void; error: (obj: unknown, message?: string) => void };
}

export class AdvocateAgent {
  private readonly referenceLookup: ReferenceLookupService;
  private readonly summarizer: SummarizationService;
  private readonly spellchecker: Spellchecker;
  private readonly starLogger = new StarLogger();

  constructor(private readonly options: AdvocateAgentOptions) {
    this.spellchecker = new Spellchecker([
      'xeljanz',
      'adalimumab',
      'hypertension',
      'hip replacement',
    ]);
    this.referenceLookup = new ReferenceLookupService({ spellchecker: this.spellchecker });
    this.summarizer = new SummarizationService();
  }

  async run(input: AdvocateAgentRunInput): Promise<{ requestForma?: RequestForma; wrapUp?: WrapUpSummary }> {
    const intent = maestroIntents[0];
    this.options.logger.info({ intent }, 'Selected Maestro intent');

    if (input.attachments.length > 0) {
      const textAttachments = input.attachments.filter((item) => item.type === 'text');
      for (const attachment of textAttachments) {
        const summary = await this.summarizer.summarize({ content: attachment.content, context: intent.name });
        this.options.logger.info({ summary }, 'Summarized attachment');
      }
    }

    const medicationMatches = await this.referenceLookup.lookup('xeljanz', 'medication');
    this.options.logger.info({ medicationMatches }, 'Medication lookup result');

    const requestForma = buildRequestForma({ memberId: '123', memberName: 'John Doe', requestDetails: 'Prior auth for Xeljanz 5mg BID' });

    this.starLogger.addEntry({
      requestId: 'req-1',
      situation: 'Member requires prior authorization for Xeljanz',
      task: 'Advocate must verify request and provide guidance',
      action: 'Collected member details, checked criteria, informed provider of next steps',
      result: 'Request submitted with expected turnaround communicated',
      timestamp: new Date().toISOString(),
    });

    const wrapUp = buildWrapUp('session-1', 'Advocate Jane', this.starLogger.getEntries());

    return { requestForma, wrapUp };
  }
}
