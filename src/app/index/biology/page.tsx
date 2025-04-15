"use client";

import { useRouter } from "next/navigation";

const biologyChapters = [
  { name: "Scientific Name", questions: 8 },
  { name: "Nutrition in Animals", questions: 29 },
  { name: "Nutrition in plants", questions: 26 },
  { name: "Deficiency and Diseases", questions: 67 },
  { name: "Reproduction in Animals", questions: 9 },
  { name: "Reproduction in Plants", questions: 10 },
  { name: "Cell: Basic Unit of life", questions: 102 },
  { name: "Sensory Organs", questions: 7 },
  { name: "Circulatory System", questions: 11 },
  { name: "Excretory System", questions: 4 },
  { name: "Endocrine/Exocrine system", questions: 7 },
  { name: "Respiratory system", questions: 7 },
  { name: "Digestive system", questions: 17 },
  { name: "Nervous system", questions: 7 },
  { name: "Skeleton system", questions: 8 },
  { name: "Plant Kingdom", questions: 54 },
  { name: "Animal Kingdom", questions: 62 },
  { name: "Micro organism", questions: 21 },
  { name: "Enzymes and Hormones", questions: 16 },
  { name: "Discoveries and Vaccines", questions: 26 },
  { name: "Scientific Study", questions: 8 },
  { name: "Miscellaneous", questions: 48 },
];

export default function BiologyPage() {
  const router = useRouter();

  const handleClick = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[\/.]+/g, "")
      .replace(/[^\w-]/g, "");
    router.push(`/biology/${slug}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-16 text-gray-900 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">
        Biology Chapters
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {biologyChapters.map((chapter) => (
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
