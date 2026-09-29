'use client'

import { useEffect } from 'react'
import { toast } from 'sonner'
import { naZdarzenieWersjiBazy } from '@/lib/store/indexeddb-baza'
import { useT } from '@/lib/i18n/use-t'

// Stable ids so repeated events (every short-lived connection can fire one)
// update a single toast instead of stacking copies.
const TOAST_ODSWIEZ_ID = 'baza-wersja-odswiez'
const TOAST_ZABLOKOWANY_ID = 'baza-wersja-zablokowany'

/**
 * PWA P0.3 (docs/silnik/pwa-plan-v1_0.md): surfaces IndexedDB schema-version
 * conflicts between tabs. A tab running older code cannot write to a database
 * upgraded by a newer tab (VersionError on every open), so the only safe fix
 * is a reload — offered as a persistent toast rather than done silently, so
 * the user does not lose unsaved form input.
 */
export function BazaWersjaListener() {
  const { t } = useT()

  useEffect(
    () =>
      naZdarzenieWersjiBazy((zdarzenie) => {
        if (zdarzenie === 'upgrade-zablokowany') {
          toast.info(t('baza.wersja.zablokowanyTytul'), {
            id: TOAST_ZABLOKOWANY_ID,
            description: t('baza.wersja.zablokowanyOpis'),
            duration: Infinity,
          })
          return
        }
        toast.warning(t('baza.wersja.odswiezTytul'), {
          id: TOAST_ODSWIEZ_ID,
          description: t('baza.wersja.odswiezOpis'),
          duration: Infinity,
          action: { label: t('baza.wersja.odswiezAkcja'), onClick: () => window.location.reload() },
        })
      }),
    [t],
  )

  return null
}
