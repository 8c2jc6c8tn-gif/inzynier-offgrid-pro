/**
 * Zużycie mikroinstalacji w 12 miesiącach z listy odbiorników Modułu 12 („Zużycie energii per urządzenie”, draft
 * `zuzycie-per-urzadzenie`) i miesięcy użytkowania z profilu obiektu. Czyste funkcje; ekrany czytają dwa drafty i wołają tę funkcję.
 */
import { calculateZuzyciePerUrzadzenie } from "@/lib/core/modules/kalkulator-mobilny/zuzycie-per-urzadzenie/calculator"
import type { PozycjaZuzycia } from "@/lib/core/modules/kalkulator-mobilny/zuzycie-per-urzadzenie/input"
import { zuzycieMiesieczneKwh, type ProfilObiektu } from "./profil-obiektu"

export const KLUCZ_DRAFTU_ODBIORNIKOW = "zuzycie-per-urzadzenie"

export type DraftOdbiornikow = { urzadzenia: PozycjaZuzycia[] }

/** Dobowe zużycie listy odbiorników [Wh]; `null`, gdy lista niekompletna (np. odbiornik cykliczny bez współczynnika pracy) albo pusta. */
export function dobowaWhZOdbiornikow(draft: DraftOdbiornikow | null): number | null {
  if (!draft) return null
  const wynik = calculateZuzyciePerUrzadzenie({ urzadzenia: draft.urzadzenia })
  return wynik.status === "VALID" && wynik.value.sumaWh > 0 ? wynik.value.sumaWh : null
}

export function zuzycieMikroinstalacjiKwh(odbiorniki: DraftOdbiornikow | null, profil: ProfilObiektu | null): number[] | null {
  const dobowa = dobowaWhZOdbiornikow(odbiorniki)
  return dobowa === null || !profil ? null : zuzycieMiesieczneKwh(dobowa, profil.miesiaceUzytkowania)
}
