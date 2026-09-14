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
    defineField({name: 'trackGpx', title: 'Track GPX', type: 'file', options: {accept: '.gpx'}}),
    defineField({name: 'descripcio', title: 'Descripció', type: 'array', of: [{type: 'block'}, {type: 'image'}]}),
  ],
})
