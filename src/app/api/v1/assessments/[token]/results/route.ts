import { NextRequest, NextResponse } from 'next/server';
import { tokenSchema } from '@/lib/validation';
import { findByToken, getSovScores, getSraScores, getAnswers } from '@/db/repositories/assessments';
import { SOV_WEIGHTS } from '@/lib/seal/weights';
import { SRA_WEIGHTS } from '@/lib/sra/weights';
import type { SovCategory } from '@/lib/seal/types';
import type { SraTheme } from '@/lib/sra/types';

/** GET /api/v1/assessments/[token]/results — fetch completed results */
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

    if (assessment.status !== 'completed') {
      return NextResponse.json(
        { error: 'Assessment is nog niet afgerond', status: assessment.status },
        { status: 400 },
      );
    }

    const answers = await getAnswers(assessment.id);

    if (assessment.assessmentType === 'sra') {
      const scores = await getSraScores(assessment.id);

      const themeScores = scores.map((s) => ({
        theme: s.theme as SraTheme,
        themeName: SRA_WEIGHTS[s.theme as SraTheme]?.nameNl ?? s.theme,
        avgScore: s.avgScore,
        sraLevel: s.sraLevel,
        weight: SRA_WEIGHTS[s.theme as SraTheme]?.weight ?? 0,
      }));

      return NextResponse.json({
        assessment: {
          token: assessment.token,
          assessmentType: assessment.assessmentType,
          companyName: assessment.companyName,
          contactName: assessment.contactName,
          contactEmail: assessment.contactEmail,
          sector: assessment.sector,
          overallScore: assessment.overallScore,
          sraLevel: assessment.sealLevel, // reused column
          completedAt: assessment.completedAt,
        },
        themeScores,
        totalAnswers: answers.length,
      });
    }

    // SEAL track (default)
    const scores = await getSovScores(assessment.id);

    const sovScores = scores.map((s) => ({
      category: s.sovCategory as SovCategory,
      categoryName: SOV_WEIGHTS[s.sovCategory as SovCategory]?.nameNl ?? s.sovCategory,
      avgScore: s.avgScore,
      sealLevel: s.sealLevel,
      weight: SOV_WEIGHTS[s.sovCategory as SovCategory]?.weight ?? 0,
    }));

    return NextResponse.json({
      assessment: {
        token: assessment.token,
        assessmentType: assessment.assessmentType,
        companyName: assessment.companyName,
        contactName: assessment.contactName,
        contactEmail: assessment.contactEmail,
        sector: assessment.sector,
        overallScore: assessment.overallScore,
        sealLevel: assessment.sealLevel,
        completedAt: assessment.completedAt,
      },
      sovScores,
      totalAnswers: answers.length,
    });
  } catch (error) {
    console.error('Failed to fetch results:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden.' },
      { status: 500 },
    );
  }
}
