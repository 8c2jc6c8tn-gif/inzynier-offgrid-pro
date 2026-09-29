'use client'

import { useSyncExternalStore, type CSSProperties } from 'react'
import { Toaster } from 'sonner'
import { getServerSnapshot, getSnapshot, subscribe } from '@/lib/theme/storage'

// Colours from the app's own tokens (app/globals.css), so a toast follows the dark mode and the
// custom colours from Settings (lib/wyglad) instead of sonner's built-in palette.
const KOLORY = {
  '--normal-bg': 'var(--popover)',
  '--normal-text': 'var(--popover-foreground)',
  '--normal-border': 'var(--border)',
} as CSSProperties

/**
 * App-wide toast host (sonner, D59 C-1). Used by the service worker update prompt
 * (components/pwa/sw-rejestracja.tsx) and the IndexedDB version collision prompt (standard 5.11,
 * components/pwa/baza-wersja-listener.tsx). Top-centre: the AI assistant button sits bottom-right.
 * Font size in rem, so it scales with the enlarged font from Settings.
 */
export function Powiadomienia() {
  const motyw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  return (
    <Toaster
      position="top-center"
      theme={motyw}
      style={KOLORY}
      toastOptions={{ style: { fontSize: '1rem' } }}
    />
  )
}
