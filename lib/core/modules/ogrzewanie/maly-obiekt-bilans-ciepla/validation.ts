import type { Warning } from "@/lib/core/calc-result"
import type { MalyObiektCieplaInput } from "./input"
import { otworyWiekszeNizScianyMo, wartoscUjemnaMo, wymiarNiedodatniMo } from "./warnings"

export function validateInput(input: MalyObiektCieplaInput): Warning[] {
  const e: Warning[] = []
  for (const [pole, v] of [
    ["dlugoscM", input.dlugoscM],
    ["szerokoscM", input.szerokoscM],
    ["wysokoscM", input.wysokoscM],
  ] as const) {
    if (v !== null && v <= 0) e.push(wymiarNiedodatniMo(pole, v))
  }
  if (input.otworyM2 !== null && input.otworyM2 < 0) e.push(wartoscUjemnaMo("otworyM2", input.otworyM2))
  const { dlugoscM: l, szerokoscM: s, wysokoscM: h, otworyM2: o } = input
  if (l !== null && s !== null && h !== null && l > 0 && s > 0 && h > 0 && o !== null && o >= 0) {
    const sciany = 2 * (l + s) * h
    if (o >= sciany) e.push(otworyWiekszeNizScianyMo(o, sciany))
  }
  return e
}
