import { betterAuth } from "better-auth";
import { prisma } from "./db";
import { prismaAdapter } from "@better-auth/prisma-adapter";

const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build";
const secret =
  process.env.BETTER_AUTH_SECRET ||
  process.env.AUTH_SECRET ||
  (isProductionBuild ? "build-only-placeholder-not-used-at-runtime" : undefined);
const baseURL =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (isProductionBuild ? "http://localhost:3000" : undefined);

const trustedOrigins = Array.from(
  new Set(
    [
      baseURL,
      process.env.NEXT_PUBLIC_APP_URL,
      "https://tsmmobile.store",
      "https://www.tsmmobile.store",
      "http://localhost:3000",
    ].filter((origin): origin is string => Boolean(origin))
  )
);

if (process.env.NODE_ENV === "production" && !secret) {
  throw new Error("BETTER_AUTH_SECRET must be set in production.");
}

if (process.env.NODE_ENV === "production" && !baseURL) {
  throw new Error("BETTER_AUTH_URL must be set in production.");
}

export const auth = betterAuth({
  secret,
  baseURL,
  trustedOrigins,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    disableSignUp: true,
  },
  user: {
    modelName: "User",
    additionalFields: {
      organisationId: {
        type: "string",
        required: false,
        input: false,
      },
      branchId: {
        type: "string",
        required: false,
        input: false,
      },
      phone: {
        type: "string",
        required: false,
      },
    },
  },
  account: {
    modelName: "Account",
    fields: {
      accountId: "providerAccountId",
      accessTokenExpiresAt: "expiresAt",
      password: "passwordHash",
    },
  },
  session: {
    modelName: "Session",
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  verification: {
    modelName: "Verification",
  },
  rateLimit: {
    window: 60,
    max: 20,
  },
});
