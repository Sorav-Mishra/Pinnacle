"use client";

import { useRouter } from "next/navigation";

const polityChapters = [
  { name: "Constitution", questions: 34 },
  { name: "Sources of Indian Constitution", questions: 13 },
  { name: "Article, Schedule, Parts and list", questions: 114 },
  { name: "Amendments", questions: 39 },
  { name: "Fundamental Rights and Duties", questions: 55 },
  { name: "Committee Reports", questions: 13 },
  { name: "Parliament", questions: 45 },
  { name: "President, Vice President and Prime Minister", questions: 50 },
  { name: "Judiciary", questions: 28 },
  { name: "Government Bodies", questions: 30 },
  { name: "Polity of neighbouring countries", questions: 5 },
  { name: "Miscellaneous", questions: 74 },
];

export default function PolityPage() {
  const router = useRouter();

  const handleClick = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[\/.]+/g, "")
      .replace(/[^\w-]/g, "");
    router.push(`/polity/${slug}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-16 text-gray-900 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        Polity Chapters
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {polityChapters.map((chapter) => (
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
