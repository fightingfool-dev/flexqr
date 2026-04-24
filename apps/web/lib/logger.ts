// Next.js redirect() and notFound() work by throwing special errors.
// Any try/catch wrapping server actions must re-throw them.
export function isNextInternalError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "digest" in err &&
    typeof (err as { digest: unknown }).digest === "string" &&
    ((err as { digest: string }).digest.startsWith("NEXT_REDIRECT") ||
      (err as { digest: string }).digest === "NEXT_NOT_FOUND")
  );
}

export function logError(
  label: string,
  err: unknown,
  context?: Record<string, unknown>
): void {
  console.error(`[${label}]`, err, ...(context ? [context] : []));
}
