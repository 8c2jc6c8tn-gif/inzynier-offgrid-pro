import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import type { PrognozaMiesiecznaInput } from "./input"
import { validateInput } from "./validation"
import { brakDegradacji, brakMiesiecy } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "E_{prog}(m) = E_{hist}(m) \\cdot \\left(1 - \\dfrac{d}{100}\\right),\\quad \\text{scenariusze: } E_{prog} \\cdot \\left(1 \\mp \\dfrac{w}{100}\\right)"

export type WierszPrognozy = {
  /** Calendar month, 1 = January … 12 = December. */
  miesiac: number
  /** The month's production over the last 12 months [kWh]; `null` = not entered. */
  historiaKwh: number | null
  prognozaKwh: number | null
  /** Low / high scenario [kWh]; `null` without a weather swing or without history for the month. */
  dolnaKwh: number | null
  gornaKwh: number | null
}

export type PrognozaMiesiecznaResult = {
  wiersze: WierszPrognozy[]
  /** Forecast total over the months that have history [kWh]. */
  sumaPrognozyKwh: number
  /** Production of the same months over the last 12 months [kWh]. */
  sumaHistoriiKwh: number
  /** Change of the forecast against the same months a year earlier [%]; `null` without history. */
  zmianaPct: number | null
  liczbaMiesiecyZDanymi: number
}

const PUSTY: PrognozaMiesiecznaResult = { wiersze: [], sumaPrognozyKwh: 0, sumaHistoriiKwh: 0, zmianaPct: null, liczbaMiesiecyZDanymi: 0 }

/**
 * Monthly PV production forecast (module 10, 12.3) from the user's own last-12-months production: the same calendar month one year
 * later, reduced once by the panels' yearly degradation (the user enters it from the datasheet). The low/high scenario is the user's
 * own weather swing, not a statistical confidence interval. The engine does not predict weather, shading growth or soiling.
 */
export function calculatePrognozaMiesieczna(input: PrognozaMiesiecznaInput): CalcResult<PrognozaMiesiecznaResult> {
  const inputs: Record<string, number> = {}
  for (const [k, v] of Object.entries(input)) if (typeof v === "number" && Number.isFinite(v)) inputs[k] = v
  const wynik = (status: CalcResult<PrognozaMiesiecznaResult>["status"], value: PrognozaMiesiecznaResult, warnings: Warning[], assumptions: Assumption[] = []): CalcResult<PrognozaMiesiecznaResult> => ({
    value,
    unit: "kWh",
    status,
    formula: FORMULA,
    inputs,
    assumptions,
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })

  const errors = validateInput(input)
  if (errors.length > 0) return wynik("INVALID_INPUT", PUSTY, errors)
  const { miesiacStartu, miesiecyNaprzod } = input
  const historia = Array.from({ length: 12 }, (_, m) => input.produkcjaHistoriaKwh[m] ?? null)
  if (miesiacStartu === null || miesiecyNaprzod === null || historia.every((v) => v === null)) return wynik("INCOMPLETE", PUSTY, [])

  const d = input.degradacjaRocznaPct ?? 0
  const w = input.odchylenieMeteoPct
  const wspolczynnik = 1 - d / 100
  const wiersze: WierszPrognozy[] = []
  for (let k = 0; k < miesiecyNaprzod; k++) {
    const miesiac = ((miesiacStartu - 1 + k) % 12) + 1
    const h = historia[miesiac - 1] ?? null
    const prognoza = h === null ? null : h * wspolczynnik
    wiersze.push({
      miesiac,
      historiaKwh: h,
      prognozaKwh: prognoza,
      dolnaKwh: prognoza === null || w === null ? null : prognoza * (1 - w / 100),
      gornaKwh: prognoza === null || w === null ? null : prognoza * (1 + w / 100),
    })
  }
  const zDanymi = wiersze.filter((r) => r.prognozaKwh !== null)
  const sumaHistoriiKwh = zDanymi.reduce((s, r) => s + (r.historiaKwh ?? 0), 0)
  const sumaPrognozyKwh = zDanymi.reduce((s, r) => s + (r.prognozaKwh ?? 0), 0)

  const warnings: Warning[] = []
  const bezDanych = wiersze.length - zDanymi.length
  if (bezDanych > 0) warnings.push(brakMiesiecy(bezDanych))
  if (input.degradacjaRocznaPct === null) warnings.push(brakDegradacji())
  const assumptions: Assumption[] = [{ kod: "PROGMIES-ZAL-ROK-POZNIEJ" }, { kod: "PROGMIES-ZAL-BEZ-POGODY" }]
  if (w !== null) assumptions.push({ kod: "PROGMIES-ZAL-SCENARIUSZE", params: { w } })

  return wynik(
    warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID",
    {
      wiersze,
      sumaPrognozyKwh,
      sumaHistoriiKwh,
      zmianaPct: sumaHistoriiKwh > 0 ? (sumaPrognozyKwh / sumaHistoriiKwh - 1) * 100 : null,
      liczbaMiesiecyZDanymi: zDanymi.length,
    },
    warnings,
    assumptions,
  )
}
