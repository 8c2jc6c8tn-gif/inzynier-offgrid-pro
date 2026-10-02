import type { Warning } from "@/lib/core/calc-result"
import { copPonizejJednosci, godzinyPozaDoba, procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { CykleOdszranianiaInput } from "./input"
import { defrostDluzszyNizOdstep } from "./warnings"

export function validateInput(input: CykleOdszranianiaInput): { errors: Warning[] } {
  const errors = ujemneWartosci({
    odstepMin: input.odstepMin,
    czasDefrostuMin: input.czasDefrostuMin,
    mocDefrostuKw: input.mocDefrostuKw,
    mocBazowaKw: input.mocBazowaKw,
  })
  errors.push(...procentPozaZakresem("wilgotnoscPct", input.wilgotnoscPct))
  errors.push(...godzinyPozaDoba("godzinySzronieniaH", input.godzinySzronieniaH))
  errors.push(...copPonizejJednosci("copKatalogowy", input.copKatalogowy))
  if (input.odstepMin > 0 && input.czasDefrostuMin >= input.odstepMin) {
    errors.push(defrostDluzszyNizOdstep(input.czasDefrostuMin, input.odstepMin))
  }
  return { errors }
}
