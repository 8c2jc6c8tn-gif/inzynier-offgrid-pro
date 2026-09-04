import type { CalcResult } from "@/lib/core/calc-result"
import type { KomunikacjaBmsInput } from "./input"
import { protokolNieznany, protokolyNiezgodne, protokolyZgodne } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

export type KomunikacjaBmsResult = {
  protokolBms: string
  protokolFalownika: string
  zgodne: boolean | null
}

/**
 * Ekran 20, Moduł 4 "Magazyn energii / baterie" — "Komunikacja BMS — CAN/RS485/Modbus" (dawne
 * 3.22, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md, Sekcja B). Sprawdzenie zgodności
 * protokołów 1:1 ze źródła — prosta równość wybranych protokołów, bez cennika konwerterów
 * (przykład Sekcji C jest ilustracyjny).
 */
export function calculateKomunikacjaBms(input: KomunikacjaBmsInput): CalcResult<KomunikacjaBmsResult> {
  const pustyWynik: KomunikacjaBmsResult = { protokolBms: "", protokolFalownika: "", zgodne: null }
  const inputs = {}

  if (input.protokolBms === "" || input.protokolFalownika === "") {
    return {
      value: pustyWynik,
      unit: "",
      status: "INCOMPLETE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.protokolBms === "inny" || input.protokolFalownika === "inny") {
    return {
      value: { protokolBms: input.protokolBms, protokolFalownika: input.protokolFalownika, zgodne: null },
      unit: "",
      status: "OUT_OF_SCOPE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [protokolNieznany()],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const zgodne = input.protokolBms === input.protokolFalownika

  return {
    value: { protokolBms: input.protokolBms, protokolFalownika: input.protokolFalownika, zgodne },
    unit: "",
    status: zgodne ? "VALID" : "VALID_WITH_WARNINGS",
    formula: "",
    inputs,
    assumptions: [],
    warnings: [
      zgodne ? protokolyZgodne(input.protokolBms) : protokolyNiezgodne(input.protokolBms, input.protokolFalownika),
    ],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
