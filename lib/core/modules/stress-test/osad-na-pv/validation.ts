import type { Warning } from "@/lib/core/calc-result"
import type { OsadNaPvInput } from "./input"
import { poZakresem, wartoscUjemnaOsad } from "./warnings"

export function validateInput(input: OsadNaPvInput): { errors: Warning[] } {
  const errors: Warning[] = []
  for (const [pole, v] of Object.entries({ produkcjaDobaKwh: input.produkcjaDobaKwh, dniZalegania: input.dniZalegania })) {
    if (v < 0) errors.push(wartoscUjemnaOsad(pole, v))
  }
  if (input.pozostalaProdukcjaPct < 0 || input.pozostalaProdukcjaPct > 100) {
    errors.push(poZakresem("pozostalaProdukcjaPct", input.pozostalaProdukcjaPct, 100))
  }
  if (input.katDeg !== null && (input.katDeg < 0 || input.katDeg > 90)) errors.push(poZakresem("katDeg", input.katDeg, 90))
  return { errors }
}
