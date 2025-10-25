// Simulates a RAG-powered debate with streaming-like delays

interface DebateMessage {
  agent: "Engineer" | "Visionary" | "Ethicist";
  message: string;
  round: number;
}

const personas = {
  Engineer: {
    style: "technical, practical, focused on feasibility and implementation details",
    templates: [
      "From a technical standpoint, {topic} raises several implementation concerns. {context} We need to consider scalability, security, and maintainability. The infrastructure requirements alone would demand significant resources.",
      "Let's break down {topic} systematically. {context} The engineering challenges include data integrity, system reliability, and performance optimization. These aren't trivial problems.",
    ],
  },
  Visionary: {
    style: "innovative, future-oriented, creative and expansive thinking",
    templates: [
      "I see {topic} as an opportunity to reimagine our entire approach. {context} What if we thought beyond current constraints? The potential for transformation is immense if we dare to innovate.",
      "Looking at {topic} through a visionary lens, {context} we're not just solving today's problems—we're shaping tomorrow's possibilities. This could be revolutionary.",
    ],
  },
  Ethicist: {
    style: "moral, thoughtful, concerned with implications and fairness",
    templates: [
      "We must carefully consider the ethical dimensions of {topic}. {context} Questions of fairness, accountability, and societal impact cannot be overlooked. Who benefits and who might be harmed?",
      "From an ethical perspective, {topic} demands scrutiny. {context} We have a responsibility to examine the moral implications, potential biases, and long-term consequences for society.",
    ],
  },
};

const getKnowledgeContext = (): string => {
  const stored = localStorage.getItem("knowledgeBase");
  if (!stored) return "Drawing on general principles,";
  
  const docs = JSON.parse(stored);
  if (docs.length === 0) return "Based on fundamental knowledge,";
  
  // Simulate RAG retrieval - pick a random relevant snippet
  const randomDoc = docs[Math.floor(Math.random() * docs.length)];
  const snippet = randomDoc.content.slice(0, 150);
  return `According to '${randomDoc.title}': "${snippet}..."`;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const simulateDebate = async (
  topic: string,
  rounds: number,
  onMessage: (message: DebateMessage) => void
): Promise<{ summary: string }> => {
  const agents: Array<"Engineer" | "Visionary" | "Ethicist"> = ["Engineer", "Visionary", "Ethicist"];
  
  for (let round = 1; round <= rounds; round++) {
    for (const agent of agents) {
      await delay(1000 + Math.random() * 1000); // Simulate thinking time
      
      const persona = personas[agent];
      const template = persona.templates[Math.floor(Math.random() * persona.templates.length)];
      const context = getKnowledgeContext();
      
      const message = template
        .replace("{topic}", topic)
        .replace("{context}", context);
      
      onMessage({ agent, message, round });
    }
  }
  
  // Generate summary
  await delay(1500);
  const summary = `After ${rounds} rounds of debate on "${topic}", the agents presented diverse perspectives:

The Engineer emphasized practical feasibility and technical constraints, highlighting implementation challenges and resource requirements.

The Visionary pushed for innovative approaches and transformative thinking, encouraging the group to consider revolutionary possibilities.

The Ethicist ensured moral implications and societal impacts were thoroughly examined, advocating for fairness and accountability.

This multi-perspective analysis demonstrates the value of diverse viewpoints in addressing complex questions. Each agent's unique lens contributed to a more comprehensive understanding of the topic.`;

  return { summary };
};
