import type { Warning } from "@/lib/core/calc-result"
import { copPonizejJednosci, godzinyPozaDoba, ujemneWartosci } from "../wspolne/walidacja"
import type { SterowanieStrefoweInput } from "./input"

export function validateInput(input: SterowanieStrefoweInput): { errors: Warning[] } {
  const errors = ujemneWartosci({
    liczbaSilownikow: input.liczbaSilownikow,
    mocSilownikaW: input.mocSilownikaW,
    mocSterownikowW: input.mocSterownikowW,
  })
  errors.push(...godzinyPozaDoba("godzinPracySilownikow", input.godzinPracySilownikow))
  errors.push(...copPonizejJednosci("copOgrzewania", input.copOgrzewania))
  input.strefy.forEach((s, i) => {
    errors.push(...ujemneWartosci({ [`strefy[${i}].hWK`]: s.hWK }))
    errors.push(...godzinyPozaDoba(`strefy[${i}].godzinObnizenia`, s.godzinObnizenia))
    if (s.tKomfortC !== null && s.tObnizonaC !== null && s.tObnizonaC > s.tKomfortC) {
      errors.push({
        code: "STREF-OBNIZONA-POZA-ZAKRESEM",
        level: "critical",
        i18nKey: "STREF-OBNIZONA-POZA-ZAKRESEM",
        params: { n: i + 1 },
        technicalMessage: `strefy[${i}]: tObnizonaC = ${s.tObnizonaC} > tKomfortC = ${s.tKomfortC}`,
        field: `strefy[${i}].tObnizonaC`,
      })
    }
  })
  return { errors }
}
