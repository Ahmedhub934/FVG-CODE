# Reference Lookup Design

The Reference Lookup Service supports medical medications, diagnoses, and devices by orchestrating deterministic normalization and API-backed retrieval.

## Spell Correction Pipeline
1. Clean input (trim/lowercase).
2. Run vocabulary-based fuzzy matching using cosine similarity on `string-similarity`.
3. If confidence ≥ 0.5, adopt the highest-scoring vocabulary item; otherwise fallback to raw term.
4. Downstream API results include the fuzzy-matching confidence to surface low-confidence hits.

## External Sources
- **Drugs.com** – HTML search endpoint scraped for medication match URLs.
- **ICD10API** – JSON API returning code descriptions for diagnoses.
- **FDA** – `api.fda.gov` Device Classification endpoint for medical devices.

Network calls are wrapped in try/catch to prevent cascading failures. Each source returns structured `ReferenceLookupResult` with `normalizedTerm`, `details`, `confidence`, and `source` metadata.
