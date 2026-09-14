import {defineField, defineType} from 'sanity'

export const edicio = defineType({
  name: 'edicio',
  title: 'Edició',
  type: 'document',
  fields: [
    defineField({name: 'any', title: 'Any', type: 'number', validation: (R) => R.required().min(2007)}),
    defineField({name: 'data', title: 'Data cursa', type: 'date'}),
    defineField({
      name: 'estat',
      title: 'Estat',
      type: 'string',
      options: {list: ['propera', 'actual', 'historica']},
    }),
    defineField({name: 'cartell', title: 'Cartell', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'recorreguts',
      title: 'Recorreguts',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'recorregut'}]}],
    }),
    defineField({name: 'programa', title: 'Programa', type: 'array', of: [{type: 'block'}]}),
    defineField({name: 'reglament', title: 'Reglament', type: 'array', of: [{type: 'block'}]}),
  ],
  preview: {
    select: {title: 'any', subtitle: 'data'},
    prepare({title, subtitle}) {
      return {title: `Edició ${title ?? ''}`, subtitle}
    },
  },
})
