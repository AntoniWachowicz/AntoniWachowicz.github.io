export const GRAPHQL_API_URL = process.env.NEXT_BUILD
  ? `http://localhost:${process.env.PORT || 3000}`
  : process.env.NEXT_PUBLIC_SERVER_URL
