import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import {
  DIESEL_ROZRUCH_MROZ_C,
  DIESEL_ZWYKLY_RYZYKO_C,
  DIESEL_ZWYKLY_WYSOKIE_RYZYKO_C,
  DLUGI_POSTOJ_DNI,
  PROG_MROZU_C,
} from "./constants"
import type { AgregatWMrozieInput } from "./input"
import { validateInput } from "./validation"
import {
  benzynaWMrozie,
  dieselParafinizacja,
  dieselRozruchWMrozie,
  dieselRyzykoRozruchu,
  dlugiPostoj,
  przerwyWPracy,
} from "./warnings"

export const CALCULATOR_VERSION = "1.1.0"

const FORMULA =
  "V = t \\cdot q;\\; n_{olej} = \\lfloor t / t_{olej} \\rfloor;\\; n_{przerw} = \\lceil t / t_{ciag} \\rceil - 1"

export type AgregatWMrozieResult = {
  /** Paliwo na cały scenariusz [l]. null = brak zużycia l/h. */
  paliwoL: number | null
  /** Liczba wymian oleju w trakcie scenariusza. null = brak interwału. */
  wymianyOleju: number | null
  /** Liczba wymuszonych przerw. null = brak limitu pracy ciągłej. */
  liczbaPrzerw: number | null
  /** Czas kalendarzowy: praca + przerwy [h]. null = brak limitu pracy ciągłej. */
  czasKalendarzowyH: number | null
}

const PUSTY_WYNIK: AgregatWMrozieResult = { paliwoL: null, wymianyOleju: null, liczbaPrzerw: null, czasKalendarzowyH: null }

/**
 * Ekran 8, Moduł 7 — "Agregat w mrozie" (dawne 6.9/6.23/6.36). Liczone (sekcja B.2, przykład C:
 * 120 h → 180 l, 2 wymiany oleju): paliwo, wymiany oleju, przerwy i czas kalendarzowy z danych
 * producenta wpisanych przez usera. Długi postój (B.3): 🟡 przy ≥ 14 dniach w mrozie — próg ze
 * źródła. Rozruch (B.1, od 1.1.0): źródło podaje dwa różne progi parafinizacji (−20°C w B, −15°C
 * w C); rozstrzygnięte decyzją właściciela D32 (praktyka, nie norma) — zwykły diesel 🟡 od +5°C,
 * 🔴 od 0°C; każdy diesel 🟡 od −10°C (akumulator, świece żarowe); benzyna w mrozie ℹ️.
 * Spadek pojemności akumulatora rozruchowego — M4/E15 Cold Cranking Amps.
 */
export function calculateAgregatWMrozie(input: AgregatWMrozieInput): CalcResult<AgregatWMrozieResult> {
  const inputs: Record<string, number> = {
    temperaturaMiejscaC: input.temperaturaMiejscaC ?? 0,
    wymaganyCzasPracyH: input.wymaganyCzasPracyH ?? 0,
    maxPracaCiaglaH: input.maxPracaCiaglaH ?? 0,
    przerwaH: input.przerwaH ?? 0,
    zuzyciePaliwaLH: input.zuzyciePaliwaLH ?? 0,
    interwalWymianyOlejuH: input.interwalWymianyOlejuH ?? 0,
    dniPostoju: input.dniPostoju ?? 0,
  }
  const wynik = (status: CalcResult<unknown>["status"], warnings: Warning[]): CalcResult<AgregatWMrozieResult> => ({
    value: PUSTY_WYNIK,
    unit: "h",
    status,
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  const { errors } = validateInput(input)
  if (errors.length > 0) return wynik("INVALID_INPUT", errors)

  const t = input.wymaganyCzasPracyH
  const temp = input.temperaturaMiejscaC
  const maPrace = t !== null && t > 0
  const maPostoj = input.dniPostoju !== null && temp !== null
  // 1.1.0: fuel + temperature alone is a complete start-up check (D32 can be a hard stop).
  const maRozruch = input.paliwo !== null && temp !== null
  if (!maPrace && !maPostoj && !maRozruch) return wynik("INCOMPLETE", [])

  const warnings: Warning[] = []
  const assumptions: Assumption[] = []
  const value: AgregatWMrozieResult = { ...PUSTY_WYNIK }

  if (maPrace) {
    assumptions.push({ kod: "AGREGAT-ZALOZENIE-DANE-PRODUCENTA" })
    if (input.zuzyciePaliwaLH !== null && input.zuzyciePaliwaLH > 0) value.paliwoL = t * input.zuzyciePaliwaLH
    if (input.interwalWymianyOlejuH !== null && input.interwalWymianyOlejuH > 0) {
      value.wymianyOleju = Math.floor(t / input.interwalWymianyOlejuH)
    }
    if (input.maxPracaCiaglaH !== null && input.maxPracaCiaglaH > 0) {
      const przerwaH = input.przerwaH ?? 0
      value.liczbaPrzerw = Math.max(0, Math.ceil(t / input.maxPracaCiaglaH) - 1)
      value.czasKalendarzowyH = t + value.liczbaPrzerw * przerwaH
      if (value.liczbaPrzerw > 0) warnings.push(przerwyWPracy(value.liczbaPrzerw, input.maxPracaCiaglaH, przerwaH))
    }
  }

  if (maPostoj && input.dniPostoju! >= DLUGI_POSTOJ_DNI && temp! < PROG_MROZU_C) {
    warnings.push(dlugiPostoj(input.dniPostoju!, temp!))
  }
  if (temp !== null) {
    if (input.paliwo === "diesel-zwykly") {
      if (temp <= DIESEL_ZWYKLY_WYSOKIE_RYZYKO_C) warnings.push(dieselParafinizacja(temp))
      else if (temp <= DIESEL_ZWYKLY_RYZYKO_C) warnings.push(dieselRyzykoRozruchu(temp))
    }
    const diesel = input.paliwo === "diesel-zwykly" || input.paliwo === "diesel-arktyczny"
    if (diesel && temp <= DIESEL_ROZRUCH_MROZ_C) warnings.push(dieselRozruchWMrozie(temp))
    if (input.paliwo === "benzyna" && temp < PROG_MROZU_C) warnings.push(benzynaWMrozie(temp))
  }

  return {
    value,
    unit: "h",
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
