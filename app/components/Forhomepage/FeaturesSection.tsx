import React from "react";
import { CheckCircle, BookOpen, Flame } from "lucide-react";

const FeaturesSection: React.FC = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 py-16">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
          Why Choose Our Platform?
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
            <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle
                className="text-blue-600 dark:text-blue-400"
                size={24}
              />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">
              Real Exam Questions
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Practice with actual questions from previous SSC exams for
              authentic preparation experience.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
            <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <BookOpen
                className="text-green-600 dark:text-green-400"
                size={24}
              />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">
              Comprehensive Coverage
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Access topics across all subjects required for SSC exams in one
              organized platform.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
            <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Flame
                className="text-purple-600 dark:text-purple-400"
                size={24}
              />
            </div>
            <h3 className="text-xl font-bold mb-2 dark:text-white">
              Performance Tracking
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your progress with detailed analytics and focus on areas
              that need improvement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
