"use client";

import { useRouter } from "next/navigation";

const currentAffairsChapters = [
  { name: "Important Facts 2024 - 25", questions: null },
  { name: "Important One liners 2024 - 25", questions: null },
  { name: "Sports", questions: 108 },
  { name: "Special Days", questions: 4 },
  { name: "Awards", questions: 41 },
  { name: "Persons", questions: 90 },
  { name: "States", questions: 38 },
  { name: "Schemes and projects", questions: 96 },
  { name: "Economics", questions: 24 },
  { name: "Polity", questions: 57 },
  { name: "Miscellaneous", questions: 42 },
];

export default function CurrentAffairsPage() {
  const router = useRouter();

  const handleClick = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[\/.]+/g, "")
      .replace(/[^\w-]/g, "");
    router.push(`/current-affairs/${slug}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-16 text-gray-900 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        Current Affairs Chapters
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {currentAffairsChapters.map((chapter) => (
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
            <p className="text-gray-700">
              Questions:{" "}
              {chapter.questions !== null ? chapter.questions : "N/A"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
