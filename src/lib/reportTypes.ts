import { z } from "zod";
import { reportSchema } from "./reportSchema";

export type ReportSchema = typeof reportSchema;

export type Report = z.infer<typeof reportSchema> & {
  timestamp: string;
  duration: number; // in minutes
};

export interface TranscriptMessage {
  message: string;
  name: string;
  isSelf: boolean;
  timestamp: number;
}

export interface ReportGenerationOptions {
  transcript: TranscriptMessage[];
  duration: number;
  timestamp: string;
}
