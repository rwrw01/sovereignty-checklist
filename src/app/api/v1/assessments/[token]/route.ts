import { NextRequest, NextResponse } from 'next/server';
import { tokenSchema } from '@/lib/validation';
import { findByToken, getAnswers, updateStatus } from '@/db/repositories/assessments';

/** GET /api/v1/assessments/[token] — fetch assessment + saved answers */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const parsed = tokenSchema.safeParse(token);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Ongeldig token' }, { status: 400 });
    }

    const assessment = await findByToken(parsed.data);
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment niet gevonden' }, { status: 404 });
    }

    const savedAnswers = await getAnswers(assessment.id);

    return NextResponse.json({
      assessment: {
        token: assessment.token,
        assessmentType: assessment.assessmentType,
        companyName: assessment.companyName,
        contactName: assessment.contactName,
        status: assessment.status,
        sector: assessment.sector,
        createdAt: assessment.createdAt,
      },
      answers: savedAnswers.map((a) => ({
        questionId: a.questionId,
        score: a.score,
        notes: a.notes,
      })),
    });
  } catch (error) {
    console.error('Failed to fetch assessment:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden.' },
      { status: 500 },
    );
  }
}

/** PATCH /api/v1/assessments/[token] — update status to in_progress */
export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const parsed = tokenSchema.safeParse(token);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Ongeldig token' }, { status: 400 });
    }

    const assessment = await findByToken(parsed.data);
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment niet gevonden' }, { status: 404 });
    }

    if (assessment.status === 'draft') {
      await updateStatus(assessment.id, 'in_progress');
    }

    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    console.error('Failed to update assessment:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden.' },
      { status: 500 },
    );
  }
}
