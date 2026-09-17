import {defineField, defineType} from 'sanity'

// Snapshot immutable d'una classificació (JSON descarregat de Sportmaniacs).
// Es genera amb `npm run snapshot:resultats`, no s'edita a mà.
export const classificacio = defineType({
  name: 'classificacio',
  title: 'Classificació (snapshot)',
  type: 'document',
  fields: [
    defineField({
      name: 'edicio',
      title: 'Edició',
      type: 'reference',
      to: [{type: 'edicio'}],
      validation: (R) => R.required(),
    }),
    defineField({name: 'nom', title: 'Nom (ex. 24 km)', type: 'string', validation: (R) => R.required()}),
    defineField({name: 'eventId', title: 'Event ID (UUID Sportmaniacs)', type: 'string', validation: (R) => R.required()}),
    defineField({
      name: 'fitxer',
      title: 'Fitxer JSON',
      type: 'file',
      options: {accept: '.json,application/json'},
      validation: (R) => R.required(),
    }),
    defineField({name: 'actualitzat', title: 'Actualitzat', type: 'datetime', validation: (R) => R.required()}),
  ],
  preview: {
    select: {title: 'nom', subtitle: 'actualitzat', edicioAny: 'edicio.any'},
    prepare({title, subtitle, edicioAny}) {
      return {title: `${title ?? ''}${edicioAny ? ` — ${edicioAny}` : ''}`, subtitle}
    },
  },
})
