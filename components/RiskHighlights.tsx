interface Risk {
  risk: string;
  severity: "High" | "Medium" | "Low";
  explanation: string;
}

interface Props {
  risks: Risk[];
}

export default function RiskHighlights({ risks }: Props) {
  if (!risks || risks.length === 0) return null;

  const severityColor = {
    High: "border-l-red-500 bg-red-50",
    Medium: "border-l-yellow-500 bg-yellow-50",
    Low: "border-l-green-500 bg-green-50",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Key Risks & Red Flags
      </h2>

      <div className="space-y-4">
        {risks.map((item, index) => (
          <div
            key={index}
            className={`border-l-4 p-4 rounded-r-lg ${severityColor[item.severity]}`}
          >
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-slate-900">{item.risk}</h3>
              <span className="text-xs font-semibold uppercase tracking-wide">
                {item.severity}
              </span>
            </div>
            <p className="text-sm text-slate-700">{item.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}