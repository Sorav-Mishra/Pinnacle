"use client";

import { useRouter } from "next/navigation";

const staticGkSubTopics = [
  { name: "Dance", questions: 142 },
  { name: "Arts Personality", questions: 291 },
  { name: "Arts Awards", questions: 24 },
  { name: "Musical Instruments", questions: 65 },
  { name: "Festivals", questions: 170 },
  { name: "Fairs", questions: 20 },
  { name: "Songs", questions: 60 },
  { name: "Painting/ Dress/ Tribes", questions: 31 },
  { name: "First in India/World", questions: 67 },
  { name: "Sports", questions: 309 },
  { name: "Books and Authors", questions: 201 },
  { name: "Famous Personality", questions: 29 },
  { name: "Important Days", questions: 46 },
  { name: "States G.K.", questions: 113 },
  { name: "Organisation", questions: 68 },
  { name: "World G.K.", questions: 34 },
  { name: "Computer", questions: 104 },
  { name: "Full forms", questions: 13 },
  // ✅ Newly added from screenshot
  { name: "Religious Places", questions: 49 },
  { name: "Awards", questions: 46 },
  { name: "Important events", questions: 35 },
  { name: "Founder", questions: 9 },
  { name: "Schemes", questions: 86 },
  { name: "Miscellaneous", questions: 83 },
];

export default function StaticGkPage() {
  const router = useRouter();

  const handleTopicClick = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[\/.]+/g, "")
      .replace(/[^\w-]/g, "");
    router.push(`/static-gk/${slug}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto mt-16 text-gray-900 bg-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6">
        Static G.K. Topics
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {staticGkSubTopics.map((topic) => (
          <div
            key={topic.name}
            role="button"
            tabIndex={0}
            onClick={() => handleTopicClick(topic.name)}
            onKeyDown={(e) => e.key === "Enter" && handleTopicClick(topic.name)}
            className="border border-gray-300 p-5 rounded-lg cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all text-center"
          >
            <h2 className="text-lg font-semibold text-blue-600">
              {topic.name}
            </h2>
            <p className="text-gray-700">Questions: {topic.questions}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
