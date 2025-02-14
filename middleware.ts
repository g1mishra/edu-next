import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "./lib/ratelimit";

export async function middleware(request: NextRequest & { ip: string }) {
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = request.ip ?? request.headers.get("x-forwarded-for") ?? "Unknown IP";
    console.log("User IP:", ip);
    const { blocked, remaining } = await rateLimit(ip);

    if (blocked) {
      return new NextResponse(JSON.stringify({ error: "Too many requests" }), {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "X-RateLimit-Remaining": remaining.toString(),
        },
      });
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Remaining", remaining.toString());
    return response;
  }
}

export const config = {
  matcher: "/api/:path*",
};
