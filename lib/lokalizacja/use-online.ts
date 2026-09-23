"use client"

import { useSyncExternalStore } from "react"

function subskrybuj(zmiana: () => void) {
  window.addEventListener("online", zmiana)
  window.addEventListener("offline", zmiana)
  return () => {
    window.removeEventListener("online", zmiana)
    window.removeEventListener("offline", zmiana)
  }
}

/**
 * Stan sieci przeglądarki (`navigator.onLine`). `false` jest pewne (brak sieci), `true` znaczy
 * tylko "jest jakieś połączenie" — dlatego każde wywołanie ULDK/PVGIS i tak obsługuje błąd sieci.
 * Serwer (SSR) zakłada online — pierwszy render klienta to poprawi.
 */
export function useOnline(): boolean {
  return useSyncExternalStore(subskrybuj, () => navigator.onLine, () => true)
}
