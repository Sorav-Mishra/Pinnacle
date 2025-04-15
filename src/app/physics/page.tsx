"use client";

import { useRouter } from "next/navigation";

const physicsChapters = [
  { name: "Light and Optics", questions: 22 },
  { name: "Heat and Thermodynamics", questions: 14 },
  { name: "Fluid Mechanics", questions: 5 },
  { name: "Electric Current and Its Effects", questions: 40 },
  { name: "Force and Pressure", questions: 34 },
  { name: "Sound", questions: 9 },
  { name: "Gravitation", questions: 6 },
  { name: "Work and Energy", questions: 11 },
  { name: "Wave", questions: 13 },
  { name: "Radioactivity", questions: 6 },
  { name: "Discoveries", questions: 36 },
  { name: "Units and Measurements", questions: 34 },
  { name: "Miscellaneous", questions: 21 },
];

export default function PhysicsPage() {
  const router = useRouter();

  const handleClick = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[\/.]+/g, "")
      .replace(/[^\w-]/g, "");
    router.push(`/physics/${slug}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-16 text-gray-900 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        Physics Chapters
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {physicsChapters.map((chapter) => (
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
