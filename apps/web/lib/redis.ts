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
  try {
    return await redis.get<CacheEntry>(`r:${shortCode}`);
  } catch {
    return null;
  }
}

export async function setCachedEntry(
  shortCode: string,
  entry: CacheEntry
): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(`r:${shortCode}`, entry, { ex: TTL });
  } catch {
    // non-fatal — next request falls back to Supabase
  }
}

export async function invalidateCachedEntry(shortCode: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(`r:${shortCode}`);
  } catch {
    // non-fatal — stale entry expires after TTL
  }
}
