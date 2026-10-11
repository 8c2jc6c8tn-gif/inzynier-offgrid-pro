import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { LadowanieZRegulatoraInput } from "./input"
import { validateInput } from "./validation"
import { brakLimitu, mocPaneliPonadLimitRegulatora, pradPonadLimitAkumulatora } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "I_{PV} = \\dfrac{\\min(P_{PV}, P_{reg}) \\cdot \\eta}{U_{akum}},\\quad I = \\min(I_{PV}, I_{reg}, I_{akum}),\\quad C\\text{-rate} = I / C,\\quad t = \\dfrac{C \\cdot \\Delta SOC / 100}{I}"

/** Who sets the charging current. */
export type Ograniczenie = "panele" | "regulator" | "akumulator"

export type LadowanieZRegulatoraResult = {
  /** Panel power the regulator takes in [W] (after its PV-input limit). */
  mocPrzyjetaW: number
  /** Power above the regulator's PV-input limit that is cut off [W]; 0 = none or limit unknown. */
  nadmiarMocyW: number
  /** Upper bound of the current the panels can give at the battery voltage [A] (STC power, no losses unless an efficiency was entered). */
  pradZPaneliA: number
  /** Current without the battery's limit: min(panels, regulator) — what would flow if the battery limit were not set [A]. */
  pradMozliwyA: number
  /** Charging current after all known limits [A]. */
  pradLadowaniaA: number
  ograniczenie: Ograniczenie
  mocLadowaniaW: number
  /** C-rate = I / C [1/h]; `null` without a capacity. */
  cRate: number | null
  /** Energy put into the battery in the SOC range [Wh] and the time at the constant current [h]; `null` without capacity and both SOC values. */
  energiaDoAkumulatoraWh: number | null
  czasLadowaniaH: number | null
  /** The possible current is above the battery's limit: the limit must be set in the regulator. */
  wymagaLimituWRegulatorze: boolean
}

const PUSTY: LadowanieZRegulatoraResult = {
  mocPrzyjetaW: 0,
  nadmiarMocyW: 0,
  pradZPaneliA: 0,
  pradMozliwyA: 0,
  pradLadowaniaA: 0,
  ograniczenie: "panele",
  mocLadowaniaW: 0,
  cRate: null,
  energiaDoAkumulatoraWh: null,
  czasLadowaniaH: null,
  wymagaLimituWRegulatorze: false,
}

/**
 * Charging a battery from an MPPT regulator (micro-installation, stage O2). The current from the panels is an UPPER bound (STC power,
 * ideal conversion unless the user enters the regulator's efficiency); real current in winter or under cloud is lower. The charging
 * time is at the constant current — the absorption phase near the top of the charge is slower, so it is a lower bound.
 */
export function calculateLadowanieZRegulatora(input: LadowanieZRegulatoraInput): CalcResult<LadowanieZRegulatoraResult> {
  const inputs: Record<string, number> = {}
  for (const [k, v] of Object.entries(input)) if (typeof v === "number" && Number.isFinite(v)) inputs[k] = v
  const wynik = (status: CalcResult<LadowanieZRegulatoraResult>["status"], value: LadowanieZRegulatoraResult, warnings: Warning[], assumptions: Assumption[] = []): CalcResult<LadowanieZRegulatoraResult> => ({
    value,
    unit: "A",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  const errors = validateInput(input)
  if (errors.length > 0) return wynik("INVALID_INPUT", PUSTY, errors)
  if (input.mocPaneliW === null || input.napiecieAkumulatoraV === null) return wynik("INCOMPLETE", PUSTY, [])

  const U = input.napiecieAkumulatoraV
  const eta = (input.sprawnoscRegulatoraPct ?? 100) / 100
  const limitMocy = input.regulatorMocPvMaxW
  const mocPrzyjetaW = limitMocy !== null ? Math.min(input.mocPaneliW, limitMocy) : input.mocPaneliW
  const nadmiarMocyW = input.mocPaneliW - mocPrzyjetaW
  const pradZPaneliA = (mocPrzyjetaW * eta) / U
  const pradMozliwyA = input.regulatorPradMaxA !== null ? Math.min(pradZPaneliA, input.regulatorPradMaxA) : pradZPaneliA
  const wymagaLimitu = input.maksPradLadowaniaAkumulatoraA !== null && pradMozliwyA > input.maksPradLadowaniaAkumulatoraA
  const pradLadowaniaA = input.maksPradLadowaniaAkumulatoraA !== null ? Math.min(pradMozliwyA, input.maksPradLadowaniaAkumulatoraA) : pradMozliwyA

  // Smallest of the known limits; on a tie the earlier in the chain (panels, then regulator) is named.
  const ograniczenie: Ograniczenie =
    input.maksPradLadowaniaAkumulatoraA !== null && input.maksPradLadowaniaAkumulatoraA < pradMozliwyA
      ? "akumulator"
      : input.regulatorPradMaxA !== null && input.regulatorPradMaxA < pradZPaneliA
        ? "regulator"
        : "panele"

  const cRate = input.pojemnoscAh !== null ? pradLadowaniaA / input.pojemnoscAh : null
  const maZakresSoc = input.pojemnoscAh !== null && input.socOdPct !== null && input.socDoPct !== null
  const dAh = maZakresSoc ? (input.pojemnoscAh! * (input.socDoPct! - input.socOdPct!)) / 100 : null
  const czasLadowaniaH = dAh !== null && pradLadowaniaA > 0 ? dAh / pradLadowaniaA : null
  const energiaDoAkumulatoraWh = dAh !== null ? dAh * U : null

  const warnings: Warning[] = []
  if (limitMocy !== null && nadmiarMocyW > 0) warnings.push(mocPaneliPonadLimitRegulatora(input.mocPaneliW, limitMocy))
  if (wymagaLimitu) warnings.push(pradPonadLimitAkumulatora(round1(pradMozliwyA), input.maksPradLadowaniaAkumulatoraA!))
  if (input.regulatorPradMaxA === null) warnings.push(brakLimitu("regulatora"))
  if (input.maksPradLadowaniaAkumulatoraA === null) warnings.push(brakLimitu("akumulatora"))

  const assumptions: Assumption[] = [{ kod: "LADREG-ZAL-MOC-STC" }, { kod: input.sprawnoscRegulatoraPct === null ? "LADREG-ZAL-BEZ-STRAT" : "LADREG-ZAL-SPRAWNOSC", params: { eta: input.sprawnoscRegulatoraPct ?? 100 } }]
  if (czasLadowaniaH !== null) assumptions.push({ kod: "LADREG-ZAL-STALY-PRAD" })

  return wynik(
    warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    {
      mocPrzyjetaW,
      nadmiarMocyW,
      pradZPaneliA,
      pradMozliwyA,
      pradLadowaniaA,
      ograniczenie,
      mocLadowaniaW: pradLadowaniaA * U,
      cRate,
      energiaDoAkumulatoraWh,
      czasLadowaniaH,
      wymagaLimituWRegulatorze: wymagaLimitu,
    },
    warnings,
    assumptions,
  )
}

const round1 = (x: number) => Math.round(x * 10) / 10
