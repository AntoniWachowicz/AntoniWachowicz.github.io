import React from 'react'
import { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import { Page, Post } from '../../../../payload/payload-types'
import { fetchDoc } from '../../../_api/fetchDoc'
import { fetchDocs } from '../../../_api/fetchDocs'
import { Blocks } from '../../../_components/Blocks'
import { PremiumContent } from '../../../_components/PremiumContent'
import { PostHero } from '../../../_heros/PostHero'
import { generateMeta } from '../../../_utilities/generateMeta'

// Force this page to be dynamic so that Next.js does not cache it
// See the note in '../../../[slug]/page.tsx' about this
export const dynamic = 'force-dynamic'

export default async function Post({ params: { slug } }) {
  const { isEnabled: isDraftMode } = draftMode()

  let post: Post | null = null

  try {
    post = await fetchDoc<Post>({
      collection: 'posts',
      slug,
      draft: isDraftMode,
    })
  } catch (error) {
    console.error(error) // eslint-disable-line no-console
  }

  if (!post) {
    notFound()
  }

  const { layout, relatedPosts, enablePremiumContent, premiumContent } = post

  return (
    <React.Fragment>
      <PostHero post={post} />
      <Blocks blocks={layout} />
      {enablePremiumContent && <PremiumContent postSlug={slug as string} disableTopPadding />}
      <Blocks
        disableTopPadding
        blocks={[
          {
            blockType: 'relatedPosts',
            blockName: 'Related Posts',
            relationTo: 'posts',
            introContent: [
              {
                type: 'h4',
                children: [
                  {
                    text: 'Related posts',
                  },
                ],
              },
              {
                type: 'p',
                children: [
                  {
                    text: 'The posts displayed here are individually selected for this page. Admins can select any number of related posts to display here and the layout will adjust accordingly. Alternatively, you could swap this out for the "Archive" block to automatically populate posts by category complete with pagination. To manage related posts, ',
                  },
                  {
                    type: 'link',
                    url: `/admin/collections/posts/${post.id}`,
                    children: [
                      {
                        text: 'navigate to the admin dashboard',
                      },
                    ],
                  },
                  {
                    text: '.',
                  },
                ],
              },
            ],
            docs: relatedPosts,
          },
        ]}
      />
    </React.Fragment>
  )
}

type PagesResponse = {
  docs: Page[]
  totalDocs: number
  totalPages: number
  page: number
}

export async function generateStaticParams() {
  try {
    const pagesData = await fetchDocs<Page>('pages')

    // Ensure pagesData is of the expected type
    if (!('docs' in pagesData)) {
      // eslint-disable-next-line no-console
      console.error('Unexpected response structure from fetchDocs')
      return []
    }

    // Now TypeScript knows pagesData has a docs property
    const pages = (pagesData as PagesResponse).docs

    // Filter out any pages without a slug and map to the correct format
    return pages
      .filter((page): page is Page & { slug: string } => typeof page.slug === 'string')
      .map(({ slug }) => ({ slug }))
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error generating static params:', error)
    return []
  }
}

export async function generateMetadata({ params: { slug } }): Promise<Metadata> {
  const { isEnabled: isDraftMode } = draftMode()

  let post: Post | null = null

  try {
    post = await fetchDoc<Post>({
      collection: 'posts',
      slug,
      draft: isDraftMode,
    })
  } catch (error) {}

  return generateMeta({ doc: post })
}
