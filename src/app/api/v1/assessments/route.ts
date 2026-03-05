import { NextRequest, NextResponse } from 'next/server';
import { createAssessmentSchema } from '@/lib/validation';
import { createAssessment } from '@/db/repositories/assessments';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createAssessmentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Validatiefout',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { token } = await createAssessment(parsed.data);

    return NextResponse.json(
      { token, redirectUrl: `/assessment/${token}` },
      { status: 201 },
    );
  } catch (error) {
    console.error('Assessment creation failed:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het aanmaken van de assessment.' },
      { status: 500 },
    );
  }
}
