import type { Assumption, CalcResult } from "@/lib/core/calc-result"
import type { DetekcjaZwarciaEFuseInput } from "./input"
import { validateInput } from "./validation"
import { eFuseNiepotrzebny, wymaganyEFuse } from "./warnings"
import { obliczPradZwarciowyA } from "@/lib/core/modules/baterie/dobor-bezpiecznika-dc/calculator"

export const CALCULATOR_VERSION = "1.0.0"

export type DetekcjaZwarciaEFuseResult = {
  pradZwarciowyA: number
  wymaganyEFuse: boolean
}

const FORMULA = "I_{zw} = V / R_{wewn}"

/**
 * Ekran 9, Moduł 4 "Magazyn energii / baterie" — "Detekcja zwarcia i e-Fuse" (dawne 3.9,
 * docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Prąd zwarciowy re-używa
 * `obliczPradZwarciowyA` z Ekranu 24 (Dobór bezpiecznika DC) — wzorzec "echo"
 * (docs/standards/01-architektura.md, 1.3), zamiast duplikować ten sam wzór Ohma.
 */
export function calculateDetekcjaZwarciaEFuse(
  input: DetekcjaZwarciaEFuseInput,
): CalcResult<DetekcjaZwarciaEFuseResult> {
  const { errors } = validateInput(input)
  const pustyWynik: DetekcjaZwarciaEFuseResult = { pradZwarciowyA: 0, wymaganyEFuse: false }
  const inputs = {
    napiecieBateriiV: input.napiecieBateriiV,
    rezystancjaWewnetrznaOhm: input.rezystancjaWewnetrznaOhm,
    zdolnoscLaczeniowaTranzystorowA: input.zdolnoscLaczeniowaTranzystorowA,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "A",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (
    input.napiecieBateriiV === 0 ||
    input.rezystancjaWewnetrznaOhm === 0 ||
    input.zdolnoscLaczeniowaTranzystorowA === 0
  ) {
    return {
      value: pustyWynik,
      unit: "A",
      status: "INCOMPLETE",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const pradZwarciowyA = obliczPradZwarciowyA(input.napiecieBateriiV, input.rezystancjaWewnetrznaOhm)
  const wymagany = pradZwarciowyA > input.zdolnoscLaczeniowaTranzystorowA

  return {
    value: { pradZwarciowyA, wymaganyEFuse: wymagany },
    unit: "A",
    status: wymagany ? "VALID_WITH_WARNINGS" : "VALID",
    formula: FORMULA,
    inputs,
    assumptions: [{ kod: "MODEL-ZWARCIA-PROSTEGO" }] satisfies Assumption[],
    warnings: [
      wymagany
        ? wymaganyEFuse(pradZwarciowyA, input.zdolnoscLaczeniowaTranzystorowA)
        : eFuseNiepotrzebny(pradZwarciowyA, input.zdolnoscLaczeniowaTranzystorowA),
    ],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
