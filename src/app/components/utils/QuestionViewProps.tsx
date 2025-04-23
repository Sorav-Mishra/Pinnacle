// import React, { forwardRef } from "react";

// export type ProgressStatus = "unattempted" | "correct" | "wrong" | "skipped";

// export interface Question {
//   id: string;
//   question: string;
//   options: Record<string, string>;
//   correct_option: string;
//   examName?: string;
// }

// export interface ProgressHeaderProps {
//   questions: Question[];
//   currentIndex: number;
//   progress: Record<number, ProgressStatus>;
//   attempted: number;
//   correct: number;
//   wrong: number;
//   skipped: number;
//   showSummary: boolean;
//   completionPercentage: number;
//   onResetProgress: () => void;
//   onToggleSummary: () => void;
//   onNavigateToQuestion: (idx: number) => void;
// }

// const ProgressHeader = forwardRef<HTMLDivElement, ProgressHeaderProps>(
//   (props, ref) => {
//     const {
//       questions,
//       currentIndex,
//       progress,
//       attempted,
//       correct,
//       wrong,
//       skipped,
//       showSummary,
//       completionPercentage,
//       onResetProgress,
//       onToggleSummary,
//       onNavigateToQuestion,
//     } = props;

//     return (
//       <div ref={ref} className="p-4 bg-white shadow-md rounded-lg">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-lg font-bold">Progress</h2>
//           <div className="flex space-x-2">
//             <button
//               onClick={onToggleSummary}
//               className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
//             >
//               {showSummary ? "Hide Summary" : "Show Summary"}
//             </button>
//             <button
//               onClick={onResetProgress}
//               className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
//             >
//               Reset
//             </button>
//           </div>
//         </div>

//         <div className="mb-4">
//           <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//             <div
//               className="h-full bg-green-500"
//               style={{ width: `${completionPercentage}%` }}
//             ></div>
//           </div>
//           <div className="mt-2 text-sm text-gray-600">
//             {attempted} of {questions.length} questions answered (
//             {Math.round(completionPercentage)}%)
//           </div>
//         </div>

//         <div className="grid grid-cols-4 gap-2 mb-4">
//           <div className="text-center">
//             <div className="font-bold text-green-600">{correct}</div>
//             <div className="text-xs text-gray-500">Correct</div>
//           </div>
//           <div className="text-center">
//             <div className="font-bold text-red-600">{wrong}</div>
//             <div className="text-xs text-gray-500">Wrong</div>
//           </div>
//           <div className="text-center">
//             <div className="font-bold text-yellow-600">{skipped}</div>
//             <div className="text-xs text-gray-500">Skipped</div>
//           </div>
//           <div className="text-center">
//             <div className="font-bold text-blue-600">
//               {questions.length - attempted}
//             </div>
//             <div className="text-xs text-gray-500">Remaining</div>
//           </div>
//         </div>

//         {showSummary && (
//           <div className="flex flex-wrap gap-2">
//             {questions.map((_, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => onNavigateToQuestion(idx)}
//                 className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
//                   idx === currentIndex
//                     ? "bg-blue-500 text-white"
//                     : progress[idx] === "correct"
//                     ? "bg-green-100 text-green-700 border border-green-400"
//                     : progress[idx] === "wrong"
//                     ? "bg-red-100 text-red-700 border border-red-400"
//                     : progress[idx] === "skipped"
//                     ? "bg-yellow-100 text-yellow-700 border border-yellow-400"
//                     : "bg-gray-100 text-gray-700 border border-gray-300"
//                 }`}
//               >
//                 {idx + 1}
//               </button>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   }
// );

// ProgressHeader.displayName = "ProgressHeader";

// export default ProgressHeader;
"use client";

import React, { forwardRef } from "react";
import classNames from "classnames";
import { Question } from "./types";
import { useTTS } from "./ttsUtils";

interface QuestionViewProps {
  question: Question;
  index: number;
  trimmedQuestion: string;
  examName: string;
  showAnswer: boolean;
  selectedOption: string | null;
  onOptionClick: (key: string) => void;
}

const QuestionView = forwardRef<HTMLDivElement, QuestionViewProps>(
  (props, ref) => {
    const {
      question,
      index,
      trimmedQuestion,
      examName,
      showAnswer,
      selectedOption,
      onOptionClick,
    } = props;

    const { speak } = useTTS();

    const speakQuestion = () => {
      speak(question.question);
    };

    const speakOption = (key: string, text: string) => {
      speak(`Option ${key.toUpperCase()}: ${text}`);
    };

    return (
      <div ref={ref} className="mb-4">
        <div className="font-bold mb-4 text-[18px] sm:text-[18px] flex items-start">
          <div className="flex-grow">
            <span>
              {index + 1}. {trimmedQuestion}
              {examName && (
                <span className="text-gray-700 text-xs sm:text-xs ml-1">
                  ({examName})
                </span>
              )}
            </span>
          </div>
          <button
            onClick={speakQuestion}
            className="ml-2 p-1 rounded-full hover:bg-blue-100 flex-shrink-0"
            aria-label="Listen to question"
            title="Listen to question"
          >
            🔊
          </button>
        </div>
        <div className="grid gap-3 mt-4">
          {Object.entries(question.options).map(([key, value]) => (
            <div key={key} className="relative">
              <button
                disabled={showAnswer}
                onClick={() => onOptionClick(key)}
                className={classNames(
                  "w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg border transition duration-200 shadow-sm text-1xl sm:text-1xl font-semibold pr-10",
                  {
                    "bg-green-100 border-green-600 text-green-800":
                      showAnswer && key === question.correct_option,
                    "bg-red-100 border-red-600 text-red-800":
                      showAnswer &&
                      key === selectedOption &&
                      key !== question.correct_option,
                    "hover:bg-blue-50 border-gray-300": !showAnswer,
                  }
                )}
              >
                <span className="font-semibold">{key.toUpperCase()}.</span>{" "}
                {value}
              </button>
              {/* Speaker icon inside each option box, but right-aligned */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakOption(key, value);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-blue-100"
                aria-label={`Listen to option ${key}`}
                title={`Listen to option ${key}`}
              >
                🔊
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

QuestionView.displayName = "QuestionView";

export default QuestionView;
