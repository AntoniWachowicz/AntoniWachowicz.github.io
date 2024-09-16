import type { Field, GlobalConfig } from 'payload/types'

import richText from '../fields/richText'

const navField: Field[] = [
  {
    name: 'navItems',
    type: 'array',
    maxRows: 6,
    fields: [richText()],
  },
]

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'colums',
      type: 'array',
      fields: navField,
    },
  ],
}
