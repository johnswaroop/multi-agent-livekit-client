import { TranscriptMessage } from "../../lib/reportTypes";

interface TranscriptProps {
  messages: TranscriptMessage[];
}

export function Transcript({ messages }: TranscriptProps) {
  return (
    <div className="space-y-4">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.isSelf ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[80%] rounded-lg p-4 ${
              message.isSelf
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            <div className="text-sm font-medium mb-1">
              {message.isSelf ? "You" : message.name}
            </div>
            <div className="text-sm whitespace-pre-wrap">{message.message}</div>
            {message.timestamp && (
              <div className="text-xs mt-2 opacity-70">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
