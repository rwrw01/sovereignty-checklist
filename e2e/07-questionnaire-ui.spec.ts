import { test, expect } from '@playwright/test';
import {
  createAssessmentViaApi,
  submitSealAnswers,
  finalizeAssessment,
} from './helpers';

test.describe('Questionnaire UI — SEAL', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const { body } = await createAssessmentViaApi(request, {
      assessmentType: 'seal',
      companyName: 'SEAL Questionnaire UI BV',
    });
    token = body.token;
  });

  test('loads questionnaire with first step', async ({ page }) => {
    await page.goto(`/assessment/${token}`);
    // Should show the questionnaire page with questions
    await expect(page.locator('text=SEAL Questionnaire UI BV')).toBeVisible({
      timeout: 10000,
    });
  });

  test('shows navigation buttons', async ({ page }) => {
    await page.goto(`/assessment/${token}`);
    await page.waitForTimeout(2000);
    // Should have next/vorige buttons after questions load
    const nextBtn = page.locator('button:has-text("Volgende")');
    const isVisible = await nextBtn.isVisible().catch(() => false);
    // First step should have a "Volgende" or similar button
    expect(isVisible).toBeTruthy();
  });
});

test.describe('Questionnaire UI — completed assessment redirect', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const { body } = await createAssessmentViaApi(request, {
      assessmentType: 'seal',
      companyName: 'Completed Redirect BV',
    });
    token = body.token;
    await submitSealAnswers(request, token, 3);
    await finalizeAssessment(request, token);
  });

  test('accessing completed assessment questionnaire redirects to results', async ({
    page,
  }) => {
    await page.goto(`/assessment/${token}`);
    // Should redirect to results page
    await page.waitForURL(/\/result$/, { timeout: 10000 });
    expect(page.url()).toContain('/result');
  });
});

test.describe('Questionnaire UI — SRA', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const { body } = await createAssessmentViaApi(request, {
      assessmentType: 'sra',
      companyName: 'SRA Questionnaire UI BV',
    });
    token = body.token;
  });

  test('loads SRA questionnaire', async ({ page }) => {
    await page.goto(`/assessment/${token}`);
    await expect(page.locator('text=SRA Questionnaire UI BV')).toBeVisible({
      timeout: 10000,
    });
  });
});
