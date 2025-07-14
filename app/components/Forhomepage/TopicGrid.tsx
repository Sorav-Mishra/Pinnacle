"use client";

import React from "react";
import Link from "next/link";
import { Topic } from "./topicsdata";

interface TopicGridProps {
  title: string;
  topics: Topic[];
  color: "blue" | "green" | "purple";
  icon: React.ReactNode;
}

const TopicGrid: React.FC<TopicGridProps> = ({
  title,
  topics,
  color,
  icon,
}) => {
  // Map color theme to classes for light and dark mode
  const colorClasses = {
    blue: {
      icon: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
      button:
        "bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800 dark:hover:bg-blue-900/60",
    },
    green: {
      icon: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
      button:
        "bg-green-50 text-green-800 hover:bg-green-100 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-800 dark:hover:bg-green-900/60",
    },
    purple: {
      icon: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
      button:
        "bg-purple-50 text-purple-800 hover:bg-purple-100 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-800 dark:hover:bg-purple-900/60",
    },
  };

  return (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-2 rounded-lg ${colorClasses[color].icon}`}>
          {icon}
        </div>
        <h2 className="text-2xl font-bold dark:text-white">{title}</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {topics.map((topic, index) => (
          <Link
            key={index}
            href={topic.path}
            className={`py-3 px-4 rounded-xl text-sm font-medium border shadow-sm transition-all hover:shadow-md hover:-translate-y-1 flex flex-col items-center justify-center h-24 ${colorClasses[color].button}`}
            title={topic.description || topic.name}
          >
            <span className="text-center line-clamp-2">{topic.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TopicGrid;
