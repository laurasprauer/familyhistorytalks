import {defineArrayMember, defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons'

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

// Day / month / year are separate because genealogy dates are often partial.
// Year is a string so approximate values work ("1776-80", "before 1755").
const dateFields = (prefix, label) => [
  defineField({
    name: `${prefix}Month`,
    title: `${label} month`,
    type: 'string',
    options: {list: MONTHS},
    fieldset: prefix,
  }),
  defineField({
    name: `${prefix}Day`,
    title: `${label} day`,
    type: 'number',
    validation: (rule) => rule.integer().min(1).max(31),
    fieldset: prefix,
  }),
  defineField({
    name: `${prefix}Year`,
    title: `${label} year`,
    type: 'string',
    description: 'e.g. 1842, 1776-80, before 1755',
    fieldset: prefix,
  }),
]

const personReference = {type: 'reference', to: [{type: 'person'}]}

export const personType = defineType({
  name: 'person',
  title: 'Person',
  type: 'document',
  icon: UserIcon,
  fieldsets: [
    {name: 'birth', title: 'Birth', options: {columns: 3}},
    {name: 'death', title: 'Death', options: {columns: 3}},
  ],
  fields: [
    defineField({name: 'name', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'Page URL: /person/<slug>',
      options: {source: 'name', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isLive',
      title: 'Has a page',
      type: 'boolean',
      description:
        'On: this person gets a biography page and is linked from family trees. Off: they only appear as a name in relatives’ family trees.',
      initialValue: false,
    }),
    defineField({
      name: 'surname',
      type: 'reference',
      to: [{type: 'surname'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'gender',
      type: 'string',
      options: {list: ['Male', 'Female'], layout: 'radio', direction: 'horizontal'},
      description: 'Used for family-tree labels (son / daughter, father / mother).',
    }),
    ...dateFields('birth', 'Birth'),
    ...dateFields('death', 'Death'),
    defineField({
      name: 'profileImage',
      title: 'Portrait',
      type: 'image',
      options: {hotspot: true},
      fields: [defineField({name: 'alt', title: 'Alt text', type: 'string'})],
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      description: 'Short summary used for search results and the page’s SEO description.',
    }),
    defineField({name: 'body', title: 'Biography', type: 'blockContent'}),
    defineField({
      name: 'assets',
      title: 'Assets',
      type: 'array',
      description: 'Sources listed beside the biography. Footnote numbers follow this order.',
      of: [defineArrayMember({type: 'reference', to: [{type: 'archiveAsset'}]})],
    }),
    defineField({name: 'father', ...personReference}),
    defineField({name: 'mother', ...personReference}),
    defineField({
      name: 'childrenOfPerson',
      title: 'Children',
      type: 'array',
      of: [defineArrayMember(personReference)],
    }),
    defineField({
      name: 'tags',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'tag'}]})],
    }),
  ],
  orderings: [
    {title: 'Name', name: 'nameAsc', by: [{field: 'name', direction: 'asc'}]},
  ],
  preview: {
    select: {
      title: 'name',
      birthYear: 'birthYear',
      deathYear: 'deathYear',
      isLive: 'isLive',
      media: 'profileImage',
    },
    prepare: ({title, birthYear, deathYear, isLive, media}) => ({
      title,
      subtitle: `${birthYear || '????'} – ${deathYear || '????'}${isLive ? ' · page' : ''}`,
      media,
    }),
  },
})
