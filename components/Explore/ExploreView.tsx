import { api } from "@/services/api";
import { Message, UserContext } from "@/types";
import { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { LoadingAnimation } from "../loading-animation";
import { SearchBar } from "../searchbar";
import { MarkdownComponents } from "./MarkdownComponents";
import { RelatedQuestions } from "./RelatedQuestions";
import { RelatedTopics } from "./RelatedTopics";

interface ExploreViewProps {
  initialQuery?: string;
  onError: (message: string) => void;
  onRelatedQueryClick?: (query: string) => void;
  userContext: UserContext;
}

interface Conversation {
  id: string;
  messages: Message[];
  timestamp: number;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  initialQuery,
  onError,
  onRelatedQueryClick,
  userContext,
}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>("");
  const [showInitialSearch, setShowInitialSearch] = useState(!initialQuery);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    messagesContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 100);
  }, []);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) scrollToTop();
  }, [conversations.length, scrollToTop]);

  useEffect(() => {
    scrollToBottom();
  }, [conversations, scrollToBottom]);

  useEffect(() => {
    const handleReset = () => {
      setConversations([]);
      setShowInitialSearch(true);
    };

    window.addEventListener("resetExplore", handleReset);
    return () => window.removeEventListener("resetExplore", handleReset);
  }, []);

  const createNewConversation = useCallback(() => {
    const newId = Date.now().toString();
    setCurrentConversationId(newId);
    return newId;
  }, []);

  const handleSearch = useCallback(
    async (query: string, conversationId?: string) => {
      try {
        window.navigator.vibrate?.(50);
        scrollToTop();
        setIsLoading(true);

        const currentId = conversationId || createNewConversation();
        const currentTime = Date.now();
        const newMessage = { type: "user", content: query, timestamp: currentTime } as Message;
        const aiMessage = { type: "ai", content: "", timestamp: currentTime } as Message;

        setConversations((prev) => {
          const existing = prev.find((c) => c.id === currentId);
          if (existing) {
            return prev.map((c) =>
              c.id === currentId ? { ...c, messages: [...c.messages, newMessage, aiMessage] } : c
            );
          }
          return [
            ...prev,
            { id: currentId, messages: [newMessage, aiMessage], timestamp: currentTime },
          ];
        });

        setShowInitialSearch(false);

        await api.streamExplore(query, userContext, (chunk) => {
          setConversations((prev) =>
            prev.map((c) =>
              c.id === currentId
                ? {
                    ...c,
                    messages: c.messages.map((m, i) =>
                      i === c.messages.length - 1
                        ? {
                            ...m,
                            content: chunk.text,
                            topics: chunk.topics,
                            questions: chunk.questions,
                          }
                        : m
                    ),
                  }
                : c
            )
          );
        });
      } catch (error) {
        console.error("Search error:", error);
        onError(error instanceof Error ? error.message : "Failed to load content");
      } finally {
        setIsLoading(false);
      }
    },
    [scrollToTop, userContext, onError, createNewConversation]
  );

  const handleRelatedQueryClick = useCallback(
    (query: string) => {
      scrollToTop();
      onRelatedQueryClick?.(query);
      handleSearch(query, currentConversationId);
    },
    [handleSearch, onRelatedQueryClick, scrollToTop, currentConversationId]
  );

  useEffect(() => {
    if (initialQuery) handleSearch(initialQuery);
  }, [initialQuery, handleSearch]);

  return (
    <div className="w-full min-h-[calc(100vh-9rem)] flex flex-col" ref={containerRef}>
      {showInitialSearch ? (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            What do you want to explore?
          </h1>

          <div className="w-full max-w-xl mx-auto">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Enter what you want to explore..."
              centered={true}
              className="bg-gray-900/80"
            />

            <p className="text-sm text-gray-400 text-center mt-1">Press Enter to search</p>

            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
              <span className="text-sm text-gray-400">Try:</span>
              {/* Tailwind hack for dynamic color */}
              <span className="sr-only bg-purple-500/20 bg-blue-500/20 bg-green-500/20 bg-purple-500/30 bg-blue-500/30 bg-green-500/30 text-purple-300 text-blue-300 text-green-300" />
              {[
                { text: "Quantum Physics", icon: "⚛️", color: "purple" },
                { text: "Machine Learning", icon: "🤖", color: "blue" },
                { text: "World History", icon: "🌍", color: "green" },
              ].map((item) => (
                <button
                  key={item.text}
                  onClick={() => handleSearch(item.text)}
                  className={`px-3 py-1.5 rounded-lg bg-${item.color}-500/20 
                    hover:bg-${item.color}-500/30 border border-${item.color}-500/30 
                    transition-colors text-xs sm:text-sm text-${item.color}-300`}
                >
                  {item.icon} {item.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative flex flex-col w-full h-[calc(100vh-7rem)]">
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto scroll-smooth px-2 sm:px-4 mb-4"
          >
            {conversations.map((conversation) => (
              <div key={conversation.id} className="max-w-3xl mx-auto py-4 space-y-4 mb-6">
                {conversation.messages.map((message, index) => (
                  <div
                    key={`${conversation.id}-${index}`}
                    className={`
                      flex flex-col !mb-6
                      ${message.type === "user" ? "items-end" : "items-start"}
                    `}
                  >
                    <div
                      className={`
                        relative px-4 py-3 rounded-lg max-w-[92%]
                        ${
                          message.type === "user"
                            ? "bg-blue-500/20 border border-blue-500/30"
                            : "bg-gray-800/50 border border-gray-700/50"
                        }
                      `}
                    >
                      {message.type === "user" ? (
                        <div className="text-base sm:text-lg font-semibold text-gray-100 min-w-12">
                          {message.content}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {!message.content && isLoading ? (
                            <div className="flex items-center space-x-2">
                              <LoadingAnimation />
                              <span className="text-sm text-gray-400">Thinking...</span>
                            </div>
                          ) : (
                            <>
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeKatex]}
                                components={MarkdownComponents}
                                className="prose prose-invert max-w-none"
                              >
                                {message.content || ""}
                              </ReactMarkdown>

                              {message.topics && message.topics.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-700/50">
                                  <RelatedTopics
                                    topics={message.topics}
                                    onTopicClick={handleRelatedQueryClick}
                                  />
                                </div>
                              )}

                              {message.questions && message.questions.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-gray-700/50">
                                  <RelatedQuestions
                                    questions={message.questions}
                                    onQuestionClick={handleRelatedQueryClick}
                                  />
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      )}
                      <div className="absolute -bottom-5 text-xs text-gray-500 min-w-max whitespace-nowrap">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="sticky bottom-0 bg-gradient-to-t from-background via-background to-transparent pb-4 pt-6">
            <div className="w-full px-2 sm:px-4 max-w-3xl mx-auto">
              <SearchBar
                onSearch={(query) => handleSearch(query, currentConversationId)}
                placeholder="Ask a follow-up question..."
                centered={false}
                className="bg-gray-900/80 backdrop-blur-lg border border-gray-700/50 h-12 shadow-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

ExploreView.displayName = "ExploreView";
