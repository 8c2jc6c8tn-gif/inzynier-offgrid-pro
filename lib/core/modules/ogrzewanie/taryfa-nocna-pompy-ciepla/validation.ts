import type { Warning } from "@/lib/core/calc-result"
import { copPonizejJednosci, godzinyPozaDoba, ujemneWartosci } from "../wspolne/walidacja"
import type { TaryfaNocnaPompyCieplaInput } from "./input"

/** Form-level checks: no negative numbers, the night zone within a day, COP not below 1. */
export function validateInput(input: TaryfaNocnaPompyCieplaInput): Warning[] {
  return [
    ...ujemneWartosci({
      cieploDobaKwh: input.cieploDobaKwh,
      cenaDzienZlKwh: input.cenaDzienZlKwh,
      cenaNocZlKwh: input.cenaNocZlKwh,
      pojemnoscBuforaL: input.pojemnoscBuforaL,
      deltaTBuforaK: input.deltaTBuforaK,
    }),
    ...godzinyPozaDoba("godzinyNocH", input.godzinyNocH),
    ...copPonizejJednosci("copDzien", input.copDzien),
    ...copPonizejJednosci("copNoc", input.copNoc),
  ]
}
