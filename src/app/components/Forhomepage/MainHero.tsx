"use client";

import React from "react";
import Link from "next/link";

const MainHero: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-gradient-to-r from-blue-700 to-blue-500 text-white px-6 py-12 space-y-6 dark:bg-gradient-to-r dark:from-blue-900 dark:to-blue-700 dark:text-gray-100 mt-14">
      {/* Hero Banner */}
      <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
        Master SSC Exams with Confidence
      </h1>
      <p className="text-md md:text-xl max-w-2xl text-gray-100 dark:text-gray-300">
        Practice 20,000+ real SSC questions for CGL, CHSL, MTS, CPO, JE, GD and
        more. Your success journey starts here with Pinnacle Online!
      </p>
      <Link href="/ssc-pyq">
        <button className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full hover:bg-gray-100 transition-all dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700">
          Start Practicing →
        </button>
      </Link>
    </div>
  );
};

export default MainHero;
