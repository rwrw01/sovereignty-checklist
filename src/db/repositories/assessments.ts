import { eq, desc, count } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../client';
import { assessments, answers, sovScores, sraScores } from '../schema';
import type { CreateAssessmentInput, AssessmentType } from '@/lib/validation';

export interface AssessmentRow {
  id: number;
  token: string;
  assessmentType: AssessmentType;
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string | null;
  sector: string | null;
  userId: number | null;
  overallScore: number | null;
  sealLevel: number | null;
  status: 'draft' | 'in_progress' | 'completed';
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

/** Create a new assessment and return its token */
export async function createAssessment(
  input: CreateAssessmentInput,
): Promise<{ token: string }> {
  const token = uuidv4();

  await db.insert(assessments).values({
    token,
    assessmentType: input.assessmentType,
    companyName: input.companyName,
    contactName: input.contactName,
    contactEmail: input.contactEmail,
    contactPhone: input.contactPhone || null,
    sector: input.sector || null,
  });

  return { token };
}

/** Create an assessment linked to a user (from dashboard) */
export async function createUserAssessment(
  assessmentType: AssessmentType,
  userId: number,
  contactInfo: {
    companyName: string;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    sector?: string;
  },
): Promise<{ token: string }> {
  const token = uuidv4();

  await db.insert(assessments).values({
    token,
    assessmentType,
    userId,
    companyName: contactInfo.companyName,
    contactName: contactInfo.contactName,
    contactEmail: contactInfo.contactEmail,
    contactPhone: contactInfo.contactPhone || null,
    sector: contactInfo.sector || null,
  });

  return { token };
}

/** List assessments for a specific user (user dashboard) */
export async function listUserAssessments(userId: number): Promise<AssessmentRow[]> {
  const rows = await db
    .select()
    .from(assessments)
    .where(eq(assessments.userId, userId))
    .orderBy(desc(assessments.updatedAt));

  return rows as AssessmentRow[];
}

/** List all assessments (for admin dashboard) */
export async function listAssessments(): Promise<AssessmentRow[]> {
  const rows = await db
    .select()
    .from(assessments)
    .orderBy(desc(assessments.createdAt));

  return rows as AssessmentRow[];
}

/** Count assessments by status */
export async function countAssessments() {
  const rows = await db
    .select({
      status: assessments.status,
      count: count(),
    })
    .from(assessments)
    .groupBy(assessments.status);

  return rows;
}

/** Find an assessment by its public token */
export async function findByToken(
  token: string,
): Promise<AssessmentRow | null> {
  const rows = await db
    .select()
    .from(assessments)
    .where(eq(assessments.token, token))
    .limit(1);

  return (rows[0] as AssessmentRow) ?? null;
}

/** Get all answers for an assessment */
export async function getAnswers(assessmentId: number) {
  return db
    .select()
    .from(answers)
    .where(eq(answers.assessmentId, assessmentId));
}

/** Get SOV scores for an assessment */
export async function getSovScores(assessmentId: number) {
  return db
    .select()
    .from(sovScores)
    .where(eq(sovScores.assessmentId, assessmentId));
}

/** Update assessment status */
export async function updateStatus(
  assessmentId: number,
  status: 'draft' | 'in_progress' | 'completed',
) {
  await db
    .update(assessments)
    .set({
      status,
      updatedAt: new Date().toISOString(),
      ...(status === 'completed'
        ? { completedAt: new Date().toISOString() }
        : {}),
    })
    .where(eq(assessments.id, assessmentId));
}

/** Upsert a single answer (insert or update on conflict) */
export async function upsertAnswer(
  assessmentId: number,
  questionId: string,
  score: number,
  notes?: string,
) {
  await db
    .insert(answers)
    .values({
      assessmentId,
      questionId,
      score,
      notes: notes || null,
    })
    .onConflictDoUpdate({
      target: [answers.assessmentId, answers.questionId],
      set: {
        score,
        notes: notes || null,
        createdAt: new Date().toISOString(),
      },
    });
}

/** Get SRA theme scores for an assessment */
export async function getSraScores(assessmentId: number) {
  return db
    .select()
    .from(sraScores)
    .where(eq(sraScores.assessmentId, assessmentId));
}

/** Save SEAL results (overall score + per-category scores) */
export async function saveResults(
  assessmentId: number,
  overallScore: number,
  sealLevel: number,
  categoryScores: { sovCategory: string; avgScore: number; sealLevel: number }[],
) {
  await db
    .update(assessments)
    .set({
      overallScore,
      sealLevel,
      status: 'completed',
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    })
    .where(eq(assessments.id, assessmentId));

  // Delete existing scores and re-insert
  await db
    .delete(sovScores)
    .where(eq(sovScores.assessmentId, assessmentId));

  if (categoryScores.length > 0) {
    await db.insert(sovScores).values(
      categoryScores.map((s) => ({
        assessmentId,
        sovCategory: s.sovCategory,
        avgScore: s.avgScore,
        sealLevel: s.sealLevel,
      })),
    );
  }
}

/** Save SRA results (overall score + per-theme scores) */
export async function saveSraResults(
  assessmentId: number,
  overallScore: number,
  sraLevel: number,
  themeScores: { theme: string; avgScore: number; sraLevel: number }[],
) {
  await db
    .update(assessments)
    .set({
      overallScore,
      sealLevel: sraLevel, // reuse column for both track levels
      status: 'completed',
      updatedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    })
    .where(eq(assessments.id, assessmentId));

  // Delete existing scores and re-insert
  await db
    .delete(sraScores)
    .where(eq(sraScores.assessmentId, assessmentId));

  if (themeScores.length > 0) {
    await db.insert(sraScores).values(
      themeScores.map((s) => ({
        assessmentId,
        theme: s.theme,
        avgScore: s.avgScore,
        sraLevel: s.sraLevel,
      })),
    );
  }
}
