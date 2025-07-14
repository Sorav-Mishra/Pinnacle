"use client";
import { Question } from "./types";
import { useTTS } from "./ttsUtils";

interface SolutionViewProps {
  solution: Question["solution"];
  fetchingSolution: boolean;
  onFetchSolution: () => void;
}

const SolutionView: React.FC<SolutionViewProps> = ({
  solution,
  fetchingSolution,
  onFetchSolution,
}) => {
  const { speak } = useTTS();

  const speakSolution = () => {
    if (!solution) return;
    speak(solution.explanation);
  };

  return (
    <div className="p-3 sm:p-4 border rounded bg-yellow-50 dark:bg-yellow-900 dark:text-gray-100 dark:border-yellow-800 text-[14px] sm:text-base font-semibold text-gray-700 mb-6 animate-fade-in">
      {fetchingSolution ? (
        <div className="flex items-center justify-center p-4">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
          <span>Fetching solution...</span>
        </div>
      ) : solution ? (
        <>
          <div className="flex items-start justify-between mb-2">
            <p className="font-bold">Solution:</p>
            <button
              onClick={speakSolution}
              className="p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900"
              aria-label="Listen to solution"
              title="Listen to solution"
            >
              🔊
            </button>
          </div>
          <p className="mb-3">{solution.explanation}</p>
          {solution.incorrect_explanations && (
            <div>
              <p className="font-bold mb-1">Why other options are incorrect:</p>
              <ul className="list-disc pl-4 sm:pl-5">
                {Object.entries(solution.incorrect_explanations).map(
                  ([key, exp]) => (
                    <li key={key} className="mb-1">
                      <strong>{key.toUpperCase()}:</strong> {exp}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-2">
          <button
            onClick={onFetchSolution}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Fetch Solution
          </button>
        </div>
      )}
    </div>
  );
};

export default SolutionView;
