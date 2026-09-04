import type { CalcResult } from "@/lib/core/calc-result"
import type { BuforCieplaInput } from "./input"
import { validateInput } from "./validation"
import { buforZaMaly, buforWystarczajacy } from "./warnings"
import { ZALECANA_POJEMNOSC_L_NA_KW } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type BuforCieplaResult = {
  zalecanaPojemnoscL: number
}

const FORMULA = "V_{bufora} = P_{pompy} \\times 50\\,l/kW"

/**
 * Ekran 14, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "Bufor ciepła — dobór pojemności"
 * (dawne 5.14, docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md, Sekcja B). Współczynnik 50 l/kW
 * podany wprost jako liczba (nie zakres) — 1:1 ze źródła. Przykład źródła (pompa 8kW → zalecany
 * bufor 400l) odtworzony DOKŁADNIE.
 */
export function calculateBuforCiepla(input: BuforCieplaInput): CalcResult<BuforCieplaResult> {
  const { errors } = validateInput(input)
  const pustyWynik: BuforCieplaResult = { zalecanaPojemnoscL: 0 }
  const inputs = {
    mocPompyKw: input.mocPompyKw,
    pojemnoscBuforaL: input.pojemnoscBuforaL,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "l",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne = input.mocPompyKw === 0 || input.pojemnoscBuforaL === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "l",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const zalecanaPojemnoscL = input.mocPompyKw * ZALECANA_POJEMNOSC_L_NA_KW

  const warnings =
    input.pojemnoscBuforaL < zalecanaPojemnoscL
      ? [buforZaMaly(input.pojemnoscBuforaL, zalecanaPojemnoscL)]
      : [buforWystarczajacy(input.pojemnoscBuforaL, zalecanaPojemnoscL)]

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { zalecanaPojemnoscL },
    unit: "l",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
