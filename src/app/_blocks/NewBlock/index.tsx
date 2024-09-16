import React from 'react'

import { Page } from '../../../payload/payload-types'
import { Gutter } from '../../_components/Gutter'
import { CMSLink } from '../../_components/Link'
import RichText from '../../_components/RichText'

import classes from './index.module.scss'

type Props = Extract<Page['layout'][0], { blockType: 'newBlock' }>

export const NewBlock: React.FC<
  Props & {
    id?: string
  }
> = props => {
  const { dates, richText, name } = props

  return (
    <div className={classes.background}>
      <Gutter className={classes.grid}>
        <h2 className={classes.title}>{name}</h2>
        <div className={classes.line} />
        <RichText className={classes.richText} content={richText} />
        <div className={classes.list}>
          {dates &&
            dates.length > 0 &&
            dates.map((col, index) => {
              const { date, description } = col

              return (
                <div key={index} className={[classes.dates, classes[`dates`]].join(' ')}>
                  <RichText content={date} className={classes.dateNumber} />
                  <div className={classes.pointer}>
                    <div />
                  </div>
                  <RichText content={description} />
                </div>
              )
            })}
        </div>
      </Gutter>
    </div>
  )
}
