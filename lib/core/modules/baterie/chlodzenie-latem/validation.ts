import type { Warning } from "@/lib/core/calc-result"
import type { ChlodzenieLatemInput } from "./input"

const ZERO_BEZWZGLEDNE_C = -273.15

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: ChlodzenieLatemInput): ValidationResult {
  const errors: Warning[] = []
  if (input.temperaturaOgniwC !== null && input.temperaturaOgniwC < ZERO_BEZWZGLEDNE_C) {
    errors.push({
      code: "TEMPERATURA-PONIZEJ-ZERA-BEZWZGLEDNEGO",
      level: "critical",
      i18nKey: "TEMPERATURA-FIZYCZNIE-NIEMOZLIWA",
      technicalMessage: `temperaturaOgniwC = ${input.temperaturaOgniwC} < ${ZERO_BEZWZGLEDNE_C}`,
      field: "temperaturaOgniwC",
    })
  }
  return { errors }
}
