'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { naZdarzenieWersjiBazy } from '@/lib/adapters/indexeddb-storage-adapter'
import { useTranslate } from '@/lib/i18n/language-context'

// Stable ids so repeated events (every short-lived connection can fire one)
// update a single toast instead of stacking copies.
const TOAST_ODSWIEZ_ID = 'baza-wersja-odswiez'
const TOAST_ZABLOKOWANY_ID = 'baza-wersja-zablokowany'

/**
 * Standard 5.11 (copied from the standard pattern docs/przyklady/pwa/baza-wersja-listener.tsx,
 * local change: i18n hook and UI-PWA-BAZA-* keys): surfaces IndexedDB schema-version conflicts
 * between tabs. A tab running older code cannot write to a database upgraded by a newer tab
 * (VersionError on every open — autosave would fail silently), so the only safe fix is a reload —
 * offered as a persistent toast rather than done silently, so the user does not lose unsaved input.
 */
export function BazaWersjaListener() {
  const t = useTranslate()

  useEffect(
    () =>
      naZdarzenieWersjiBazy((zdarzenie) => {
        if (zdarzenie === 'upgrade-zablokowany') {
          toast.info(t('UI-PWA-BAZA-ZABLOKOWANY-TYTUL'), {
            id: TOAST_ZABLOKOWANY_ID,
            description: t('UI-PWA-BAZA-ZABLOKOWANY-OPIS'),
            duration: Infinity,
          })
          return
        }
        toast.warning(t('UI-PWA-BAZA-ODSWIEZ-TYTUL'), {
          id: TOAST_ODSWIEZ_ID,
          description: t('UI-PWA-BAZA-ODSWIEZ-OPIS'),
          duration: Infinity,
          action: { label: t('UI-PWA-ODSWIEZ'), onClick: () => window.location.reload() },
        })
      }),
    [t],
  )

  return null
}
