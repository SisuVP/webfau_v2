import {defineField, defineType} from 'sanity'

export const edicio = defineType({
  name: 'edicio',
  title: 'Edició',
  type: 'document',
  fields: [
    defineField({name: 'any', title: 'Any', type: 'number', validation: (R) => R.required().min(2007)}),
    defineField({name: 'data', title: 'Data cursa', type: 'date', validation: (R) => R.required()}),
    defineField({
      name: 'estat',
      title: 'Estat',
      type: 'string',
      options: {list: ['propera', 'actual', 'historica']},
    }),
    defineField({name: 'cartell', title: 'Cartell', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'heroFons',
      title: 'Imatge de fons de la portada',
      description: 'Panoràmica ampla (mín. 2000px). Si és buida, s’usa la portada d’un recorregut.',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'recorreguts',
      title: 'Recorreguts',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'recorregut'}]}],
    }),
    defineField({name: 'programa', title: 'Programa', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'reglament', title: 'Reglament', type: 'array', of: [{type: 'block'}]}),
    defineField({
      name: 'resultatsEmbed',
      title: 'Resultats (URL incrustada)',
      description: 'URL embed del cronometratge, ex. https://sportmaniacs.com/...',
      type: 'url',
    }),
    defineField({
      name: 'resultatsLinks',
      title: 'Resultats (enllaços a documents)',
      description: 'Per PDFs o webs externes, ex. classificacions per distància.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'titol', title: 'Títol', type: 'string'}),
            defineField({name: 'url', title: 'URL', type: 'url'}),
          ],
        },
      ],
    }),
    defineField({
      name: 'resultatsEvents',
      title: 'Resultats (events Sportmaniacs)',
      description:
        'Un per distància. L’eventId és l’UUID del botó "Veure classificacions" (URL .../races/<cursa>/<eventId>/results). Buit = sense taula API.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'nom', title: 'Nom (ex. 24 km)', type: 'string'}),
            defineField({name: 'eventId', title: 'Event ID (UUID)', type: 'string'}),
          ],
        },
      ],
    }),
    defineField({
      name: 'resultatsLegacy',
      title: 'Resultats legacy (força l’iframe)',
      description: 'Si està activat, es mostra l’iframe antic encara que la taula API funcioni.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'galeries',
      title: 'Galeries d’imatges',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'titol', title: 'Títol', type: 'string'}),
            defineField({name: 'url', title: 'URL àlbum extern', type: 'url'}),
            defineField({name: 'portada', title: 'Foto portada', type: 'image', options: {hotspot: true}}),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'any', subtitle: 'data'},
    prepare({title, subtitle}) {
      return {title: `Edició ${title ?? ''}`, subtitle}
    },
  },
})
