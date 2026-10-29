"use client"

import { useOdczytDraftu } from "@/lib/adapters/use-persisted-draft"
import { KLUCZ_PROFILU_OBIEKTU, type ProfilObiektu, type RodzajObiektu } from "./profil-obiektu"

/**
 * The kind of site chosen in Settings (read once when the screen opens; a change made in Settings shows after reopening the screen).
 * `""` until chosen or until the profile is read — so nothing is hidden before the choice is known.
 */
export function useRodzajObiektu(): RodzajObiektu | "" {
  const { dane } = useOdczytDraftu<ProfilObiektu>(KLUCZ_PROFILU_OBIEKTU)
  return dane?.rodzaj ?? ""
}
