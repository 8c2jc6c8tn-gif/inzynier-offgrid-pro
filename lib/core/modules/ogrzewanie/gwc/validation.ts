import type { Warning } from "@/lib/core/calc-result"
import { copPonizejJednosci, godzinyPozaDoba, procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { GwcInput } from "./input"

export function validateInput(input: GwcInput): { errors: Warning[] } {
  const errors = ujemneWartosci({
    strumienM3H: input.strumienM3H,
    przyrostTempK: input.przyrostTempK,
    zapotrzebowanieDobaKwh: input.zapotrzebowanieDobaKwh,
  })
  errors.push(...godzinyPozaDoba("godzinyPracyH", input.godzinyPracyH))
  errors.push(...procentPozaZakresem("sprawnoscRekuperatoraPct", input.sprawnoscRekuperatoraPct))
  errors.push(...copPonizejJednosci("cop", input.cop))
  return { errors }
}
