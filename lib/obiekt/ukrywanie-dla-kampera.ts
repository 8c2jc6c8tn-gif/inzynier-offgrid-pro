/**
 * What a camper does not have (owner decision 29.10.2026, card "Dla kogo ukryć ekrany budynkowe": only the camper; audit
 * `analizy/przeglad-pol-budynku-mikroinstalacja-2026-10-12.md`). Hiding is a convenience, not a lock: a hidden screen still opens from
 * a link (other screens link to some of them) or a typed address, and
 * a hidden field counts as "not applicable" (neutral value passed to the calculator, nothing guessed).
 * No choice yet (`""`) or any other kind of site = nothing hidden, as before.
 */
import type { RodzajObiektu } from "./profil-obiektu"

/** Screens about a building shell or a building's escape routes — removed from the module lists for a camper. */
export const EKRANY_BUDYNKOWE_UKRYTE_DLA_KAMPERA: readonly string[] = [
  "/kalkulatory/orientacja-powierzchni",
  "/kalkulatory/klapy-pozarowe",
  "/kalkulatory/zamki-drzwi-ewakuacyjnych",
  "/kalkulatory/oswietlenie-awaryjne",
]

/** True when fields that only make sense for a building (heating season, lightning rod) are hidden for this kind of site. */
export function czyUkryjPolaBudynku(rodzaj: RodzajObiektu | "" | undefined): boolean {
  return rodzaj === "kamper"
}

/** The screens of a module list that stay visible for this kind of site (the order is kept). */
export function ekranyWidoczneDlaObiektu<T extends { href: string }>(ekrany: readonly T[], rodzaj: RodzajObiektu | "" | undefined): T[] {
  if (!czyUkryjPolaBudynku(rodzaj)) return [...ekrany]
  return ekrany.filter((e) => !EKRANY_BUDYNKOWE_UKRYTE_DLA_KAMPERA.includes(e.href))
}
