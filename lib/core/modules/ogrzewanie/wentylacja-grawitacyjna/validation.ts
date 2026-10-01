import type { Warning } from "@/lib/core/calc-result"
import { procentPozaZakresem, ujemneWartosci } from "../wspolne/walidacja"
import type { WentylacjaGrawitacyjnaInput } from "./input"

export function validateInput(input: WentylacjaGrawitacyjnaInput): { errors: Warning[] } {
  const errors = ujemneWartosci({
    kubaturaM3: input.kubaturaM3,
    wymianyNaDobe: input.wymianyNaDobe,
    stratyPozostaleW: input.stratyPozostaleW,
    dni: input.dni,
  })
  errors.push(...procentPozaZakresem("sprawnoscOdzyskuPct", input.sprawnoscOdzyskuPct))
  return { errors }
}
