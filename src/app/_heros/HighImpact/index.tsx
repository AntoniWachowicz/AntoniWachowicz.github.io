import React, { Fragment } from 'react'

import { Page } from '../../../payload/payload-types'
import { Gutter } from '../../_components/Gutter'
import { CMSLink } from '../../_components/Link'
import { Media } from '../../_components/Media'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'

export const HighImpactHero: React.FC<Page['hero']> = ({ richText, media, links }) => {
  return (
    <div className={classes.hero}>
      {typeof media === 'object' && media !== null && (
        <div className={classes.mediaWrapper}>
          <Media
            resource={media}
            className={classes.mediaBackground}
            imgClassName={classes.mediaImage}
            priority
          />
        </div>
      )}
      <Gutter className={classes.contentWrapper}>
        <div className={classes.content}>
          <RichText content={richText} />
          {Array.isArray(links) && links.length > 0 && (
            <ul className={classes.links}>
              {links.map(({ link }, i) => (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </Gutter>
    </div>
  )
}
