// "use client";
// import { Question, ProgressStatus } from "./types";

// interface NavigationProps {
//   index: number;
//   questions: Question[];
//   progress: Record<number, ProgressStatus>;
//   showAnswer: boolean;
//   attempted: number;
//   correct: number;
//   wrong: number;
//   skipped: number;
//   setIndex: (index: number) => void;
//   setProgress: (progress: Record<number, ProgressStatus>) => void;
//   setAttempted: (attempted: number) => void;
//   setCorrect: (correct: number) => void;
//   setWrong: (wrong: number) => void;
//   setSkipped: (skipped: number) => void;
//   setSelectedOption: (option: string | null) => void;
//   setShowAnswer: (show: boolean) => void;
// }

// export function useMcqNavigation({
//   index,
//   questions,
//   progress,
//   attempted,
//   correct,
//   wrong,
//   skipped,
//   setIndex,
//   setProgress,
//   setAttempted,
//   setCorrect,
//   setWrong,
//   setSkipped,
//   setSelectedOption,
//   setShowAnswer,
// }: Omit<NavigationProps, "showAnswer">) {
//   const navigate = (dir: "prev" | "next", skip: boolean = false) => {
//     if (skip && !progress[index]) {
//       setSkipped(skipped + 1);
//       setProgress({ ...progress, [index]: "skipped" });
//     }

//     setSelectedOption(null);
//     setShowAnswer(false);

//     if (dir === "next") {
//       setIndex(Math.min(index + 1, questions.length - 1));
//     } else {
//       setIndex(Math.max(index - 1, 0));
//     }
//   };

//   const handleOptionClick = (
//     key: string,
//     correctOption: string,
//     onAnswerShown?: () => void
//   ) => {
//     if (progress[index]) return;

//     setSelectedOption(key);
//     setShowAnswer(true);
//     setAttempted(attempted + 1);

//     if (key === correctOption) {
//       setCorrect(correct + 1);
//       setProgress({ ...progress, [index]: "correct" });
//     } else {
//       setWrong(wrong + 1);
//       setProgress({ ...progress, [index]: "wrong" });
//     }

//     if (onAnswerShown) {
//       onAnswerShown();
//     }
//   };

//   return {
//     navigate,
//     handleOptionClick,
//   };
// }

"use client";
import { Question, ProgressStatus } from "./types";

interface NavigationProps {
  index: number;
  questions: Question[];
  progress: Record<number, ProgressStatus>;
  showAnswer: boolean; // Include this in the interface
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  setIndex: (index: number) => void;
  setProgress: (progress: Record<number, ProgressStatus>) => void;
  setAttempted: (attempted: number) => void;
  setCorrect: (correct: number) => void;
  setWrong: (wrong: number) => void;
  setSkipped: (skipped: number) => void;
  setSelectedOption: (option: string | null) => void;
  setShowAnswer: (show: boolean) => void;
}

export function useMcqNavigation({
  index,
  questions,
  progress,
  showAnswer, // Include this in the parameters
  attempted,
  correct,
  wrong,
  skipped,
  setIndex,
  setProgress,
  setAttempted,
  setCorrect,
  setWrong,
  setSkipped,
  setSelectedOption,
  setShowAnswer,
}: NavigationProps) {
  // Use the full NavigationProps type, not Omit
  const navigate = (dir: "prev" | "next", skip: boolean = false) => {
    if (skip && !progress[index]) {
      setSkipped(skipped + 1);
      setProgress({ ...progress, [index]: "skipped" });
    }

    setSelectedOption(null);
    setShowAnswer(false);

    if (dir === "next") {
      setIndex(Math.min(index + 1, questions.length - 1));
    } else {
      setIndex(Math.max(index - 1, 0));
    }
  };

  const handleOptionClick = (
    key: string,
    correctOption: string,
    onAnswerShown?: () => void
  ) => {
    if (progress[index]) return;

    setSelectedOption(key);
    setShowAnswer(true);
    setAttempted(attempted + 1);

    if (key === correctOption) {
      setCorrect(correct + 1);
      setProgress({ ...progress, [index]: "correct" });
    } else {
      setWrong(wrong + 1);
      setProgress({ ...progress, [index]: "wrong" });
    }

    if (onAnswerShown) {
      onAnswerShown();
    }
  };

  return {
    navigate,
    handleOptionClick,
  };
}
