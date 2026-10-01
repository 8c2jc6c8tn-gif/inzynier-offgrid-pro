import type { Warning } from "@/lib/core/calc-result"
import { ujemneWartosci } from "../wspolne/walidacja"
import type { GrzalkaCwuInput } from "./input"

export function validateInput(input: GrzalkaCwuInput): { errors: Warning[] } {
  const errors = ujemneWartosci({
    pojemnoscL: input.pojemnoscL,
    mocGrzalkiKw: input.mocGrzalkiKw,
    mocPvKw: input.mocPvKw,
    mocFalownikaKw: input.mocFalownikaKw,
  })
  if (input.tStartC !== null && input.tKoniecC !== null && input.tKoniecC <= input.tStartC) {
    errors.push({
      code: "GRZ-TEMPERATURA-POZA-ZAKRESEM",
      level: "critical",
      i18nKey: "GRZ-TEMPERATURA-POZA-ZAKRESEM",
      technicalMessage: `tKoniecC = ${input.tKoniecC} <= tStartC = ${input.tStartC}`,
      field: "tKoniecC",
    })
  }
  return { errors }
}
