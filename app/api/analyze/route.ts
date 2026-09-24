import { NextRequest, NextResponse } from "next/server";
import { analyzeLegalDocument } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid input. Please provide valid text." },
        { status: 400 }
      );
    }

    const cleanedText = text.trim();

    if (cleanedText.length < 50) {
      return NextResponse.json(
        { error: "Document text is too short. Minimum 50 characters required." },
        { status: 400 }
      );
    }

    if (cleanedText.length > 28000) {
      return NextResponse.json(
        { error: "Document is too large. Please limit to under 28,000 characters." },
        { status: 400 }
      );
    }

    // Security sanitization
    const sanitizedText = cleanedText
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "");

    const result = await analyzeLegalDocument(sanitizedText);

    // Validate AI response
    if (
      !result ||
      typeof result.summary !== "string" ||
      !Array.isArray(result.risks) ||
      !Array.isArray(result.keyClauses)
    ) {
      return NextResponse.json(
        { error: "Invalid analysis result received. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    console.error("API Error:", error?.message || "Unknown error");
    return NextResponse.json(
      { error: "An unexpected error occurred while analyzing the document." },
      { status: 500 }
    );
  }
}