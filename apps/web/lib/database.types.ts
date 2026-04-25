// Hand-written row types derived from packages/db/prisma/schema.prisma.
// Keep in sync with the schema when columns are added/removed.

export type Plan = "FREE" | "STARTER" | "PRO" | "ENTERPRISE";
export type Role = "OWNER" | "ADMIN" | "MEMBER";
export type QRType = "URL" | "VCARD" | "WIFI" | "EMAIL" | "PHONE" | "SMS";
export type SubStatus = "ACTIVE" | "INACTIVE" | "PAST_DUE" | "CANCELED";

export type DbUser = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  createdAt: string;
};

export type DbWorkspace = {
  id: string;
  slug: string;
  name: string;
  plan: Plan;
  createdAt: string;
  updatedAt: string;
};

export type DbWorkspaceMember = {
  id: string;
  workspaceId: string;
  userId: string;
  role: Role;
  joinedAt: string;
};

export type DbQRCode = {
  id: string;
  workspaceId: string;
  shortCode: string;
  name: string;
  destinationUrl: string;
  type: QRType;
  isActive: boolean;
  imageUrl: string | null;
  scanCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

export type DbQRDesign = {
  id: string;
  qrCodeId: string;
  fgColor: string;
  bgColor: string;
  dotStyle: string;
  cornerStyle: string;
  logoUrl: string | null;
  logoSize: number;
  errorCorrection: string;
  settings: Record<string, unknown>;
};

export type DbScan = {
  id: string;
  qrCodeId: string;
  scannedAt: string;
  country: string | null;
  city: string | null;
  deviceType: string | null;
  os: string | null;
  browser: string | null;
  referer: string | null;
  ipHash: string | null;
};

export type DbSubscription = {
  id: string;
  workspaceId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string | null;
  stripePriceId: string | null;
  status: SubStatus;
  currentPeriodEnd: string | null;
};

export type DbEvent = {
  id: string;
  sessionId: string | null;
  userId: string | null;
  event: string;
  properties: Record<string, unknown>;
  createdAt: string;
};

export type DbDomain = {
  id: string;
  workspaceId: string;
  domain: string;
  verified: boolean;
  createdAt: string;
};
