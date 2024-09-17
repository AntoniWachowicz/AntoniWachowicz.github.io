/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
// import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

// import type { Config } from '../../payload/payload-types'
// import { PAGE } from '../_graphql/pages'
// import { POST } from '../_graphql/posts'
// import { PROJECT } from '../_graphql/projects'
// import { GRAPHQL_API_URL } from './shared'
// import { payloadToken } from './token'

// const queryMap = {
//   pages: {
//     query: PAGE,
//     key: 'Pages',
//   },
//   posts: {
//     query: POST,
//     key: 'Posts',
//   },
//   projects: {
//     query: PROJECT,
//     key: 'Projects',
//   },
// }

// export const fetchDoc = async <T>(args: {
//   collection: keyof Config['collections']
//   slug?: string
//   id?: string
//   draft?: boolean
// }): Promise<T> => {
//   const { collection, slug, draft } = args || {}

//   if (!queryMap[collection]) throw new Error(`Collection ${collection} not found`)

//   let token: RequestCookie | undefined

//   if (draft) {
//     const { cookies } = await import('next/headers')
//     token = cookies().get(payloadToken)
//   }

//   const doc: T = await fetch(`${GRAPHQL_API_URL}/api/graphql`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token?.value && draft ? { Authorization: `JWT ${token.value}` } : {}),
//     },
//     cache: 'no-store',
//     next: { tags: [`${collection}_${slug}`] },
//     body: JSON.stringify({
//       query: queryMap[collection].query,
//       variables: {
//         slug,
//         draft,
//       },
//     }),
//   })
//     ?.then(res => res.json())
//     ?.then(res => {
//       if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching doc')
//       return res?.data?.[queryMap[collection].key]?.docs?.[0]
//     })

//   return doc
// }

import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

import type { Config } from '../../payload/payload-types'
import { GRAPHQL_API_URL } from './shared'
import { payloadToken } from './token'

export const fetchDoc = async <T>(args: {
  collection: keyof Config['collections']
  slug?: string
  id?: string
  draft?: boolean
}): Promise<T> => {
  const { collection, slug, id, draft } = args || {}

  console.log('fetchDoc called with:', { collection, slug, id, draft });

  let token: RequestCookie | undefined

  if (draft) {
    const { cookies } = await import('next/headers')
    token = cookies().get(payloadToken)
  }

  const queryParam = slug ? `slug=${slug}` : id ? `id=${id}` : ''
  const draftParam = draft ? '&draft=true' : ''

  const url = `${GRAPHQL_API_URL}/api/${collection}?where[${queryParam}]${draftParam}`
  console.log('Fetching from URL:', url);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token?.value && draft ? { Authorization: `JWT ${token.value}` } : {}),
      },
      cache: 'no-store',
      next: { tags: [`${collection}_${slug || id}`] },
    });

    if (!response.ok) {
      console.error('Fetch error:', response.status, response.statusText);
      throw new Error(`Error fetching doc: ${response.statusText}`);
    }

    const responseData = await response.json();
    console.log('Response data:', responseData);

    if (responseData.errors) {
      console.error('API returned errors:', responseData.errors);
      throw new Error(responseData?.errors?.[0]?.message ?? 'Error fetching doc');
    }

    const doc = responseData?.docs?.[0];

    if (!doc) {
      console.error('No document found in response');
      throw new Error(
        `No document found for ${collection} with ${slug ? `slug "${slug}"` : `id "${id}"`}`,
      );
    }

    return doc;
  } catch (error: unknown) {
    console.error('Error in fetchDoc:', error);
    throw error;
  }
}
