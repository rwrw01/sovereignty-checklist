import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Turso (hosted libSQL) or local SQLite file
const url = process.env.DATABASE_URL ?? process.env.DATABASE_PATH ?? 'file:./data/sovereignty.db';
const authToken = process.env.DATABASE_AUTH_TOKEN;

const client = createClient({
  url,
  ...(authToken ? { authToken } : {}),
});

export const db = drizzle(client, { schema });
