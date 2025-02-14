import { CheckCircle, XCircle, Lightbulb, Play, Pause, HeartCrack } from "lucide-react";
import { Question } from "@/types";
import { Loading } from "../loading";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  showExplanation: boolean;
  isPaused: boolean;
  nextQuestionCountdown: number | null;
  COUNTDOWN_DURATION: number;
  onAnswer: (index: number) => void;
  onTogglePause: () => void;
  isLoadingNext: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  showExplanation,
  isPaused,
  nextQuestionCountdown,
  COUNTDOWN_DURATION,
  onAnswer,
  onTogglePause,
  isLoadingNext,
}) => {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-4 mb-8 transition-all duration-200 hover:shadow-xl">
      {isLoadingNext && (
        <div className="absolute inset-0 bg-black/10 dark:bg-white/5 backdrop-blur-sm flex items-center justify-center rounded-lg z-10 transition-all duration-300">
          <Loading size="lg" />
        </div>
      )}
      <div className="relative">
        {selectedAnswer !== null && selectedAnswer !== question.correctAnswer && (
          <AnimatePresence>
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              exit={{ opacity: 0 }}
              className="absolute top-4 right-4"
            >
              <HeartCrack className="text-red-500 w-6 h-6" />
            </motion.div>
          </AnimatePresence>
        )}
        <div className="card flex-1 flex flex-col space-y-6">
          <div className="flex justify-between items-start gap-4">
            <h2 className="text-sm sm:text-lg font-medium leading-relaxed text-gray-200 max-w-3xl whitespace-pre-line tracking-wide">
              {question.text}
            </h2>
            <button
              onClick={onTogglePause}
              className="p-2.5 rounded-lg hover:bg-gray-700/50 active:bg-gray-700/70 transition-all duration-200 flex-shrink-0 
                hover:scale-105 active:scale-95"
            >
              {isPaused ? (
                <Play className="w-5 h-5 text-primary" />
              ) : (
                <Pause className="w-5 h-5 text-primary" />
              )}
            </button>
          </div>

          <div className="space-y-3">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => onAnswer(idx)}
                disabled={selectedAnswer !== null}
                className={`w-full text-left px-4 sm:px-5 py-3 sm:py-4 rounded-lg 
                  text-sm sm:text-base leading-relaxed transition-all duration-200
                  transform hover:scale-[1.01] active:scale-[0.99]
                  ${
                    selectedAnswer === null
                      ? "bg-gray-700 hover:bg-gray-800/80 hover:shadow-md"
                      : idx === question.correctAnswer
                      ? "bg-green-500/10 text-green-500 border border-green-500/20"
                      : selectedAnswer === idx
                      ? "bg-red-500/10 text-red-500 border border-red-500/20"
                      : "bg-card opacity-50"
                  }`}
              >
                <span className="inline-block w-6 sm:w-7 font-semibold">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {option}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-4 space-y-4 animate-fadeIn">
              {!isPaused && nextQuestionCountdown !== null && (
                <div className="mb-4">
                  <div className="relative h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-primary transition-all duration-100"
                      style={{
                        width: `${(nextQuestionCountdown / COUNTDOWN_DURATION) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="mt-2 text-xs text-gray-400 text-center font-medium">
                    Next question in {nextQuestionCountdown.toFixed(0)}s
                  </div>
                </div>
              )}

              <div
                className={`px-4 py-3 rounded-lg border transition-all duration-300 ${
                  selectedAnswer === question.correctAnswer
                    ? "bg-green-500/10 border-green-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-1.5 rounded-full ${
                      selectedAnswer === question.correctAnswer
                        ? "bg-green-500/20"
                        : "bg-red-500/20"
                    }`}
                  >
                    {selectedAnswer === question.correctAnswer ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-base">
                      {selectedAnswer === question.correctAnswer
                        ? "Correct!"
                        : `Incorrect. The right answer is ${String.fromCharCode(
                            65 + question.correctAnswer
                          )}`}
                    </p>
                    <p className="text-sm opacity-90 leading-relaxed">
                      {question.explanation.correct}
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-4 py-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5" />
                  <p className="text-sm text-blue-400 leading-relaxed">
                    {question.explanation.key_point}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
