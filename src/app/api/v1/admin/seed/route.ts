import { NextRequest, NextResponse } from 'next/server';
import { hasAdmins, createAdmin } from '@/db/repositories/admin';

/**
 * POST /api/v1/admin/seed — Create first admin user.
 * Only works when: (1) ALLOW_ADMIN_SEED=true is set, AND (2) no admin users exist yet.
 * After first admin is created, remove ALLOW_ADMIN_SEED from the environment.
 */
export async function POST(request: NextRequest) {
  try {
    if (process.env.ALLOW_ADMIN_SEED !== 'true') {
      return NextResponse.json(
        { error: 'Seed endpoint is uitgeschakeld. Stel ALLOW_ADMIN_SEED=true in om te activeren.' },
        { status: 403 },
      );
    }

    const existing = await hasAdmins();
    if (existing) {
      return NextResponse.json(
        { error: 'Admin user al aangemaakt. Seed is niet meer beschikbaar.' },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || typeof username !== 'string' || username.length < 3) {
      return NextResponse.json(
        { error: 'Gebruikersnaam moet minimaal 3 tekens zijn.' },
        { status: 400 },
      );
    }

    if (!password || typeof password !== 'string' || password.length < 12) {
      return NextResponse.json(
        { error: 'Wachtwoord moet minimaal 12 tekens zijn.' },
        { status: 400 },
      );
    }

    await createAdmin(username, password);

    return NextResponse.json({ ok: true, message: 'Admin user aangemaakt.' });
  } catch (error) {
    console.error('Admin seed failed:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden.' },
      { status: 500 },
    );
  }
}
