import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { DANE_ROZLICZEN, wartoscNajdluzej, type Rozliczenia } from "@/lib/core/dane/rozliczenia-pl-2026"
import type { MocBiernaInput } from "./input"
import { validateInput } from "./validation"
import { celNieMniejszyOdObecnego, celNiePonizejTgFi0, czyDotyczy, przekompensowanie } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type MocBiernaResult = {
  /** √((1+tg²φ)/(1+tg²φ₀)) − 1, ≥ 0 (0 when tgφ ≤ tgφ₀). Independent of C_rk. */
  czynnik: number
  /** Annual fee for inductive surplus [zł]; null without C_rk. */
  oplataIndukcyjnaZl: number | null
  /** Annual fee for capacitive energy [zł]; null without C_rk. */
  oplataPojemnosciowaZl: number | null
  oplataRazemZl: number | null
  /** Required compensation power Q_C [kvar]; null when not calculated. */
  mocKompensacjiKvar: number | null
  /** Payback [years]; null when not calculated or no inductive fee. */
  zwrotLat: number | null
}

const FORMULA =
  "O_b = k \\cdot C_{rk} \\cdot \\left(\\sqrt{\\frac{1+tg^2\\varphi}{1+tg^2\\varphi_0}} - 1\\right) \\cdot A + k \\cdot C_{rk} \\cdot E_b; \\ " +
  "Q_C = P (tg\\varphi - tg\\varphi_{cel}); \\ zwrot = K_{bat} / O_{b,ind}"

/** Inductive surplus factor (✏️ K1, with the square root). */
export function czynnikMocyBiernej(tgFi: number, tgFi0: number): number {
  return Math.max(0, Math.sqrt((1 + tgFi * tgFi) / (1 + tgFi0 * tgFi0)) - 1)
}

export function calculateMocBierna(input: MocBiernaInput, dane: Rozliczenia = DANE_ROZLICZEN): CalcResult<MocBiernaResult> {
  const pusty: MocBiernaResult = {
    czynnik: 0,
    oplataIndukcyjnaZl: null,
    oplataPojemnosciowaZl: null,
    oplataRazemZl: null,
    mocKompensacjiKvar: null,
    zwrotLat: null,
  }
  // k and tgφ₀ are the same in all read 2026 tariffs; the year of the data file selects the period.
  const rok = Number(dane.stanNa.slice(0, 4))
  const mb = dane.mocBierna
  const k = wartoscNajdluzej(mb.krotnoscKNn.okresy, rok) as number
  const tgFi0Min = wartoscNajdluzej(mb.tgFi0Minimalny.okresy, rok) as number
  const inputs = { tgFi0: input.tgFi0, k, energiaCzynnaKwh: input.energiaCzynnaKwh }
  const base = { unit: "zł", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }

  const errors = validateInput(input, tgFi0Min)
  if (errors.length > 0) return { ...base, value: pusty, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.tgFi === null) return { ...base, value: pusty, status: "INCOMPLETE", assumptions: [], warnings: [] }

  const czynnik = czynnikMocyBiernej(input.tgFi, input.tgFi0)
  const warnings: Warning[] = [czyDotyczy()]

  let oplataIndukcyjnaZl: number | null = null
  let oplataPojemnosciowaZl: number | null = null
  if (input.cRkZlKwh !== null && input.cRkZlKwh > 0) {
    oplataIndukcyjnaZl = k * input.cRkZlKwh * czynnik * input.energiaCzynnaKwh
    oplataPojemnosciowaZl = k * input.cRkZlKwh * input.energiaPojemnosciowaKvarh
  }
  if (input.energiaPojemnosciowaKvarh > 0) warnings.push(przekompensowanie())

  let mocKompensacjiKvar: number | null = null
  let zwrotLat: number | null = null
  if (input.mocCzynnaSredniaKw > 0 && input.tgFiCel !== null) {
    if (input.tgFiCel >= input.tgFi) warnings.push(celNieMniejszyOdObecnego())
    else {
      if (input.tgFiCel >= input.tgFi0) warnings.push(celNiePonizejTgFi0(input.tgFiCel, input.tgFi0))
      mocKompensacjiKvar = input.mocCzynnaSredniaKw * (input.tgFi - input.tgFiCel)
      if (!warnings.some((w) => w.code === "SIEC-PRZEKOMPENSOWANIE")) warnings.push(przekompensowanie())
      if (input.kosztBateriiZl > 0 && oplataIndukcyjnaZl !== null && oplataIndukcyjnaZl > 0) {
        zwrotLat = input.kosztBateriiZl / oplataIndukcyjnaZl
      }
    }
  }

  const assumptions: Assumption[] = [
    { kod: "SIEC-MOC-BIERNA-ZALOZENIE-K", params: { k: k.toFixed(2) } },
    { kod: "SIEC-MOC-BIERNA-ZALOZENIE-CRK" },
  ]
  const brakCrk = input.cRkZlKwh === null || input.cRkZlKwh === 0 || input.energiaCzynnaKwh === 0
  return {
    ...base,
    value: {
      czynnik,
      oplataIndukcyjnaZl,
      oplataPojemnosciowaZl,
      oplataRazemZl:
        oplataIndukcyjnaZl === null || oplataPojemnosciowaZl === null ? null : oplataIndukcyjnaZl + oplataPojemnosciowaZl,
      mocKompensacjiKvar,
      zwrotLat,
    },
    // Without C_rk or A the factor is still shown (it does not depend on them), the amount is not.
    status: brakCrk ? "INCOMPLETE" : warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
