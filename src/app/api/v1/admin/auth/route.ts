import { NextRequest, NextResponse } from 'next/server';
import { adminLoginSchema } from '@/lib/validation';
import { verifyAdmin } from '@/db/repositories/admin';
import { createSession, destroySession, getSession } from '@/lib/admin-session';

/** POST /api/v1/admin/auth — login */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = adminLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validatiefout', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const user = await verifyAdmin(parsed.data.username, parsed.data.password);
    if (!user) {
      return NextResponse.json(
        { error: 'Ongeldige inloggegevens' },
        { status: 401 },
      );
    }

    await createSession(user.id, user.username);

    return NextResponse.json({ ok: true, username: user.username });
  } catch (error) {
    console.error('Admin login failed:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden.' },
      { status: 500 },
    );
  }
}

/** DELETE /api/v1/admin/auth — logout */
export async function DELETE() {
  await destroySession();
  return NextResponse.json({ ok: true });
}

/** GET /api/v1/admin/auth — check session */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({
    authenticated: true,
    username: session.username,
  });
}
