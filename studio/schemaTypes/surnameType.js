import {defineField, defineType} from 'sanity'
import {UsersIcon} from '@sanity/icons'

export const surnameType = defineType({
  name: 'surname',
  title: 'Surname',
  type: 'document',
  icon: UsersIcon,
  fields: [
    defineField({name: 'surname', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'Page URL: /surnames/<slug>',
      options: {source: 'surname', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isLive',
      title: 'Has a page',
      type: 'boolean',
      description: 'On: listed on /surnames with its own page of biographies.',
      initialValue: false,
    }),
    defineField({name: 'body', title: 'Introduction', type: 'blockContent'}),
  ],
  orderings: [
    {title: 'Surname', name: 'surnameAsc', by: [{field: 'surname', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'surname', isLive: 'isLive'},
    prepare: ({title, isLive}) => ({title, subtitle: isLive ? 'page' : 'hidden'}),
  },
})
