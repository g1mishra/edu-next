import { Topic } from '@/types';
import { memo } from 'react';

interface RelatedTopicsProps {
  topics: Topic[];
  onTopicClick: (topic: string) => void;
}

const typeColorMap = {
  prerequisite: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/30',
  extension: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30',
  application: 'bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30',
  parallel: 'bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/30 hover:bg-fuchsia-500/30',
  deeper: 'bg-rose-500/20 text-rose-400 border-rose-500/30 hover:bg-rose-500/30',
  default: 'bg-gray-500/20 text-gray-400 border-gray-500/30 hover:bg-gray-500/30'
} as const;

export const RelatedTopics = memo(({ topics, onTopicClick }: RelatedTopicsProps) => {
  const getTypeColor = (type: string) => typeColorMap[type as keyof typeof typeColorMap] || typeColorMap.default;

  return (
    <div className="flex flex-wrap gap-2 mt-4 mb-6">
      {topics.map((topic, index) => (
        <button
          key={`${topic.topic}-${index}`}
          onClick={() => onTopicClick(topic.topic)}
          className={`px-3 py-1 rounded-full text-xs font-medium border 
            transition-all duration-200 hover:scale-105 
            ${getTypeColor(topic.type)}`}
          title={topic.reason}
        >
          {topic.topic}
        </button>
      ))}
    </div>
  );
});

RelatedTopics.displayName = 'RelatedTopics';