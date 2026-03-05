import { test, expect } from '@playwright/test';

test.describe('Landing page', () => {
  test('shows both SEAL and SRA track cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'SEAL Quick-Scan' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Soevereiniteits Gereedheids Assessment' })).toBeVisible();
  });

  test('SEAL card links to /assessment/new?type=seal', async ({ page }) => {
    await page.goto('/');
    const sealLink = page.locator('a[href="/assessment/new?type=seal"]');
    await expect(sealLink).toBeVisible();
  });

  test('SRA card links to /assessment/new?type=sra', async ({ page }) => {
    await page.goto('/');
    const sraLink = page.locator('a[href="/assessment/new?type=sra"]');
    await expect(sraLink).toBeVisible();
  });
});
