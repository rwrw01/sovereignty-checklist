import { test, expect } from '@playwright/test';

test.describe('Admin — seed endpoint', () => {
  test('seed returns 403 when admin already exists', async ({ request }) => {
    // Admin was already seeded in a previous session.
    // When admins exist, seed always returns 403 regardless of input.
    const res = await request.post('/api/v1/admin/seed', {
      data: { username: 'newadmin', password: 'ValidPassword2026!!' },
    });
    expect(res.status()).toBe(403);
    const body = await res.json();
    expect(body.error).toContain('niet meer beschikbaar');
  });

  test('seed endpoint is idempotent-safe (repeated calls blocked)', async ({
    request,
  }) => {
    const res = await request.post('/api/v1/admin/seed', {
      data: { username: 'anotheradmin', password: 'AnotherPass2026!!' },
    });
    expect(res.status()).toBe(403);
  });
});

test.describe('Admin — auth flow (API)', () => {
  test('login with wrong credentials returns 401', async ({ request }) => {
    const res = await request.post('/api/v1/admin/auth', {
      data: { username: 'nonexistent', password: 'WrongPassword2026!!' },
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.error).toContain('Ongeldige');
  });

  test('login with too-short username returns 400', async ({ request }) => {
    const res = await request.post('/api/v1/admin/auth', {
      data: { username: 'ab', password: 'ValidPassword2026!!' },
    });
    expect(res.status()).toBe(400);
  });

  test('login with too-short password returns 400', async ({ request }) => {
    const res = await request.post('/api/v1/admin/auth', {
      data: { username: 'admin', password: 'short' },
    });
    expect(res.status()).toBe(400);
  });

  test('GET /admin/auth without session returns 401', async ({ request }) => {
    const res = await request.get('/api/v1/admin/auth');
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.authenticated).toBe(false);
  });

  test('GET /admin/assessments without session returns 401', async ({
    request,
  }) => {
    const res = await request.get('/api/v1/admin/assessments');
    expect(res.status()).toBe(401);
  });
});

test.describe('Admin — login page UI', () => {
  test('shows login form', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.locator('input[name="username"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('shows error with wrong credentials', async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('input[name="username"]', 'wronguser');
    await page.fill('input[name="password"]', 'WrongPassword2026!!');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Ongeldige')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Admin — dashboard access', () => {
  test('redirects to login when not authenticated', async ({ page }) => {
    await page.goto('/admin');
    await page.waitForURL(/\/admin\/login/, { timeout: 5000 });
  });
});
