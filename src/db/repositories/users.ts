import { eq } from 'drizzle-orm';
import { compare, hash } from 'bcryptjs';
import { db } from '../client';
import { users } from '../schema';

const BCRYPT_ROUNDS = 12;

/** Create a new user account */
export async function createUser(
  email: string,
  name: string,
  password: string,
): Promise<{ id: number; email: string; name: string }> {
  const passwordHash = await hash(password, BCRYPT_ROUNDS);
  const result = await db
    .insert(users)
    .values({
      email: email.toLowerCase().trim(),
      name: name.trim(),
      passwordHash,
    })
    .returning({ id: users.id, email: users.email, name: users.name });
  return result[0];
}

/** Verify user credentials */
export async function verifyUser(
  email: string,
  password: string,
): Promise<{ id: number; email: string; name: string } | null> {
  const rows = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);

  const user = rows[0];
  if (!user) return null;

  const valid = await compare(password, user.passwordHash);
  if (!valid) return null;

  return { id: user.id, email: user.email, name: user.name };
}

/** Find user by ID */
export async function findUserById(id: number) {
  const rows = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return rows[0] ?? null;
}

/** Update user profile (company, phone, sector) */
export async function updateUserProfile(
  userId: number,
  data: { companyName?: string; contactPhone?: string; sector?: string },
) {
  await db
    .update(users)
    .set({
      ...data,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(users.id, userId));
}

/** Check if email already registered */
export async function emailExists(email: string): Promise<boolean> {
  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email.toLowerCase().trim()))
    .limit(1);
  return rows.length > 0;
}
