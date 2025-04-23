export interface Question {
  id?: string | number;
  question: string;
  questionNumber?: number;
  // Add other properties as needed
}

export interface SubtopicRange {
  start: number;
  end: number;
  count: number; // The total number of questions in this range
}

// Define a mapping of subtopics to their question ranges
const subtopicRanges: Record<string, SubtopicRange> = {
  // Existing subtopics
  Dance: { start: 1, end: 142, count: 142 },
  "arts-personality": { start: 143, end: 433, count: 291 },
  "arts-awards": { start: 434, end: 457, count: 24 },
  "musical-instruments": { start: 458, end: 522, count: 65 },
  Festivals: { start: 523, end: 602, count: 80 },
  Fairs: { start: 603, end: 712, count: 110 },
  Songs: { start: 713, end: 772, count: 60 },
  paintingdresstribes: { start: 773, end: 803, count: 31 },
  "first-in-indiaword": { start: 804, end: 870, count: 67 },
  Sports: { start: 871, end: 1179, count: 309 },
  "books-and-authors": { start: 1180, end: 1380, count: 201 },
  "famous-personality": { start: 1381, end: 1409, count: 29 },
  "important-days": { start: 1410, end: 1455, count: 46 },
  "states-gk": { start: 1456, end: 1568, count: 113 },
  Organisation: { start: 1569, end: 1636, count: 68 },
  "world-gk": { start: 1637, end: 1670, count: 34 },
  Computer: { start: 1671, end: 1774, count: 104 },
  "full-forms": { start: 1775, end: 1787, count: 13 },
  "religious-places": { start: 1788, end: 1836, count: 49 },
  Awards: { start: 1837, end: 1882, count: 46 },
  "important-events": { start: 1883, end: 1917, count: 35 },
  Founder: { start: 1918, end: 1926, count: 9 },
  Schemes: { start: 1927, end: 2012, count: 86 },
  Miscellaneous: { start: 2013, end: 2095, count: 83 },

  // Ancient History topics
  "prehistoric-cultures-in-india": { start: 1, end: 28, count: 28 },
  "vedic-age": { start: 29, end: 49, count: 21 },
  jainism: { start: 50, end: 53, count: 4 },
  buddhism: { start: 54, end: 76, count: 23 },
  mahajanapadas: { start: 77, end: 84, count: 8 },
  "mauryan-dynasty": { start: 85, end: 121, count: 37 },
  "gupta-dynasty": { start: 122, end: 144, count: 23 },
  "vardhana-dynasty": { start: 145, end: 153, count: 9 },
  "chola-dynasty": { start: 154, end: 172, count: 19 },
  miscellaneous: { start: 173, end: 273, count: 101 },
  // Medieval History topics
  "foreign-invasions": { start: 274, end: 279, count: 6 },
  "delhi-sultanate": { start: 280, end: 292, count: 13 },
  "slave-dynasty": { start: 293, end: 313, count: 21 },
  "khilji-dynasty": { start: 314, end: 326, count: 13 },
  "tughlaq-dynasty": { start: 327, end: 336, count: 10 },
  "sayyid-dynasty": { start: 337, end: 338, count: 2 },
  "lodi-dynasty": { start: 339, end: 345, count: 7 },
  "mughal-period": { start: 346, end: 356, count: 11 },
  babur: { start: 357, end: 367, count: 11 },
  "humayun-and-sher-shah-suri": { start: 368, end: 377, count: 10 },
  akbar: { start: 378, end: 400, count: 23 },
  jahangir: { start: 401, end: 405, count: 5 },
  "shah-jahan": { start: 406, end: 412, count: 7 },
  aurangzeb: { start: 413, end: 418, count: 6 },
  "sikh-guru": { start: 419, end: 422, count: 4 },
  "maratha-empire": { start: 423, end: 425, count: 3 },
  "vijayanagar-empire": { start: 426, end: 443, count: 18 },
  "wars-and-treaties": { start: 444, end: 468, count: 25 },
  "medieval-Miscellaneous": { start: 469, end: 535, count: 67 },

  // Modern History topics
  "revolt-of-1857": { start: 536, end: 545, count: 10 },
  "governors-and-viceroys": { start: 546, end: 577, count: 32 },
  "british-acts-and-policies": { start: 578, end: 622, count: 45 },
  "partition-and-swadeshi-movements": { start: 623, end: 629, count: 7 },
  "gandhian-era": { start: 630, end: 662, count: 33 },
  "expansion-of-british-rule": { start: 663, end: 673, count: 11 },
  revolutionaries: { start: 674, end: 714, count: 41 },
  "struggle-for-independence": { start: 715, end: 742, count: 28 },
  "socio-religious-reforms": { start: 743, end: 816, count: 74 },
  "indian-national-congress-sessions": { start: 817, end: 842, count: 26 },
  "muslim-league": { start: 843, end: 846, count: 4 },
  "Modern Miscellaneous": { start: 847, end: 924, count: 78 },

  // Polity topics with continuous start and end values

  constitution: { start: 1, end: 34, count: 34 },
  "sources-of-indian-constitution": { start: 35, end: 47, count: 13 },
  "article-schedule-parts-list": { start: 48, end: 161, count: 114 },
  amendments: { start: 162, end: 200, count: 39 },
  "fundamental-rights-and-duties": { start: 201, end: 255, count: 55 },
  "committee-reports": { start: 256, end: 268, count: 13 },
  parliament: { start: 269, end: 313, count: 45 },
  "president-vice-president-prime-minister": {
    start: 314,
    end: 363,
    count: 50,
  },
  judiciary: { start: 364, end: 391, count: 28 },
  "government-bodies": { start: 392, end: 421, count: 30 },
  "polity-of-neighbouring-countries": { start: 422, end: 426, count: 5 },
  "polity-miscellaneous": { start: 427, end: 500, count: 74 },

  // Geography topics
  "solar-system-and-its-planets": { start: 1, end: 44, count: 44 },
  "longitudes-and-latitudes": { start: 45, end: 60, count: 16 },
  "continents-and-oceans": { start: 61, end: 102, count: 42 },
  "neighbouring-countries-of-india": { start: 103, end: 117, count: 15 },
  "indian-drainage-system": { start: 118, end: 240, count: 123 },
  "world-drainage-system": { start: 241, end: 253, count: 13 },
  "minerals-and-energy-resources-in-india": { start: 254, end: 301, count: 48 },
  agriculture: { start: 302, end: 375, count: 74 },
  soil: { start: 376, end: 408, count: 33 },
  vegetation: { start: 409, end: 448, count: 40 },
  climate: { start: 449, end: 507, count: 59 },
  industries: { start: 508, end: 539, count: 32 },
  "biosphere-reserves": { start: 540, end: 573, count: 34 },
  "physiographic-division-of-india": { start: 574, end: 618, count: 45 },
  transportation: { start: 619, end: 663, count: 45 },
  population: { start: 664, end: 757, count: 94 },
  atmosphere: { start: 758, end: 775, count: 18 },
  rocks: { start: 776, end: 791, count: 16 },
  mountain: { start: 792, end: 829, count: 38 },
  volcano: { start: 830, end: 832, count: 3 },
  "world-geography-and-map": { start: 833, end: 851, count: 19 },
  "Geography Miscellaneous": { start: 852, end: 912, count: 61 },

  // Economics topics
  "basics-of-economy": { start: 1, end: 33, count: 33 },
  "concepts-of-demand-and-supply": { start: 34, end: 44, count: 11 },
  "cost-production-consumption-market": { start: 45, end: 60, count: 16 },
  "national-income-inflation-budget-taxation-gdp": {
    start: 61,
    end: 154,
    count: 94,
  },
  "money-banking-financial-institutions": {
    start: 155,
    end: 262,
    count: 108,
  },
  "navratna-maharatna-psus": { start: 263, end: 270, count: 8 },
  "international-organisations": { start: 271, end: 274, count: 4 },
  "government-schemes": { start: 275, end: 312, count: 38 },
  "five-year-plans": { start: 313, end: 335, count: 23 },
  "indian-economy-central-problems-planning": {
    start: 336,
    end: 375,
    count: 40,
  },
  "stock-debentures-foreign-trade": { start: 376, end: 386, count: 11 },
  "fiscal-monetary-policy": { start: 387, end: 408, count: 22 },
  "economics-miscellaneous": { start: 409, end: 444, count: 36 },

  // Physics topics
  "light-and-optics": { start: 1, end: 22, count: 22 },
  "heat-and-thermodynamics": { start: 23, end: 36, count: 14 },
  "fluid-mechanics": { start: 37, end: 41, count: 5 },
  "electric-current-and-effects": { start: 42, end: 81, count: 40 },
  "force-and-pressure": { start: 82, end: 115, count: 34 },
  sound: { start: 116, end: 124, count: 9 },
  gravitation: { start: 125, end: 130, count: 6 },
  "work-and-energy": { start: 131, end: 141, count: 11 },
  wave: { start: 142, end: 154, count: 13 },
  radioactivity: { start: 155, end: 160, count: 6 },
  discoveries: { start: 161, end: 196, count: 36 },
  "units-and-measurements": { start: 197, end: 230, count: 34 },
  "physics-miscellaneous": { start: 231, end: 251, count: 21 },

  // Chemistry topics
  "structure-of-atom": { start: 1, end: 24, count: 24 },
  "metals-non-metals-alloys": { start: 25, end: 53, count: 29 },
  "acid-bases-salt": { start: 54, end: 83, count: 30 },
  metallurgy: { start: 84, end: 93, count: 10 },
  "organic-chemistry": { start: 94, end: 158, count: 65 },
  "periodic-table": { start: 159, end: 221, count: 63 },
  "ideal-gas-law": { start: 222, end: 230, count: 9 },
  "chemical-properties": { start: 231, end: 279, count: 49 },
  solutions: { start: 280, end: 291, count: 12 },
  "chemistry-in-everyday-life": { start: 292, end: 356, count: 65 },
  "chemistry-discoveries": { start: 357, end: 400, count: 44 },
  "common-name": { start: 401, end: 438, count: 38 },
  "chemistry-miscellaneous": { start: 439, end: 486, count: 48 },

  // Biology topics
  "scientific-name": { start: 1, end: 8, count: 8 },
  "nutrition-in-animals": { start: 9, end: 37, count: 29 },
  "nutrition-in-plants": { start: 38, end: 63, count: 26 },
  "deficiency-and-diseases": { start: 64, end: 130, count: 67 },
  "reproduction-in-animals": { start: 131, end: 139, count: 9 },
  "reproduction-in-plants": { start: 140, end: 149, count: 10 },
  "cell-basic-unit-of-life": { start: 150, end: 251, count: 102 },
  "sensory-organs": { start: 252, end: 258, count: 7 },
  "circulatory-system": { start: 259, end: 269, count: 11 },
  "excretory-system": { start: 270, end: 273, count: 4 },
  "endocrine-exocrine-system": { start: 274, end: 280, count: 7 },
  "respiratory-system": { start: 281, end: 291, count: 11 },
  "digestive-system": { start: 292, end: 308, count: 17 },
  "nervous-system": { start: 309, end: 315, count: 7 },
  "skeleton-system": { start: 316, end: 323, count: 8 },
  "plant-kingdom": { start: 324, end: 377, count: 54 },
  "animal-kingdom": { start: 378, end: 439, count: 62 },
  "micro-organism": { start: 440, end: 460, count: 21 },
  "enzymes-and-hormones": { start: 461, end: 476, count: 16 },
  "discoveries-and-vaccines": { start: 477, end: 502, count: 26 },
  "scientific-study": { start: 503, end: 510, count: 8 },
  "biology-miscellaneous": { start: 511, end: 558, count: 48 },

  // Current Affairs topics
  sports: { start: 1, end: 108, count: 108 },
  "special-days": { start: 109, end: 112, count: 4 },
  "awards-current": { start: 113, end: 153, count: 41 },
  persons: { start: 154, end: 243, count: 90 },
  states: { start: 244, end: 281, count: 38 },
  "schemes-and-projects": { start: 282, end: 377, count: 96 },
  "economics-current": { start: 378, end: 401, count: 24 },
  "polity-current": { start: 402, end: 458, count: 57 },
  "current-affairs-miscellaneous": { start: 459, end: 500, count: 42 },
};

export default subtopicRanges;

// Helper functions
export function getSubtopicForQuestionNumber(
  questionNumber: number
): string | null {
  for (const [subtopic, range] of Object.entries(subtopicRanges)) {
    if (questionNumber >= range.start && questionNumber <= range.end) {
      return subtopic;
    }
  }
  return null;
}

export function getAllSubtopics(): string[] {
  return Object.keys(subtopicRanges);
}

export function getSubtopicRange(subtopic: string): SubtopicRange | undefined {
  // First try exact match
  if (subtopicRanges[subtopic]) {
    return subtopicRanges[subtopic];
  }

  // Then try case-insensitive match
  const normalizedSubtopic = subtopic.toLowerCase();
  const key = Object.keys(subtopicRanges).find(
    (k) => k.toLowerCase() === normalizedSubtopic
  );

  return key ? subtopicRanges[key] : undefined;
}

/**
 * Extract question number from a Question object
 * Tries multiple strategies to find a valid number
 */
export function extractQuestionNumber(question: Question): number {
  // Strategy 1: Check for explicit questionNumber property
  if (
    question.questionNumber !== undefined &&
    question.questionNumber !== null
  ) {
    return Number(question.questionNumber);
  }

  // Strategy 2: Extract from ID if it contains a number
  if (question.id !== undefined && question.id !== null) {
    const match = String(question.id).match(/(\d+)/);
    if (match) return parseInt(match[1], 10);
  }

  // Strategy 3: Check if question text starts with a number followed by dot or parenthesis
  const startMatch = question.question.match(/^(\d+)[\.\)]/);
  if (startMatch) return parseInt(startMatch[1], 10);

  // Strategy 4: Look for a number at the beginning of the question even without a separator
  const beginningMatch = question.question.match(/^(\d+)/);
  if (beginningMatch) return parseInt(beginningMatch[1], 10);

  // Strategy 5: Look for any number in the question as a last resort
  const anyNumberMatch = question.question.match(/\b(\d+)\b/);
  if (anyNumberMatch) return parseInt(anyNumberMatch[1], 10);

  // Default if no number found
  return 0;
}
