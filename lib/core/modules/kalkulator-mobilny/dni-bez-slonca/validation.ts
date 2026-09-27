import type { Warning } from "@/lib/core/calc-result"
import type { DniBezSloncaInput } from "./input"
import { dodPozaZakresem, sprawnoscPozaZakresem, wartoscUjemna } from "./warnings"

export type ValidationResult = {
  errors: Warning[]
}

export function validateInput(input: DniBezSloncaInput): ValidationResult {
  const errors: Warning[] = []
  if (input.pojemnoscAh < 0) errors.push(wartoscUjemna("pojemnoscAh", "Pojemność akumulatora", input.pojemnoscAh))
  if (input.napiecieV < 0) errors.push(wartoscUjemna("napiecieV", "Napięcie akumulatora", input.napiecieV))
  if (input.zuzycieDoboweWh < 0) errors.push(wartoscUjemna("zuzycieDoboweWh", "Zużycie na dobę", input.zuzycieDoboweWh))
  if (input.dodPct < 0 || input.dodPct > 100) errors.push(dodPozaZakresem(input.dodPct))
  if (input.sprawnoscPct < 0 || input.sprawnoscPct > 100) errors.push(sprawnoscPozaZakresem(input.sprawnoscPct))
  return { errors }
}
