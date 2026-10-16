/**
 * Starting point of the appliance list from a set template (tryb mikroinstalacji O5, owner decision 11.10.2026: templates carry only
 * the NAMES of typical loads — never powers or hours, Directive #1 / D33). The list screen owns its draft, so the template is offered
 * there and this pure helper only builds the rows to append.
 */
import { SZABLONY, type SzablonZestawu } from "@/lib/core/modules/kalkulator-mobilny/szablony-zestawow/constants"
import { OBIEKTY_MIKROINSTALACJI, type ObiektMikroinstalacji, type PozycjaZuzycia } from "@/lib/core/modules/kalkulator-mobilny/zuzycie-per-urzadzenie/input"
import type { RodzajObiektu } from "./profil-obiektu"

/** The micro-installation kind of the profile (camper, garden plot house, garage); `null` for a building or no choice. */
export function obiektMikroinstalacji(rodzaj: RodzajObiektu | "" | undefined): ObiektMikroinstalacji | null {
  return OBIEKTY_MIKROINSTALACJI.find((o) => o === rodzaj) ?? null
}

/**
 * New empty rows (no power, no hours) for the template's loads that are not on the list yet (names compared ignoring case). With `obiekt`
 * (the micro-installation kind chosen in the profile) every new row belongs to that site only; `null` = the row belongs to every site.
 */
export function pozycjeZSzablonu(
  szablon: SzablonZestawu,
  nazwa: (klucz: string) => string,
  istniejace: readonly Pick<PozycjaZuzycia, "nazwa">[],
  noweId: () => string,
  obiekt: ObiektMikroinstalacji | null = null,
): PozycjaZuzycia[] {
  const juz = new Set(istniejace.map((u) => u.nazwa.trim().toLocaleLowerCase("pl-PL")))
  const wynik: PozycjaZuzycia[] = []
  for (const p of SZABLONY[szablon]) {
    const n = nazwa(p.nazwa)
    const klucz = n.trim().toLocaleLowerCase("pl-PL")
    if (juz.has(klucz)) continue
    juz.add(klucz)
    wynik.push({ id: noweId(), nazwa: n, mocW: 0, godzinNaDobe: 0, cykliczne: false, wspolczynnikPracyPct: 0, ...(obiekt ? { obiekty: [obiekt] } : {}) })
  }
  return wynik
}
