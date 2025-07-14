"use client";
import { useState } from "react";
import { Question } from "./types";

export function useMcqSolution(
  questions: Question[],
  setQuestions: React.Dispatch<React.SetStateAction<Question[]>>
) {
  const [fetchingSolution, setFetchingSolution] = useState(false);

  const fetchSolution = async (questionIndex: number) => {
    // Skip if we already have the solution
    if (questions[questionIndex]?.solution) return;

    try {
      setFetchingSolution(true);
      // Simulate API call to fetch solution
      // In a real implementation, this would be an actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, generate a mock solution
      const mockSolution = {
        explanation: `This is the explanation for question ${
          questionIndex + 1
        }. The correct answer is ${questions[
          questionIndex
        ].correct_option.toUpperCase()}.`,
        incorrect_explanations: Object.keys(questions[questionIndex].options)
          .filter((key) => key !== questions[questionIndex].correct_option)
          .reduce(
            (acc, key) => ({
              ...acc,
              [key]: `Option ${key.toUpperCase()} is incorrect because it contradicts core principles.`,
            }),
            {}
          ),
      };

      // Update the question with the fetched solution
      const updatedQuestions = [...questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        solution: mockSolution,
      };

      setQuestions(updatedQuestions);
    } catch (error) {
      console.error("Failed to fetch solution:", error);
    } finally {
      setFetchingSolution(false);
    }
  };

  return {
    fetchingSolution,
    fetchSolution,
  };
}
