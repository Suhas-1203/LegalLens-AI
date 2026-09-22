interface Props {
  summary: string;
  overallRiskLevel: "Low" | "Medium" | "High";
}

export default function SummaryCard({ summary, overallRiskLevel }: Props) {
  const riskColor = {
    Low: "bg-green-100 text-green-800 border-green-200",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    High: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800">Document Summary</h2>
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full border ${riskColor[overallRiskLevel]}`}
        >
          Overall Risk: {overallRiskLevel}
        </span>
      </div>
      <p className="text-slate-700 leading-relaxed whitespace-pre-line">{summary}</p>
    </div>
  );
}