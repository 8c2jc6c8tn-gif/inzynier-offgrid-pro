import type { Warning } from "@/lib/core/calc-result"
import type { UpsKrytycznyInput } from "./input"
import { wartoscUjemna, brakZaznaczonych } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
  warnings: Warning[]
}

export function validateInput(input: UpsKrytycznyInput): ValidationResult {
  const errors: Warning[] = []
  const warnings: Warning[] = []

  const zaznaczone = input.urzadzenia.filter((u) => u.selected)
  for (const urzadzenie of zaznaczone) {
    if (urzadzenie.powerW < 0) errors.push(wartoscUjemna(urzadzenie.label, urzadzenie.powerW))
  }
  if (zaznaczone.length === 0) warnings.push(brakZaznaczonych())

  if (input.pojemnoscAh < 0) errors.push(wartoscUjemna("pojemnoscAh", input.pojemnoscAh))
  if (input.napiecieV < 0) errors.push(wartoscUjemna("napiecieV", input.napiecieV))
  const prog = input.progOdcieciaMin ?? 0
  if (prog < 0) errors.push(wartoscUjemna("progOdcieciaMin", prog))

  return { errors, warnings }
}
