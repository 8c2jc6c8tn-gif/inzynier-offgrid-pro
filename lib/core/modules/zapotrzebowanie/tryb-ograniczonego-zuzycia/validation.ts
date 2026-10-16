import type { Warning } from "@/lib/core/calc-result"
import type { TrybOgraniczonegoZuzyciaInput } from "./input"
import { godzinyPozaZakresemTo, wartoscNiedodatniaTo, zuzycieUjemneTo } from "./warnings"

export function validateInput(input: TrybOgraniczonegoZuzyciaInput): Warning[] {
  const e: Warning[] = []
  for (const o of input.odbiorniki) if (!Number.isFinite(o.zuzycieDobaWh) || o.zuzycieDobaWh < 0) e.push(zuzycieUjemneTo(o.nazwa))
  if (input.tryb === "wyjazd" && input.dniNieobecnosci !== null && !(input.dniNieobecnosci > 0)) e.push(wartoscNiedodatniaTo("dniNieobecnosci", input.dniNieobecnosci))
  if (input.tryb === "noc" && input.godzinNocy !== null && !(input.godzinNocy > 0 && input.godzinNocy <= 24)) e.push(godzinyPozaZakresemTo(input.godzinNocy))
  if (input.pojemnoscUzytecznaKwh !== null && !(input.pojemnoscUzytecznaKwh > 0)) e.push(wartoscNiedodatniaTo("pojemnoscUzytecznaKwh", input.pojemnoscUzytecznaKwh))
  return e
}
