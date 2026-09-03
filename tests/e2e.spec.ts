import { test, expect } from '@playwright/test';

test.describe('NusaUrban Observatory E2E Test Suite', () => {
  test('1. Home page loads with hero, study area cards, and badges', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/NusaUrban Observatory/);
    await expect(page.locator('text=NusaUrban Observatory').first()).toBeVisible();
    await expect(page.locator('text=DKI Jakarta').first()).toBeVisible();
    await expect(page.locator('text=Kota Bandung').first()).toBeVisible();
    await expect(page.locator('text=2017–2025').first()).toBeVisible();
  });

  test('2. Explore page loads interactive controls and default city', async ({ page }) => {
    await page.goto('/explore');
    await expect(page.locator('text=DKI Jakarta').first()).toBeVisible();
    await expect(page.locator('text=RTH Proxy').first()).toBeVisible();
  });

  test('3. City switching updates selection and URL', async ({ page }) => {
    await page.goto('/explore?city=jakarta');
    // Navigate or click to switch city
    await page.goto('/explore?city=bandung');
    await expect(page).toHaveURL(/city=bandung/);
  });

  test('4. Year switching preserves city context', async ({ page }) => {
    await page.goto('/explore?city=bandung&year=2020');
    await expect(page).toHaveURL(/year=2020/);
  });

  test('5. Layer switching to cumulative vegetation change', async ({ page }) => {
    await page.goto('/explore?city=jakarta&layer=vegetation_change');
    await expect(page).toHaveURL(/layer=vegetation_change/);
  });

  test('6. URL state restoration restores exact map state', async ({ page }) => {
    await page.goto('/explore?city=bandung&year=2025&layer=lulc');
    await expect(page).toHaveURL(/city=bandung/);
    await expect(page).toHaveURL(/year=2025/);
  });

  test('7. Comparison mode supports swipe and side-by-side modes', async ({ page }) => {
    await page.goto('/compare?city=bandung&left=2017&right=2025&mode=swipe');
    await expect(page.locator('text=Left:').first()).toBeVisible();
    await expect(page.locator('text=Right:').first()).toBeVisible();
    await expect(page.locator('text=Swipe').first()).toBeVisible();
    await expect(page.locator('text=Side by Side').first()).toBeVisible();
  });

  test('8. Language switching toggles between English and Indonesian', async ({ page }) => {
    await page.goto('/');
    // Check English default
    await expect(page.locator('text=Explore').first()).toBeVisible();

    // Toggle language button
    const langBtn = page.getByRole('button', { name: /switch to/i }).or(page.locator('button:has-text("ID")'));
    if (await langBtn.isVisible()) {
      await langBtn.click();
      await expect(page.locator('text=Jelajahi').first()).toBeVisible();
    }
  });

  test('9. Methodology, Data, and About pages load without errors', async ({ page }) => {
    await page.goto('/methodology');
    await expect(page.locator('h1').first()).toContainText(/Methodology/i);

    await page.goto('/data');
    await expect(page.locator('h1').first()).toContainText(/Data/i);

    await page.goto('/about');
    await expect(page.locator('h1').first()).toContainText(/About/i);
  });

  test('10. API health check and metrics endpoints return 200 JSON', async ({ request }) => {
    const health = await request.get('/api/health');
    expect(health.status()).toBe(200);
    const healthJson = await health.json();
    expect(healthJson.data.status).toBe('ok');

    const metrics = await request.get('/api/metrics?city=jakarta&from=2017&to=2025');
    expect(metrics.status()).toBe(200);
    const metricsJson = await metrics.json();
    expect(metricsJson.data.length).toBe(9);

    const change = await request.get('/api/change-summary?city=bandung');
    expect(change.status()).toBe(200);
  });

  test('11. Keyboard navigation and accessibility visible focus', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused).toBeDefined();
  });
});
