import type { Warning } from "@/lib/core/calc-result"
import { copPonizejJednosci, ujemneWartosci } from "../wspolne/walidacja"
import type { DystrybucjaCieplaInput } from "./input"

export function validateInput(input: DystrybucjaCieplaInput): { errors: Warning[] } {
  const errors = ujemneWartosci({
    cieploRocznieKwh: input.cieploRocznieKwh,
    doplataZl: input.doplataZl,
    cenaPraduZlKwh: input.cenaPraduZlKwh,
  })
  errors.push(...copPonizejJednosci("copSystemu", input.copSystemu), ...copPonizejJednosci("copOdniesienia", input.copOdniesienia))
  return { errors }
}
