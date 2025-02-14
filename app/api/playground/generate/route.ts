import { NextRequest, NextResponse } from "next/server";
import { gptService } from "@/services/gptService";

export async function POST(req: NextRequest) {
  try {
    const { topic, level, userContext } = await req.json();
    const response = await gptService.getPlaygroundQuestion(topic, level, userContext);
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to generate question" },
      { status: 500 }
    );
  }
}
