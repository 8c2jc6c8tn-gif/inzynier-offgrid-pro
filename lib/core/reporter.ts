/**
 * Reporter — docs/standards/03-jadro-obliczeniowe.md, 3.6; ZASADY_APLIKACJI.md Zasada 9.
 * Jeden kanał raportowania błędów, oddzielający komunikat "po ludzku" od szczegółów
 * technicznych. Zero cichych `catch {}` — każdy złapany błąd przechodzi przez Reporter.
 */

export type ReportedError = {
  /** Komunikat pokazywany użytkownikowi — prosty, konkretny, bez żargonu. */
  userMessage: string
  /** Pełne szczegóły techniczne (stack, kontekst) — trafiają do logu, nie do UI. */
  technicalDetails: string
  /** Skąd błąd pochodzi, np. nazwa kalkulatora/modułu. */
  source: string
  cause?: unknown
}

export interface Reporter {
  reportError(error: ReportedError): void
}

/**
 * Domyślna implementacja — loguje do konsoli. Do podmiany na docelowy sink
 * (np. zewnętrzny error tracker) w warstwie infrastructure/adapters, nie tutaj.
 */
export const consoleReporter: Reporter = {
  reportError(error) {
    console.error(`[${error.source}] ${error.userMessage}`, {
      technicalDetails: error.technicalDetails,
      cause: error.cause,
    })
  },
}
