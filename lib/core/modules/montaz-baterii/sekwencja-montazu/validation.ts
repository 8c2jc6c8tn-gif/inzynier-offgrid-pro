import type { Warning } from "@/lib/core/calc-result"
import type { SekwencjaMontazuInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = { errors: Warning[] }

export function validateInput(input: SekwencjaMontazuInput): ValidationResult {
  const errors: Warning[] = []
  if (input.liczbaOgniw < 0) errors.push(wartoscUjemna("liczbaOgniw", input.liczbaOgniw))
  return { errors }
}
