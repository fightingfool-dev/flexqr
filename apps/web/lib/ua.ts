export type ParsedUA = {
  deviceType: "mobile" | "tablet" | "desktop";
  os: string | null;
  browser: string | null;
};

export function parseUA(ua: string): ParsedUA {
  const s = ua.toLowerCase();

  let deviceType: ParsedUA["deviceType"] = "desktop";
  if (/mobile|iphone|ipod|android.*mobile|windows phone/.test(s))
    deviceType = "mobile";
  else if (/tablet|ipad|android(?!.*mobile)/.test(s)) deviceType = "tablet";

  let os: string | null = null;
  if (/windows/.test(s)) os = "Windows";
  else if (/iphone|ipod/.test(s)) os = "iOS";
  else if (/ipad/.test(s)) os = "iPadOS";
  else if (/android/.test(s)) os = "Android";
  else if (/macintosh|mac os x/.test(s)) os = "macOS";
  else if (/linux/.test(s)) os = "Linux";

  let browser: string | null = null;
  if (/edg\//.test(s)) browser = "Edge";
  else if (/opr\/|opera/.test(s)) browser = "Opera";
  else if (/chrome\//.test(s)) browser = "Chrome";
  else if (/firefox\//.test(s)) browser = "Firefox";
  else if (/safari\//.test(s)) browser = "Safari";

  return { deviceType, os, browser };
}
