import type { Warning } from "@/lib/core/calc-result"
import type { OsadNaPvInput } from "./input"
import { poZakresem, wartoscUjemnaOsad } from "./warnings"

export function validateInput(input: OsadNaPvInput): { errors: Warning[] } {
  const errors: Warning[] = []
  const pola: Record<string, number | null> = {
    produkcjaDobaKwh: input.produkcjaDobaKwh,
    dniWlasne: input.dniWlasne,
    powierzchniaM2: input.powierzchniaM2,
    "kabel.mocWNaM2": input.kabel.mocWNaM2,
    "kabel.godziny": input.kabel.godziny,
    "folia.mocWNaM2": input.folia.mocWNaM2,
    "folia.godziny": input.folia.godziny,
    "automat.mocW": input.automat.mocW,
    "automat.godziny": input.automat.godziny,
  }
  for (const [pole, v] of Object.entries(pola)) if (v !== null && v < 0) errors.push(wartoscUjemnaOsad(pole, v))
  if (input.pozostalaWlasnaPct !== null && (input.pozostalaWlasnaPct < 0 || input.pozostalaWlasnaPct > 100)) {
    errors.push(poZakresem("pozostalaWlasnaPct", input.pozostalaWlasnaPct, 100))
  }
  if (input.katDeg !== null && (input.katDeg < 0 || input.katDeg > 90)) errors.push(poZakresem("katDeg", input.katDeg, 90))
  return { errors }
}
