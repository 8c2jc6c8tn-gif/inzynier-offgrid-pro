import type { Warning } from "@/lib/core/calc-result"
import type { PozycjonowanieOgniwInput } from "./input"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: PozycjonowanieOgniwInput): ValidationResult {
  const errors: Warning[] = []
  if (input.dociskKgf < 0) {
    errors.push({
      code: "DOCISK-UJEMNY",
      level: "critical",
      message: "Docisk nie może być ujemny.",
      technicalMessage: `dociskKgf = ${input.dociskKgf}, oczekiwano >= 0`,
      field: "dociskKgf",
    })
  }
  return { errors }
}
