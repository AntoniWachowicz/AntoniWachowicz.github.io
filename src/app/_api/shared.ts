/* eslint-disable no-console */
// shared.ts

export const GRAPHQL_API_URL = (() => {
  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    // Use the public server URL if it's set (production/staging)
    return process.env.NEXT_PUBLIC_SERVER_URL
  } else if (process.env.NEXT_BUILD) {
    // Use localhost during the build process
    return `http://localhost:${process.env.PORT || 3000}`
  } else if (typeof window !== 'undefined') {
    // In the browser, use the current origin
    return window.location.origin
  } else {
    // Fallback for other server-side contexts
    return process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000'
  }
})()

console.log('GRAPHQL_API_URL:', GRAPHQL_API_URL)
