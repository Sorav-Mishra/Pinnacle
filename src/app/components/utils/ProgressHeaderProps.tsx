// import { useTTS } from "../ttsUtils";
// import { ProgressStatus, Question } from "./types";
// import { ProgressCircle } from "../ProgressComponents";
// import { useState, useRef, useEffect } from "react";
// import classNames from "classnames";

// interface ProgressHeaderProps {
//   questions: Question[];
//   currentIndex: number;
//   progress: Record<number, ProgressStatus>;
//   attempted: number;
//   correct: number;
//   wrong: number;
//   skipped: number;
//   completionPercentage: number;
//   onResetProgress: () => void;
//   onNavigateToQuestion: (index: number) => void;
// }

// const ProgressHeader: React.FC<ProgressHeaderProps> = ({
//   questions,
//   currentIndex,
//   progress,
//   attempted,
//   correct,
//   wrong,
//   skipped,
//   completionPercentage,
//   onResetProgress,
//   onNavigateToQuestion,
// }) => {
//   const [showSummary, setShowSummary] = useState(false);
//   const progressRef = useRef<HTMLDivElement>(null);

//   const { showTtsSettings, toggleTtsSettings, renderTtsSettingsPanel } =
//     useTTS();

//   useEffect(() => {
//     if (progressRef.current) {
//       const activeCircle = progressRef.current.querySelector(".ring-2");
//       if (activeCircle) {
//         activeCircle.scrollIntoView({ behavior: "smooth", inline: "center" });
//       }
//     }
//   }, [currentIndex]);

//   const getAccuracyPercentage = () =>
//     attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

//   const getUnansweredCount = () =>
//     questions.length - Object.keys(progress).length;

//   const toggleSummary = () => setShowSummary(!showSummary);

//   return (
//     <>
//       {/* Horizontal scrolling circle indicators */}
//       <div
//         ref={progressRef}
//         className="flex overflow-x-auto gap-2 py-3 px-1 rounded-lg bg-gray-100 shadow-inner mb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
//         style={{
//           scrollbarWidth: "thin",
//           scrollbarColor: "rgb(209 213 219) transparent",
//         }}
//       >
//         {questions.map((_, i) => (
//           <div
//             key={i}
//             className={classNames(
//               "w-7 h-7 sm:w-10 sm:h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition duration-200 cursor-pointer",
//               {
//                 "bg-green-500 text-white border-green-600":
//                   progress[i] === "correct",
//                 "bg-red-500 text-white border-red-600": progress[i] === "wrong",
//                 "bg-yellow-500 text-white border-yellow-600":
//                   progress[i] === "skipped",
//                 "bg-white text-gray-700 border-gray-300": !progress[i],
//                 "ring-2 ring-blue-500 scale-110 shadow-md": i === currentIndex,
//               }
//             )}
//             onClick={() => onNavigateToQuestion(i)}
//           >
//             {i + 1}
//           </div>
//         ))}
//       </div>

//       {/* Main content with left sidebar and right content area */}
//       <div className="flex flex-col md:flex-row gap-6">
//         {/* Left sidebar with progress circle and TTS settings */}
//         <div className="md:w-48 flex flex-col items-start">
//           {/* Progress Circle and Summary */}
//           <div className="flex flex-row w-full items-start gap-4">
//             {/* Progress Circle on the left */}
//             <div
//               className="cursor-pointer flex-shrink-0 z-10"
//               onClick={toggleSummary}
//               title="Click to toggle summary"
//             >
//               <ProgressCircle
//                 current={currentIndex + 1}
//                 total={questions.length}
//                 percentage={completionPercentage}
//               />
//             </div>

//             {/* Summary panel */}
//             {showSummary && (
//               <div className="flex-1 p-4 bg-blue-50 border border-blue-200 rounded-lg z-20 animate-fade-in">
//                 <div className="flex justify-between items-center mb-2">
//                   <h3 className="font-bold">Progress Summary</h3>
//                   <button
//                     onClick={onResetProgress}
//                     className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-xs font-medium"
//                   >
//                     Reset Progress
//                   </button>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm text-gray-600">Completion</p>
//                     <p className="font-semibold">
//                       {completionPercentage}% ({Object.keys(progress).length}/
//                       {questions.length})
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Accuracy</p>
//                     <p className="font-semibold">
//                       {getAccuracyPercentage()}% ({correct}/{attempted})
//                     </p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Correct Answers</p>
//                     <p className="font-semibold text-green-600">{correct}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Wrong Answers</p>
//                     <p className="font-semibold text-red-600">{wrong}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Skipped Questions</p>
//                     <p className="font-semibold text-yellow-600">{skipped}</p>
//                   </div>
//                   <div>
//                     <p className="text-sm text-gray-600">Unanswered</p>
//                     <p className="font-semibold">{getUnansweredCount()}</p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* TTS settings button below the circle */}
//           <button
//             onClick={toggleTtsSettings}
//             className="mt-4 p-2 bg-blue-100 hover:bg-blue-200 rounded-lg w-36 md:w-48 flex items-center justify-center"
//           >
//             <span className="mr-2">🔊</span>
//             <span className="text-sm">TTS Settings</span>
//           </button>

//           {/* TTS Settings Panel */}
//           {showTtsSettings && (
//             <div className="mt-3 bg-gray-100 p-3 rounded-lg w-full md:w-48">
//               {renderTtsSettingsPanel()}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default ProgressHeader;

"use client";

import { forwardRef } from "react";
import { useTTS } from "./ttsUtils";
import { ProgressStatus, Question } from "./types";
import { ProgressCircle } from "./ProgressComponents";
import classNames from "classnames";

interface ProgressHeaderProps {
  questions: Question[];
  currentIndex: number;
  progress: Record<number, ProgressStatus>;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  showSummary: boolean;
  completionPercentage: number;
  onResetProgress: () => void;
  onToggleSummary: () => void;
  onNavigateToQuestion: (index: number) => void;
}

const ProgressHeader = forwardRef<HTMLDivElement, ProgressHeaderProps>(
  (props, ref) => {
    const {
      questions,
      currentIndex,
      progress,
      attempted,
      correct,
      wrong,
      skipped,
      showSummary,
      completionPercentage,
      onResetProgress,
      onToggleSummary,
      onNavigateToQuestion,
    } = props;

    const { showTtsSettings, toggleTtsSettings, renderTtsSettingsPanel } =
      useTTS();

    const getAccuracyPercentage = () =>
      attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

    const getUnansweredCount = () =>
      questions.length - Object.keys(progress).length;

    return (
      <>
        {/* Horizontal scrolling circle indicators */}
        <div
          ref={ref}
          className="flex overflow-x-auto gap-2 py-3 px-1 rounded-lg bg-gray-100 shadow-inner scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgb(209 213 219) transparent",
          }}
        >
          {questions.map((_, i) => (
            <div
              key={i}
              className={classNames(
                "w-7 h-7 sm:w-10 sm:h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition duration-200 cursor-pointer",
                {
                  "bg-green-500 text-white border-green-600":
                    progress[i] === "correct",
                  "bg-red-500 text-white border-red-600":
                    progress[i] === "wrong",
                  "bg-yellow-500 text-white border-yellow-600":
                    progress[i] === "skipped",
                  "bg-white text-gray-700 border-gray-300": !progress[i],
                  "ring-2 ring-blue-500 scale-110 shadow-md":
                    i === currentIndex,
                }
              )}
              onClick={() => onNavigateToQuestion(i)}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Main content with left sidebar and right content area */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar with progress circle and TTS settings */}
          <div className="md:w-48 flex flex-col items-start">
            {/* Progress Circle and Summary */}
            <div className="flex flex-row w-full items-start gap-4">
              {/* Progress Circle on the left */}
              <div
                className="cursor-pointer flex-shrink-0 z-10"
                onClick={onToggleSummary}
                title="Click to toggle summary"
              >
                <ProgressCircle
                  current={currentIndex + 1}
                  total={questions.length}
                  percentage={completionPercentage}
                />
              </div>

              {/* Summary panel */}
              {showSummary && (
                <div className="flex-1 p-4 bg-blue-50 border border-blue-200 rounded-lg z-20 animate-fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">Progress Summary</h3>
                    <button
                      onClick={onResetProgress}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-xs font-medium"
                    >
                      Reset Progress
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Completion</p>
                      <p className="font-semibold">
                        {completionPercentage}% ({Object.keys(progress).length}/
                        {questions.length})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Accuracy</p>
                      <p className="font-semibold">
                        {getAccuracyPercentage()}% ({correct}/{attempted})
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Correct Answers</p>
                      <p className="font-semibold text-green-600">{correct}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Wrong Answers</p>
                      <p className="font-semibold text-red-600">{wrong}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Skipped Questions</p>
                      <p className="font-semibold text-yellow-600">{skipped}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Unanswered</p>
                      <p className="font-semibold">{getUnansweredCount()}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* TTS settings button below the circle */}
            <button
              onClick={toggleTtsSettings}
              className="mt-0 p-2 bg-blue-100 hover:bg-blue-200 rounded-lg w-36 md:w-48 flex items-center justify-center"
            >
              <span className="mr-2">🔊</span>
              <span className="text-sm">TTS Settings</span>
            </button>

            {/* TTS Settings Panel */}
            {showTtsSettings && (
              <div className="mt-3 bg-gray-100 p-3 rounded-lg w-full md:w-48">
                {renderTtsSettingsPanel()}
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
);

ProgressHeader.displayName = "ProgressHeader";

export default ProgressHeader;
