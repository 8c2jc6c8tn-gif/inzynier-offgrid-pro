import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import {
  CIEPLO_WLASCIWE_POWIETRZA_J_KG_K,
  GESTOSC_POWIETRZA_KG_M3,
  GRUBOSC_EFEKTYWNA_MAX_CM,
  J_NA_WH,
  OKRES_DOBA_S,
  OPOR_PRZEJMOWANIA_WEWN_M2K_W,
  PUNKTY_PRZEBIEGU_H,
  WH_NA_KWH,
} from "./constants"
import type { PojemnoscCieplnaInput, WarstwaMasy } from "./input"
import { validateInput } from "./validation"
import { brakWychladzania, granicaNieosiagalna, zalacznikAPrzyblizenie } from "./warnings"

export const CALCULATOR_VERSION = "2.0.0"

const CM_NA_M = 100
const MM_NA_CM = 10

export type UdzialWarstwy = {
  nazwa: string
  /** Effective capacity for the 1-day period (EN ISO 13786 Zał. A) [kWh/K]. */
  pojemnoscKwhK: number
  /** Share of the effective capacity (incl. air) [%]. */
  udzialPct: number
  /** Effective thickness dT per active surface [cm]; 0 for a layer behind insulation. */
  gruboscCzynnaCm: number
  /** Number of surfaces facing the room (0, 1, 2). */
  liczbaStron: number
  /** Whole-layer capacity ρ·A·d·c [kWh/K] — the source's C. */
  pojemnoscCalkowitaKwhK: number
}

export type PojemnoscCieplnaResult = {
  /** C used for cooling = Σ A·n·κ′ (EN ISO 13786 Zał. A, 1 day) + air [kWh/K]. */
  pojemnoscKwhK: number
  /** Long-term capacity of the whole mass Σ ρ·A·d·c + air [kWh/K] (the source's C, informative). */
  pojemnoscCalkowitaKwhK: number
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
  "d_T = \\min(\\tfrac{d_{el}}{2}, d, 100\\,mm),\\quad \\kappa = \\rho c d_T,\\quad " +
  "\\kappa' = \\frac{\\kappa}{\\sqrt{1 + \\omega^2 \\kappa^2 R_{si}^2}},\\quad " +
  "C = \\sum n A \\kappa' + \\rho_a c_a V,\\quad \\tau = \\frac{C}{H},\\quad " +
  "\\theta(t) = \\theta_\\infty + (\\theta_0 - \\theta_\\infty) e^{-t/\\tau},\\quad t_{gr} = \\tau \\ln\\frac{\\theta_0 - \\theta_\\infty}{\\theta_{gr} - \\theta_\\infty}"

/**
 * Moduł 6, Ekran 8 "Pojemność cieplna budynku (bezwładność)" (dawne 5.8 + 6.11). The building is one lumped node:
 * C·dθ/dt = −H_zewn·(θ − θe) − Σ H_j·(θ − θj) → exponential decay towards θ∞ with τ = C/H. Until 27.09.2026 C was the
 * whole mass (owner's decision 26.09.2026, pending the norm); now C is the effective capacity of EN ISO 13786
 * Załącznik A for the 1-day period: A.2.4 effective thickness, (A.3) κ = ρ·c·dT, (A.4) with the internal surface
 * resistance — reproduces the norm's D.1 (240 → 97 kJ/(m²·K)). Source example (Sekcja C: "18 kWh/K ... spadnie o 1°C w
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
  const surowe = input.warstwy.map((w, i) => ({ nazwa: w.nazwa.trim() || `Warstwa ${i + 1}`, ...pojemnoscWarstwy(w) }))
  const pojemnoscPowietrzaKwhK = input.kubaturaM3 === null ? 0 : kwhK(input.kubaturaM3 * GESTOSC_POWIETRZA_KG_M3 * CIEPLO_WLASCIWE_POWIETRZA_J_KG_K)
  const pojemnoscKwhK = surowe.reduce((s, w) => s + w.pojemnoscKwhK, 0) + pojemnoscPowietrzaKwhK
  const pojemnoscCalkowitaKwhK = surowe.reduce((s, w) => s + w.pojemnoscCalkowitaKwhK, 0) + pojemnoscPowietrzaKwhK
  // Only layers behind insulation and no air: no storing mass facing the room — nothing to cool.
  if (pojemnoscKwhK <= 0) return wynik("INCOMPLETE", null, [])
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

  const warnings: Warning[] = [zalacznikAPrzyblizenie()]
  if (roznica0 <= 0) warnings.push(brakWychladzania(t0, temperaturaRownowagiC))
  else if (tg !== null && tg <= temperaturaRownowagiC) warnings.push(granicaNieosiagalna(tg, temperaturaRownowagiC))
  const assumptions: Assumption[] = [
    { kod: "POJC-ZALOZENIE-JEDEN-WEZEL" },
    { kod: "POJC-ZALOZENIE-BEZ-ZYSKOW" },
    { kod: "POJC-ZALOZENIE-STALA-TEMP-ZEWN" },
    { kod: "POJC-ZALOZENIE-ZALACZNIK-A", params: { dMax: GRUBOSC_EFEKTYWNA_MAX_CM.doba * MM_NA_CM, rsi: OPOR_PRZEJMOWANIA_WEWN_M2K_W } },
  ]

  return wynik(
    "VALID_WITH_WARNINGS",
    {
      pojemnoscKwhK,
      pojemnoscCalkowitaKwhK,
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

const OMEGA_DOBA = (2 * Math.PI) / OKRES_DOBA_S
const LICZBA_STRON = { jedna: 1, obie: 2, "za-izolacja": 0 } as const

/**
 * EN ISO 13786 Załącznik A for one layer, 1-day period: dT = min(½ element; material up to the first insulating
 * layer = `gruboscCm`; Tablica A.1) per surface, κ = ρ·c·dT (A.3), κ′ with Rsi (A.4), both surfaces for an element
 * wholly inside the zone. Validated input only.
 * 🔎 TD20 (dlug-techniczny.md): layers counted separately, fixed 1-day period.
 */
function pojemnoscWarstwy(w: WarstwaMasy) {
  const d = w.gruboscCm!
  const liczbaStron = LICZBA_STRON[w.strona ?? "jedna"]
  const gruboscCzynnaCm = liczbaStron === 0 ? 0 : Math.min((w.gruboscElementuCm ?? d) / 2, d, GRUBOSC_EFEKTYWNA_MAX_CM.doba)
  const kappa = w.gestoscKgM3! * w.cieploWlasciweJKgK! * (gruboscCzynnaCm / CM_NA_M)
  const kappaR = kappa / Math.sqrt(1 + (OMEGA_DOBA * kappa * OPOR_PRZEJMOWANIA_WEWN_M2K_W) ** 2)
  const jK = (x: number) => x / J_NA_WH / WH_NA_KWH
  return {
    gruboscCzynnaCm,
    liczbaStron,
    pojemnoscKwhK: jK(w.powierzchniaM2! * liczbaStron * kappaR),
    pojemnoscCalkowitaKwhK: jK(w.gestoscKgM3! * w.powierzchniaM2! * (d / CM_NA_M) * w.cieploWlasciweJKgK!),
  }
}
