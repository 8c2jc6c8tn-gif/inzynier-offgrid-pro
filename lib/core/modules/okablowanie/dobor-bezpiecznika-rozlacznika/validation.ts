import type { Warning } from "@/lib/core/calc-result"
import type { DoborBezpiecznikaRozlacznikaInput } from "./input"

export type ValidationResult = {
  /** Błędy krytyczne — dane nie nadają się do obliczenia (status INVALID_INPUT). */
  errors: Warning[]
  /** Ostrzeżenia, które nie blokują obliczenia (status VALID_WITH_WARNINGS). */
  warnings: Warning[]
}

export function validateInput(input: DoborBezpiecznikaRozlacznikaInput): ValidationResult {
  const errors: Warning[] = []

  // 0 = pole jeszcze nie wypełnione (traktowane jako niekompletne/niesprawdzone, nie błąd).
  if (input.pradZnamionowyA < 0) {
    errors.push({
      code: "PRAD-ZNAMIONOWY-NIEDODATNI",
      level: "critical",
      message: "Prąd znamionowy obwodu musi być większy od zera.",
      technicalMessage: `pradZnamionowyA = ${input.pradZnamionowyA}, oczekiwano > 0`,
      field: "pradZnamionowyA",
    })
  }
  if (input.pradZwarciowyA < 0) {
    errors.push({
      code: "PRAD-ZWARCIOWY-UJEMNY",
      level: "critical",
      message: "Prąd zwarciowy nie może być ujemny.",
      technicalMessage: `pradZwarciowyA = ${input.pradZwarciowyA}, oczekiwano >= 0`,
      field: "pradZwarciowyA",
    })
  }
  if (input.aicBezpiecznikaA < 0) {
    errors.push({
      code: "AIC-UJEMNE",
      level: "critical",
      message: "Zdolność łączeniowa (AIC) nie może być ujemna.",
      technicalMessage: `aicBezpiecznikaA = ${input.aicBezpiecznikaA}, oczekiwano >= 0`,
      field: "aicBezpiecznikaA",
    })
  }

  return { errors, warnings: [] }
}
