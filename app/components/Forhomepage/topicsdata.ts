// Topic interface
export interface Topic {
  name: string;
  path: string;
  description?: string;
}

// Topic data categorized by subject
export const englishTopics: Topic[] = [
  {
    name: "Spot the Error",
    path: "/ssc-pyqs/spot-the-error",
    description: "Identify grammatical errors in sentences",
  },
  {
    name: "Sentence Improvement",
    path: "/ssc-pyqs/sentence-improvement",
    description: "Enhance sentence structure and clarity",
  },
  {
    name: "Narration",
    path: "/ssc-pyqs/narration",
    description: "Direct and indirect speech practice",
  },
  {
    name: "Active/Passive",
    path: "/ssc-pyqs/active-passive",
    description: "Convert between active and passive voice",
  },
  {
    name: "Fill in the Blanks",
    path: "/ssc-pyqs/fill-in-the-blanks",
    description: "Complete sentences with appropriate words",
  },
  {
    name: "One Word Substitution",
    path: "/ssc-pyqs/one-word-substitution",
    description: "Replace phrases with single words",
  },
  {
    name: "Idioms",
    path: "/ssc-pyqs/idioms",
    description: "Common idiomatic expressions",
  },
  {
    name: "Synonyms",
    path: "/ssc-pyqs/synonyms",
    description: "Words with similar meanings",
  },
  {
    name: "Antonyms",
    path: "/ssc-pyqs/antonyms",
    description: "Words with opposite meanings",
  },
  {
    name: "Spelling Check",
    path: "/ssc-pyqs/spelling-check",
    description: "Identify and correct spelling errors",
  },
];

export const gkTopics: Topic[] = [
  {
    name: "Static GK",
    path: "/ssc-pyqs/static-gk",
    description: "General knowledge that remains constant",
  },
  {
    name: "Dance",
    path: "/ssc-pyqs/static-gk?subtopic=dance",
    description: "Classical and folk dances of India",
  },
  {
    name: "Arts Personality",
    path: "/ssc-pyqs/static-gk?subtopic=arts-personality",
    description: "Famous artists and their contributions",
  },
  {
    name: "Arts Awards",
    path: "/ssc-pyqs/static-gk?subtopic=arts-awards",
    description: "Recognitions in various art forms",
  },
  {
    name: "Musical Instruments",
    path: "/ssc-pyqs/static-gk?subtopic=musical-instruments",
    description: "Traditional and modern instruments",
  },
  {
    name: "Festivals",
    path: "/ssc-pyqs/static-gk?subtopic=festivals",
    description: "Cultural and religious celebrations",
  },
  {
    name: "Fairs",
    path: "/ssc-pyqs/static-gk?subtopic=fairs",
    description: "Traditional gatherings and expositions",
  },
  {
    name: "Songs, Painting, Dress, Tribes",
    path: "/ssc-pyqs/static-gk?subtopic=painting-dress-tribes",
    description: "Cultural heritage elements",
  },
  {
    name: "First in India/World",
    path: "/ssc-pyqs/static-gk?subtopic=first-in-india",
    description: "Pioneering achievements",
  },
  {
    name: "Sports",
    path: "/ssc-pyqs/static-gk?subtopic=sports",
    description: "Games, tournaments and athletes",
  },
  {
    name: "Books and Authors",
    path: "/ssc-pyqs/static-gk?subtopic=books-and-authors",
    description: "Literary works and their creators",
  },
  {
    name: "Famous Personality",
    path: "/ssc-pyqs/static-gk?subtopic=famous-personality",
    description: "Notable individuals and their achievements",
  },
  {
    name: "Important Days",
    path: "/ssc-pyqs/static-gk?subtopic=important-days",
    description: "Significant dates and commemorations",
  },
  {
    name: "States GK",
    path: "/ssc-pyqs/static-gk?subtopic=states-gk",
    description: "State-specific knowledge",
  },
  {
    name: "Organisation",
    path: "/ssc-pyqs/static-gk?subtopic=organisation",
    description: "Important institutions and bodies",
  },
  {
    name: "World GK",
    path: "/ssc-pyqs/static-gk?subtopic=world-gk",
    description: "International knowledge and facts",
  },
  {
    name: "Computer",
    path: "/ssc-pyqs/static-gk?subtopic=computer",
    description: "Computer basics and technology",
  },
  {
    name: "Full Forms",
    path: "/ssc-pyqs/static-gk?subtopic=full-forms",
    description: "Expanded forms of common abbreviations",
  },
  {
    name: "Religious Places",
    path: "/ssc-pyqs/static-gk?subtopic=religious-places",
    description: "Spiritual and worship sites",
  },
  {
    name: "Awards",
    path: "/ssc-pyqs/static-gk?subtopic=awards",
    description: "Honors and recognitions",
  },
  {
    name: "Important Events",
    path: "/ssc-pyqs/static-gk?subtopic=important-events",
    description: "Historical occurrences",
  },
  {
    name: "Founders",
    path: "/ssc-pyqs/static-gk?subtopic=founders",
    description: "Originators of organizations and movements",
  },
  {
    name: "Schemes",
    path: "/ssc-pyqs/static-gk?subtopic=schemes",
    description: "Government initiatives and programs",
  },
  {
    name: "Miscellaneous",
    path: "/ssc-pyqs/static-gk?subtopic=miscellaneous",
    description: "Other important GK topics",
  },
];

export const subjectTopics: Topic[] = [
  {
    name: "History",
    path: "/ssc-pyqs/history",
    description: "Study of past events",
  },
  {
    name: "Polity",
    path: "/ssc-pyqs/polity",
    description: "Constitutional framework and governance",
  },
  {
    name: "Geography",
    path: "/ssc-pyqs/geography",
    description: "Physical and human geography concepts",
  },
  {
    name: "Economics",
    path: "/ssc-pyqs/economics",
    description: "Economic theories and Indian economy",
  },
  {
    name: "Physics",
    path: "/ssc-pyqs/physics",
    description: "Laws of nature and properties of matter",
  },
  {
    name: "Chemistry",
    path: "/ssc-pyqs/chemistrychapters",
    description: "Study of matter, substances and reactions",
  },
  {
    name: "Biology",
    path: "/ssc-pyqs/biology",
    description: "Study of living organisms",
  },
  {
    name: "Current Affairs",
    path: "/ssc-pyqs/current-affairs",
    description: "Recent events and developments",
  },
];
