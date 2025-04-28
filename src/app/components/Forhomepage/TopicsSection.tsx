"use client";

import React from "react";
import { BookOpen, Globe, Star } from "lucide-react";
import TopicGrid from "./TopicGrid";
import { englishTopics, gkTopics, subjectTopics } from "./topicsdata";

const TopicsSection: React.FC = () => {
  return (
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
  );
};

export default TopicsSection;
