/* eslint-disable no-console */
module.exports = async () => {
  const staticRedirects = [
    {
      source: '/:path((?!ie-incompatible.html$).*)',
      has: [
        {
          type: 'header',
          key: 'user-agent',
          value: '(.*Trident.*)',
        },
      ],
      permanent: false,
      destination: '/ie-incompatible.html',
    },
    // Add any other known static redirects here
  ]

  // If we're in a build environment (like Vercel), return only static redirects
  if (process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV !== 'production') {
    console.log('Build environment detected. Using only static redirects.')
    return staticRedirects
  }

  try {
    if (process.env.NEXT_PUBLIC_SERVER_URL) {
      const redirectsRes = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/redirects?limit=1000&depth=1`,
      ).catch(error => {
        console.warn('Failed to fetch redirects:', error)
        return null
      })

      if (redirectsRes && redirectsRes.ok) {
        const redirectsData = await redirectsRes.json()
        const { docs } = redirectsData

        let dynamicRedirects = []

        if (docs) {
          docs.forEach(doc => {
            const { from, to: { type, url, reference } = {} } = doc

            let source = from
              .replace(process.env.NEXT_PUBLIC_SERVER_URL, '')
              .split('?')[0]
              .toLowerCase()

            if (source.endsWith('/')) source = source.slice(0, -1)

            let destination = '/'

            if (type === 'custom' && url) {
              destination = url.replace(process.env.NEXT_PUBLIC_SERVER_URL, '')
            }

            if (
              type === 'reference' &&
              typeof reference.value === 'object' &&
              reference?.value?._status === 'published'
            ) {
              destination = `${process.env.NEXT_PUBLIC_SERVER_URL}/${
                reference.relationTo !== 'pages' ? `${reference.relationTo}/` : ''
              }${reference.value.slug}`
            }

            if (source.startsWith('/') && destination && source !== destination) {
              dynamicRedirects.push({ source, destination, permanent: true })
            }
          })
        }

        return [...staticRedirects, ...dynamicRedirects]
      }
    }

    console.warn(
      'Using only static redirects due to fetch failure or missing NEXT_PUBLIC_SERVER_URL',
    )
    return staticRedirects
  } catch (error) {
    console.error(`Error configuring redirects: ${error}`)
    return staticRedirects
  }
}
