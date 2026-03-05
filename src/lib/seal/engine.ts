import type {
  Answer,
  AssessmentResult,
  CriticalFlag,
  SealLevel,
  SovCategory,
  SovScore,
} from './types';
import { SOV_CATEGORIES, SOV_WEIGHTS } from './weights';

/**
 * Calculate the average score for a single SOV category.
 * Returns 0 if no answers exist for the category.
 */
export function calculateSovScore(
  answers: Answer[],
  category: SovCategory,
): number {
  const categoryAnswers = answers.filter((a) =>
    a.questionId.startsWith(category),
  );
  if (categoryAnswers.length === 0) return 0;
  const sum = categoryAnswers.reduce((acc, a) => acc + a.score, 0);
  return sum / categoryAnswers.length;
}

/**
 * Convert a raw average score (0-4) to a discrete SEAL level.
 * Uses standard rounding: < 0.5 → 0, 0.5-1.5 → 1, etc.
 */
export function toSealLevel(score: number): SealLevel {
  if (score < 0.5) return 0;
  if (score < 1.5) return 1;
  if (score < 2.5) return 2;
  if (score < 3.5) return 3;
  return 4;
}

/**
 * Calculate the weighted overall sovereignty score as a percentage (0-100).
 * Formula: Σ(category_avg × weight) / max_score(4) × 100
 */
export function calculateOverallScore(
  sovScores: Record<SovCategory, number>,
): number {
  let weighted = 0;
  for (const category of SOV_CATEGORIES) {
    const score = sovScores[category] ?? 0;
    const weight = SOV_WEIGHTS[category].weight;
    weighted += score * weight;
  }
  // Max possible weighted score = 4 × 1.0 = 4
  return (weighted / 4) * 100;
}

/**
 * Detect critical flags: any SOV category scoring below SEAL-3 (avg < 2.5).
 * These require immediate attention per EU SEAL framework guidelines.
 */
export function detectCriticalFlags(
  sovScores: Record<SovCategory, number>,
): CriticalFlag[] {
  const flags: CriticalFlag[] = [];
  for (const category of SOV_CATEGORIES) {
    const score = sovScores[category] ?? 0;
    if (score < 2.5) {
      const config = SOV_WEIGHTS[category];
      flags.push({
        category,
        categoryName: config.nameNl,
        avgScore: score,
        message: `${config.nameNl} scoort SEAL-${toSealLevel(score)}: directe aandacht vereist`,
      });
    }
  }
  return flags;
}

/**
 * Calculate the full assessment result from a set of answers.
 * This is the main entry point for the SEAL calculation engine.
 */
export function calculateAssessment(answers: Answer[]): AssessmentResult {
  const sovScoreMap = {} as Record<SovCategory, number>;
  const sovScores: SovScore[] = [];

  for (const category of SOV_CATEGORIES) {
    const avgScore = calculateSovScore(answers, category);
    sovScoreMap[category] = avgScore;
    sovScores.push({
      category,
      avgScore,
      sealLevel: toSealLevel(avgScore),
    });
  }

  const overallScore = calculateOverallScore(sovScoreMap);
  const overallSealLevel = toSealLevel((overallScore / 100) * 4);
  const criticalFlags = detectCriticalFlags(sovScoreMap);

  return {
    overallScore,
    overallSealLevel,
    sovScores,
    criticalFlags,
  };
}
