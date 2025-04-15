"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Define a type for history topics
type HistoryTopic = {
  name: string;
  questions: number;
};

const ancientHistoryTopics: HistoryTopic[] = [
  { name: "Prehistoric And Indus Valley", questions: 28 },
  { name: "Vedic Age", questions: 21 },
  { name: "Jainism", questions: 4 },
  { name: "Buddhism", questions: 23 },
  { name: "Mahajanapadas", questions: 8 },
  { name: "Mauryan Dynasty", questions: 37 },
  { name: "Gupta Dynasty", questions: 23 },
  { name: "Vardhana Dynasty", questions: 9 },
  { name: "Chola Dynasty", questions: 19 },
  { name: "Miscellaneous", questions: 101 },
];

const medievalHistoryTopics: HistoryTopic[] = [
  { name: "Foreign Invasions", questions: 6 },
  { name: "Delhi Sultanate", questions: 13 },
  { name: "Slave Dynasty", questions: 21 },
  { name: "Khilji Dynasty", questions: 13 },
  { name: "Tughlaq Dynasty", questions: 10 },
  { name: "Sayyid Dynasty", questions: 2 },
  { name: "Lodi Dynasty", questions: 7 },
  { name: "Mughal Period", questions: 11 },
  { name: "Babur", questions: 11 },
  { name: "Humayun and Sher Shah Suri", questions: 10 },
  { name: "Akbar", questions: 23 },
  { name: "Jahangir", questions: 5 },
  { name: "Shah Jahan", questions: 7 },
  { name: "Aurangzeb", questions: 6 },
  { name: "Sikh Guru", questions: 4 },
  { name: "Maratha Empire", questions: 3 },
  { name: "Vijaynagar Empire", questions: 18 },
  { name: "Wars and Treaties", questions: 25 },
  { name: "Miscellaneous", questions: 67 },
];

const modernHistoryTopics: HistoryTopic[] = [
  { name: "The Revolt of 1857", questions: 10 },
  { name: "Governors and Viceroys", questions: 32 },
  { name: "British acts and Policies", questions: 45 },
  { name: "Partition of Bengal and Swadeshi Movements", questions: 7 },
  { name: "Gandhian Era", questions: 33 },
  { name: "Expansion of British Rule", questions: 11 },
  { name: "The Revolutionaries", questions: 41 },
  { name: "Struggle for Independence", questions: 28 },
  { name: "Socio Religious Reforms", questions: 74 },
  { name: "Indian National Congress and Its Sessions", questions: 26 },
  { name: "Muslim league", questions: 4 },
  { name: "Miscellaneous", questions: 78 },
];

export default function HistoryPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<
    "ancient" | "medieval" | "modern"
  >("ancient");

  const handleTopicClick = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[\/.]+/g, "")
      .replace(/[^\w-]/g, "");
    router.push(`/history/${slug}`);
  };

  const renderTopics = () => {
    let topics: HistoryTopic[] = [];

    if (activeCategory === "ancient") {
      topics = ancientHistoryTopics;
    } else if (activeCategory === "medieval") {
      topics = medievalHistoryTopics;
    } else if (activeCategory === "modern") {
      topics = modernHistoryTopics;
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {topics.map((topic) => (
          <div
            key={topic.name}
            role="button"
            tabIndex={0}
            onClick={() => handleTopicClick(topic.name)}
            onKeyDown={(e) => e.key === "Enter" && handleTopicClick(topic.name)}
            className="border border-gray-300 p-4 sm:p-5 rounded-lg cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all text-center"
          >
            <h2 className="text-base sm:text-lg font-semibold text-green-700">
              {topic.name}
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              Questions: {topic.questions}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto mt-4 sm:mt-16 text-gray-900 bg-white min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">
        {activeCategory === "ancient" && "Ancient History Topics"}
        {activeCategory === "medieval" && "Medieval History Topics"}
        {activeCategory === "modern" && "Modern History Topics"}
      </h1>

      <div className="flex flex-col items-center mb-4 sm:mb-6">
        {/* Mobile dropdown (accessible) */}
        <div className="sm:hidden w-full max-w-xs mb-4">
          <label htmlFor="history-category" className="sr-only">
            Select History Category
          </label>
          <select
            id="history-category"
            className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            value={activeCategory}
            onChange={(e) =>
              setActiveCategory(
                e.target.value as "ancient" | "medieval" | "modern"
              )
            }
          >
            <option value="ancient">Ancient History</option>
            <option value="medieval">Medieval History</option>
            <option value="modern">Modern History</option>
          </select>
        </div>

        {/* Tab buttons for larger screens */}
        <div
          className="hidden sm:inline-flex rounded-md shadow-sm"
          role="group"
        >
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              activeCategory === "ancient"
                ? "bg-green-700 text-white"
                : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => setActiveCategory("ancient")}
          >
            Ancient History
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium ${
              activeCategory === "medieval"
                ? "bg-green-700 text-white"
                : "bg-white text-gray-900 border-t border-b border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => setActiveCategory("medieval")}
          >
            Medieval History
          </button>
          <button
            type="button"
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              activeCategory === "modern"
                ? "bg-green-700 text-white"
                : "bg-white text-gray-900 border border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => setActiveCategory("modern")}
          >
            Modern History
          </button>
        </div>
      </div>

      {renderTopics()}
    </div>
  );
}
