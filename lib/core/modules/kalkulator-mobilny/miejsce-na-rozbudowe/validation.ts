import type { Warning } from "@/lib/core/calc-result"
import type { MiejsceNaRozbudoweInput } from "./input"
import { liczbaNiecalkowita, wartoscNiedodatnia, wartoscUjemna } from "./warnings"

export function validateInput(i: MiejsceNaRozbudoweInput): Warning[] {
  const e: Warning[] = []
  const wymiary: [string, number | null][] = [
    ["miejsceDlugoscMm", i.miejsceDlugoscMm],
    ["miejsceSzerokoscMm", i.miejsceSzerokoscMm],
    ["miejsceWysokoscMm", i.miejsceWysokoscMm],
    ["elementDlugoscMm", i.elementDlugoscMm],
    ["elementSzerokoscMm", i.elementSzerokoscMm],
    ["elementWysokoscMm", i.elementWysokoscMm],
  ]
  for (const [pole, v] of wymiary) {
    if (v === null) continue
    if (!Number.isFinite(v) || v < 0) e.push(wartoscUjemna(pole, v))
    else if (v === 0) e.push(wartoscNiedodatnia(pole, v))
  }
  for (const [pole, v] of [["odstepMiedzyMm", i.odstepMiedzyMm], ["marginesPrzyScianieMm", i.marginesPrzyScianieMm]] as const) {
    if (v !== null && (!Number.isFinite(v) || v < 0)) e.push(wartoscUjemna(pole, v))
  }
  if (i.planowanaLiczba !== null) {
    if (!Number.isFinite(i.planowanaLiczba) || i.planowanaLiczba < 0) e.push(wartoscUjemna("planowanaLiczba", i.planowanaLiczba))
    else if (!Number.isInteger(i.planowanaLiczba) || i.planowanaLiczba === 0) e.push(liczbaNiecalkowita(i.planowanaLiczba))
  }
  return e
}
