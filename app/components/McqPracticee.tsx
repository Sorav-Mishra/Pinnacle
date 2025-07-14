// "use client";

// interface SubtopicRange {
//   start: number;
//   end: number;
// }

// interface DebugInfo {
//   subtopic?: string;
//   range?: SubtopicRange | null;
//   error?: string;
//   totalQuestions?: number;
//   filteredCount?: number;
//   sampleQuestionNumbers?: number[];
//   numberRange?: string;
// }

// import { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, useSearchParams, useRouter } from "next/navigation";
// import { Question } from "./utils/types";
// import { useMcqState } from "./utils/McqState";
// import { useMcqNavigation } from "./utils/NavigationProps";
// import { useMcqSolution } from "./utils/useMcqSolution";
// import QuestionView from "./utils/QuestionViewProps";
// import SolutionView from "./utils/SolutionViewProps";
// import NavigationButtons from "./utils/NavigationButtons";
// import ProgressHeader from "./utils/ProgressHeaderProps";
// import { getSubtopicRange } from "./utils/subtopicRanges";

// const McqPractice = () => {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const chapter = params?.chapter as string;
//   const subtopic = searchParams?.get("subtopic") || "";
//   const exam = searchParams?.get("exam") || "";

//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [allQuestions, setAllQuestions] = useState<Question[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [trimmedQuestion, setTrimmedQuestion] = useState<string>("");
//   const [debugInfo, setDebugInfo] = useState<DebugInfo>({});

//   const {
//     index,
//     progress,
//     attempted,
//     correct,
//     wrong,
//     skipped,
//     selectedOption,
//     showAnswer,
//     showSummary,
//     setIndex,
//     setProgress,
//     setAttempted,
//     setCorrect,
//     setWrong,
//     setSkipped,
//     setSelectedOption,
//     setShowAnswer,
//     toggleShowSummary,
//     resetAllProgress,
//   } = useMcqState();

//   // Function to silently reset progress without confirmation - using useCallback
//   const silentReset = useCallback(() => {
//     setProgress({});
//     setAttempted(0);
//     setCorrect(0);
//     setWrong(0);
//     setSkipped(0);
//     setIndex(0);
//     setSelectedOption(null);
//     setShowAnswer(false);
//   }, [
//     setProgress,
//     setAttempted,
//     setCorrect,
//     setWrong,
//     setSkipped,
//     setIndex,
//     setSelectedOption,
//     setShowAnswer,
//   ]);

//   const { navigate, handleOptionClick } = useMcqNavigation({
//     index,
//     questions,
//     progress,
//     showAnswer,
//     attempted,
//     correct,
//     wrong,
//     skipped,
//     setIndex,
//     setProgress,
//     setAttempted,
//     setCorrect,
//     setWrong,
//     setSkipped,
//     setSelectedOption,
//     setShowAnswer,
//   });

//   const { fetchingSolution, fetchSolution } = useMcqSolution(
//     questions,
//     setQuestions
//   );

//   const questionRef = useRef<HTMLDivElement>(null);
//   const progressRef = useRef<HTMLDivElement>(null);

//   const extractQuestionNumber = (question: Question): number => {
//     // Strategy 1: Check for explicit questionNumber property
//     if ("questionNumber" in question && question.questionNumber) {
//       return Number(question.questionNumber);
//     }

//     // Strategy 2: Extract from ID if it contains a number
//     if ("id" in question && question.id !== undefined && question.id !== null) {
//       const match = String(question.id).match(/(\d+)/);
//       if (match) return parseInt(match[1], 10);
//     }

//     // Strategy 3: Check if question text starts with a number followed by dot or parenthesis
//     const startMatch = question.question.match(/^(\d+)[\.\)]/);
//     if (startMatch) return parseInt(startMatch[1], 10);

//     // Strategy 4: Look for a number at the beginning of the question even without a separator
//     const beginningMatch = question.question.match(/^(\d+)/);
//     if (beginningMatch) return parseInt(beginningMatch[1], 10);

//     // Strategy 5: Look for any number in the question as a last resort
//     const anyNumberMatch = question.question.match(/\b(\d+)\b/);
//     if (anyNumberMatch) return parseInt(anyNumberMatch[1], 10);

//     // Default if no number found
//     return 0;
//   };

//   useEffect(() => {
//     if (subtopic && allQuestions.length > 0) {
//       const range = getSubtopicRange(subtopic);

//       if (range) {
//         const filteredQuestions = allQuestions.filter((q) => {
//           const questionNumber = extractQuestionNumber(q);
//           return questionNumber >= range.start && questionNumber <= range.end;
//         });

//         // Log number ranges found in the data
//         const allNumbers = allQuestions.map((q) => extractQuestionNumber(q));
//         const minNumber = Math.min(...allNumbers);
//         const maxNumber = Math.max(...allNumbers);

//         setDebugInfo({
//           subtopic,
//           range,
//           totalQuestions: allQuestions.length,
//           filteredCount: filteredQuestions.length,
//           sampleQuestionNumbers: filteredQuestions
//             .slice(0, 5)
//             .map(extractQuestionNumber),
//           numberRange: `${minNumber}-${maxNumber}`,
//         });

//         setQuestions(filteredQuestions);
//         setIndex(0);
//         // Use silentReset instead of resetAllProgress to avoid the confirmation dialog
//         silentReset();
//       } else {
//         setDebugInfo({
//           subtopic,
//           range: null,
//           error: "No range configuration found for this subtopic",
//         });
//         // When no range is found, don't filter - show all questions
//         setQuestions(allQuestions);
//       }
//     } else if (allQuestions.length > 0) {
//       setQuestions(allQuestions);
//     }
//   }, [subtopic, allQuestions, setIndex, silentReset]);

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         setLoading(true);

//         let gkRes, englishRes, historyRes;

//         // Try fetching from GK folder
//         try {
//           gkRes = await fetch(`/data/data/${chapter}.json`);
//         } catch {
//           // Silent catch
//         }

//         // Try fetching from English folder
//         try {
//           englishRes = await fetch(`/data/english/${chapter}.json`);
//         } catch {
//           // Silent catch
//         }

//         // Add a new attempt for history-specific folder
//         try {
//           historyRes = await fetch(`/data/history/${chapter}.json`);
//         } catch {
//           // Silent catch
//         }

//         // Try other possible locations
//         let directRes;
//         if (
//           (!gkRes || !gkRes.ok) &&
//           (!englishRes || !englishRes.ok) &&
//           (!historyRes || !historyRes.ok)
//         ) {
//           // Try without subfolder
//           try {
//             directRes = await fetch(`/data/${chapter}.json`);
//           } catch {
//             // Silent catch
//           }
//         }

//         if (
//           (!gkRes || !gkRes.ok) &&
//           (!englishRes || !englishRes.ok) &&
//           (!historyRes || !historyRes.ok) &&
//           (!directRes || !directRes.ok)
//         ) {
//           throw new Error(`Failed to load data for ${chapter}`);
//         }

//         const gkData = gkRes && gkRes.ok ? await gkRes.json() : [];
//         const englishData =
//           englishRes && englishRes.ok ? await englishRes.json() : [];
//         const historyData =
//           historyRes && historyRes.ok ? await historyRes.json() : [];
//         const directData =
//           directRes && directRes.ok ? await directRes.json() : [];

//         const combinedData = [
//           ...gkData,
//           ...englishData,
//           ...historyData,
//           ...directData,
//         ];

//         if (combinedData.length === 0) {
//           throw new Error(`No questions found for ${chapter}`);
//         }

//         // Process each question to ensure it has a question number
//         const processedData = combinedData.map((q, idx) => {
//           if (!("questionNumber" in q)) {
//             const extractedNumber = extractQuestionNumber(q);
//             return {
//               ...q,
//               questionNumber: extractedNumber || idx + 1,
//             };
//           }
//           return q;
//         });

//         setAllQuestions(processedData);

//         if (!subtopic) {
//           setQuestions(processedData);
//         }

//         const storageKey = `mcq-progress-${chapter}${
//           subtopic ? "-" + subtopic : ""
//         }`;

//         const savedProgress = localStorage.getItem(storageKey);

//         if (savedProgress) {
//           try {
//             const parsedProgress = JSON.parse(savedProgress);
//             setProgress(parsedProgress.progress || {});
//             setAttempted(parsedProgress.attempted || 0);
//             setCorrect(parsedProgress.correct || 0);
//             setWrong(parsedProgress.wrong || 0);
//             setSkipped(parsedProgress.skipped || 0);
//             setIndex(parsedProgress.index || 0);
//           } catch {
//             silentReset(); // Use silentReset instead
//           }
//         }
//       } catch (error) {
//         setError(
//           `Failed to load questions. ${
//             error instanceof Error ? error.message : ""
//           }`
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchQuestions();
//   }, [
//     chapter,
//     subtopic,
//     setProgress,
//     setAttempted,
//     setCorrect,
//     setWrong,
//     setSkipped,
//     setIndex,
//     silentReset,
//   ]);

//   useEffect(() => {
//     if (questions.length > 0 && questions[index]) {
//       const fullQuestion = questions[index].question;
//       const dotIndex = fullQuestion.indexOf(".");
//       const questionMarkIndex = fullQuestion.indexOf("?");

//       const splitIndex = Math.min(
//         dotIndex !== -1 ? dotIndex : Infinity,
//         questionMarkIndex !== -1 ? questionMarkIndex : Infinity
//       );

//       const trimmed =
//         splitIndex !== Infinity
//           ? fullQuestion.slice(0, splitIndex + 1)
//           : fullQuestion;

//       setTrimmedQuestion(trimmed);
//     }
//   }, [questions, index]);

//   useEffect(() => {
//     if (questions.length > 0) {
//       const storageKey = `mcq-progress-${chapter}${
//         subtopic ? "-" + subtopic : ""
//       }`;
//       localStorage.setItem(
//         storageKey,
//         JSON.stringify({ progress, attempted, correct, wrong, skipped, index })
//       );
//     }
//   }, [
//     progress,
//     attempted,
//     correct,
//     wrong,
//     skipped,
//     index,
//     chapter,
//     subtopic,
//     questions.length,
//   ]);

//   useEffect(() => {
//     if (progressRef.current) {
//       const activeCircle = progressRef.current.querySelector(".ring-2");
//       if (activeCircle) {
//         activeCircle.scrollIntoView({ behavior: "smooth", inline: "center" });
//       }
//     }

//     if (questionRef.current && !showAnswer) {
//       questionRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }
//   }, [index, showAnswer]);

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
//         <span>Loading questions...</span>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen p-4 text-red-600 flex items-center justify-center">
//         <div className="bg-red-50 p-4 rounded-lg max-w-md">
//           <h3 className="font-bold mb-2">Error</h3>
//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   }

//   if (questions.length === 0) {
//     return (
//       <div className="min-h-screen p-4 flex flex-col items-center justify-center">
//         <div className="text-center mb-8">
//           <h3 className="font-bold text-lg mb-2">No Questions Found</h3>
//           <p>
//             No questions available for this chapter
//             {subtopic ? ` or subtopic (${subtopic})` : ""}.
//           </p>
//           <button
//             className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//             onClick={() => router.push(`/index2`)}
//           >
//             Return to Index
//           </button>
//         </div>

//         {debugInfo && Object.keys(debugInfo).length > 0 && (
//           <div className="bg-gray-100 p-4 rounded-lg max-w-lg text-sm">
//             <h3 className="font-bold mb-2">Debug Information</h3>
//             <p>Chapter: {chapter}</p>
//             <p>Subtopic: {debugInfo.subtopic}</p>
//             {debugInfo.range ? (
//               <>
//                 <p>
//                   Range: {debugInfo.range.start} - {debugInfo.range.end}
//                 </p>
//                 <p>Total questions loaded: {debugInfo.totalQuestions}</p>
//                 <p>Questions after filtering: {debugInfo.filteredCount}</p>
//                 {debugInfo.numberRange && (
//                   <p>Question number range in data: {debugInfo.numberRange}</p>
//                 )}
//                 {debugInfo.sampleQuestionNumbers &&
//                   debugInfo.sampleQuestionNumbers.length > 0 && (
//                     <p>
//                       Sample question numbers:{" "}
//                       {debugInfo.sampleQuestionNumbers.join(", ")}
//                     </p>
//                   )}
//               </>
//             ) : (
//               <p className="text-red-500">
//                 {debugInfo.error ||
//                   "No range configuration found for this subtopic"}
//               </p>
//             )}
//           </div>
//         )}
//       </div>
//     );
//   }

//   const q = questions[index];
//   const completionPercentage =
//     questions.length > 0
//       ? Math.round((Object.keys(progress).length / questions.length) * 100)
//       : 0;
//   const currentExamName = q.exam || exam;

//   return (
//     <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white w-full">
//       <div className="max-w-3xl mx-auto px-3 py-4 sm:p-6 md:p-8 font-sans text-base">
//         <div className="text-center">
//           <h2 className="text-xl sm:text-2xl font-bold mt-12">
//             {chapter}
//             {subtopic && (
//               <span className="ml-2 text-blue-600 dark:text-blue-400">
//                 | {subtopic}
//               </span>
//             )}
//           </h2>
//         </div>

//         <ProgressHeader
//           ref={progressRef}
//           questions={questions}
//           currentIndex={index}
//           progress={progress}
//           attempted={attempted}
//           correct={correct}
//           wrong={wrong}
//           skipped={skipped}
//           showSummary={showSummary}
//           completionPercentage={completionPercentage}
//           onResetProgress={resetAllProgress}
//           onToggleSummary={toggleShowSummary}
//           onNavigateToQuestion={(idx) => {
//             setSelectedOption(null);
//             setShowAnswer(false);
//             setIndex(idx);
//           }}
//         />

//         <div className="flex flex-col md:flex-row gap-6">
//           {q && (
//             <div className="flex-1">
//               <QuestionView
//                 ref={questionRef}
//                 question={q}
//                 index={index}
//                 trimmedQuestion={trimmedQuestion}
//                 examName={currentExamName}
//                 showAnswer={showAnswer}
//                 selectedOption={selectedOption}
//                 onOptionClick={(key) =>
//                   handleOptionClick(key, q.correct_option, () =>
//                     fetchSolution(index)
//                   )
//                 }
//               />

//               {showAnswer && (
//                 <SolutionView
//                   solution={q.solution}
//                   fetchingSolution={fetchingSolution}
//                   onFetchSolution={() => fetchSolution(index)}
//                 />
//               )}

//               <NavigationButtons
//                 index={index}
//                 totalQuestions={questions.length}
//                 showAnswer={showAnswer}
//                 correctOption={q.correct_option}
//                 onNavigate={navigate}
//                 onShowAnswer={(key) =>
//                   handleOptionClick(key, q.correct_option, () =>
//                     fetchSolution(index)
//                   )
//                 }
//                 onToggleSummary={toggleShowSummary}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default McqPractice;

"use client";

interface SubtopicRange {
  start: number;
  end: number;
}

interface DebugInfo {
  subtopic?: string;
  range?: SubtopicRange | null;
  error?: string;
  totalQuestions?: number;
  filteredCount?: number;
  sampleQuestionNumbers?: number[];
  numberRange?: string;
}

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Question } from "./utils/types";
import { useMcqState } from "./utils/McqState";
import { useMcqNavigation } from "./utils/NavigationProps";
import { useMcqSolution } from "./utils/useMcqSolution";
import QuestionView from "./utils/QuestionViewProps";
import SolutionView from "./utils/SolutionViewProps";
import NavigationButtons from "./utils/NavigationButtons";
import ProgressHeader from "./utils/ProgressHeaderProps";
import { getSubtopicRange } from "./utils/subtopicRanges";

const McqPractice = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const chapter = params?.chapter as string;
  const subtopic = searchParams?.get("subtopic") || "";
  const exam = searchParams?.get("exam") || "";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trimmedQuestion, setTrimmedQuestion] = useState<string>("");
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({});

  const {
    index,
    progress,
    attempted,
    correct,
    wrong,
    skipped,
    selectedOption,
    showAnswer,
    showSummary,
    setIndex,
    setProgress,
    setAttempted,
    setCorrect,
    setWrong,
    setSkipped,
    setSelectedOption,
    setShowAnswer,
    toggleShowSummary,
    resetAllProgress,
  } = useMcqState();

  // Function to silently reset progress without confirmation - using useCallback
  const silentReset = useCallback(() => {
    setProgress({});
    setAttempted(0);
    setCorrect(0);
    setWrong(0);
    setSkipped(0);
    setIndex(0);
    setSelectedOption(null);
    setShowAnswer(false);
  }, [
    setProgress,
    setAttempted,
    setCorrect,
    setWrong,
    setSkipped,
    setIndex,
    setSelectedOption,
    setShowAnswer,
  ]);

  const { navigate, handleOptionClick } = useMcqNavigation({
    index,
    questions,
    progress,
    showAnswer,
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
  });

  const { fetchingSolution, fetchSolution } = useMcqSolution(
    questions,
    setQuestions
  );

  const questionRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const extractQuestionNumber = (question: Question): number => {
    // Strategy 1: Check for explicit questionNumber property
    if ("questionNumber" in question && question.questionNumber) {
      return Number(question.questionNumber);
    }

    // Strategy 2: Extract from ID if it contains a number
    if ("id" in question && question.id !== undefined && question.id !== null) {
      const match = String(question.id).match(/(\d+)/);
      if (match) return parseInt(match[1], 10);
    }

    // Strategy 3: Check if question text starts with a number followed by dot or parenthesis
    const startMatch = question.question.match(/^(\d+)[\.\)]/);
    if (startMatch) return parseInt(startMatch[1], 10);

    // Strategy 4: Look for a number at the beginning of the question even without a separator
    const beginningMatch = question.question.match(/^(\d+)/);
    if (beginningMatch) return parseInt(beginningMatch[1], 10);

    // Strategy 5: Look for any number in the question as a last resort
    const anyNumberMatch = question.question.match(/\b(\d+)\b/);
    if (anyNumberMatch) return parseInt(anyNumberMatch[1], 10);

    // Default if no number found
    return 0;
  };

  useEffect(() => {
    if (subtopic && allQuestions.length > 0) {
      const range = getSubtopicRange(subtopic);

      if (range) {
        const filteredQuestions = allQuestions.filter((q) => {
          const questionNumber = extractQuestionNumber(q);
          return questionNumber >= range.start && questionNumber <= range.end;
        });

        // Log number ranges found in the data
        const allNumbers = allQuestions.map((q) => extractQuestionNumber(q));
        const minNumber = Math.min(...allNumbers);
        const maxNumber = Math.max(...allNumbers);

        setDebugInfo({
          subtopic,
          range,
          totalQuestions: allQuestions.length,
          filteredCount: filteredQuestions.length,
          sampleQuestionNumbers: filteredQuestions
            .slice(0, 5)
            .map(extractQuestionNumber),
          numberRange: `${minNumber}-${maxNumber}`,
        });

        setQuestions(filteredQuestions);
        setIndex(0);
        // Use silentReset instead of resetAllProgress to avoid the confirmation dialog
        silentReset();
      } else {
        setDebugInfo({
          subtopic,
          range: null,
          error: "No range configuration found for this subtopic",
        });
        // When no range is found, don't filter - show all questions
        setQuestions(allQuestions);
      }
    } else if (allQuestions.length > 0) {
      setQuestions(allQuestions);
    }
  }, [subtopic, allQuestions, setIndex, silentReset]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);

        // Single API endpoint for all data
        const response = await fetch(`/data/data/${chapter}.json`);

        if (!response.ok) {
          throw new Error(
            `Failed to load data for ${chapter}. Status: ${response.status}`
          );
        }

        const data = await response.json();

        if (!data || (Array.isArray(data) && data.length === 0)) {
          throw new Error(`No questions found for ${chapter}`);
        }

        // Ensure data is an array
        const questionsArray = Array.isArray(data) ? data : [data];

        // Process each question to ensure it has a question number
        const processedData = questionsArray.map((q, idx) => {
          if (!("questionNumber" in q)) {
            const extractedNumber = extractQuestionNumber(q);
            return {
              ...q,
              questionNumber: extractedNumber || idx + 1,
            };
          }
          return q;
        });

        setAllQuestions(processedData);

        if (!subtopic) {
          setQuestions(processedData);
        }

        const storageKey = `mcq-progress-${chapter}${
          subtopic ? "-" + subtopic : ""
        }`;

        const savedProgress = localStorage.getItem(storageKey);

        if (savedProgress) {
          try {
            const parsedProgress = JSON.parse(savedProgress);
            setProgress(parsedProgress.progress || {});
            setAttempted(parsedProgress.attempted || 0);
            setCorrect(parsedProgress.correct || 0);
            setWrong(parsedProgress.wrong || 0);
            setSkipped(parsedProgress.skipped || 0);
            setIndex(parsedProgress.index || 0);
          } catch {
            silentReset(); // Use silentReset instead
          }
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setError(
          `Failed to load questions. ${
            error instanceof Error ? error.message : "Unknown error occurred"
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    if (chapter) {
      fetchQuestions();
    }
  }, [
    chapter,
    subtopic,
    setProgress,
    setAttempted,
    setCorrect,
    setWrong,
    setSkipped,
    setIndex,
    silentReset,
  ]);

  useEffect(() => {
    if (questions.length > 0 && questions[index]) {
      const fullQuestion = questions[index].question;
      const dotIndex = fullQuestion.indexOf(".");
      const questionMarkIndex = fullQuestion.indexOf("?");

      const splitIndex = Math.min(
        dotIndex !== -1 ? dotIndex : Infinity,
        questionMarkIndex !== -1 ? questionMarkIndex : Infinity
      );

      const trimmed =
        splitIndex !== Infinity
          ? fullQuestion.slice(0, splitIndex + 1)
          : fullQuestion;

      setTrimmedQuestion(trimmed);
    }
  }, [questions, index]);

  useEffect(() => {
    if (questions.length > 0) {
      const storageKey = `mcq-progress-${chapter}${
        subtopic ? "-" + subtopic : ""
      }`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({ progress, attempted, correct, wrong, skipped, index })
      );
    }
  }, [
    progress,
    attempted,
    correct,
    wrong,
    skipped,
    index,
    chapter,
    subtopic,
    questions.length,
  ]);

  useEffect(() => {
    if (progressRef.current) {
      const activeCircle = progressRef.current.querySelector(".ring-2");
      if (activeCircle) {
        activeCircle.scrollIntoView({ behavior: "smooth", inline: "center" });
      }
    }

    if (questionRef.current && !showAnswer) {
      questionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [index, showAnswer]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
        <span>Loading questions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 text-red-600 flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg max-w-md">
          <h3 className="font-bold mb-2">Error</h3>
          <p>{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => router.push(`/index2`)}
          >
            Return to Index
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen p-4 flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <h3 className="font-bold text-lg mb-2">No Questions Found</h3>
          <p>
            No questions available for this chapter
            {subtopic ? ` or subtopic (${subtopic})` : ""}.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            onClick={() => router.push(`/index2`)}
          >
            Return to Index
          </button>
        </div>

        {debugInfo && Object.keys(debugInfo).length > 0 && (
          <div className="bg-gray-100 p-4 rounded-lg max-w-lg text-sm">
            <h3 className="font-bold mb-2">Debug Information</h3>
            <p>Chapter: {chapter}</p>
            <p>Subtopic: {debugInfo.subtopic}</p>
            {debugInfo.range ? (
              <>
                <p>
                  Range: {debugInfo.range.start} - {debugInfo.range.end}
                </p>
                <p>Total questions loaded: {debugInfo.totalQuestions}</p>
                <p>Questions after filtering: {debugInfo.filteredCount}</p>
                {debugInfo.numberRange && (
                  <p>Question number range in data: {debugInfo.numberRange}</p>
                )}
                {debugInfo.sampleQuestionNumbers &&
                  debugInfo.sampleQuestionNumbers.length > 0 && (
                    <p>
                      Sample question numbers:{" "}
                      {debugInfo.sampleQuestionNumbers.join(", ")}
                    </p>
                  )}
              </>
            ) : (
              <p className="text-red-500">
                {debugInfo.error ||
                  "No range configuration found for this subtopic"}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  const q = questions[index];
  const completionPercentage =
    questions.length > 0
      ? Math.round((Object.keys(progress).length / questions.length) * 100)
      : 0;
  const currentExamName = q.exam || exam;

  return (
    <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white w-full">
      <div className="max-w-3xl mx-auto px-3 py-4 sm:p-6 md:p-8 font-sans text-base">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold mt-12">
            {chapter}
            {subtopic && (
              <span className="ml-2 text-blue-600 dark:text-blue-400">
                | {subtopic}
              </span>
            )}
          </h2>
        </div>

        <ProgressHeader
          ref={progressRef}
          questions={questions}
          currentIndex={index}
          progress={progress}
          attempted={attempted}
          correct={correct}
          wrong={wrong}
          skipped={skipped}
          showSummary={showSummary}
          completionPercentage={completionPercentage}
          onResetProgress={resetAllProgress}
          onToggleSummary={toggleShowSummary}
          onNavigateToQuestion={(idx) => {
            setSelectedOption(null);
            setShowAnswer(false);
            setIndex(idx);
          }}
        />

        <div className="flex flex-col md:flex-row gap-6">
          {q && (
            <div className="flex-1">
              <QuestionView
                ref={questionRef}
                question={q}
                index={index}
                trimmedQuestion={trimmedQuestion}
                examName={currentExamName}
                showAnswer={showAnswer}
                selectedOption={selectedOption}
                onOptionClick={(key) =>
                  handleOptionClick(key, q.correct_option, () =>
                    fetchSolution(index)
                  )
                }
              />

              {showAnswer && (
                <SolutionView
                  solution={q.solution}
                  fetchingSolution={fetchingSolution}
                  onFetchSolution={() => fetchSolution(index)}
                />
              )}

              <NavigationButtons
                index={index}
                totalQuestions={questions.length}
                showAnswer={showAnswer}
                correctOption={q.correct_option}
                onNavigate={navigate}
                onShowAnswer={(key) =>
                  handleOptionClick(key, q.correct_option, () =>
                    fetchSolution(index)
                  )
                }
                onToggleSummary={toggleShowSummary}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default McqPractice;
