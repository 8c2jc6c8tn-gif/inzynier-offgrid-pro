import type { Warning } from "@/lib/core/calc-result"
import type { GrzalkiDachoweInput } from "./input"
import { godzinyPonadDobe, wartoscUjemna } from "./warnings"

const ETYKIETY: Record<Exclude<keyof GrzalkiDachoweInput, "godzinyPracyNaDobe">, string> = {
  dlugoscKablaM: "POLE-DLUGOSC-KABLA",
  mocNaMetrW: "POLE-MOC-KABLA-NA-METR",
  mocPompyCieplaW: "POLE-MOC-POMPY-CIEPLA",
  zapasMocyW: "POLE-ZAPAS-MOCY",
}

export function validateInput(input: GrzalkiDachoweInput): { errors: Warning[] } {
  const errors: Warning[] = []
  for (const [pole, etykieta] of Object.entries(ETYKIETY) as [keyof typeof ETYKIETY, string][]) {
    const v = input[pole]
    if (v !== null && v < 0) errors.push(wartoscUjemna(pole, etykieta, v))
  }
  const h = input.godzinyPracyNaDobe
  if (h !== null && (h < 0 || h > 24)) errors.push(godzinyPonadDobe(h))
  return { errors }
}
