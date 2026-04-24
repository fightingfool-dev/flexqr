// Re-export the Prisma singleton from the shared @flexqr/db package.
// Import `prisma` from here throughout the app — never instantiate PrismaClient directly.
export { prisma } from "@flexqr/db";
export type * from "@flexqr/db";
