import type { Warning } from "@/lib/core/calc-result"
import type { KonfiguratorStringowInput } from "./input"
import { LICZBA_PANELI_SANITY_MAX } from "./constants"
import { liczbaPaneliUnusuallyHigh, notPositive, notWholeNumber } from "./warnings"

export type ValidationResult = {
  /** Błędy krytyczne — dane nie nadają się do obliczenia (status INVALID_INPUT). */
  errors: Warning[]
  /** Ostrzeżenia, które nie blokują obliczenia (status VALID_WITH_WARNINGS). */
  warnings: Warning[]
}

function checkCount(field: string, value: number, errors: Warning[], warnings: Warning[]) {
  if (value <= 0) {
    errors.push(notPositive(field, value))
  } else if (!Number.isInteger(value)) {
    errors.push(notWholeNumber(field, value))
  } else if (value > LICZBA_PANELI_SANITY_MAX) {
    warnings.push(liczbaPaneliUnusuallyHigh(value))
  }
}

export function validateInput(input: KonfiguratorStringowInput): ValidationResult {
  const errors: Warning[] = []
  const warnings: Warning[] = []

  if (input.vmpV <= 0) {
    errors.push(notPositive("vmpV", input.vmpV))
  }
  if (input.impA <= 0) {
    errors.push(notPositive("impA", input.impA))
  }

  if (input.mode === "mieszany") {
    checkCount("panelWGrupie", input.panelWGrupie, errors, warnings)
    checkCount("liczbaGrup", input.liczbaGrup, errors, warnings)
  } else {
    checkCount("liczbaPaneli", input.liczbaPaneli, errors, warnings)
  }

  return { errors, warnings }
}
