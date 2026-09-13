import type { Warning } from "@/lib/core/calc-result"
import type { PomiaryPowykonawczeInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = { errors: Warning[] }

export function validateInput(input: PomiaryPowykonawczeInput): ValidationResult {
  const errors: Warning[] = []
  if (input.rezystancjaIzolacjiMohm < 0) {
    errors.push(wartoscUjemna("rezystancjaIzolacjiMohm", input.rezystancjaIzolacjiMohm))
  }
  if (input.rezystancjaUziemieniaOhm < 0) {
    errors.push(wartoscUjemna("rezystancjaUziemieniaOhm", input.rezystancjaUziemieniaOhm))
  }
  if (input.czasZadzialaniaRcdS < 0) {
    errors.push(wartoscUjemna("czasZadzialaniaRcdS", input.czasZadzialaniaRcdS))
  }
  return { errors }
}
