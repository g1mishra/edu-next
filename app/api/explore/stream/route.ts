import { NextRequest } from "next/server";
import { gptService } from "@/services/gptService";

export async function POST(req: NextRequest) {
  const { query, userContext } = await req.json();
  
  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  gptService.streamExploreContent(query, userContext, async (chunk) => {
    await writer.write(encoder.encode(JSON.stringify(chunk) + '\n'));
  }).finally(() => writer.close());

  return new Response(stream.readable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
