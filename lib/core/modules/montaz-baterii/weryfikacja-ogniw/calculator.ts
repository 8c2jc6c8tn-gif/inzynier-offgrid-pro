import type { CalcResult } from "@/lib/core/calc-result"
import type { WeryfikacjaOgniwInput } from "./input"
import { validateInput } from "./validation"
import { brakBmsZBalancerem, liczbaOgniwNiezgodna, roznicaNapiecOgniwZaDuza } from "./warnings"
import { CHECKLIST_ITEMS, MAX_ROZNICA_NAPIEC_V, OCZEKIWANA_LICZBA_OGNIW } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type WeryfikacjaOgniwResult = {
  liczbaOgniw: number
  minNapiecieV: number
  maxNapiecieV: number
  roznicaNapiecV: number
}

const FORMULA = "\\Delta V = V_{max} - V_{min}"

/**
 * Ekran A1, Moduł 11 — "Weryfikacja kompletności + kontrola wstępna ogniw" (dawne 9.1, 9.8,
 * docs/domena/Tresc_Modul_11_MontazBaterii_Ekrany.md). Krytyczne kontrole liczbowe (BMS,
 * różnica napięć) surowo zwyciężają nad statusem "niekompletne" — jeśli dane wystarczają, żeby
 * wykryć realne zagrożenie, aplikacja to pokazuje od razu, nie chowa za "dokończ checklistę".
 */
export function calculateWeryfikacjaOgniw(input: WeryfikacjaOgniwInput): CalcResult<WeryfikacjaOgniwResult> {
  const { errors } = validateInput(input)
  const liczbaOgniw = input.napieciaOgniwV.length
  const inputs = { napiecieSystemu: input.napiecieSystemu, liczbaOgniw }
  const pustyWynik: WeryfikacjaOgniwResult = { liczbaOgniw, minNapiecieV: 0, maxNapiecieV: 0, roznicaNapiecV: 0 }

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

  // liczbaOgniw === 0 (nic do wpisania) albo część pól wciąż na placeholderze 0 (niewypełnione) —
  // oba przypadki to "za wcześnie na wynik", nie błąd (0 jako błąd walidacji łapie tylko validation.ts).
  if (liczbaOgniw === 0 || input.napieciaOgniwV.some((v) => v === 0)) {
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

  const minNapiecieV = Math.min(...input.napieciaOgniwV)
  const maxNapiecieV = Math.max(...input.napieciaOgniwV)
  const roznicaNapiecV = Math.round((maxNapiecieV - minNapiecieV) * 1000) / 1000

  const warnings = []
  if (!input.bmsMaBalancer) warnings.push(brakBmsZBalancerem())
  if (roznicaNapiecV > MAX_ROZNICA_NAPIEC_V) {
    warnings.push(roznicaNapiecOgniwZaDuza(minNapiecieV, maxNapiecieV, roznicaNapiecV))
  }
  const oczekiwanaLiczbaOgniw = OCZEKIWANA_LICZBA_OGNIW[input.napiecieSystemu]
  if (liczbaOgniw !== oczekiwanaLiczbaOgniw) {
    warnings.push(liczbaOgniwNiezgodna(input.napiecieSystemu, oczekiwanaLiczbaOgniw, liczbaOgniw))
  }

  const value: WeryfikacjaOgniwResult = { liczbaOgniw, minNapiecieV, maxNapiecieV, roznicaNapiecV }

  if (warnings.length > 0) {
    return {
      value,
      unit: "V",
      status: "VALID_WITH_WARNINGS",
      formula: FORMULA,
      inputs,
      assumptions: [],
      warnings,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const checklistPelny = CHECKLIST_ITEMS.every((item) => input.potwierdzoneIds.includes(item.id))

  return {
    value,
    unit: "V",
    status: checklistPelny ? "VALID" : "INCOMPLETE",
    formula: FORMULA,
    inputs,
    assumptions: [],
    warnings: [],
    calculatorVersion: CALCULATOR_VERSION,
  }
}
