/* eslint-disable prettier/prettier */
// payload/blocks/HeroCards/index.ts

import type { Block } from 'payload/types'

import link from '../../fields/link'

export const HeroCards: Block = {
  slug: 'heroCards',
  labels: {
    singular: 'Hero Cards Block',
    plural: 'Hero Cards Blocks',
  },
  fields: [
    {
      name: 'cards',
      type: 'array',
      maxRows: 3,
      minRows: 1,
      fields: [
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        link({
          appearances: false,
        }),
      ],
    },
  ],
}
