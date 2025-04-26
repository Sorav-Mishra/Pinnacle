// components/footer.js
"use client";

import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  // Lists of SSC exams for SEO-friendly linking
  const sscExams = [
    { name: "SSC CGL", path: "/ssc-pyq" },
    { name: "SSC CHSL", path: "/ssc-pyq" },
    { name: "SSC CPO", path: "/ssc-pyq" },
    { name: "SSC GD", path: "/ssc-pyq" },
    { name: "SSC MTS", path: "/ssc-pyq" },
    { name: "SSC Stenographer", path: "/ssc-pyq" },
    { name: "SSC JE", path: "/ssc-pyq&exam=je" },
    { name: "SSC Selection Post", path: "/ssc-pyq" },
    { name: "SSC JHT", path: "/ssc-pyq" },
    { name: "SSC Delhi Police", path: "/ssc-pyq" },
  ];

  // Organize all topic lists for better structure
  const allTopics = {
    english: [
      { name: "Spot the Error", path: "/ssc-pyqs/spot-the-error" },
      { name: "Sentence Improvement", path: "/ssc-pyqs/sentence-improvement" },
      { name: "Narration", path: "/ssc-pyqs/narration" },
      { name: "Active/Passive Voice", path: "/ssc-pyqs/active-passive" },
      { name: "Fill in the Blanks", path: "/ssc-pyqs/fill-in-the-blanks" },
      {
        name: "One Word Substitution",
        path: "/ssc-pyqs/one-word-substitution",
      },
      { name: "Idioms and Phrases", path: "/ssc-pyqs/idioms" },
      { name: "Synonyms", path: "/ssc-pyqs/synonyms" },
      { name: "Antonyms", path: "/ssc-pyqs/antonyms" },
      { name: "Spelling Check", path: "/ssc-pyqs/spelling-check" },
    ],
    subjects: [
      { name: "History", path: "/ssc-pyqs/history" },
      { name: "Polity", path: "/ssc-pyqs/polity" },
      { name: "Geography", path: "/ssc-pyqs/geography" },
      { name: "Economics", path: "/ssc-pyqs/economics" },
      { name: "Physics", path: "/ssc-pyqs/physics" },
      { name: "Chemistry", path: "/ssc-pyqs/chemistrychapters" },
      { name: "Biology", path: "/ssc-pyqs/biology" },
      { name: "Current Affairs", path: "/ssc-pyqs/current-affairs" },
    ],
    gk: [
      { name: "Static GK", path: "/ssc-pyqs/static-gk" },
      { name: "Dance", path: "/ssc-pyqs/static-gk?subtopic=dance" },
      {
        name: "Arts Personality",
        path: "/ssc-pyqs/static-gk?subtopic=arts-personality",
      },
      { name: "Arts Awards", path: "/ssc-pyqs/static-gk?subtopic=arts-awards" },
      {
        name: "Musical Instruments",
        path: "/ssc-pyqs/static-gk?subtopic=musical-instruments",
      },
      { name: "Festivals", path: "/ssc-pyqs/static-gk?subtopic=festivals" },
      { name: "Fairs", path: "/ssc-pyqs/static-gk?subtopic=fairs" },
      {
        name: "Cultural Heritage",
        path: "/ssc-pyqs/static-gk?subtopic=painting-dress-tribes",
      },
      {
        name: "First in India/World",
        path: "/ssc-pyqs/static-gk?subtopic=first-in-india",
      },
      { name: "Sports", path: "/ssc-pyqs/static-gk?subtopic=sports" },
      {
        name: "Books and Authors",
        path: "/ssc-pyqs/static-gk?subtopic=books-and-authors",
      },
      {
        name: "Famous Personalities",
        path: "/ssc-pyqs/static-gk?subtopic=famous-personality",
      },
      {
        name: "Important Days",
        path: "/ssc-pyqs/static-gk?subtopic=important-days",
      },
      { name: "States GK", path: "/ssc-pyqs/static-gk?subtopic=states-gk" },
      {
        name: "Organizations",
        path: "/ssc-pyqs/static-gk?subtopic=organisation",
      },
      { name: "World GK", path: "/ssc-pyqs/static-gk?subtopic=world-gk" },
      {
        name: "Computer Knowledge",
        path: "/ssc-pyqs/static-gk?subtopic=computer",
      },
      { name: "Full Forms", path: "/ssc-pyqs/static-gk?subtopic=full-forms" },
      {
        name: "Religious Places",
        path: "/ssc-pyqs/static-gk?subtopic=religious-places",
      },
      {
        name: "Awards and Honors",
        path: "/ssc-pyqs/static-gk?subtopic=awards",
      },
      {
        name: "Important Events",
        path: "/ssc-pyqs/static-gk?subtopic=important-events",
      },
      { name: "Founders", path: "/ssc-pyqs/static-gk?subtopic=founders" },
      {
        name: "Government Schemes",
        path: "/ssc-pyqs/static-gk?subtopic=schemes",
      },
      {
        name: "Miscellaneous GK",
        path: "/ssc-pyqs/static-gk?subtopic=miscellaneous",
      },
    ],
  };

  // Years for PYQs - useful for SEO
  const examYears = [
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
    "2018",
    "2017",
    "2016",
    "2015",
  ];

  // Social media links with proper SVG icons
  const socialLinks = [
    {
      name: "Facebook",
      icon: (
        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
      ),
      url: "#",
    },
    {
      name: "Twitter",
      icon: (
        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
      ),
      url: "#",
    },
    {
      name: "LinkedIn",
      icon: (
        <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
      ),
      url: "#",
    },
    {
      name: "YouTube",
      icon: (
        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
      ),
      url: "#",
    },
    {
      name: "Telegram",
      icon: (
        <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19l-9.48 5.99-3.95-1.3c-.87-.28-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71l-3.75-2.78-1.8 1.73c-.25.24-.46.45-.86.45-.4 0-.57-.15-.76-.56l-1.44-4.74z" />
      ),
      url: "#",
    },
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 pt-10 sm:pt-16 pb-8 border-t border-gray-200 dark:border-gray-800 shadow-inner">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Company Information */}
          <div>
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white relative">
              <span className="inline-block pr-2 after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-16 after:h-1 after:bg-blue-600 dark:after:bg-blue-500">
                SSC Exam Preparation
              </span>
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed text-sm sm:text-base">
              Your comprehensive companion for SSC exam success. Access over
              20,000+ meticulously curated practice questions, subject-wise
              categorization, and authentic previous year papers to boost your
              preparation strategy.
            </p>
            <div className="flex flex-wrap space-x-3 mt-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  aria-label={social.name}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 transition-all duration-300 border border-gray-200 dark:border-gray-700 shadow-sm mb-2"
                >
                  <span className="sr-only">{social.name}</span>
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {social.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* SSC Exams Links */}
          <div className="mt-6 sm:mt-0">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white relative">
              <span className="inline-block pr-2 after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-16 after:h-1 after:bg-blue-600 dark:after:bg-blue-500">
                SSC Exam Resources
              </span>
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {sscExams.slice(0, 6).map((exam, index) => (
                <li
                  key={index}
                  className="transition-transform duration-200 hover:translate-x-1"
                >
                  <Link
                    href={exam.path}
                    className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors flex items-center text-sm sm:text-base"
                  >
                    <span className="text-blue-600 dark:text-blue-400 mr-2">
                      ›
                    </span>
                    {exam.name} Previous Year Papers
                  </Link>
                </li>
              ))}
              <li className="mt-2">
                <Link
                  href="/ssc-pyq"
                  className="inline-block mt-2 text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm sm:text-base"
                >
                  View All Exams →
                </Link>
              </li>
            </ul>
          </div>

          {/* Subject Areas */}
          <div className="mt-6 lg:mt-0">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white relative">
              <span className="inline-block pr-2 after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-16 after:h-1 after:bg-blue-600 dark:after:bg-blue-500">
                Subject Resources
              </span>
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              {allTopics.subjects.slice(0, 6).map((subject, index) => (
                <li
                  key={index}
                  className="transition-transform duration-200 hover:translate-x-1"
                >
                  <Link
                    href={subject.path}
                    className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors flex items-center text-sm sm:text-base"
                  >
                    <span className="text-blue-600 dark:text-blue-400 mr-2">
                      ›
                    </span>
                    {subject.name} Questions & Solutions
                  </Link>
                </li>
              ))}
              <li className="mt-2">
                <Link
                  href="/ssc-pyq"
                  className="inline-block mt-2 text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm sm:text-base"
                >
                  Explore All Subjects →
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="mt-6 lg:mt-0">
            <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-900 dark:text-white relative">
              <span className="inline-block pr-2 after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-16 after:h-1 after:bg-blue-600 dark:after:bg-blue-500">
                Quick Access
              </span>
            </h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="transition-transform duration-200 hover:translate-x-1">
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors flex items-center text-sm sm:text-base"
                >
                  <span className="text-blue-600 dark:text-blue-400 mr-2">
                    ›
                  </span>
                  Personalized Dashboard
                </Link>
              </li>
              <li className="transition-transform duration-200 hover:translate-x-1">
                <Link
                  href="/ssc-pyq"
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors flex items-center text-sm sm:text-base"
                >
                  <span className="text-blue-600 dark:text-blue-400 mr-2">
                    ›
                  </span>
                  Premium Study Materials
                </Link>
              </li>
              <li className="transition-transform duration-200 hover:translate-x-1">
                <Link
                  href="/mock-tests"
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors flex items-center text-sm sm:text-base"
                >
                  <span className="text-blue-600 dark:text-blue-400 mr-2">
                    ›
                  </span>
                  Full-Length Mock Tests
                </Link>
              </li>
              <li className="transition-transform duration-200 hover:translate-x-1">
                <Link
                  href="/performance-analytics"
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors flex items-center text-sm sm:text-base"
                >
                  <span className="text-blue-600 dark:text-blue-400 mr-2">
                    ›
                  </span>
                  Performance Analytics
                </Link>
              </li>
              <li className="hidden sm:block transition-transform duration-200 hover:translate-x-1">
                <Link
                  href="/doubt-resolution"
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors flex items-center text-sm sm:text-base"
                >
                  <span className="text-blue-600 dark:text-blue-400 mr-2">
                    ›
                  </span>
                  Expert Doubt Resolution
                </Link>
              </li>
              <li className="hidden sm:block transition-transform duration-200 hover:translate-x-1">
                <Link
                  href="/success-stories"
                  className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors flex items-center text-sm sm:text-base"
                >
                  <span className="text-blue-600 dark:text-blue-400 mr-2">
                    ›
                  </span>
                  Success Stories
                </Link>
              </li>
              <li className="sm:hidden mt-2">
                <Link
                  href="/more-resources"
                  className="inline-block mt-2 text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm"
                >
                  More Resources →
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* SEO Links Section - Collapsed by default for better UX */}
        <div className="mb-6 sm:mb-8">
          <details className="group cursor-pointer">
            <summary className="font-medium text-gray-800 dark:text-gray-200 mb-3 outline-none flex items-center text-sm sm:text-base">
              <span className="text-blue-600 dark:text-blue-400 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 inline group-open:rotate-90 transition-transform duration-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              English Language Topics
            </summary>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 pl-6 sm:pl-7 mt-3 pb-2">
              {allTopics.english.map((topic, index) => (
                <Link
                  key={index}
                  href={topic.path}
                  className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors hover:underline truncate"
                >
                  {topic.name}
                </Link>
              ))}
            </div>
          </details>
        </div>

        <div className="mb-6 sm:mb-8">
          <details className="group cursor-pointer">
            <summary className="font-medium text-gray-800 dark:text-gray-200 mb-3 outline-none flex items-center text-sm sm:text-base">
              <span className="text-blue-600 dark:text-blue-400 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 inline group-open:rotate-90 transition-transform duration-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              General Knowledge Resources
            </summary>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 pl-6 sm:pl-7 mt-3 pb-2">
              {allTopics.gk.map((topic, index) => (
                <Link
                  key={index}
                  href={topic.path}
                  className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors hover:underline truncate"
                >
                  {topic.name}
                </Link>
              ))}
            </div>
          </details>
        </div>

        {/* Year-wise PYQs for SEO */}
        <div className="mb-8">
          <details className="group cursor-pointer">
            <summary className="font-medium text-gray-800 dark:text-gray-200 mb-3 outline-none flex items-center text-sm sm:text-base">
              <span className="text-blue-600 dark:text-blue-400 mr-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 inline group-open:rotate-90 transition-transform duration-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              Year-wise SSC Previous Papers
            </summary>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 pl-6 sm:pl-7 mt-3 pb-2">
              {sscExams.slice(0, 5).map((exam) =>
                examYears.slice(0, 5).map((year, yIndex) => (
                  <Link
                    key={`${exam.name}-${year}-${yIndex}`}
                    href={`${exam.path}&year=${year}`}
                    className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors hover:underline truncate"
                  >
                    {exam.name} {year}
                  </Link>
                ))
              )}
            </div>
          </details>
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md mb-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0 md:mr-6 text-center md:text-left">
              <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2">
                Subscribe for Exam Updates
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Get the latest SSC notifications, study tips, and free resources
                directly in your inbox
              </p>
            </div>
            <div className="w-full md:w-auto">
              <div className="flex max-w-md mx-auto md:mx-0">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-3 sm:px-4 py-2 text-sm rounded-l-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-3 sm:px-6 rounded-r-md transition duration-300 text-sm whitespace-nowrap">
                  Subscribe
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center md:text-left">
                We respect your privacy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Popular Keyword Combinations for SEO */}
        <div className="text-xs text-gray-500 dark:text-gray-500 mt-6 sm:mt-8 border-t border-gray-200 dark:border-gray-800 pt-6 sm:pt-8">
          <h4 className="font-medium mb-2 sm:mb-3 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
            Popular Search Terms:
          </h4>
          <p className="leading-relaxed text-xs">
            SSC CGL Previous Year Papers with Solutions, SSC CHSL Topic-wise
            Question Bank, SSC GD Constable Practice Sets, English Grammar Rules
            for Competitive Exams, Quantitative Aptitude Shortcuts for SSC,
            Static GK Notes PDF for SSC, Current Affairs Monthly Digest for
            Government Exams, SSC Exam Pattern and Strategy, SSC Detailed
            Syllabus Analysis, SSC Preparation Tips from Toppers, SSC Tier 1
            Solved Papers with Explanations, SSC Tier 2 Practice Questions with
            Solutions, SSC Exam Result Analysis, SSC Admit Card Download Guide,
            SSC Exam Calendar 2023-24, SSC Study Material Free Download, SSC
            Online Mock Test Series, English Grammar Rules for Beginners,
            Quantitative Aptitude Math Shortcuts and Tricks, Logical Reasoning
            Practice for SSC, Government Job Preparation Strategy, Crack SSC in
            First Attempt
          </p>
        </div>

        {/* Copyright and Trust Signals */}
        <div className="pt-6 sm:pt-8 mt-6 sm:mt-8 border-t border-gray-200 dark:border-gray-800 flex flex-col md:flex-row items-center justify-between">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-4 md:mb-0 text-center md:text-left">
            © {currentYear} SSC Exam Preparation Hub. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-3 sm:gap-4">
            <Link
              href="/privacy-policy"
              className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/contact-us"
              className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
