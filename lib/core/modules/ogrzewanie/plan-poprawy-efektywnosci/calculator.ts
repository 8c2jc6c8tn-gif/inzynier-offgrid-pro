import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { copPonizejJednosci, ujemneWartosci } from "../wspolne/walidacja"
import type { PlanPoprawyInput } from "./input"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "E_i = \\dfrac{Q_i}{COP}, \\quad Z_i = E_i \\cdot c, \\quad T_{zwrotu,i} = \\dfrac{K_i}{Z_i}, \\quad \\text{kolejność: } T_{zwrotu} \\uparrow"

export type PozycjaPlanu = {
  /** Indeks działania na wejściu. */
  indeks: number
  nazwa: string
  oszczednoscCieplaKwh: number
  /** Oszczędność prądu w roku [kWh]. */
  oszczednoscPraduKwh: number
  /** Oszczędność w roku [zł]; null = brak ceny. */
  oszczednoscZlRok: number | null
  /** Prosty okres zwrotu [lata]; null = brak kosztu albo ceny. */
  zwrotLat: number | null
}

export type PlanPoprawyResult = {
  /** Działania od najszybszego zwrotu (bez zwrotu — na końcu, od największej oszczędności). */
  plan: PozycjaPlanu[]
  /** Suma oszczędności prądu, gdyby działania sumowały się wprost [kWh] — górna granica. */
  sumaPraduKwh: number
}

const PUSTY: PlanPoprawyResult = { plan: [], sumaPraduKwh: 0 }

/**
 * Moduł 6, Część 2C — rekomendacje poprawy efektywności (dawne 5.68), Wzorzec G. Źródło: „sortuje według zwrotu
 * z inwestycji, podaje szacunkowe oszczędności energii i pieniędzy”, „zacznij od najtańszych i najszybszych”.
 * Aplikacja nie zna kosztów ani oszczędności działań (to dane z oferty i z ekranu „Wpływ czynnika”), więc user
 * wpisuje listę, a silnik liczy prąd Q/COP, złotówki, prosty zwrot K/Z i sortuje rosnąco po zwrocie (✅🤖: prosty
 * zwrot bez zmian cen, inflacji i dotacji). Oszczędności działań nie sumują się wprost (po dociepleniu dachu okna
 * tracą tyle samo W, ale udział zmienia się; po wymianie źródła ciepła każda kWh ciepła jest tańsza) — suma to
 * górna granica (ℹ️).
 *
 * Przykład źródła: „1. Izolacja dachu — 2000 kWh, zwrot po 3 latach. 2. Wymiana okien — 800 kWh, zwrot po 8
 * latach” — bez kosztów i ceny, więc nieodtwarzalny liczbowo; nie mówi też, czy kWh to ciepło, czy prąd (Dyrektywa
 * #5). Test pokazuje spójny zestaw (koszty dobrane do zwrotu 3 i 8 lat przy COP 1 i 1 zł/kWh).
 */
export function calculatePlanPoprawy(input: PlanPoprawyInput): CalcResult<PlanPoprawyResult> {
  const errors = [
    ...ujemneWartosci({
      cenaZlKwh: input.cenaZlKwh,
      ...Object.fromEntries(
        input.dzialania.flatMap((d, i) => [
          [`dzialania[${i}].oszczednoscCieplaKwh`, d.oszczednoscCieplaKwh],
          [`dzialania[${i}].kosztZl`, d.kosztZl],
        ]),
      ),
    }),
    ...copPonizejJednosci("cop", input.cop),
  ]
  const inputs = { cop: input.cop, cenaZlKwh: input.cenaZlKwh, dzialania: input.dzialania.length }
  const baza = { unit: "lata", formula: FORMULA, formulaKey: "UI-FORMULA-OGRZEWANIE-PLAN-POPRAWY-EFEKTYWNOSCI", inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  const wpisane = input.dzialania.map((d, indeks) => ({ ...d, indeks })).filter((d) => d.oszczednoscCieplaKwh > 0)
  if (input.cop === 0 || wpisane.length === 0) return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }

  const plan = wpisane
    .map((d): PozycjaPlanu => {
      const oszczednoscPraduKwh = d.oszczednoscCieplaKwh / input.cop
      const oszczednoscZlRok = input.cenaZlKwh > 0 ? oszczednoscPraduKwh * input.cenaZlKwh : null
      return {
        indeks: d.indeks,
        nazwa: d.nazwa,
        oszczednoscCieplaKwh: d.oszczednoscCieplaKwh,
        oszczednoscPraduKwh,
        oszczednoscZlRok,
        zwrotLat: oszczednoscZlRok !== null && d.kosztZl > 0 ? d.kosztZl / oszczednoscZlRok : null,
      }
    })
    .sort((a, b) => {
      if (a.zwrotLat !== null && b.zwrotLat !== null) return a.zwrotLat - b.zwrotLat
      if (a.zwrotLat !== null) return -1
      if (b.zwrotLat !== null) return 1
      return b.oszczednoscPraduKwh - a.oszczednoscPraduKwh
    })
  const warnings: Warning[] =
    plan.length > 1
      ? [{ code: "PLAN-NIE-SUMUJ", level: "info", i18nKey: "PLAN-NIE-SUMUJ", technicalMessage: `${plan.length} działań — suma to górna granica`, field: "dzialania" }]
      : []
  const assumptions: Assumption[] = [{ kod: "PLAN-ZAL-PROSTY-ZWROT" }]
  return {
    ...baza,
    value: { plan, sumaPraduKwh: plan.reduce((s, p) => s + p.oszczednoscPraduKwh, 0) },
    status: "VALID",
    assumptions,
    warnings,
  }
}
