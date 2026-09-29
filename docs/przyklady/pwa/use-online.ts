'use client'

import { useSyncExternalStore } from 'react'
import { jestOnline } from '@/lib/ai/dostepnosc'

/**
 * Subskrypcja zdarzeń `online`/`offline` na `window` — wydzielona z hooka
 * jako czysta funkcja, żeby dało się ją przetestować w środowisku `node`
 * (vitest bez jsdom, stub `window` przez `vi.stubGlobal`).
 */
export function subskrybujOnline(powiadom: () => void): () => void {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('online', powiadom)
  window.addEventListener('offline', powiadom)
  return () => {
    window.removeEventListener('online', powiadom)
    window.removeEventListener('offline', powiadom)
  }
}

/**
 * Serwer/statyczny HTML zawsze zakłada "online" — pierwszy render klienta
 * (hydracja) jest wtedy identyczny z HTML-em z buildu, a realny stan
 * `navigator.onLine` React podmienia zaraz po hydracji (kontrakt
 * `useSyncExternalStore`), bez hydration mismatch.
 */
function odczytajOnlineSerwer(): boolean {
  return true
}

/**
 * Stan połączenia na żywo (P3 planu PWA, docs/silnik/pwa-plan-v1_0.md).
 * `useSyncExternalStore` zamiast useState+useEffect — ten sam kanoniczny
 * wzorzec co `useReducedMotion` (components/model-3d/hooks.ts). Źródło
 * prawdy to `jestOnline()` z lib/ai/dostepnosc.ts, z jego zastrzeżeniem:
 * `navigator.onLine === true` nie gwarantuje działającego internetu (słabe
 * łącze, portal Wi-Fi) — `false` jest za to wiarygodne, więc wskaźnik
 * "offline" nie kłamie, co najwyżej czasem się nie pokaże.
 */
export function useOnline(): boolean {
  return useSyncExternalStore(subskrybujOnline, jestOnline, odczytajOnlineSerwer)
}
