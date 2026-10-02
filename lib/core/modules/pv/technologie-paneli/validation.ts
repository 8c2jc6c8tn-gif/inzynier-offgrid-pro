import type { Warning } from "@/lib/core/calc-result"
import type { TechnologiePaneliInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: TechnologiePaneliInput): ValidationResult {
  const errors: Warning[] = []
  if (input.mocInstalacjiKwp < 0) {
    errors.push(wartoscUjemna("mocInstalacjiKwp", "POLE-MOC-INSTALACJI", input.mocInstalacjiKwp))
  }
  return { errors }
}
