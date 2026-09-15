import {defineField, defineType} from 'sanity'

export const recorregut = defineType({
  name: 'recorregut',
  title: 'Recorregut',
  type: 'document',
  fields: [
    defineField({name: 'nom', title: 'Nom', type: 'string', validation: (R) => R.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'nom'}}),
    defineField({name: 'distanciaKm', title: 'Distància (km)', type: 'number'}),
    defineField({name: 'desnivell', title: 'Desnivell positiu (m)', type: 'number'}),
    defineField({name: 'preu', title: 'Preu (€)', type: 'number'}),
    defineField({name: 'perA', title: 'Per a', type: 'string', description: 'Ex. Per corredors / Per corredors i caminadors'}),
    defineField({name: 'horaSortida', title: 'Hora de sortida', type: 'string'}),
    defineField({name: 'tempsMaxim', title: 'Temps màxim', type: 'string'}),
    defineField({name: 'alcadaMin', title: 'Alçada mínima (m)', type: 'number'}),
    defineField({name: 'alcadaMax', title: 'Alçada màxima (m)', type: 'number'}),
    defineField({
      name: 'avituallaments',
      title: 'Avituallaments',
      type: 'array',
      of: [{type: 'object', fields: [
        defineField({name: 'punt', title: 'Punt', type: 'string'}),
        defineField({name: 'km', title: 'Km', type: 'number'}),
      ]}],
    }),
    defineField({
      name: 'talls',
      title: 'Temps de tall',
      type: 'array',
      of: [{type: 'object', fields: [
        defineField({name: 'punt', title: 'Punt', type: 'string'}),
        defineField({name: 'horaLimit', title: 'Hora límit', type: 'string'}),
      ]}],
    }),
    defineField({name: 'mapaEmbedUrl', title: 'Mapa (URL incrustada Wikiloc)', type: 'url'}),
    defineField({name: 'perfil', title: 'Perfil (imatge)', type: 'image'}),
    defineField({name: 'puntSortida', title: 'Punt de sortida / arribada', type: 'string'}),
    defineField({name: 'trackGpx', title: 'Track GPX', type: 'file', options: {accept: '.gpx'}}),
    defineField({name: 'imatge', title: 'Imatge de portada', type: 'image', options: {hotspot: true}}),
    defineField({name: 'descripcio', title: 'Descripció', type: 'array', of: [{type: 'block'}, {type: 'image'}]}),
  ],
})
