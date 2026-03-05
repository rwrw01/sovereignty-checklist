import { type APIRequestContext } from '@playwright/test';

/**
 * Helper to create an assessment via API and return the token.
 */
export async function createAssessmentViaApi(
  request: APIRequestContext,
  overrides: Record<string, unknown> = {},
) {
  const payload = {
    assessmentType: 'seal',
    companyName: 'E2E Test BV',
    contactName: 'Test User',
    contactEmail: 'test@e2e.nl',
    sector: 'overig',
    ...overrides,
  };

  const res = await request.post('/api/v1/assessments', { data: payload });
  const body = await res.json();
  return { res, body, token: body.token as string };
}

/**
 * Submit all SEAL answers (32 questions, all score 3) via API.
 */
export async function submitSealAnswers(
  request: APIRequestContext,
  token: string,
  score = 3,
) {
  const answers = [];
  for (let cat = 1; cat <= 8; cat++) {
    for (let q = 1; q <= 4; q++) {
      answers.push({ questionId: `sov${cat}_q${q}`, score });
    }
  }
  return request.put(`/api/v1/assessments/${token}/answers`, {
    data: { answers },
  });
}

/**
 * Submit all SRA answers (36 questions, all score 3) via API.
 */
export async function submitSraAnswers(
  request: APIRequestContext,
  token: string,
  score = 3,
) {
  const themes = [
    'bewustzijn', 'governance', 'risicoanalyse', 'afhankelijkheden',
    'communicatie', 'leveranciers', 'incident', 'compliance', 'monitoring',
  ];
  const answers = [];
  for (const theme of themes) {
    for (let q = 1; q <= 4; q++) {
      answers.push({ questionId: `${theme}_q${q}`, score });
    }
  }
  return request.put(`/api/v1/assessments/${token}/answers`, {
    data: { answers },
  });
}

/**
 * Finalize an assessment via API.
 */
export async function finalizeAssessment(
  request: APIRequestContext,
  token: string,
) {
  return request.post(`/api/v1/assessments/${token}/answers`, {
    data: { answers: [] },
  });
}

/**
 * Seed admin user via API (one-time).
 */
export async function seedAdmin(
  request: APIRequestContext,
  username = 'e2eadmin',
  password = 'E2eTestPass2026!!',
) {
  return request.post('/api/v1/admin/seed', {
    data: { username, password },
  });
}

/**
 * Login as admin and return the response (which sets a session cookie).
 */
export async function loginAdmin(
  request: APIRequestContext,
  username = 'e2eadmin',
  password = 'E2eTestPass2026!!',
) {
  return request.post('/api/v1/admin/auth', {
    data: { username, password },
  });
}
