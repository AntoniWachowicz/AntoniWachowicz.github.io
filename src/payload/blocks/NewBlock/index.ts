import type { Block, Field } from 'payload/types'

import richText from '../../fields/richText'

const textFields: Field[] = [
  {
    name: 'date',
    label: 'Data',
    type: 'richText',
  },
  {
    name: 'description',
    label: 'Opis',
    type: 'richText',
  },
]

export const NewBlock: Block = {
  slug: 'newBlock',
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    richText(),
    {
      name: 'dates',
      type: 'array',
      fields: textFields,
    },
  ],
}
