import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'

export const tagType = defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  icon: TagIcon,
  fields: [defineField({name: 'title', type: 'string', validation: (rule) => rule.required()})],
})
