'use client'

import Link from 'next/link'
import { useTranslate } from '@/lib/i18n/language-context'

/**
 * 404 page for unknown URLs. The service worker precaches it as `/_not-found` and serves it to an
 * offline navigation that is not in the precache (D59, lib/pwa/sw-rdzen.js), so it must read well
 * without network in every language — client component, text from lib/i18n/ui/pwa.ts.
 */
export default function NieZnaleziono() {
  const t = useTranslate()
  return (
    <main className="mx-auto flex max-w-md flex-col gap-4 p-6">
      <h1 className="text-h1 font-semibold">{t('UI-PWA-404-TYTUL')}</h1>
      <p className="text-muted-foreground">{t('UI-PWA-404-OPIS')}</p>
      <Link
        href="/"
        className="w-fit rounded-md text-small text-primary underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        ← {t('UI-PWA-404-PULPIT')}
      </Link>
    </main>
  )
}
