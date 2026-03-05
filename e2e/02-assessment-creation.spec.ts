import { test, expect } from '@playwright/test';

test.describe('Assessment creation — API validation', () => {
  test('rejects empty body', async ({ request }) => {
    const res = await request.post('/api/v1/assessments', {
      data: {},
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Validatiefout');
  });

  test('rejects missing companyName', async ({ request }) => {
    const res = await request.post('/api/v1/assessments', {
      data: {
        assessmentType: 'seal',
        contactName: 'Test',
        contactEmail: 'test@test.nl',
      },
    });
    expect(res.status()).toBe(400);
  });

  test('rejects invalid email', async ({ request }) => {
    const res = await request.post('/api/v1/assessments', {
      data: {
        assessmentType: 'seal',
        companyName: 'Test BV',
        contactName: 'Test',
        contactEmail: 'not-an-email',
      },
    });
    expect(res.status()).toBe(400);
  });

  test('rejects invalid assessmentType', async ({ request }) => {
    const res = await request.post('/api/v1/assessments', {
      data: {
        assessmentType: 'invalid',
        companyName: 'Test BV',
        contactName: 'Test',
        contactEmail: 'test@test.nl',
      },
    });
    expect(res.status()).toBe(400);
  });

  test('rejects too-short companyName', async ({ request }) => {
    const res = await request.post('/api/v1/assessments', {
      data: {
        assessmentType: 'seal',
        companyName: 'X', // min 2
        contactName: 'Test',
        contactEmail: 'test@test.nl',
      },
    });
    expect(res.status()).toBe(400);
  });

  test('creates SEAL assessment with valid data', async ({ request }) => {
    const res = await request.post('/api/v1/assessments', {
      data: {
        assessmentType: 'seal',
        companyName: 'Validatie Test BV',
        contactName: 'Test User',
        contactEmail: 'valid@test.nl',
      },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.token).toBeTruthy();
    expect(body.redirectUrl).toContain('/assessment/');
  });

  test('creates SRA assessment with valid data', async ({ request }) => {
    const res = await request.post('/api/v1/assessments', {
      data: {
        assessmentType: 'sra',
        companyName: 'SRA Test BV',
        contactName: 'SRA Tester',
        contactEmail: 'sra@test.nl',
        sector: 'zorg',
      },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.token).toBeTruthy();
  });

  test('rejects invalid sector value', async ({ request }) => {
    const res = await request.post('/api/v1/assessments', {
      data: {
        assessmentType: 'seal',
        companyName: 'Sector Test BV',
        contactName: 'Test',
        contactEmail: 'test@test.nl',
        sector: 'nonexistent',
      },
    });
    expect(res.status()).toBe(400);
  });
});

test.describe('Assessment creation — UI flow', () => {
  test('SEAL form shows correct fields and submits', async ({ page }) => {
    await page.goto('/assessment/new?type=seal');
    await expect(page.getByRole('heading', { name: 'SEAL Quick-Scan' })).toBeVisible();

    await page.fill('input[name="companyName"]', 'UI Test BV');
    await page.fill('input[name="contactName"]', 'UI Tester');
    await page.fill('input[name="contactEmail"]', 'ui@test.nl');

    await page.click('button[type="submit"]');
    // Should redirect to questionnaire
    await page.waitForURL(/\/assessment\/[a-f0-9-]+$/);
  });

  test('SRA form shows correct fields and submits', async ({ page }) => {
    await page.goto('/assessment/new?type=sra');
    await expect(page.locator('text=SRA Assessment')).toBeVisible();

    await page.fill('input[name="companyName"]', 'SRA UI Test BV');
    await page.fill('input[name="contactName"]', 'SRA UI Tester');
    await page.fill('input[name="contactEmail"]', 'sra-ui@test.nl');

    await page.click('button[type="submit"]');
    await page.waitForURL(/\/assessment\/[a-f0-9-]+$/);
  });

  test('form shows validation errors for empty fields', async ({ page }) => {
    await page.goto('/assessment/new?type=seal');
    await page.click('button[type="submit"]');
    // Should show error message (form does not submit without required fields)
    await expect(page).toHaveURL(/\/assessment\/new/);
  });
});
