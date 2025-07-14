import React from "react";
import { BookOpen, CheckCircle, Flame } from "lucide-react";

const StatsBar: React.FC = () => {
  // Stats data for the metrics section
  const stats = [
    {
      icon: <BookOpen size={32} />,
      value: "20,000+",
      label: "Practice Questions",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: <CheckCircle size={32} />,
      value: "100+",
      label: "Topic Categories",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: <Flame size={32} />,
      value: "5+",
      label: "Years Coverage",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: <BookOpen size={32} />,
      value: "24/7",
      label: "Learning Access",
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: <CheckCircle size={32} />,
      value: "Absolutely",
      label: "Free",
      color: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md py-8">
      <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-3"
          >
            <div className={stat.color}>{stat.icon}</div>
            <div className={`text-3xl font-bold mt-2 ${stat.color}`}>
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StatsBar;
