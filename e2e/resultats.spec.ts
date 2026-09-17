import { test, expect } from '@playwright/test';

// Resultats API: menú de distàncies, taula amb pestanyes, cerca i paginació.
// Depèn de les dades reals del Sanity (events 2025/2026 informats).
test('resultats amb menú de distàncies i paginació', async ({ page }) => {
  await page.goto('/resultats');
  await expect(page.getByRole('heading', { name: /^resultats$/i })).toBeVisible();

  const edicio = page.locator('[data-edicio="2025"]');
  await expect(edicio).toBeVisible();

  // Menú visible, taules amagades
  const boto24 = edicio.getByRole('button', { name: /24 km.*finishers/i });
  await expect(boto24).toBeVisible();
  const event24 = edicio.locator('[data-event="6898888a-8928-4053-b6a8-44bfac1f0158"]');
  await expect(event24).toBeHidden();

  // Obrir distància: menú s'amaga, taula es mostra
  await boto24.click();
  await expect(edicio.locator('[data-menu]')).toBeHidden();
  await expect(event24).toBeVisible();
  await expect(event24.getByRole('tab', { name: 'General' })).toHaveAttribute('aria-selected', 'true');

  // Paginació: 25 files visibles per pàgina (:visible ignora panells ocults)
  const files = event24.locator('tbody tr[data-nom]:visible');
  await expect(files).toHaveCount(25);
  await expect(event24.locator('[data-paginador]')).toContainText(/pàgina 1 de/i);
  await event24.getByRole('button', { name: /següent/i }).click();
  await expect(event24.locator('[data-paginador]')).toContainText(/pàgina 2 de/i);

  // Cerca per nom
  await event24.locator('[data-cerca]').fill('ballester');
  await expect(event24.locator('tbody tr[data-nom]:visible')).toHaveCount(1);

  // Tornar al menú
  await event24.getByRole('button', { name: /distàncies/i }).click();
  await expect(edicio.locator('[data-menu]')).toBeVisible();
  await expect(event24).toBeHidden();
});
