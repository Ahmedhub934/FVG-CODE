import { AdvocateAgent } from './workflows/advocate-agent.js';
import { createLogger } from './utils/logger.js';

const logger = createLogger();

async function main() {
  const agent = new AdvocateAgent({ logger });
  const result = await agent.run({
    input: 'Summarize this KM screenshot and prepare call flow for prior authorization of medication Xeljanz for member 123.',
    attachments: [],
  });

  logger.info({ result }, 'Agent run completed');
}

main().catch((error) => {
  logger.error({ err: error }, 'Agent failed');
  process.exit(1);
});
