import {
  ProgressCircleProps,
  ProgressBarProps,
  SummaryPanelProps,
} from "./types";

export const ProgressCircle = ({
  current,
  total,
  percentage,
}: ProgressCircleProps) => {
  const radius = 40;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#3b82f6"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
        />
        {/* Current question number */}
        <text
          x="50"
          y="45"
          textAnchor="middle"
          fontSize="18"
          fontWeight="bold"
          fill="#111827"
        >
          {current}
        </text>
        <text x="50" y="65" textAnchor="middle" fontSize="12" fill="#4b5563">
          of {total}
        </text>
      </svg>
    </div>
  );
};

export const ProgressBar = ({ percentage, color }: ProgressBarProps) => (
  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
    <div
      className="h-2 rounded-full transition-all duration-300 ease-in-out"
      style={{
        width: `${percentage}%`,
        backgroundColor:
          color === "blue" ? "#3b82f6" : color === "green" ? "#10b981" : color,
      }}
    ></div>
  </div>
);

export const SummaryPanel = ({
  completionPercentage,
  accuracyPercentage,
  totalQuestions,
  progressCount,
  attempted,
  correct,
  wrong,
  skipped,
  unanswered,
  onClose,
  onReset,
}: SummaryPanelProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="space-y-4 text-sm md:text-base">
        {/* Completion */}
        <div>
          <p className="text-gray-600">Completion</p>
          <div className="flex justify-between items-center">
            <span className="font-semibold">{completionPercentage}%</span>
            <span className="text-gray-600">
              {progressCount}/{totalQuestions}
            </span>
          </div>
          <ProgressBar percentage={completionPercentage} color="blue" />
        </div>

        {/* Accuracy */}
        <div>
          <p className="text-gray-600">Accuracy</p>
          <div className="flex justify-between items-center">
            <span className="font-semibold">{accuracyPercentage}%</span>
            <span className="text-gray-600">
              {correct}/{attempted}
            </span>
          </div>
          <ProgressBar percentage={accuracyPercentage} color="green" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-b py-4">
          <div>
            <p className="text-gray-600">Answered</p>
            <p className="font-semibold">{attempted}</p>
          </div>
          <div>
            <p className="text-gray-600">Unanswered</p>
            <p className="font-semibold">{unanswered}</p>
          </div>
          <div>
            <p className="text-gray-600">Correct</p>
            <p className="font-semibold">{correct}</p>
          </div>
          <div>
            <p className="text-gray-600">Wrong</p>
            <p className="font-semibold">{wrong}</p>
          </div>
          <div>
            <p className="text-gray-600">Skipped</p>
            <p className="font-semibold">{skipped}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row justify-between gap-2">
          <button
            onClick={onReset}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full sm:w-auto"
          >
            Reset
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 w-full sm:w-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
