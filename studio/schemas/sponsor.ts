import {defineField, defineType} from 'sanity'

export const sponsor = defineType({
  name: 'sponsor',
  title: 'Sponsor',
  type: 'document',
  fields: [
    defineField({name: 'nom', title: 'Nom', type: 'string', validation: (R) => R.required()}),
    defineField({name: 'logo', title: 'Logo', type: 'image'}),
    defineField({name: 'url', title: 'URL', type: 'url'}),
    defineField({
      name: 'categoria',
      title: 'Categoria',
      type: 'string',
      options: {list: ['principal', 'colaborador', 'institucional']},
    }),
    defineField({name: 'ordre', title: 'Ordre', type: 'number'}),
  ],
})
