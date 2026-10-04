import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { WplywTemperaturyInput } from "./input"
import { validateInput } from "./validation"
import { utrataMocy } from "./warnings"
import { TEMPERATURA_REFERENCYJNA_STC_C } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type WplywTemperaturyResult = {
  temperaturaPanelaC: number
  mocRzeczywistaW: number
  strataPct: number
}

const FORMULA =
  "T_{panel} = T_{otoczenia} + przyrost \\;\\; ; \\;\\; P_{rzeczywista} = P_{nominalna} \\times (1 + \\gamma \\times (T_{panel} - 25))"

/**
 * Ekran 18, Moduł 3 "Instalacja PV" — "Wpływ temperatury na wydajność" (dawne 2.33,
 * docs/zrodla/Tresc_Modul_3_PV_Ekrany.md, Sekcja B). Wzór 1:1 ze źródła. Przykład źródła
 * (35°C otoczenia, +25°C przyrost → 60°C panel, γ≈-0,43%/°C → strata ok. 15%) odtworzony
 * dokładnie przy tych parametrach, zweryfikowany niezależnie w Pythonie przed implementacją.
 */
export function calculateWplywTemperatury(input: WplywTemperaturyInput): CalcResult<WplywTemperaturyResult> {
  const { errors } = validateInput(input)
  const pustyWynik: WplywTemperaturyResult = { temperaturaPanelaC: 0, mocRzeczywistaW: 0, strataPct: 0 }
  const inputs = {
    temperaturaOtoczeniaC: input.temperaturaOtoczeniaC ?? 0,
    przyrostTemperaturyC: input.przyrostTemperaturyC,
    gammaPctNaC: input.gammaPctNaC,
    mocNominalnaW: input.mocNominalnaW,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "W",
      status: "INVALID_INPUT",
      formula: FORMULA, formulaKey: "UI-FORMULA-PV-WPLYW-TEMPERATURY",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.temperaturaOtoczeniaC === null ||
    input.przyrostTemperaturyC === 0 ||
    input.gammaPctNaC === 0 ||
    input.mocNominalnaW === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "W",
      status: "INCOMPLETE",
      formula: FORMULA, formulaKey: "UI-FORMULA-PV-WPLYW-TEMPERATURY",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const temperaturaOtoczeniaC: number = input.temperaturaOtoczeniaC ?? 0
  const temperaturaPanelaC = temperaturaOtoczeniaC + input.przyrostTemperaturyC
  const gamma = input.gammaPctNaC / 100
  const mocRzeczywistaW = input.mocNominalnaW * (1 + gamma * (temperaturaPanelaC - TEMPERATURA_REFERENCYJNA_STC_C))
  const strataPct = -gamma * (temperaturaPanelaC - TEMPERATURA_REFERENCYJNA_STC_C) * 100

  return {
    value: { temperaturaPanelaC, mocRzeczywistaW, strataPct },
    unit: "W",
    status: "VALID",
    formula: FORMULA, formulaKey: "UI-FORMULA-PV-WPLYW-TEMPERATURY",
    inputs,
    assumptions: [{ kod: "PRZYROST-TEMP-I-GAMMA-RECZNIE" }] satisfies Assumption[],
    warnings: [utrataMocy(temperaturaPanelaC, strataPct)],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
