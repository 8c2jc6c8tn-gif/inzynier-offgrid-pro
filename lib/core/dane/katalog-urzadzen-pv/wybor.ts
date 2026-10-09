/**
 * Wybór urządzenia z katalogu „jak w wyszukiwarce samochodowej” (rodzaj → producent → model), tak jak w katalogu paneli.
 * Same funkcje czyste na danych katalogu; interfejs tylko je wywołuje. Kolejność producentów i modeli to kolejność katalogu.
 */
import { KATALOG_URZADZEN_PV, type RodzajUrzadzeniaPv, type UrzadzeniePv } from "./index"

const unikalne = (xs: string[]) => [...new Set(xs)]

export const RODZAJE_URZADZEN_PV: readonly RodzajUrzadzeniaPv[] = unikalne(KATALOG_URZADZEN_PV.map((u) => u.rodzaj)) as RodzajUrzadzeniaPv[]

export const producenciUrzadzen = (rodzaj: RodzajUrzadzeniaPv): string[] =>
  unikalne(KATALOG_URZADZEN_PV.filter((u) => u.rodzaj === rodzaj).map((u) => u.producent))

export const modeleUrzadzen = (rodzaj: RodzajUrzadzeniaPv, producent: string): UrzadzeniePv[] =>
  KATALOG_URZADZEN_PV.filter((u) => u.rodzaj === rodzaj && u.producent === producent)

/** Dane wejścia PV urządzenia w postaci, jakiej używa ekran „Dopasowanie tablicy do falownika”; `null` = źródło nie podaje (pole zostaje do wpisania). */
export type ParametryWejsciaPv = {
  vMaxFalownikaV: number | null
  mpptMinV: number | null
  mpptMaxV: number | null
  iMaxMpptA: number | null
  mocFalownikaAcW: number | null
}

export function parametryWejsciaPv(u: UrzadzeniePv): ParametryWejsciaPv {
  return {
    vMaxFalownikaV: u.vocMaxV,
    mpptMinV: u.mpptMinV,
    mpptMaxV: u.mpptMaxV,
    iMaxMpptA: u.iMaxMpptA,
    mocFalownikaAcW: u.mocAcZnamionowaW,
  }
}
