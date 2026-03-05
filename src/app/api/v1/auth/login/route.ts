import { NextRequest, NextResponse } from 'next/server';
import { userLoginSchema } from '@/lib/validation';
import { verifyUser } from '@/db/repositories/users';
import { createUserSession } from '@/lib/user-session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = userLoginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validatiefout',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    const user = await verifyUser(email, password);
    if (!user) {
      return NextResponse.json(
        { error: 'Ongeldige inloggegevens.' },
        { status: 401 },
      );
    }

    // Create session
    await createUserSession(user.id, user.email, user.name);

    return NextResponse.json({
      ok: true,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error('Login failed:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het inloggen.' },
      { status: 500 },
    );
  }
}
