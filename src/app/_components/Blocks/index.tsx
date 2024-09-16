import React, { Fragment } from 'react'

import { ArchiveBlock } from '../../_blocks/ArchiveBlock'
import { CallToActionBlock } from '../../_blocks/CallToAction'
import { ContentBlock } from '../../_blocks/Content'
import { Counties } from '../../_blocks/Counties'
import { HeroCards } from '../../_blocks/HeroCards'
import { MediaBlock } from '../../_blocks/MediaBlock'
import { NewBlock } from '../../_blocks/NewBlock'
import { RelatedPosts } from '../../_blocks/RelatedPosts'
import { BlockType, CustomBlock } from '../../_types/customTypes'
import { toKebabCase } from '../../_utilities/toKebabCase'
import { BackgroundColor } from '../BackgroundColor'
import { VerticalPadding, VerticalPaddingOptions } from '../VerticalPadding'

const blockComponents: { [key in BlockType]: React.ComponentType<any> } = {
  cta: CallToActionBlock,
  content: ContentBlock,
  mediaBlock: MediaBlock,
  archive: ArchiveBlock,
  relatedPosts: RelatedPosts,
  newBlock: NewBlock,
  heroCards: HeroCards,
  counties: Counties,
}

export const Blocks: React.FC<{
  blocks: CustomBlock[]
  disableTopPadding?: boolean
}> = props => {
  const { disableTopPadding, blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockName, blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            const blockIsInverted =
              'invertBackground' in block && blockType !== 'cta' ? block.invertBackground : false
            const prevBlock = blocks[index - 1]

            const prevBlockInverted =
              prevBlock && 'invertBackground' in prevBlock && prevBlock?.invertBackground

            const isPrevSame = Boolean(blockIsInverted) === Boolean(prevBlockInverted)

            let paddingTop: VerticalPaddingOptions = 'large'
            let paddingBottom: VerticalPaddingOptions = 'large'

            if (prevBlock && isPrevSame) {
              paddingTop = 'none'
            }

            if (index === blocks.length - 1) {
              paddingBottom = 'large'
            }

            if (disableTopPadding && index === 0) {
              paddingTop = 'none'
            }

            if (Block) {
              return (
                <BackgroundColor key={index} invert={blockIsInverted}>
                  <VerticalPadding top={paddingTop} bottom={paddingBottom}>
                    <Block /*id={blockName ? toKebabCase(blockName) : undefined}*/ {...block} />
                  </VerticalPadding>
                </BackgroundColor>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
