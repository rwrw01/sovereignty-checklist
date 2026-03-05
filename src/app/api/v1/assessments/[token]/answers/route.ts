import { NextRequest, NextResponse } from 'next/server';
import { tokenSchema, submitAnswersSchema } from '@/lib/validation';
import {
  findByToken,
  upsertAnswer,
  updateStatus,
  saveResults,
  saveSraResults,
  getAnswers,
} from '@/db/repositories/assessments';
import { calculateAssessment } from '@/lib/seal';
import { calculateSraAssessment } from '@/lib/sra';
import type { Answer } from '@/lib/seal';
import type { SraAnswer } from '@/lib/sra';

/** PUT /api/v1/assessments/[token]/answers — auto-save answers (partial) */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const tokenParsed = tokenSchema.safeParse(token);
    if (!tokenParsed.success) {
      return NextResponse.json({ error: 'Ongeldig token' }, { status: 400 });
    }

    const assessment = await findByToken(tokenParsed.data);
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment niet gevonden' }, { status: 404 });
    }

    if (assessment.status === 'completed') {
      return NextResponse.json(
        { error: 'Assessment is al afgerond' },
        { status: 409 },
      );
    }

    const body = await request.json();
    const parsed = submitAnswersSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validatiefout', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    // Upsert each answer
    for (const answer of parsed.data.answers) {
      await upsertAnswer(
        assessment.id,
        answer.questionId,
        answer.score,
        answer.notes,
      );
    }

    // Update status to in_progress if still draft
    if (assessment.status === 'draft') {
      await updateStatus(assessment.id, 'in_progress');
    }

    return NextResponse.json({ saved: parsed.data.answers.length });
  } catch (error) {
    console.error('Failed to save answers:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het opslaan.' },
      { status: 500 },
    );
  }
}

/** POST /api/v1/assessments/[token]/answers — finalize assessment + calculate SEAL */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;
    const tokenParsed = tokenSchema.safeParse(token);
    if (!tokenParsed.success) {
      return NextResponse.json({ error: 'Ongeldig token' }, { status: 400 });
    }

    const assessment = await findByToken(tokenParsed.data);
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment niet gevonden' }, { status: 404 });
    }

    if (assessment.status === 'completed') {
      return NextResponse.json(
        { error: 'Assessment is al afgerond' },
        { status: 409 },
      );
    }

    // Save any remaining answers from the request body
    const body = await request.json();
    const parsed = submitAnswersSchema.safeParse(body);
    if (parsed.success) {
      for (const answer of parsed.data.answers) {
        await upsertAnswer(
          assessment.id,
          answer.questionId,
          answer.score,
          answer.notes,
        );
      }
    }

    // Fetch all answers and calculate
    const allAnswers = await getAnswers(assessment.id);

    if (allAnswers.length === 0) {
      return NextResponse.json(
        { error: 'Geen antwoorden gevonden. Vul eerst de vragenlijst in.' },
        { status: 400 },
      );
    }

    if (assessment.assessmentType === 'sra') {
      // SRA track
      const sraAnswers: SraAnswer[] = allAnswers.map((a) => ({
        questionId: a.questionId,
        score: a.score as 0 | 1 | 2 | 3 | 4,
      }));

      const result = calculateSraAssessment(sraAnswers, assessment.sector ?? undefined);

      await saveSraResults(
        assessment.id,
        result.overallScore,
        result.overallSraLevel,
        result.themeScores.map((s) => ({
          theme: s.theme,
          avgScore: s.avgScore,
          sraLevel: s.sraLevel,
        })),
      );

      return NextResponse.json({
        result: {
          overallScore: result.overallScore,
          overallSraLevel: result.overallSraLevel,
          themeScores: result.themeScores,
          criticalFlags: result.criticalFlags,
        },
        redirectUrl: `/assessment/${token}/result`,
      });
    }

    // SEAL track (default)
    const sealAnswers: Answer[] = allAnswers.map((a) => ({
      questionId: a.questionId,
      score: a.score as 0 | 1 | 2 | 3 | 4,
    }));

    const result = calculateAssessment(sealAnswers);

    await saveResults(
      assessment.id,
      result.overallScore,
      result.overallSealLevel,
      result.sovScores.map((s) => ({
        sovCategory: s.category,
        avgScore: s.avgScore,
        sealLevel: s.sealLevel,
      })),
    );

    return NextResponse.json({
      result: {
        overallScore: result.overallScore,
        overallSealLevel: result.overallSealLevel,
        sovScores: result.sovScores,
        criticalFlags: result.criticalFlags,
      },
      redirectUrl: `/assessment/${token}/result`,
    });
  } catch (error) {
    console.error('Failed to finalize assessment:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden bij het afronden.' },
      { status: 500 },
    );
  }
}
