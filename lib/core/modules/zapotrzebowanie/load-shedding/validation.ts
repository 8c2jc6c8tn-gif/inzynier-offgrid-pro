import type { Warning } from "@/lib/core/calc-result"
import type { LoadSheddingInput } from "./input"
import { socPozaZakresem } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: LoadSheddingInput): ValidationResult {
  const errors: Warning[] = []
  if (input.socPct !== null && (input.socPct < 0 || input.socPct > 100)) {
    errors.push(socPozaZakresem(input.socPct))
  }
  return { errors }
}
