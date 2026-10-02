import type { Warning } from "@/lib/core/calc-result"
import { copPonizejJednosci, ujemneWartosci } from "../wspolne/walidacja"
import type { CwuPompaCieplaInput } from "./input"

export function validateInput(input: CwuPompaCieplaInput): { errors: Warning[] } {
  const errors = [
    ...ujemneWartosci({
      pojemnoscL: input.pojemnoscL,
      mocCieplnaPompyKw: input.mocCieplnaPompyKw,
      mocGrzalkiKw: input.mocGrzalkiKw,
      mocPvKw: input.mocPvKw,
    }),
    ...copPonizejJednosci("copCwu", input.copCwu),
  ]
  // Same rule and code as Screen 18 itself (the temperatures are its fields).
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
