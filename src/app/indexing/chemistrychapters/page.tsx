"use client";

import { useRouter } from "next/navigation";

const chemistryChapters = [
  { name: "Structure of Atom", questions: 24 },
  { name: "Metals, Non-metals and Alloys", questions: 29 },
  { name: "Acid, Bases and Salt", questions: 30 },
  { name: "Metallurgy", questions: 10 },
  { name: "Organic Chemistry", questions: 65 },
  { name: "Periodic table", questions: 63 },
  { name: "Ideal Gas Law", questions: 9 },
  { name: "Chemical Properties", questions: 49 },
  { name: "Solutions", questions: 12 },
  { name: "Chemistry in Everyday life", questions: 65 },
  { name: "Discoveries", questions: 44 },
  { name: "Common Name", questions: 38 },
  { name: "Miscellaneous", questions: 48 },
];

export default function ChemistryPage() {
  const router = useRouter();

  const handleClick = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[\/.]+/g, "")
      .replace(/[^\w-]/g, "");
    router.push(`/chemistry/${slug}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-16 text-gray-900 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        Chemistry Chapters
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {chemistryChapters.map((chapter) => (
          <div
            key={chapter.name}
            role="button"
            tabIndex={0}
            onClick={() => handleClick(chapter.name)}
            onKeyDown={(e) => e.key === "Enter" && handleClick(chapter.name)}
            className="border border-gray-300 p-5 rounded-lg cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all text-center"
          >
            <h2 className="text-lg font-semibold text-blue-600">
              {chapter.name}
            </h2>
            <p className="text-gray-700">Questions: {chapter.questions}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
