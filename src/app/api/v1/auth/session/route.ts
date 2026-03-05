import { NextResponse } from 'next/server';
import { getUserSession, destroyUserSession } from '@/lib/user-session';

export async function GET() {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 },
      );
    }

    return NextResponse.json({
      authenticated: true,
      email: session.email,
      name: session.name,
      userId: session.userId,
    });
  } catch (error) {
    console.error('Session check failed:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 401 },
    );
  }
}

export async function DELETE() {
  try {
    await destroyUserSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Logout failed:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het uitloggen.' },
      { status: 500 },
    );
  }
}
