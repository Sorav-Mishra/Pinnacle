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
                <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-xs ml-1">
                  ({examName})
                </span>
              )}
            </span>
          </div>
          <button
            onClick={speakQuestion}
            className="ml-2 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900 flex-shrink-0"
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
                    "bg-green-100 dark:bg-green-700 border-green-600 text-green-800 dark:text-white":
                      showAnswer && key === question.correct_option,
                    "bg-red-100 dark:bg-red-700 border-red-600 text-red-800 dark:text-white":
                      showAnswer &&
                      key === selectedOption &&
                      key !== question.correct_option,
                    "hover:bg-blue-50 dark:hover:bg-blue-800 border-gray-300 dark:border-gray-600 dark:text-gray-200":
                      !showAnswer,
                  }
                )}
              >
                <span className="font-semibold">{key.toUpperCase()}.</span>{" "}
                {value}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakOption(key, value);
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900"
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
