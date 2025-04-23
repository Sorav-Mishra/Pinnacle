"use client";
import { create } from "zustand";
import { ProgressStatus } from "./types";

interface McqState {
  index: number;
  progress: Record<number, ProgressStatus>;
  attempted: number;
  correct: number;
  wrong: number;
  skipped: number;
  selectedOption: string | null;
  showAnswer: boolean;
  showSummary: boolean;

  setIndex: (index: number) => void;
  setProgress: (progress: Record<number, ProgressStatus>) => void;
  setAttempted: (attempted: number) => void;
  setCorrect: (correct: number) => void;
  setWrong: (wrong: number) => void;
  setSkipped: (skipped: number) => void;
  setSelectedOption: (option: string | null) => void;
  setShowAnswer: (show: boolean) => void;
  toggleShowSummary: () => void;
  resetAllProgress: () => void;
}

// Create the store
export const useMcqState = create<McqState>((set) => ({
  index: 0,
  progress: {},
  attempted: 0,
  correct: 0,
  wrong: 0,
  skipped: 0,
  selectedOption: null,
  showAnswer: false,
  showSummary: false,

  setIndex: (index) => set({ index }),
  setProgress: (progress) => set({ progress }),
  setAttempted: (attempted) => set({ attempted }),
  setCorrect: (correct) => set({ correct }),
  setWrong: (wrong) => set({ wrong }),
  setSkipped: (skipped) => set({ skipped }),
  setSelectedOption: (option) => set({ selectedOption: option }),
  setShowAnswer: (show) => set({ showAnswer: show }),
  toggleShowSummary: () =>
    set((state) => ({ showSummary: !state.showSummary })),
  resetAllProgress: () => {
    if (
      window.confirm(
        "Are you sure you want to reset all progress? This cannot be undone."
      )
    ) {
      set({
        progress: {},
        attempted: 0,
        correct: 0,
        wrong: 0,
        skipped: 0,
        index: 0,
        selectedOption: null,
        showAnswer: false,
        showSummary: false,
      });
    }
  },
}));

// Create a store factory function to make chapter-specific stores
const createChapterStore = () => useMcqState;

// Map to store chapter-specific store instances
const chapterStores: Record<string, typeof useMcqState> = {};

// Hook to use McqState with chapter context
export function useMcqWithChapter(chapter: string) {
  // Create or retrieve a chapter-specific store instance
  if (!chapterStores[chapter]) {
    chapterStores[chapter] = createChapterStore();
  }

  return chapterStores[chapter];
}
