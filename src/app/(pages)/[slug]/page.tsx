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

export default async function Page({ params: { slug = 'home' } }) {
  const { isEnabled: isDraftMode } = draftMode()

  let page: Page | null = null
  let pages: Page[] | { docs: Page[] } = []

  try {
    if (slug === '' || slug === 'home') {
      pages = await fetchDocs<Page>('pages')
      page = Array.isArray(pages)
        ? pages.find(p => p.slug === 'home')
        : pages.docs.find(p => p.slug === 'home')
    } else {
      page = await fetchDoc<Page>({
        collection: 'pages',
        slug,
        draft: isDraftMode,
      })
    }
    pages = await fetchDocs<Page>('pages')
  } catch (error) {
    // when deploying this template on Payload Cloud, this page needs to build before the APIs are live
    // so swallow the error here and simply render the page with fallback data where necessary
    // in production you may want to redirect to a 404  page or at least log the error somewhere
    // console.error(error)
  }

  // if no `home` page exists, render a static one using dummy content
  // you should delete this code once you have a home page in the CMS
  // this is really only useful for those who are demoing this template

  if (!page) {
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
}

export async function generateStaticParams() {
  try {
    const pagesData = await fetchDocs<Page>('pages')

    // Type guard to check if pagesData is an array or an object with a docs property
    const isPageArray = (data: Page[] | { docs: Page[] }): data is Page[] => {
      return Array.isArray(data)
    }

    const pages = isPageArray(pagesData) ? pagesData : pagesData.docs

    // Filter out any pages without a slug and map to the correct format
    return [
      { slug: '' },
      ...pages
        .filter((page): page is Page & { slug: string } => typeof page.slug === 'string')
        .map(({ slug }) => ({ slug })),
    ]
  } catch (error) {
    return []
  }
}

export async function generateMetadata({ params: { slug = 'home' } }): Promise<Metadata> {
  const { isEnabled: isDraftMode } = draftMode()

  let page: Page | null = null

  try {
    page = await fetchDoc<Page>({
      collection: 'pages',
      slug,
      draft: isDraftMode,
    })
  } catch (error) {
    // don't throw an error if the page is not found
    // instead, we'll render a 404 page
  }

  if (!page) {
    return {}
  }

  return generateMeta({ doc: page })
}
