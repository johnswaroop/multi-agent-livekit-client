import { Report } from "../../lib/reportTypes";

interface FeedbackSectionsProps {
  report: Report;
}

export function FeedbackSections({ report }: FeedbackSectionsProps) {
  const sections = [
    {
      title: "What You Did Well",
      items: report.feedback.strengths,
      icon: "🌟",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Keep Practicing",
      items: report.feedback.improvements,
      icon: "🎯",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Helpful Tips",
      items: report.feedback.practiceTips,
      icon: "💡",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Speaking Patterns",
      items: report.feedback.speakingPatterns,
      icon: "📊",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Cultural Notes",
      items: report.feedback.culturalNotes,
      icon: "🌍",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <div key={section.title} className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">{section.icon}</span>
            <h3 className={`text-xl font-semibold ${section.color}`}>
              {section.title}
            </h3>
          </div>
          <ul className="space-y-3">
            {section.items.map((item, index) => (
              <li
                key={index}
                className={`flex items-start p-3 rounded-lg ${section.bgColor}`}
              >
                <span className="text-sm text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
