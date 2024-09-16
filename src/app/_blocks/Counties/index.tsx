import React from 'react'

import { Page } from '../../../payload/payload-types'
import { Gutter } from '../../_components/Gutter'
import { CMSLink } from '../../_components/Link'
import { Media } from '../../_components/Media'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'counties' }>

export const Counties: React.FC<
  Props & {
    id?: string
  }
> = props => {
  const { allCounties } = props

  return (
    <Gutter>
      <div className={classes.allCounties}>
        {allCounties &&
          allCounties.length > 0 &&
          allCounties.map((col, index) => {
            const { countyName, link, media } = col

            return (
              <div key={index} className={[classes.section].join(' ')}>
                <div className={classes.single}>
                  <a
                    href={link.url}
                    target={link.newTab ? '_blank' : undefined}
                    rel={link.newTab ? 'noopener noreferrer' : undefined}
                    className={classes.link}
                  >
                    <Media resource={media} alt={countyName} className={classes.crest} />
                    <p className={classes.countyName}>{countyName}</p>
                  </a>
                </div>
              </div>
            )
          })}
      </div>
    </Gutter>
  )
}
