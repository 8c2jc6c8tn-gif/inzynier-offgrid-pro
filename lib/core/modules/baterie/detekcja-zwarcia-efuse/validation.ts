import type { Warning } from "@/lib/core/calc-result"
import type { DetekcjaZwarciaEFuseInput } from "./input"
import { notPositive } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: DetekcjaZwarciaEFuseInput): ValidationResult {
  const errors: Warning[] = []
  if (input.napiecieBateriiV < 0) {
    errors.push(notPositive("napiecieBateriiV", "POLE-NAPIECIE-BATERII-L", input.napiecieBateriiV))
  }
  if (input.rezystancjaWewnetrznaOhm < 0) {
    errors.push(notPositive("rezystancjaWewnetrznaOhm", "POLE-REZYSTANCJA-WEWNETRZNA-L", input.rezystancjaWewnetrznaOhm))
  }
  if (input.zdolnoscLaczeniowaTranzystorowA < 0) {
    errors.push(
      notPositive("zdolnoscLaczeniowaTranzystorowA", "POLE-ZDOLNOSC-LACZENIOWA-TRANZYSTOROW-L", input.zdolnoscLaczeniowaTranzystorowA),
    )
  }
  return { errors }
}
