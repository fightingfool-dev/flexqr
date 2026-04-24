import { Redis } from "@upstash/redis";

// Returns null when Upstash isn't configured — redirect falls back to direct Supabase.
export const redis: Redis | null =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// Cache active short codes for 1 hour. Inactive codes are never cached.
const TTL = 3600;

type CacheEntry = { id: string; url: string };

export async function getCachedEntry(
  shortCode: string
): Promise<CacheEntry | null> {
  if (!redis) return null;
  return redis.get<CacheEntry>(`r:${shortCode}`);
}

export async function setCachedEntry(
  shortCode: string,
  entry: CacheEntry
): Promise<void> {
  if (!redis) return;
  await redis.set(`r:${shortCode}`, entry, { ex: TTL });
}

export async function invalidateCachedEntry(shortCode: string): Promise<void> {
  if (!redis) return;
  await redis.del(`r:${shortCode}`);
}
