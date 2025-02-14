export interface UserContext {
  age: number;
}

export interface Question {
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: {
    correct: string;
    key_point: string;
  };
  difficulty: number;
  topic: string;
  subtopic: string;
  questionType: string;
  ageGroup: string;
}

export interface ExploreResponse {
  content: string;
  relatedTopics: Array<{
    topic: string;
    type: string;
  }>;
  relatedQuestions: Array<{
    question: string;
    type: string;
    context: string;
  }>;
}

export interface PreFillFormProps {
  onSubmit: (context: UserContext) => void;
}
export interface Topic {
  topic: string;
  type: string;
  reason: string;
}

export interface Question {
  question: string;
  type: string;
  context: string;
}

export interface Message {
  type: "user" | "ai";
  content: string;
  timestamp: number;
  topics?: Topic[];
  questions?: Question[];
}

export interface StreamChunk {
  text?: string;
  topics?: Topic[];
  questions?: Question[];
}

export interface MarkdownComponentProps {
  children?: React.ReactNode;
  [key: string]: any;
}
