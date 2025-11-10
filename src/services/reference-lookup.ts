import axios from 'axios';
import { Spellchecker } from '../utils/spellcheck.js';

export type ReferenceType = 'medication' | 'diagnosis' | 'device';

export interface ReferenceLookupResult {
  normalizedTerm: string;
  type: ReferenceType;
  source: string;
  details: Record<string, unknown>;
  confidence: number;
}

export interface ReferenceLookupOptions {
  spellchecker?: Spellchecker;
}

export class ReferenceLookupService {
  constructor(private readonly options: ReferenceLookupOptions = {}) {}

  async lookup(term: string, type: ReferenceType): Promise<ReferenceLookupResult[]> {
    const normalized = this.options.spellchecker?.normalize(term) ?? {
      term,
      normalized: term,
      confidence: 1,
    };

    const queries: Promise<ReferenceLookupResult | null>[] = [];

    if (type === 'medication') {
      queries.push(this.queryDrugsCom(normalized.normalized));
    }
    if (type === 'diagnosis') {
      queries.push(this.queryIcd(normalized.normalized));
    }
    if (type === 'device') {
      queries.push(this.queryFda(normalized.normalized));
    }

    const results = await Promise.all(queries);
    return results.filter((item): item is ReferenceLookupResult => Boolean(item));
  }

  private async queryDrugsCom(term: string): Promise<ReferenceLookupResult | null> {
    try {
      const url = `https://www.drugs.com/search.php?searchterm=${encodeURIComponent(term)}`;
      const response = await axios.get<string>(url);
      if (!response.data.includes('search-results')) {
        return null;
      }
      return {
        normalizedTerm: term,
        type: 'medication',
        source: 'drugs.com',
        details: { url },
        confidence: 0.8,
      };
    } catch (error) {
      return null;
    }
  }

  private async queryIcd(term: string): Promise<ReferenceLookupResult | null> {
    try {
      const url = `https://icd10api.com/?code=${encodeURIComponent(term)}&desc=short&r=json`;
      const response = await axios.get(url);
      if (!response.data || response.data === 'Invalid Code') {
        return null;
      }
      return {
        normalizedTerm: term,
        type: 'diagnosis',
        source: 'icd10api.com',
        details: response.data,
        confidence: 0.75,
      };
    } catch (error) {
      return null;
    }
  }

  private async queryFda(term: string): Promise<ReferenceLookupResult | null> {
    try {
      const url = `https://api.fda.gov/device/classification.json?search=device_name:%22${encodeURIComponent(term)}%22`;
      const response = await axios.get(url);
      if (!response.data || !response.data.results) {
        return null;
      }
      return {
        normalizedTerm: term,
        type: 'device',
        source: 'api.fda.gov',
        details: response.data.results[0],
        confidence: 0.7,
      };
    } catch (error) {
      return null;
    }
  }
}
