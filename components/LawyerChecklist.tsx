interface Props {
  questions: string[];
}

export default function LawyerChecklist({ questions }: Props) {
  if (!questions || questions.length === 0) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-2">
        Questions to Ask Your Lawyer
      </h2>
      <p className="text-sm text-slate-500 mb-4">
        Use these questions when you consult a legal professional.
      </p>

      <ol className="space-y-3 list-decimal list-inside">
        {questions.map((q, index) => (
          <li key={index} className="text-slate-800 text-sm leading-relaxed">
            {q}
          </li>
        ))}
      </ol>
    </div>
  );
}