import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface AnalysisResult {
  summary: string;
  keyClauses: {
    title: string;
    explanation: string;
    importance: "High" | "Medium" | "Low";
  }[];
  risks: {
    risk: string;
    severity: "High" | "Medium" | "Low";
    explanation: string;
  }[];
  obligations: {
    party: string;
    obligation: string;
  }[];
  questionsForLawyer: string[];
  overallRiskLevel: "Low" | "Medium" | "High";
}

export async function analyzeLegalDocument(text: string): Promise<AnalysisResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

  const prompt = `
You are LegalLens AI — a careful, neutral, and responsible legal document assistant.
You NEVER provide legal advice. You only help users understand documents better and prepare better questions for a real lawyer.

Analyze the legal document below and return a valid JSON object with this exact structure:

{
  "summary": "Clear plain-English summary of the document (maximum 180 words)",
  "keyClauses": [
    {
      "title": "Name of the clause",
      "explanation": "Simple explanation in plain English",
      "importance": "High" | "Medium" | "Low"
    }
  ],
  "risks": [
    {
      "risk": "Short description of the risk",
      "severity": "High" | "Medium" | "Low",
      "explanation": "Why this is a risk for the user"
    }
  ],
  "obligations": [
    {
      "party": "Who has this obligation (e.g. Tenant, Company, Employee)",
      "obligation": "What they are required to do"
    }
  ],
  "questionsForLawyer": [
    "Specific and useful question the user should ask a lawyer"
  ],
  "overallRiskLevel": "Low" | "Medium" | "High"
}

Important rules:
- Be accurate and neutral
- Highlight real risks and unusual clauses
- Keep language simple and clear
- Always return only pure JSON (no markdown, no extra text)

Document content:
"""
${text.slice(0, 28000)}
"""
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let raw = response.text().trim();

    // Remove possible markdown formatting
    raw = raw.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsed = JSON.parse(raw) as AnalysisResult;
    return parsed;
    } catch (error: any) {
    console.error("===== FULL GEMINI ERROR =====");
    console.error(error);
    console.error("Message:", error?.message);
    console.error("=============================");
    throw new Error(error?.message || "Failed to analyze the document. Please try again.");
  }
}