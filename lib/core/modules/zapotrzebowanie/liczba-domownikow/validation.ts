import type { Warning } from "@/lib/core/calc-result"
import type { LiczbaDomownikowInput } from "./input"
import { liczbaDomownikowPozaZakresem } from "./warnings"
import { MAX_DOMOWNIKOW, MIN_DOMOWNIKOW } from "./constants"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: LiczbaDomownikowInput): ValidationResult {
  const errors: Warning[] = []
  if (
    input.liczbaDomownikow !== 0 &&
    (input.liczbaDomownikow < MIN_DOMOWNIKOW || input.liczbaDomownikow > MAX_DOMOWNIKOW)
  ) {
    errors.push(liczbaDomownikowPozaZakresem(input.liczbaDomownikow))
  }
  return { errors }
}
