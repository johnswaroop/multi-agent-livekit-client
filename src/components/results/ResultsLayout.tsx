interface ResultsLayoutProps {
  children: React.ReactNode;
}

export function ResultsLayout({ children }: ResultsLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">{children}</div>
    </div>
  );
}
