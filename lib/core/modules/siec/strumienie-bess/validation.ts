import type { Warning } from "@/lib/core/calc-result"
import { wartoscUjemna } from "../rachunek-za-prad/warnings"
import type { StrumienieBessInput } from "./input"
import { mocowaPonadPrzeplyw } from "./warnings"

export function validateInput(input: StrumienieBessInput): Warning[] {
  const errors: Warning[] = []
  const pola = {
    kosztCykluZlKwh: input.kosztCykluZlKwh,
    cenaMagazynuZl: input.cenaMagazynuZl,
    autokonsumpcjaKwhRok: input.autokonsumpcjaKwhRok,
    autokonsumpcjaZyskZlKwh: input.autokonsumpcjaZyskZlKwh,
    arbitrazKwhRok: input.arbitrazKwhRok,
    arbitrazZyskZlKwh: input.arbitrazZyskZlKwh,
    mocowaKwhRok: input.mocowaKwhRok,
    mocUmownaZlRok: input.mocUmownaZlRok,
  }
  for (const [pole, v] of Object.entries(pola)) if (v !== null && v < 0) errors.push(wartoscUjemna(pole, v))
  const przeplyw = input.autokonsumpcjaKwhRok + input.arbitrazKwhRok
  if (errors.length === 0 && input.mocowaKwhRok > przeplyw) errors.push(mocowaPonadPrzeplyw(input.mocowaKwhRok, przeplyw))
  return errors
}
