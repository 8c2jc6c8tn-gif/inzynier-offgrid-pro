import type { Warning } from "@/lib/core/calc-result"
import type { MocBiernaInput } from "./input"
import { wartoscUjemna } from "../rachunek-za-prad/warnings"
import { tgFi0PonizejMinimum } from "./warnings"

export function validateInput(input: MocBiernaInput, tgFi0Min: number): Warning[] {
  const errors: Warning[] = []
  if (input.tgFi0 < tgFi0Min) errors.push(tgFi0PonizejMinimum(input.tgFi0, tgFi0Min))
  const liczby: [string, number | null][] = [
    ["tgFi", input.tgFi],
    ["energiaCzynnaKwh", input.energiaCzynnaKwh],
    ["cRkZlKwh", input.cRkZlKwh],
    ["energiaPojemnosciowaKvarh", input.energiaPojemnosciowaKvarh],
    ["mocCzynnaSredniaKw", input.mocCzynnaSredniaKw],
    ["tgFiCel", input.tgFiCel],
    ["kosztBateriiZl", input.kosztBateriiZl],
  ]
  for (const [pole, v] of liczby) if (v !== null && v < 0) errors.push(wartoscUjemna(pole, v))
  return errors
}
