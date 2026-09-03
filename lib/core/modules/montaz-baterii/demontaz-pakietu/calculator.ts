import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { DemontazPakietuInput } from "./input"
import { validateInput } from "./validation"
import { krokPozaKolejnoscia, pakietWciazNaladowany } from "./warnings"
import { CHECKLIST_ITEMS, MAX_ZALECANE_NAPIECIE_OGNIWA_V } from "./constants"
import { OCZEKIWANA_LICZBA_OGNIW } from "../weryfikacja-ogniw/constants"

export const CALCULATOR_VERSION = "1.0.0"

export type DemontazPakietuResult = {
  napiecieOgniwaV: number
  potwierdzoneWKolejnosci: number
  razem: number
}

const FORMULA = "V_{ogniwo} = V_{pakietu} / S"

/**
 * Ekran A6, Moduł 11 — "Demontaż — procedura, SoC, odłączanie BMS" (dawne 9.7, 9.14, 9.15,
 * docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md). Napięcie na ogniwo liczone z pakietu i
 * napięcia systemu (ten sam podział S co Ekran A1) — jeśli pakiet wciąż naładowany, ostrzeżenie
 * krytyczne pojawia się natychmiast, niezależnie od postępu checklisty.
 */
export function calculateDemontazPakietu(input: DemontazPakietuInput): CalcResult<DemontazPakietuResult> {
  const { errors } = validateInput(input)
  const razem = CHECKLIST_ITEMS.length
  const inputs = { napiecieSystemu: input.napiecieSystemu, napieciePakietuV: input.napieciePakietuV }

  if (errors.length > 0) {
    return {
      value: { napiecieOgniwaV: 0, potwierdzoneWKolejnosci: 0, razem },
      unit: "V",
      status: "INVALID_INPUT",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const liczbaOgniw = OCZEKIWANA_LICZBA_OGNIW[input.napiecieSystemu]
  const napiecieOgniwaV = Math.round((input.napieciePakietuV / liczbaOgniw) * 1000) / 1000

  const checked = new Set(input.potwierdzoneIds)
  let potwierdzoneWKolejnosci = 0
  for (const item of CHECKLIST_ITEMS) {
    if (!checked.has(item.id)) break
    potwierdzoneWKolejnosci++
  }
  const zaznaczonePozaKolejnoscia = CHECKLIST_ITEMS.slice(potwierdzoneWKolejnosci).some((item) =>
    checked.has(item.id),
  )

  const warnings: Warning[] = []
  if (napiecieOgniwaV > MAX_ZALECANE_NAPIECIE_OGNIWA_V) warnings.push(pakietWciazNaladowany(napiecieOgniwaV))
  if (zaznaczonePozaKolejnoscia) warnings.push(krokPozaKolejnoscia())

  const value = { napiecieOgniwaV, potwierdzoneWKolejnosci, razem }

  return {
    value,
    unit: "V",
    status:
      potwierdzoneWKolejnosci === razem && warnings.length === 0
        ? "VALID"
        : warnings.length > 0
          ? "VALID_WITH_WARNINGS"
          : "INCOMPLETE",
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
