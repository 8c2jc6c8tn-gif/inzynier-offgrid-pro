import type { Warning } from "@/lib/core/calc-result"
import { copPonizejJednosci, procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { WentylacjaPorownanieInput } from "./input"

export function validateInput(input: WentylacjaPorownanieInput): { errors: Warning[] } {
  const errors = ujemneWartosci({
    strumienNaturalnyM3H: input.strumienNaturalnyM3H,
    strumienMechanicznyM3H: input.strumienMechanicznyM3H,
    mocWentylatorowW: input.mocWentylatorowW,
    dniSezonu: input.dniSezonu,
    cenaPraduZlKwh: input.cenaPraduZlKwh,
    doplataZl: input.doplataZl,
  })
  errors.push(...procentPozaZakresem("sprawnoscOdzyskuPct", input.sprawnoscOdzyskuPct))
  errors.push(...copPonizejJednosci("copOgrzewania", input.copOgrzewania))
  if (input.dniSezonu > 366) {
    errors.push({
      code: "WPOR-DNI-POZA-ZAKRESEM",
      level: "critical",
      i18nKey: "WPOR-DNI-POZA-ZAKRESEM",
      technicalMessage: `dniSezonu = ${input.dniSezonu} > 366`,
      field: "dniSezonu",
    })
  }
  return { errors }
}
