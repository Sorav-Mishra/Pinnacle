"use client";

import React from "react";
import { useRouter } from "next/navigation";

const subjects = ["English", "GK", "Reasoning", "Math"];

const SubjectsPage: React.FC = () => {
  const router = useRouter();

  const handleSubjectClick = (subject: string) => {
    const lowerCase = subject.toLowerCase();

    // If subject is English or GK, route to index with type query
    if (lowerCase === "english" || lowerCase === "gk") {
      // router.push(`/index?type=${lowerCase}`);
      router.push(`/index2?type=${subject.toLowerCase()}`);
    } else {
      // For other subjects, you can route to their specific pages
      router.push(`/subject/${lowerCase}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 sm:p-10">
      <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-center">
        Select a Subject
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xs sm:max-w-md">
        {subjects.map((subject) => (
          <button
            key={subject}
            onClick={() => handleSubjectClick(subject)}
            className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl shadow-md transition-all w-full text-lg"
          >
            {subject}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectsPage;
