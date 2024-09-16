'use client'

import React, { Fragment, useCallback, useEffect, useRef, useState } from 'react'

import type { Post, Project } from '../../../payload/payload-types'
import { fetchDocs } from '../../_api/fetchDocs'
import type { ArchiveBlockProps } from '../../_blocks/ArchiveBlock/types'
import { Card } from '../Card'
import { Gutter } from '../Gutter'
import { CMSLink } from '../Link'

import classes from './index.module.scss'

type Result = {
  docs: (Post | Project)[]
  hasNextPage: boolean
  hasPrevPage: boolean
  nextPage: number
  page: number
  prevPage: number
  totalDocs: number
  totalPages: number
}

export type Props = {
  categories?: ArchiveBlockProps['categories']
  className?: string
  limit?: number
  onResultChange?: (result: Result) => void // eslint-disable-line no-unused-vars
  populateBy?: 'collection' | 'selection'
  populatedDocs?: ArchiveBlockProps['populatedDocs']
  populatedDocsTotal?: ArchiveBlockProps['populatedDocsTotal']
  relationTo?: 'posts' | 'projects'
  selectedDocs?: ArchiveBlockProps['selectedDocs']
  showPageRange?: boolean
  sort?: string
  enableLink?: boolean | null
  link?: ArchiveBlockProps['link']
}

export const CollectionArchive: React.FC<Props> = props => {
  const {
    categories: catsFromProps,
    className,
    limit = 3,
    onResultChange,
    populateBy,
    populatedDocs,
    populatedDocsTotal,
    relationTo,
    selectedDocs,
    showPageRange,
    sort = '-createdAt',
    enableLink,
    link,
  } = props

  const [results, setResults] = useState<Result>({
    docs: (populateBy === 'collection'
      ? populatedDocs
      : populateBy === 'selection'
      ? selectedDocs
      : []
    )?.map(doc => doc.value) as (Post | Project)[],
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: 1,
    page: 1,
    prevPage: 1,
    totalDocs: typeof populatedDocsTotal === 'number' ? populatedDocsTotal : 0,
    totalPages: 1,
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | undefined>(undefined)
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasHydrated = useRef(false)
  const isRequesting = useRef(false)
  const [page, setPage] = useState(1)

  const categories = (catsFromProps || [])
    .map(cat => (typeof cat === 'object' ? cat.id : cat))
    .join(',')

  const scrollToRef = useCallback(() => {
    const { current } = scrollRef
    if (current) {
      // current.scrollIntoView({
      //   behavior: 'smooth',
      // })
    }
  }, [])

  useEffect(() => {
    if (!isLoading && typeof results.page !== 'undefined') {
      // scrollToRef()
    }
  }, [isLoading, scrollToRef, results])

  useEffect(() => {
    let timer: NodeJS.Timeout = null

    if (populateBy === 'collection' && !isRequesting.current) {
      isRequesting.current = true

      timer = setTimeout(() => {
        if (hasHydrated.current) {
          setIsLoading(true)
        }
      }, 500)

      const makeRequest = async () => {
        try {
          const response = await fetchDocs(relationTo, false, {
            page,
            limit,
            sort,
            where: categories
              ? {
                  categories: {
                    in: categories.split(','),
                  },
                }
              : undefined,
          })

          clearTimeout(timer)

          setResults(response as Result)
          setIsLoading(false)
          if (typeof onResultChange === 'function') {
            onResultChange(response as Result)
          }
        } catch (err) {
          console.warn(err) // eslint-disable-line no-console
          setIsLoading(false)
          setError(`Unable to load "${relationTo} archive" data at this time.`)
        }

        isRequesting.current = false
        hasHydrated.current = true
      }

      void makeRequest()
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [page, categories, relationTo, onResultChange, sort, limit, populateBy])

  return (
    <Gutter>
      <div className={[classes.collectionArchive, className].filter(Boolean).join(' ')}>
        {/* <div className={classes.scrollRef} ref={scrollRef} /> */}
        {!isLoading && error && <Gutter>{error}</Gutter>}
        <Fragment>
          <h2>{'Aktualności'}</h2>
          {/* {showPageRange !== false && populateBy !== 'selection' && (
            <Gutter>
              <div className={classes.pageRange}>
                <PageRange
                  collection={relationTo}
                  currentPage={results.page}
                  limit={limit}
                  totalDocs={results.totalDocs}
                />
              </div>
            </Gutter>
          )} */}
          <div className={classes.grid}>
            {results.docs?.map((result, index) => {
              if (typeof result === 'object' && result !== null) {
                return (
                  <div className={classes.column} key={index}>
                    <Card
                      doc={result}
                      className={classes.cards} /*relationTo={relationTo} showCategories*/
                    />
                  </div>
                )
              }

              return null
            })}
          </div>
          {/* {results.totalPages > 1 && populateBy !== 'selection' && (
            <Pagination
              className={classes.pagination}
              onClick={setPage}
              page={results.page}
              totalPages={results.totalPages}
            />
          )} */}
        </Fragment>
      </div>
      {enableLink && link && <CMSLink className={classes.link} {...link} />}
    </Gutter>
  )
}
