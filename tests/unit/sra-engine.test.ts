import { describe, it, expect } from 'vitest';
import {
  calculateThemeScore,
  toSraLevel,
  calculateOverallSraScore,
  detectSraCriticalFlags,
  calculateSraAssessment,
} from '@/lib/sra/engine';
import { SRA_THEMES, SRA_WEIGHTS } from '@/lib/sra/weights';
import { SRA_QUESTIONS, SRA_TOTAL_QUESTIONS, getSraQuestionsByTheme } from '@/lib/sra/questions';
import type { SraAnswer, SraTheme } from '@/lib/sra/types';

describe('SRA Engine', () => {
  describe('toSraLevel', () => {
    it('converts scores to correct maturity levels', () => {
      expect(toSraLevel(0)).toBe(0);
      expect(toSraLevel(0.4)).toBe(0);
      expect(toSraLevel(0.5)).toBe(1);
      expect(toSraLevel(1.0)).toBe(1);
      expect(toSraLevel(1.5)).toBe(2);
      expect(toSraLevel(2.5)).toBe(3);
      expect(toSraLevel(3.5)).toBe(4);
      expect(toSraLevel(4.0)).toBe(4);
    });
  });

  describe('calculateThemeScore', () => {
    it('returns 0 for empty answers', () => {
      expect(calculateThemeScore([], 'bewustzijn')).toBe(0);
    });

    it('calculates average for a theme', () => {
      const answers: SraAnswer[] = [
        { questionId: 'bewustzijn_q1', score: 2 },
        { questionId: 'bewustzijn_q2', score: 4 },
        { questionId: 'bewustzijn_q3', score: 2 },
        { questionId: 'bewustzijn_q4', score: 4 },
      ];
      expect(calculateThemeScore(answers, 'bewustzijn')).toBe(3);
    });

    it('ignores answers from other themes', () => {
      const answers: SraAnswer[] = [
        { questionId: 'bewustzijn_q1', score: 4 },
        { questionId: 'governance_q1', score: 0 },
      ];
      expect(calculateThemeScore(answers, 'bewustzijn')).toBe(4);
    });
  });

  describe('calculateOverallSraScore', () => {
    it('returns 0 for all-zero scores', () => {
      const scores = Object.fromEntries(
        SRA_THEMES.map((t) => [t, 0]),
      ) as Record<SraTheme, number>;
      expect(calculateOverallSraScore(scores)).toBe(0);
    });

    it('returns 100 for all-four scores', () => {
      const scores = Object.fromEntries(
        SRA_THEMES.map((t) => [t, 4]),
      ) as Record<SraTheme, number>;
      expect(calculateOverallSraScore(scores)).toBeCloseTo(100, 10);
    });

    it('weights sum to 1.0', () => {
      const sum = SRA_THEMES.reduce(
        (acc, t) => acc + SRA_WEIGHTS[t].weight,
        0,
      );
      expect(sum).toBeCloseTo(1.0, 10);
    });
  });

  describe('detectSraCriticalFlags', () => {
    it('flags themes scoring <= 1.0 as critical', () => {
      const scores = Object.fromEntries(
        SRA_THEMES.map((t) => [t, 3]),
      ) as Record<SraTheme, number>;
      scores.risicoanalyse = 0.5;

      const flags = detectSraCriticalFlags(scores);
      expect(flags.length).toBeGreaterThanOrEqual(1);
      expect(flags.some((f) => f.theme === 'risicoanalyse')).toBe(true);
    });

    it('generates sector-specific flags for zorg', () => {
      const scores = Object.fromEntries(
        SRA_THEMES.map((t) => [t, 3]),
      ) as Record<SraTheme, number>;
      scores.compliance = 1.0;

      const flags = detectSraCriticalFlags(scores, 'zorg');
      expect(flags.some((f) => f.message.includes('NEN 7510'))).toBe(true);
    });

    it('returns empty for high-scoring assessment', () => {
      const scores = Object.fromEntries(
        SRA_THEMES.map((t) => [t, 3.5]),
      ) as Record<SraTheme, number>;
      const flags = detectSraCriticalFlags(scores);
      expect(flags.length).toBe(0);
    });
  });

  describe('calculateSraAssessment', () => {
    it('calculates full assessment', () => {
      const answers: SraAnswer[] = SRA_QUESTIONS.map((q) => ({
        questionId: q.id,
        score: 3 as const,
      }));

      const result = calculateSraAssessment(answers);
      expect(result.overallSraLevel).toBe(3);
      expect(result.overallScore).toBeCloseTo(75, 10);
      expect(result.themeScores.length).toBe(SRA_THEMES.length);
      expect(result.criticalFlags.length).toBe(0);
    });
  });

  describe('SRA Questions data integrity', () => {
    it('has 36 total questions', () => {
      expect(SRA_TOTAL_QUESTIONS).toBe(36);
    });

    it('has 4 questions per theme', () => {
      for (const theme of SRA_THEMES) {
        const questions = getSraQuestionsByTheme(theme);
        expect(questions.length).toBe(4);
      }
    });

    it('each question has exactly 5 maturity levels (0-4)', () => {
      for (const q of SRA_QUESTIONS) {
        expect(q.levels.length).toBe(5);
        expect(q.levels.map((l) => l.level)).toEqual([0, 1, 2, 3, 4]);
      }
    });

    it('all question IDs are unique', () => {
      const ids = SRA_QUESTIONS.map((q) => q.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('all questions have context explaining why it matters', () => {
      for (const q of SRA_QUESTIONS) {
        expect(q.context.length).toBeGreaterThan(20);
      }
    });

    it('has 9 themes', () => {
      expect(SRA_THEMES.length).toBe(9);
    });
  });
});
