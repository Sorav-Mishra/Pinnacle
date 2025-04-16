// "use client";
// import { useEffect, useState, useRef } from "react";
// import { useParams, useSearchParams } from "next/navigation";
// import classNames from "classnames";
// import { Question, ProgressStatus } from "./types";
// import { useTTS } from "./ttsUtils";
// import { ProgressCircle } from "./ProgressComponents";

// const McqPractice = () => {
//   const params = useParams();
//   const searchParams = useSearchParams();
//   const chapter = params?.chapter as string;
//   const exam = searchParams?.get("exam") || "";

//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [index, setIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState<string | null>(null);
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [progress, setProgress] = useState<Record<number, ProgressStatus>>({});
//   const [attempted, setAttempted] = useState(0);
//   const [correct, setCorrect] = useState(0);
//   const [wrong, setWrong] = useState(0);
//   const [skipped, setSkipped] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showSummary, setShowSummary] = useState(false);
//   const [fetchingSolution, setFetchingSolution] = useState(false);

//   const progressRef = useRef<HTMLDivElement>(null);
//   const questionRef = useRef<HTMLDivElement>(null);
//   const mainContentRef = useRef<HTMLDivElement>(null);

//   // TTS integration - using the modified hook
//   const {
//     // isSpeaking,
//     speak,
//     stopSpeech,
//     showTtsSettings,
//     toggleTtsSettings,
//     renderTtsSettingsPanel,
//   } = useTTS();

//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch(`/data/${chapter}.json`);
//         if (!response.ok) throw new Error(`Failed to load data for ${chapter}`);
//         const data = await response.json();
//         setQuestions(data);

//         const savedProgress = localStorage.getItem(`mcq-progress-${chapter}`);
//         if (savedProgress) {
//           const { progress, attempted, correct, wrong, skipped, index } =
//             JSON.parse(savedProgress);
//           setProgress(progress);
//           setAttempted(attempted);
//           setCorrect(correct);
//           setWrong(wrong);
//           setSkipped(skipped || 0); // Handle legacy data without skipped count
//           setIndex(index);
//         }
//       } catch (error) {
//         console.error(error);
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
//   }, [chapter]);

//   useEffect(() => {
//     if (questions.length > 0) {
//       localStorage.setItem(
//         `mcq-progress-${chapter}`,
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

//     // Stop any ongoing speech when navigating to a new question
//     stopSpeech();
//   }, [index, showAnswer, stopSpeech]);

//   const handleOptionClick = (key: string) => {
//     if (progress[index]) return;
//     setSelectedOption(key);
//     setShowAnswer(true);
//     setAttempted((prev) => prev + 1);

//     if (key === questions[index]?.correct_option) {
//       setCorrect((prev) => prev + 1);
//       setProgress((prev) => ({ ...prev, [index]: "correct" }));
//     } else {
//       setWrong((prev) => prev + 1);
//       setProgress((prev) => ({ ...prev, [index]: "wrong" }));
//     }

//     // Fetch solution if we don't already have it
//     if (!questions[index].solution) {
//       fetchSolution(index);
//     }
//   };

//   const fetchSolution = async (questionIndex: number) => {
//     try {
//       setFetchingSolution(true);
//       // Simulate API call to fetch solution
//       // In a real implementation, this would be an actual API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       // For demo purposes, generate a mock solution
//       const mockSolution = {
//         explanation: `This is the explanation for question ${
//           questionIndex + 1
//         }. The correct answer is ${questions[
//           questionIndex
//         ].correct_option.toUpperCase()}.`,
//         incorrect_explanations: Object.keys(questions[questionIndex].options)
//           .filter((key) => key !== questions[questionIndex].correct_option)
//           .reduce(
//             (acc, key) => ({
//               ...acc,
//               [key]: `Option ${key.toUpperCase()} is incorrect because it contradicts core principles.`,
//             }),
//             {}
//           ),
//       };

//       // Update the question with the fetched solution
//       const updatedQuestions = [...questions];
//       updatedQuestions[questionIndex] = {
//         ...updatedQuestions[questionIndex],
//         solution: mockSolution,
//       };

//       setQuestions(updatedQuestions);
//     } catch (error) {
//       console.error("Failed to fetch solution:", error);
//     } finally {
//       setFetchingSolution(false);
//     }
//   };

//   const navigate = (dir: "prev" | "next", skip: boolean = false) => {
//     if (skip && !progress[index]) {
//       setSkipped((prev) => prev + 1);
//       setProgress((prev) => ({ ...prev, [index]: "skipped" }));
//     }

//     setSelectedOption(null);
//     setShowAnswer(false);
//     setIndex((prev) =>
//       dir === "next"
//         ? Math.min(prev + 1, questions.length - 1)
//         : Math.max(prev - 1, 0)
//     );
//   };

//   const resetProgress = () => {
//     if (
//       window.confirm(
//         "Are you sure you want to reset all progress? This cannot be undone."
//       )
//     ) {
//       setProgress({});
//       setAttempted(0);
//       setCorrect(0);
//       setWrong(0);
//       setSkipped(0);
//       setIndex(0);
//       setSelectedOption(null);
//       setShowAnswer(false);
//       setShowSummary(false);
//       localStorage.removeItem(`mcq-progress-${chapter}`);
//     }
//   };

//   const toggleSummary = () => setShowSummary(!showSummary);
//   const getCompletionPercentage = () =>
//     questions.length > 0
//       ? Math.round((Object.keys(progress).length / questions.length) * 100)
//       : 0;
//   const getAccuracyPercentage = () =>
//     attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
//   const getUnansweredCount = () =>
//     questions.length - Object.keys(progress).length;

//   // These functions are specific to this component's usage of TTS
//   const speakQuestion = () => {
//     if (!questions[index]) return;
//     speak(questions[index].question);
//   };

//   const speakOption = (key: string, text: string) => {
//     speak(`Option ${key.toUpperCase()}: ${text}`);
//   };

//   const speakSolution = () => {
//     if (!questions[index]?.solution) return;
//     speak(questions[index].solution.explanation);
//   };

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
//         <span>Loading questions...</span>
//       </div>
//     );
//   if (error)
//     return (
//       <div className="min-h-screen p-4 text-red-600 flex items-center justify-center">
//         <div className="bg-red-50 p-4 rounded-lg max-w-md">
//           <h3 className="font-bold mb-2">Error</h3>
//           <p>{error}</p>
//         </div>
//       </div>
//     );
//   if (questions.length === 0)
//     return (
//       <div className="min-h-screen p-4 flex items-center justify-center">
//         No questions available for this chapter.
//       </div>
//     );

//   const q = questions[index];
//   const completionPercentage = getCompletionPercentage();
//   const currentExamName = q.exam || exam;

//   return (
//     <div
//       className="min-h-screen bg-white text-black w-full"
//       ref={mainContentRef}
//     >
//       <div className="max-w-3xl mx-auto px-3 py-4 sm:p-6 md:p-8 font-sans text-base">
//         {/* Header section with chapter title */}
//         <div className="text-center mb-4">
//           <h2 className="text-xl sm:text-2xl font-bold">
//             MCQ Practice: {chapter}
//           </h2>
//         </div>

//         {/* Main content with left sidebar and right content area */}
//         <div className="flex flex-col md:flex-row gap-6">
//           {/* Left sidebar with progress circle and TTS settings */}
//           <div className="md:w-48 flex flex-col items-center md:items-start">
//             {/* Circle and Summary row */}
//             <div className="flex flex-col md:flex-row items-start gap-4 w-full">
//               {/* Progress Circle on left side */}
//               <div
//                 className="cursor-pointer flex-shrink-0"
//                 onClick={toggleSummary}
//                 title="Click to toggle summary"
//               >
//                 <ProgressCircle
//                   current={index + 1}
//                   total={questions.length}
//                   percentage={completionPercentage}
//                 />
//               </div>

//               {/* Summary panel to the right of circle when shown */}
//               {showSummary && (
//                 <div className="flex-1 p-4 bg-blue-50 border border-blue-200 rounded-lg mt-4 md:mt-0">
//                   <div className="flex justify-between items-center mb-2">
//                     <h3 className="font-bold">Progress Summary</h3>
//                     <button
//                       onClick={resetProgress}
//                       className="px-3 py-1 bg-red-100 hover:bg-red-200 rounded text-xs font-medium"
//                     >
//                       Reset Progress
//                     </button>
//                   </div>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <p className="text-sm text-gray-600">Completion</p>
//                       <p className="font-semibold">
//                         {completionPercentage}% ({Object.keys(progress).length}/
//                         {questions.length})
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Accuracy</p>
//                       <p className="font-semibold">
//                         {getAccuracyPercentage()}% ({correct}/{attempted})
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Correct Answers</p>
//                       <p className="font-semibold text-green-600">{correct}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Wrong Answers</p>
//                       <p className="font-semibold text-red-600">{wrong}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Skipped Questions</p>
//                       <p className="font-semibold text-yellow-600">{skipped}</p>
//                     </div>
//                     <div>
//                       <p className="text-sm text-gray-600">Unanswered</p>
//                       <p className="font-semibold">{getUnansweredCount()}</p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* TTS settings button below the circle */}
//             <button
//               onClick={toggleTtsSettings}
//               className="mt-4 p-2 bg-blue-100 hover:bg-blue-200 rounded-lg w-full md:w-48 flex items-center justify-center"
//             >
//               <span className="mr-2">🔊</span>
//               <span className="text-sm">TTS Settings</span>
//             </button>

//             {/* TTS Settings Panel - using the render function */}
//             {showTtsSettings && (
//               <div className="mt-3 bg-gray-100 p-3 rounded-lg w-full md:w-48">
//                 {renderTtsSettingsPanel()}
//               </div>
//             )}
//           </div>

//           {/* Right content area */}
//           <div className="flex-1">
//             {/* Horizontal scrolling circle indicators */}
//             <div
//               ref={progressRef}
//               className="flex overflow-x-auto gap-2 py-3 px-1 rounded-lg bg-gray-100 shadow-inner mb-6"
//               style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//             >
//               {questions.map((_, i) => (
//                 <div
//                   key={i}
//                   className={classNames(
//                     "w-7 h-7 sm:w-10 sm:h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition duration-200 cursor-pointer",
//                     {
//                       "bg-green-500 text-white border-green-600":
//                         progress[i] === "correct",
//                       "bg-red-500 text-white border-red-600":
//                         progress[i] === "wrong",
//                       "bg-yellow-500 text-white border-yellow-600":
//                         progress[i] === "skipped",
//                       "bg-white text-gray-700 border-gray-300": !progress[i],
//                       "ring-2 ring-blue-500 scale-110 shadow-md": i === index,
//                     }
//                   )}
//                   onClick={() => {
//                     setSelectedOption(null);
//                     setShowAnswer(false);
//                     setIndex(i);
//                   }}
//                 >
//                   {i + 1}
//                 </div>
//               ))}
//             </div>

//             {/* Question content */}
//             <div ref={questionRef} className="mb-4">
//               <div className="font-semibold mb-4 text-base sm:text-lg flex items-start">
//                 <div className="flex-grow">
//                   <span>
//                     {index + 1}. {q.question}
//                     {currentExamName && (
//                       <span className="text-gray-600 text-xs sm:text-sm ml-1">
//                         ({currentExamName})
//                       </span>
//                     )}
//                   </span>
//                 </div>
//                 <button
//                   onClick={speakQuestion}
//                   className="ml-2 p-1 rounded-full hover:bg-blue-100 flex-shrink-0"
//                   aria-label="Listen to question"
//                   title="Listen to question"
//                 >
//                   🔊
//                 </button>
//               </div>
//               <div className="grid gap-3 mt-4">
//                 {Object.entries(q.options).map(([key, value]) => (
//                   <div key={key} className="relative">
//                     <button
//                       disabled={showAnswer}
//                       onClick={() => handleOptionClick(key)}
//                       className={classNames(
//                         "w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg border transition duration-200 shadow-sm text-xs sm:text-base pr-10",
//                         {
//                           "bg-green-100 border-green-600 text-green-800":
//                             showAnswer && key === q.correct_option,
//                           "bg-red-100 border-red-600 text-red-800":
//                             showAnswer &&
//                             key === selectedOption &&
//                             key !== q.correct_option,
//                           "hover:bg-blue-50 border-gray-300": !showAnswer,
//                         }
//                       )}
//                     >
//                       <span className="font-semibold">
//                         {key.toUpperCase()}.
//                       </span>{" "}
//                       {value}
//                     </button>
//                     {/* Speaker icon inside each option box, but right-aligned */}
//                     <button
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         speakOption(key, value);
//                       }}
//                       className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-blue-100"
//                       aria-label={`Listen to option ${key}`}
//                       title={`Listen to option ${key}`}
//                     >
//                       🔊
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Solution section with TTS button */}
//             {showAnswer && (
//               <div className="p-3 sm:p-4 border rounded bg-yellow-50 text-xs sm:text-sm mb-6 animate-fade-in">
//                 {fetchingSolution ? (
//                   <div className="flex items-center justify-center p-4">
//                     <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
//                     <span>Fetching solution...</span>
//                   </div>
//                 ) : q.solution ? (
//                   <>
//                     <div className="flex items-start justify-between mb-2">
//                       <p className="font-bold">Solution:</p>
//                       <button
//                         onClick={speakSolution}
//                         className="p-1 rounded-full hover:bg-blue-100"
//                         aria-label="Listen to solution"
//                         title="Listen to solution"
//                       >
//                         🔊
//                       </button>
//                     </div>
//                     <p className="mb-3">{q.solution.explanation}</p>
//                     {q.solution.incorrect_explanations && (
//                       <div>
//                         <p className="font-bold mb-1">
//                           Why other options are incorrect:
//                         </p>
//                         <ul className="list-disc pl-4 sm:pl-5">
//                           {Object.entries(
//                             q.solution.incorrect_explanations
//                           ).map(([key, exp]) => (
//                             <li key={key} className="mb-1">
//                               <strong>{key.toUpperCase()}:</strong> {exp}
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}
//                   </>
//                 ) : (
//                   <div className="text-center py-2">
//                     <button
//                       onClick={() => fetchSolution(index)}
//                       className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
//                     >
//                       Fetch Solution
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* Navigation buttons */}
//             <div className="grid grid-cols-2 gap-2 mt-6">
//               <button
//                 className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 rounded hover:bg-gray-300 text-xs sm:text-base disabled:opacity-50"
//                 onClick={() => navigate("prev")}
//                 disabled={index === 0}
//               >
//                 ⬅️ Previous
//               </button>

//               {!showAnswer && (
//                 <button
//                   className="px-3 py-2 sm:px-4 sm:py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs sm:text-base"
//                   onClick={() => navigate("next", true)}
//                 >
//                   Skip ⏭️
//                 </button>
//               )}

//               {showAnswer && index < questions.length - 1 ? (
//                 <button
//                   className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs sm:text-base"
//                   onClick={() => navigate("next")}
//                 >
//                   Next ➡️
//                 </button>
//               ) : (
//                 showAnswer &&
//                 index === questions.length - 1 && (
//                   <button
//                     className="px-3 py-2 sm:px-4 sm:py-2 bg-green-500 text-white rounded hover:bg-green-600 text-xs sm:text-base"
//                     onClick={toggleSummary}
//                   >
//                     Show Summary
//                   </button>
//                 )
//               )}

//               {!showAnswer && (
//                 <button
//                   className="px-3 py-2 sm:px-4 sm:py-2 bg-green-500 text-white rounded hover:bg-green-600 text-xs sm:text-base col-span-2 mt-2"
//                   onClick={() => handleOptionClick(q.correct_option)}
//                 >
//                   Show Answer
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default McqPractice;
"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import classNames from "classnames";
import { Question, ProgressStatus } from "./types";
import { useTTS } from "./ttsUtils";
import { ProgressCircle } from "./ProgressComponents";

const McqPractice = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const chapter = params?.chapter as string;
  const exam = searchParams?.get("exam") || "";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState<Record<number, ProgressStatus>>({});
  const [attempted, setAttempted] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [skipped, setSkipped] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [fetchingSolution, setFetchingSolution] = useState(false);

  const progressRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLDivElement>(null);

  // TTS integration - using the modified hook
  const {
    speak,
    stopSpeech,
    showTtsSettings,
    toggleTtsSettings,
    renderTtsSettingsPanel,
  } = useTTS();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/data/${chapter}.json`);
        if (!response.ok) throw new Error(`Failed to load data for ${chapter}`);
        const data = await response.json();
        setQuestions(data);

        const savedProgress = localStorage.getItem(`mcq-progress-${chapter}`);
        if (savedProgress) {
          const { progress, attempted, correct, wrong, skipped, index } =
            JSON.parse(savedProgress);
          setProgress(progress);
          setAttempted(attempted);
          setCorrect(correct);
          setWrong(wrong);
          setSkipped(skipped || 0); // Handle legacy data without skipped count
          setIndex(index);
        }
      } catch (error) {
        console.error(error);
        setError(
          `Failed to load questions. ${
            error instanceof Error ? error.message : ""
          }`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [chapter]);

  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem(
        `mcq-progress-${chapter}`,
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

    // Stop any ongoing speech when navigating to a new question
    stopSpeech();
  }, [index, showAnswer, stopSpeech]);

  const handleOptionClick = (key: string) => {
    if (progress[index]) return;
    setSelectedOption(key);
    setShowAnswer(true);
    setAttempted((prev) => prev + 1);

    if (key === questions[index]?.correct_option) {
      setCorrect((prev) => prev + 1);
      setProgress((prev) => ({ ...prev, [index]: "correct" }));
    } else {
      setWrong((prev) => prev + 1);
      setProgress((prev) => ({ ...prev, [index]: "wrong" }));
    }

    // Fetch solution if we don't already have it
    if (!questions[index].solution) {
      fetchSolution(index);
    }
  };

  const fetchSolution = async (questionIndex: number) => {
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

  const navigate = (dir: "prev" | "next", skip: boolean = false) => {
    if (skip && !progress[index]) {
      setSkipped((prev) => prev + 1);
      setProgress((prev) => ({ ...prev, [index]: "skipped" }));
    }

    setSelectedOption(null);
    setShowAnswer(false);
    setIndex((prev) =>
      dir === "next"
        ? Math.min(prev + 1, questions.length - 1)
        : Math.max(prev - 1, 0)
    );
  };

  const resetProgress = () => {
    if (
      window.confirm(
        "Are you sure you want to reset all progress? This cannot be undone."
      )
    ) {
      setProgress({});
      setAttempted(0);
      setCorrect(0);
      setWrong(0);
      setSkipped(0);
      setIndex(0);
      setSelectedOption(null);
      setShowAnswer(false);
      setShowSummary(false);
      localStorage.removeItem(`mcq-progress-${chapter}`);
    }
  };

  const toggleSummary = () => setShowSummary(!showSummary);
  const getCompletionPercentage = () =>
    questions.length > 0
      ? Math.round((Object.keys(progress).length / questions.length) * 100)
      : 0;
  const getAccuracyPercentage = () =>
    attempted > 0 ? Math.round((correct / attempted) * 100) : 0;
  const getUnansweredCount = () =>
    questions.length - Object.keys(progress).length;

  // These functions are specific to this component's usage of TTS
  const speakQuestion = () => {
    if (!questions[index]) return;
    speak(questions[index].question);
  };

  const speakOption = (key: string, text: string) => {
    speak(`Option ${key.toUpperCase()}: ${text}`);
  };

  const speakSolution = () => {
    if (!questions[index]?.solution) return;
    speak(questions[index].solution.explanation);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
        <span>Loading questions...</span>
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen p-4 text-red-600 flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg max-w-md">
          <h3 className="font-bold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  if (questions.length === 0)
    return (
      <div className="min-h-screen p-4 flex items-center justify-center">
        No questions available for this chapter.
      </div>
    );

  const q = questions[index];
  const completionPercentage = getCompletionPercentage();
  const currentExamName = q.exam || exam;

  return (
    <div
      className="min-h-screen bg-white text-black w-full"
      ref={mainContentRef}
    >
      <div className="max-w-3xl mx-auto px-3 py-4 sm:p-6 md:p-8 font-sans text-base">
        {/* Header section with chapter title */}
        <div className="text-center mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">
            MCQ Practice: {chapter}
          </h2>
        </div>

        {/* Horizontal scrolling circle indicators - Now appears above the two-column layout on all screen sizes */}
        <div
          ref={progressRef}
          className="flex overflow-x-auto gap-2 py-3 px-1 rounded-lg bg-gray-100 shadow-inner mb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
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
                  "ring-2 ring-blue-500 scale-110 shadow-md": i === index,
                }
              )}
              onClick={() => {
                setSelectedOption(null);
                setShowAnswer(false);
                setIndex(i);
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        {/* Main content with left sidebar and right content area */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left sidebar with progress circle and TTS settings */}
          <div className="md:w-48 flex flex-col items-start">
            {/* Progress Circle and Summary - Circle always stays on left in mobile view */}
            <div className="flex flex-row w-full items-start gap-4">
              {/* Progress Circle on the left */}
              <div
                className="cursor-pointer flex-shrink-0 z-10"
                onClick={toggleSummary}
                title="Click to toggle summary"
              >
                <ProgressCircle
                  current={index + 1}
                  total={questions.length}
                  percentage={completionPercentage}
                />
              </div>

              {/* Summary panel opens to the right horizontally on mobile */}
              {showSummary && (
                <div className="flex-1 p-4 bg-blue-50 border border-blue-200 rounded-lg z-20 animate-fade-in">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">Progress Summary</h3>
                    <button
                      onClick={resetProgress}
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
              className="mt-4 p-2 bg-blue-100 hover:bg-blue-200 rounded-lg w-full md:w-48 flex items-center justify-center"
            >
              <span className="mr-2">🔊</span>
              <span className="text-sm">TTS Settings</span>
            </button>

            {/* TTS Settings Panel - using the render function */}
            {showTtsSettings && (
              <div className="mt-3 bg-gray-100 p-3 rounded-lg w-full md:w-48">
                {renderTtsSettingsPanel()}
              </div>
            )}
          </div>

          {/* Right content area */}
          <div className="flex-1">
            {/* Question content */}
            <div ref={questionRef} className="mb-4">
              <div className="font-semibold mb-4 text-base sm:text-lg flex items-start">
                <div className="flex-grow">
                  <span>
                    {index + 1}. {q.question}
                    {currentExamName && (
                      <span className="text-gray-600 text-xs sm:text-sm ml-1">
                        ({currentExamName})
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
                {Object.entries(q.options).map(([key, value]) => (
                  <div key={key} className="relative">
                    <button
                      disabled={showAnswer}
                      onClick={() => handleOptionClick(key)}
                      className={classNames(
                        "w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg border transition duration-200 shadow-sm text-xs sm:text-base pr-10",
                        {
                          "bg-green-100 border-green-600 text-green-800":
                            showAnswer && key === q.correct_option,
                          "bg-red-100 border-red-600 text-red-800":
                            showAnswer &&
                            key === selectedOption &&
                            key !== q.correct_option,
                          "hover:bg-blue-50 border-gray-300": !showAnswer,
                        }
                      )}
                    >
                      <span className="font-semibold">
                        {key.toUpperCase()}.
                      </span>{" "}
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

            {/* Solution section with TTS button */}
            {showAnswer && (
              <div className="p-3 sm:p-4 border rounded bg-yellow-50 text-xs sm:text-sm mb-6 animate-fade-in">
                {fetchingSolution ? (
                  <div className="flex items-center justify-center p-4">
                    <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                    <span>Fetching solution...</span>
                  </div>
                ) : q.solution ? (
                  <>
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-bold">Solution:</p>
                      <button
                        onClick={speakSolution}
                        className="p-1 rounded-full hover:bg-blue-100"
                        aria-label="Listen to solution"
                        title="Listen to solution"
                      >
                        🔊
                      </button>
                    </div>
                    <p className="mb-3">{q.solution.explanation}</p>
                    {q.solution.incorrect_explanations && (
                      <div>
                        <p className="font-bold mb-1">
                          Why other options are incorrect:
                        </p>
                        <ul className="list-disc pl-4 sm:pl-5">
                          {Object.entries(
                            q.solution.incorrect_explanations
                          ).map(([key, exp]) => (
                            <li key={key} className="mb-1">
                              <strong>{key.toUpperCase()}:</strong> {exp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-2">
                    <button
                      onClick={() => fetchSolution(index)}
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                    >
                      Fetch Solution
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="grid grid-cols-2 gap-2 mt-6">
              <button
                className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 rounded hover:bg-gray-300 text-xs sm:text-base disabled:opacity-50"
                onClick={() => navigate("prev")}
                disabled={index === 0}
              >
                ⬅️ Previous
              </button>

              {!showAnswer && (
                <button
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-xs sm:text-base"
                  onClick={() => navigate("next", true)}
                >
                  Skip ⏭️
                </button>
              )}

              {showAnswer && index < questions.length - 1 ? (
                <button
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs sm:text-base"
                  onClick={() => navigate("next")}
                >
                  Next ➡️
                </button>
              ) : (
                showAnswer &&
                index === questions.length - 1 && (
                  <button
                    className="px-3 py-2 sm:px-4 sm:py-2 bg-green-500 text-white rounded hover:bg-green-600 text-xs sm:text-base"
                    onClick={toggleSummary}
                  >
                    Show Summary
                  </button>
                )
              )}

              {!showAnswer && (
                <button
                  className="px-3 py-2 sm:px-4 sm:py-2 bg-green-500 text-white rounded hover:bg-green-600 text-xs sm:text-base col-span-2 mt-2"
                  onClick={() => handleOptionClick(q.correct_option)}
                >
                  Show Answer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default McqPractice;
