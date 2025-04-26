"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  Globe,
  Star,
  CheckCircle,
  Flame,
  // Moon,
  // Sun,
} from "lucide-react";
import Footer from "./components/footer";

// Properly defined interface
interface Topic {
  name: string;
  path: string;
  description?: string;
}

export default function HomePage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  // Handle dark mode toggle and persist user preference
  useEffect(() => {
    // Check for saved preference or system preference
    const savedMode = localStorage.getItem("darkMode");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedMode !== null) {
      setDarkMode(savedMode === "true");
    } else {
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Save preference
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // Topic data categorized by subject
  const englishTopics: Topic[] = [
    {
      name: "Spot the Error",
      path: "/ssc-pyqs/spot-the-error",
      description: "Identify grammatical errors in sentences",
    },
    {
      name: "Sentence Improvement",
      path: "/ssc-pyqs/sentence-improvement",
      description: "Enhance sentence structure and clarity",
    },
    {
      name: "Narration",
      path: "/ssc-pyqs/narration",
      description: "Direct and indirect speech practice",
    },
    {
      name: "Active/Passive",
      path: "/ssc-pyqs/active-passive",
      description: "Convert between active and passive voice",
    },
    {
      name: "Fill in the Blanks",
      path: "/ssc-pyqs/fill-in-the-blanks",
      description: "Complete sentences with appropriate words",
    },
    {
      name: "One Word Substitution",
      path: "/ssc-pyqs/one-word-substitution",
      description: "Replace phrases with single words",
    },
    {
      name: "Idioms",
      path: "/ssc-pyqs/idioms",
      description: "Common idiomatic expressions",
    },
    {
      name: "Synonyms",
      path: "/ssc-pyqs/synonyms",
      description: "Words with similar meanings",
    },
    {
      name: "Antonyms",
      path: "/ssc-pyqs/antonyms",
      description: "Words with opposite meanings",
    },
    {
      name: "Spelling Check",
      path: "/ssc-pyqs/spelling-check",
      description: "Identify and correct spelling errors",
    },
  ];

  const gkTopics: Topic[] = [
    {
      name: "Static GK",
      path: "/ssc-pyqs/static-gk",
      description: "General knowledge that remains constant",
    },
    {
      name: "Dance",
      path: "/ssc-pyqs/static-gk?subtopic=dance",
      description: "Classical and folk dances of India",
    },
    {
      name: "Arts Personality",
      path: "/ssc-pyqs/static-gk?subtopic=arts-personality",
      description: "Famous artists and their contributions",
    },
    {
      name: "Arts Awards",
      path: "/ssc-pyqs/static-gk?subtopic=arts-awards",
      description: "Recognitions in various art forms",
    },
    {
      name: "Musical Instruments",
      path: "/ssc-pyqs/static-gk?subtopic=musical-instruments",
      description: "Traditional and modern instruments",
    },
    {
      name: "Festivals",
      path: "/ssc-pyqs/static-gk?subtopic=festivals",
      description: "Cultural and religious celebrations",
    },
    {
      name: "Fairs",
      path: "/ssc-pyqs/static-gk?subtopic=fairs",
      description: "Traditional gatherings and expositions",
    },
    {
      name: "Songs, Painting, Dress, Tribes",
      path: "/ssc-pyqs/static-gk?subtopic=painting-dress-tribes",
      description: "Cultural heritage elements",
    },
    {
      name: "First in India/World",
      path: "/ssc-pyqs/static-gk?subtopic=first-in-india",
      description: "Pioneering achievements",
    },
    {
      name: "Sports",
      path: "/ssc-pyqs/static-gk?subtopic=sports",
      description: "Games, tournaments and athletes",
    },
    {
      name: "Books and Authors",
      path: "/ssc-pyqs/static-gk?subtopic=books-and-authors",
      description: "Literary works and their creators",
    },
    {
      name: "Famous Personality",
      path: "/ssc-pyqs/static-gk?subtopic=famous-personality",
      description: "Notable individuals and their achievements",
    },
    {
      name: "Important Days",
      path: "/ssc-pyqs/static-gk?subtopic=important-days",
      description: "Significant dates and commemorations",
    },
    {
      name: "States GK",
      path: "/ssc-pyqs/static-gk?subtopic=states-gk",
      description: "State-specific knowledge",
    },
    {
      name: "Organisation",
      path: "/ssc-pyqs/static-gk?subtopic=organisation",
      description: "Important institutions and bodies",
    },
    {
      name: "World GK",
      path: "/ssc-pyqs/static-gk?subtopic=world-gk",
      description: "International knowledge and facts",
    },
    {
      name: "Computer",
      path: "/ssc-pyqs/static-gk?subtopic=computer",
      description: "Computer basics and technology",
    },
    {
      name: "Full Forms",
      path: "/ssc-pyqs/static-gk?subtopic=full-forms",
      description: "Expanded forms of common abbreviations",
    },
    {
      name: "Religious Places",
      path: "/ssc-pyqs/static-gk?subtopic=religious-places",
      description: "Spiritual and worship sites",
    },
    {
      name: "Awards",
      path: "/ssc-pyqs/static-gk?subtopic=awards",
      description: "Honors and recognitions",
    },
    {
      name: "Important Events",
      path: "/ssc-pyqs/static-gk?subtopic=important-events",
      description: "Historical occurrences",
    },
    {
      name: "Founders",
      path: "/ssc-pyqs/static-gk?subtopic=founders",
      description: "Originators of organizations and movements",
    },
    {
      name: "Schemes",
      path: "/ssc-pyqs/static-gk?subtopic=schemes",
      description: "Government initiatives and programs",
    },
    {
      name: "Miscellaneous",
      path: "/ssc-pyqs/static-gk?subtopic=miscellaneous",
      description: "Other important GK topics",
    },
  ];

  const subjectTopics: Topic[] = [
    {
      name: "History",
      path: "/ssc-pyqs/history",
      description: "Study of past events",
    },
    {
      name: "Polity",
      path: "/ssc-pyqs/polity",
      description: "Constitutional framework and governance",
    },
    {
      name: "Geography",
      path: "/ssc-pyqs/geography",
      description: "Physical and human geography concepts",
    },
    {
      name: "Economics",
      path: "/ssc-pyqs/economics",
      description: "Economic theories and Indian economy",
    },
    {
      name: "Physics",
      path: "/ssc-pyqs/physics",
      description: "Laws of nature and properties of matter",
    },
    {
      name: "Chemistry",
      path: "/ssc-pyqs/chemistrychapters",
      description: "Study of matter, substances and reactions",
    },
    {
      name: "Biology",
      path: "/ssc-pyqs/biology",
      description: "Study of living organisms",
    },
    {
      name: "Current Affairs",
      path: "/ssc-pyqs/current-affairs",
      description: "Recent events and developments",
    },
  ];

  // Component for topic grid with responsive layout
  const TopicGrid = ({
    title,
    topics,
    color,
    icon,
  }: {
    title: string;
    topics: Topic[];
    color: "blue" | "green" | "purple";
    icon: React.ReactNode;
  }) => {
    // Map color theme to classes for light and dark mode
    const colorClasses = {
      blue: {
        icon: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300",
        button:
          "bg-blue-50 text-blue-800 hover:bg-blue-100 border-blue-200 dark:bg-blue-900/40 dark:text-blue-200 dark:border-blue-800 dark:hover:bg-blue-900/60",
      },
      green: {
        icon: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300",
        button:
          "bg-green-50 text-green-800 hover:bg-green-100 border-green-200 dark:bg-green-900/40 dark:text-green-200 dark:border-green-800 dark:hover:bg-green-900/60",
      },
      purple: {
        icon: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300",
        button:
          "bg-purple-50 text-purple-800 hover:bg-purple-100 border-purple-200 dark:bg-purple-900/40 dark:text-purple-200 dark:border-purple-800 dark:hover:bg-purple-900/60",
      },
    };

    return (
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className={`p-2 rounded-lg ${colorClasses[color].icon}`}>
            {icon}
          </div>
          <h2 className="text-2xl font-bold dark:text-white">{title}</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {topics.map((topic, index) => (
            <button
              key={index}
              onClick={() => router.push(topic.path)}
              className={`py-3 px-4 rounded-xl text-sm font-medium border shadow-sm transition-all hover:shadow-md hover:-translate-y-1 flex flex-col items-center justify-center h-24 ${colorClasses[color].button}`}
              title={topic.description || topic.name}
            >
              <span className="text-center line-clamp-2">{topic.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  // Stats data for the metrics section
  const stats = [
    {
      icon: <BookOpen size={32} />,
      value: "20,000+",
      label: "Practice Questions",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      icon: <CheckCircle size={32} />,
      value: "100+",
      label: "Topic Categories",
      color: "text-green-600 dark:text-green-400",
    },
    {
      icon: <Flame size={32} />,
      value: "5+",
      label: "Years Coverage",
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      icon: <BookOpen size={32} />,
      value: "24/7",
      label: "Learning Access",
      color: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: <CheckCircle size={32} />,
      value: "Absolutely",
      label: "Free",
      color: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation bar with dark mode toggle */}
      {/* <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Star className="text-blue-600 dark:text-blue-400" size={24} />
            <span className="font-bold text-xl text-gray-900 dark:text-white">
              SSC Exam Prep
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="text-yellow-400" size={20} />
              ) : (
                <Moon className="text-gray-700" size={20} />
              )}
            </button>

            <button
              onClick={() => router.push("/dashboard")}
              className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Dashboard
            </button>

            <button
              onClick={() => router.push("/ssc-pyq")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              Start Practice
            </button>
          </div>
        </div>
      </nav> */}

      {/* Hero Section with animated background */}
      <div className="relative bg-gradient-to-r from-blue-800 to-blue-600 dark:from-blue-900 dark:to-blue-800 text-white overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: `${Math.random() * 20 + 5}px`,
                  height: `${Math.random() * 20 + 5}px`,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.5 + 0.2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero content */}
        <div className="relative flex flex-col items-center justify-center py-20 px-6 h-96 md:h-80 mt-12">
          <div className="max-w-3xl text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Master SSC Exams with Confidence
            </h1>
            <p className="text-lg md:text-xl text-blue-100">
              Access <span className="font-bold text-white">20,000+</span> SSC
              PYQS questions for English, GK & Subjects
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <button
                onClick={() => router.push("/ssc-pyq")}
                className="bg-white text-blue-700 px-8 py-3.5 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl 
             dark:bg-blue-700 dark:text-white dark:hover:bg-blue-800"
              >
                Start Practicing
              </button>
              {/* <button
                onClick={() => router.push("/dashboard")}
                className="bg-purple-700 text-white border border-purple-400 px-8 py-3.5 rounded-lg text-lg font-semibold hover:bg-purple-600 transition-all 
             dark:bg-purple-800 dark:border-purple-700 dark:hover:bg-purple-700"
              >
                View Dashboard
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white dark:bg-gray-800 shadow-md py-8">
        <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center p-3"
            >
              <div className={stat.color}>{stat.icon}</div>
              <div className={`text-3xl font-bold mt-2 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Topics sections */}
      <div className="container mx-auto p-6 sm:p-8 md:p-10 mt-6">
        <TopicGrid
          title="English Topics"
          topics={englishTopics}
          color="blue"
          icon={<BookOpen size={24} />}
        />
        <TopicGrid
          title="GK Topics"
          topics={gkTopics}
          color="green"
          icon={<Globe size={24} />}
        />
        <TopicGrid
          title="Subject-wise Topics"
          topics={subjectTopics}
          color="purple"
          icon={<Star size={24} />}
        />
      </div>

      {/* Features section */}
      <div className="bg-gray-100 dark:bg-gray-800 py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">
            Why Choose Our Platform?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
              <div className="bg-blue-100 dark:bg-blue-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle
                  className="text-blue-600 dark:text-blue-400"
                  size={24}
                />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">
                Real Exam Questions
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Practice with actual questions from previous SSC exams for
                authentic preparation experience.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
              <div className="bg-green-100 dark:bg-green-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BookOpen
                  className="text-green-600 dark:text-green-400"
                  size={24}
                />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">
                Comprehensive Coverage
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Access topics across all subjects required for SSC exams in one
                organized platform.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-md">
              <div className="bg-purple-100 dark:bg-purple-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Flame
                  className="text-purple-600 dark:text-purple-400"
                  size={24}
                />
              </div>
              <h3 className="text-xl font-bold mb-2 dark:text-white">
                Performance Tracking
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Monitor your progress with detailed analytics and focus on areas
                that need improvement.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
