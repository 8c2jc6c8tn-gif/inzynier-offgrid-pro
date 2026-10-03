import type { Assumption, CalcResult, Status, Warning } from "@/lib/core/calc-result"
import { calculateColdCRate, type StrefaCRate } from "../../baterie/cold-c-rate/calculator"
import { calculateHierarchiaLadowania, type ZrodloLadowania } from "../../baterie/hierarchia-ladowania/calculator"
import type { DoborZrodelZasilaniaInput } from "./input"
import { validateInput } from "./validation"
import { bezTemperatury, pradOgraniczony } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA =
  "zrodlo = hierarchia_{M4/E32}(PV,\\ SoC,\\ prognoza,\\ agregat,\\ siec) \\quad I_{lad} = \\min(I_{mozliwy},\\ C_{Ah} \\times C_{rate}(T))"

export type DoborZrodelZasilaniaResult = {
  /** Charging source by the Moduł 4 hierarchy; "BRAK" = nothing charges now, the house runs from the battery. */
  zrodlo: ZrodloLadowania
  pozniejSocPonizejProgu: boolean
  /** Temperature zone of Moduł 4 Ekran 12; null = temperature or capacity not entered. */
  strefa: StrefaCRate | null
  /** Temperature limit [A]: 0 = charging blocked; null = no number in the source for this zone (or not checked). */
  maxPradA: number | null
  /** Charging current to set now [A]; null = nothing charges or the possible current was not entered. */
  pradLadowaniaA: number | null
}

const PUSTY: DoborZrodelZasilaniaResult = {
  zrodlo: "BRAK",
  pozniejSocPonizejProgu: false,
  strefa: null,
  maxPradA: null,
  pradLadowaniaA: null,
}

/**
 * Moduł 10, Ekran 4 — the executive layer over two Moduł 4 rules (Dyrektywa #8 — echo, no new logic):
 * 12.7 the source now = `hierarchia-ladowania` (M4/E32: PV first, generator below the critical SoC without sun
 * tomorrow, grid on a cheap tariff); 12.8 the charge current = the possible current capped by `cold-c-rate`
 * (M4/E12: blocked below −10 °C, 0,1C / 0,2C in the cold, no source limit above 10 °C and the 5–10 °C gap kept as a
 * gap). 12.9 (shifting tasks to the PV peak) is Ekran 5 `przesuwanie-zadan` — linked, not duplicated here.
 */
export function calculateDoborZrodelZasilania(input: DoborZrodelZasilaniaInput): CalcResult<DoborZrodelZasilaniaResult> {
  const hierarchia = calculateHierarchiaLadowania(input)
  const zimno = calculateColdCRate({ temperaturaOgniwaC: input.temperaturaOgniwaC, pojemnoscAh: input.pojemnoscAh })
  const inputs: Record<string, number> = {
    ...hierarchia.inputs,
    temperaturaOgniwaC: input.temperaturaOgniwaC ?? Number.NaN,
    pojemnoscAh: input.pojemnoscAh,
    pradMozliwyA: input.pradMozliwyA,
  }
  const baza = { unit: "A", formula: FORMULA, formulaKey: "UI-FORMULA-AI-DOBOR-ZRODEL-ZASILANIA", inputs, calculatorVersion: CALCULATOR_VERSION }

  const errors = [
    ...validateInput(input),
    ...(hierarchia.status === "INVALID_INPUT" ? hierarchia.warnings : []),
    ...(zimno.status === "INVALID_INPUT" ? zimno.warnings : []),
  ]
  if (errors.length > 0) return { ...baza, value: PUSTY, status: "INVALID_INPUT", assumptions: [], warnings: errors }
  if (hierarchia.status === "INCOMPLETE") return { ...baza, value: PUSTY, status: "INCOMPLETE", assumptions: [], warnings: [] }

  const warnings: Warning[] = [...hierarchia.warnings]
  const assumptions: Assumption[] = [...hierarchia.assumptions]
  const { zrodlo, pozniejSocPonizejProgu } = hierarchia.value
  let strefa: StrefaCRate | null = null
  let maxPradA: number | null = null
  let pradLadowaniaA: number | null = null

  if (zimno.status === "INCOMPLETE") warnings.push(bezTemperatury())
  else {
    strefa = zimno.value.strefa
    maxPradA = zimno.value.maxPradA
    warnings.push(...zimno.warnings)
    assumptions.push(...zimno.assumptions)
    if (zrodlo !== "BRAK" && input.pradMozliwyA > 0) {
      pradLadowaniaA = maxPradA === null ? input.pradMozliwyA : Math.min(input.pradMozliwyA, maxPradA)
      if (maxPradA !== null && input.pradMozliwyA > maxPradA)
        warnings.push(pradOgraniczony(input.pradMozliwyA, maxPradA, zimno.value.temperaturaC))
    }
  }

  const status: Status = warnings.some((w) => w.level !== "info") ? "VALID_WITH_WARNINGS" : "VALID"
  return {
    ...baza,
    value: { zrodlo, pozniejSocPonizejProgu, strefa, maxPradA, pradLadowaniaA },
    status,
    assumptions,
    warnings,
  }
}
