import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {netlifyTool} from 'sanity-plugin-netlify'
import {media} from 'sanity-plugin-media'
import {DocumentPdfIcon, TagIcon, UserIcon, UsersIcon} from '@sanity/icons'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Family History Talks',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  // Token login (instead of the default cookie) so the "Upload PDF" field can send
  // the editor's Sanity token to the Netlify upload function, which checks it.
  auth: {loginMethod: 'token'},

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.documentTypeListItem('person').title('People').icon(UserIcon),
            S.documentTypeListItem('surname').title('Surnames').icon(UsersIcon),
            S.documentTypeListItem('archiveAsset').title('Assets').icon(DocumentPdfIcon),
            S.documentTypeListItem('tag').title('Tags').icon(TagIcon),
          ]),
    }),
    // Media library for portraits and bio images
    media(),
    // "Deploy" tab: rebuild the live site on demand (build hook + Site ID + access
    // token are entered once inside the tool; stored as private `netlify.*` docs)
    netlifyTool(),
  ],

  // No content releases or scheduling for this site — plain edit → publish only
  releases: {enabled: false},
  scheduledDrafts: {enabled: false},
  scheduledPublishing: {enabled: false},

  schema: {types: schemaTypes},
})
