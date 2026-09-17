import { test, expect } from '@playwright/test';

// Pàgina interna d'eines: estat de resultats per edició (render SSR, sense JS).
test('eines de resultats amb estat per edició', async ({ page }) => {
  await page.goto('/eines/resultats');
  await expect(page.getByRole('heading', { name: /eines: resultats/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Edició 2026' })).toBeVisible();
  await expect(page.getByText(/taula pròpia.*complet/i).first()).toBeVisible();
  await expect(page.getByRole('heading', { name: /flux per a una edició nova/i })).toBeVisible();
});
