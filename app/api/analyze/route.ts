import { NextRequest, NextResponse } from "next/server";
import { analyzeLegalDocument } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text } = body;

    if (!text || typeof text !== "string" || text.trim().length < 50) {
      return NextResponse.json(
        { error: "Please provide a valid document text (minimum 50 characters)." },
        { status: 400 }
      );
    }

    if (text.length > 100000) {
      return NextResponse.json(
        { error: "Document is too large. Please upload a shorter document." },
        { status: 400 }
      );
    }

    const result = await analyzeLegalDocument(text);

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: error.message || "Something went wrong while analyzing the document." },
      { status: 500 }
    );
  }
}