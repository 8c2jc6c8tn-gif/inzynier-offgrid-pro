import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { ujemneWartosci } from "../wspolne/walidacja"
import type { DoborMocyPompyInput } from "./input"
import { biwalentnyEkstrapolacja, deficytMocy, dogrzewNieznany, temperaturyPozaZakresem, zapasMocy } from "./warnings"

export const CALCULATOR_VERSION = "1.1.0"

const FORMULA =
  "\\Delta P = P_{pompy}(\\theta_e) - \\Phi,\\quad pokrycie = \\min(P, \\Phi)/\\Phi,\\quad " +
  "\\Phi \\dfrac{\\theta_i - \\theta_{biw}}{\\theta_i - \\theta_e} = P_1 + \\dfrac{P_2 - P_1}{\\theta_2 - \\theta_1}(\\theta_{biw} - \\theta_1)"

export type DoborMocyPompyResult = {
  /** Pump capacity minus design load at θe [kW] — negative = deficit. */
  zapasKw: number
  /** Backup heat needed at θe (heater, stove) [kW]; 0 = the pump covers the load. */
  dogrzewanieKw: number
  /** Share of the design load covered by the pump [%] (5.67 „pompa pokrywa 80%”). */
  pokryciePompaPct: number
  /** Share left for backup heating [%]. */
  pokrycieDogrzewaniePct: number
  /** Oversizing at θe [%]; null = no margin. */
  przewymiarowaniePct: number | null
  /** Bivalent (balance) point [°C] — below it the pump alone is not enough; null = second datasheet point missing. */
  punktBiwalentnyC: number | null
}

const PUSTY: DoborMocyPompyResult = {
  zapasKw: 0,
  dogrzewanieKw: 0,
  pokryciePompaPct: 0,
  pokrycieDogrzewaniePct: 0,
  przewymiarowaniePct: null,
  punktBiwalentnyC: null,
}

/**
 * Bivalent point: the design load falls linearly to zero at θi (Screen 1 steady-state model U·A·ΔT + H_V·ΔT, gains not
 * counted), the pump capacity runs linearly through two datasheet points (✅🤖 — the datasheet gives a table, not a
 * formula). Null when the two lines are parallel.
 */
export function punktBiwalentny(
  zapotrzebowanieKw: number,
  tWewnC: number,
  tProjC: number,
  mocProjKw: number,
  tDrugiC: number,
  mocDrugiKw: number,
): number | null {
  const k = zapotrzebowanieKw / (tWewnC - tProjC)
  const s = (mocDrugiKw - mocProjKw) / (tDrugiC - tProjC)
  if (k + s === 0) return null
  return (k * tWewnC - mocProjKw + s * tProjC) / (k + s)
}

/**
 * Moduł 6, Część 2B — dokładka do Ekranu 5: dobór mocy pompy ciepła (dawne 5.27, Biblia §6.27.1) i podział
 * pompa/dogrzewanie z bilansu (dawne 5.67, §6.27.41). The source logic: size on the load at the lowest outdoor
 * temperature, check whether backup heat is needed, show the oversizing, remember that pump capacity falls and the
 * load rises with the cold — all of it is a comparison of two user numbers plus the balance point of two lines.
 *
 * Deficit level (D71): 🔴 only with no backup heat source in the house, 🟡 with one or while it is unknown (+ info).
 *
 * Not computed (Dyrektywa #1): starts per day from oversizing („przewymiarowana o 40% → 20 razy na dobę”) — the source
 * gives no model; the start count for a given water volume and hysteresis is on Screen 14 (`bufor-praca-pompy`).
 *
 * Source examples (Dyrektywa #5): 5.27 „zapotrzebowanie 6 kW, pompa 5 kW nie wystarczy – potrzebujesz 8 kW lub grzałki
 * awaryjnej 2 kW” — the deficit of a 5 kW pump is 1 kW, not 2 kW (2 kW would fit a pump giving 4 kW at −20 °C, or is a
 * rounded-up heater size); 8 kW is a 33% margin. 5.67 „straty 12 kW, pompa pokrywa 80%, grzałki 20%” = a pump giving
 * 9,6 kW at the design temperature — reproduced exactly (tests).
 */
export function calculateDoborMocyPompy(input: DoborMocyPompyInput): CalcResult<DoborMocyPompyResult> {
  const errors = ujemneWartosci({
    zapotrzebowanieKw: input.zapotrzebowanieKw,
    mocPompyProjKw: input.mocPompyProjKw,
    mocPompyDrugiKw: input.mocPompyDrugiKw,
  })
  if (input.tWewnC !== null && input.tProjC !== null && input.tWewnC <= input.tProjC) {
    errors.push(temperaturyPozaZakresem("tWewnC", `tWewnC = ${input.tWewnC} <= tProjC = ${input.tProjC}`))
  }
  if (input.tDrugiC !== null && input.tProjC !== null && input.tDrugiC === input.tProjC) {
    errors.push(temperaturyPozaZakresem("tDrugiC", `tDrugiC = tProjC = ${input.tProjC}`))
  }
  const inputs = {
    zapotrzebowanieKw: input.zapotrzebowanieKw,
    mocPompyProjKw: input.mocPompyProjKw,
    tProjC: input.tProjC ?? 0,
    tWewnC: input.tWewnC ?? 0,
    tDrugiC: input.tDrugiC ?? 0,
    mocPompyDrugiKw: input.mocPompyDrugiKw,
  }
  const baza = { unit: "kW", formula: FORMULA, formulaKey: "UI-FORMULA-OGRZEWANIE-DOBOR-MOCY-POMPY", inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.zapotrzebowanieKw === 0 || input.mocPompyProjKw === 0) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const zap = input.zapotrzebowanieKw
  const moc = input.mocPompyProjKw
  const pokryciePompaPct = (Math.min(moc, zap) / zap) * 100
  const warnings: Warning[] = []
  const assumptions: Assumption[] = [{ kod: "DMP-ZAL-MOC-Z-KARTY" }, { kod: "DMP-ZAL-BEZ-STARTOW" }]
  const maDogrzew = input.maDogrzew ?? null
  if (moc < zap) {
    warnings.push(deficytMocy(zap - moc, zap, moc, maDogrzew))
    if (maDogrzew === null) warnings.push(dogrzewNieznany())
  }
  if (moc > zap) warnings.push(zapasMocy((moc / zap - 1) * 100))

  let punktBiwalentnyC: number | null = null
  if (input.tWewnC !== null && input.tProjC !== null && input.tDrugiC !== null && input.mocPompyDrugiKw > 0) {
    punktBiwalentnyC = punktBiwalentny(zap, input.tWewnC, input.tProjC, moc, input.tDrugiC, input.mocPompyDrugiKw)
    assumptions.push({ kod: "DMP-ZAL-LINIOWO" })
    const lo = Math.min(input.tProjC, input.tDrugiC)
    const hi = Math.max(input.tProjC, input.tDrugiC)
    if (punktBiwalentnyC !== null && (punktBiwalentnyC < lo || punktBiwalentnyC > hi)) warnings.push(biwalentnyEkstrapolacja())
  }

  return {
    ...baza,
    value: {
      zapasKw: moc - zap,
      dogrzewanieKw: Math.max(0, zap - moc),
      pokryciePompaPct,
      pokrycieDogrzewaniePct: 100 - pokryciePompaPct,
      przewymiarowaniePct: moc > zap ? (moc / zap - 1) * 100 : null,
      punktBiwalentnyC,
    },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
