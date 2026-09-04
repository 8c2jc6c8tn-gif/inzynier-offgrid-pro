import type { CalcResult } from "@/lib/core/calc-result"
import type { RyzykoNiskiegoNapieciaInput } from "./input"
import { validateInput } from "./validation"
import { pompaSieWylaczy, marginesBezpieczny } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type RyzykoNiskiegoNapieciaResult = {
  marginesV: number
}

const FORMULA = "margines = V_{system} - V_{min,pompy}"

/**
 * Ekran dodatkowy, Moduł 6 "Ogrzewanie / wentylacja / pompa ciepła" — "Ryzyko wyłączenia pompy
 * przy niskim napięciu" (dawne 5.63, docs/zrodla/Tresc_Modul_6_Ogrzewanie_Ekrany.md, Część 2C).
 * Prosta różnica dwóch napięć — bez wymyślonego współczynnika. Napięcie systemu przy danym SoC
 * baterii zależy od krzywej rozładowania konkretnej technologii ogniw (specyficznej dla
 * producenta, nie danej uniwersalnej) — źródło podaje tylko ilustracyjny przykład ("przy SoC 20%
 * napięcie spada do 44V"), nie wzór; dlatego napięcie systemu jest tu polem ręcznego wpisu, nie
 * wyprowadzanym z SoC (Dyrektywa #1, nie zgaduj brakującego współczynnika/krzywej).
 */
export function calculateRyzykoNiskiegoNapiecia(
  input: RyzykoNiskiegoNapieciaInput,
): CalcResult<RyzykoNiskiegoNapieciaResult> {
  const { errors, warnings: walidacyjneOstrzezenia } = validateInput(input)
  const pustyWynik: RyzykoNiskiegoNapieciaResult = { marginesV: 0 }
  const inputs = {
    minNapiecieRoboczeV: input.minNapiecieRoboczeV,
    aktualneNapiecieSystemuV: input.aktualneNapiecieSystemuV,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "V",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const niekompletne = input.minNapiecieRoboczeV === 0 || input.aktualneNapiecieSystemuV === 0

  if (niekompletne) {
    return {
      value: pustyWynik,
      unit: "V",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const marginesV = input.aktualneNapiecieSystemuV - input.minNapiecieRoboczeV

  const warnings = [
    ...walidacyjneOstrzezenia,
    ...(marginesV < 0
      ? [pompaSieWylaczy(input.aktualneNapiecieSystemuV, input.minNapiecieRoboczeV)]
      : [marginesBezpieczny(marginesV)]),
  ]

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { marginesV },
    unit: "V",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [
      "Aktualne napięcie systemu wpisane ręcznie — docelowo auto z Modułu 4 (live), gdy tryb Live będzie miał dane na żywo do pokazania.",
    ],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
