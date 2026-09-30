import type { Assumption, CalcResult, Warning } from "@/lib/core/calc-result"
import { latexLiczba } from "@/lib/core/latex"
import type { OchronaPrzepieciowaSpdInput } from "./input"
import { validateInput } from "./validation"
import {
  brakTypu1PrzyOdgromowej,
  spdDobranyPoprawnie,
  spdUziemionyOsobno,
  ucPonizejMinimum,
  zaBliskoZwodu,
} from "./warnings"
import { MIN_ODLEGLOSC_OD_ZWODU_M, WSPOLCZYNNIK_MARGINESU_UC } from "./constants"

export const CALCULATOR_VERSION = "1.0.1"

export type OchronaPrzepieciowaSpdResult = {
  typWymagany: "Typ 1" | "Typ 2"
  ucMinimalneV: number
}

const FORMULA = `U_c \\ge V_{OC\\,max} \\times ${latexLiczba(WSPOLCZYNNIK_MARGINESU_UC)}`

function pusty(): OchronaPrzepieciowaSpdResult {
  return { typWymagany: "Typ 2", ucMinimalneV: 0 }
}

/**
 * Ekran 2, Moduł 5 "Okablowanie i zabezpieczenia" — "Ochrona przeciwprzepięciowa (SPD)"
 * (dawne 4.5, 4.6, 4.7 z tego modułu + 2.47 z Modułu 3, Sekcja B). Voc stringu powinien być
 * wartością zimową (Ekran 5, Moduł 3 "Zimowy stress-test MPPT"), nie STC — 1:1 z uzupełnieniem
 * źródła (dawna funkcja 2.47), zaznaczone jawnie w `assumptions`.
 */
export function calculateOchronaPrzepieciowaSpd(
  input: OchronaPrzepieciowaSpdInput,
): CalcResult<OchronaPrzepieciowaSpdResult> {
  const { errors } = validateInput(input)
  const inputs = {
    vocMaxStringuV: input.vocMaxStringuV,
    odlegloscOdZwoduM: input.odlegloscOdZwoduM ?? 0,
    ucSpdV: input.ucSpdV,
  }

  if (errors.length > 0) {
    return {
      value: pusty(),
      unit: "V",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne =
    input.vocMaxStringuV === 0 ||
    input.ucSpdV === 0 ||
    (input.maInstalacjeOdgromowa && input.odlegloscOdZwoduM === null)

  if (niekompletne) {
    return {
      value: pusty(),
      unit: "V",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const typWymagany: "Typ 1" | "Typ 2" = input.maInstalacjeOdgromowa ? "Typ 1" : "Typ 2"
  const ucMinimalneV = input.vocMaxStringuV * WSPOLCZYNNIK_MARGINESU_UC

  const warnings: Warning[] = []

  if (input.maInstalacjeOdgromowa && !input.maZainstalowanySpdTyp1) {
    warnings.push(brakTypu1PrzyOdgromowej())
  }
  if (input.maInstalacjeOdgromowa && input.odlegloscOdZwoduM !== null && input.odlegloscOdZwoduM < MIN_ODLEGLOSC_OD_ZWODU_M) {
    warnings.push(zaBliskoZwodu(input.odlegloscOdZwoduM))
  }
  if (input.ucSpdV < ucMinimalneV) {
    warnings.push(ucPonizejMinimum(input.ucSpdV, ucMinimalneV))
  }
  if (!input.uziemienieViaGsw) {
    warnings.push(spdUziemionyOsobno())
  }

  if (warnings.length === 0) {
    warnings.push(spdDobranyPoprawnie(typWymagany))
  }

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { typWymagany, ucMinimalneV },
    unit: "V",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [{ kod: "VOC-STRINGU-WARTOSC-ZIMOWA" }] satisfies Assumption[],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
