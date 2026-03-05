import { eq } from 'drizzle-orm';
import { compare, hash } from 'bcryptjs';
import { db } from '../client';
import { adminUsers } from '../schema';

const BCRYPT_ROUNDS = 12;

/** Verify admin credentials and return user if valid */
export async function verifyAdmin(
  username: string,
  password: string,
): Promise<{ id: number; username: string } | null> {
  const rows = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.username, username))
    .limit(1);

  const user = rows[0];
  if (!user) return null;

  const valid = await compare(password, user.passwordHash);
  if (!valid) return null;

  return { id: user.id, username: user.username };
}

/** Create an admin user (for seeding) */
export async function createAdmin(
  username: string,
  password: string,
): Promise<void> {
  const passwordHash = await hash(password, BCRYPT_ROUNDS);
  await db.insert(adminUsers).values({ username, passwordHash });
}

/** Check if any admin users exist */
export async function hasAdmins(): Promise<boolean> {
  const rows = await db.select({ id: adminUsers.id }).from(adminUsers).limit(1);
  return rows.length > 0;
}
