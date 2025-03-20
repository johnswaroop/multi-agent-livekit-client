import { Report } from "../../lib/reportTypes";

interface ReportSummaryProps {
  report: Report;
}

export function ReportSummary({ report }: ReportSummaryProps) {
  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Performance Summary
          </h2>
          <p className="text-gray-600 mt-1">
            Practice Session • {formatDate(report.timestamp)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold text-blue-600">{report.score}</div>
          <div className="text-sm text-gray-600">Overall Score</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(report.metrics).map(([key, value]) => (
          <div key={key} className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600 capitalize">
                {key}
              </span>
              <span className="text-lg font-semibold text-blue-600">
                {value}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Summary</h3>
        <p className="text-gray-700">{report.summary}</p>
      </div>
    </div>
  );
}
