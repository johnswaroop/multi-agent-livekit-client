import { NextApiRequest, NextApiResponse } from "next";
import { Report, ReportGenerationOptions } from "@/lib/reportTypes";
import { reportSchema } from "@/lib/reportSchema";
import { SYSTEM_PROMPT, createAnalysisPrompt } from "@/lib/promptTemplates";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not defined in environment variables");
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Report | { error: string }>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const options: ReportGenerationOptions = req.body;

    const transcript = options.transcript
      .map((msg) => `${msg.isSelf ? "You" : "Interviewer"}: ${msg.message}`)
      .join("\n");

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: createAnalysisPrompt(transcript, options.duration),
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" },
        functions: [
          {
            name: "generate_report",
            description: "Generate a report based on the conversation analysis",
            parameters: {
              type: "object",
              properties: {
                score: {
                  type: "number",
                  description: "Overall performance score (0-100)",
                },
                metrics: {
                  type: "object",
                  properties: {
                    fluency: {
                      type: "number",
                      description: "Fluency score (0-100)",
                    },
                    grammar: {
                      type: "number",
                      description: "Grammar score (0-100)",
                    },
                    vocabulary: {
                      type: "number",
                      description: "Vocabulary score (0-100)",
                    },
                    pronunciation: {
                      type: "number",
                      description: "Pronunciation score (0-100)",
                    },
                    listening: {
                      type: "number",
                      description: "Listening comprehension score (0-100)",
                    },
                  },
                  required: [
                    "fluency",
                    "grammar",
                    "vocabulary",
                    "pronunciation",
                    "listening",
                  ],
                },
                feedback: {
                  type: "object",
                  properties: {
                    strengths: {
                      type: "array",
                      items: { type: "string" },
                      description: "List of strengths identified",
                    },
                    improvements: {
                      type: "array",
                      items: { type: "string" },
                      description: "List of areas for improvement",
                    },
                    practiceTips: {
                      type: "array",
                      items: { type: "string" },
                      description: "List of practice tips",
                    },
                    speakingPatterns: {
                      type: "array",
                      items: { type: "string" },
                      description: "List of speaking patterns observed",
                    },
                    culturalNotes: {
                      type: "array",
                      items: { type: "string" },
                      description: "List of cultural notes",
                    },
                  },
                  required: [
                    "strengths",
                    "improvements",
                    "practiceTips",
                    "speakingPatterns",
                    "culturalNotes",
                  ],
                },
                summary: {
                  type: "string",
                  description: "Overall performance summary",
                },
                tone: {
                  type: "string",
                  enum: ["encouraging", "constructive"],
                  description: "The tone of the feedback",
                },
              },
              required: ["score", "metrics", "feedback", "summary", "tone"],
            },
          },
        ],
        function_call: { name: "generate_report" },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenAI API error details:", errorData);
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.function_call.arguments;

    try {
      const parsedContent = JSON.parse(content);
      const validatedReport = reportSchema.parse(parsedContent);

      const report: Report = {
        ...validatedReport,
        timestamp: options.timestamp,
        duration: options.duration,
      };

      return res.status(200).json(report);
    } catch (validationError) {
      console.error("Error validating report:", validationError);
      return res
        .status(500)
        .json({ error: "Invalid report format received from OpenAI" });
    }
  } catch (error) {
    console.error("Error generating report:", error);
    return res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
  }
}
