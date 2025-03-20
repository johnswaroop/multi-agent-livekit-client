import { z } from "zod";

export const reportMetricsSchema = z.object({
  fluency: z.number().min(0).max(100),
  grammar: z.number().min(0).max(100),
  vocabulary: z.number().min(0).max(100),
  pronunciation: z.number().min(0).max(100),
  listening: z.number().min(0).max(100),
});

export const reportFeedbackSchema = z.object({
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  practiceTips: z.array(z.string()),
  speakingPatterns: z.array(z.string()),
  culturalNotes: z.array(z.string()),
});

export const reportSchema = z.object({
  score: z.number().min(0).max(100),
  metrics: reportMetricsSchema,
  feedback: reportFeedbackSchema,
  summary: z.string(),
  tone: z.enum(["encouraging", "constructive"]),
});

export type ReportSchema = z.infer<typeof reportSchema>;
