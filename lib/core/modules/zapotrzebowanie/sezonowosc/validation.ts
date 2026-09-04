import type { Warning } from "@/lib/core/calc-result"
import type { SezonowoscInput } from "./input"
import { miesiacPozaZakresem, zapotrzebowanieUjemne } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

function walidujMiesiac(field: string, value: number, errors: Warning[]): void {
  if (value !== 0 && (value < 1 || value > 12)) {
    errors.push(miesiacPozaZakresem(field, value))
  }
}

export function validateInput(input: SezonowoscInput): ValidationResult {
  const errors: Warning[] = []

  if (input.zapotrzebowanieKwhDoba < 0) errors.push(zapotrzebowanieUjemne(input.zapotrzebowanieKwhDoba))

  if (input.typ === "sezonowy") {
    walidujMiesiac("miesiacOd", input.miesiacOd, errors)
    walidujMiesiac("miesiacDo", input.miesiacDo, errors)
    walidujMiesiac("aktualnyMiesiac", input.aktualnyMiesiac, errors)
  }

  return { errors }
}
