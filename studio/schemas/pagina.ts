import {defineField, defineType} from 'sanity'

export const pagina = defineType({
  name: 'pagina',
  title: 'Pàgina',
  type: 'document',
  fields: [
    defineField({name: 'titol', title: 'Títol', type: 'string', validation: (R) => R.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'titol'}}),
    defineField({
      name: 'cos',
      title: 'Cos',
      type: 'array',
      of: [{type: 'block'}, {type: 'image', options: {hotspot: true}}],
    }),
    defineField({
      name: 'embedUrl',
      title: 'URL incrustada (mapa Google, vídeo...)',
      description: 'Opcional. Enganxa la URL "embed", ex. https://www.google.com/maps/d/embed?mid=...',
      type: 'url',
    }),
  ],
})
