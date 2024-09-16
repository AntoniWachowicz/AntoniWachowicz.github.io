/* eslint-disable @next/next/no-img-element */

import React from 'react'
import Link from 'next/link'

import { Header as HeaderType } from '../../../payload/payload-types'
import { fetchHeader } from '../../_api/fetchGlobals'
import { Gutter } from '../Gutter'
import { HeaderNav } from './Nav'

import classes from './index.module.scss'

export async function Header() {
  let header: HeaderType | null = null

  try {
    header = await fetchHeader()
  } catch (error) {
    // Error handling remains the same
  }

  return (
    <header className={classes.header}>
      <Gutter className={classes.wrap}>
        <Link href="/" className={classes.logoLink}>
          <img className={classes.logo} src="/logo.png" alt="LGD Logo" />
        </Link>
        <HeaderNav header={header} />
      </Gutter>
    </header>
  )
}
