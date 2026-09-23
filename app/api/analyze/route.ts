import { NextRequest, NextResponse } from "next/server";
import { analyzeLegalDocument } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    // Method check
    if (req.method !== "POST") {
      return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
    }

    const body = await req.json();
    const { text } = body;

    // Strict input validation
    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid input. Text must be a string." },
        { status: 400 }
      );
    }

    const cleanedText = text.trim();

    if (cleanedText.length < 50) {
      return NextResponse.json(
        { error: "Document text is too short. Please provide at least 50 characters." },
        { status: 400 }
      );
    }

    // Efficiency limit
    if (cleanedText.length > 28000) {
      return NextResponse.json(
        { error: "Document is too large. Please paste a shorter version (under 28,000 characters)." },
        { status: 400 }
      );
    }

    // Security: Basic sanitization
    const sanitizedText = cleanedText
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+=["'][^"']*["']/gi, "");

    // Call Gemini
    const result = await analyzeLegalDocument(sanitizedText);

    // Extra validation of AI response
    if (!result || !result.summary || !Array.isArray(result.risks)) {
      return NextResponse.json(
        { error: "Failed to generate a valid analysis. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    console.error("API Error:", error?.message || error);

    return NextResponse.json(
      { error: "An unexpected error occurred while analyzing the document." },
      { status: 500 }
    );
  }
}