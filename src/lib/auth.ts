import { betterAuth } from "better-auth";
import { prisma } from "./db";
import { prismaAdapter } from "@better-auth/prisma-adapter";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
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
  },
  session: {
    modelName: "Session",
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  rateLimit: {
    window: 60,
    max: 20,
  },
});
