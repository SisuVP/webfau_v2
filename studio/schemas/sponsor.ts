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
    defineField({
      name: 'targetaFosca',
      title: 'Targeta fosca',
      description: 'Activa-ho si el logo és blanc o molt clar i no es veu sobre fons blanc.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
