import type { Warning } from "@/lib/core/calc-result"
import type { AwaryjneZrodloCieplaInput } from "./input"
import { godzinyPozaDoba, mocDoWodyWiekszaNizMoc, sprawnoscPozaZakresem, wartoscUjemna } from "./warnings"

const ETYKIETY = {
  mocKw: "POLE-MOC-CIEPLNA",
  mocDoWodyKw: "POLE-MOC-DO-WODY",
  zapotrzebowanieCieplaKwhDoba: "POLE-ZAPOTRZEBOWANIE-NA-CIEPLO",
  wartoscOpalowaKwhKg: "POLE-WARTOSC-OPALOWA",
} as const

export function validateInput(input: AwaryjneZrodloCieplaInput): { errors: Warning[] } {
  const errors: Warning[] = []
  for (const [pole, etykieta] of Object.entries(ETYKIETY) as [keyof typeof ETYKIETY, string][]) {
    const v = input[pole]
    if (v !== null && v < 0) errors.push(wartoscUjemna(pole, etykieta, v))
  }
  const h = input.godzinyPaleniaNaDobe
  if (h !== null && (h < 0 || h > 24)) errors.push(godzinyPozaDoba(h))
  const s = input.sprawnoscProc
  if (s !== null && (s <= 0 || s > 100)) errors.push(sprawnoscPozaZakresem(s))
  if (input.plaszczWodny && input.mocDoWodyKw !== null && input.mocKw !== null && input.mocDoWodyKw > input.mocKw) {
    errors.push(mocDoWodyWiekszaNizMoc(input.mocDoWodyKw, input.mocKw))
  }
  return { errors }
}
