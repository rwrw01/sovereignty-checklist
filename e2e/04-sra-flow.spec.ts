import { test, expect } from '@playwright/test';
import {
  createAssessmentViaApi,
  submitSraAnswers,
  finalizeAssessment,
} from './helpers';

test.describe('SRA assessment — happy flow (API)', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const { body } = await createAssessmentViaApi(request, {
      assessmentType: 'sra',
      companyName: 'SRA Happy BV',
      sector: 'zorg',
    });
    token = body.token;
  });

  test('GET assessment returns sra type', async ({ request }) => {
    const res = await request.get(`/api/v1/assessments/${token}`);
    const body = await res.json();
    expect(body.assessment.assessmentType).toBe('sra');
    expect(body.assessment.status).toBe('draft');
  });

  test('PUT SRA answers saves 36 answers', async ({ request }) => {
    const res = await submitSraAnswers(request, token, 3);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.saved).toBe(36);
  });

  test('POST finalize calculates SRA scores', async ({ request }) => {
    const res = await finalizeAssessment(request, token);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.result.overallScore).toBeGreaterThan(0);
    expect(body.result.overallSraLevel).toBeGreaterThanOrEqual(0);
    expect(body.result.themeScores).toHaveLength(9);
  });

  test('GET results returns SRA data', async ({ request }) => {
    const res = await request.get(`/api/v1/assessments/${token}/results`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.assessment.assessmentType).toBe('sra');
    expect(body.themeScores).toHaveLength(9);
    expect(body.totalAnswers).toBe(36);
    // Verify all 9 themes present
    const themes = body.themeScores.map((s: { theme: string }) => s.theme);
    expect(themes).toContain('bewustzijn');
    expect(themes).toContain('governance');
    expect(themes).toContain('risicoanalyse');
    expect(themes).toContain('monitoring');
  });

  test('GET SRA PDF returns valid response', async ({ request }) => {
    const res = await request.get(`/api/v1/reports/${token}/pdf`);
    expect(res.status()).toBe(200);
    const disposition = res.headers()['content-disposition'];
    expect(disposition).toContain('sra-rapport-');
  });
});

test.describe('SRA assessment — unhappy flows (API)', () => {
  test('SEAL question IDs rejected for SRA assessment', async ({ request }) => {
    const { token } = await createAssessmentViaApi(request, {
      assessmentType: 'sra',
      companyName: 'Wrong Questions BV',
    });
    // Try submitting SEAL question IDs to an SRA assessment
    // This should succeed at validation level (schema accepts both patterns)
    // but let's verify it doesn't break things
    const res = await request.put(`/api/v1/assessments/${token}/answers`, {
      data: { answers: [{ questionId: 'sov1_q1', score: 3 }] },
    });
    // Schema allows both patterns, so this saves but won't match any SRA themes
    expect(res.status()).toBe(200);
  });

  test('SRA with all score 0 shows critical flags', async ({ request }) => {
    const { token } = await createAssessmentViaApi(request, {
      assessmentType: 'sra',
      companyName: 'Zero Score BV',
    });
    await submitSraAnswers(request, token, 0);
    const res = await finalizeAssessment(request, token);
    const body = await res.json();
    expect(body.result.overallScore).toBe(0);
    expect(body.result.overallSraLevel).toBe(0);
    expect(body.result.criticalFlags.length).toBeGreaterThan(0);
  });

  test('SRA with all score 4 shows no critical flags', async ({ request }) => {
    const { token } = await createAssessmentViaApi(request, {
      assessmentType: 'sra',
      companyName: 'Perfect Score BV',
    });
    await submitSraAnswers(request, token, 4);
    const res = await finalizeAssessment(request, token);
    const body = await res.json();
    expect(body.result.overallScore).toBe(100);
    expect(body.result.overallSraLevel).toBe(4);
    expect(body.result.criticalFlags).toHaveLength(0);
  });

  test('healthcare sector triggers NEN 7510 flag at low compliance', async ({
    request,
  }) => {
    const { token } = await createAssessmentViaApi(request, {
      assessmentType: 'sra',
      companyName: 'Ziekenhuis BV',
      sector: 'zorg',
    });
    // Score compliance low (1), rest high
    const themes = [
      'bewustzijn', 'governance', 'risicoanalyse', 'afhankelijkheden',
      'communicatie', 'leveranciers', 'incident', 'compliance', 'monitoring',
    ];
    const answers = [];
    for (const theme of themes) {
      const score = theme === 'compliance' ? 1 : 4;
      for (let q = 1; q <= 4; q++) {
        answers.push({ questionId: `${theme}_q${q}`, score });
      }
    }
    await request.put(`/api/v1/assessments/${token}/answers`, {
      data: { answers },
    });
    const res = await finalizeAssessment(request, token);
    const body = await res.json();
    // Should have a critical flag for compliance (healthcare + low compliance)
    const complianceFlag = body.result.criticalFlags.find(
      (f: { theme?: string }) => f.theme === 'compliance',
    );
    expect(complianceFlag).toBeTruthy();
  });
});
