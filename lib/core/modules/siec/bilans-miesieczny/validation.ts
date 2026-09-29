import type { Warning } from "@/lib/core/calc-result"
import type { BilansMiesiecznyInput } from "./input"
import { wartoscUjemna } from "../rachunek-za-prad/warnings"
import { tablicaNie12, udzialPozaZakresem } from "./warnings"

const zle12 = (t: number[]) => t.length !== 12 || t.some((v) => !(v >= 0))

export function validateInput(input: BilansMiesiecznyInput): Warning[] {
  const errors: Warning[] = []
  if (zle12(input.zuzycieMiesieczneKwh)) errors.push(tablicaNie12("zuzycieMiesieczneKwh", input.zuzycieMiesieczneKwh.length))
  if (zle12(input.uzyskMiesiecznyKwhNaKwp)) {
    errors.push(tablicaNie12("uzyskMiesiecznyKwhNaKwp", input.uzyskMiesiecznyKwhNaKwp.length))
  }
  if (input.mocPvKwp < 0) errors.push(wartoscUjemna("mocPvKwp", input.mocPvKwp))
  if (input.pojemnoscMagazynuKwh < 0) errors.push(wartoscUjemna("pojemnoscMagazynuKwh", input.pojemnoscMagazynuKwh))
  const a = input.autokonsumpcjaBezposrednia
  if (a !== null && !(a > 0 && a <= 1)) errors.push(udzialPozaZakresem("autokonsumpcjaBezposrednia"))
  const eta = input.sprawnoscMagazynu
  if (eta !== null && !(eta > 0 && eta <= 1)) errors.push(udzialPozaZakresem("sprawnoscMagazynu"))
  return errors
}
