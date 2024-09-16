/* eslint-disable prettier/prettier */
import type { Page } from '../../payload/payload-types'
import type { RelatedPostsProps } from '../_blocks/RelatedPosts'

export type BlockType = Page['layout'][0]['blockType'] | 'relatedPosts'

type PageLayoutWithBlockName = {
  [K in Page['layout'][0]['blockType']]: Extract<Page['layout'][0], { blockType: K }> & {
    blockName?: string
  }
}

export type CustomBlock =
  | PageLayoutWithBlockName[keyof PageLayoutWithBlockName]
  | (RelatedPostsProps & { blockName?: string })
