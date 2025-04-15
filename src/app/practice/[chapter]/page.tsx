// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useParams } from "next/navigation";
// import classNames from "classnames";

// type Question = {
//   question: string;
//   options: Record<string, string>;
//   correct_option: string;
//   exam_name?: string;
//   solution?: {
//     explanation: string;
//     incorrect_explanations?: Record<string, string>;
//   };
// };

// const McqPractice = () => {
//   const params = useParams();
//   const chapter = params?.chapter as string;

//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [index, setIndex] = useState(0);
//   const [selectedOption, setSelectedOption] = useState<string | null>(null);
//   const [showAnswer, setShowAnswer] = useState(false);
//   const [progress, setProgress] = useState<Record<number, "correct" | "wrong">>(
//     {}
//   );
//   const [attempted, setAttempted] = useState(0);
//   const [correct, setCorrect] = useState(0);
//   const [wrong, setWrong] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showSummary, setShowSummary] = useState(false);
//   const [fetchingSolution, setFetchingSolution] = useState(false);
//   const progressRef = useRef<HTMLDivElement>(null);
//   const questionRef = useRef<HTMLDivElement>(null);

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
//           const { progress, attempted, correct, wrong, index } =
//             JSON.parse(savedProgress);
//           setProgress(progress);
//           setAttempted(attempted);
//           setCorrect(correct);
//           setWrong(wrong);
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
//         JSON.stringify({ progress, attempted, correct, wrong, index })
//       );
//     }
//   }, [progress, attempted, correct, wrong, index, chapter, questions.length]);

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

//   const navigate = (dir: "prev" | "next") => {
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
//       confirm(
//         "Are you sure you want to reset all progress? This cannot be undone."
//       )
//     ) {
//       setProgress({});
//       setAttempted(0);
//       setCorrect(0);
//       setWrong(0);
//       setIndex(0);
//       setSelectedOption(null);
//       setShowAnswer(false);
//       localStorage.removeItem(`mcq-progress-${chapter}`);
//     }
//   };

//   const toggleSummary = () => setShowSummary(!showSummary);
//   const getCompletionPercentage = () =>
//     questions.length > 0 ? Math.round((attempted / questions.length) * 100) : 0;
//   const getAccuracyPercentage = () =>
//     attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center p-4">
//         Loading...
//       </div>
//     );
//   if (error)
//     return <div className="min-h-screen p-4 text-red-600">{error}</div>;
//   if (questions.length === 0)
//     return <div className="min-h-screen p-4">No questions available.</div>;

//   const q = questions[index];
//   const completionPercentage = getCompletionPercentage();

//   // Calculate circle progress dimensions
//   const radius = 45;
//   const strokeWidth = 8;
//   const circumference = 2 * Math.PI * radius;
//   const strokeDashoffset =
//     circumference - (completionPercentage / 100) * circumference;

//   return (
//     <div className="min-h-screen p-3 sm:p-6 md:p-8 bg-white text-black max-w-3xl mx-auto font-sans text-base w-full">
//       {/* Header section with chapter title */}
//       <div className="text-center mb-4">
//         <h2 className="text-xl font-bold">MCQ Practice: {chapter}</h2>
//       </div>

//       {/* Big circle at the top */}
//       <div className="flex justify-center mb-6">
//         <div className="relative w-32 h-32 sm:w-40 sm:h-40">
//           <svg className="w-full h-full" viewBox="0 0 100 100">
//             {/* Background circle */}
//             <circle
//               cx="50"
//               cy="50"
//               r={radius}
//               fill="none"
//               stroke="#e5e7eb"
//               strokeWidth={strokeWidth}
//             />
//             {/* Progress circle */}
//             <circle
//               cx="50"
//               cy="50"
//               r={radius}
//               fill="none"
//               stroke="#3b82f6"
//               strokeWidth={strokeWidth}
//               strokeLinecap="round"
//               strokeDasharray={circumference}
//               strokeDashoffset={strokeDashoffset}
//               transform="rotate(-90 50 50)"
//             />
//             {/* Current question number */}
//             <text
//               x="50"
//               y="45"
//               textAnchor="middle"
//               fontSize="20"
//               fontWeight="bold"
//               fill="#111827"
//             >
//               {index + 1}
//             </text>
//             <text
//               x="50"
//               y="65"
//               textAnchor="middle"
//               fontSize="14"
//               fill="#4b5563"
//             >
//               of {questions.length}
//             </text>
//           </svg>
//         </div>
//       </div>

//       {/* Summary and reset buttons */}
//       <div className="flex justify-center space-x-3 mb-6">
//         <button
//           onClick={toggleSummary}
//           className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium"
//         >
//           {showSummary ? "Hide Summary" : "Show Summary"}
//         </button>
//         <button
//           onClick={resetProgress}
//           className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded text-sm font-medium"
//         >
//           Reset Progress
//         </button>
//       </div>

//       {/* Summary panel */}
//       {showSummary && (
//         <div className="w-full p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
//           <h3 className="font-bold mb-2">Progress Summary</h3>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-gray-600">Completion</p>
//               <p className="font-semibold">
//                 {completionPercentage}% ({attempted}/{questions.length})
//               </p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-600">Accuracy</p>
//               <p className="font-semibold">
//                 {getAccuracyPercentage()}% ({correct}/{attempted})
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Horizontal scrolling circle indicators */}
//       <div
//         ref={progressRef}
//         className="flex overflow-x-auto gap-2 py-3 px-1 rounded-lg bg-gray-100 shadow-inner mb-6 no-scrollbar"
//       >
//         {questions.map((_, i) => (
//           <div
//             key={i}
//             className={classNames(
//               "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition duration-200 cursor-pointer",
//               {
//                 "bg-green-500 text-white border-green-600":
//                   progress[i] === "correct",
//                 "bg-red-500 text-white border-red-600": progress[i] === "wrong",
//                 "bg-white text-gray-700 border-gray-300": !progress[i],
//                 "ring-2 ring-blue-500 scale-110 shadow-md": i === index,
//               }
//             )}
//             onClick={() => {
//               setSelectedOption(null);
//               setShowAnswer(false);
//               setIndex(i);
//             }}
//           >
//             {i + 1}
//           </div>
//         ))}
//       </div>

//       {/* Question content */}
//       <div ref={questionRef} className="mb-4">
//         <p className="font-semibold mb-4 text-base sm:text-lg">
//           {index + 1}. {q.question}
//         </p>
//         <div className="grid gap-3 mt-4">
//           {Object.entries(q.options).map(([key, value]) => (
//             <button
//               key={key}
//               disabled={showAnswer}
//               onClick={() => handleOptionClick(key)}
//               className={classNames(
//                 "w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg border transition duration-200 shadow-sm text-sm sm:text-base",
//                 {
//                   "bg-green-100 border-green-600 text-green-800":
//                     showAnswer && key === q.correct_option,
//                   "bg-red-100 border-red-600 text-red-800":
//                     showAnswer &&
//                     key === selectedOption &&
//                     key !== q.correct_option,
//                   "hover:bg-blue-50 border-gray-300": !showAnswer,
//                 }
//               )}
//             >
//               <span className="font-semibold">{key.toUpperCase()}.</span>{" "}
//               {value}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Solution section */}
//       {showAnswer && (
//         <div className="p-3 sm:p-4 border rounded bg-yellow-50 text-sm mb-6 animate-fade-in">
//           {fetchingSolution ? (
//             <div className="flex items-center justify-center p-4">
//               <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
//               <span>Fetching solution...</span>
//             </div>
//           ) : q.solution ? (
//             <>
//               <p className="font-bold mb-2">Solution:</p>
//               <p className="mb-3">{q.solution.explanation}</p>
//               {q.solution.incorrect_explanations && (
//                 <div>
//                   <p className="font-bold mb-1">
//                     Why other options are incorrect:
//                   </p>
//                   <ul className="list-disc pl-4 sm:pl-5">
//                     {Object.entries(q.solution.incorrect_explanations).map(
//                       ([key, exp]) => (
//                         <li key={key} className="mb-1">
//                           <strong>{key.toUpperCase()}:</strong> {exp}
//                         </li>
//                       )
//                     )}
//                   </ul>
//                 </div>
//               )}
//             </>
//           ) : (
//             <div className="text-center py-2">
//               <button
//                 onClick={() => fetchSolution(index)}
//                 className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
//               >
//                 Fetch Solution
//               </button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Navigation buttons - made more mobile friendly */}
//       <div className="grid grid-cols-2 sm:flex sm:justify-between gap-2 mt-6">
//         <button
//           className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm sm:text-base"
//           onClick={() => navigate("prev")}
//           disabled={index === 0}
//         >
//           ⬅️ Previous
//         </button>

//         {!showAnswer && (
//           <button
//             className="px-3 py-2 sm:px-4 sm:py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm sm:text-base"
//             onClick={() => navigate("next")}
//           >
//             Skip ⏭️
//           </button>
//         )}

//         {showAnswer && index < questions.length - 1 ? (
//           <button
//             className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base col-span-2 sm:col-span-1"
//             onClick={() => navigate("next")}
//           >
//             Next ➡️
//           </button>
//         ) : (
//           !showAnswer && (
//             <button
//               className="px-3 py-2 sm:px-4 sm:py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base col-span-2 sm:col-span-1"
//               onClick={() => handleOptionClick(q.correct_option)}
//             >
//               Show Answer
//             </button>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default McqPractice;

"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import classNames from "classnames";

type Question = {
  question: string;
  options: Record<string, string>;
  correct_option: string;
  exam_name?: string;
  solution?: {
    explanation: string;
    incorrect_explanations?: Record<string, string>;
  };
};

const McqPractice = () => {
  const params = useParams();
  const chapter = params?.chapter as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [progress, setProgress] = useState<Record<number, "correct" | "wrong">>(
    {}
  );
  const [attempted, setAttempted] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [fetchingSolution, setFetchingSolution] = useState(false);
  // TTS states
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [speechRate, setSpeechRate] = useState(1);
  const [showTtsSettings, setShowTtsSettings] = useState(false);

  const progressRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const synth = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize speech synthesis
    if (typeof window !== "undefined") {
      synth.current = window.speechSynthesis;

      // Load available voices
      const loadVoices = () => {
        const availableVoices = synth.current?.getVoices() || [];
        setVoices(availableVoices);

        // Set default voice (prefer English)
        const englishVoice = availableVoices.find(
          (voice) => voice.lang.includes("en-IN") && voice.localService
        );
        if (englishVoice) {
          setSelectedVoice(englishVoice.name);
        } else if (availableVoices.length > 0) {
          setSelectedVoice(availableVoices[0].name);
        }
      };

      // Chrome loads voices asynchronously
      if (synth.current?.onvoiceschanged !== undefined) {
        synth.current.onvoiceschanged = loadVoices;
      }

      loadVoices();

      // Cleanup function to cancel any ongoing speech when component unmounts
      return () => {
        if (synth.current?.speaking) {
          synth.current.cancel();
        }
      };
    }
  }, []);

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
          const { progress, attempted, correct, wrong, index } =
            JSON.parse(savedProgress);
          setProgress(progress);
          setAttempted(attempted);
          setCorrect(correct);
          setWrong(wrong);
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
        JSON.stringify({ progress, attempted, correct, wrong, index })
      );
    }
  }, [progress, attempted, correct, wrong, index, chapter, questions.length]);

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
    if (synth.current?.speaking) {
      synth.current.cancel();
      setIsSpeaking(false);
    }
  }, [index, showAnswer]);

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

  const navigate = (dir: "prev" | "next") => {
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
      confirm(
        "Are you sure you want to reset all progress? This cannot be undone."
      )
    ) {
      setProgress({});
      setAttempted(0);
      setCorrect(0);
      setWrong(0);
      setIndex(0);
      setSelectedOption(null);
      setShowAnswer(false);
      localStorage.removeItem(`mcq-progress-${chapter}`);
    }
  };

  const toggleSummary = () => setShowSummary(!showSummary);
  const getCompletionPercentage = () =>
    questions.length > 0 ? Math.round((attempted / questions.length) * 100) : 0;
  const getAccuracyPercentage = () =>
    attempted > 0 ? Math.round((correct / attempted) * 100) : 0;

  // TTS functions
  const speak = (text: string) => {
    if (!synth.current) return;

    // Cancel any ongoing speech
    if (synth.current.speaking) {
      synth.current.cancel();
      setIsSpeaking(false);
      // If we're already speaking the same text, just cancel and return
      if (isSpeaking) return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Set the selected voice
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) utterance.voice = voice;

    // Set speech rate
    utterance.rate = speechRate;

    // Handle speech events
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.current.speak(utterance);
  };

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

  const stopSpeech = () => {
    if (synth.current?.speaking) {
      synth.current.cancel();
      setIsSpeaking(false);
    }
  };

  const toggleTtsSettings = () => {
    setShowTtsSettings(!showTtsSettings);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        Loading...
      </div>
    );
  if (error)
    return <div className="min-h-screen p-4 text-red-600">{error}</div>;
  if (questions.length === 0)
    return <div className="min-h-screen p-4">No questions available.</div>;

  const q = questions[index];
  const completionPercentage = getCompletionPercentage();

  // Calculate circle progress dimensions
  const radius = 45;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (completionPercentage / 100) * circumference;

  return (
    <div className="min-h-screen p-3 sm:p-6 md:p-8 bg-white text-black max-w-3xl mx-auto font-sans text-base w-full">
      {/* Header section with chapter title */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold">MCQ Practice: {chapter}</h2>
      </div>

      {/* TTS Control Bar */}
      <div className="flex justify-between items-center mb-4 bg-blue-50 rounded-lg p-2">
        <div className="flex items-center">
          <button
            onClick={toggleTtsSettings}
            className="flex items-center bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-full text-sm"
          >
            <span className="mr-1">🔊</span>
            <span>TTS Settings</span>
          </button>
          {isSpeaking && (
            <button
              onClick={stopSpeech}
              className="ml-2 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-full text-sm flex items-center"
            >
              <span className="mr-1">⏹️</span>
              <span>Stop</span>
            </button>
          )}
        </div>
      </div>

      {/* TTS Settings Panel */}
      {showTtsSettings && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4 animate-fade-in">
          <h3 className="font-bold mb-2">Text-to-Speech Settings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="voice-select"
              >
                Voice
              </label>
              <select
                id="voice-select"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full p-2 border rounded"
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                className="block text-sm font-medium mb-1"
                htmlFor="rate-select"
              >
                Speech Rate: {speechRate}x
              </label>
              <input
                id="rate-select"
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={speechRate}
                onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={toggleTtsSettings}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Big circle at the top */}
      <div className="flex justify-center mb-6">
        <div className="relative w-32 h-32 sm:w-40 sm:h-40">
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
              fontSize="20"
              fontWeight="bold"
              fill="#111827"
            >
              {index + 1}
            </text>
            <text
              x="50"
              y="65"
              textAnchor="middle"
              fontSize="14"
              fill="#4b5563"
            >
              of {questions.length}
            </text>
          </svg>
        </div>
      </div>

      {/* Summary and reset buttons */}
      <div className="flex justify-center space-x-3 mb-6">
        <button
          onClick={toggleSummary}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium"
        >
          {showSummary ? "Hide Summary" : "Show Summary"}
        </button>
        <button
          onClick={resetProgress}
          className="px-4 py-2 bg-red-100 hover:bg-red-200 rounded text-sm font-medium"
        >
          Reset Progress
        </button>
      </div>

      {/* Summary panel */}
      {showSummary && (
        <div className="w-full p-4 bg-blue-50 border border-blue-200 rounded-lg mb-6">
          <h3 className="font-bold mb-2">Progress Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Completion</p>
              <p className="font-semibold">
                {completionPercentage}% ({attempted}/{questions.length})
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Accuracy</p>
              <p className="font-semibold">
                {getAccuracyPercentage()}% ({correct}/{attempted})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Horizontal scrolling circle indicators */}
      <div
        ref={progressRef}
        className="flex overflow-x-auto gap-2 py-3 px-1 rounded-lg bg-gray-100 shadow-inner mb-6 no-scrollbar"
      >
        {questions.map((_, i) => (
          <div
            key={i}
            className={classNames(
              "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex-shrink-0 flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition duration-200 cursor-pointer",
              {
                "bg-green-500 text-white border-green-600":
                  progress[i] === "correct",
                "bg-red-500 text-white border-red-600": progress[i] === "wrong",
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

      {/* Question content with TTS button */}
      <div ref={questionRef} className="mb-4">
        <div className="font-semibold mb-4 text-base sm:text-lg flex items-start">
          <div className="flex-grow">
            <span>
              {index + 1}. {q.question}
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
            <div key={key} className="flex items-center">
              <button
                disabled={showAnswer}
                onClick={() => handleOptionClick(key)}
                className={classNames(
                  "w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg border transition duration-200 shadow-sm text-sm sm:text-base flex-grow",
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
                <span className="font-semibold">{key.toUpperCase()}.</span>{" "}
                {value}
              </button>
              <button
                onClick={() => speakOption(key, value)}
                className="ml-2 p-1 rounded-full hover:bg-blue-100 flex-shrink-0"
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
        <div className="p-3 sm:p-4 border rounded bg-yellow-50 text-sm mb-6 animate-fade-in">
          {fetchingSolution ? (
            <div className="flex items-center justify-center p-4">
              <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
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
                    {Object.entries(q.solution.incorrect_explanations).map(
                      ([key, exp]) => (
                        <li key={key} className="mb-1">
                          <strong>{key.toUpperCase()}:</strong> {exp}
                        </li>
                      )
                    )}
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

      {/* Navigation buttons - made more mobile friendly */}
      <div className="grid grid-cols-2 sm:flex sm:justify-between gap-2 mt-6">
        <button
          className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-200 rounded hover:bg-gray-300 text-sm sm:text-base"
          onClick={() => navigate("prev")}
          disabled={index === 0}
        >
          ⬅️ Previous
        </button>

        {!showAnswer && (
          <button
            className="px-3 py-2 sm:px-4 sm:py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm sm:text-base"
            onClick={() => navigate("next")}
          >
            Skip ⏭️
          </button>
        )}

        {showAnswer && index < questions.length - 1 ? (
          <button
            className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm sm:text-base col-span-2 sm:col-span-1"
            onClick={() => navigate("next")}
          >
            Next ➡️
          </button>
        ) : (
          !showAnswer && (
            <button
              className="px-3 py-2 sm:px-4 sm:py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm sm:text-base col-span-2 sm:col-span-1"
              onClick={() => handleOptionClick(q.correct_option)}
            >
              Show Answer
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default McqPractice;
