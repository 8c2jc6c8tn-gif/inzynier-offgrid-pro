import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { KonfiguratorStringowInput } from "./input"
import { validateInput } from "./validation"

export const CALCULATOR_VERSION = "1.0.0"

export type StringResult = {
  voltageV: number
  currentA: number
}

const ASSUMPTION_STC =
  "Wynik liczony dla warunków STC (25°C) — bez korekty temperaturowej na mróz " +
  "(patrz Moduł 3, Ekran 5: zimowy stress-test napięciowy MPPT)."

function buildInvalid(
  inputs: Record<string, number>,
  formula: string,
  errors: Warning[],
): CalcResult<StringResult> {
  return {
    value: { voltageV: 0, currentA: 0 },
    unit: "V / A",
    status: "INVALID_INPUT",
    formula,
    inputs,
    assumptions: [],
    warnings: errors,
    calculatorVersion: CALCULATOR_VERSION,
  }
}

/**
 * Ekran 11, Moduł 3 — "Konfigurator stringów: szereg / równolegle / mieszany"
 * (dawne 2.19-2.21, docs/zrodla/Tresc_Modul_3_PV_Ekrany.md).
 * Szereg dodaje napięcia, równoległe dodaje prądy — to jak łączenie ogniw latarki.
 */
export function calculateKonfiguratorStringow(
  input: KonfiguratorStringowInput,
): CalcResult<StringResult> {
  const { errors, warnings } = validateInput(input)
  const status: CalcResult<StringResult>["status"] =
    warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID"

  switch (input.mode) {
    case "szereg": {
      const formula = "V = V_{mp} \\times n,\\quad I = I_{mp}"
      const inputs = { vmpV: input.vmpV, impA: input.impA, liczbaPaneli: input.liczbaPaneli }
      if (errors.length > 0) return buildInvalid(inputs, formula, errors)

      return {
        value: { voltageV: input.vmpV * input.liczbaPaneli, currentA: input.impA },
        unit: "V / A",
        status,
        formula,
        inputs,
        assumptions: [ASSUMPTION_STC],
        warnings,
        calculatorVersion: CALCULATOR_VERSION,
      }
    }

    case "rownolegle": {
      const formula = "V = V_{mp},\\quad I = I_{mp} \\times n"
      const inputs = { vmpV: input.vmpV, impA: input.impA, liczbaPaneli: input.liczbaPaneli }
      if (errors.length > 0) return buildInvalid(inputs, formula, errors)

      return {
        value: { voltageV: input.vmpV, currentA: input.impA * input.liczbaPaneli },
        unit: "V / A",
        status,
        formula,
        inputs,
        assumptions: [ASSUMPTION_STC],
        warnings,
        calculatorVersion: CALCULATOR_VERSION,
      }
    }

    case "mieszany": {
      const formula = "V = V_{mp} \\times l,\\quad I = I_{mp} \\times g"
      const inputs = {
        vmpV: input.vmpV,
        impA: input.impA,
        panelWGrupie: input.panelWGrupie,
        liczbaGrup: input.liczbaGrup,
      }
      if (errors.length > 0) return buildInvalid(inputs, formula, errors)

      return {
        value: {
          voltageV: input.vmpV * input.panelWGrupie,
          currentA: input.impA * input.liczbaGrup,
        },
        unit: "V / A",
        status,
        formula,
        inputs,
        assumptions: [
          ASSUMPTION_STC,
          `Razem ${input.panelWGrupie * input.liczbaGrup} paneli (${input.panelWGrupie} w grupie × ${input.liczbaGrup} grup).`,
        ],
        warnings,
        calculatorVersion: CALCULATOR_VERSION,
      }
    }
  }
}
