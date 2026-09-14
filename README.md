# Cursa del Fau — web v2

Web moderna de la Cursa del Fau (Maçanet de Cabrenys).

**Stack:** Astro (SSG estàtic) + Sanity (CMS) + Cloudflare Pages (hosting/CDN) + GitHub (codi + CI/CD).

## Desenvolupament

```powershell
# Web (http://localhost:4321)
npm install
npx astro dev --background

# Studio Sanity (http://localhost:3333) — segon terminal
cd studio
npm install
npm run dev
```

Variables d'entorn: copia `.env.example` → `.env` amb `PUBLIC_SANITY_PROJECT_ID`.
Studio: copia `studio/.env.example` → `studio/.env`.

| Comanda | Acció |
| :-- | :-- |
| `npm run dev` | Dev server web al `localhost:4321` |
| `npm run build` | Build estàtic a `./dist/` |
| `npm run preview` | Previsualitza el build |

## Deploy (Cloudflare Pages)

Projecte Pages connectat al repo `SisuVP/webfau_v2`:

- **Build command:** `npm run build`
- **Output directory:** `dist`
- **Root directory:** `/` (arrel)
- **Env vars (Production + Preview):**
  - `PUBLIC_SANITY_PROJECT_ID=e497m7tn`
  - `PUBLIC_SANITY_DATASET=production`
  - `SITE_URL=https://cursadelfau.org`

La carpeta `studio/` **no** es desplega (només hi ha l'Studio per editors, es corre en local amb `npm run dev`).

## Rebuild automàtic en publicar (Sanity webhook)

1. A Cloudflare Pages → Settings → Builds → **Build hooks** → crea'n un (`main`) i copia la URL.
2. A Sanity Manage (projecte `e497m7tn`) → API → **Webhooks** → crea:
   - URL: la del build hook
   - Dataset: `production`
   - Trigger on: Create, Update, Delete
3. A partir d'aquí, cada Publish a l'Studio regenera la web sola (~1 min).
