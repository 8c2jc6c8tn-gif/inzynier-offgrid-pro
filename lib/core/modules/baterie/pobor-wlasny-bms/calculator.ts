import type { CalcResult } from "@/lib/core/calc-result"
import type { PoborWlasnyBmsInput } from "./input"
import { validateInput } from "./validation"
import { DNI_W_ROKU, GODZIN_W_DOBIE } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type PoborWlasnyBmsResult = {
  strataRocznaCiagleKwh: number
  strataDoboweUspienieKwh: number
  strataRocznaUspienieKwh: number
  oszczednoscRocznaKwh: number
}

const FORMULA = "E_{roczna} = \\dfrac{P_{pobor} \\times 24 \\times 365}{1000}"

/**
 * Ekran 22, Moduł 4 — "Pobór własny BMS i tryb uśpienia" (dawne 3.24,
 * docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Wzór 1:1 ze źródła. Przykład (7W ciągle
 * -> 61 kWh/rok; deep sleep -> 0,024 kWh/dobę) zweryfikowany niezależnie w Pythonie przed
 * implementacją — druga wartość odtwarza się dokładnie przy poborze uśpienia = 1W (górna granica
 * podanego zakresu 0,5-1W).
 */
export function calculatePoborWlasnyBms(input: PoborWlasnyBmsInput): CalcResult<PoborWlasnyBmsResult> {
  const { errors } = validateInput(input)
  const pustyWynik: PoborWlasnyBmsResult = {
    strataRocznaCiagleKwh: 0,
    strataDoboweUspienieKwh: 0,
    strataRocznaUspienieKwh: 0,
    oszczednoscRocznaKwh: 0,
  }
  const inputs = { poborCiagleW: input.poborCiagleW, poborUspienieW: input.poborUspienieW }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "kWh",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.poborCiagleW === 0 || input.poborUspienieW === 0) {
    return {
      value: pustyWynik,
      unit: "kWh",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const strataRocznaCiagleKwh = (input.poborCiagleW * GODZIN_W_DOBIE * DNI_W_ROKU) / 1000
  const strataDoboweUspienieKwh = (input.poborUspienieW * GODZIN_W_DOBIE) / 1000
  const strataRocznaUspienieKwh = (input.poborUspienieW * GODZIN_W_DOBIE * DNI_W_ROKU) / 1000
  const oszczednoscRocznaKwh = strataRocznaCiagleKwh - strataRocznaUspienieKwh

  return {
    value: {
      strataRocznaCiagleKwh,
      strataDoboweUspienieKwh,
      strataRocznaUspienieKwh,
      oszczednoscRocznaKwh,
    },
    unit: "kWh",
    status: "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
