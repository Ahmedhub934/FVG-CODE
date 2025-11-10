# UHC Advocate Assistant Agent Architecture

## Overview
The UHC Advocate Assistant Agent is an AI-driven workflow companion designed to streamline prior-authorization and support tasks for UHC advocates. The agent orchestrates call preparation, real-time lookup of clinical references, knowledge base summarization, and compliant documentation using the STAR method. It runs as a modular Node.js (TypeScript) application that can operate as a standalone CLI, integrate into chat platforms, or expose HTTP endpoints for embedding inside existing tooling.

## Primary Capabilities
- **Call Flow Guidance** – Presents the advocate with the appropriate Maestro intent, call script, and on-screen navigation steps.
- **Request Forma Generation** – Produces a concise summary containing member identifying information (ID, name) and the specific request details.
- **Medical Reference Lookups** – Validates medications, diagnoses (ICD), and medical devices using external sources (Drugs.com, ICD search endpoints, FDA device registry). Applies fuzzy matching to correct misspellings and returns normalized data.
- **Knowledge Material Summarization** – Accepts raw text or OCR output from screenshots of KM/Maestro pages and generates step-by-step instructions for the advocate.
- **Request Documentation** – Captures every interaction in STAR (Situation, Task, Action, Result) format and prepares a "WP Wrap-Up" bundle summarizing all requests handled during the session.

## High-Level Architecture
```
┌─────────────────────────┐
│  Interface Layer         │  CLI / chat / REST
└────────────┬────────────┘
             │
┌────────────▼────────────┐
│ Conversation Orchestrator│
├────────────┬────────────┤
│            │            │
│            │            ▼
│            │   ┌──────────────────────┐
│            │   │ Summarization Engine │
│            │   └──────────────────────┘
│            │            │
│            ▼            ▼
│   ┌─────────────────────────────┐
│   │ Workflow Manager            │
│   │ • Call Flow Planner         │
│   │ • Request Forma Builder     │
│   │ • Maestro Intent Router     │
│   └─────────────────────────────┘
│            │
│            ▼
│   ┌─────────────────────────────┐
│   │ Knowledge & Reference Layer │
│   │ • Maestro Intent Catalog    │
│   │ • Reference Lookup Service  │
│   │ • Spell-Correction/Fuzzy    │
│   └─────────────────────────────┘
│            │
│            ▼
│   ┌─────────────────────────────┐
│   │ Persistence & Audit Layer   │
│   │ • Session Store             │
│   │ • STAR Log                  │
│   │ • Wrap-Up Aggregator        │
│   └─────────────────────────────┘
└─────────────────────────────────┘
```

## Module Responsibilities

### Interface Layer
- Provides adapters for CLI, chat integrations (MS Teams, Slack), and REST API endpoints.
- Normalizes user input (text, attachments) into the internal message schema.

### Conversation Orchestrator
- Maintains conversation state, detects intents using Maestro intent list, and delegates to the Workflow Manager.
- Handles clarification prompts (e.g., requesting missing member ID) via reusable prompt templates.

### Workflow Manager
- **Call Flow Planner** – Maps Maestro intents to pre-defined call flow templates and instructions for Maestro navigation.
- **Request Forma Builder** – Assembles `{ memberId, memberName, requestDetails }` artifacts and tracks multiple requests per session.
- **Maestro Intent Router** – Scores and selects the best intent, returns available actions, and ensures coverage of all Maestro intents.

### Summarization Engine
- Accepts plain text or OCR output for screenshots.
- Uses LLM prompts tailored to Maestro/KM navigation, summarizing relevant sections and listing actionable steps/buttons.

### Knowledge & Reference Layer
- **Maestro Intent Catalog** – Configurable JSON or database containing intent names, descriptions, call flows, and navigation hints.
- **Reference Lookup Service** – Queries external sources:
  - Drugs.com monographs via public endpoints or scraping wrapper.
  - ICD-10 search APIs (e.g., CMS, NIH) for diagnoses.
  - FDA Device Classification/510(k) APIs for medical devices.
- Combines deterministic spell correction (SymSpell or Levenshtein) with LLM-backed disambiguation.
- Consolidates results with citations and normalized identifiers.

### Persistence & Audit Layer
- Session-level storage (in-memory, Redis, or database) for call context and request history.
- STAR log generator: `Situation`, `Task`, `Action`, `Result` captured for each request.
- Wrap-up aggregator (WP) compiles per-request STAR entries into a single session summary.

## Data Contracts
- `AdvocateRequest`: `{ memberId: string, memberName: string, details: string, channel: 'call'|'chat', intentId: string }`
- `CallFlowStep`: `{ stepOrder: number, prompt: string, maestroAction: string }`
- `ReferenceResult`: `{ normalizedTerm: string, type: 'medication'|'diagnosis'|'device', source: string, details: object, confidence: number }`
- `StarEntry`: `{ requestId: string, situation: string, task: string, action: string, result: string, timestamp: string }`
- `WrapUp`: `{ sessionId: string, advocate: string, entries: StarEntry[], summary: string }`

## External Integrations
- HTTP clients for Drugs.com, ICD-10 search, FDA Device APIs.
- Optional embeddings-based semantic search for Maestro/KM documents stored in a vector database (e.g., Pinecone, pgvector).
- OCR pipeline (e.g., Tesseract) for image-based screenshot ingestion.

## AI/LLM Usage Strategy
- Primary model orchestrated via OpenAI Assistants or Azure OpenAI (configurable).
- Prompt templates stored under `src/prompts/` including:
  - Call flow guidance prompt
  - Request Forma generation prompt
  - Reference cross-check prompt
  - STAR documentation prompt
  - Wrap-Up summarization prompt
- Use structured output (JSON schema validation) to guarantee field completeness.
- For spell correction, run deterministic normalization before LLM call to minimize token cost.

## Error Handling & Compliance
- Input validation ensures PHI/PII is handled securely (masking logs, encryption at rest).
- Expose audit trail for every external lookup (timestamp, query term, source).
- Graceful degradation when external references unavailable; agent returns fallback guidance.
- Configurable thresholds for confidence; escalate to human review when uncertainty is high.

## Deployment Considerations
- Deliver as Docker container (`node:22-alpine`) with environment-driven configuration.
- Feature flags for `offline` mode (no external lookups) and `compliance` mode (restricted logging).
- Observability hooks (OpenTelemetry) for latency and error monitoring.

## Future Enhancements
- Conversation transcription ingestion for auto-filling call forma.
- Integration with Maestro APIs (if available) to trigger navigation steps directly.
- Knowledge graph linking medications, diagnoses, devices for richer recommendations.
- Advocate performance analytics derived from STAR logs.

