import { Trophy, Timer, Target, Award, Heart, HeartCrack } from "lucide-react";

interface StatsProps {
  accuracy: number;
  questions: number;
  streak: number;
  currentTime: number;
  hearts: number;
}

export const Stats: React.FC<StatsProps> = ({
  accuracy,
  questions,
  streak,
  currentTime,
  hearts,
}) => {
  const formatAccuracy = (acc: number): number => Math.round(acc);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-2">
      <div className="card">
        <div className="flex items-center gap-2 text-primary">
          <Trophy className="w-5 h-5" />
          <span className="text-sm font-medium">Score</span>
        </div>
        <div className="mt-1 text-xl font-semibold">{formatAccuracy(accuracy)}%</div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <span className="stats-value text-xs sm:text-base text-primary">{questions}</span>
          <Target className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        </div>
        <span className="stats-label text-xs sm:text-sm">Questions</span>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <span className="stats-value text-yellow-500">{streak}</span>
          <Award className="w-5 h-5 text-yellow-500" />
        </div>
        <span className="stats-label">Streak</span>
      </div>

      <div className="card">
        <div className="flex items-center justify-between">
          <span className="stats-value text-purple-500">{currentTime}s</span>
          <Timer className="w-5 h-5 text-purple-500" />
        </div>
        <span className="stats-label">Time</span>
      </div>

      <div className="card">
        <div className="flex items-center gap-2">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="text-xl">
              {i < hearts ? (
                <Heart className="text-red-500" />
              ) : (
                <HeartCrack className="text-gray-300" />
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
