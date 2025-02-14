import { SearchBar } from "../searchbar";

interface SearchSectionProps {
  onSearch: (query: string) => void;
}

export const SearchSection: React.FC<SearchSectionProps> = ({ onSearch }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
        What do you want to practice?
      </h1>

      <div className="w-full max-w-xl mx-auto">
        <SearchBar
          onSearch={onSearch}
          placeholder="Enter what you want to practice..."
          centered={true}
          className="bg-gray-900/80"
        />

        <p className="text-sm text-gray-400 text-center mt-1">Press Enter to search</p>

        <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
          <span className="text-sm text-gray-400">Try:</span>

          {[
            { text: "Quantum Physics", icon: "⚛️", color: "purple" },
            { text: "Machine Learning", icon: "🤖", color: "blue" },
            { text: "World History", icon: "🌍", color: "green" },
          ].map((topic) => (
            <button
              key={topic.text}
              onClick={() => onSearch(topic.text)}
              className={`px-3 py-1.5 rounded-lg bg-${topic.color}-500/20 
                    hover:bg-${topic.color}-500/30 border border-${topic.color}-500/30 
                    transition-colors text-xs sm:text-sm text-${topic.color}-300`}
            >
              {topic.icon} {topic.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
