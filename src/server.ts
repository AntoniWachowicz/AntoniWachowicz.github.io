/* eslint-disable @typescript-eslint/no-shadow */
import cors from 'cors'
import express from 'express'
import next from 'next'
import nextBuild from 'next/dist/build'
import path from 'path'
import payload from 'payload'

const app = express()
const PORT = process.env.PORT || 3000

app.use(
  cors({
    origin: [
      process.env.PAYLOAD_PUBLIC_SERVER_URL || '',
      'https://lgdbudujrazem.vercel.app',
      'https://lgdbudujrazem-6mcljy21z-antoniwachowiczs-projects.vercel.app',
    ].filter(Boolean),
    credentials: true,
  }),
)

const start = async (): Promise<void> => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || '',
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`)
    },
  })

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info(`Next.js is now building...`)
      // @ts-expect-error
      await nextBuild(path.join(__dirname, '../'))
      process.exit()
    })
    return
  }

  const nextApp = next({
    dev: process.env.NODE_ENV !== 'production',
    port: Number(PORT),
  })

  const nextHandler = nextApp.getRequestHandler()

  // Handle Payload routes
  app.use(payload.authenticate)

  // Handle Next.js routes
  app.all('*', (req, res) => {
    return nextHandler(req, res)
  })

  nextApp.prepare().then(() => {
    payload.logger.info('Starting Next.js...')

    app.listen(PORT, async () => {
      payload.logger.info(`Next.js App URL: ${process.env.PAYLOAD_PUBLIC_SERVER_URL}`)
    })
  })
}

start()
