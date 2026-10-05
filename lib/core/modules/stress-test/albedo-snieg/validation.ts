import type { Warning } from "@/lib/core/calc-result"
import type { AlbedoSniegInput } from "./input"
import { wartoscUjemnaAlbedo } from "./warnings"

export function validateInput(input: AlbedoSniegInput): { errors: Warning[] } {
  const errors: Warning[] = []
  const nieujemne: Record<string, number> = { produkcjaOkresKwh: input.produkcjaOkresKwh }
  if (input.zyskPct !== null) nieujemne.zyskPct = input.zyskPct
  for (const [pole, v] of Object.entries(nieujemne)) if (!Number.isFinite(v) || v < 0) errors.push(wartoscUjemnaAlbedo(pole, v))
  return { errors }
}
