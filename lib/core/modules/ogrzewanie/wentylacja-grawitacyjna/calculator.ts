import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { obliczStrumienCieplaPowietrzaW } from "../wentylacja-odzysk-ciepla/calculator"
import { naturalnaWSzczelnymDomu } from "../wentylacja-porownanie/warnings"
import type { WentylacjaGrawitacyjnaInput } from "./input"
import { validateInput } from "./validation"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "\\dot V = \\dfrac{n_d V}{24},\\quad \\Phi_V = \\dot V \\rho c_p \\Delta T,\\quad udział = \\dfrac{\\Phi_V}{\\Phi_V + \\Phi_{poz}},\\quad udział_{rek} = \\dfrac{\\Phi_V (1-\\eta)}{\\Phi_V (1-\\eta) + \\Phi_{poz}}"

export type WentylacjaGrawitacyjnaResult = {
  /** Air flow [m³/h]. */
  strumienM3H: number
  /** Air changes per hour [1/h]. */
  wymianyNaGodzine: number
  /** Ventilation heat loss [W]. */
  stratyW: number
  /** Ventilation heat loss per day [kWh/day]. */
  stratyDobaKwh: number
  /** Over the entered days [kWh]; null = no days. */
  stratyOkresKwh: number | null
  /** Share of all losses [%]; null = no other losses entered. */
  udzialPct: number | null
  /** The same flow with heat recovery: loss per day [kWh/day]; null = no efficiency. */
  stratyRekuperacjaDobaKwh: number | null
  /** Share with heat recovery [%]; null = no other losses or no efficiency. */
  udzialRekuperacjaPct: number | null
}

const PUSTY: WentylacjaGrawitacyjnaResult = {
  strumienM3H: 0,
  wymianyNaGodzine: 0,
  stratyW: 0,
  stratyDobaKwh: 0,
  stratyOkresKwh: null,
  udzialPct: null,
  stratyRekuperacjaDobaKwh: null,
  udzialRekuperacjaPct: null,
}

/**
 * Ekran 9, Moduł 6 — "Straty przez wentylację grawitacyjną" (dawne 5.9, Biblia §6.9). Echo of Screens 3/12:
 * the loss is the same air heat flow `obliczStrumienCieplaPowietrzaW` (ρ·cp of air) for V̇ = n·V / 24 h; the
 * comparison with heat recovery (Screen 3) multiplies it by (1 − η) for the same flow. The source's estimate of
 * the air change from chimneys, leaks and wind has no formula — n is entered for the day's conditions (stronger
 * wind and a larger ΔT mean a larger n, Biblia §6.9). 🟡 source „zbyt szczelny dom bez wentylacji mechanicznej
 * to ryzyko pleśni” — the user flag and warning of Screen 20 (no n50 threshold in the source).
 *
 * Source example „8 wymian na dobę → 15% całkowitych strat; rekuperacja obniżyłaby to do 5%” — no volume or
 * temperatures given; the share 15% → 5% holds for η ≈ 70% (0.15 · 0.3 / (0.85 + 0.045) = 5.0%) — test.
 */
export function calculateWentylacjaGrawitacyjna(
  input: WentylacjaGrawitacyjnaInput,
): CalcResult<WentylacjaGrawitacyjnaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    kubaturaM3: input.kubaturaM3,
    wymianyNaDobe: input.wymianyNaDobe,
    stratyPozostaleW: input.stratyPozostaleW,
    sprawnoscOdzyskuPct: input.sprawnoscOdzyskuPct,
    dni: input.dni,
  }
  const baza = { unit: "kWh/doba", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.tWewC === null || input.tZewnC === null || input.kubaturaM3 === 0 || input.wymianyNaDobe === 0) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const dT = Math.max(0, input.tWewC - input.tZewnC)
  const strumienM3H = (input.wymianyNaDobe * input.kubaturaM3) / 24
  const stratyW = obliczStrumienCieplaPowietrzaW(strumienM3H, dT)
  const stratyDobaKwh = (stratyW * 24) / 1000
  const udzial = (wentylacja: number) =>
    wentylacja + input.stratyPozostaleW > 0 ? (wentylacja / (wentylacja + input.stratyPozostaleW)) * 100 : 0
  const rek = input.sprawnoscOdzyskuPct > 0 ? stratyW * (1 - input.sprawnoscOdzyskuPct / 100) : null

  const value: WentylacjaGrawitacyjnaResult = {
    strumienM3H,
    wymianyNaGodzine: input.wymianyNaDobe / 24,
    stratyW,
    stratyDobaKwh,
    stratyOkresKwh: input.dni > 0 ? stratyDobaKwh * input.dni : null,
    udzialPct: input.stratyPozostaleW > 0 ? udzial(stratyW) : null,
    stratyRekuperacjaDobaKwh: rek === null ? null : (rek * 24) / 1000,
    udzialRekuperacjaPct: rek !== null && input.stratyPozostaleW > 0 ? udzial(rek) : null,
  }

  const warnings: Warning[] = input.szczelnyDom ? [naturalnaWSzczelnymDomu()] : []
  const assumptions: Assumption[] = [{ kod: "WGR-ZALOZENIE-WYMIANY" }]
  return {
    ...baza,
    value,
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
