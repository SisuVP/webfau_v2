import { test, expect } from '@playwright/test';

// Test de fum: la home carrega contingut real de Sanity i els enllaços clau funcionen.
test('home amb recorreguts i navegació', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /més que una cursa de muntanya/i })).toBeVisible();

  // 3 recorreguts des de Sanity (hero + targetes)
  const links24 = page.locator('a[href="/recorregut/cursa-del-fau-24-km"]');
  await expect(links24.first()).toBeVisible();
  await expect(page.locator('a[href="/recorregut/puja-i-baixa-18-km"]').first()).toBeVisible();
  await expect(page.locator('a[href="/recorregut/entre-aiguees-9-km"]').first()).toBeVisible();

  // Cap marcador de contingut pendent
  await expect(page.getByText(/pendent d'omplir/i)).toHaveCount(0);
  await expect(page.getByText(/dades de mostra/i)).toHaveCount(0);

  // Fitxa d'un recorregut amb fitxa tècnica i mapa
  await links24.first().click();
  await expect(page.getByRole('heading', { name: /cursa del fau 24 km/i })).toBeVisible();
  await expect(page.getByText(/fitxa tècnica/i)).toBeVisible();
});
