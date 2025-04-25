// "use client";

// interface NavigationButtonsProps {
//   index: number;
//   totalQuestions: number;
//   showAnswer: boolean;
//   correctOption: string;
//   onNavigate: (dir: "prev" | "next", skip?: boolean) => void;
//   onShowAnswer: (key: string) => void;
//   onToggleSummary: () => void;
// }

// const NavigationButtons: React.FC<NavigationButtonsProps> = ({
//   index,
//   totalQuestions,
//   showAnswer,
//   correctOption,
//   onNavigate,
//   onShowAnswer,
//   onToggleSummary,
// }) => {
//   return (
//     <div className="grid grid-cols-2 gap-2 mt-6">
//       {/* Previous Button */}
//       <button
//         className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 rounded hover:bg-gray-300 text-xs sm:text-base disabled:opacity-50"
//         onClick={() => onNavigate("prev")}
//         disabled={index === 0}
//       >
//         ⬅️ Previous
//       </button>

//       {/* Conditional Buttons */}
//       {!showAnswer ? (
//         // When answer is not shown: Skip + Show Answer (full width)
//         <>
//           <button
//             className="px-3 py-2 sm:px-4 sm:py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs sm:text-base"
//             onClick={() => onNavigate("next", true)}
//           >
//             Skip ⏭️
//           </button>

//           <button
//             className="px-3 py-2 sm:px-4 sm:py-2 bg-green-500 text-white rounded hover:bg-green-600 text-xs sm:text-base col-span-2 mt-2"
//             onClick={() => onShowAnswer(correctOption)}
//           >
//             Show Answer ✅
//           </button>
//         </>
//       ) : index < totalQuestions - 1 ? (
//         // If answer is shown and it's not the last question: Next
//         <button
//           className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs sm:text-base"
//           onClick={() => onNavigate("next")}
//         >
//           Next ➡️
//         </button>
//       ) : (
//         // Last question and answer is shown: Show Summary
//         <button
//           className="px-3 py-2 sm:px-4 sm:py-2 bg-green-500 text-white rounded hover:bg-green-600 text-xs sm:text-base"
//           onClick={onToggleSummary}
//         >
//           Show Summary 📊
//         </button>
//       )}
//     </div>
//   );
// };

// export default NavigationButtons;

"use client";

interface NavigationButtonsProps {
  index: number;
  totalQuestions: number;
  showAnswer: boolean;
  correctOption: string;
  onNavigate: (dir: "prev" | "next", skip?: boolean) => void;
  onShowAnswer: (key: string) => void;
  onToggleSummary: () => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  index,
  totalQuestions,
  showAnswer,
  correctOption,
  onNavigate,
  onShowAnswer,
  onToggleSummary,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2 mt-6">
      {/* Previous Button */}
      <button
        className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-xs sm:text-base disabled:opacity-50"
        onClick={() => onNavigate("prev")}
        disabled={index === 0}
      >
        ⬅️ Previous
      </button>

      {/* Conditional Buttons */}
      {!showAnswer ? (
        <>
          <button
            className="px-3 py-2 sm:px-4 sm:py-2 bg-yellow-500 dark:bg-yellow-600 text-white rounded hover:bg-yellow-600 dark:hover:bg-yellow-700 text-xs sm:text-base"
            onClick={() => onNavigate("next", true)}
          >
            Skip ⏭️
          </button>

          <button
            className="px-3 py-2 sm:px-4 sm:py-2 bg-green-500 dark:bg-green-600 text-white rounded hover:bg-green-600 dark:hover:bg-green-700 text-xs sm:text-base col-span-2 mt-2"
            onClick={() => onShowAnswer(correctOption)}
          >
            Show Answer ✅
          </button>
        </>
      ) : index < totalQuestions - 1 ? (
        <button
          className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 text-xs sm:text-base"
          onClick={() => onNavigate("next")}
        >
          Next ➡️
        </button>
      ) : (
        <button
          className="px-3 py-2 sm:px-4 sm:py-2 bg-green-500 dark:bg-green-600 text-white rounded hover:bg-green-600 dark:hover:bg-green-700 text-xs sm:text-base"
          onClick={onToggleSummary}
        >
          Show Summary 📊
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;
