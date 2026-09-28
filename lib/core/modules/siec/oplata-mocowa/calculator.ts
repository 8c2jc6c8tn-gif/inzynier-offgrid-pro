import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import { DANE_ROZLICZEN, wartoscWDniu, type Rozliczenia } from "@/lib/core/dane/rozliczenia-pl-2026"
import type { OplataMocowaInput } from "./input"
import { validateInput } from "./validation"
import { brakStawkiMocowej } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type OplataMocowaResult = {
  stawkaZlKwh: number
  /** Share of energy drawn in the charged hours [%]. */
  udzialProcent: number
  oplataRokZl: number
  /** Fee after shifting X% of the charged-hour energy [zł/year]. */
  oplataPoPrzesunieciuZl: number
  oszczednoscRokZl: number
}

const FORMULA = "O_{moc} = E_{7-22} \\cdot c_{moc}; \\ O' = E_{7-22} (1 - X) c_{moc}; \\ \\Delta = X \\cdot E_{7-22} \\cdot c_{moc}"

export function calculateOplataMocowa(
  input: OplataMocowaInput,
  dane: Rozliczenia = DANE_ROZLICZEN,
): CalcResult<OplataMocowaResult> {
  const pusty = { stawkaZlKwh: 0, udzialProcent: 0, oplataRokZl: 0, oplataPoPrzesunieciuZl: 0, oszczednoscRokZl: 0 }
  const inputs = { energiaRocznaKwh: input.energiaRocznaKwh, przesuniecieProcent: input.przesuniecieProcent }
  const base = { unit: "zł", formula: FORMULA, inputs, calculatorVersion: CALCULATOR_VERSION }

  const errors = validateInput(input)
  if (errors.length > 0) return { ...base, value: pusty, status: "INVALID_INPUT", assumptions: [], warnings: errors }

  const stawka =
    input.stawkaWlasnaZlKwh ?? wartoscWDniu(dane.krajowe.oplataMocowaPozostali.okresy, input.dataRozliczenia) ?? undefined
  if (stawka === undefined) return { ...base, value: pusty, status: "INCOMPLETE", assumptions: [], warnings: [brakStawkiMocowej()] }
  if (input.energiaRocznaKwh === 0 || input.energiaWGodzinachKwh === null) {
    return { ...base, value: pusty, status: "INCOMPLETE", assumptions: [], warnings: [] }
  }

  const e = input.energiaWGodzinachKwh
  const x = input.przesuniecieProcent / 100
  const oplataRokZl = e * stawka
  const assumptions: Assumption[] = [
    { kod: input.stawkaWlasnaZlKwh === undefined ? "SIEC-MOCOWA-STAWKA-URE" : "SIEC-MOCOWA-STAWKA-FAKTURA", params: { stawka } },
    { kod: "SIEC-ZALOZENIE-NETTO" },
  ]
  return {
    ...base,
    value: {
      stawkaZlKwh: stawka,
      udzialProcent: (e / input.energiaRocznaKwh) * 100,
      oplataRokZl,
      oplataPoPrzesunieciuZl: oplataRokZl * (1 - x),
      oszczednoscRokZl: oplataRokZl * x,
    },
    status: "VALID",
    assumptions,
    warnings: [],
  }
}
