// "use client";

// import React, { useCallback, useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";

// interface Chapter {
//   name: string;
//   questions: number;
//   source: string;
// }

// const englishChapters: Chapter[] = [
//   { name: "Spot the Error", questions: 716, source: "api" },
//   { name: "Sentence Improvement", questions: 790, source: "json" },
//   { name: "Narration", questions: 245, source: "api" },
//   { name: "Active Passive", questions: 250, source: "api" },
//   { name: "Para Jumble", questions: 207, source: "api" },
//   { name: "Fill in the Blanks", questions: 665, source: "api" },
//   { name: "Cloze Test", questions: 860, source: "api" },
//   { name: "Comprehension", questions: 248, source: "api" },
//   { name: "One Word Substitution", questions: 681, source: "api" },
//   { name: "Idioms", questions: 762, source: "api" },
//   { name: "Synonyms", questions: 765, source: "api" },
//   { name: "Antonyms", questions: 740, source: "api" },
//   { name: "Spelling Check", questions: 632, source: "api" },
//   { name: "Homonyms", questions: 42, source: "api" },
// ];

// const gkChapters: Chapter[] = [
//   { name: "Static G.K.", questions: 2095, source: "pdf" },
//   { name: "History", questions: 924, source: "pdf" },
//   { name: "Polity", questions: 500, source: "pdf" },
//   { name: "Geography", questions: 909, source: "pdf" },
//   { name: "Economics", questions: 444, source: "pdf" },
//   { name: "Physics", questions: 251, source: "pdf" },
//   { name: "chemistrychapters", questions: 486, source: "pdf" },
//   { name: "Biology", questions: 552, source: "pdf" },
//   { name: "Current Affairs", questions: 500, source: "pdf" },
// ];

// const SSCIndex: React.FC = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   const type = mounted ? searchParams.get("type") || "english" : "english";
//   const chapters = type === "gk" ? gkChapters : englishChapters;
//   const title = type === "gk" ? "SSC GK Index" : "SSC English Index";

//   const handleChapterClick = useCallback(
//     (chapter: Chapter) => {
//       const formattedName = chapter.name
//         .toLowerCase()
//         .replace(/\s+/g, "-")
//         .replace(/[^\w-]/g, "");

//       if (type === "gk") {
//         router.push(`index2/${formattedName}`);
//       } else {
//         router.push(`practice/${formattedName}`);
//       }
//     },
//     [router, type]
//   );

//   if (!mounted) return null;

//   return (
//     <div className="p-6 max-w-4xl mx-auto mt-16 text-gray-900 bg-white min-h-screen transition-all">
//       <h1 className="text-3xl font-bold text-center mb-6">{title}</h1>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {chapters.map((chapter) => (
//           <div
//             key={chapter.name}
//             role="button"
//             tabIndex={0}
//             onClick={() => handleChapterClick(chapter)}
//             onKeyDown={(e) => e.key === "Enter" && handleChapterClick(chapter)}
//             className="border border-gray-300 p-5 rounded-lg cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all text-center"
//           >
//             <h2 className="text-lg font-semibold text-blue-600">
//               {chapter.name}
//             </h2>
//             <p className="text-gray-700">Questions: {chapter.questions}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SSCIndex;

"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface Subtopic {
  name: string;
  questions: number;
}

interface Chapter {
  name: string;
  questions: number;
  source: string;
  subtopics?: Subtopic[];
}

const englishChapters: Chapter[] = [
  { name: "Spot the Error", questions: 716, source: "api" },
  { name: "Sentence Improvement", questions: 790, source: "json" },
  { name: "Narration", questions: 245, source: "api" },
  { name: "Active Passive", questions: 250, source: "api" },
  { name: "Para Jumble", questions: 207, source: "api" },
  { name: "Fill in the Blanks", questions: 665, source: "api" },
  { name: "Cloze Test", questions: 860, source: "api" },
  { name: "Comprehension", questions: 248, source: "api" },
  { name: "One Word Substitution", questions: 681, source: "api" },
  { name: "Idioms", questions: 762, source: "api" },
  { name: "Synonyms", questions: 765, source: "api" },
  { name: "Antonyms", questions: 740, source: "api" },
  { name: "Spelling Check", questions: 632, source: "api" },
  { name: "Homonyms", questions: 42, source: "api" },
];

const gkChapters: Chapter[] = [
  {
    name: "Static G.K.",
    questions: 2095,
    source: "pdf",
    subtopics: [
      { name: "Dance", questions: 142 },
      { name: "Arts Personality", questions: 291 },
      { name: "Sports", questions: 309 },
      { name: "Books and Authors", questions: 201 },
      { name: "Awards", questions: 202 },
      { name: "Important Days", questions: 210 },
      { name: "Miscellaneous", questions: 120 },
      { name: "Science and Tech", questions: 210 },
      { name: "Capitals and Currencies", questions: 210 },
    ],
  },
  {
    name: "History",
    questions: 924,
    source: "pdf",
    subtopics: [
      { name: "Ancient", questions: 300 },
      { name: "Medieval", questions: 300 },
      { name: "Modern", questions: 324 },
    ],
  },
  {
    name: "Polity",
    questions: 500,
    source: "pdf",
    subtopics: [
      { name: "Indian Constitution", questions: 250 },
      { name: "Indian Governance", questions: 250 },
    ],
  },
  {
    name: "Geography",
    questions: 909,
    source: "pdf",
    subtopics: [
      { name: "World Geography", questions: 409 },
      { name: "Indian Geography", questions: 500 },
    ],
  },
  {
    name: "Economics",
    questions: 444,
    source: "pdf",
    subtopics: [
      { name: "Indian Economy", questions: 300 },
      { name: "Economy Terminologies", questions: 144 },
    ],
  },
  {
    name: "Physics",
    questions: 251,
    source: "pdf",
    subtopics: [
      { name: "Laws & Motion", questions: 100 },
      { name: "Sound, Light, Electricity", questions: 151 },
    ],
  },
  {
    name: "chemistrychapters",
    questions: 486,
    source: "pdf",
    subtopics: [
      { name: "Periodic Table", questions: 200 },
      { name: "Chemical Reactions", questions: 286 },
    ],
  },
  {
    name: "Biology",
    questions: 552,
    source: "pdf",
    subtopics: [
      { name: "Human Body", questions: 300 },
      { name: "Plants & Animals", questions: 252 },
    ],
  },
  {
    name: "Current Affairs",
    questions: 500,
    source: "pdf",
    subtopics: [
      { name: "National", questions: 250 },
      { name: "International", questions: 250 },
    ],
  },
];

const SSCIndex: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const type = mounted ? searchParams.get("type") || "english" : "english";
  const chapters = type === "gk" ? gkChapters : englishChapters;
  const title = type === "gk" ? "SSC GK Index" : "SSC English Index";

  const handleChapterClick = useCallback(
    (chapter: Chapter) => {
      if (type === "gk") {
        setSelectedChapter(chapter); // Show subtopics
      } else {
        const formattedName = chapter.name
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");
        router.push(`practice/${formattedName}`);
      }
    },
    [router, type]
  );

  const handleSubtopicClick = (subtopicName: string) => {
    const formattedSubtopic = subtopicName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    router.push(`index2/${formattedSubtopic}`);
  };

  if (!mounted) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto mt-16 text-gray-900 bg-white min-h-screen transition-all">
      <h1 className="text-3xl font-bold text-center mb-6">{title}</h1>

      {!selectedChapter ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {chapters.map((chapter) => (
            <div
              key={chapter.name}
              role="button"
              tabIndex={0}
              onClick={() => handleChapterClick(chapter)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleChapterClick(chapter)
              }
              className="border border-gray-300 p-5 rounded-lg cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all text-center"
            >
              <h2 className="text-lg font-semibold text-blue-600">
                {chapter.name}
              </h2>
              <p className="text-gray-700">Questions: {chapter.questions}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <button
            className="mb-4 text-blue-600 underline"
            onClick={() => setSelectedChapter(null)}
          >
            ← Back to Chapters
          </button>
          <h2 className="text-2xl font-bold mb-4">
            {selectedChapter.name} Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedChapter.subtopics?.map((sub) => (
              <div
                key={sub.name}
                onClick={() => handleSubtopicClick(sub.name)}
                className="border border-gray-300 p-4 rounded-lg cursor-pointer hover:bg-blue-50 transition"
              >
                <h3 className="font-semibold text-blue-700">{sub.name}</h3>
                <p className="text-sm text-gray-600">
                  Questions: {sub.questions}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SSCIndex;
