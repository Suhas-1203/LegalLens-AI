"use client";

import { useState } from "react";
import SummaryCard from "@/components/SummaryCard";
import RiskHighlights from "@/components/RiskHighlights";
import ClauseList from "@/components/ClauseList";
import LawyerChecklist from "@/components/LawyerChecklist";
import Disclaimer from "@/components/Disclaimer";
import { AnalysisResult } from "@/lib/gemini";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [text, setText] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (!text.trim() || text.trim().length < 50) {
      setError("Please paste at least 50 characters of legal text.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze document");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">LegalLens AI</h1>
            <p className="text-sm text-slate-500 mt-1">
              Understand legal documents in plain English
            </p>
          </div>
          <div className="text-xs text-slate-400">Powered by Gemini</div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <Disclaimer />

        {/* Input Section */}
        <section className="mt-6 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">
            Paste your legal document
          </h2>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste contract, terms of service, NDA, rental agreement, or any legal document text here..."
            className="w-full h-48 p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-y text-sm"
            aria-label="Paste your legal document text here"
            aria-describedby="char-count"
            id="legal-document-input"
          />

          <div className="mt-4 flex items-center gap-4">
            <button
              onClick={handleAnalyze}
              disabled={loading || text.trim().length < 50}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-medium rounded-lg transition flex items-center gap-2"
              aria-label="Analyze the legal document"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Document"
              )}
            </button>

            <span id="char-count" className="text-sm text-slate-500">
              {text.length} characters
            </span>
          </div>

          {error && (
            <div
              className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200"
              role="alert"
            >
              {error}
            </div>
          )}
        </section>

        {/* Results Section */}
        {result && (
          <div className="mt-8 space-y-6">
            <SummaryCard
              summary={result.summary}
              overallRiskLevel={result.overallRiskLevel}
            />
            <RiskHighlights risks={result.risks} />
            <ClauseList clauses={result.keyClauses} />
            <LawyerChecklist questions={result.questionsForLawyer} />
          </div>
        )}
      </div>
    </main>
  );
}