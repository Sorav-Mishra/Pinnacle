// // Types for the MCQ Practice component

// export type ProgressStatus = "correct" | "wrong" | "skipped";

// export type Solution = {
//   explanation: string;
//   incorrect_explanations?: Record<string, string>;
// };

// export type Question = {
//   question: string;
//   options: Record<string, string>;
//   correct_option: string;
//   exam?: string;
//   solution?: Solution;
// };

// export type SummaryPanelProps = {
//   completionPercentage: number;
//   accuracyPercentage: number;
//   totalQuestions: number;
//   progressCount: number;
//   attempted: number;
//   correct: number;
//   wrong: number;
//   skipped: number;
//   unanswered: number;
//   onClose: () => void;
//   onReset: () => void;
// };

// export type ProgressCircleProps = {
//   current: number;
//   total: number;
//   percentage: number;
// };

// export type ProgressBarProps = {
//   percentage: number;
//   color: string;
// };

// types.ts

export type ProgressStatus = "correct" | "wrong" | "skipped";

export interface Question {
  question: string;
  options: Record<string, string>;
  correct_option: string;
  exam?: string;
  solution?: {
    explanation: string;
    incorrect_explanations?: Record<string, string>;
  };
}

export interface ProgressCircleProps {
  current: number;
  total: number;
  percentage: number;
}

export interface ProgressBarProps {
  percentage: number;
  color: string;
}

export interface SummaryPanelProps {
  completionPercentage: number;
  accuracyPercentage: number;
  totalQuestions: number;
  progressCount: number;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  unanswered: number;
  onClose: () => void;
  onReset: () => void;
}
