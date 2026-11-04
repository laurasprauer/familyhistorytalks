import {defineField, defineType} from 'sanity'
import {DocumentPdfIcon} from '@sanity/icons'
import {R2FileInput} from '../components/R2FileInput'

// "Assets" in the Studio: an archive document (census page, death certificate,
// family bible…). The PDF itself lives in Cloudflare R2 at <sid>/<fileName> and is
// served from familyhistorytalks.com/resources/<sid>/<fileName>; this document
// holds everything about it. Named archiveAsset so it doesn't clash with Sanity's
// own image/file "asset" types.
export const archiveAssetType = defineType({
  name: 'archiveAsset',
  title: 'Asset',
  type: 'document',
  icon: DocumentPdfIcon,
  fields: [
    defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'file',
      title: 'PDF',
      type: 'object',
      components: {input: R2FileInput},
      validation: (rule) =>
        rule.custom((value) => (value?.key ? true : 'Upload the PDF for this asset')),
      fields: [
        // Filled in by the upload — not edited by hand.
        defineField({name: 'sid', title: 'Folder id', type: 'string', readOnly: true}),
        defineField({name: 'key', title: 'Storage key', type: 'string', readOnly: true}),
        defineField({name: 'fileName', type: 'string', readOnly: true}),
        defineField({name: 'size', type: 'number', readOnly: true}),
        defineField({name: 'contentType', type: 'string', readOnly: true}),
      ],
    }),
    defineField({
      name: 'startYear',
      type: 'number',
      validation: (rule) => rule.integer().min(1000).max(2100),
    }),
    defineField({
      name: 'endYear',
      type: 'number',
      validation: (rule) =>
        rule
          .integer()
          .min(1000)
          .max(2100)
          .custom((endYear, {document}) =>
            endYear && document?.startYear && endYear < document.startYear
              ? 'End year is before start year'
              : true,
          ),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      description: 'Shown under the title in search results and on biography pages.',
    }),
    defineField({
      name: 'transcript',
      type: 'text',
      rows: 12,
      description: 'Typed-out text of the document. Search looks through this.',
    }),
  ],
  orderings: [
    {title: 'Title', name: 'titleAsc', by: [{field: 'title', direction: 'asc'}]},
    {title: 'Start year', name: 'startYearAsc', by: [{field: 'startYear', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'title', startYear: 'startYear', endYear: 'endYear', fileName: 'file.fileName'},
    prepare: ({title, startYear, endYear, fileName}) => {
      const years =
        startYear && endYear && startYear !== endYear ? `${startYear}–${endYear}` : startYear || ''
      return {
        title,
        subtitle: [years, fileName || 'no PDF yet'].filter(Boolean).join(' · '),
        media: DocumentPdfIcon,
      }
    },
  },
})
