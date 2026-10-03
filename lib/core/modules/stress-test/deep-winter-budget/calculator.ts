import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { CelBudzetu, DeepWinterBudgetInput } from "./input"
import { validateInput } from "./validation"
import {
  celeWiecejNizRazem,
  ogrzewanieNiekompletne,
  ogrzewanieNieWystarczy,
  ograniczOgrzewanie,
  planNieWCalosciPrzydzielony,
  planWyczerpany,
  ponadBudzet,
} from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

/** Numerical tolerance for „over budget” (floating point noise must not raise a verdict). */
const EPS = 1e-9

export type WynikCelu = {
  cel: CelBudzetu
  /** The category's slice of the plan [kWh]. */
  planKwh: number
  /** The category's cumulative budget up to day d [kWh]. */
  budzetNarastajacyKwh: number
  zuzycieKwh: number
  /** Consumption vs. cumulative budget [%]; null when the budget is 0. */
  odchyleniePct: number | null
  ponadBudzet: boolean
}

export type DeepWinterBudgetResult = {
  /** Plan of the month P = PV + generator + battery reserve [kWh]. */
  planKwh: number
  /** Cumulative budget up to day d: B_d = P·d/N [kWh]. */
  budzetNarastajacyKwh: number
  /** Consumption vs. cumulative budget [%] (positive = over). */
  odchyleniePct: number
  /** What is left of the whole plan: P − consumption [kWh] (negative = plan exceeded). */
  zostaloKwh: number
  dniDoKonca: number
  /** Current pace: consumption / d [kWh/day]. */
  tempoBiezaceKwhDzien: number
  /** Allowed pace for the remaining days: (P − consumption)/(N − d) [kWh/day]; null on the last day. */
  tempoDopuszczalneKwhDzien: number | null
  /** Month-end forecast at the current pace: consumption/d·N [kWh]. */
  prognozaKoniecMiesiacaKwh: number
  /** Day (real number) on which the plan runs out at the current pace; null when it lasts to the end of the month. */
  dzienWyczerpaniaPlanu: number | null
  /** Required cut of the consumption for the remaining days [%]; null on the last day. */
  wymaganeOgraniczeniePct: number | null
  /** Required lowering of the room temperature [K]; null without heating data or without a need. */
  potrzebneObnizenieK: number | null
  cele: WynikCelu[]
}

const PUSTY: DeepWinterBudgetResult = {
  planKwh: 0,
  budzetNarastajacyKwh: 0,
  odchyleniePct: 0,
  zostaloKwh: 0,
  dniDoKonca: 0,
  tempoBiezaceKwhDzien: 0,
  tempoDopuszczalneKwhDzien: null,
  prognozaKoniecMiesiacaKwh: 0,
  dzienWyczerpaniaPlanu: null,
  wymaganeOgraniczeniePct: null,
  potrzebneObnizenieK: null,
  cele: [],
}

const FORMULA =
  "P = E_{PV} + E_{agr} + E_{mag};\\ B_d = P \\cdot \\frac{d}{N};\\ \\hat{E}_N = \\frac{z}{d} N;\\ " +
  "r = 1 - \\frac{(P - z)/(N - d)}{z/d};\\ \\Delta T_{req} = \\frac{r \\cdot \\Delta T}{u_{heat}}"

/**
 * Module 7 — Screen 25 „Deep Winter Energy Budget” (dawne 6.39→7.37). Budget of ONE winter month checked on day d.
 *
 * The source example is internally inconsistent (700 − 280 ≠ 170; 280 kWh by day 20 is even below the plan's pace
 * 700·20/31 ≈ 452), so the screen is designed from the energy balance alone (decision of the owner, 03.10.2026):
 *  - plan P = PV + generator + battery reserve; cumulative budget B_d = P·d/N (proportional — stated assumption);
 *  - left = P − z; current pace z/d vs allowed pace (P − z)/(N − d); forecast z/d·N;
 *  - required cut r = 1 − allowed/current; heating: 1 K lower indoor temperature cuts the heating energy by ≈ 1/ΔT
 *    (stationary approximation), so the heating share u covers r with ΔT_needed = r·ΔT/u.
 *
 * Verdicts. „forecast > P” and „z > B_d” are the SAME inequality (z/d·N > P ⇔ z > P·d/N), so the two source verdicts
 * cannot be told apart by that test. Hence: 🟡 = over the budget, still recoverable by cutting consumption;
 * 🔴 = the plan is already used up (z ≥ P with days left, or z > P) or even switching the heating off would not bring
 * the pace down (r > u). The 🔴 limit comes from the balance itself, not from a standard (✅🤖 owner to confirm).
 */
export function calculateDeepWinterBudget(input: DeepWinterBudgetInput): CalcResult<DeepWinterBudgetResult> {
  const { errors } = validateInput(input)
  const plan = input.planPvKwh + input.planAgregatKwh + input.planMagazynKwh
  const inputs = {
    dniMiesiaca: input.dniMiesiaca,
    biezacyDzien: input.biezacyDzien,
    planKwh: plan,
    zuzycieNarastajaceKwh: input.zuzycieNarastajaceKwh,
    udzialOgrzewaniaPct: input.udzialOgrzewaniaPct,
    roznicaTemperaturK: input.roznicaTemperaturK,
  }
  const baza = { unit: "kWh", formula: FORMULA, formulaKey: "UI-FORMULA-STRESS-TEST-DEEP-WINTER-BUDGET", inputs, calculatorVersion: CALCULATOR_VERSION }
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (input.dniMiesiaca === 0 || input.biezacyDzien === 0 || plan === 0 || input.zuzycieNarastajaceKwh === 0) {
    return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const N = input.dniMiesiaca
  const d = input.biezacyDzien
  const z = input.zuzycieNarastajaceKwh
  const dniDoKonca = N - d
  const budzet = (plan * d) / N
  const odchyleniePct = (z / budzet - 1) * 100
  const zostalo = plan - z
  const tempoBiezace = z / d
  const tempoDopuszczalne = dniDoKonca > 0 ? Math.max(0, zostalo) / dniDoKonca : null
  const prognoza = tempoBiezace * N
  const ponad = z > budzet + EPS
  const dzienWyczerpania = ponad ? (plan * d) / z : null
  const wymaganePct =
    tempoDopuszczalne === null ? null : Math.max(0, (1 - tempoDopuszczalne / tempoBiezace) * 100)

  const warnings: Warning[] = []
  const wyczerpany = z > plan + EPS || (dniDoKonca > 0 && z >= plan - EPS)
  if (wyczerpany) warnings.push(planWyczerpany(z, plan, dniDoKonca))

  const maOgrz = input.udzialOgrzewaniaPct > 0 && input.roznicaTemperaturK > 0
  const czesciowoOgrz = (input.udzialOgrzewaniaPct > 0) !== (input.roznicaTemperaturK > 0)
  let potrzebneK: number | null = null
  if (maOgrz && wymaganePct !== null && wymaganePct > 0) {
    if (wymaganePct > input.udzialOgrzewaniaPct + EPS) {
      warnings.push(ogrzewanieNieWystarczy(wymaganePct, input.udzialOgrzewaniaPct))
    } else {
      potrzebneK = (wymaganePct * input.roznicaTemperaturK) / input.udzialOgrzewaniaPct
    }
  }
  if (ponad && !wyczerpany && wymaganePct !== null && dzienWyczerpania !== null) {
    warnings.push(ponadBudzet(odchyleniePct, dzienWyczerpania, wymaganePct))
    if (potrzebneK !== null) warnings.push(ograniczOgrzewanie(potrzebneK))
  } else if (potrzebneK !== null) {
    warnings.push(ograniczOgrzewanie(potrzebneK))
  }
  if (czesciowoOgrz) warnings.push(ogrzewanieNiekompletne())

  const cele: WynikCelu[] = input.cele.map((c) => {
    const planCelu = (plan * c.udzialPlanuPct) / 100
    const budzetCelu = (planCelu * d) / N
    return {
      cel: c.cel,
      planKwh: planCelu,
      budzetNarastajacyKwh: budzetCelu,
      zuzycieKwh: c.zuzycieKwh,
      odchyleniePct: budzetCelu > 0 ? (c.zuzycieKwh / budzetCelu - 1) * 100 : null,
      ponadBudzet: c.zuzycieKwh > budzetCelu + EPS,
    }
  })
  if (cele.length > 0) {
    const sumaUdzialow = input.cele.reduce((s, c) => s + c.udzialPlanuPct, 0)
    if (sumaUdzialow < 100 - EPS) warnings.push(planNieWCalosciPrzydzielony(sumaUdzialow))
    const sumaZuzyc = input.cele.reduce((s, c) => s + c.zuzycieKwh, 0)
    if (sumaZuzyc > z + EPS) warnings.push(celeWiecejNizRazem(sumaZuzyc, z))
  }

  const assumptions: Assumption[] = [{ kod: "DWB-ZALOZENIE-BUDZET-PROPORCJONALNY" }, { kod: "DWB-ZALOZENIE-TEMPO-STALE" }]
  if (maOgrz) assumptions.push({ kod: "DWB-ZALOZENIE-OGRZEWANIE-STACJONARNE" })

  return {
    ...baza,
    value: {
      planKwh: plan,
      budzetNarastajacyKwh: budzet,
      odchyleniePct,
      zostaloKwh: zostalo,
      dniDoKonca,
      tempoBiezaceKwhDzien: tempoBiezace,
      tempoDopuszczalneKwhDzien: tempoDopuszczalne,
      prognozaKoniecMiesiacaKwh: prognoza,
      dzienWyczerpaniaPlanu: dzienWyczerpania,
      wymaganeOgraniczeniePct: wymaganePct,
      potrzebneObnizenieK: potrzebneK,
      cele,
    },
    status: warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID",
    assumptions,
    warnings,
  }
}
