import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";
import "dotenv/config";

export const env = createEnv({
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    DATABASE_URL: z.string().min(1),
    OPENAI_API_KEY: z.string().min(1),
    OPENAI_TEMPERATURE: z.string().optional(), // Optional, set a default if needed
    OPENAI_MAX_TOKENS: z.string().optional(),
    OPENAI_TOP_P: z.string().optional(),
    OPENAI_FREQUENCY_PENALTY: z.string().optional(),
    OPENAI_PRESENCE_PENALTY: z.string().optional(),
    // Add other server-side variables as needed
    SECRET_CODE: z.string().optional(),
    NEXTAUTH_URL: z.string().url(),
    CONSOLE_STREAM_OUTPUT: z.string().optional(),
  },
  client: {
    // NEXT_PUBLIC_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID: z.string().min(1), // Public variable available on the client
    NEXT_PUBLIC_PROJECT_ID: z.string().min(1), // Public variable available on the client


  },
  // If you're using Next.js < 13.4.4, you'll need to specify the runtimeEnv manually
  // runtimeEnv: {
  //   DATABASE_URL: process.env.DATABASE_URL,
  //   NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
  // },
  // For Next.js >= 13.4.4, you only need to destructure client variables:
  experimental__runtimeEnv: {
    // NEXT_PUBLIC_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_PUBLISHABLE_KEY,
    NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID:
      process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    NEXT_PUBLIC_PROJECT_ID:
      process.env.NEXT_PUBLIC_PROJECT_ID,
  },
});
