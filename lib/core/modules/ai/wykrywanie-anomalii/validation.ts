import type { Warning } from "@/lib/core/calc-result"
import type { WykrywanieAnomaliiInput } from "./input"
import { wartoscUjemna } from "./warnings"

export function validateInput(input: WykrywanieAnomaliiInput): Warning[] {
  const errors: Warning[] = []
  if (input.oczekiwanaKwh < 0) errors.push(wartoscUjemna("oczekiwanaKwh", input.oczekiwanaKwh))
  if (input.zmierzonaKwh < 0) errors.push(wartoscUjemna("zmierzonaKwh", input.zmierzonaKwh))
  if (input.progAlarmuPct !== null && input.progAlarmuPct < 0) errors.push(wartoscUjemna("progAlarmuPct", input.progAlarmuPct))
  return errors
}
