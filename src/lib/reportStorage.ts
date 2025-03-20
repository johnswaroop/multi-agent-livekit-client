import { Report } from "./reportTypes";

const STORAGE_KEY = "interview_reports";

export const reportStorage = {
  saveReport: (report: Report): void => {
    try {
      const reports = reportStorage.getReports();
      reports.push(report);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
    } catch (error) {
      console.error("Error saving report:", error);
    }
  },

  getReports: (): Report[] => {
    try {
      const reports = localStorage.getItem(STORAGE_KEY);
      return reports ? JSON.parse(reports) : [];
    } catch (error) {
      console.error("Error getting reports:", error);
      return [];
    }
  },

  getLatestReport: (): Report | null => {
    try {
      const reports = reportStorage.getReports();
      return reports[reports.length - 1] || null;
    } catch (error) {
      console.error("Error getting latest report:", error);
      return null;
    }
  },

  clearReports: (): void => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing reports:", error);
    }
  },
};
