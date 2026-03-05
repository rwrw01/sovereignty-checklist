import { describe, it, expect } from 'vitest';
import {
  calculateSovScore,
  calculateOverallScore,
  toSealLevel,
  detectCriticalFlags,
  calculateAssessment,
  QUESTIONS,
  TOTAL_QUESTIONS,
  SOV_WEIGHTS,
  SOV_CATEGORIES,
} from '@/lib/seal';
import type { Answer, SovCategory } from '@/lib/seal';

describe('SEAL Engine', () => {
  describe('toSealLevel', () => {
    it('converts scores to correct SEAL levels', () => {
      expect(toSealLevel(0)).toBe(0);
      expect(toSealLevel(0.4)).toBe(0);
      expect(toSealLevel(0.5)).toBe(1);
      expect(toSealLevel(1.0)).toBe(1);
      expect(toSealLevel(1.5)).toBe(2);
      expect(toSealLevel(2.0)).toBe(2);
      expect(toSealLevel(2.5)).toBe(3);
      expect(toSealLevel(3.0)).toBe(3);
      expect(toSealLevel(3.5)).toBe(4);
      expect(toSealLevel(4.0)).toBe(4);
    });
  });

  describe('calculateSovScore', () => {
    it('returns 0 for no answers', () => {
      expect(calculateSovScore([], 'sov1')).toBe(0);
    });

    it('calculates average for single category', () => {
      const answers: Answer[] = [
        { questionId: 'sov1_q1', score: 4 },
        { questionId: 'sov1_q2', score: 2 },
        { questionId: 'sov1_q3', score: 3 },
        { questionId: 'sov1_q4', score: 3 },
      ];
      expect(calculateSovScore(answers, 'sov1')).toBe(3); // (4+2+3+3)/4
    });

    it('ignores answers from other categories', () => {
      const answers: Answer[] = [
        { questionId: 'sov1_q1', score: 4 },
        { questionId: 'sov2_q1', score: 0 },
      ];
      expect(calculateSovScore(answers, 'sov1')).toBe(4);
      expect(calculateSovScore(answers, 'sov2')).toBe(0);
    });
  });

  describe('calculateOverallScore', () => {
    it('returns 0 for all-zero scores', () => {
      const scores = Object.fromEntries(
        SOV_CATEGORIES.map((c) => [c, 0]),
      ) as Record<SovCategory, number>;
      expect(calculateOverallScore(scores)).toBe(0);
    });

    it('returns 100 for all-four scores', () => {
      const scores = Object.fromEntries(
        SOV_CATEGORIES.map((c) => [c, 4]),
      ) as Record<SovCategory, number>;
      expect(calculateOverallScore(scores)).toBe(100);
    });

    it('correctly applies weights', () => {
      // Only SOV-5 (weight 0.20) scores 4, rest 0
      const scores = Object.fromEntries(
        SOV_CATEGORIES.map((c) => [c, 0]),
      ) as Record<SovCategory, number>;
      scores.sov5 = 4;
      // Expected: (4 × 0.20) / 4 × 100 = 20%
      expect(calculateOverallScore(scores)).toBe(20);
    });

    it('weights sum to 1.0', () => {
      const totalWeight = SOV_CATEGORIES.reduce(
        (sum, c) => sum + SOV_WEIGHTS[c].weight,
        0,
      );
      expect(totalWeight).toBeCloseTo(1.0);
    });
  });

  describe('detectCriticalFlags', () => {
    it('returns no flags when all scores >= 2.5', () => {
      const scores = Object.fromEntries(
        SOV_CATEGORIES.map((c) => [c, 3]),
      ) as Record<SovCategory, number>;
      expect(detectCriticalFlags(scores)).toHaveLength(0);
    });

    it('flags categories scoring below 2.5', () => {
      const scores = Object.fromEntries(
        SOV_CATEGORIES.map((c) => [c, 4]),
      ) as Record<SovCategory, number>;
      scores.sov2 = 1.5;
      scores.sov5 = 2.0;
      const flags = detectCriticalFlags(scores);
      expect(flags).toHaveLength(2);
      expect(flags[0].category).toBe('sov2');
      expect(flags[1].category).toBe('sov5');
    });
  });

  describe('calculateAssessment', () => {
    it('calculates full assessment from answers', () => {
      // All answers score 3 → each SOV avg = 3, overall = 75%
      const answers: Answer[] = QUESTIONS.map((q) => ({
        questionId: q.id,
        score: 3 as const,
      }));

      const result = calculateAssessment(answers);
      expect(result.overallScore).toBeCloseTo(75, 10);
      expect(result.overallSealLevel).toBe(3);
      expect(result.sovScores).toHaveLength(8);
      expect(result.criticalFlags).toHaveLength(0);
      result.sovScores.forEach((s) => {
        expect(s.avgScore).toBe(3);
        expect(s.sealLevel).toBe(3);
      });
    });

    it('detects critical flags in mixed assessment', () => {
      const answers: Answer[] = QUESTIONS.map((q) => ({
        questionId: q.id,
        score: q.category === 'sov2' ? (1 as const) : (4 as const),
      }));

      const result = calculateAssessment(answers);
      expect(result.criticalFlags).toHaveLength(1);
      expect(result.criticalFlags[0].category).toBe('sov2');
    });
  });

  describe('Questions data integrity', () => {
    it('has exactly 32 questions', () => {
      expect(TOTAL_QUESTIONS).toBe(32);
    });

    it('has exactly 4 questions per category', () => {
      for (const cat of SOV_CATEGORIES) {
        const count = QUESTIONS.filter((q) => q.category === cat).length;
        expect(count).toBe(4);
      }
    });

    it('each question has exactly 5 level descriptions', () => {
      for (const q of QUESTIONS) {
        expect(q.levels).toHaveLength(5);
        expect(q.levels.map((l) => l.level)).toEqual([0, 1, 2, 3, 4]);
      }
    });

    it('all question IDs are unique', () => {
      const ids = QUESTIONS.map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });
});
