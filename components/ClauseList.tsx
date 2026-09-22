interface Clause {
  title: string;
  explanation: string;
  importance: "High" | "Medium" | "Low";
}

interface Props {
  clauses: Clause[];
}

export default function ClauseList({ clauses }: Props) {
  if (!clauses || clauses.length === 0) return null;

  const importanceBadge = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-slate-100 text-slate-700",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Important Clauses
      </h2>

      <div className="space-y-4">
        {clauses.map((clause, index) => (
          <div key={index} className="border border-slate-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-slate-900">{clause.title}</h3>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${importanceBadge[clause.importance]}`}
              >
                {clause.importance}
              </span>
            </div>
            <p className="text-sm text-slate-700">{clause.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}