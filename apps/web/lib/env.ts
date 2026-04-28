// Central env accessor — validates presence at module load time in production.
// All access to process.env should go through this object.

function get(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value ?? "";
}

// Ensures APP_URL uses HTTPS in production. If it doesn't, the build
// will throw at startup — easier to catch than silent http:// QR links.
function requireHttps(value: string): string {
  if (process.env.NODE_ENV === "production" && !value.startsWith("https://")) {
    throw new Error(
      `NEXT_PUBLIC_APP_URL must start with https:// in production. ` +
        `Got: "${value}". ` +
        `Fix: Vercel Dashboard → Project → Settings → Environment Variables.`
    );
  }
  return value;
}

export const env = {
  // App
  APP_URL: requireHttps(get("NEXT_PUBLIC_APP_URL", "http://localhost:3000")),

  // Supabase (public — safe to expose to browser)
  SUPABASE_URL: get("NEXT_PUBLIC_SUPABASE_URL"),
  SUPABASE_ANON_KEY: get("NEXT_PUBLIC_SUPABASE_ANON_KEY"),

  // Supabase (server-only — never send to client)
  SUPABASE_SERVICE_ROLE_KEY: get("SUPABASE_SERVICE_ROLE_KEY"),

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  STRIPE_PRICE_STARTER: process.env.STRIPE_PRICE_STARTER_MONTHLY,
  STRIPE_PRICE_PRO: process.env.STRIPE_PRICE_PRO_MONTHLY,

  // Email
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  RESEND_FROM: process.env.RESEND_FROM_EMAIL ?? "noreply@analogqr.com",

  // Redis (redirect cache)
  UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL,
  UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN,
} as const;
