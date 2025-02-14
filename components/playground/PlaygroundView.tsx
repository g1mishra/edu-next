"use client";
import { api } from "@/services/api";
import { Question, UserContext } from "@/types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Loading } from "../loading";
import { QuestionCard } from "./QuestionCard";
import { SearchSection } from "./SearchSection";
import { Stats } from "./Stats";
import { SummaryCard } from "./SummaryCard";

interface PlaygroundViewProps {
  initialQuery?: string;
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
  userContext: UserContext;
}

interface SessionStats {
  totalQuestions: number;
  sessionLimit: number;
  isSessionComplete: boolean;
  hearts: number;
}

interface QuestionStats {
  questions: number;
  accuracy: number;
  streak: number;
  bestStreak: number;
  avgTime: number;
  currentDifficulty: number;
}

export const PlaygroundView: React.FC<PlaygroundViewProps> = ({
  initialQuery,
  onError,
  onSuccess,
  userContext,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);

  const [query, setQuery] = useState(initialQuery || "");
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const [isPaused, setIsPaused] = useState(false);
  const [currentQuestionTime, setCurrentQuestionTime] = useState(0);
  const animationFrameRef = useRef<number | null>(null);
  const [nextQuestionCountdown, setNextQuestionCountdown] = useState<number | null>(null);

  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalQuestions: 0,
    sessionLimit: 25,
    isSessionComplete: true,
    hearts: 0,
  });

  const [stats, setStats] = useState<QuestionStats>({
    questions: 0,
    accuracy: 0,
    streak: 0,
    bestStreak: 0,
    avgTime: 0,
    currentDifficulty: 1,
  });

  const COUNTDOWN_DURATION = 5;

  const isPausedRef = useRef(isPaused);
  const lastTickRef = useRef(Date.now());

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const startQuestionTimer = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = now - lastTickRef.current;

      if (!isPausedRef.current && elapsed >= 1000) {
        setCurrentQuestionTime((prev) => prev + 1);
        lastTickRef.current = now - (elapsed % 1000);
      }

      animationFrameRef.current = requestAnimationFrame(updateTimer);
    };

    lastTickRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, []);

  const loadQuestion = useCallback(
    async (
      searchQuery: string,
      previousPerformance?: { timeSpent: number; wasCorrect: boolean }
    ) => {
      if (!searchQuery) return null;

      try {
        return await api.getQuestion(
          searchQuery,
          stats.currentDifficulty,
          userContext,
          previousPerformance
        );
      } catch (error) {
        console.error("Error loading question:", error);
        onError(
          error instanceof Error ? error.message : "An error occurred while loading the question."
        );
        return null;
      }
    },
    [userContext, onError, stats.currentDifficulty]
  );

  const updateStats = useCallback(
    (isCorrect: boolean) => {
      setStats((prev) => {
        const newQuestions = prev.questions + 1;
        const newAccuracy = (prev.accuracy * prev.questions + (isCorrect ? 100 : 0)) / newQuestions;
        const newStreak = isCorrect ? prev.streak + 1 : 0;

        return {
          questions: newQuestions,
          accuracy: newAccuracy,
          streak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
          avgTime: (prev.avgTime * prev.questions + currentQuestionTime) / newQuestions,
          currentDifficulty: prev.currentDifficulty,
        };
      });
    },
    [currentQuestionTime]
  );

  const startCountdown = useCallback(() => {
    setNextQuestionCountdown(COUNTDOWN_DURATION);
    const interval = setInterval(() => {
      setNextQuestionCountdown((prev) => {
        if (prev === null || prev <= 0.1) {
          clearInterval(interval);
          return null;
        }
        return +(prev - 0.1).toFixed(1);
      });
    }, 100);
  }, []);

  const handleAnswer = async (index: number) => {
    if (selectedAnswer !== null || !currentQuestion) return;

    const isCorrect = index === currentQuestion.correctAnswer;
    setSelectedAnswer(index);
    setShowExplanation(true);
    setIsPaused(true);
    updateStats(isCorrect);

    if (!isCorrect) {
      setSessionStats((prev) => ({
        ...prev,
        hearts: prev.hearts - 1,
        isSessionComplete: prev.hearts <= 1,
      }));

      if (sessionStats.hearts <= 1) {
        onError("You've run out of hearts! Start a new session to continue practicing.");
        return;
      }
    }

    if (!sessionStats.isSessionComplete) {
      startCountdown();
    }
  };

  const handleSearch = async (newQuery: string) => {
    try {
      setIsLoading(true);
      setQuery(newQuery);

      const firstQuestion = await loadQuestion(newQuery);
      if (firstQuestion) {
        setCurrentQuestion(firstQuestion);
        setSelectedAnswer(null);
        setCurrentQuestionTime(0);
        startQuestionTimer();

        if (newQuery !== query) {
          setStats({
            questions: 0,
            accuracy: 0,
            streak: 0,
            bestStreak: 0,
            avgTime: 0,
            currentDifficulty: firstQuestion.difficulty,
          });
          setSessionStats({
            totalQuestions: 0,
            sessionLimit: 25,
            isSessionComplete: false,
            hearts: 3,
          });
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  useEffect(() => {
    if (!isPaused) {
      startQuestionTimer();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused, startQuestionTimer]);

  const loadNextQuestion = async () => {
    if (sessionStats.totalQuestions >= sessionStats.sessionLimit) {
      setSessionStats((prev) => ({ ...prev, isSessionComplete: true }));
      onSuccess("Congratulations! You've completed your practice session! 🎉");
      return;
    }

    setIsLoadingNext(true);
    try {
      const timeSpent = currentQuestionTime;
      const wasCorrect = currentQuestion && selectedAnswer === currentQuestion.correctAnswer;

      const nextQuestion = await loadQuestion(query, {
        timeSpent,
        wasCorrect: !!wasCorrect,
      });

      if (nextQuestion) {
        setCurrentQuestion(nextQuestion);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setIsPaused(false);
        setSessionStats((prev) => ({
          ...prev,
          totalQuestions: prev.totalQuestions + 1,
        }));

        setStats((prev) => ({
          ...prev,
          currentDifficulty: nextQuestion.difficulty,
        }));
      }
    } finally {
      setIsLoadingNext(false);
    }
  };

  useEffect(() => {
    if (nextQuestionCountdown === null && showExplanation && isPaused) {
      loadNextQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextQuestionCountdown, showExplanation, isPaused]);

  useEffect(() => {
    if (initialQuery) {
      console.log("initialQuery", initialQuery);
      handleSearch(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-[calc(100vh-9rem)] flex flex-col">
      {!currentQuestion ? (
        <SearchSection onSearch={handleSearch} />
      ) : sessionStats.isSessionComplete ? (
        <div className="w-full max-w-3xl mx-auto px-4 py-8 flex-1 flex items-center">
          <SummaryCard
            stats={stats}
            isOutOfHearts={sessionStats.hearts <= 0}
            onStartNew={() => setCurrentQuestion(null)}
          />
        </div>
      ) : (
        <div className="w-full max-w-3xl mx-auto px-4">
          <Stats
            accuracy={stats.accuracy}
            questions={stats.questions}
            streak={stats.streak}
            currentTime={currentQuestionTime}
            hearts={sessionStats.hearts}
          />
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={selectedAnswer}
            showExplanation={showExplanation}
            isPaused={isPaused}
            nextQuestionCountdown={nextQuestionCountdown}
            COUNTDOWN_DURATION={COUNTDOWN_DURATION}
            onAnswer={handleAnswer}
            onTogglePause={togglePause}
            isLoadingNext={isLoadingNext}
          />
        </div>
      )}
    </div>
  );
};
