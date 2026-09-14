import { createClient } from '@sanity/client';

export const sanity = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? 'xxxxxx',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2026-01-01',
  useCdn: true,
});

// Exemple GROQ:
// *[_type == "edicio" && any == 2026][0]{ any, data, recorreguts[]->{nom, distanciaKm} }
