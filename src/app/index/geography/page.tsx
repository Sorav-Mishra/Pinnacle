"use client";

import { useRouter } from "next/navigation";

const geographyChapters = [
  { name: "Solar system and its planets", questions: 44 },
  { name: "Longitudes and latitudes", questions: 16 },
  { name: "Continents and Oceans", questions: 42 },
  { name: "Neighbouring Countries of India", questions: 12 },
  { name: "Indian Drainage System", questions: 123 },
  { name: "World Drainage System", questions: 13 },
  { name: "Minerals and Energy Resources in India", questions: 48 },
  { name: "Agriculture", questions: 74 },
  { name: "Soil", questions: 33 },
  { name: "Vegetation", questions: 40 },
  { name: "Climate", questions: 59 },
  { name: "Industries", questions: 32 },
  { name: "Biosphere Reserves", questions: 34 },
  { name: "Physiographic Division of India", questions: 45 },
  { name: "Transportation", questions: 45 },
  { name: "Population", questions: 94 },
  { name: "Atmosphere", questions: 18 },
  { name: "Rocks", questions: 16 },
  { name: "Mountain", questions: 38 },
  { name: "Volcano", questions: 3 },
  { name: "World geography and Map", questions: 19 },
  { name: "Miscellaneous", questions: 61 },
];

export default function GeographyPage() {
  const router = useRouter();

  const handleClick = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[\/.]+/g, "")
      .replace(/[^\w-]/g, "");
    router.push(`/geography/${slug}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-16 text-gray-900 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        Geography Chapters
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {geographyChapters.map((chapter) => (
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
