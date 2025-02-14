import { Heart, Trophy } from "lucide-react";

interface SummaryCardProps {
  stats: {
    accuracy: number;
    questions: number;
    streak: number;
    bestStreak: number;
    avgTime: number;
  };
  isOutOfHearts?: boolean;
  onStartNew: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ stats, isOutOfHearts, onStartNew }) => {
  const getPerformanceMessage = () => {
    if (isOutOfHearts) {
      return {
        title: "Out of Hearts!",
        subtitle: "Don't give up! Each mistake is a chance to learn.",
        message: stats.questions > 0 
          ? `You answered ${stats.questions} questions with ${Math.round(stats.accuracy)}% accuracy. Ready to try again?`
          : "Ready to start your practice session?",
      };
    }

    const accuracy = Math.round(stats.accuracy);
    if (accuracy >= 90) {
      return {
        title: "Outstanding! 🌟",
        subtitle: "You're absolutely crushing it!",
        message: `Perfect accuracy of ${accuracy}% across ${stats.questions} questions. Your best streak was ${stats.bestStreak}!`,
      };
    } else if (accuracy >= 70) {
      return {
        title: "Well Done! 🎉",
        subtitle: "That's some solid progress!",
        message: `You maintained ${accuracy}% accuracy across ${stats.questions} questions with a best streak of ${stats.bestStreak}.`,
      };
    } else {
      return {
        title: "Session Complete! 📚",
        subtitle: "Practice makes perfect!",
        message: `Keep going! You're learning with each question. Your accuracy will improve with more practice.`,
      };
    }
  };

  const message = getPerformanceMessage();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto text-center">
      <div className="mb-6">
        {isOutOfHearts ? (
          <div className="flex justify-center mb-4">
            <Heart className="w-16 h-16 text-red-500" />
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
        )}
        <h2 className="text-2xl font-bold mb-2">{message.title}</h2>
        <p className="text-gray-400 mb-2">{message.subtitle}</p>
        <p className="text-sm text-gray-300">{message.message}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-primary">{Math.round(stats.accuracy)}%</div>
          <div className="text-sm text-gray-400">Accuracy</div>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-primary">{stats.questions}</div>
          <div className="text-sm text-gray-400">Questions</div>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-500">{stats.bestStreak}</div>
          <div className="text-sm text-gray-400">Best Streak</div>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-purple-500">{Math.round(stats.avgTime)}s</div>
          <div className="text-sm text-gray-400">Avg. Time</div>
        </div>
      </div>

      <button
        onClick={onStartNew}
        className="w-full bg-primary hover:bg-primary/90 text-white py-3 rounded-lg"
      >
        {isOutOfHearts ? "Try Again" : "Start New Session"}
      </button>
    </div>
  );
};
