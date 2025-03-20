import { ReportGenerationStatus } from "@/lib/reportGeneration";

interface LoadingStateProps {
  status: ReportGenerationStatus;
}

export function LoadingState({ status }: LoadingStateProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${status.progress}%` }}
              />
            </div>
            <p className="text-gray-600 text-center">{status.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
