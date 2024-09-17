/* eslint-disable no-console */
import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { Page } from '../../../payload/payload-types'
import { fetchDoc } from '../../_api/fetchDoc'
import { fetchDocs } from '../../_api/fetchDocs'
import { Blocks } from '../../_components/Blocks'
import { Hero } from '../../_components/Hero'
import { generateMeta } from '../../_utilities/generateMeta'

// Payload Cloud caches all files through its CDN automatically
export const revalidate = 0

export default async function Page({ params: { slug } }) {
  const pageSlug = slug && slug.length > 0 ? slug : 'home'
  console.log('Attempting to fetch page with slug:', pageSlug)

  try {
    const page = await fetchDoc<Page>({
      collection: 'pages',
      slug: pageSlug,
      draft: false,
    })

    console.log('Fetched page:', page)

    if (!page) {
      console.log('Page not found, returning 404')
      return notFound()
    }

    return (
      <React.Fragment>
        <Hero {...page.hero} />
        <Blocks
          blocks={page.layout}
          disableTopPadding={
            !page.hero || page.hero.type === 'none' || page.hero.type === 'lowImpact'
          }
        />
      </React.Fragment>
    )
  } catch (error) {
    console.error('Error fetching page:', error)
    return notFound()
  }
}
