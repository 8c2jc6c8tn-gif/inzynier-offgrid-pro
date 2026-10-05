import type { Assumption, CalcResult, Status, Warning } from "@/lib/core/calc-result"
import type { LadowanieZAgregatuInput } from "./input"
import {
  brakZapasuMocy,
  odczytajZuzycie,
  ograniczenieLadowania,
  socPozaZakresem,
  sprawnoscPozaZakresem,
  wartoscUjemna,
} from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "P_{ład} = \\min(P_{ład,max},\\ P_{agr} - P_{odb}),\\quad E = \\frac{(SOC_{stop} - SOC_{start}) \\cdot C}{100},\\quad t = \\frac{E}{\\eta \\cdot P_{ład}},\\quad V = t \\cdot q"

export type LadowanieZAgregatuResult = {
  /** Charging power actually available [kW]. */
  mocLadowaniaKw: number | null
  /** Generator load while charging, (loads + charging) / rating [%]. */
  obciazeniePct: number | null
  /** Energy put into the store between the SOC thresholds [kWh]. */
  energiaDoMagazynuKwh: number | null
  /** AC energy the charger draws from the generator for it [kWh]. */
  energiaLadowaniaAcKwh: number | null
  /** Generator run time per charging cycle [h]. */
  czasPracyH: number | null
  /** Total generator AC output during the cycle, loads included [kWh]. */
  energiaAgregatuKwh: number | null
  /** Fuel per cycle [l]; null without the datasheet l/h. */
  paliwoL: number | null
  /** Fuel per kWh of generator output in this cycle [l/kWh]. */
  litryNaKwh: number | null
  /** Fuel per kWh put into the store [l/kWh] — the loads' share is included, they run on the generator meanwhile. */
  litryNaKwhMagazynu: number | null
  /** Fuel cost per cycle [zł]; null without a price. */
  kosztZl: number | null
}

const PUSTY: LadowanieZAgregatuResult = {
  mocLadowaniaKw: null,
  obciazeniePct: null,
  energiaDoMagazynuKwh: null,
  energiaLadowaniaAcKwh: null,
  czasPracyH: null,
  energiaAgregatuKwh: null,
  paliwoL: null,
  litryNaKwh: null,
  litryNaKwhMagazynu: null,
  kosztZl: null,
}

/**
 * Charging the store from the generator (owner decision 1A, 05.10.2026). All inputs from the user. The charging
 * power is what the charger can take, limited by what the emergency-line loads leave of the generator rating; the
 * cycle runs from the start to the stop SOC threshold at constant power (CV phase near full not modelled —
 * assumption). The load % is shown so the user reads the matching l/h from the generator datasheet.
 */
export function calculateLadowanieZAgregatu(input: LadowanieZAgregatuInput): CalcResult<LadowanieZAgregatuResult> {
  const inputs: Record<string, number> = Object.fromEntries(Object.entries(input).map(([k, v]) => [k, v ?? 0]))
  const wynik = (
    status: Status,
    value: LadowanieZAgregatuResult,
    warnings: Warning[],
    assumptions: Assumption[] = [],
  ): CalcResult<LadowanieZAgregatuResult> => ({
    value,
    unit: "h",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  const errors: Warning[] = []
  for (const pole of ["mocAgregatuKw", "mocLadowarkiKw", "mocOdbiornikowKw", "pojemnoscKwh", "zuzyciePaliwaLH", "cenaPaliwaZlL"] as const) {
    const x = input[pole]
    if (x !== null && x < 0) errors.push(wartoscUjemna(pole, x))
  }
  const { socStartPct: s0, socStopPct: s1, sprawnoscLadowaniaPct: eta } = input
  if (s0 !== null && s1 !== null && !(s0 >= 0 && s1 <= 100 && s0 < s1)) errors.push(socPozaZakresem(s0, s1))
  if (eta !== null && !(eta > 0 && eta <= 100)) errors.push(sprawnoscPozaZakresem(eta))
  if (errors.length > 0) return wynik("INVALID_INPUT", PUSTY, errors)

  const { mocAgregatuKw: Pg, mocLadowarkiKw: Pl, mocOdbiornikowKw: Po, pojemnoscKwh: C } = input
  if (Pg === null || Pg <= 0 || Pl === null || Pl <= 0 || Po === null || C === null || C <= 0 || s0 === null || s1 === null || eta === null)
    return wynik("INCOMPLETE", PUSTY, [])

  const zapas = Pg - Po
  if (zapas <= 0) return wynik("VALID_WITH_WARNINGS", PUSTY, [brakZapasuMocy(Pg, Po)])

  const warnings: Warning[] = []
  if (Pl > zapas) warnings.push(ograniczenieLadowania(Pl, Po, Pg))
  const mocLadowaniaKw = Math.min(Pl, zapas)
  const obciazeniePct = ((Po + mocLadowaniaKw) / Pg) * 100
  const energiaDoMagazynuKwh = ((s1 - s0) / 100) * C
  const energiaLadowaniaAcKwh = energiaDoMagazynuKwh / (eta / 100)
  const czasPracyH = energiaLadowaniaAcKwh / mocLadowaniaKw
  const energiaAgregatuKwh = (Po + mocLadowaniaKw) * czasPracyH

  const q = input.zuzyciePaliwaLH
  const paliwoL = q !== null && q > 0 ? czasPracyH * q : null
  if (paliwoL === null) warnings.push(odczytajZuzycie(Math.round(obciazeniePct)))
  const cena = input.cenaPaliwaZlL

  const value: LadowanieZAgregatuResult = {
    mocLadowaniaKw,
    obciazeniePct,
    energiaDoMagazynuKwh,
    energiaLadowaniaAcKwh,
    czasPracyH,
    energiaAgregatuKwh,
    paliwoL,
    litryNaKwh: paliwoL !== null ? paliwoL / energiaAgregatuKwh : null,
    litryNaKwhMagazynu: paliwoL !== null ? paliwoL / energiaDoMagazynuKwh : null,
    kosztZl: paliwoL !== null && cena !== null && cena > 0 ? paliwoL * cena : null,
  }
  return wynik(warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID", value, warnings, [
    { kod: "LADAG-ZALOZENIE-STALA-MOC" },
  ])
}
