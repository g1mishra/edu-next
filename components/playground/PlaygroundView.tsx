"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Question, UserContext } from "@/types";
import { Loading } from "../loading";
import { Stats } from "./Stats";
import { SearchSection } from "./SearchSection";
import { QuestionCard } from "./QuestionCard";
import { api } from "@/services/api";

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
}

interface QuestionStats {
  questions: number;
  accuracy: number;
  streak: number;
  bestStreak: number;
  avgTime: number;
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
    isSessionComplete: false,
  });

  const [stats, setStats] = useState<QuestionStats>({
    questions: 0,
    accuracy: 0,
    streak: 0,
    bestStreak: 0,
    avgTime: 0,
  });

  const COUNTDOWN_DURATION = 5;

  const isPausedRef = useRef(isPaused);
  const lastTickRef = useRef(Date.now());

  // Update ref when isPaused changes
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
        lastTickRef.current = now - (elapsed % 1000); // Maintain sub-second precision
      }

      animationFrameRef.current = requestAnimationFrame(updateTimer);
    };

    lastTickRef.current = Date.now();
    animationFrameRef.current = requestAnimationFrame(updateTimer);
  }, []);

  const loadQuestion = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery) return null;

      try {
        return await api.getQuestion(searchQuery, 1, userContext);
      } catch (error) {
        console.error("Error loading question:", error);
        onError(
          error instanceof Error ? error.message : "An error occurred while loading the question."
        );
        return null;
      }
    },
    [userContext, onError]
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
        if (isPaused) return prev;
        return +(prev - 0.1).toFixed(1);
      });
    }, 100);
  }, [isPaused]);

  const handleAnswer = async (index: number) => {
    if (selectedAnswer !== null || !currentQuestion) return;

    setSelectedAnswer(index);
    setShowExplanation(true);
    updateStats(index === currentQuestion.correctAnswer);

    if (!isPaused && !sessionStats.isSessionComplete) {
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
          });
          setSessionStats({
            totalQuestions: 0,
            sessionLimit: 25,
            isSessionComplete: false,
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

  useEffect(() => {
    if (nextQuestionCountdown === null && showExplanation && !isPaused) {
      const loadNextQuestion = async () => {
        if (sessionStats.totalQuestions >= sessionStats.sessionLimit) {
          setSessionStats((prev) => ({ ...prev, isSessionComplete: true }));
          onSuccess("Congratulations! You've completed your practice session! 🎉");
          return;
        }

        setIsLoadingNext(true);
        try {
          const nextQuestion = await loadQuestion(query);
          if (nextQuestion) {
            setCurrentQuestion(nextQuestion);
            setSelectedAnswer(null);
            setShowExplanation(false);
            setSessionStats((prev) => ({
              ...prev,
              totalQuestions: prev.totalQuestions + 1,
            }));
          }
        } finally {
          setIsLoadingNext(false);
        }
      };

      loadNextQuestion();
    }
  }, [
    nextQuestionCountdown,
    showExplanation,
    isPaused,
    query,
    sessionStats.totalQuestions,
    sessionStats.sessionLimit,
    loadQuestion,
    onSuccess,
  ]);

  useEffect(() => {
    if (initialQuery) {
      handleSearch(initialQuery);
    }
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
      {!currentQuestion || sessionStats.isSessionComplete ? (
        <SearchSection onSearch={handleSearch} />
      ) : (
        <div className="w-full max-w-3xl mx-auto px-4">
          <Stats
            accuracy={stats.accuracy}
            questions={stats.questions}
            streak={stats.streak}
            currentTime={currentQuestionTime}
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
