import type { Warning } from "@/lib/core/calc-result"
import type { PorownanieTaryfInput } from "./input"
import { grupaPowtorzona } from "./warnings"

export function validateInput(input: PorownanieTaryfInput): Warning[] {
  const errors: Warning[] = []
  const widziane = new Set<string>()
  for (const w of input.warianty) {
    if (widziane.has(w.grupa)) errors.push(grupaPowtorzona(w.grupa))
    widziane.add(w.grupa)
  }
  return errors
}
