import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentPdfIcon, ImageIcon, InfoOutlineIcon, WarningOutlineIcon} from '@sanity/icons'

// Shared rich-text building blocks for bios (person.body) and surname intros.
//
// assetCitation is an inline object: it renders on the site as a numbered
// footnote "[n]" that scrolls to the matching entry in the person's Assets list
// (n = the asset's position in that list). It replaces the old
// <span resource="1688…"></span> markers from Contentful.

const linkAnnotation = defineArrayMember({
  name: 'link',
  type: 'object',
  title: 'Link',
  fields: [
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      description: 'Full URL, or a site path like /person/kizzie-dishman',
      validation: (rule) =>
        rule.required().uri({allowRelative: true, scheme: ['http', 'https', 'mailto']}),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})

const assetCitation = defineArrayMember({
  name: 'assetCitation',
  title: 'Cite asset',
  type: 'object',
  icon: DocumentPdfIcon,
  fields: [
    defineField({
      name: 'asset',
      type: 'reference',
      to: [{type: 'archiveAsset'}],
      description: 'Shows as a numbered footnote. Also add the asset to this person’s Assets list.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'detail',
      type: 'string',
      description:
        'Optional text shown inside the brackets after the number, e.g. " - P29" shows as [5 - P29], ".1" as [5.1].',
    }),
  ],
  preview: {
    select: {title: 'asset.title', detail: 'detail'},
    prepare: ({title, detail}) => ({
      title: title || 'Cite asset',
      subtitle: detail || undefined,
      media: DocumentPdfIcon,
    }),
  },
})

const decorators = [
  {title: 'Bold', value: 'strong'},
  {title: 'Italic', value: 'em'},
]

// Paragraph-only rich text: captions, highlight and warning boxes.
export const simpleBlockContent = defineType({
  name: 'simpleBlockContent',
  title: 'Text',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{title: 'Normal', value: 'normal'}],
      lists: [],
      marks: {decorators, annotations: [linkAnnotation]},
      of: [assetCitation],
    }),
  ],
})

const figure = defineArrayMember({
  name: 'figure',
  title: 'Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      type: 'image',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt text',
      type: 'string',
      description: 'Describe the image for screen readers and search engines.',
    }),
    defineField({
      name: 'caption',
      type: 'simpleBlockContent',
    }),
    defineField({
      name: 'maxWidth',
      title: 'Max width (px)',
      type: 'number',
      description: 'Optional. Leave empty to fill the text column.',
    }),
  ],
  preview: {
    select: {media: 'image', alt: 'alt', caption: 'caption'},
    prepare: ({media, alt, caption}) => ({
      title: alt || 'Image',
      subtitle: caption?.[0]?.children?.map((c) => c.text || '').join(''),
      media,
    }),
  },
})

const boxPreview = (title) => ({
  select: {content: 'content'},
  prepare: ({content}) => ({
    title,
    subtitle: content?.[0]?.children?.map((c) => c.text || '').join(''),
  }),
})

const highlightBox = defineArrayMember({
  name: 'highlightBox',
  title: 'Highlight box',
  type: 'object',
  icon: InfoOutlineIcon,
  description: 'e.g. "Alternate Names: …"',
  fields: [defineField({name: 'content', type: 'simpleBlockContent'})],
  preview: boxPreview('Highlight box'),
})

const warningBox = defineArrayMember({
  name: 'warningBox',
  title: 'Content warning',
  type: 'object',
  icon: WarningOutlineIcon,
  fields: [defineField({name: 'content', type: 'simpleBlockContent'})],
  preview: boxPreview('Content warning'),
})

// Full rich text for bios and surname pages.
export const blockContent = defineType({
  name: 'blockContent',
  title: 'Body',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Heading 2', value: 'h2'},
        {title: 'Heading 3', value: 'h3'},
        {title: 'Heading 4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bullet', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {decorators, annotations: [linkAnnotation]},
      of: [assetCitation],
    }),
    figure,
    highlightBox,
    warningBox,
  ],
})
