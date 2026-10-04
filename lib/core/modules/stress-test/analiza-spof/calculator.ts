import type { CalcResult, Status, Warning } from "@/lib/core/calc-result"
import type { AnalizaSpofInput } from "./input"
import { bmsBezObejscia, pojedynczyPunktAwarii } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "SPOF = \\{k : brak\\ redundancji(k)\\}"

export type AnalizaSpofResult = {
  liczbaKomponentow: number
  liczbaSpof: number
}

/**
 * Ekran 10, Moduł 7 — "Analiza SPOF" (dawne 6.12). Każdy komponent bez redundancji to pojedynczy punkt awarii (B).
 * 🔴 tylko BMS — jedyny, dla którego źródło daje 🔴 („cały system wyłączy się w 10 sekund”); bezpiecznik główny i
 * pompa ciepła mają zalecenia z sekcji C (zapasowy bezpiecznik, grzałka awaryjna), reszta — ogólne 🟡. Symulacja
 * skutków awarii (czas do wyłączenia systemu) — wymaga modelu całego systemu, nieliczona.
 */
export function calculateAnalizaSpof(input: AnalizaSpofInput): CalcResult<AnalizaSpofResult> {
  const value: AnalizaSpofResult = { liczbaKomponentow: input.komponenty.length, liczbaSpof: 0 }
  const wynik = (status: Status, warnings: Warning[]): CalcResult<AnalizaSpofResult> => ({
    value,
    unit: "szt.",
    status,
    formula: FORMULA, formulaKey: "UI-FORMULA-STRESS-TEST-ANALIZA-SPOF",
    inputs: { liczbaKomponentow: value.liczbaKomponentow },
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })
  if (input.komponenty.length === 0) return wynik("INCOMPLETE", [])

  const warnings: Warning[] = []
  input.komponenty.forEach((k, i) => {
    if (k.maRedundancje) return
    const nazwa = k.nazwa.trim() || `#${i + 1}`
    warnings.push(k.typ === "bms" ? bmsBezObejscia(nazwa, i) : pojedynczyPunktAwarii(k.typ, nazwa, i))
  })
  value.liczbaSpof = warnings.length
  return wynik(warnings.length > 0 ? "VALID_WITH_WARNINGS" : "VALID", warnings)
}
