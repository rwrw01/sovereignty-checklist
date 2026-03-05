import { NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-session';
import { listAssessments, countAssessments } from '@/db/repositories/assessments';

/** GET /api/v1/admin/assessments — list all assessments (admin only) */
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
  }

  try {
    const [all, counts] = await Promise.all([
      listAssessments(),
      countAssessments(),
    ]);

    const stats = {
      total: all.length,
      draft: 0,
      in_progress: 0,
      completed: 0,
    };
    for (const c of counts) {
      if (c.status in stats) {
        stats[c.status as keyof typeof stats] = c.count;
      }
    }

    return NextResponse.json({
      assessments: all.map((a) => ({
        id: a.id,
        token: a.token,
        assessmentType: a.assessmentType,
        companyName: a.companyName,
        contactName: a.contactName,
        contactEmail: a.contactEmail,
        sector: a.sector,
        status: a.status,
        overallScore: a.overallScore,
        sealLevel: a.sealLevel,
        createdAt: a.createdAt,
        completedAt: a.completedAt,
      })),
      stats,
    });
  } catch (error) {
    console.error('Failed to list assessments:', error);
    return NextResponse.json(
      { error: 'Er is een fout opgetreden.' },
      { status: 500 },
    );
  }
}
