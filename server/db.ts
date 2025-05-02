import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Client } = pkg;
import * as dotenv from 'dotenv';
import * as schema from "@shared/schema";

dotenv.config();

const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`${envVar} must be set in environment variables`);
  }
}

const client = new Client({
  host: process.env.DB_HOST as string,
  port: parseInt(process.env.DB_PORT as string),
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
});

client.connect();

export const db = drizzle(client, { schema });
