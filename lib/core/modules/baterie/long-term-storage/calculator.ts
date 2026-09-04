import type { CalcResult, Warning } from "@/lib/core/calc-result"
import type { LongTermStorageInput } from "./input"
import { validateInput } from "./validation"
import { socPozaZakresem, temperaturaPonizejMinimum } from "./warnings"
import { CHECKLIST_ITEMS, SOC_ZALECANY_MAX_PCT, SOC_ZALECANY_MIN_PCT, TEMPERATURA_MIN_BEZPIECZNA_C } from "./constants"

export const CALCULATOR_VERSION = "1.0.0"

export type LongTermStorageResult = {
  socDocelowyPct: number
  temperaturaMinC: number
  socWZakresie: boolean
  temperaturaBezpieczna: boolean
  potwierdzoneCzynnosci: number
  razemCzynnosci: number
}

/**
 * Ekran 16, Moduł 4 "Magazyn energii / baterie" — "Tryb Long Term Storage (odstawienie na
 * zimę)" (dawne 3.18, docs/zrodla/Tresc_Modul_4_Baterie_Ekrany.md). Wzorzec D z elementem E —
 * dwie realne kontrole liczbowe (SoC docelowy vs zalecany zakres 50–60%, minimalna spodziewana
 * temperatura vs bezpieczne minimum -20°C) plus krótki checklist procedury (odłączenie od
 * falownika/obciążeń, uśpienie BMS) — kolejność checklisty nieistotna (w przeciwieństwie do
 * Ekranu A3/A4 Modułu 11), źródło nie opisuje tu wymuszonej sekwencji kroków.
 */
export function calculateLongTermStorage(input: LongTermStorageInput): CalcResult<LongTermStorageResult> {
  const { errors } = validateInput(input)
  const razemCzynnosci = CHECKLIST_ITEMS.length
  const pustyWynik: LongTermStorageResult = {
    socDocelowyPct: 0,
    temperaturaMinC: 0,
    socWZakresie: false,
    temperaturaBezpieczna: false,
    potwierdzoneCzynnosci: 0,
    razemCzynnosci,
  }
  const inputs = {
    socDocelowyPct: input.socDocelowyPct,
    temperaturaMinC: input.temperaturaMinC ?? 0,
  }

  if (errors.length > 0) {
    return {
      value: pustyWynik,
      unit: "%",
      status: "INVALID_INPUT",
      formula: "",
      inputs,
      assumptions: [],
      warnings: errors,
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  if (input.socDocelowyPct === 0 || input.temperaturaMinC === null) {
    return {
      value: pustyWynik,
      unit: "%",
      status: "INCOMPLETE",
      formula: "",
      inputs,
      assumptions: [],
      warnings: [],
      calculatorVersion: CALCULATOR_VERSION,
    }
  }

  const socDocelowyPct = input.socDocelowyPct
  const temperaturaMinC = input.temperaturaMinC
  const socWZakresie = socDocelowyPct >= SOC_ZALECANY_MIN_PCT && socDocelowyPct <= SOC_ZALECANY_MAX_PCT
  const temperaturaBezpieczna = temperaturaMinC >= TEMPERATURA_MIN_BEZPIECZNA_C

  const potwierdzone = new Set(input.potwierdzoneIds)
  const potwierdzoneCzynnosci = CHECKLIST_ITEMS.filter((item) => potwierdzone.has(item.id)).length

  const warnings: Warning[] = []
  if (!socWZakresie) warnings.push(socPozaZakresem(socDocelowyPct))
  if (!temperaturaBezpieczna) warnings.push(temperaturaPonizejMinimum(temperaturaMinC))

  const value: LongTermStorageResult = {
    socDocelowyPct,
    temperaturaMinC,
    socWZakresie,
    temperaturaBezpieczna,
    potwierdzoneCzynnosci,
    razemCzynnosci,
  }

  const kompletne = socWZakresie && temperaturaBezpieczna && potwierdzoneCzynnosci === razemCzynnosci

  return {
    value,
    unit: "%",
    status: kompletne ? "VALID" : warnings.length > 0 ? "VALID_WITH_WARNINGS" : "INCOMPLETE",
    formula: "",
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  }
}
