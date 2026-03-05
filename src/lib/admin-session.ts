import { cookies } from 'next/headers';
import { createHmac, timingSafeEqual } from 'crypto';

const COOKIE_NAME = 'admin_session';
const MAX_AGE = 8 * 60 * 60; // 8 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET must be set (min 32 chars)');
  }
  return secret;
}

function sign(payload: string): string {
  const mac = createHmac('sha256', getSecret())
    .update(payload)
    .digest('base64url');
  return `${payload}.${mac}`;
}

function verify(token: string): string | null {
  const dotIndex = token.lastIndexOf('.');
  if (dotIndex === -1) return null;

  const payload = token.substring(0, dotIndex);
  const mac = token.substring(dotIndex + 1);

  const expected = createHmac('sha256', getSecret())
    .update(payload)
    .digest('base64url');

  try {
    const macBuf = Buffer.from(mac, 'base64url');
    const expectedBuf = Buffer.from(expected, 'base64url');
    if (macBuf.length !== expectedBuf.length) return null;
    if (!timingSafeEqual(macBuf, expectedBuf)) return null;
  } catch {
    return null;
  }

  return payload;
}

export interface AdminSession {
  userId: number;
  username: string;
  createdAt: number;
}

/** Create a signed session cookie */
export async function createSession(userId: number, username: string): Promise<void> {
  const session: AdminSession = {
    userId,
    username,
    createdAt: Date.now(),
  };

  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  const token = sign(payload);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  });
}

/** Get the current admin session, or null if not authenticated */
export async function getSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verify(token);
  if (!payload) return null;

  try {
    const session: AdminSession = JSON.parse(
      Buffer.from(payload, 'base64url').toString('utf-8'),
    );

    // Check session expiry
    if (Date.now() - session.createdAt > MAX_AGE * 1000) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

/** Destroy the admin session */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
