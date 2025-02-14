import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Create a new ratelimiter, that allows 15 requests per minute
export const minuteLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, "1 m"),
  analytics: true,
});

// 250 requests per hour
export const hourLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(250, "1 h"),
  analytics: true,
});

// 500 requests per day
export const dayLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(500, "1 d"),
  analytics: true,
});

export async function rateLimit(ip: string) {
  const results = await Promise.all([
    minuteLimiter.limit(ip),
    hourLimiter.limit(ip),
    dayLimiter.limit(ip),
  ]);

  const blocked = results.some((result) => !result.success);
  const remaining = Math.min(...results.map((result) => result.remaining));

  return { blocked, remaining };
}
