import { NextRequest, NextResponse } from "next/server";
import { gptService } from "@/services/gptService";
import { rateLimitMiddleware } from "@/middleware/rateLimitMiddleware";

export async function POST(req: NextRequest) {
  try {
    // Check rate limit
    const rateLimit = await rateLimitMiddleware(req);
    if (rateLimit.status === 429) {
      return rateLimit;
    }

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
