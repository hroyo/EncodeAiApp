import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env.mjs";

// const client = postgres(env.DATABASE_URL);
const client = postgres(process.env.DATABASE_URL as string);  // Cast to string to avoid type errors

export const db = drizzle(client);

