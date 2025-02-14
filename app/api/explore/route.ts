import { NextRequest, NextResponse } from "next/server";
import { gptService } from "@/services/gptService";

export async function POST(req: NextRequest) {
  try {
    const { query, userContext } = await req.json();
    const response = await gptService.getExploreContent(query, userContext);
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to explore topic" },
      { status: 500 }
    );
  }
}
