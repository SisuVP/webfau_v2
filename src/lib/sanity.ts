import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const sanity = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? 'e497m7tn',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2026-01-01',
  useCdn: true,
});

const builder = createImageUrlBuilder(sanity);

export function urlFor(source: any) {
  return builder.image(source);
}

export const queries = {
  edicioActual: `*[_type == "edicio" && estat == "actual"][0]{
    any, data, programa, reglament,
    recorreguts[]->{nom, "slug": slug.current, distanciaKm, desnivell, preu, puntSortida}
  }`,
  recorreguts: `*[_type == "recorregut"]{nom, "slug": slug.current, distanciaKm, desnivell, preu, puntSortida}`,
  recorregutSlugs: `*[_type == "recorregut" && defined(slug.current)]{"slug": slug.current}`,
  recorregutBySlug: `*[_type == "recorregut" && slug.current == $slug][0]{
    nom, distanciaKm, desnivell, preu, puntSortida, descripcio
  }`,
  sponsors: `*[_type == "sponsor"] | order(ordre asc){nom, url, categoria, "logoUrl": logo.asset->url}`,
  paginaSlugs: `*[_type == "pagina" && defined(slug.current)]{"slug": slug.current}`,
  paginaBySlug: `*[_type == "pagina" && slug.current == $slug][0]{titol, cos, embedUrl}`,
  paginesMenu: `*[_type == "pagina" && defined(slug.current) && mostraAlMenu == true] | order(ordre asc){titol, "slug": slug.current}`,
};
