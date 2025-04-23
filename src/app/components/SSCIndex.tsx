"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Chapter, Subtopic, englishChapters, gkChapters } from "./utils/data";

const SSCIndex: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<Subtopic | null>(
    null
  );
  const lastTapRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const type = mounted ? searchParams.get("type") || "english" : "english";
  const chapters = type === "gk" ? gkChapters : englishChapters;
  const title = type === "gk" ? "SSC GK Index" : "SSC English Index";

  const navigateToChapter = useCallback(
    (chapter: Chapter) => {
      const formattedName = chapter.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      router.push(`practice/${formattedName}`);
    },
    [router]
  );

  const handleChapterClick = useCallback(
    (chapter: Chapter) => {
      const now = Date.now();

      if (type === "gk") {
        if (lastTapRef.current && now - lastTapRef.current < 300) {
          lastTapRef.current = null;
          navigateToChapter(chapter);
        } else {
          lastTapRef.current = now;
          setTimeout(() => {
            if (Date.now() - (lastTapRef.current ?? 0) >= 300) {
              setSelectedChapter(chapter);
              setSelectedSubtopic(null);
            }
          }, 300);
        }
      } else {
        setSelectedChapter(chapter);
        setSelectedSubtopic(null);
        if (!chapter.subtopics || chapter.subtopics.length === 0) {
          navigateToChapter(chapter);
        }
      }
    },
    [navigateToChapter, type]
  );

  const handleSubtopicClick = (subtopic: Subtopic) => {
    if (subtopic.subtopics) {
      setSelectedSubtopic(subtopic);
    } else if (selectedChapter) {
      const formattedChapter = selectedChapter.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      const formattedSubtopic = subtopic.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

      router.push(`practice/${formattedChapter}?subtopic=${formattedSubtopic}`);
    }
  };

  const handleDetailedSubtopicClick = (subtopicName: string) => {
    if (selectedChapter && selectedSubtopic) {
      const formattedChapter = selectedChapter.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");
      const formattedSubtopic = subtopicName
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\w-]/g, "");

      router.push(`practice/${formattedChapter}?subtopic=${formattedSubtopic}`);
    }
  };

  if (!mounted) return null;

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto mt-4 sm:mt-16 text-gray-900 bg-white min-h-screen transition-all">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 sm:mb-6">
        {title}
      </h1>

      {!selectedChapter ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
          {chapters.map((chapter) => (
            <div
              key={chapter.name}
              role="button"
              tabIndex={0}
              onClick={() => handleChapterClick(chapter)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleChapterClick(chapter)
              }
              className="border border-gray-300 p-3 sm:p-5 rounded-lg cursor-pointer hover:bg-gray-100 hover:shadow-md transition-all text-center"
              aria-label={`${chapter.name} - ${chapter.questions} questions`}
            >
              <h2 className="text-base sm:text-lg font-semibold text-blue-600">
                {chapter.name}
              </h2>
              <p className="text-sm sm:text-base text-gray-700">
                Questions: {chapter.questions}
              </p>
              {chapter.subtopics && (
                <p className="text-xs text-blue-500 mt-1">
                  {chapter.subtopics.length} subtopics available
                </p>
              )}
            </div>
          ))}
        </div>
      ) : selectedSubtopic ? (
        <div>
          <button
            className="mb-4 text-blue-600 underline flex items-center text-sm sm:text-base p-2 sm:p-0"
            onClick={() => setSelectedSubtopic(null)}
            aria-label="Back to topics"
          >
            <span className="mr-1">←</span> Back to {selectedChapter.name}{" "}
            Topics
          </button>

          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            {selectedSubtopic.name} Subtopics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {Array.isArray(selectedSubtopic.subtopics) &&
              selectedSubtopic.subtopics.map((sub) => (
                <div
                  key={typeof sub === "string" ? sub : sub.name}
                  onClick={() =>
                    typeof sub === "string"
                      ? handleDetailedSubtopicClick(sub)
                      : handleSubtopicClick(sub as Subtopic)
                  }
                  className="border border-gray-300 p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-blue-50 transition flex flex-col"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    (typeof sub === "string"
                      ? handleDetailedSubtopicClick(sub)
                      : handleSubtopicClick(sub as Subtopic))
                  }
                >
                  <h3 className="font-semibold text-blue-700 text-sm sm:text-base">
                    {typeof sub === "string" ? sub : sub.name}
                  </h3>
                  {typeof sub !== "string" && (
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      Questions: {(sub as Subtopic).questions}
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      ) : (
        <div>
          <button
            className="mb-4 text-blue-600 underline flex items-center text-sm sm:text-base p-2 sm:p-0"
            onClick={() => setSelectedChapter(null)}
            aria-label="Back to chapters"
          >
            <span className="mr-1">←</span> Back to Chapters
          </button>

          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
            {selectedChapter.name} Topics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {selectedChapter.subtopics &&
              selectedChapter.subtopics.map((subtopic) => (
                <div
                  key={subtopic.name}
                  onClick={() => handleSubtopicClick(subtopic)}
                  className="border border-gray-300 p-3 sm:p-4 rounded-lg cursor-pointer hover:bg-blue-50 transition flex flex-col"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleSubtopicClick(subtopic)
                  }
                >
                  <h3 className="font-semibold text-blue-700 text-sm sm:text-base">
                    {subtopic.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    Questions: {subtopic.questions}
                  </p>
                  {subtopic.subtopics && (
                    <p className="text-xs text-blue-500 mt-1">
                      {subtopic.subtopics.length} detailed topics available
                    </p>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SSCIndex;
