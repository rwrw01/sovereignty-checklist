import { test, expect } from '@playwright/test';
import {
  createAssessmentViaApi,
  submitSealAnswers,
  finalizeAssessment,
} from './helpers';

test.describe('SEAL assessment — happy flow (API)', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const { body } = await createAssessmentViaApi(request, {
      assessmentType: 'seal',
      companyName: 'SEAL Happy BV',
    });
    token = body.token;
  });

  test('GET assessment returns draft status', async ({ request }) => {
    const res = await request.get(`/api/v1/assessments/${token}`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.assessment.status).toBe('draft');
    expect(body.assessment.assessmentType).toBe('seal');
  });

  test('PUT answers saves and transitions to in_progress', async ({ request }) => {
    const res = await submitSealAnswers(request, token, 3);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.saved).toBe(32);

    // Verify status changed
    const statusRes = await request.get(`/api/v1/assessments/${token}`);
    const statusBody = await statusRes.json();
    expect(statusBody.assessment.status).toBe('in_progress');
  });

  test('POST finalize calculates SEAL scores', async ({ request }) => {
    const res = await finalizeAssessment(request, token);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.result.overallScore).toBeGreaterThan(0);
    expect(body.result.overallSealLevel).toBeGreaterThanOrEqual(0);
    expect(body.result.sovScores).toHaveLength(8);
    expect(body.redirectUrl).toContain('/result');
  });

  test('GET results returns completed data', async ({ request }) => {
    const res = await request.get(`/api/v1/assessments/${token}/results`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.assessment.assessmentType).toBe('seal');
    expect(body.assessment.overallScore).toBeGreaterThan(0);
    expect(body.sovScores).toHaveLength(8);
    expect(body.totalAnswers).toBe(32);
  });

  test('GET PDF returns valid response', async ({ request }) => {
    const res = await request.get(`/api/v1/reports/${token}/pdf`);
    expect(res.status()).toBe(200);
    const contentType = res.headers()['content-type'];
    expect(contentType).toContain('application/pdf');
    const disposition = res.headers()['content-disposition'];
    expect(disposition).toContain('soevereiniteitsrapport-');
  });
});

test.describe('SEAL assessment — unhappy flows (API)', () => {
  test('GET with invalid token returns 400', async ({ request }) => {
    const res = await request.get('/api/v1/assessments/not-a-uuid');
    expect(res.status()).toBe(400);
  });

  test('GET with nonexistent UUID returns 404', async ({ request }) => {
    const res = await request.get(
      '/api/v1/assessments/00000000-0000-4000-8000-000000000000',
    );
    expect(res.status()).toBe(404);
  });

  test('PUT answers to completed assessment returns 409', async ({ request }) => {
    // Create and complete an assessment
    const { token } = await createAssessmentViaApi(request, {
      companyName: 'Already Done BV',
    });
    await submitSealAnswers(request, token);
    await finalizeAssessment(request, token);

    // Try to add more answers
    const res = await request.put(`/api/v1/assessments/${token}/answers`, {
      data: { answers: [{ questionId: 'sov1_q1', score: 4 }] },
    });
    expect(res.status()).toBe(409);
  });

  test('POST finalize on already completed returns 409', async ({ request }) => {
    const { token } = await createAssessmentViaApi(request, {
      companyName: 'Double Finalize BV',
    });
    await submitSealAnswers(request, token);
    await finalizeAssessment(request, token);

    const res = await finalizeAssessment(request, token);
    expect(res.status()).toBe(409);
  });

  test('POST finalize with no answers returns 400', async ({ request }) => {
    const { token } = await createAssessmentViaApi(request, {
      companyName: 'No Answers BV',
    });
    const res = await finalizeAssessment(request, token);
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Geen antwoorden');
  });

  test('PUT with invalid question ID returns 400', async ({ request }) => {
    const { token } = await createAssessmentViaApi(request, {
      companyName: 'Bad Question BV',
    });
    const res = await request.put(`/api/v1/assessments/${token}/answers`, {
      data: { answers: [{ questionId: 'invalid_q99', score: 3 }] },
    });
    expect(res.status()).toBe(400);
  });

  test('PUT with score out of range returns 400', async ({ request }) => {
    const { token } = await createAssessmentViaApi(request, {
      companyName: 'Bad Score BV',
    });
    const res = await request.put(`/api/v1/assessments/${token}/answers`, {
      data: { answers: [{ questionId: 'sov1_q1', score: 5 }] },
    });
    expect(res.status()).toBe(400);
  });

  test('PUT with negative score returns 400', async ({ request }) => {
    const { token } = await createAssessmentViaApi(request, {
      companyName: 'Negative Score BV',
    });
    const res = await request.put(`/api/v1/assessments/${token}/answers`, {
      data: { answers: [{ questionId: 'sov1_q1', score: -1 }] },
    });
    expect(res.status()).toBe(400);
  });

  test('GET results for draft assessment returns 400', async ({ request }) => {
    const { token } = await createAssessmentViaApi(request, {
      companyName: 'Draft Results BV',
    });
    const res = await request.get(`/api/v1/assessments/${token}/results`);
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.status).toBe('draft');
  });

  test('GET PDF for nonexistent token returns 404', async ({ request }) => {
    const res = await request.get(
      '/api/v1/reports/00000000-0000-4000-8000-000000000000/pdf',
    );
    expect(res.status()).toBe(404);
  });

  test('answer upsert updates existing answer', async ({ request }) => {
    const { token } = await createAssessmentViaApi(request, {
      companyName: 'Upsert Test BV',
    });
    // First save with score 2
    await request.put(`/api/v1/assessments/${token}/answers`, {
      data: { answers: [{ questionId: 'sov1_q1', score: 2 }] },
    });
    // Update to score 4
    await request.put(`/api/v1/assessments/${token}/answers`, {
      data: { answers: [{ questionId: 'sov1_q1', score: 4 }] },
    });

    const res = await request.get(`/api/v1/assessments/${token}`);
    const body = await res.json();
    const answer = body.answers.find(
      (a: { questionId: string }) => a.questionId === 'sov1_q1',
    );
    expect(answer.score).toBe(4);
  });
});
