/**
 * Kontrakt wyniku obliczenia — docs/standards/03-jadro-obliczeniowe.md, sekcja 3.2-3.3.
 * Każdy kalkulator domenowy zwraca CalcResult<T>, nigdy samą liczbę.
 */

export type Status =
  | "VALID"
  | "VALID_WITH_WARNINGS"
  | "INCOMPLETE"
  | "OUT_OF_SCOPE"
  | "INVALID_INPUT"

/** Werdykt trójstopniowy — docs/standards/04-walidacja-i-twarde-stopy.md, 4.1. */
export type WarningLevel = "info" | "warning" | "critical"

export type Warning = {
  /** Krótki, stabilny identyfikator (np. "FALOWNIK-NISKIE-OBCIAZENIE") — do testów i rejestru. */
  code: string
  level: WarningLevel
  /** Komunikat "po ludzku", konkretny, bez straszenia (docs/standards/08-ui-ux.md, 8.8). */
  message: string
  /** Uzasadnienie techniczne/fizyczne — nigdy "błąd walidacji" bez treści. */
  technicalMessage: string
  /** Pole lub część wyniku, której dotyczy ostrzeżenie (opcjonalne). */
  field?: string
}

export type CalcResult<T> = {
  value: T
  unit: string
  status: Status
  /** Wzór (np. LaTeX), np. "I = P / (V \\cdot \\eta)". */
  formula: string
  /** Wartości wejściowe faktycznie użyte do obliczenia. */
  inputs: Record<string, number>
  /** Przyjęte założenia, np. "η falownika = 0,92 (wartość domyślna)". */
  assumptions: string[]
  warnings: Warning[]
  /** Wersja kalkulatora/metody — rośnie przy zmianie wzoru (docs/standards/14, rejestr pokrycia). */
  calculatorVersion: string
  /** Do audit trail (docs/standards/03, 3.6) — generowany przez wywołującego, nie tutaj. */
  traceId?: string
}

/** Pomocnicze: czy wynik nadaje się do pokazania jako liczba (nie INCOMPLETE/INVALID_INPUT). */
export function isComputed(status: Status): boolean {
  return status === "VALID" || status === "VALID_WITH_WARNINGS"
}
