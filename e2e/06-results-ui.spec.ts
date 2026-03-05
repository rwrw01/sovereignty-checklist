import { test, expect } from '@playwright/test';
import {
  createAssessmentViaApi,
  submitSealAnswers,
  submitSraAnswers,
  finalizeAssessment,
} from './helpers';

test.describe('SEAL results page — UI', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const { body } = await createAssessmentViaApi(request, {
      assessmentType: 'seal',
      companyName: 'SEAL UI Results BV',
    });
    token = body.token;
    await submitSealAnswers(request, token, 3);
    await finalizeAssessment(request, token);
  });

  test('shows overall score and SEAL level', async ({ page }) => {
    await page.goto(`/assessment/${token}/result`);
    await expect(page.locator('text=Resultaten')).toBeVisible();
    await expect(page.locator('text=SEAL UI Results BV')).toBeVisible();
    await expect(page.locator('text=Overall SEAL Score')).toBeVisible();
    // Score percentage should be visible
    await expect(page.locator('text=75%')).toBeVisible();
  });

  test('shows score table with 8 categories', async ({ page }) => {
    await page.goto(`/assessment/${token}/result`);
    await expect(page.locator('text=Score per Categorie')).toBeVisible();
    // Table should have 8 data rows
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(8);
  });

  test('shows PDF download button', async ({ page }) => {
    await page.goto(`/assessment/${token}/result`);
    const downloadLink = page.locator(`a[href="/api/v1/reports/${token}/pdf"]`);
    await expect(downloadLink).toBeVisible();
  });

  test('has navigation links', async ({ page }) => {
    await page.goto(`/assessment/${token}/result`);
    await expect(page.locator('text=Terug naar Home')).toBeVisible();
    await expect(page.locator('text=Nieuwe Assessment')).toBeVisible();
  });
});

test.describe('SRA results page — UI', () => {
  let token: string;

  test.beforeAll(async ({ request }) => {
    const { body } = await createAssessmentViaApi(request, {
      assessmentType: 'sra',
      companyName: 'SRA UI Results BV',
    });
    token = body.token;
    await submitSraAnswers(request, token, 3);
    await finalizeAssessment(request, token);
  });

  test('shows SRA-specific labels', async ({ page }) => {
    await page.goto(`/assessment/${token}/result`);
    await expect(page.locator('text=SRA UI Results BV')).toBeVisible();
    await expect(page.locator('text=Overall SRA Score')).toBeVisible();
    await expect(page.locator('text=SRA Assessment')).toBeVisible();
  });

  test('shows score table with 9 themes', async ({ page }) => {
    await page.goto(`/assessment/${token}/result`);
    // "Score per Thema" appears in both radar heading and table heading — use table's heading
    await expect(page.getByRole('heading', { name: 'Score per Thema' }).nth(1)).toBeVisible();
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(9);
  });
});

test.describe('Results page — edge cases', () => {
  test('invalid token shows error', async ({ page }) => {
    await page.goto('/assessment/not-a-uuid/result');
    // Should show an error message (red text in the Card)
    await expect(page.locator('.text-red-600')).toBeVisible({ timeout: 5000 });
  });

  test('nonexistent UUID shows error', async ({ page }) => {
    await page.goto(
      '/assessment/00000000-0000-4000-8000-000000000000/result',
    );
    await page.waitForTimeout(2000);
    const hasError = await page.locator('.text-red-600').isVisible().catch(() => false);
    expect(hasError).toBeTruthy();
  });

  test('draft assessment result page redirects to questionnaire', async ({
    page,
    request,
  }) => {
    const { token } = await createAssessmentViaApi(request, {
      companyName: 'Draft Redirect BV',
    });
    await page.goto(`/assessment/${token}/result`);
    // Should redirect back to the assessment page
    await page.waitForURL(/\/assessment\/[a-f0-9-]+$/, { timeout: 5000 });
    expect(page.url()).not.toContain('/result');
  });
});
