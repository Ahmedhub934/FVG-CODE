# UHC Advocate Assistant Agent

An AI-enabled workflow assistant that helps UHC advocates focus on high-value work by guiding Maestro call flows, validating clinical requests, and documenting encounters using the STAR methodology.

## Features
- **Call Flow Guidance**: Surfaces the correct Maestro intent, call flow steps, and navigation tips.
- **Request Forma Builder**: Generates a concise forma containing member ID, member name, and request details.
- **Clinical Reference Lookup**: Validates medications, diagnoses (ICD), and medical devices through Drugs.com, ICD APIs, and FDA device endpoints with spell-correction support.
- **KM/Maestro Summaries**: Summarizes pasted text or OCR output from screenshots into actionable navigation instructions.
- **STAR Documentation & Wrap-Up**: Logs each request using STAR format and produces a WP wrap-up summarizing the session.

## Getting Started

### Prerequisites
- Node.js 22+
- OpenAI API key with access to `gpt-4o-mini`

### Installation
```bash
dnf install -y python3-pip # if pip needed for OCR workflows
npm install
```

### Environment
Create a `.env` file with:
```
OPENAI_API_KEY=sk-your-key
LOG_LEVEL=info
```

### Development
```bash
npm run dev
```
The default entry point (`src/index.ts`) runs a sample interaction that:
1. Selects a Maestro intent.
2. Summarizes text attachments.
3. Performs a medication lookup.
4. Builds a request forma and STAR log, then emits a WP wrap-up.

### Build
```bash
npm run build
```

## Project Structure
- `src/data` – Maestro intent catalog.
- `src/services` – Summarization and clinical reference services.
- `src/workflows` – Request forma, STAR logger, wrap-up, and agent orchestration.
- `docs/` – Architectural notes and reference design.

## Next Steps
- Add OCR ingestion for screenshots.
- Extend intent catalog to include all Maestro intents.
- Wire conversational interface (CLI, chat, or web) around `AdvocateAgent`.
- Integrate persistence for STAR and wrap-up logs.

MIT License.
