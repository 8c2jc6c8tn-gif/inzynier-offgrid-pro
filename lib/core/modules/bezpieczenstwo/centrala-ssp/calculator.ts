import type { CalcResult, Status, Warning } from "@/lib/core/calc-result"
import type { CentralaSspInput } from "./input"
import { awariaCentrali, brakLogowania, brakSygnaluAlarmu, brakSygnaluAwarii, brakSygnaluRozbrojenia } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "sygnaly = \\{alarm,\\ awaria,\\ rozbrojenie\\}"

export type CentralaSspResult = {
  /** Liczba braków (ostrzeżeń 🟡/🔴). */
  liczbaBrakow: number
}

/**
 * Ekran 5, Moduł 8 — "Wejścia dla centrali sygnalizacji pożaru" (dawne 11.53). 🔴 awaria centrali (sekcja C);
 * sekcja B — ESP32 odbiera alarm, awarię i rozbrojenie oraz loguje zdarzenia: brak odbioru alarmu lub awarii 🟡
 * (bez nich system nie dowie się o zagrożeniu ani o niesprawnej centrali), rozbrojenie i log — info.
 */
export function calculateCentralaSsp(input: CentralaSspInput): CalcResult<CentralaSspResult> {
  const inputs = {
    odbieraAlarm: input.odbieraAlarm ? 1 : 0,
    odbieraAwarie: input.odbieraAwarie ? 1 : 0,
    odbieraRozbrojenie: input.odbieraRozbrojenie ? 1 : 0,
    logujeZdarzenia: input.logujeZdarzenia ? 1 : 0,
  }
  const wynik = (status: Status, liczbaBrakow: number, warnings: Warning[]): CalcResult<CentralaSspResult> => ({
    value: { liczbaBrakow },
    unit: "",
    status,
    formula: FORMULA, formulaKey: "UI-FORMULA-BEZPIECZENSTWO-CENTRALA-SSP",
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })
  if (input.interfejs === null || input.stanCentrali === null) return wynik("INCOMPLETE", 0, [])

  const warnings: Warning[] = []
  if (input.stanCentrali === "awaria") warnings.push(awariaCentrali())
  if (!input.odbieraAlarm) warnings.push(brakSygnaluAlarmu())
  if (!input.odbieraAwarie) warnings.push(brakSygnaluAwarii())
  if (!input.odbieraRozbrojenie) warnings.push(brakSygnaluRozbrojenia())
  if (!input.logujeZdarzenia) warnings.push(brakLogowania())

  const liczbaBrakow = warnings.filter((w) => w.level !== "info").length
  return wynik(liczbaBrakow > 0 ? "VALID_WITH_WARNINGS" : "VALID", liczbaBrakow, warnings)
}
