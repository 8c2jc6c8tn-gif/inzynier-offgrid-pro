import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { WylacznikiRcdInput } from "./input"
import { validateInput } from "./validation"
import {
  dobranyPoprawnie,
  progPowyzejOchronyOsob,
  progPowyzejOchronyPozarowej,
  wymaganyTypAMinimum,
  wymaganyTypB,
} from "./warnings"
import { PROG_OCHRONA_OSOB_MA, PROG_OCHRONA_POZAROWA_MA } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type WylacznikiRcdResult = {
  progWymaganyMa: number
}

function pusty(): WylacznikiRcdResult {
  return { progWymaganyMa: 0 }
}

/**
 * Ekran 16, Moduł 5 "Okablowanie i zabezpieczenia" — "Wyłączniki RCD" (dawne 4.15,
 * docs/zrodla/Tresc_Modul_5_Okablowanie_Ekrany.md, Sekcja B). Trzy niezależne reguły ze źródła,
 * sprawdzane osobno (nie łączone w jedną kaskadę wyboru typu — źródło nie podaje, jaki typ jest
 * minimalny, gdy ANI falownik hybrydowy ANI silniki nie występują, więc tego przypadku nie
 * zgadujemy): (1) falownik hybrydowy → wymagany typ B, (2) silniki w obwodzie → wymagany
 * minimum typ A, (3) próg różnicowy ≤30mA (ochrona osób) albo ≤300mA (ochrona przeciwpożarowa).
 */
export function calculateWylaczniki(input: WylacznikiRcdInput): CalcResult<WylacznikiRcdResult> {
  const { errors } = validateInput(input)
  const inputs = { progMa: input.progMa }

  if (errors.length > 0) {
    return {
      value: pusty(),
      unit: "mA",
      status: "INVALID_INPUT",
      formula: "",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.zainstalowanyTyp === null || input.progMa === 0) {
    return {
      value: pusty(),
      unit: "mA",
      status: "INCOMPLETE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const progWymaganyMa = input.celOchrony === "osob" ? PROG_OCHRONA_OSOB_MA : PROG_OCHRONA_POZAROWA_MA

  const warnings: Warning[] = []

  if (input.falownikHybrydowy && input.zainstalowanyTyp !== "B") {
    warnings.push(wymaganyTypB(input.zainstalowanyTyp))
  }
  if (input.odbiornikiZSilnikami && input.zainstalowanyTyp === "AC") {
    warnings.push(wymaganyTypAMinimum())
  }
  if (input.celOchrony === "osob" && input.progMa > PROG_OCHRONA_OSOB_MA) {
    warnings.push(progPowyzejOchronyOsob(input.progMa))
  }
  if (input.celOchrony === "pozarowa" && input.progMa > PROG_OCHRONA_POZAROWA_MA) {
    warnings.push(progPowyzejOchronyPozarowej(input.progMa))
  }

  if (warnings.length === 0) {
    warnings.push(dobranyPoprawnie())
  }

  const maNieinformacyjneOstrzezenia = warnings.some((w) => w.level !== "info")

  return {
    value: { progWymaganyMa },
    unit: "mA",
    status: maNieinformacyjneOstrzezenia ? "VALID_WITH_WARNINGS" : "VALID",
    formula: "",
    inputs,
    assumptions: [
      "Bez falownika hybrydowego i bez silników w obwodzie źródło nie podaje minimalnego typu RCD — nie zgadywany.",
    ],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
