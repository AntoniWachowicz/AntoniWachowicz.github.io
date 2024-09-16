'use client'

import React from 'react'
import Link from 'next/link'

import { Header as HeaderType } from '../../../../payload/payload-types'
import { useAuth } from '../../../_providers/Auth'
import { CMSLink } from '../../Link'

import classes from './index.module.scss'

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const navItems = header?.navItems || []
  const { user } = useAuth()

  return (
    <nav className={[classes.nav, user === undefined && classes.hide].filter(Boolean).join(' ')}>
      <div className={classes.navLinks}>
        {navItems.map(({ link }, i) => {
          return <CMSLink key={i} {...link} appearance="none" />
        })}
        {/* {user && <Link href="/account">Account</Link>} */}
        {/*
          // Uncomment this code if you want to add a login link to the header
          {!user && (
            <React.Fragment>
              <Link href="/login">Login</Link>
              <Link href="/create-account">Create Account</Link>
            </React.Fragment>
          )}
        */}
      </div>
    </nav>
  )
}
