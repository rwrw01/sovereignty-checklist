import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getUserSession } from '@/lib/user-session';
import { findUserById, updateUserProfile } from '@/db/repositories/users';

const updateProfileSchema = z.object({
  companyName: z
    .string()
    .min(2, 'Bedrijfsnaam is verplicht (minimaal 2 tekens)')
    .max(200, 'Bedrijfsnaam mag maximaal 200 tekens zijn')
    .trim()
    .optional(),
  contactPhone: z
    .string()
    .max(20, 'Telefoonnummer te lang')
    .trim()
    .optional()
    .or(z.literal('')),
  sector: z
    .enum([
      'overheid',
      'zorg',
      'finance',
      'onderwijs',
      'energie',
      'telecom',
      'transport',
      'overig',
    ])
    .optional(),
});

export async function GET() {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Niet ingelogd' },
        { status: 401 },
      );
    }

    const user = await findUserById(session.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Gebruiker niet gevonden' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      email: user.email,
      name: user.name,
      companyName: user.companyName,
      contactPhone: user.contactPhone,
      sector: user.sector,
    });
  } catch (error) {
    console.error('Get profile failed:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden.' },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Niet ingelogd' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = updateProfileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validatiefout',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    await updateUserProfile(session.userId, parsed.data);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Update profile failed:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het bijwerken van het profiel.' },
      { status: 500 },
    );
  }
}
