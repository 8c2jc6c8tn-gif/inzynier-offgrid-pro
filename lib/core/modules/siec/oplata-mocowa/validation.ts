import type { Warning } from "@/lib/core/calc-result"
import type { OplataMocowaInput } from "./input"
import { energiaMocowaPonadZuzycie, wartoscUjemna } from "../rachunek-za-prad/warnings"
import { przesunieciePozaZakresem } from "./warnings"

export function validateInput(input: OplataMocowaInput): Warning[] {
  const errors: Warning[] = []
  if (input.energiaRocznaKwh < 0) errors.push(wartoscUjemna("energiaRocznaKwh", input.energiaRocznaKwh))
  if (input.energiaWGodzinachKwh !== null) {
    if (input.energiaWGodzinachKwh < 0) errors.push(wartoscUjemna("energiaWGodzinachKwh", input.energiaWGodzinachKwh))
    else if (input.energiaRocznaKwh > 0 && input.energiaWGodzinachKwh > input.energiaRocznaKwh) {
      errors.push(energiaMocowaPonadZuzycie(input.energiaWGodzinachKwh, input.energiaRocznaKwh))
    }
  }
  if (input.przesuniecieProcent < 0 || input.przesuniecieProcent > 100) errors.push(przesunieciePozaZakresem(input.przesuniecieProcent))
  if (input.stawkaWlasnaZlKwh !== undefined && input.stawkaWlasnaZlKwh < 0) {
    errors.push(wartoscUjemna("stawkaWlasnaZlKwh", input.stawkaWlasnaZlKwh))
  }
  return errors
}
