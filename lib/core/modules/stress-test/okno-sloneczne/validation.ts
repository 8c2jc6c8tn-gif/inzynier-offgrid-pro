import type { Warning } from "@/lib/core/calc-result"
import type { OknoSloneczneInput } from "./input"
import { socPozaZakresem, wartoscUjemnaOkno } from "./warnings"

export function validateInput(input: OknoSloneczneInput): { errors: Warning[] } {
  const errors: Warning[] = []
  const pola = {
    energiaOknaKwh: input.energiaOknaKwh,
    zuzycieWOknieKwh: input.zuzycieWOknieKwh,
    pojemnoscBateriiKwh: input.pojemnoscBateriiKwh,
    grzalkiBmsKwh: input.grzalkiBmsKwh,
    bojlerL: input.bojlerL,
  }
  for (const [pole, v] of Object.entries(pola)) if (v < 0) errors.push(wartoscUjemnaOkno(pole, v))
  if (input.socStartPct !== null && (input.socStartPct < 0 || input.socStartPct > 100)) errors.push(socPozaZakresem(input.socStartPct))
  return { errors }
}
