import type { Warning } from "@/lib/core/calc-result"
import { godzinyPozaDoba, ujemneWartosci } from "../wspolne/walidacja"
import type { ZasobnikCwuInput } from "./input"

export function validateInput(input: ZasobnikCwuInput): { errors: Warning[] } {
  const errors = ujemneWartosci({
    osoby: input.osoby,
    litrowNaOsobe: input.litrowNaOsobe,
    pojemnoscL: input.pojemnoscL,
    uaWK: input.uaWK,
    uaPorownawczyWK: input.uaPorownawczyWK,
    dlugoscCyrkulacjiM: input.dlugoscCyrkulacjiM,
    strataRuryWmK: input.strataRuryWmK,
    mocPompyW: input.mocPompyW,
  })
  errors.push(...godzinyPozaDoba("godzinCyrkulacji", input.godzinCyrkulacji))
  if (input.tZimnaC !== null && input.tCwuC !== null && input.tCwuC <= input.tZimnaC) {
    errors.push({
      code: "ZAS-CWU-POZA-ZAKRESEM",
      level: "critical",
      i18nKey: "ZAS-CWU-POZA-ZAKRESEM",
      technicalMessage: `tCwuC = ${input.tCwuC} <= tZimnaC = ${input.tZimnaC}`,
      field: "tCwuC",
    })
  }
  return { errors }
}
