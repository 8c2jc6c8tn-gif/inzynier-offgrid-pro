import type { Warning } from "@/lib/core/calc-result"
import type { ObciazenieDachuSniegiemInput } from "./input"
import { katPozaZakresem, wartoscUjemna } from "./warnings"

export function validateInput(input: ObciazenieDachuSniegiemInput): { errors: Warning[] } {
  const errors: Warning[] = []
  if (input.katDachuDeg !== null && (input.katDachuDeg < 0 || input.katDachuDeg > 90)) {
    errors.push(katPozaZakresem(input.katDachuDeg))
  }
  if (input.nosnoscDachuKnM2 < 0) {
    errors.push(wartoscUjemna("nosnoscDachuKnM2", "Nośność dachu", input.nosnoscDachuKnM2))
  }
  if (input.gruboscWarstwyCm < 0) {
    errors.push(wartoscUjemna("gruboscWarstwyCm", "Grubość warstwy śniegu", input.gruboscWarstwyCm))
  }
  return { errors }
}
