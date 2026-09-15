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
      name: 'colorFons',
      title: 'Color de fons de la targeta',
      description: 'Tria el fons que faci més visible el logo.',
      type: 'string',
      options: {
        list: [
          {title: 'Blanc (per defecte)', value: 'blanc'},
          {title: 'Negre nit (per logos blancs)', value: 'negre'},
          {title: 'Taronja Fau', value: 'taronja'},
          {title: 'Gris clar', value: 'gris'},
        ],
      },
      initialValue: 'blanc',
    }),
  ],
})
