import type { Block, Field } from 'payload/types'

import link from '../../fields/link'

const LinkSection: Field[] = [
  {
    name: 'countyName',
    label: 'Nazwa Gminy',
    type: 'text',
  },
  {
    name: 'media',
    type: 'upload',
    relationTo: 'media',
    required: true,
  },
  link(),
]

export const Counties: Block = {
  slug: 'counties',
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'allCounties',
      type: 'array',
      fields: LinkSection,
    },
  ],
}
