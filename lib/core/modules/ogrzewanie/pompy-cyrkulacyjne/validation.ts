import type { Warning } from "@/lib/core/calc-result"
import type { PompyCyrkulacyjneInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: PompyCyrkulacyjneInput): ValidationResult {
  const errors: Warning[] = []
  if (input.mocObecnejPompyW < 0) errors.push(wartoscUjemna("mocObecnejPompyW", input.mocObecnejPompyW))
  if (input.mocNowejPompyW < 0) errors.push(wartoscUjemna("mocNowejPompyW", input.mocNowejPompyW))
  if (input.godzinyPracyDobowoH < 0) errors.push(wartoscUjemna("godzinyPracyDobowoH", input.godzinyPracyDobowoH))
  if (input.godzinyPracyDobowoH > 24) {
    errors.push({
      code: "GODZINY-POZA-ZAKRESEM",
      level: "critical",
      i18nKey: "GODZINY-POZA-ZAKRESEM",
      technicalMessage: `godzinyPracyDobowoH=${input.godzinyPracyDobowoH} > 24`,
      field: "godzinyPracyDobowoH",
    })
  }
  return { errors }
}
