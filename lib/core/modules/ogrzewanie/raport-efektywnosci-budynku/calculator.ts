import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import { copPonizejJednosci, ujemneWartosci } from "../wspolne/walidacja"
import type { RaportEfektywnosciInput } from "./input"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "udział_i = \\dfrac{\\Phi_i}{\\sum \\Phi}, \\quad EU = \\dfrac{Q_{rok}}{A}, \\quad E_{el} = \\dfrac{Q_{rok}}{COP}, \\quad K = E_{el} \\cdot c"

export type PozycjaRaportu = { nazwa: string; strataW: number; udzialPct: number }

export type RaportEfektywnosciResult = {
  /** Straty od największej do najmniejszej. */
  ranking: PozycjaRaportu[]
  /** Suma strat [W]. */
  sumaW: number
  /** Ciepło na m² powierzchni w roku [kWh/(m²·rok)]; null = brak ciepła rocznego albo powierzchni. */
  wskaznikKwhM2Rok: number | null
  /** Prąd na ogrzewanie w roku [kWh]; null = brak ciepła rocznego albo COP. */
  energiaElRokKwh: number | null
  /** Koszt ogrzewania w roku [zł]; null = brak prądu rocznego albo ceny. */
  kosztRokZl: number | null
}

const PUSTY: RaportEfektywnosciResult = { ranking: [], sumaW: 0, wskaznikKwhM2Rok: null, energiaElRokKwh: null, kosztRokZl: null }

/**
 * Moduł 6, Część 2B — dokładka do Ekranu 1: raport efektywności (dawne 5.40) i „które elementy wpływają najwięcej”
 * z bilansu (dawne 5.67). Liczy tylko to, co wynika z danych: ranking strat Ekranu 1 (przegrody + wentylacja),
 * wskaźnik ciepła na m² i rok, prąd Q/COP i koszt. **Nie liczy** (Dyrektywa #1): klasy energetycznej (źródło „klasa
 * C → A” bez progów klas), energii pierwotnej (brak współczynników nakładu w źródle), potencjału oszczędności
 * „2500 kWh” (wymaga listy działań — Ekran 2D „wpływ czynnika”), Sankeya z PV i baterią (brak modelu przepływów).
 * Część 5.67 „pompa pokrywa 80%, grzałki 20%” liczy dokładka Ekranu 5 (dobór mocy pompy).
 */
export function calculateRaportEfektywnosci(input: RaportEfektywnosciInput): CalcResult<RaportEfektywnosciResult> {
  const errors = [
    ...ujemneWartosci({
      cieploRokKwh: input.cieploRokKwh,
      powierzchniaM2: input.powierzchniaM2,
      cenaZlKwh: input.cenaZlKwh,
      ...Object.fromEntries(input.pozycje.map((p, i) => [`pozycje[${i}].strataW`, p.strataW])),
    }),
    ...copPonizejJednosci("cop", input.cop),
  ]
  const inputs = {
    cieploRokKwh: input.cieploRokKwh,
    powierzchniaM2: input.powierzchniaM2,
    cop: input.cop,
    cenaZlKwh: input.cenaZlKwh,
    pozycje: input.pozycje.length,
  }
  const baza = { unit: "%", formula: FORMULA, formulaKey: "UI-FORMULA-OGRZEWANIE-RAPORT-EFEKTYWNOSCI-BUDYNKU", inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  const sumaW = input.pozycje.reduce((s, p) => s + p.strataW, 0)
  if (sumaW === 0) return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }

  const ranking = input.pozycje
    .filter((p) => p.strataW > 0)
    .map((p) => ({ nazwa: p.nazwa, strataW: p.strataW, udzialPct: (p.strataW / sumaW) * 100 }))
    .sort((a, b) => b.strataW - a.strataW)
  const zRokiem = input.cieploRokKwh > 0
  const energiaElRokKwh = zRokiem && input.cop > 0 ? input.cieploRokKwh / input.cop : null
  const value: RaportEfektywnosciResult = {
    ranking,
    sumaW,
    wskaznikKwhM2Rok: zRokiem && input.powierzchniaM2 > 0 ? input.cieploRokKwh / input.powierzchniaM2 : null,
    energiaElRokKwh,
    kosztRokZl: energiaElRokKwh !== null && input.cenaZlKwh > 0 ? energiaElRokKwh * input.cenaZlKwh : null,
  }
  const assumptions: Assumption[] = [{ kod: "RAP-ZAL-BEZ-KLASY" }]
  return { ...baza, value, status: "VALID", assumptions, warnings: [] }
}
