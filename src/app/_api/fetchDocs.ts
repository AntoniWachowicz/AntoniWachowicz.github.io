// import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

// import type { Config } from '../../payload/payload-types'
// import { PAGES } from '../_graphql/pages'
// import { POSTS } from '../_graphql/posts'
// import { PROJECTS } from '../_graphql/projects'
// import { GRAPHQL_API_URL } from './shared'
// import { payloadToken } from './token'

// const queryMap = {
//   pages: {
//     query: PAGES,
//     key: 'Pages',
//   },
//   posts: {
//     query: POSTS,
//     key: 'Posts',
//   },
//   projects: {
//     query: PROJECTS,
//     key: 'Projects',
//   },
// }

// export const fetchDocs = async <T>(
//   collection: keyof Config['collections'],
//   draft?: boolean,
//   variables?: Record<string, unknown>,
// ): Promise<T[]> => {
//   if (!queryMap[collection]) throw new Error(`Collection ${collection} not found`)

//   let token: RequestCookie | undefined

//   if (draft) {
//     const { cookies } = await import('next/headers')
//     token = cookies().get(payloadToken)
//   }

//   const docs: T[] = await fetch(`${GRAPHQL_API_URL}/api/graphql`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       ...(token?.value && draft ? { Authorization: `JWT ${token.value}` } : {}),
//     },
//     cache: 'no-store',
//     next: { tags: [collection] },
//     body: JSON.stringify({
//       query: queryMap[collection].query,
//       variables,
//     }),
//   })
//     ?.then(res => res.json())
//     ?.then(res => {
//       if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching docs')

//       return res?.data?.[queryMap[collection].key]?.docs
//     })

//   return docs
// }

import type { RequestCookie } from 'next/dist/compiled/@edge-runtime/cookies'

import type { Config } from '../../payload/payload-types'
import { GRAPHQL_API_URL } from './shared'
import { payloadToken } from './token'

export const fetchDocs = async <T>(
  collection: keyof Config['collections'],
  draft?: boolean,
  options: {
    page?: number
    limit?: number
    where?: Record<string, unknown>
    sort?: string
    depth?: number
  } = {},
): Promise<{ docs: T[]; totalDocs: number; totalPages: number; page: number }> => {
  const { page = 1, limit = 10, where, sort, depth } = options

  let token: RequestCookie | undefined

  if (draft) {
    const { cookies } = await import('next/headers')
    token = cookies().get(payloadToken)
  }

  const searchParams = new URLSearchParams({
    depth: depth?.toString() || '1',
    draft: draft ? 'true' : 'false',
    page: page.toString(),
    limit: limit.toString(),
  })

  if (where) {
    searchParams.append('where', JSON.stringify(where))
  }

  if (sort) {
    searchParams.append('sort', sort)
  }

  const result = await fetch(`${GRAPHQL_API_URL}/api/${collection}?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token?.value && draft ? { Authorization: `JWT ${token.value}` } : {}),
    },
    cache: 'no-store',
    next: { tags: [collection] },
  })
    .then(res => {
      if (!res.ok) throw new Error(`Error fetching docs: ${res.statusText}`)
      return res.json()
    })
    .then(res => {
      if (res.errors) throw new Error(res?.errors?.[0]?.message ?? 'Error fetching docs')
      return res
    })

  return {
    docs: result.docs,
    totalDocs: result.totalDocs,
    totalPages: result.totalPages,
    page: result.page,
  }
}
