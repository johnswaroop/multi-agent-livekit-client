import { useEffect, useState } from "react";
import { Report, TranscriptMessage } from "@/lib/reportTypes";
import { TabNavigation } from "@/components/results/TabNavigation";
import { ReportSummary } from "@/components/results/ReportSummary";
import { FeedbackSections } from "@/components/results/FeedbackSections";
import { Transcript } from "@/components/results/Transcript";
import { LoadingState } from "@/components/results/LoadingState";
import { ErrorState } from "@/components/results/ErrorState";
import { ResultsLayout } from "@/components/results/ResultsLayout";
import { reportStorage } from "@/lib/reportStorage";
import { generateReport, ReportGenerationStatus } from "@/lib/reportGeneration";

const TRANSCRIPT_STORAGE_KEY = "transcripts";

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState<"transcript" | "report">(
    "transcript"
  );
  const [report, setReport] = useState<Report | null>(null);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] =
    useState<ReportGenerationStatus>({
      status: "idle",
      progress: 0,
      message: "",
    });

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load transcript from localStorage
      const savedTranscript = localStorage.getItem(TRANSCRIPT_STORAGE_KEY);
      if (!savedTranscript) {
        throw new Error("No transcript found");
      }
      setTranscript(JSON.parse(savedTranscript));

      // Check for existing report
      const existingReport = reportStorage.getLatestReport();
      if (existingReport) {
        setReport(existingReport);
        return;
      }

      // Generate new report
      const newReport = await generateReport(
        {
          transcript: JSON.parse(savedTranscript),
          timestamp: new Date().toISOString(),
          duration: 0, // TODO: Calculate actual duration
        },
        setGenerationStatus
      );

      setReport(newReport);
      reportStorage.saveReport(newReport);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load results");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return <LoadingState status={generationStatus} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadData} />;
  }

  return (
    <ResultsLayout>
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === "transcript" ? (
        <Transcript messages={transcript} />
      ) : (
        report && (
          <>
            <ReportSummary report={report} />
            <FeedbackSections report={report} />
          </>
        )
      )}
    </ResultsLayout>
  );
}
