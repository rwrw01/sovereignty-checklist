import { NextRequest, NextResponse } from 'next/server';
import { getUserSession } from '@/lib/user-session';
import { createUserAssessmentSchema } from '@/lib/validation';
import { createUserAssessment, listUserAssessments } from '@/db/repositories/assessments';
import { findUserById } from '@/db/repositories/users';

export async function GET() {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Niet ingelogd' },
        { status: 401 },
      );
    }

    const assessmentList = await listUserAssessments(session.userId);

    return NextResponse.json({ assessments: assessmentList });
  } catch (error) {
    console.error('List user assessments failed:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden.' },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getUserSession();
    if (!session) {
      return NextResponse.json(
        { error: 'Niet ingelogd' },
        { status: 401 },
      );
    }

    const body = await request.json();
    const parsed = createUserAssessmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validatiefout',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    // Fetch user profile for contact info
    const user = await findUserById(session.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'Gebruiker niet gevonden' },
        { status: 404 },
      );
    }

    // Check if user has a company name set
    if (!user.companyName) {
      return NextResponse.json(
        { error: 'Vul eerst uw organisatiegegevens in.', needsProfile: true },
        { status: 400 },
      );
    }

    const { token } = await createUserAssessment(
      parsed.data.assessmentType,
      session.userId,
      {
        companyName: user.companyName,
        contactName: user.name,
        contactEmail: user.email,
        contactPhone: user.contactPhone ?? undefined,
        sector: user.sector ?? undefined,
      },
    );

    return NextResponse.json(
      { token, redirectUrl: `/assessment/${token}` },
      { status: 201 },
    );
  } catch (error) {
    console.error('Create user assessment failed:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het aanmaken van de assessment.' },
      { status: 500 },
    );
  }
}
