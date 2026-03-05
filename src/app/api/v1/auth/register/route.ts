import { NextRequest, NextResponse } from 'next/server';
import { userRegistrationSchema } from '@/lib/validation';
import { createUser, emailExists } from '@/db/repositories/users';
import { createUserSession } from '@/lib/user-session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = userRegistrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validatiefout',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { email, name, password } = parsed.data;

    // Check if email is already registered
    const exists = await emailExists(email);
    if (exists) {
      return NextResponse.json(
        { error: 'Dit e-mailadres is al geregistreerd.' },
        { status: 409 },
      );
    }

    // Create user
    const user = await createUser(email, name, password);

    // Auto-login: create session
    await createUserSession(user.id, user.email, user.name);

    return NextResponse.json(
      { ok: true, email: user.email, name: user.name },
      { status: 201 },
    );
  } catch (error) {
    console.error('Registration failed:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij de registratie.' },
      { status: 500 },
    );
  }
}
