"use client";

import { useRouter } from "next/navigation";

const economicsChapters = [
  { name: "Basics of Economy", questions: 33 },
  { name: "Concepts of Demand and Supply", questions: 11 },
  { name: "Cost, Production, Consumption and Market", questions: 16 },
  {
    name: "National Income, Inflation, Budget, Taxation and GDP",
    questions: 94,
  },
  { name: "Money Banking and Financial Institutions", questions: 108 },
  { name: "Navratna / Maharatna / PSUs", questions: 8 },
  { name: "International Organisations", questions: 4 },
  { name: "Government Schemes", questions: 38 },
  { name: "Five - Year Plans", questions: 23 },
  { name: "Indian Economy : Central Problems and Planning", questions: 40 },
  { name: "Stock, Debentures and Foreign trade", questions: 11 },
  { name: "Fiscal Policy and Monetary Policy", questions: 22 },
  { name: "Miscellaneous", questions: 36 },
];

export default function EconomicsPage() {
  const router = useRouter();

  const handleClick = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[\/.]+/g, "")
      .replace(/[^\w-]/g, "");
    router.push(`/economics/${slug}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-16 text-gray-900 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        Economics Chapters
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {economicsChapters.map((chapter) => (
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
