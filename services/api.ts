// const transformQuestion = (rawQuestion: Question): Question => ({
//   text: rawQuestion.text,
//   options: rawQuestion.options,
//   correctAnswer: rawQuestion.correctAnswer,
//   explanation: rawQuestion.explanation,
//   difficulty: rawQuestion.difficulty,
//   ageGroup: rawQuestion.ageGroup,
//   topic: rawQuestion.topic,
//   subtopic: rawQuestion.subtopic || "",
//   questionType: rawQuestion.questionType || "conceptual",
//   question: "",
//   type: "",
//   context: "",
// });

export const api = {
  async getQuestion(topic: string, level: number, userContext: any) {
    const res = await fetch("/api/playground/generate", {
      method: "POST",
      body: JSON.stringify({ topic, level, userContext }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to generate question");
    return res.json();
  },

  async explore(query: string, userContext: any) {
    const res = await fetch("/api/explore", {
      method: "POST",
      body: JSON.stringify({ query, userContext }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to explore topic");
    return res.json();
  },

  async streamExplore(query: string, userContext: any, onChunk: (chunk: any) => void) {
    const res = await fetch("/api/explore/stream", {
      method: "POST",
      body: JSON.stringify({ query, userContext }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error("Failed to stream exploration");

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();

    while (reader) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      chunk
        .split("\n")
        .filter(Boolean)
        .forEach((line) => {
          try {
            const parsedChunk = JSON.parse(line);
            onChunk(parsedChunk);
          } catch (e) {
            console.error("Failed to parse chunk:", e);
          }
        });
    }
  },
};
