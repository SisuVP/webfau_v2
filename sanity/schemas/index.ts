// Model Sanity proposat per Cursa del Fau
// Aquests fitxers són per enganxar a `sanity/schemas/` quan creïs l'Studio.
// De moment serveixen com a contracte entre Astro i Sanity.

export const edicio = {
  name: 'edicio',
  title: 'Edició',
  type: 'document',
  fields: [
    { name: 'any', title: 'Any', type: 'number', validation: (R: any) => R.required() },
    { name: 'data', title: 'Data cursa', type: 'date' },
    { name: 'estat', title: 'Estat', type: 'string', options: { list: ['propera', 'actual', 'historica'] } },
    { name: 'cartell', title: 'Cartell', type: 'image' },
    { name: 'recorreguts', title: 'Recorreguts', type: 'array', of: [{ type: 'reference', to: [{ type: 'recorregut' }] }] },
    { name: 'programa', title: 'Programa', type: 'array', of: [{ type: 'block' }] },
    { name: 'reglament', title: 'Reglament', type: 'array', of: [{ type: 'block' }] },
  ],
};

export const recorregut = {
  name: 'recorregut',
  title: 'Recorregut',
  type: 'document',
  fields: [
    { name: 'nom', title: 'Nom', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'nom' } },
    { name: 'distanciaKm', title: 'Distància (km)', type: 'number' },
    { name: 'desnivell', title: 'Desnivell positiu (m)', type: 'number' },
    { name: 'preu', title: 'Preu (€)', type: 'number' },
    { name: 'trackGpx', title: 'Track GPX', type: 'file' },
    { name: 'descripcio', title: 'Descripció', type: 'array', of: [{ type: 'block' }] },
  ],
};

export const pagina = {
  name: 'pagina',
  title: 'Pàgina',
  type: 'document',
  fields: [
    { name: 'titol', title: 'Títol', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'titol' } },
    { name: 'cos', title: 'Cos', type: 'array', of: [{ type: 'block' }, { type: 'image' }] },
  ],
};

export const sponsor = {
  name: 'sponsor',
  title: 'Sponsor',
  type: 'document',
  fields: [
    { name: 'nom', title: 'Nom', type: 'string' },
    { name: 'logo', title: 'Logo', type: 'image' },
    { name: 'url', title: 'URL', type: 'url' },
    { name: 'categoria', title: 'Categoria', type: 'string', options: { list: ['principal', 'colaborador', 'institucional'] } },
    { name: 'ordre', title: 'Ordre', type: 'number' },
  ],
};
