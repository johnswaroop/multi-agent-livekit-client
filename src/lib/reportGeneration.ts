import { Report, ReportGenerationOptions } from "./reportTypes";

export type ReportGenerationStatus = {
  status: "idle" | "loading" | "success" | "error";
  progress: number;
  message: string;
  error?: string;
};

export const generateReport = async (
  options: ReportGenerationOptions,
  onStatusUpdate?: (status: ReportGenerationStatus) => void
): Promise<Report> => {
  try {
    // Update status: Starting
    onStatusUpdate?.({
      status: "loading",
      progress: 0,
      message: "Starting report generation...",
    });

    // Update status: Analyzing conversation
    onStatusUpdate?.({
      status: "loading",
      progress: 20,
      message: "Analyzing conversation...",
    });

    const response = await fetch("/api/report", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    });

    // Update status: Processing response
    onStatusUpdate?.({
      status: "loading",
      progress: 60,
      message: "Processing analysis...",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to generate report");
    }

    const report = await response.json();

    // Update status: Success
    onStatusUpdate?.({
      status: "success",
      progress: 100,
      message: "Report generated successfully!",
    });

    return report;
  } catch (error) {
    // Update status: Error
    onStatusUpdate?.({
      status: "error",
      progress: 0,
      message: "Failed to generate report",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    });
    throw error;
  }
};
