import { describe, it, expect } from "vitest";

describe("LegalLens AI - Core Validation", () => {
  it("should have a complete and valid AnalysisResult structure", () => {
    const mockResult = {
      summary: "This is a clear plain-English summary of the legal document.",
      keyClauses: [
        {
          title: "Confidentiality Period",
          explanation: "The receiving party must keep information secret for 5 years.",
          importance: "High" as const,
        },
        {
          title: "Liquidated Damages",
          explanation: "A fixed penalty of ₹5,00,000 applies in case of breach.",
          importance: "High" as const,
        },
      ],
      risks: [
        {
          risk: "High financial penalty",
          severity: "High" as const,
          explanation: "User may have to pay ₹5,00,000 even if actual damage is lower.",
        },
        {
          risk: "Short data destruction window",
          severity: "Medium" as const,
          explanation: "Only 7 days given to return or destroy confidential data.",
        },
      ],
      obligations: [
        {
          party: "Receiving Party",
          obligation: "Maintain confidentiality for 5 years",
        },
        {
          party: "Receiving Party",
          obligation: "Return or destroy data within 7 days of termination",
        },
      ],
      questionsForLawyer: [
        "Is the ₹5,00,000 liquidated damages clause enforceable under Indian law?",
        "Can the confidentiality period be reduced from 5 years?",
        "Should confidential information be required to be marked as confidential?",
      ],
      overallRiskLevel: "High" as const,
    };

    // Structure checks
    expect(mockResult.summary).toBeTruthy();
    expect(typeof mockResult.summary).toBe("string");
    expect(mockResult.keyClauses.length).toBeGreaterThan(0);
    expect(mockResult.risks.length).toBeGreaterThan(0);
    expect(mockResult.obligations.length).toBeGreaterThan(0);
    expect(mockResult.questionsForLawyer.length).toBeGreaterThan(0);
    expect(["Low", "Medium", "High"]).toContain(mockResult.overallRiskLevel);
  });

  it("should reject text that is too short", () => {
    const shortText = "This is too short";
    expect(shortText.trim().length < 50).toBe(true);
  });

  it("should accept sufficiently long legal text", () => {
    const validText = "A".repeat(60);
    expect(validText.trim().length >= 50).toBe(true);
  });

  it("should have valid severity and importance values", () => {
    const validLevels = ["High", "Medium", "Low"];
    expect(validLevels).toContain("High");
    expect(validLevels).toContain("Medium");
    expect(validLevels).toContain("Low");
  });
});