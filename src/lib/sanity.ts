import { createClient } from '@sanity/client';
import { createImageUrlBuilder } from '@sanity/image-url';

export const sanity = createClient({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? 'e497m7tn',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2026-01-01',
  // Sense CDN: el build (local o webhook) sempre llegeix dades fresques
  // just després de publicar. El HTML final ja queda cachejat a Cloudflare.
  useCdn: false,
});

const builder = createImageUrlBuilder(sanity);

export function urlFor(source: any) {
  return builder.image(source);
}

export const queries = {
  edicioActual: `*[_type == "edicio" && estat == "actual"][0]{
    any, data, programa, reglament, "cartellUrl": cartell.asset->url,
    recorreguts[]->{nom, "slug": slug.current, distanciaKm, desnivell, preu, puntSortida, "imatgeUrl": imatge.asset->url}
  }`,
  recorreguts: `*[_type == "recorregut"]{nom, "slug": slug.current, distanciaKm, desnivell, preu, puntSortida, "imatgeUrl": imatge.asset->url}`,
  recorregutSlugs: `*[_type == "recorregut" && defined(slug.current)]{"slug": slug.current}`,
  recorregutBySlug: `*[_type == "recorregut" && slug.current == $slug][0]{
    nom, distanciaKm, desnivell, preu, puntSortida, descripcio,
    perA, horaSortida, tempsMaxim, alcadaMin, alcadaMax,
    avituallaments[]{punt, km}, talls[]{punt, horaLimit},
    mapaEmbedUrl, "perfilUrl": perfil.asset->url
  }`,
  sponsors: `*[_type == "sponsor"] | order(ordre asc){nom, url, categoria, targetaFosca, "logoUrl": logo.asset->url}`,
  edicionsResultats: `*[_type == "edicio"] | order(any desc){any, estat, resultatsEmbed, resultatsLinks[]{titol, url}}`,
  edicionsGaleries: `*[_type == "edicio"] | order(any desc){any, galeries[]{titol, url, "portadaUrl": portada.asset->url}}`,
  paginaSlugs: `*[_type == "pagina" && defined(slug.current)]{"slug": slug.current}`,
  paginaBySlug: `*[_type == "pagina" && slug.current == $slug][0]{titol, cos, embedUrl}`,
  paginesMenu: `*[_type == "pagina" && defined(slug.current) && mostraAlMenu == true] | order(ordre asc){titol, "slug": slug.current}`,
};
