/* eslint-disable prettier/prettier */
import React from 'react'
import { StaticImageData } from 'next/image'

import { Page } from '../../../payload/payload-types'
import { Gutter } from '../../_components/Gutter'
import { CMSLink } from '../../_components/Link'
import { Media } from '../../_components/Media'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'heroCards' }>

// type CMSLinkType = {
//   type: 'reference' | 'custom'
//   url?: string
//   newTab?: boolean
//   reference?: {
//     relationTo: 'pages'
//     value: string | Page
//   }
//   label: string
// }

// type CardType = {
//   id: string
//   media: {
//     id: string
//     alt: string
//     filename: string
//     mimeType: string
//     filesize: number
//     width: number
//     height: number
//     focalX: number
//     focalY: number
//     createdAt: string
//     updatedAt: string
//     url: string
//   }
//   title: string
//   description: string
//   link: CMSLinkType
// }

// type Props = {
//   cards: CardType[]
//   id: string
//   blockType: 'heroCards'
// }

export const HeroCards: React.FC<
  Props & {
    id?: string
  }
  
  > = props => {
    const { cards } = props

  return (
    <Gutter className={classes.heroCards}>
      <div className={classes.cardWrapper}>
      {cards &&
        cards.map((card) => {
        const { id, link, media } = card

        return (
        <a
        href={link.url}
        target={link.newTab ? '_blank' : undefined}
        rel={link.newTab ? 'noopener noreferrer' : undefined}
        className={classes.cardsContainer}
        >
          <div key={id} className={`${classes.card} ${classes.cardContainer}`}>
            <div className={classes.cardContent}>
              {card.media && (
                <div className={classes.iconWrapper}>
                  <Media 
                    resource={media}
                    imgClassName={classes.icon}
                    priority
                  />
                </div>
              )}
              {card.title && <h3 className={classes.title}>{card.title}</h3>}
              {card.description && <p className={classes.description}>{card.description}</p>}
            </div>
          </div>
        </a>
        )
      })}
      </div>
    </Gutter>
  )
}
