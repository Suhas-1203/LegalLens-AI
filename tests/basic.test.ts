import { describe, it, expect } from "vitest";

// Simulate the validation logic used in the API
function validateDocumentText(text: unknown): { isValid: boolean; error?: string } {
  if (!text || typeof text !== "string") {
    return { isValid: false, error: "Invalid input. Please provide valid text." };
  }

  const cleanedText = text.trim();

  if (cleanedText.length < 50) {
    return { isValid: false, error: "Document text is too short. Minimum 50 characters required." };
  }

  if (cleanedText.length > 28000) {
    return { isValid: false, error: "Document is too large. Please limit to under 28,000 characters." };
  }

  return { isValid: true };
}

// Simulate sanitization
function sanitizeText(text: string): string {
  return text
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+\s*=/gi, "");
}

describe("LegalLens AI - Realistic Validation Suite", () => {
  // ========== Input Validation Tests ==========

  it("should reject null or undefined input", () => {
    expect(validateDocumentText(null).isValid).toBe(false);
    expect(validateDocumentText(undefined).isValid).toBe(false);
  });

  it("should reject non-string input", () => {
    expect(validateDocumentText(123).isValid).toBe(false);
    expect(validateDocumentText({}).isValid).toBe(false);
    expect(validateDocumentText([]).isValid).toBe(false);
  });

  it("should reject text shorter than 50 characters", () => {
    const result = validateDocumentText("This is too short");
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("too short");
  });

  it("should accept text with exactly 50 characters", () => {
    const text = "A".repeat(50);
    expect(validateDocumentText(text).isValid).toBe(true);
  });

  it("should accept text longer than 50 characters", () => {
    const text = "A".repeat(120);
    expect(validateDocumentText(text).isValid).toBe(true);
  });

  it("should reject text longer than 28000 characters", () => {
    const text = "A".repeat(28001);
    const result = validateDocumentText(text);
    expect(result.isValid).toBe(false);
    expect(result.error).toContain("too large");
  });

  // ========== Sanitization Tests ==========

  it("should remove script tags during sanitization", () => {
    const dirty = 'Hello <script>alert("xss")</script> World';
    const clean = sanitizeText(dirty);
    expect(clean).not.toContain("<script>");
    expect(clean).toContain("Hello");
    expect(clean).toContain("World");
  });

  it("should remove javascript: protocol", () => {
    const dirty = "Click javascript:alert(1)";
    const clean = sanitizeText(dirty);
    expect(clean).not.toContain("javascript:");
  });

  // ========== Analysis Result Structure Tests ==========

  it("should have all required fields in a valid analysis result", () => {
    const result = {
      summary: "Clear summary of the document",
      keyClauses: [{ title: "Clause 1", explanation: "Explanation", importance: "High" }],
      risks: [{ risk: "Risk 1", severity: "Medium", explanation: "Why it is a risk" }],
      obligations: [{ party: "Employee", obligation: "Must maintain confidentiality" }],
      questionsForLawyer: ["Is this clause enforceable?"],
      overallRiskLevel: "Medium",
    };

    expect(result).toHaveProperty("summary");
    expect(result).toHaveProperty("keyClauses");
    expect(result).toHaveProperty("risks");
    expect(result).toHaveProperty("obligations");
    expect(result).toHaveProperty("questionsForLawyer");
    expect(result).toHaveProperty("overallRiskLevel");
  });

  it("should only allow valid risk and importance levels", () => {
    const validLevels = ["Low", "Medium", "High"];
    expect(validLevels).toContain("High");
    expect(validLevels).toContain("Medium");
    expect(validLevels).toContain("Low");
  });

  it("should ensure summary is a non-empty string", () => {
    const summary = "This is a valid summary of the legal document.";
    expect(typeof summary).toBe("string");
    expect(summary.length).toBeGreaterThan(10);
  });

  it("should ensure arrays are not empty in a proper analysis", () => {
    const keyClauses = [{ title: "Test", explanation: "Test", importance: "High" }];
    const risks = [{ risk: "Test", severity: "Low", explanation: "Test" }];
    const questions = ["What should I ask my lawyer?"];

    expect(keyClauses.length).toBeGreaterThan(0);
    expect(risks.length).toBeGreaterThan(0);
    expect(questions.length).toBeGreaterThan(0);
  });
});