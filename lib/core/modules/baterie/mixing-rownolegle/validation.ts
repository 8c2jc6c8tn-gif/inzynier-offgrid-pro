import type { Warning } from "@/lib/core/calc-result"
import type { MixingRownoleglInput } from "./input"
import { wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: MixingRownoleglInput): ValidationResult {
  const errors: Warning[] = []
  if (input.napiecieNominalneV1 < 0) {
    errors.push(wartoscUjemna("napiecieNominalneV1", "Napięcie nominalne — bateria 1", input.napiecieNominalneV1))
  }
  if (input.napiecieNominalneV2 < 0) {
    errors.push(wartoscUjemna("napiecieNominalneV2", "Napięcie nominalne — bateria 2", input.napiecieNominalneV2))
  }
  if (input.rezystancjaWewnetrznaMOhm1 < 0) {
    errors.push(
      wartoscUjemna("rezystancjaWewnetrznaMOhm1", "Rezystancja wewnętrzna — bateria 1", input.rezystancjaWewnetrznaMOhm1),
    )
  }
  if (input.rezystancjaWewnetrznaMOhm2 < 0) {
    errors.push(
      wartoscUjemna("rezystancjaWewnetrznaMOhm2", "Rezystancja wewnętrzna — bateria 2", input.rezystancjaWewnetrznaMOhm2),
    )
  }
  return { errors }
}
