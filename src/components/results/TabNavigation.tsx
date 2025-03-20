import { useState } from "react";

type Tab = "transcript" | "report";

interface TabNavigationProps {
  onTabChange: (tab: Tab) => void;
  activeTab: Tab;
}

export function TabNavigation({ onTabChange, activeTab }: TabNavigationProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          onClick={() => onTabChange("transcript")}
          className={`
            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
            ${
              activeTab === "transcript"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }
          `}
        >
          Conversation Transcript
        </button>
        <button
          onClick={() => onTabChange("report")}
          className={`
            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
            ${
              activeTab === "report"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }
          `}
        >
          Performance Report
        </button>
      </nav>
    </div>
  );
}
