import { defineConfig } from 'drizzle-kit';

const url = process.env.DATABASE_URL ?? process.env.DATABASE_PATH ?? 'file:./data/sovereignty.db';
const authToken = process.env.DATABASE_AUTH_TOKEN;

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'turso',
  dbCredentials: {
    url,
    ...(authToken ? { authToken } : {}),
  },
});
