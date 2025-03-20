import { Report, TranscriptMessage } from "./reportTypes";

// Mock transcript messages
const mockTranscripts: Record<string, TranscriptMessage[]> = {
  short: [
    {
      message: "Hi there! Ready to practice your English today?",
      name: "Interviewer",
      isSelf: false,
      timestamp: Date.now() - 3600000,
    },
    {
      message: "Yes, I'm ready! I've been practicing a lot lately.",
      name: "You",
      isSelf: true,
      timestamp: Date.now() - 3500000,
    },
    {
      message: "That's great! Could you tell me about your favorite hobby?",
      name: "Interviewer",
      isSelf: false,
      timestamp: Date.now() - 3400000,
    },
    {
      message:
        "I love playing basketball. It's a great way to stay active and make friends.",
      name: "You",
      isSelf: true,
      timestamp: Date.now() - 3300000,
    },
  ],
  long: [
    ...Array(10)
      .fill(null)
      .map((_, i) => ({
        message: `This is a longer conversation message ${
          i + 1
        }. It contains more detailed content to test how the UI handles longer text and multiple messages.`,
        name: i % 2 === 0 ? "Interviewer" : "You",
        isSelf: i % 2 !== 0,
        timestamp: Date.now() - (3600000 - i * 300000),
      })),
  ],
  mixedPerformance: [
    {
      message: "Tell me about your experience with English learning.",
      name: "Interviewer",
      isSelf: false,
      timestamp: Date.now() - 3600000,
    },
    {
      message:
        "I have been learning English for 3 years. I practice speaking with friends and watch movies.",
      name: "You",
      isSelf: true,
      timestamp: Date.now() - 3500000,
    },
    {
      message: "That's interesting! What challenges do you face?",
      name: "Interviewer",
      isSelf: false,
      timestamp: Date.now() - 3400000,
    },
    {
      message:
        "Sometimes I make grammar mistakes and need to think about words.",
      name: "You",
      isSelf: true,
      timestamp: Date.now() - 3300000,
    },
  ],
};

// Mock reports with different performance levels
const mockReports: Record<string, Report> = {
  highPerformance: {
    score: 85,
    metrics: {
      fluency: 90,
      grammar: 85,
      vocabulary: 80,
      pronunciation: 85,
      listening: 90,
    },
    feedback: {
      strengths: [
        "Excellent fluency and natural speaking pace",
        "Strong vocabulary usage with appropriate word choices",
        "Clear pronunciation and good intonation",
        "Active listening and relevant responses",
      ],
      improvements: [
        "Consider using more complex sentence structures",
        "Work on reducing filler words",
      ],
      practiceTips: [
        "Try reading aloud from English newspapers",
        "Practice with native speakers on language exchange apps",
        "Record yourself speaking and analyze your pronunciation",
      ],
      speakingPatterns: [
        "Tends to use simple sentences effectively",
        "Good use of transition words",
        "Natural pauses and rhythm",
      ],
      culturalNotes: [
        "Shows good understanding of cultural context",
        "Appropriate use of formal/informal language",
      ],
    },
    summary:
      "Overall, you demonstrated strong English speaking skills with excellent fluency and clear communication. Your responses were relevant and well-structured, showing good understanding of the conversation context.",
    tone: "encouraging",
    timestamp: new Date().toISOString(),
    duration: 15,
  },
  lowPerformance: {
    score: 45,
    metrics: {
      fluency: 40,
      grammar: 35,
      vocabulary: 50,
      pronunciation: 45,
      listening: 55,
    },
    feedback: {
      strengths: [
        "Shows determination to communicate",
        "Basic vocabulary is understood",
        "Willing to take risks in speaking",
      ],
      improvements: [
        "Focus on basic grammar structures",
        "Practice common vocabulary",
        "Work on sentence formation",
      ],
      practiceTips: [
        "Start with simple daily conversations",
        "Use language learning apps for basic practice",
        "Watch children's shows in English",
      ],
      speakingPatterns: [
        "Frequent pauses for word search",
        "Basic sentence structures",
        "Limited vocabulary range",
      ],
      culturalNotes: [
        "Basic understanding of cultural differences",
        "Learning appropriate greetings",
      ],
    },
    summary:
      "While you're at the beginning of your English learning journey, you show good determination and willingness to communicate. Focus on building basic vocabulary and grammar skills through regular practice.",
    tone: "constructive",
    timestamp: new Date().toISOString(),
    duration: 10,
  },
  mixedPerformance: {
    score: 65,
    metrics: {
      fluency: 60,
      grammar: 55,
      vocabulary: 70,
      pronunciation: 65,
      listening: 75,
    },
    feedback: {
      strengths: [
        "Good vocabulary range",
        "Clear pronunciation",
        "Active listening skills",
      ],
      improvements: [
        "Work on grammar accuracy",
        "Practice speaking more fluently",
        "Reduce hesitation words",
      ],
      practiceTips: [
        "Practice with grammar exercises",
        "Record yourself speaking",
        "Join conversation groups",
      ],
      speakingPatterns: [
        "Occasional grammar mistakes",
        "Good use of common phrases",
        "Some hesitation in responses",
      ],
      culturalNotes: [
        "Understanding of basic cultural norms",
        "Appropriate use of formal language",
      ],
    },
    summary:
      "You have a solid foundation in English with good vocabulary and pronunciation. Focus on improving grammar accuracy and speaking fluency through regular practice and conversation.",
    tone: "encouraging",
    timestamp: new Date().toISOString(),
    duration: 12,
  },
};

export const mockData = {
  transcripts: mockTranscripts,
  reports: mockReports,
};
