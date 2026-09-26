import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import {
  CIEPLO_WLASCIWE_POWIETRZA_J_KG_K,
  GESTOSC_POWIETRZA_KG_M3,
  J_NA_WH,
  PUNKTY_PRZEBIEGU_H,
  WH_NA_KWH,
} from "./constants"
import type { PojemnoscCieplnaInput } from "./input"
import { validateInput } from "./validation"
import { brakWychladzania, calaMasaZawyza, granicaNieosiagalna } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const CM_NA_M = 100

export type UdzialWarstwy = { nazwa: string; pojemnoscKwhK: number; udzialPct: number }

export type PojemnoscCieplnaResult = {
  /** C = Σ ρ·A·d·c (+ air) [kWh/K]. */
  pojemnoscKwhK: number
  warstwy: UdzialWarstwy[]
  /** Air part of C [kWh/K]; 0 without kubatura. */
  pojemnoscPowietrzaKwhK: number
  /** H = H_zewn + Σ H_j [W/K]. */
  hWK: number
  /** τ = C/H [h]. */
  stalaCzasowaH: number
  /** θ∞ = (H_zewn·θe + Σ H_j·θj)/H — where the unheated building settles [°C]. */
  temperaturaRownowagiC: number
  /** Time for the first 1 K drop [h]; `null` when the building never drops 1 K. */
  czasPierwszegoStopniaH: number | null
  /** Time to reach the limit [h]; `null` without a limit or when it is never reached. */
  czasDoGranicyH: number | null
  przebieg: { godzina: number; temperaturaC: number }[]
}

const FORMULA =
  "C = \\sum \\rho A d c + \\rho_a c_a V,\\quad \\tau = \\frac{C}{H},\\quad " +
  "\\theta(t) = \\theta_\\infty + (\\theta_0 - \\theta_\\infty) e^{-t/\\tau},\\quad t_{gr} = \\tau \\ln\\frac{\\theta_0 - \\theta_\\infty}{\\theta_{gr} - \\theta_\\infty}"

/**
 * Moduł 6, Ekran 8 "Pojemność cieplna budynku (bezwładność)" (dawne 5.8 + 6.11). The building is one lumped node:
 * C·dθ/dt = −H_zewn·(θ − θe) − Σ H_j·(θ − θj) → exponential decay towards θ∞ with τ = C/H. The source's C is the whole
 * mass (owner's decision 26.09.2026, see `calaMasaZawyza`). Source example (Sekcja C: "18 kWh/K ... spadnie o 1°C w
 * 4 godziny") has no H or ΔT behind it — not reproducible, not used in tests.
 */
export function calculatePojemnoscCieplna(input: PojemnoscCieplnaInput): CalcResult<PojemnoscCieplnaResult | null> {
  const errors = validateInput(input)
  const inputs: Record<string, number> = {}
  if (input.kubaturaM3 !== null) inputs.kubaturaM3 = input.kubaturaM3
  if (input.hZewnetrzneWK !== null) inputs.hZewnetrzneWK = input.hZewnetrzneWK
  if (input.temperaturaPoczatkowaC !== null) inputs.temperaturaPoczatkowaC = input.temperaturaPoczatkowaC
  if (input.temperaturaZewnetrznaC !== null) inputs.temperaturaZewnetrznaC = input.temperaturaZewnetrznaC
  if (input.temperaturaGranicznaC !== null) inputs.temperaturaGranicznaC = input.temperaturaGranicznaC
  input.warstwy.forEach((w, i) => {
    if (w.powierzchniaM2 !== null) inputs[`warstwa${i + 1}PowierzchniaM2`] = w.powierzchniaM2
    if (w.gruboscCm !== null) inputs[`warstwa${i + 1}GruboscCm`] = w.gruboscCm
    if (w.gestoscKgM3 !== null) inputs[`warstwa${i + 1}GestoscKgM3`] = w.gestoscKgM3
    if (w.cieploWlasciweJKgK !== null) inputs[`warstwa${i + 1}CieploWlasciwe`] = w.cieploWlasciweJKgK
  })
  const wynik = (
    status: CalcResult<PojemnoscCieplnaResult | null>["status"],
    value: PojemnoscCieplnaResult | null,
    warnings: Warning[] = errors,
    assumptions: Assumption[] = [],
  ): CalcResult<PojemnoscCieplnaResult | null> => ({
    value,
    unit: "kWh/K",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  if (errors.length > 0) return wynik("INVALID_INPUT", null)
  const { hZewnetrzneWK: hZ, temperaturaPoczatkowaC: t0, temperaturaZewnetrznaC: te, temperaturaGranicznaC: tg } = input
  const kompletneWarstwy =
    input.warstwy.length > 0 &&
    input.warstwy.every((w) => w.powierzchniaM2 !== null && w.gruboscCm !== null && w.gestoscKgM3 !== null && w.cieploWlasciweJKgK !== null)
  if (hZ === null || t0 === null || te === null || !kompletneWarstwy) return wynik("INCOMPLETE", null, [])

  const kwhK = (jK: number) => jK / J_NA_WH / WH_NA_KWH
  const surowe = input.warstwy.map((w, i) => ({
    nazwa: w.nazwa.trim() || `Warstwa ${i + 1}`,
    pojemnoscKwhK: kwhK(w.gestoscKgM3! * w.powierzchniaM2! * (w.gruboscCm! / CM_NA_M) * w.cieploWlasciweJKgK!),
  }))
  const pojemnoscPowietrzaKwhK = input.kubaturaM3 === null ? 0 : kwhK(input.kubaturaM3 * GESTOSC_POWIETRZA_KG_M3 * CIEPLO_WLASCIWE_POWIETRZA_J_KG_K)
  const pojemnoscKwhK = surowe.reduce((s, w) => s + w.pojemnoscKwhK, 0) + pojemnoscPowietrzaKwhK
  const warstwy = surowe.map((w) => ({ ...w, udzialPct: (w.pojemnoscKwhK / pojemnoscKwhK) * 100 }))

  const hWK = hZ + input.stratyDoInnychStref.reduce((s, x) => s + x.hWK, 0)
  const temperaturaRownowagiC = (hZ * te + input.stratyDoInnychStref.reduce((s, x) => s + x.hWK * x.temperaturaC, 0)) / hWK
  const stalaCzasowaH = (pojemnoscKwhK * WH_NA_KWH) / hWK
  const roznica0 = t0 - temperaturaRownowagiC
  const czasDo = (cel: number) => (cel > temperaturaRownowagiC && roznica0 > 0 ? stalaCzasowaH * Math.log(roznica0 / (cel - temperaturaRownowagiC)) : null)
  const przebieg = PUNKTY_PRZEBIEGU_H.map((godzina) => ({
    godzina,
    temperaturaC: temperaturaRownowagiC + roznica0 * Math.exp(-godzina / stalaCzasowaH),
  }))

  const warnings: Warning[] = [calaMasaZawyza()]
  if (roznica0 <= 0) warnings.push(brakWychladzania(t0, temperaturaRownowagiC))
  else if (tg !== null && tg <= temperaturaRownowagiC) warnings.push(granicaNieosiagalna(tg, temperaturaRownowagiC))
  const assumptions: Assumption[] = [
    { kod: "POJC-ZALOZENIE-JEDEN-WEZEL" },
    { kod: "POJC-ZALOZENIE-BEZ-ZYSKOW" },
    { kod: "POJC-ZALOZENIE-STALA-TEMP-ZEWN" },
  ]

  return wynik(
    "VALID_WITH_WARNINGS",
    {
      pojemnoscKwhK,
      warstwy,
      pojemnoscPowietrzaKwhK,
      hWK,
      stalaCzasowaH,
      temperaturaRownowagiC,
      czasPierwszegoStopniaH: czasDo(t0 - 1),
      czasDoGranicyH: tg === null ? null : czasDo(tg),
      przebieg,
    },
    warnings,
    assumptions,
  )
}
