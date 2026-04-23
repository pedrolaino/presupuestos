'use client'

import { AppProgressBar } from 'next-nprogress-bar'

export function ProgressBar() {
  return (
    <AppProgressBar
      height="2px"
      color="#1e3a5f"
      options={{ showSpinner: false }}
      shallowRouting
    />
  )
}
