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
  /**
   * @deprecated Migracja i18n w toku (docs/standards/17-i18n.md, 17.2 — kolizja rozstrzygnięta
   * 15.09.2026). Moduł niezmigrowany zwraca tu gotowy tekst PL — to nie błąd, to świadomy stan
   * przejściowy (17.9: migracja moduł po module, nigdy big bang), patrz docs/memory.md. Moduł
   * zmigrowany pomija to pole; warstwa prezentacji rozwiązuje `i18nKey ?? code` przez `lib/i18n/t()`.
   * Nie dodawaj tego pola w nowym/migrowanym kodzie.
   */
  message?: string
  /** Klucz słownika tłumaczeń (17.2), gdy różny od `code` — np. `code` jest dynamiczny per pole
   *  (`"${field}-NIEDODATNI"`), a treść komunikatu jest wspólna dla wielu pól. Tylko moduły zmigrowane. */
  i18nKey?: string
  /** Parametry do podstawienia w szablonie `{param}` ze słownika (`lib/i18n/t()`). Tylko moduły zmigrowane. */
  params?: Record<string, string | number>
  /** Uzasadnienie techniczne/fizyczne — nigdy "błąd walidacji" bez treści. Nie podlega i18n (17.2/04-PATCH). */
  technicalMessage: string
  /** Pole lub część wyniku, której dotyczy ostrzeżenie (opcjonalne). */
  field?: string
}

/**
 * Jedna pozycja `CalcResult.assumptions` — docs/standards/17-i18n.md, 03-PATCH 15.09.2026.
 * `string`: moduł niezmigrowany, gotowy tekst PL (stan przejściowy, 17.9).
 * `{kod, params}`: moduł zmigrowany — warstwa prezentacji rozwiązuje przez `lib/i18n/t(kod, params)`.
 */
export type Assumption = string | { kod: string; params?: Record<string, string | number> }

export type CalcResult<T> = {
  value: T
  unit: string
  status: Status
  /** Wzór (np. LaTeX), np. "I = P / (V \\cdot \\eta)". */
  formula: string
  /** Wartości wejściowe faktycznie użyte do obliczenia. */
  inputs: Record<string, number>
  /** Przyjęte założenia, np. "η falownika = 0,92 (wartość domyślna)". */
  assumptions: Assumption[]
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
