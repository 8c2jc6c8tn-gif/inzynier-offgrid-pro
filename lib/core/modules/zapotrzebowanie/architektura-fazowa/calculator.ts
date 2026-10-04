import type { CalcResult } from "@/lib/core/calc-result"
import type { ArchitekturaFazowaInput } from "./input"
import { validateInput } from "./validation"

export const CALCULATOR_VERSION = "1.0.0"

export type ArchitekturaFazowaResult = {
  sumaW: number
  maxFazaW: number
  minFazaW: number
  asymetriaPct: number
}

const FORMULA = "asymetria = \\dfrac{P_{max} - P_{min}}{P_{max}} \\times 100\\%"

/**
 * Moduł 2 — Ekran 14 "Architektura 1-fazowa / 3-fazowa" (dawne 1.26). Źródło opisuje problem
 * (nierównomierne obciążenie faz) narracyjnie z jednym przykładem liczbowym (L1=4200W,
 * L2=L3=2000W), ale NIE podaje numerycznego progu, od którego asymetria liczy się jako
 * "znaczna" (🔴 w źródle jest jakościowy, nie liczbowy). Kalkulator świadomie NIE wydaje
 * automatycznego werdyktu ok/uwaga/zabroniona — liczy tylko rozkład obciążenia i asymetrię %,
 * użytkownik ocenia sam z pomocą tekstu przewodniego (zgodnie z dyscypliną "nie wymyślaj progu").
 */
export function calculateArchitekturaFazowa(input: ArchitekturaFazowaInput): CalcResult<ArchitekturaFazowaResult> {
  const { errors } = validateInput(input)
  const pustyWynik: ArchitekturaFazowaResult = { sumaW: 0, maxFazaW: 0, minFazaW: 0, asymetriaPct: 0 }
  const inputs = { mocL1W: input.mocL1W, mocL2W: input.mocL2W, mocL3W: input.mocL3W }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "W",
      status: "INVALID_INPUT",
      formula: FORMULA, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-ARCHITEKTURA-FAZOWA",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.mocL1W === 0 && input.mocL2W === 0 && input.mocL3W === 0) {
    return {
      value: pustyWynik,
      unit: "W",
      status: "INCOMPLETE",
      formula: FORMULA, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-ARCHITEKTURA-FAZOWA",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const fazy = [input.mocL1W, input.mocL2W, input.mocL3W]
  const sumaW = fazy.reduce((a, b) => a + b, 0)
  const maxFazaW = Math.max(...fazy)
  const minFazaW = Math.min(...fazy)
  const asymetriaPct = maxFazaW > 0 ? ((maxFazaW - minFazaW) / maxFazaW) * 100 : 0

  return {
    value: { sumaW, maxFazaW, minFazaW, asymetriaPct },
    unit: "W",
    status: "VALID",
    formula: FORMULA, formulaKey: "UI-FORMULA-ZAPOTRZEBOWANIE-ARCHITEKTURA-FAZOWA",
    inputs,
    assumptions: [],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
