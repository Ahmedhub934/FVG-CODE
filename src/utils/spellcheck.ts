import stringSimilarity from 'string-similarity';

export interface SpellcheckResult {
  term: string;
  normalized: string;
  confidence: number;
}

export class Spellchecker {
  constructor(private readonly vocabulary: string[]) {}

  normalize(term: string): SpellcheckResult {
    const cleaned = term.trim().toLowerCase();
    const match = stringSimilarity.findBestMatch(
      cleaned,
      this.vocabulary.map((item) => item.toLowerCase())
    );

    if (match.bestMatch.rating < 0.5) {
      return { term, normalized: cleaned, confidence: match.bestMatch.rating };
    }

    return {
      term,
      normalized: this.vocabulary[match.bestMatchIndex],
      confidence: match.bestMatch.rating,
    };
  }
}
