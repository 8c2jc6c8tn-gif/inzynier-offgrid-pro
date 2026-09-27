import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import { obliczDniAutonomiiZPojemnosci } from "@/lib/core/modules/baterie/dobor-pojemnosci/calculator"
import type { DniBezSloncaInput } from "./input"
import { validateInput } from "./validation"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "d = \\dfrac{C_{Ah} \\times U \\times DoD \\times \\eta}{E_{dobowe}}"

export type DniBezSloncaResult = {
  /** Liczba dni pracy bez doładowania (ułamkowa). */
  dni: number
  /** Pełne doby — część całkowita `dni`. */
  pelneDoby: number
  /** Energia, którą można realnie pobrać z akumulatora [Wh] — C × U × DoD × η. */
  energiaDostepnaWh: number
}

const PUSTY_WYNIK: DniBezSloncaResult = { dni: 0, pelneDoby: 0, energiaDostepnaWh: 0 }

/**
 * Ekran 32, Moduł 12 — "Ile dni pracy bez słońca — mały zestaw" (dawne 8.59,
 * docs/zrodla/Tresc_Modul_12_Kalkulator_Ekrany.md). Wzorzec "echo": ten sam wzór co Moduł 4/Ekran 1
 * (`C = E × d / (η × DoD)`), rozwiązany względem d (`obliczDniAutonomiiZPojemnosci`) — nie
 * duplikowany. DoD i sprawność wpisuje użytkownik (Dyrektywa #1 — zależą od chemii i sprzętu,
 * źródło nie daje jednej wartości dla małych zestawów).
 */
export function calculateDniBezSlonca(input: DniBezSloncaInput): CalcResult<DniBezSloncaResult> {
  const { errors } = validateInput(input)
  const inputs = {
    pojemnoscAh: input.pojemnoscAh,
    napiecieV: input.napiecieV,
    dodPct: input.dodPct,
    sprawnoscPct: input.sprawnoscPct,
    zuzycieDoboweWh: input.zuzycieDoboweWh,
  }
  const assumptions: Assumption[] = [{ kod: "DBS-ZALOZENIE-BEZ-DOLADOWANIA" }, { kod: "DBS-ZALOZENIE-BEZ-KOREKTY-TEMPERATURY" }]

  if (errors.length > 0) {
    return {
      value: PUSTY_WYNIK,
      unit: "dni",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.pojemnoscAh === 0 ||
    input.napiecieV === 0 ||
    input.dodPct === 0 ||
    input.sprawnoscPct === 0 ||
    input.zuzycieDoboweWh === 0

  if (niekompletne) {
    return {
      value: PUSTY_WYNIK,
      unit: "dni",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const pojemnoscKwh = (input.pojemnoscAh * input.napiecieV) / 1000
  const dni = obliczDniAutonomiiZPojemnosci(pojemnoscKwh, input.zuzycieDoboweWh / 1000, input.sprawnoscPct, input.dodPct)
  const energiaDostepnaWh = dni * input.zuzycieDoboweWh

  return {
    value: { dni, pelneDoby: Math.floor(dni), energiaDostepnaWh },
    unit: "dni",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions,
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
