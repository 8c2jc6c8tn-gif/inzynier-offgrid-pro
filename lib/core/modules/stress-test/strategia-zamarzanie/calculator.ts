import type { Assumption, CalcResult, Status, Warning } from "@/lib/core/calc-result"
import { PROG_ODLACZENIA_PRIORYTET_2_SOC_PCT } from "@/lib/core/modules/zapotrzebowanie/load-shedding/constants"
import type { OdbiornikZimowy, StrategiaZamarzanieInput } from "./input"
import { brakKrytycznych, komfortOdlaczony, mocUjemna, pojemnoscUjemna, procentPozaZakresem, socPonizejMinimum, wazneOdlaczanePrzyProgu } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "t_A = \\frac{C \\eta (SoC_0 - max(20\\%, SoC_{min}))}{P_1 + P_2};\\; t_B = \\frac{C \\eta (min(SoC_0, 20\\%) - SoC_{min})}{P_1}"

export type StrategiaZamarzanieResult = {
  mocKrytycznychW: number
  mocWaznychW: number
  mocKomfortuW: number
  /** Czas pracy z krytycznymi + ważnymi, do progu odłączenia ważnych [h]. */
  czasEtapuAH: number | null
  /** Czas pracy samych krytycznych, od progu do minimum [h]. */
  czasEtapuBH: number | null
  /** Łączny czas zasilania odbiorników krytycznych [h]. null = brak krytycznych. */
  czasKrytycznychH: number | null
}

const nazwyPriorytetu = (lista: OdbiornikZimowy[], p: number) =>
  lista
    .map((o, i) => ({ ...o, i }))
    .filter((o) => o.priorytet === p && (o.mocW ?? 0) > 0)
    .map((o) => o.nazwa.trim() || `#${o.i + 1}`)
    .join(", ")

/**
 * Ekran 6, Moduł 7 — "Strategia Zamarzanie" (dawne 6.6). Zimą brak nadwyżki PV, więc wg M2/E12 komfort (3) jest
 * odłączony od razu, ważne (2) przy SoC < 20%, krytyczne (1) nigdy. Czas: etap A (krytyczne + ważne) od SoC₀ do
 * max(20%, SoC_min), etap B (same krytyczne) do SoC_min; E = C·η·ΔSoC. Spadek temperatury w domu (przykład C:
 * „spadnie do 12°C”) wymaga modelu cieplnego M6 — nieliczony.
 */
export function calculateStrategiaZamarzanie(input: StrategiaZamarzanieInput): CalcResult<StrategiaZamarzanieResult> {
  const suma = (p: number) => input.odbiorniki.filter((o) => o.priorytet === p).reduce((s, o) => s + (o.mocW ?? 0), 0)
  const value: StrategiaZamarzanieResult = {
    mocKrytycznychW: suma(1),
    mocWaznychW: suma(2),
    mocKomfortuW: suma(3),
    czasEtapuAH: null,
    czasEtapuBH: null,
    czasKrytycznychH: null,
  }
  const inputs: Record<string, number> = {
    pojemnoscKwh: input.pojemnoscKwh ?? 0,
    socPct: input.socPct ?? 0,
    socMinPct: input.socMinPct ?? 0,
    sprawnoscFalownikaPct: input.sprawnoscFalownikaPct ?? 0,
    mocKrytycznychW: value.mocKrytycznychW,
    mocWaznychW: value.mocWaznychW,
  }
  const wynik = (status: Status, warnings: Warning[], assumptions: Assumption[] = []): CalcResult<StrategiaZamarzanieResult> => ({
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
  if (input.pojemnoscKwh !== null && input.pojemnoscKwh < 0) errors.push(pojemnoscUjemna(input.pojemnoscKwh))
  for (const pole of ["socPct", "socMinPct"] as const) {
    const v = input[pole]
    if (v !== null && (v < 0 || v > 100)) errors.push(procentPozaZakresem(pole, v))
  }
  const eta = input.sprawnoscFalownikaPct
  if (eta !== null && (eta <= 0 || eta > 100)) errors.push(procentPozaZakresem("sprawnoscFalownikaPct", eta))
  input.odbiorniki.forEach((o, i) => {
    if (o.mocW !== null && o.mocW < 0) errors.push(mocUjemna(i, o.mocW))
  })
  if (errors.length > 0) {
    value.mocKrytycznychW = value.mocWaznychW = value.mocKomfortuW = 0
    return wynik("INVALID_INPUT", errors)
  }

  const { pojemnoscKwh: C, socPct: s0, socMinPct: sMin } = input
  if (C === null || C <= 0 || s0 === null || sMin === null || eta === null || input.odbiorniki.length === 0) return wynik("INCOMPLETE", [])

  const warnings: Warning[] = []
  const assumptions: Assumption[] = [{ kod: "ZAMARZANIE-ZALOZENIE-BRAK-PV" }, { kod: "ZAMARZANIE-ZALOZENIE-MOC-STALA" }]
  const prog = PROG_ODLACZENIA_PRIORYTET_2_SOC_PCT
  const kwhNaPct = (C * (eta / 100)) / 100
  const P1 = value.mocKrytycznychW
  const P2 = value.mocWaznychW

  if (s0 <= sMin) warnings.push(socPonizejMinimum())
  else {
    const koniecA = Math.max(prog, sMin)
    if (s0 > koniecA && P1 + P2 > 0) value.czasEtapuAH = (kwhNaPct * (s0 - koniecA) * 1000) / (P1 + P2)
    const startB = Math.min(s0, prog)
    if (startB > sMin && P1 > 0) value.czasEtapuBH = (kwhNaPct * (startB - sMin) * 1000) / P1
    if (P1 > 0) value.czasKrytycznychH = (value.czasEtapuAH ?? 0) + (value.czasEtapuBH ?? 0)
  }
  if (P1 <= 0) warnings.push(brakKrytycznych())
  const komfort = nazwyPriorytetu(input.odbiorniki, 3)
  if (komfort) warnings.push(komfortOdlaczony(komfort))
  const wazne = nazwyPriorytetu(input.odbiorniki, 2)
  if (wazne) warnings.push(wazneOdlaczanePrzyProgu(wazne, prog))

  return wynik(warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID", warnings, assumptions)
}
