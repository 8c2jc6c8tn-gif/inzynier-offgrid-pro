import type { CalcResult, Status, Warning } from "@/lib/core/calc-result"
import type { PowiadomieniaAlarmoweInput } from "./input"
import { validateInput } from "./validation"
import { brakKamer, brakKontaktow, brakSyreny, wezwanieBezZgody } from "./warnings"

export const CALCULATOR_VERSION = "1.0.0"

const FORMULA = "wezwanie_{auto} = auto \\wedge zgoda"

export type PowiadomieniaAlarmoweResult = {
  /** Czy automatyczne wezwanie służb może być aktywne (włączone i za zgodą). */
  autoWezwanieAktywne: boolean
  /** Liczba braków (ostrzeżeń 🟡/🔴). */
  liczbaBrakow: number
}

/**
 * Ekran 10, Moduł 8 — "Integracja z syreną, monitoringiem i służbami" (dawne 12.55). Reguła produktowa źródła
 * (pogrubiona): automatyczne wezwanie służb „tylko za wcześniejszą, wyraźną zgodą użytkownika” — włączone bez zgody
 * → 🔴 i wezwanie nieaktywne. Sekcja B: syrena i powiadomienia — brak syreny lub kontaktów 🟡; kamery (A: „obecność”)
 * — info.
 */
export function calculatePowiadomieniaAlarmowe(input: PowiadomieniaAlarmoweInput): CalcResult<PowiadomieniaAlarmoweResult> {
  const inputs = {
    liczbaKontaktow: input.liczbaKontaktow ?? 0,
    maSyrene: input.maSyrene ? 1 : 0,
    maKamery: input.maKamery ? 1 : 0,
    autoWezwanieSluzb: input.autoWezwanieSluzb ? 1 : 0,
    zgodaNaWezwanieSluzb: input.zgodaNaWezwanieSluzb ? 1 : 0,
  }
  const wynik = (status: Status, value: PowiadomieniaAlarmoweResult, warnings: Warning[]): CalcResult<PowiadomieniaAlarmoweResult> => ({
    value,
    unit: "",
    status,
    formula: FORMULA, formulaKey: "UI-FORMULA-BEZPIECZENSTWO-POWIADOMIENIA-ALARMOWE",
    inputs,
    assumptions: [],
    warnings,
    calculatorVersion: CALCULATOR_VERSION,
  })
  const pusty: PowiadomieniaAlarmoweResult = { autoWezwanieAktywne: false, liczbaBrakow: 0 }

  const { errors } = validateInput(input)
  if (errors.length > 0) return wynik("INVALID_INPUT", pusty, errors)
  if (input.liczbaKontaktow === null) return wynik("INCOMPLETE", pusty, [])

  const warnings: Warning[] = []
  if (input.autoWezwanieSluzb && !input.zgodaNaWezwanieSluzb) warnings.push(wezwanieBezZgody())
  if (!input.maSyrene) warnings.push(brakSyreny())
  if (input.liczbaKontaktow === 0) warnings.push(brakKontaktow())
  if (!input.maKamery) warnings.push(brakKamer())

  const liczbaBrakow = warnings.filter((w) => w.level !== "info").length
  const value = { autoWezwanieAktywne: input.autoWezwanieSluzb && input.zgodaNaWezwanieSluzb, liczbaBrakow }
  return wynik(liczbaBrakow > 0 ? "VALID_WITH_WARNINGS" : "VALID", value, warnings)
}
