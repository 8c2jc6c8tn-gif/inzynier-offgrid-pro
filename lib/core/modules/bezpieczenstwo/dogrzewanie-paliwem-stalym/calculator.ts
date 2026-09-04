import type { CalcResult } from "@/lib/core/calc-result"
import type { DogrzewaniePaliwemStalymInput } from "./input"
import { validateInput } from "./validation"
import {
  zaMalaOdleglosc,
  odlegloscOk,
  brakNawiewu,
  nawiewObecny,
  brakCzujnikaCo,
  czujnikCoObecny,
} from "./warnings"
import { MIN_ODLEGLOSC_OD_MATERIALOW_PALNYCH_CM } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type DogrzewaniePaliwemStalymResult = {
  marginesOdlegloscCm: number
}

const FORMULA = "margines = odległość_{palne} - 40\\,cm"

/**
 * Ekran 2, Moduł 8 "Bezpieczeństwo i sytuacje awaryjne" — "Bezpieczeństwo pożarowe przy
 * dogrzewaniu paliwem stałym" (dawne 6.25, docs/zrodla/Tresc_Modul_8_Bezpieczenstwo_Ekrany.md,
 * Sekcja B/C). Minimalna odległość 40 cm podana wprost jako liczba w źródle ("Piec na drewno
 * wymaga minimum 40 cm odstępu od materiałów palnych"), nie zakres — 1:1 ze źródła. Brak
 * czujnika CO to jawny twardy stop źródła ("zagrożenie życia, nie tylko mienia").
 */
export function calculateDogrzewaniePaliwemStalym(
  input: DogrzewaniePaliwemStalymInput,
): CalcResult<DogrzewaniePaliwemStalymResult> {
  const { errors } = validateInput(input)
  const pustyWynik: DogrzewaniePaliwemStalymResult = { marginesOdlegloscCm: 0 }
  const inputs = {
    odlegloscOdMaterialowPalnychCm: input.odlegloscOdMaterialowPalnychCm,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "cm",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne = input.typPaliwa === null || input.odlegloscOdMaterialowPalnychCm === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "cm",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const marginesOdlegloscCm = input.odlegloscOdMaterialowPalnychCm - MIN_ODLEGLOSC_OD_MATERIALOW_PALNYCH_CM

  const warnings = [
    marginesOdlegloscCm < 0
      ? zaMalaOdleglosc(input.odlegloscOdMaterialowPalnychCm)
      : odlegloscOk(input.odlegloscOdMaterialowPalnychCm),
    input.maNawiewPowietrzaDoSpalania ? nawiewObecny() : brakNawiewu(),
    input.maCzujnikCo ? czujnikCoObecny() : brakCzujnikaCo(),
  ]

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { marginesOdlegloscCm },
    unit: "cm",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
